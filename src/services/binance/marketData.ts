
import { toast } from 'sonner';
import { getProxyConfig } from '../proxy/proxyConfig';
import { useAppSettings } from '@/hooks/use-app-settings';

// מבנה נתונים למידע של סימבול
export interface SymbolData {
  symbol: string;
  price: number;
  priceChangePercent: number;
  volume: number;
  high24h: number;
  low24h: number;
  lastUpdated: Date;
}

// מבנה נתונים לפרטי חשבון
export interface AccountInfo {
  totalEquity: number;
  availableBalance: number;
  positions: Position[];
  orders: Order[];
}

// פוזיציה
export interface Position {
  symbol: string;
  amount: number;
  entryPrice: number;
  markPrice: number;
  pnl: number;
  pnlPercent: number;
  liquidationPrice?: number;
  leverage?: number;
}

// הזמנה
export interface Order {
  id: string;
  symbol: string;
  side: 'BUY' | 'SELL';
  type: string;
  price: number;
  quantity: number;
  status: string;
  time: number;
}

// נתוני תרשים
export interface ChartData {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

// נתוני מטבע
export interface CurrencyData {
  symbol: string;
  name: string;
  price: number;
  volume: number;
  marketCap: number;
  change24h: number;
  supply: number;
  totalSupply: number;
}

// נתונים מוק עבור סימבולים
const mockSymbolsData: Record<string, SymbolData> = {
  'BTCUSDT': {
    symbol: 'BTCUSDT',
    price: 64253.75,
    priceChangePercent: 2.34,
    volume: 1250000000,
    high24h: 65123.45,
    low24h: 63215.78,
    lastUpdated: new Date()
  },
  'ETHUSDT': {
    symbol: 'ETHUSDT',
    price: 3145.82,
    priceChangePercent: 1.87,
    volume: 950000000,
    high24h: 3189.32,
    low24h: 3091.56,
    lastUpdated: new Date()
  },
  'SOLUSDT': {
    symbol: 'SOLUSDT',
    price: 168.42,
    priceChangePercent: 4.25,
    volume: 450000000,
    high24h: 172.18,
    low24h: 162.33,
    lastUpdated: new Date()
  },
  'DOGEUSDT': {
    symbol: 'DOGEUSDT',
    price: 0.1789,
    priceChangePercent: -1.25,
    volume: 125000000,
    high24h: 0.1845,
    low24h: 0.1756,
    lastUpdated: new Date()
  },
  'ADAUSDT': {
    symbol: 'ADAUSDT',
    price: 0.4732,
    priceChangePercent: 0.45,
    volume: 85000000,
    high24h: 0.4789,
    low24h: 0.4695,
    lastUpdated: new Date()
  }
};

/**
 * קבלת מחיר עדכני עבור סימבול
 */
export const getCurrentPrice = async (symbol: string): Promise<number | null> => {
  try {
    // בדיקה אם זה מצב דמו
    const isDemoMode = useAppSettings.getState().demoMode;
    
    // במצב דמו, החזרת מחיר מוק
    if (isDemoMode) {
      return mockSymbolsData[symbol]?.price || null;
    }
    
    // בדיקת הגדרות פרוקסי
    const proxyConfig = getProxyConfig();
    const baseUrl = proxyConfig.isEnabled ? proxyConfig.baseUrl : 'https://api.binance.com';
    
    // בקשת API
    const url = `${baseUrl}/api/v3/ticker/price?symbol=${symbol}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch price for ${symbol}: ${response.statusText}`);
    }
    
    const data = await response.json();
    return parseFloat(data.price);
  } catch (error) {
    console.error('Error fetching current price:', error);
    return null;
  }
};

/**
 * קבלת נתוני מטבע מבינאנס בזמן אמת
 */
export const getSymbolData = async (symbol: string): Promise<SymbolData | null> => {
  try {
    // בדיקה אם זה מצב דמו
    const isDemoMode = useAppSettings.getState().demoMode;
    
    // במצב דמו, החזרת נתונים מוק
    if (isDemoMode) {
      // סימולציה של שינוי מחיר אקראי
      const mockData = { ...mockSymbolsData[symbol] };
      if (mockData) {
        const priceChange = (Math.random() - 0.5) * 0.01 * mockData.price;
        mockData.price += priceChange;
        mockData.lastUpdated = new Date();
        return mockData;
      }
      return null;
    }
    
    // בדיקת הגדרות פרוקסי
    const proxyConfig = getProxyConfig();
    const baseUrl = proxyConfig.isEnabled ? proxyConfig.baseUrl : 'https://api.binance.com';
    
    // בקשת API 24hr ticker
    const url = `${baseUrl}/api/v3/ticker/24hr?symbol=${symbol}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch data for ${symbol}: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    return {
      symbol: data.symbol,
      price: parseFloat(data.lastPrice),
      priceChangePercent: parseFloat(data.priceChangePercent),
      volume: parseFloat(data.volume),
      high24h: parseFloat(data.highPrice),
      low24h: parseFloat(data.lowPrice),
      lastUpdated: new Date()
    };
  } catch (error) {
    console.error('Error fetching symbol data:', error);
    return null;
  }
};

/**
 * קבלת נתוני מטבעות רבים בזמן אמת
 */
export const getSymbolsData = async (symbols: string[]): Promise<Record<string, SymbolData>> => {
  try {
    // בדיקה אם זה מצב דמו
    const isDemoMode = useAppSettings.getState().demoMode;
    
    // במצב דמו, החזרת נתונים מוק
    if (isDemoMode) {
      const result: Record<string, SymbolData> = {};
      
      for (const symbol of symbols) {
        if (mockSymbolsData[symbol]) {
          // סימולציה של שינוי מחיר אקראי
          const mockData = { ...mockSymbolsData[symbol] };
          const priceChange = (Math.random() - 0.5) * 0.01 * mockData.price;
          mockData.price += priceChange;
          mockData.lastUpdated = new Date();
          result[symbol] = mockData;
        }
      }
      
      console.log(`נטענו נתוני בינאנס מוק עבור ${Object.keys(result).length} סימבולים`, {
        development: process.env.NODE_ENV === 'development',
        proxyConfigured: getProxyConfig().isEnabled
      });
      
      return result;
    }
    
    // בקשת API עבור כל המטבעות
    const result: Record<string, SymbolData> = {};
    const proxyConfig = getProxyConfig();
    const baseUrl = proxyConfig.isEnabled ? proxyConfig.baseUrl : 'https://api.binance.com';
    
    // טיפול בבקשות במקביל
    const requests = symbols.map((symbol) => {
      const url = `${baseUrl}/api/v3/ticker/24hr?symbol=${symbol}`;
      return fetch(url)
        .then(response => {
          if (!response.ok) {
            throw new Error(`Failed to fetch data for ${symbol}: ${response.statusText}`);
          }
          return response.json();
        })
        .then(data => {
          result[symbol] = {
            symbol: data.symbol,
            price: parseFloat(data.lastPrice),
            priceChangePercent: parseFloat(data.priceChangePercent),
            volume: parseFloat(data.volume),
            high24h: parseFloat(data.highPrice),
            low24h: parseFloat(data.lowPrice),
            lastUpdated: new Date()
          };
        })
        .catch(error => {
          console.error(`Error fetching data for ${symbol}:`, error);
        });
    });
    
    await Promise.all(requests);
    return result;
  } catch (error) {
    console.error('Error fetching symbols data:', error);
    return {};
  }
};

/**
 * קבלת נתוני פונדמנטלס עבור מטבע
 * (במצב אמיתי זה יכול להיות מידע מקורלציה של מקורות מידע שונים)
 */
export const getFundamentalData = async (symbol: string): Promise<CurrencyData | null> => {
  try {
    // בדיקה אם זה מצב דמו
    const isDemoMode = useAppSettings.getState().demoMode;
    
    // במצב דמו, החזרת נתונים מוק
    if (isDemoMode) {
      // מידע מוק עבור כמה מטבעות נפוצים
      const fundamentalData: Record<string, CurrencyData> = {
        'BTC': {
          symbol: 'BTC',
          name: 'Bitcoin',
          price: 64253.75,
          volume: 28500000000,
          marketCap: 1250000000000,
          change24h: 2.34,
          supply: 19500000,
          totalSupply: 21000000
        },
        'ETH': {
          symbol: 'ETH',
          name: 'Ethereum',
          price: 3145.82,
          volume: 15700000000,
          marketCap: 378000000000,
          change24h: 1.87,
          supply: 120000000,
          totalSupply: 0 // אין הגבלה
        }
      };
      
      // נוציא את הסימבול מתוך המחרוזת (לדוגמה: BTCUSDT -> BTC)
      const baseSymbol = symbol.replace(/USDT|USD|BUSD|USDC/g, '');
      
      return fundamentalData[baseSymbol] || null;
    }
    
    // כאן היינו מבצעים בקשת API אמיתית
    // כרגע מחזיר null
    return null;
  } catch (error) {
    console.error('Error fetching fundamental data:', error);
    return null;
  }
};
