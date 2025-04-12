
import { toast } from 'sonner';

// מפתח לשמירת פרטי התחברות בלוקל סטורג'
const BINANCE_AUTH_KEY = 'levi_bot_binance_credentials';

// פרטי התחברות Binance
export interface BinanceCredentials {
  apiKey: string;
  apiSecret: string;
  isConnected?: boolean;
  lastConnected?: number;
}

/**
 * אימות פרטי התחברות Binance
 */
export const validateBinanceCredentials = async (credentials: BinanceCredentials): Promise<boolean> => {
  try {
    // סימולציה של בדיקת API
    return new Promise(resolve => {
      setTimeout(() => {
        // בדיקה אם קיימים פרטי חיבור תקינים
        const valid = credentials.apiKey?.trim().length > 10 && 
                     credentials.apiSecret?.trim().length > 10;
          
        if (valid) {
          saveBinanceCredentials({
            ...credentials,
            isConnected: true,
            lastConnected: Date.now()
          });
        }
        
        resolve(valid);
      }, 1500); // סימולציה של זמן תגובה מהשרת
    });
  } catch (error) {
    console.error('Error validating Binance credentials:', error);
    return false;
  }
};

/**
 * שמירת פרטי התחברות Binance
 */
export const saveBinanceCredentials = (credentials: BinanceCredentials): void => {
  localStorage.setItem(BINANCE_AUTH_KEY, JSON.stringify(credentials));
};

/**
 * קבלת פרטי התחברות Binance
 */
export const getBinanceCredentials = (): BinanceCredentials | null => {
  const credentials = localStorage.getItem(BINANCE_AUTH_KEY);
  
  if (!credentials) return null;
  
  try {
    return JSON.parse(credentials) as BinanceCredentials;
  } catch (error) {
    console.error('Error parsing Binance credentials:', error);
    return null;
  }
};

/**
 * בדיקת חיבור לבינאנס
 */
export const testBinanceConnection = async (): Promise<boolean> => {
  const credentials = getBinanceCredentials();
  
  if (!credentials) {
    toast.error('אין פרטי התחברות לבינאנס');
    return false;
  }
  
  try {
    // סימולציה של בדיקת קישוריות
    return new Promise(resolve => {
      setTimeout(() => {
        const success = true; // סימולציה של הצלחה
        
        if (success) {
          toast.success('החיבור לבינאנס פעיל');
        } else {
          toast.error('החיבור לבינאנס נכשל');
        }
        
        resolve(success);
      }, 1000);
    });
  } catch (error) {
    console.error('Error testing Binance connection:', error);
    toast.error('שגיאה בבדיקת החיבור לבינאנס');
    return false;
  }
};

/**
 * התחלת נתוני שוק בזמן אמת
 */
export const startRealTimeMarketData = (symbols: string[]) => {
  console.log('Starting real-time market data for symbols:', symbols);
  
  // סימולציה של התחלת עדכונים בזמן אמת
  const interval = setInterval(() => {
    // לוגיקה של עדכון נתונים בזמן אמת
    console.log('Updating market data for symbols:', symbols);
  }, 15000);
  
  // החזרת פונקציה לעצירת העדכונים
  return {
    stop: () => {
      clearInterval(interval);
      console.log('Stopped real-time market data updates');
    }
  };
};

/**
 * קבלת נתונים בסיסיים
 */
export const getFundamentalData = (symbol: string) => {
  return {
    symbol,
    name: symbol.replace('USDT', ''),
    marketCap: Math.random() * 1000000000,
    volume24h: Math.random() * 100000000,
    circulatingSupply: Math.random() * 100000000,
    allTimeHigh: Math.random() * 100000,
    launchDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000)
  };
};

/**
 * ניתוק חיבור לבינאנס
 */
export const disconnectBinance = () => {
  localStorage.removeItem(BINANCE_AUTH_KEY);
  toast.info('החיבור לבינאנס נותק');
};

/**
 * בדיקה האם המשתמש מחובר לבינאנס
 */
export const isBinanceConnected = (): boolean => {
  const credentials = getBinanceCredentials();
  return credentials?.isConnected === true;
};
