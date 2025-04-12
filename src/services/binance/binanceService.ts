
import { toast } from 'sonner';

// API keys storage key
const BINANCE_API_KEYS_KEY = 'binance_api_keys';

// Binance API Credentials
export interface BinanceCredentials {
  apiKey: string;
  apiSecret: string;
  isConnected: boolean;
  lastConnected?: number;
}

/**
 * Save Binance API credentials
 */
export const saveBinanceCredentials = (apiKey: string, apiSecret: string): BinanceCredentials => {
  const credentials: BinanceCredentials = {
    apiKey,
    apiSecret,
    isConnected: true,
    lastConnected: Date.now()
  };
  
  localStorage.setItem(BINANCE_API_KEYS_KEY, JSON.stringify(credentials));
  toast.success('החיבור ל-Binance בוצע בהצלחה', {
    description: 'המערכת מחוברת לחשבון הבינאנס שלך'
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
 * This is a simple validation that checks if the API keys exist
 */
export const validateBinanceCredentials = async (apiKey: string, apiSecret: string): Promise<boolean> => {
  try {
    // In a real application, you would make a request to Binance API to validate
    // For demonstration, we'll just check that the keys are provided
    
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
 * Mock: Get account balance
 */
export const getAccountBalance = async (): Promise<{ asset: string, free: string, locked: string }[]> => {
  // In a real application, you would make a request to Binance API
  // For demonstration, we'll return mock data
  return [
    { asset: 'BTC', free: '0.01', locked: '0' },
    { asset: 'ETH', free: '0.5', locked: '0' },
    { asset: 'USDT', free: '1000', locked: '0' },
    { asset: 'BNB', free: '1', locked: '0' }
  ];
};

/**
 * Mock: Get open orders
 */
export const getOpenOrders = async (): Promise<any[]> => {
  // In a real application, you would make a request to Binance API
  return [];
};

/**
 * Mock: Get recent trades
 */
export const getRecentTrades = async (symbol: string): Promise<any[]> => {
  // In a real application, you would make a request to Binance API
  return [];
};

/**
 * Mock: Place a market order
 */
export const placeMarketOrder = async (
  symbol: string, 
  side: 'BUY' | 'SELL', 
  quantity: number
): Promise<boolean> => {
  // In a real application, you would make a request to Binance API
  toast.success(`הוראת שוק בוצעה בהצלחה`, {
    description: `${side === 'BUY' ? 'קנייה' : 'מכירה'} של ${quantity} ${symbol}`
  });
  return true;
};

/**
 * Mock: Place a limit order
 */
export const placeLimitOrder = async (
  symbol: string, 
  side: 'BUY' | 'SELL', 
  quantity: number, 
  price: number
): Promise<boolean> => {
  // In a real application, you would make a request to Binance API
  toast.success(`הוראת לימיט בוצעה בהצלחה`, {
    description: `${side === 'BUY' ? 'קנייה' : 'מכירה'} של ${quantity} ${symbol} במחיר ${price}`
  });
  return true;
};
