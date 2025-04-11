
import { TradingViewNewsItem } from './types';
import { getTradingViewCredentials } from './tradingViewAuthService';
import { getLastSyncTimestamp } from './chartDataService';

// Store for news items
let cachedNews: TradingViewNewsItem[] = [];

/**
 * Get news from TradingView
 */
export const getTradingViewNews = async (limit: number = 10): Promise<TradingViewNewsItem[]> => {
  const credentials = getTradingViewCredentials();
  
  if (!credentials?.isConnected) {
    return [];
  }
  
  // Check if we have cached news and it's recent (less than 15 minutes old)
  const now = Date.now();
  if (cachedNews.length > 0 && now - getLastSyncTimestamp() < 15 * 60 * 1000) {
    return cachedNews.slice(0, limit);
  }
  
  try {
    // In a real implementation, this would fetch news from TradingView API
    // For now, we'll simulate with mock data
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Generate some mock news with improved data
    const mockNews: TradingViewNewsItem[] = [
      {
        id: 'tv-news-1',
        title: 'ביטקוין שובר שיא חדש מעל $73,000',
        description: 'המטבע הדיגיטלי המוביל שבר שיא כל הזמנים חדש לאחר אישור ה-ETF',
        summary: 'המטבע הדיגיטלי המוביל שבר שיא כל הזמנים חדש לאחר אישור ה-ETF',
        source: 'TradingView',
        url: 'https://www.tradingview.com/news/1',
        publishDate: now - 2 * 60 * 60 * 1000, // 2 hours ago
        relatedSymbols: ['BTC', 'ETH', 'COIN'],
        sentiment: 'positive',
        category: 'קריפטו'
      },
      {
        id: 'tv-news-2',
        title: 'הפד שומר על ריבית ללא שינוי',
        description: 'הבנק המרכזי האמריקאי הותיר את הריבית ללא שינוי בישיבה האחרונה',
        summary: 'הבנק המרכזי האמריקאי הותיר את הריבית ללא שינוי בישיבה האחרונה',
        source: 'TradingView',
        url: 'https://www.tradingview.com/news/2',
        publishDate: now - 1 * 24 * 60 * 60 * 1000, // 1 day ago
        relatedSymbols: ['SPY', 'QQQ', 'TLT'],
        sentiment: 'neutral',
        category: 'מניות'
      },
      {
        id: 'tv-news-3',
        title: 'מניות הטכנולוגיה מתקנות בחדות',
        description: 'מניות חברות הטכנולוגיה חוות ירידות חדות בעקבות דוחות מאכזבים',
        summary: 'מניות חברות הטכנולוגיה חוות ירידות חדות בעקבות דוחות מאכזבים',
        source: 'TradingView',
        url: 'https://www.tradingview.com/news/3',
        publishDate: now - 12 * 60 * 60 * 1000, // 12 hours ago
        relatedSymbols: ['AAPL', 'MSFT', 'GOOGL'],
        sentiment: 'negative',
        category: 'מניות'
      },
      {
        id: 'tv-news-4',
        title: 'אתריום עולה בעקבות עדכון רשת משמעותי',
        description: 'מחיר האתריום זינק ב-10% לאחר השלמת עדכון רשת מוצלח',
        summary: 'מחיר האתריום זינק ב-10% לאחר השלמת עדכון רשת מוצלח',
        source: 'TradingView',
        url: 'https://www.tradingview.com/news/4',
        publishDate: now - 6 * 60 * 60 * 1000, // 6 hours ago
        relatedSymbols: ['ETH', 'BTC', 'SOL'],
        sentiment: 'positive',
        category: 'קריפטו'
      },
      {
        id: 'tv-news-5',
        title: 'מחיר הנפט יורד בעקבות חששות מהאטה כלכלית',
        description: 'מחירי הנפט ירדו בשיעור חד בעקבות חששות מהאטה בביקושים העולמיים',
        summary: 'מחירי הנפט ירדו בשיעור חד בעקבות חששות מהאטה בביקושים העולמיים',
        source: 'TradingView',
        url: 'https://www.tradingview.com/news/5',
        publishDate: now - 8 * 60 * 60 * 1000, // 8 hours ago
        relatedSymbols: ['OIL', 'USO', 'XOM'],
        sentiment: 'negative',
        category: 'סחורות'
      },
      {
        id: 'tv-news-6',
        title: 'סולנה מתרסקת: ירידה של 15% ב-24 שעות',
        description: 'מטבע הקריפטו סולנה חווה ירידה חדה בעקבות כשל טכני ברשת',
        summary: 'מטבע הקריפטו סולנה חווה ירידה חדה בעקבות כשל טכני ברשת',
        source: 'TradingView',
        url: 'https://www.tradingview.com/news/6',
        publishDate: now - 3 * 60 * 60 * 1000, // 3 hours ago
        relatedSymbols: ['SOL', 'BTC', 'ETH'],
        sentiment: 'negative',
        category: 'קריפטו'
      },
      {
        id: 'tv-news-7',
        title: 'אווקס מציג עליות חדות לאחר שיתוף פעולה חדש',
        description: 'מחיר האווקס זינק ב-20% בעקבות הודעה על שיתוף פעולה עם חברת תשלומים גדולה',
        summary: 'מחיר האווקס זינק ב-20% בעקבות הודעה על שיתוף פעולה עם חברת תשלומים גדולה',
        source: 'TradingView',
        url: 'https://www.tradingview.com/news/7',
        publishDate: now - 5 * 60 * 60 * 1000, // 5 hours ago
        relatedSymbols: ['AVAX', 'BTC', 'ETH'],
        sentiment: 'positive',
        category: 'קריפטו'
      }
    ];
    
    // Cache the news
    cachedNews = mockNews;
    
    return mockNews.slice(0, limit);
  } catch (error) {
    console.error('Error fetching TradingView news:', error);
    return [];
  }
};

// Clear the news cache
export const clearNewsCache = () => {
  cachedNews = [];
};
