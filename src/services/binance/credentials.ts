
import { toast } from 'sonner';

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
 * Clear Binance credentials from localStorage
 */
export const clearBinanceCredentials = (): void => {
  localStorage.removeItem(BINANCE_AUTH_KEY);
  toast.info('חיבור Binance נוקה');
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
