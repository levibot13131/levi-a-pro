
import { NewsItem, SocialPost } from '@/types/asset';

// Helper function to generate mock data
const generateMockData = <T>(template: T, count: number): T[] => {
  return Array.from({ length: count }, (_, i) => ({
    ...template,
    id: `mock-${i + 1}`
  }));
};

// Mock social posts data
const mockSocialPosts: SocialPost[] = [
  {
    id: 'post1',
    author: 'קריפטו אנליסט',
    authorUsername: '@cryptoanalyst',
    authorImageUrl: 'https://via.placeholder.com/40',
    content: 'ביטקוין שובר שיאים חדשים! נראה שיש מומנטום חזק בשוק.',
    publishedAt: new Date(Date.now() - 3600000).toISOString(),
    likes: 1245,
    comments: 89,
    sentiment: 'positive'
  },
  {
    id: 'post2',
    author: 'מומחה מסחר',
    authorUsername: '@tradingexpert',
    authorImageUrl: 'https://via.placeholder.com/40',
    content: 'אתריום מתכונן לירידה? נראה תבנית דובית בגרף היומי.',
    publishedAt: new Date(Date.now() - 7200000).toISOString(),
    likes: 742,
    comments: 56,
    sentiment: 'negative'
  },
  {
    id: 'post3',
    author: 'אנליסט פיננסי',
    authorUsername: '@financialanalyst',
    authorImageUrl: 'https://via.placeholder.com/40',
    content: 'המניות הטכנולוגיות מתאוששות אחרי הירידה של אתמול. אפל ומיקרוסופט מובילות את העליות.',
    publishedAt: new Date(Date.now() - 10800000).toISOString(),
    likes: 932,
    comments: 124,
    sentiment: 'positive'
  }
];

// Mock news data
const mockNews: NewsItem[] = [
  {
    id: 'news1',
    title: 'ביטקוין חוצה את רף ה-60,000 דולר',
    summary: 'מטבע הביטקוין עלה ל-62,000 דולר, שיא של 3 חודשים, על רקע אישור ה-ETF.',
    source: 'CryptoNews',
    url: 'https://example.com/news1',
    publishedAt: new Date(Date.now() - 86400000).toISOString(),
    imageUrl: 'https://via.placeholder.com/400x200',
    sentiment: 'positive',
    relatedAssets: ['bitcoin']
  },
  {
    id: 'news2',
    title: 'אפל מציגה תוצאות מעל המצופה',
    summary: 'אפל הציגה תוצאות רבעוניות מעל הציפיות, עם עליה של 15% בהכנסות.',
    source: 'MarketWatch',
    url: 'https://example.com/news2',
    publishedAt: new Date(Date.now() - 172800000).toISOString(),
    imageUrl: 'https://via.placeholder.com/400x200',
    sentiment: 'positive',
    relatedAssets: ['aapl']
  },
  {
    id: 'news3',
    title: 'מניית אמזון צונחת בעקבות תחזית מאכזבת',
    summary: 'מניית אמזון ירדה ב-8% לאחר שהחברה פרסמה תחזית רבעונית נמוכה מהצפי.',
    source: 'Bloomberg',
    url: 'https://example.com/news3',
    publishedAt: new Date(Date.now() - 259200000).toISOString(),
    imageUrl: 'https://via.placeholder.com/400x200',
    sentiment: 'negative',
    relatedAssets: ['amzn']
  }
];

// Get news by asset ID
export const getNewsByAssetId = async (assetId: string): Promise<NewsItem[]> => {
  if (!assetId) {
    return mockNews;
  }
  
  // Filter the mock news by related assets
  return mockNews.filter(news => 
    news.relatedAssets?.includes(assetId)
  );
};

// Get social posts by asset ID
export const getSocialPostsByAssetId = async (assetId: string): Promise<SocialPost[]> => {
  if (!assetId) {
    return mockSocialPosts;
  }
  
  // Return a subset of posts based on asset ID
  // In a real app, this would filter by posts mentioning the asset
  return mockSocialPosts.filter((_, i) => i % (assetId.length % 3 + 1) === 0);
};

// Get latest news
export const getLatestNews = async (limit: number = 5): Promise<NewsItem[]> => {
  return mockNews.slice(0, limit);
};

// Get social posts
export const getSocialPosts = async (limit: number = 5): Promise<SocialPost[]> => {
  return mockSocialPosts.slice(0, limit);
};
