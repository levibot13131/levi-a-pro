
import { toast } from 'sonner';
import { getNewsByAssetId, getSocialPostsByAssetId } from '@/services/mockNewsService';

/**
 * Analyzes sentiment for a specific asset
 */
export const analyzeSentiment = async (assetId: string) => {
  try {
    // Fetch news and social posts for the asset
    const [news, socialPosts] = await Promise.all([
      getNewsByAssetId(assetId),
      getSocialPostsByAssetId(assetId)
    ]);
    
    // Perform sentiment analysis (mock implementation)
    // In a real application, this would use NLP or call an API
    
    // Count positive, negative and neutral mentions
    const positiveNews = news.filter(n => n.sentiment === 'positive').length;
    const negativeNews = news.filter(n => n.sentiment === 'negative').length;
    const neutralNews = news.filter(n => n.sentiment === 'neutral').length;
    
    const positivePosts = socialPosts.filter(p => p.sentiment === 'positive').length;
    const negativePosts = socialPosts.filter(p => p.sentiment === 'negative').length;
    const neutralPosts = socialPosts.filter(p => p.sentiment === 'neutral').length;
    
    // Determine overall sentiment
    const totalPositive = positiveNews + positivePosts;
    const totalNegative = negativeNews + negativePosts;
    const totalNeutral = neutralNews + neutralPosts;
    
    let sentiment: 'bullish' | 'bearish' | 'neutral' = 'neutral';
    let confidence = 0;
    
    if (totalPositive > totalNegative && totalPositive > totalNeutral) {
      sentiment = 'bullish';
      confidence = Math.min(100, Math.round((totalPositive / (totalPositive + totalNegative + totalNeutral)) * 100));
    } else if (totalNegative > totalPositive && totalNegative > totalNeutral) {
      sentiment = 'bearish';
      confidence = Math.min(100, Math.round((totalNegative / (totalPositive + totalNegative + totalNeutral)) * 100));
    } else {
      sentiment = 'neutral';
      confidence = Math.min(100, Math.round((totalNeutral / (totalPositive + totalNegative + totalNeutral)) * 100));
    }
    
    // Return analysis result
    return {
      sentiment,
      confidence,
      sources: [
        `${news.length} ידיעות חדשותיות`,
        `${socialPosts.length} פוסטים ברשתות חברתיות`
      ]
    };
  } catch (error) {
    console.error('Error analyzing sentiment:', error);
    toast.error('שגיאה בניתוח הסנטימנט', {
      description: 'לא ניתן לנתח את הסנטימנט עבור הנכס'
    });
    return {
      sentiment: 'neutral',
      confidence: 0,
      sources: []
    };
  }
};

/**
 * Gets sentiment score as a number between -100 and 100
 */
export const getSentimentScore = (sentiment: string, confidence: number): number => {
  if (sentiment === 'bullish') {
    return confidence;
  } else if (sentiment === 'bearish') {
    return -confidence;
  } else {
    return 0;
  }
};
