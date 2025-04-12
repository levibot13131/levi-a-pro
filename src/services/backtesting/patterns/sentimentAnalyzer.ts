
import { getLatestNews, getSocialPosts } from '@/services/mockNewsService';

// Analyze sentiment for a given asset
export const analyzeSentiment = async (assetId: string): Promise<{
  sentiment: 'bullish' | 'bearish' | 'neutral';
  confidence: number;
  sources: string[];
}> => {
  try {
    // Get latest news and social posts (mocked)
    const latestNews = await getLatestNews(10);
    const socialPosts = await getSocialPosts(10);
    
    // Filter content related to the asset
    const relevantNews = latestNews.filter(news => 
      news.relatedAssets?.includes(assetId) || 
      news.title.toLowerCase().includes(assetId.toLowerCase()) ||
      news.summary.toLowerCase().includes(assetId.toLowerCase())
    );
    
    const relevantPosts = socialPosts.filter(post =>
      post.content.toLowerCase().includes(assetId.toLowerCase())
    );
    
    // Count sentiments
    const sentiments = {
      positive: relevantNews.filter(n => n.sentiment === 'positive').length + 
                relevantPosts.filter(p => p.sentiment === 'positive').length,
      negative: relevantNews.filter(n => n.sentiment === 'negative').length + 
                relevantPosts.filter(p => p.sentiment === 'negative').length,
      neutral: relevantNews.filter(n => n.sentiment === 'neutral').length + 
               relevantPosts.filter(p => p.sentiment === 'neutral').length
    };
    
    // Calculate total
    const total = sentiments.positive + sentiments.negative + sentiments.neutral;
    
    // Default to neutral if no data
    if (total === 0) {
      return {
        sentiment: 'neutral',
        confidence: 0,
        sources: []
      };
    }
    
    // Calculate sentiment score (-1 to 1)
    const score = (sentiments.positive - sentiments.negative) / total;
    
    // Determine sentiment type
    let sentiment: 'bullish' | 'bearish' | 'neutral';
    if (score > 0.2) sentiment = 'bullish';
    else if (score < -0.2) sentiment = 'bearish';
    else sentiment = 'neutral';
    
    // Calculate confidence (0-100%)
    const confidence = Math.min(100, Math.abs(score) * 100 + (total / 10));
    
    // Gather sources
    const sources = Array.from(new Set([
      ...relevantNews.map(n => n.source),
      ...relevantPosts.map(p => p.author)
    ])).slice(0, 5);
    
    return {
      sentiment,
      confidence,
      sources
    };
  } catch (error) {
    console.error('Error analyzing sentiment:', error);
    return {
      sentiment: 'neutral',
      confidence: 0,
      sources: []
    };
  }
};
