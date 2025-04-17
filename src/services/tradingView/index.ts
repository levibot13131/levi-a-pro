
import { toast } from 'sonner';

export interface TradingViewChartData {
  symbol: string;
  timeframe: string;
  data: any[];
  lastUpdated: number;
}

export interface TradingViewNewsItem {
  id: string;
  title: string;
  content: string;
  source: string;
  url: string;
  publishedAt: string;
  relatedSymbols: string[];
}

// Check if sync is active
export const isSyncActive = (): boolean => {
  return localStorage.getItem('tradingview_sync_active') === 'true';
};

// Initialize TradingView sync
export const initializeTradingViewSync = (): boolean => {
  try {
    localStorage.setItem('tradingview_sync_active', 'true');
    return true;
  } catch (error) {
    console.error('Error initializing TradingView sync:', error);
    return false;
  }
};

// Stop TradingView sync
export const stopTradingViewSync = (): boolean => {
  try {
    localStorage.setItem('tradingview_sync_active', 'false');
    return true;
  } catch (error) {
    console.error('Error stopping TradingView sync:', error);
    return false;
  }
};

// Sync with TradingView
export const syncWithTradingView = async (): Promise<boolean> => {
  try {
    // In a real application, this would make API calls to TradingView
    // For this demo, we'll just simulate a successful sync
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    return true;
  } catch (error) {
    console.error('Error syncing with TradingView:', error);
    return false;
  }
};

// Get chart data from TradingView
export const getChartData = async (symbol: string, timeframe: string = '1D'): Promise<TradingViewChartData> => {
  try {
    // In a real application, this would make API calls to TradingView
    // For this demo, we'll return mock data
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      symbol,
      timeframe,
      data: generateMockChartData(timeframe),
      lastUpdated: Date.now()
    };
  } catch (error) {
    console.error('Error getting chart data from TradingView:', error);
    throw error;
  }
};

// Get news from TradingView
export const getTradingViewNews = async (limit: number = 10): Promise<TradingViewNewsItem[]> => {
  try {
    // In a real application, this would make API calls to TradingView
    // For this demo, we'll return mock data
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const mockNews: TradingViewNewsItem[] = [
      {
        id: '1',
        title: 'ביטקוין שובר שיא חדש',
        content: 'ביטקוין הגיע לשיא חדש של 73,000 דולר אמש לאחר ביקוש גובר מצד משקיעים מוסדיים.',
        source: 'CryptoNews',
        url: 'https://example.com/news/1',
        publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        relatedSymbols: ['BTC', 'BTCUSD']
      },
      {
        id: '2',
        title: 'אתריום מתכונן לעדכון רשת חדש',
        content: 'מפתחי אתריום הודיעו על עדכון רשת משמעותי שצפוי לשפר את ביצועי הרשת ולהפחית עמלות.',
        source: 'CryptoDaily',
        url: 'https://example.com/news/2',
        publishedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
        relatedSymbols: ['ETH', 'ETHUSD']
      },
      {
        id: '3',
        title: 'רגולציה חדשה צפויה להשפיע על שוק הקריפטו',
        content: 'רשויות הפיקוח הפיננסי מתכננות רגולציה חדשה שעשויה להשפיע על המסחר במטבעות דיגיטליים.',
        source: 'FinanceNews',
        url: 'https://example.com/news/3',
        publishedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        relatedSymbols: ['BTC', 'ETH', 'XRP']
      }
    ];
    
    return mockNews.slice(0, limit);
  } catch (error) {
    console.error('Error getting news from TradingView:', error);
    return [];
  }
};

// Generate mock chart data
const generateMockChartData = (timeframe: string): any[] => {
  const data = [];
  const now = Date.now();
  let interval: number;
  let count: number;
  
  // Determine interval and number of data points based on timeframe
  switch (timeframe) {
    case '1h':
      interval = 60 * 1000; // 1 minute
      count = 60;
      break;
    case '4h':
      interval = 5 * 60 * 1000; // 5 minutes
      count = 48;
      break;
    case '1D':
    default:
      interval = 15 * 60 * 1000; // 15 minutes
      count = 96;
      break;
  }
  
  let price = 50000 + Math.random() * 5000;
  
  for (let i = 0; i < count; i++) {
    // Simulate price movement
    price = price + (Math.random() - 0.5) * 100;
    
    const time = now - (count - i) * interval;
    data.push({
      time,
      open: price,
      high: price + Math.random() * 50,
      low: price - Math.random() * 50,
      close: price,
      volume: Math.floor(Math.random() * 100) + 50
    });
  }
  
  return data;
};
