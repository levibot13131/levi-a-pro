
import { toast } from 'sonner';
import { 
  BinanceCredentials, 
  getBinanceCredentials,
  saveBinanceCredentials,
  disconnectBinance
} from './credentials';
import { 
  validateBinanceCredentials, 
  connectToBinanceAPI 
} from './validation';
import {
  getFundamentalData,
  startRealTimeMarketData,
  listenToBinanceUpdates,
  setRealTimeMode,
  isRealTimeMode
} from './marketData';

/**
 * Test connection to Binance API
 */
export const testBinanceConnection = async (): Promise<boolean> => {
  console.log('Testing Binance connection...');
  
  // Get stored credentials
  const credentials = getBinanceCredentials();
  if (!credentials) {
    console.error('No Binance credentials found');
    toast.error('לא נמצאו פרטי התחברות לבינאנס');
    return false;
  }
  
  try {
    // Use the validation function from validation.ts
    return await connectToBinanceAPI();
  } catch (error) {
    console.error('Error testing Binance connection:', error);
    toast.error('שגיאה בבדיקת חיבור לבינאנס');
    return false;
  }
};

// Re-export functions from other files for simpler imports
export {
  BinanceCredentials,
  getBinanceCredentials,
  saveBinanceCredentials,
  disconnectBinance,
  validateBinanceCredentials,
  connectToBinanceAPI,
  getFundamentalData,
  startRealTimeMarketData,
  listenToBinanceUpdates,
  setRealTimeMode,
  isRealTimeMode
};

// Add alias for backward compatibility
export const clearBinanceCredentials = disconnectBinance;
