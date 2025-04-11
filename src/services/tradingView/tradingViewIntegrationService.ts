
import { toast } from 'sonner';
import { getTradingViewCredentials } from './tradingViewAuthService';

// Types for TradingView chart data
export interface TradingViewChartData {
  symbol: string;
  timeframe: string;
  indicators: string[];
  lastUpdate: number;
}

// Types for TradingView news item
export interface TradingViewNewsItem {
  id: string;
  title: string;
  description: string;
  source: string;
  url: string;
  publishDate: number;
  relatedSymbols: string[];
  sentiment?: 'positive' | 'negative' | 'neutral';
}

// Store for chart data and news
let cachedChartData: Record<string, TradingViewChartData> = {};
let cachedNews: TradingViewNewsItem[] = [];
let lastSyncTimestamp: number = 0;

/**
 * Synchronize data with TradingView
 */
export const syncWithTradingView = async (): Promise<boolean> => {
  const credentials = getTradingViewCredentials();
  
  if (!credentials?.isConnected) {
    toast.error('אינך מחובר לחשבון TradingView', {
      description: 'אנא התחבר תחילה לחשבון TradingView'
    });
    return false;
  }
  
  try {
    // Simulate API call to TradingView
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Update last sync timestamp
    lastSyncTimestamp = Date.now();
    
    toast.success('הנתונים סונכרנו בהצלחה מ-TradingView', {
      description: `המידע עודכן בהצלחה ב-${new Date().toLocaleTimeString('he-IL')}`
    });
    
    return true;
  } catch (error) {
    console.error('Error syncing with TradingView:', error);
    toast.error('שגיאה בסנכרון נתונים מ-TradingView', {
      description: 'אנא נסה שנית מאוחר יותר'
    });
    return false;
  }
};

/**
 * Get chart data for a specific symbol
 */
export const getChartData = async (symbol: string, timeframe: string = '1D'): Promise<TradingViewChartData | null> => {
  const credentials = getTradingViewCredentials();
  
  if (!credentials?.isConnected) {
    return null;
  }
  
  // Check if we have cached data and it's recent (less than 5 minutes old)
  const cacheKey = `${symbol}-${timeframe}`;
  const now = Date.now();
  if (cachedChartData[cacheKey] && now - cachedChartData[cacheKey].lastUpdate < 5 * 60 * 1000) {
    return cachedChartData[cacheKey];
  }
  
  try {
    // In a real implementation, this would fetch data from TradingView API
    // For now, we'll simulate with mock data
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const mockData: TradingViewChartData = {
      symbol,
      timeframe,
      indicators: ['EMA(50)', 'EMA(200)', 'RSI', 'MACD'],
      lastUpdate: now
    };
    
    // Cache the data
    cachedChartData[cacheKey] = mockData;
    
    return mockData;
  } catch (error) {
    console.error(`Error fetching chart data for ${symbol}:`, error);
    return null;
  }
};

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
  if (cachedNews.length > 0 && now - lastSyncTimestamp < 15 * 60 * 1000) {
    return cachedNews.slice(0, limit);
  }
  
  try {
    // In a real implementation, this would fetch news from TradingView API
    // For now, we'll simulate with mock data
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Generate some mock news
    const mockNews: TradingViewNewsItem[] = [
      {
        id: 'tv-news-1',
        title: 'ביטקוין שובר שיא חדש מעל $73,000',
        description: 'המטבע הדיגיטלי המוביל שבר שיא כל הזמנים חדש לאחר אישור ה-ETF',
        source: 'TradingView',
        url: 'https://www.tradingview.com/news/1',
        publishDate: now - 2 * 60 * 60 * 1000, // 2 hours ago
        relatedSymbols: ['BTC', 'ETH', 'COIN'],
        sentiment: 'positive'
      },
      {
        id: 'tv-news-2',
        title: 'הפד שומר על ריבית ללא שינוי',
        description: 'הבנק המרכזי האמריקאי הותיר את הריבית ללא שינוי בישיבה האחרונה',
        source: 'TradingView',
        url: 'https://www.tradingview.com/news/2',
        publishDate: now - 1 * 24 * 60 * 60 * 1000, // 1 day ago
        relatedSymbols: ['SPY', 'QQQ', 'TLT'],
        sentiment: 'neutral'
      },
      {
        id: 'tv-news-3',
        title: 'מניות הטכנולוגיה מתקנות בחדות',
        description: 'מניות חברות הטכנולוגיה חוות ירידות חדות בעקבות דוחות מאכזבים',
        source: 'TradingView',
        url: 'https://www.tradingview.com/news/3',
        publishDate: now - 12 * 60 * 60 * 1000, // 12 hours ago
        relatedSymbols: ['AAPL', 'MSFT', 'GOOGL'],
        sentiment: 'negative'
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

/**
 * Initialize TradingView auto-sync
 * Setup automatic synchronization with TradingView every 5 minutes
 */
let syncInterval: number | null = null;

export const initializeTradingViewSync = () => {
  const credentials = getTradingViewCredentials();
  
  if (!credentials?.isConnected) {
    return false;
  }
  
  // Clear any existing interval
  if (syncInterval) {
    clearInterval(syncInterval);
  }
  
  // Set up auto-sync every 5 minutes
  syncInterval = window.setInterval(() => {
    syncWithTradingView();
  }, 5 * 60 * 1000);
  
  // Perform initial sync
  syncWithTradingView();
  
  return true;
};

export const stopTradingViewSync = () => {
  if (syncInterval) {
    clearInterval(syncInterval);
    syncInterval = null;
  }
};

/**
 * Check if TradingView auto-sync is active
 */
export const isSyncActive = (): boolean => {
  return syncInterval !== null;
};

// Export the sync interval for testing purposes
export const getSyncInterval = () => syncInterval;
