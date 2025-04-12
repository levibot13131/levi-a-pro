
import { toast } from 'sonner';

// API keys storage key
const BINANCE_API_KEYS_KEY = 'binance_api_keys';

// Binance API Credentials
export interface BinanceCredentials {
  apiKey: string;
  apiSecret: string;
  isConnected: boolean;
  lastConnected?: number;
  permissions?: {
    spotTrading: boolean;
    futuresTrading: boolean;
    readOnly: boolean;
  };
}

/**
 * Save Binance API credentials
 */
export const saveBinanceCredentials = (apiKey: string, apiSecret: string): BinanceCredentials => {
  const credentials: BinanceCredentials = {
    apiKey,
    apiSecret,
    isConnected: true,
    lastConnected: Date.now(),
    permissions: {
      spotTrading: false, // Default to read-only for safety
      futuresTrading: false,
      readOnly: true,
    }
  };
  
  localStorage.setItem(BINANCE_API_KEYS_KEY, JSON.stringify(credentials));
  toast.success('החיבור ל-Binance בוצע בהצלחה', {
    description: 'המערכת מחוברת לחשבון הבינאנס שלך במצב קריאה בלבד'
  });
  
  return credentials;
};

/**
 * Get Binance API credentials
 */
export const getBinanceCredentials = (): BinanceCredentials | null => {
  const credentials = localStorage.getItem(BINANCE_API_KEYS_KEY);
  
  if (!credentials) return null;
  
  try {
    return JSON.parse(credentials) as BinanceCredentials;
  } catch (error) {
    console.error('Error parsing Binance credentials:', error);
    return null;
  }
};

/**
 * Validate Binance API credentials
 * In a real implementation, this would make a request to Binance API
 */
export const validateBinanceCredentials = async (apiKey: string, apiSecret: string): Promise<boolean> => {
  try {
    // Simulate API validation delay
    return new Promise(resolve => {
      setTimeout(() => {
        const valid = apiKey?.trim().length > 5 && apiSecret?.trim().length > 5;
        
        if (valid) {
          saveBinanceCredentials(apiKey, apiSecret);
        }
        
        resolve(valid);
      }, 1500);
    });
  } catch (error) {
    console.error('Error validating Binance credentials:', error);
    return false;
  }
};

/**
 * Disconnect from Binance
 */
export const disconnectBinance = (): void => {
  localStorage.removeItem(BINANCE_API_KEYS_KEY);
  toast.info('החיבור ל-Binance נותק');
};

/**
 * Check if connected to Binance
 */
export const isBinanceConnected = (): boolean => {
  const credentials = getBinanceCredentials();
  return credentials?.isConnected === true;
};

/**
 * Real-time market data fetching
 * In a real implementation, this would use a WebSocket connection to Binance
 */
export const startRealTimeMarketData = async (symbols: string[], callback: (data: any) => void): Promise<{ stop: () => void }> => {
  if (!isBinanceConnected()) {
    toast.error('אנא התחבר לחשבון Binance כדי לקבל נתונים בזמן אמת');
    return { stop: () => {} };
  }
  
  console.log('Starting real-time market data for symbols:', symbols);
  
  // Simulate WebSocket connection with interval
  const interval = setInterval(() => {
    // Generate mock market data updates
    symbols.forEach(symbol => {
      const mockData = {
        symbol,
        price: 1000 + Math.random() * 50000,
        volume: Math.random() * 1000,
        timestamp: Date.now(),
        change24h: (Math.random() * 10) - 5, // -5% to +5%
      };
      
      callback(mockData);
    });
  }, 5000);
  
  return {
    stop: () => clearInterval(interval)
  };
};

/**
 * Get account balance
 */
export const getAccountBalance = async (): Promise<{ asset: string, free: string, locked: string }[]> => {
  if (!isBinanceConnected()) {
    toast.error('אנא התחבר לחשבון Binance כדי לקבל נתוני חשבון');
    return [];
  }
  
  // In a real implementation, this would make a request to Binance API
  // For demonstration, we'll return mock data
  return [
    { asset: 'BTC', free: '0.01', locked: '0' },
    { asset: 'ETH', free: '0.5', locked: '0' },
    { asset: 'USDT', free: '1000', locked: '0' },
    { asset: 'BNB', free: '1', locked: '0' }
  ];
};

/**
 * Get open orders
 */
export const getOpenOrders = async (): Promise<any[]> => {
  if (!isBinanceConnected()) {
    toast.error('אנא התחבר לחשבון Binance כדי לקבל הזמנות פתוחות');
    return [];
  }
  
  // In a real implementation, this would make a request to Binance API
  return [];
};

/**
 * Get recent trades
 */
export const getRecentTrades = async (symbol: string): Promise<any[]> => {
  if (!isBinanceConnected()) {
    toast.error('אנא התחבר לחשבון Binance כדי לקבל עסקאות אחרונות');
    return [];
  }
  
  // In a real implementation, this would make a request to Binance API
  return [];
};

/**
 * Place a market order
 * This is disabled by default for safety
 */
export const placeMarketOrder = async (
  symbol: string, 
  side: 'BUY' | 'SELL', 
  quantity: number
): Promise<boolean> => {
  const credentials = getBinanceCredentials();
  
  if (!credentials?.isConnected) {
    toast.error('אנא התחבר לחשבון Binance כדי לבצע פעולות מסחר');
    return false;
  }
  
  if (credentials.permissions?.readOnly) {
    toast.warning('מסחר מושבת', {
      description: 'חשבון הבינאנס מוגדר לקריאה בלבד כדי להגן על הכספים שלך. שנה הגדרה זו בהגדרות מתקדמות בעת הצורך.'
    });
    return false;
  }
  
  // In a real implementation, this would make a request to Binance API
  toast.success(`הוראת שוק בוצעה בהצלחה`, {
    description: `${side === 'BUY' ? 'קנייה' : 'מכירה'} של ${quantity} ${symbol}`
  });
  return true;
};

/**
 * Place a limit order
 * This is disabled by default for safety
 */
export const placeLimitOrder = async (
  symbol: string, 
  side: 'BUY' | 'SELL', 
  quantity: number, 
  price: number
): Promise<boolean> => {
  const credentials = getBinanceCredentials();
  
  if (!credentials?.isConnected) {
    toast.error('אנא התחבר לחשבון Binance כדי לבצע פעולות מסחר');
    return false;
  }
  
  if (credentials.permissions?.readOnly) {
    toast.warning('מסחר מושבת', {
      description: 'חשבון הבינאנס מוגדר לקריאה בלבד כדי להגן על הכספים שלך. שנה הגדרה זו בהגדרות מתקדמות בעת הצורך.'
    });
    return false;
  }
  
  // In a real implementation, this would make a request to Binance API
  toast.success(`הוראת לימיט בוצעה בהצלחה`, {
    description: `${side === 'BUY' ? 'קנייה' : 'מכירה'} של ${quantity} ${symbol} במחיר ${price}`
  });
  return true;
};

/**
 * Get fundamental data for crypto assets
 */
export const getFundamentalData = async (symbol: string): Promise<any> => {
  // In a real implementation, this would make a request to Binance API or other data providers
  // For demonstration, we'll return mock data
  const rand = Math.random();
  return {
    symbol,
    marketCap: Math.random() * 1000000000,
    volume24h: Math.random() * 10000000,
    circulatingSupply: Math.random() * 100000000,
    maxSupply: Math.random() * 1000000000,
    fundamentalScore: rand * 100,
    sentiment: rand > 0.7 ? 'bullish' : rand > 0.3 ? 'neutral' : 'bearish',
    newsCount24h: Math.floor(Math.random() * 50),
    socialMentions24h: Math.floor(Math.random() * 1000),
    timestamp: Date.now()
  };
};

/**
 * Set trading permissions for Binance API
 * Only for admin use
 */
export const setTradingPermissions = (permissions: {
  spotTrading: boolean;
  futuresTrading: boolean;
  readOnly: boolean;
}): boolean => {
  const credentials = getBinanceCredentials();
  
  if (!credentials) {
    toast.error('אנא התחבר לחשבון Binance תחילה');
    return false;
  }
  
  // Update permissions
  credentials.permissions = permissions;
  
  // Save updated credentials
  localStorage.setItem(BINANCE_API_KEYS_KEY, JSON.stringify(credentials));
  
  toast.success('הרשאות המסחר עודכנו', {
    description: permissions.readOnly 
      ? 'חשבון הבינאנס מוגדר כעת לקריאה בלבד' 
      : 'הרשאות מסחר פעילות - נהג בזהירות'
  });
  
  return true;
};
