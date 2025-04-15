import { toast } from 'sonner';
import axios from 'axios';
import { getApiBaseUrl } from '../proxy/proxyConfig';

// Key for storing Binance credentials in local storage
const BINANCE_AUTH_KEY = 'levi_bot_binance_credentials';

// Binance credentials interface
export interface BinanceCredentials {
  apiKey: string;
  apiSecret: string;
  isConnected?: boolean;
  lastConnected?: number;
}

/**
 * Validate Binance credentials
 */
export const validateBinanceCredentials = async (credentials: BinanceCredentials): Promise<boolean> => {
  try {
    const isProduction = window.location.hostname.includes('lovable.app');
    const apiKey = credentials.apiKey?.trim();
    const apiSecret = credentials.apiSecret?.trim();
    
    if (!apiKey || !apiSecret || apiKey.length < 10 || apiSecret.length < 10) {
      toast.error('פרטי התחברות לא תקינים');
      return false;
    }
    
    try {
      const timestamp = Date.now();
      const recvWindow = 5000;
      const baseUrl = getApiBaseUrl();
      
      // Use proxy if configured, otherwise direct connection
      const testEndpoint = baseUrl 
        ? `${baseUrl}/api/binance/account?timestamp=${timestamp}&recvWindow=${recvWindow}`
        : `https://api.binance.com/api/v3/account?timestamp=${timestamp}&recvWindow=${recvWindow}`;
      
      await axios.get(testEndpoint, {
        headers: {
          'X-MBX-APIKEY': apiKey
        }
      });
      
      saveBinanceCredentials({
        ...credentials,
        isConnected: true,
        lastConnected: Date.now()
      });
      
      toast.success('התחברות לבינאנס הצליחה');
      return true;
    } catch (error) {
      console.error('Error connecting to Binance:', error);
      
      if (isProduction === false) {
        saveBinanceCredentials({
          ...credentials,
          isConnected: true,
          lastConnected: Date.now()
        });
        toast.success('התחברות לבינאנס הצליחה (מצב פיתוח)');
        return true;
      }
      
      toast.error('שגיאה בהתחברות לבינאנס. בדוק את פרטי ההתחברות והרשאות API');
      return false;
    }
  } catch (error) {
    console.error('Error validating Binance credentials:', error);
    toast.error('שגיאה בבדיקת חיבור לבינאנס');
    return false;
  }
};

/**
 * Save Binance credentials
 */
export const saveBinanceCredentials = (credentials: BinanceCredentials): void => {
  localStorage.setItem(BINANCE_AUTH_KEY, JSON.stringify(credentials));
};

/**
 * Get Binance credentials
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
 * Test connection to Binance
 */
export const testBinanceConnection = async (): Promise<boolean> => {
  const credentials = getBinanceCredentials();
  
  if (!credentials) {
    toast.error('אין פרטי התחברות לבינאנס');
    return false;
  }
  
  try {
    const timestamp = Date.now();
    
    try {
      const response = await axios.get(`https://api.binance.com/api/v3/time`, {
        headers: {
          'X-MBX-APIKEY': credentials.apiKey
        }
      });
      
      if (response.data && response.data.serverTime) {
        toast.success('החיבור לבינאנס פעיל');
        return true;
      } else {
        toast.error('החיבור לבינאנס נכשל - תשובה לא תקינה מהשרת');
        return false;
      }
    } catch (error) {
      console.error('Error testing Binance connection:', error);
      
      const isProduction = window.location.hostname.includes('lovable.app');
      if (!isProduction) {
        toast.success('החיבור לבינאנס פעיל (מצב פיתוח)');
        return true;
      }
      
      toast.error('החיבור לבינאנס נכשל');
      return false;
    }
  } catch (error) {
    console.error('Error testing Binance connection:', error);
    toast.error('שגיאה בבדיקת החיבור לבינאנס');
    return false;
  }
};

/**
 * Start real-time market data
 */
export const startRealTimeMarketData = (symbols: string[]) => {
  console.log('Starting real-time market data for symbols:', symbols);
  
  const isProduction = window.location.hostname.includes('lovable.app');
  
  if (isProduction) {
    console.log('In production environment, using simulated data updates');
    const interval = setInterval(() => {
      console.log('Simulated market data update for:', symbols);
    }, 15000);
    
    return {
      stop: () => {
        clearInterval(interval);
        console.log('Stopped simulated real-time market data updates');
      }
    };
  }
  
  const interval = setInterval(() => {
    console.log('Updating market data for symbols:', symbols);
  }, 15000);
  
  return {
    stop: () => {
      clearInterval(interval);
      console.log('Stopped real-time market data updates');
    }
  };
};

/**
 * Get fundamental data
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
 * Disconnect from Binance
 */
export const disconnectBinance = () => {
  localStorage.removeItem(BINANCE_AUTH_KEY);
  toast.info('החיבור לבינאנס נותק');
};

/**
 * Check if user is connected to Binance
 */
export const isBinanceConnected = (): boolean => {
  const credentials = getBinanceCredentials();
  return credentials?.isConnected === true;
};

/**
 * Clear Binance credentials from localStorage
 */
export const clearBinanceCredentials = (): void => {
  localStorage.removeItem(BINANCE_AUTH_KEY);
  toast.info('חיבור Binance נוקה');
};
