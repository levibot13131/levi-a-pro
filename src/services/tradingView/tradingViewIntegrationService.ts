
import { toast } from 'sonner';
import { getTradingViewCredentials } from './tradingViewAuthService';

// Types for TradingView chart data
export interface TradingViewChartData {
  symbol: string;
  timeframe: string;
  indicators: string[];
  lastUpdate: number;
  data: {
    timestamp: number;
    price: number;
    volume?: number;
    open?: number;
    high?: number;
    low?: number;
    close?: number;
  }[];
}

// Types for TradingView news item
export interface TradingViewNewsItem {
  id: string;
  title: string;
  description: string;
  summary?: string;
  source: string;
  url: string;
  publishDate: number;
  relatedSymbols: string[];
  sentiment?: 'positive' | 'negative' | 'neutral';
  category?: string;
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
    
    // Clear cache to force refresh
    cachedChartData = {};
    
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
    
    // Generate sample price data
    const dataPoints = 50; // Increased data points for better charts
    let startPrice = 0;
    let volatility = 0;
    
    if (symbol === 'BTCUSD') {
      startPrice = 68000;
      volatility = 1000;
    } else if (symbol === 'ETHUSD') {
      startPrice = 3200;
      volatility = 100;
    } else if (symbol === 'SOLUSD') {
      startPrice = 140;
      volatility = 5;
    } else if (symbol === 'AVAXUSD') {
      startPrice = 35;
      volatility = 2;
    } else if (symbol === 'ADAUSD') {
      startPrice = 0.45;
      volatility = 0.02;
    } else {
      startPrice = 100;
      volatility = 10;
    }
    
    const timeInterval = getTimeIntervalByTimeframe(timeframe);
    
    // Create more realistic price movements
    let currentPrice = startPrice;
    let trend = Math.random() > 0.5 ? 1 : -1;
    let trendStrength = Math.random() * 0.7 + 0.3; // 0.3-1.0
    let trendDuration = Math.floor(Math.random() * 10) + 5;
    
    const priceData = Array.from({ length: dataPoints }, (_, i) => {
      // Occasionally change trend
      if (i % trendDuration === 0) {
        trend = Math.random() > 0.4 ? 1 : -1;
        trendStrength = Math.random() * 0.7 + 0.3;
        trendDuration = Math.floor(Math.random() * 10) + 5;
      }
      
      // Calculate price movement with trend bias
      const randomChange = ((Math.random() - 0.5) + (trendStrength * trend * 0.2)) * volatility;
      currentPrice = Math.max(currentPrice + randomChange, startPrice * 0.7); // Prevent prices going too low
      
      // Generate volume based on price movement (higher on significant moves)
      const volumeBase = Math.floor(Math.random() * 1000000) + 500000;
      const volumeMultiplier = 1 + Math.abs(randomChange / volatility) * 5;
      const volume = Math.floor(volumeBase * volumeMultiplier);
      
      // Calculate OHLC data realistically
      const open = currentPrice - (randomChange * 0.7);
      const close = currentPrice;
      const move = Math.abs(randomChange);
      const high = Math.max(open, close) + (move * Math.random() * 0.5);
      const low = Math.min(open, close) - (move * Math.random() * 0.5);
      
      return {
        timestamp: now - (dataPoints - i) * timeInterval,
        price: currentPrice,
        volume,
        open,
        high,
        low,
        close
      };
    });
    
    const mockData: TradingViewChartData = {
      symbol,
      timeframe,
      indicators: ['EMA(50)', 'EMA(200)', 'RSI', 'MACD'],
      lastUpdate: now,
      data: priceData
    };
    
    // Cache the data
    cachedChartData[cacheKey] = mockData;
    
    return mockData;
  } catch (error) {
    console.error(`Error fetching chart data for ${symbol}:`, error);
    return null;
  }
};

const getTimeIntervalByTimeframe = (timeframe: string): number => {
  switch (timeframe) {
    case '1m': return 60 * 1000; // 1 minute
    case '5m': return 5 * 60 * 1000; // 5 minutes
    case '15m': return 15 * 60 * 1000; // 15 minutes
    case '30m': return 30 * 60 * 1000; // 30 minutes
    case '1h': return 60 * 60 * 1000; // 1 hour
    case '4h': return 4 * 60 * 60 * 1000; // 4 hours
    case '1D': return 24 * 60 * 60 * 1000; // 1 day
    case '1W': return 7 * 24 * 60 * 60 * 1000; // 1 week
    case '1M': return 30 * 24 * 60 * 60 * 1000; // 1 month (approximate)
    default: return 24 * 60 * 60 * 1000; // Default to 1 day
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
