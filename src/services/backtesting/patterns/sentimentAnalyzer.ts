
import { TradeSignal, PricePoint, NewsItem, SocialPost } from "@/types/asset";
import { getLatestNews, getSocialPosts } from "@/services/mockNewsService";

/**
 * Analyzes market sentiment from news and social media
 */
export const analyzeSentiment = async (assetId?: string): Promise<{
  overallSentiment: 'bullish' | 'bearish' | 'neutral';
  sentimentScore: number; // -100 to 100
  keyInfluencers: string[];
  topBullishSources: string[];
  topBearishSources: string[];
  recentShift: boolean;
  recentShiftDirection?: 'bullish' | 'bearish';
}> => {
  try {
    // Get news and social posts
    const news = await getLatestNews();
    const socialPosts = await getSocialPosts();
    
    // Filter by asset if provided
    const filteredNews = assetId 
      ? news.filter(item => item.relatedAssets?.includes(assetId))
      : news;
      
    const filteredPosts = assetId
      ? socialPosts.filter(post => post.relatedAssets?.includes(assetId))
      : socialPosts;
    
    // Calculate sentiment scores
    let sentimentScore = 0;
    let bullishCount = 0;
    let bearishCount = 0;
    let neutralCount = 0;
    
    // Process news sentiment
    filteredNews.forEach(item => {
      if (item.sentiment === 'positive') {
        sentimentScore += 5;
        bullishCount++;
      } else if (item.sentiment === 'negative') {
        sentimentScore -= 5;
        bearishCount++;
      } else {
        neutralCount++;
      }
    });
    
    // Process social posts sentiment with different weighting based on engagement
    filteredPosts.forEach(post => {
      // Calculate engagement score
      const engagementScore = Math.min(
        10,
        1 + Math.log(
          1 + ((post.likes || 0) + (post.comments || 0) * 2 + (post.shares || 0) * 3) / 1000
        )
      );
      
      if (post.sentiment === 'positive') {
        sentimentScore += engagementScore;
        bullishCount++;
      } else if (post.sentiment === 'negative') {
        sentimentScore -= engagementScore;
        bearishCount++;
      } else {
        neutralCount++;
      }
    });
    
    // Normalize score to -100 to 100 range
    const totalItems = filteredNews.length + filteredPosts.length;
    sentimentScore = Math.max(-100, Math.min(100, (sentimentScore / (totalItems || 1)) * 20));
    
    // Determine overall sentiment
    let overallSentiment: 'bullish' | 'bearish' | 'neutral';
    if (sentimentScore > 15) {
      overallSentiment = 'bullish';
    } else if (sentimentScore < -15) {
      overallSentiment = 'bearish';
    } else {
      overallSentiment = 'neutral';
    }
    
    // Find key influencers (people with high engagement)
    const keyInfluencers = filteredPosts
      .filter(post => (post.likes || 0) > 5000)
      .map(post => post.author)
      .filter((author, index, self) => self.indexOf(author) === index)
      .slice(0, 5);
      
    // Find top bullish and bearish sources
    const bullishSources = filteredNews
      .filter(item => item.sentiment === 'positive')
      .map(item => item.source)
      .filter((source, index, self) => self.indexOf(source) === index)
      .slice(0, 3);
      
    const bearishSources = filteredNews
      .filter(item => item.sentiment === 'negative')
      .map(item => item.source)
      .filter((source, index, self) => self.indexOf(source) === index)
      .slice(0, 3);
    
    // Check for recent sentiment shifts (comparing newest 25% to the rest)
    const recentShift = false; // This would use timestamps in a real implementation
    const recentShiftDirection = undefined;
    
    return {
      overallSentiment,
      sentimentScore,
      keyInfluencers,
      topBullishSources: bullishSources,
      topBearishSources: bearishSources,
      recentShift,
      recentShiftDirection
    };
  } catch (error) {
    console.error("Error analyzing sentiment:", error);
    return {
      overallSentiment: 'neutral',
      sentimentScore: 0,
      keyInfluencers: [],
      topBullishSources: [],
      topBearishSources: [],
      recentShift: false
    };
  }
};

/**
 * Generates trading signals based on sentiment analysis
 */
export const generateSentimentSignals = async (
  priceData: PricePoint[], 
  assetId: string
): Promise<TradeSignal[]> => {
  if (!priceData || priceData.length < 5) {
    return [];
  }
  
  try {
    const analysis = await analyzeSentiment(assetId);
    const signals: TradeSignal[] = [];
    const latestPrice = priceData[priceData.length - 1];
    
    // Only generate signals if sentiment is strong enough
    if (Math.abs(analysis.sentimentScore) > 40) {
      const type = analysis.overallSentiment === 'bullish' ? 'buy' : 'sell';
      const strength = Math.abs(analysis.sentimentScore) > 70 ? 'strong' : 'medium';
      
      signals.push({
        id: `sentiment-${assetId}-${Date.now()}`,
        assetId,
        type,
        price: latestPrice.price,
        timestamp: Date.now(),
        strength,
        strategy: 'Sentiment Analysis',
        timeframe: '1d',
        targetPrice: type === 'buy' 
          ? latestPrice.price * 1.05 
          : latestPrice.price * 0.95,
        stopLoss: type === 'buy' 
          ? latestPrice.price * 0.98 
          : latestPrice.price * 1.02,
        riskRewardRatio: 2.5,
        notes: `Signal based on strong ${analysis.overallSentiment} sentiment (${analysis.sentimentScore.toFixed(1)}) from market news and social media.`
      });
    }
    
    // Add signals for significant sentiment shifts
    if (analysis.recentShift && analysis.recentShiftDirection) {
      signals.push({
        id: `sentiment-shift-${assetId}-${Date.now()}`,
        assetId,
        type: analysis.recentShiftDirection === 'bullish' ? 'buy' : 'sell',
        price: latestPrice.price,
        timestamp: Date.now(),
        strength: 'medium',
        strategy: 'Sentiment Shift',
        timeframe: '4h',
        targetPrice: analysis.recentShiftDirection === 'bullish' 
          ? latestPrice.price * 1.03 
          : latestPrice.price * 0.97,
        stopLoss: analysis.recentShiftDirection === 'bullish' 
          ? latestPrice.price * 0.985 
          : latestPrice.price * 1.015,
        riskRewardRatio: 2,
        notes: `Signal based on recent shift to ${analysis.recentShiftDirection} sentiment in market discussions.`
      });
    }
    
    return signals;
  } catch (error) {
    console.error("Error generating sentiment signals:", error);
    return [];
  }
};
