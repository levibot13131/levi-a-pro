
import { toast } from 'sonner';

export interface BinanceCredentials {
  apiKey: string;
  apiSecret: string;
  testnet: boolean;
  lastConnected: number;
}

// Check if Binance is connected
export const isBinanceConnected = (): boolean => {
  const credentials = getBinanceCredentials();
  return !!credentials;
};

// Get Binance credentials from localStorage
export const getBinanceCredentials = (): BinanceCredentials | null => {
  try {
    const storedCredentials = localStorage.getItem('binance_api_keys');
    if (!storedCredentials) return null;
    return JSON.parse(storedCredentials);
  } catch (error) {
    console.error('Error parsing Binance credentials:', error);
    return null;
  }
};

// Connect to Binance with API keys
export const connectToBinance = async (
  credentials: Omit<BinanceCredentials, 'lastConnected'>
): Promise<boolean> => {
  try {
    // In a real application, we would validate these credentials with the Binance API
    // For this demo, we'll just simulate a successful connection
    const enhancedCredentials: BinanceCredentials = {
      ...credentials,
      lastConnected: Date.now()
    };
    
    localStorage.setItem('binance_api_keys', JSON.stringify(enhancedCredentials));
    toast.success('התחברת בהצלחה לבינאנס');
    return true;
  } catch (error) {
    console.error('Error connecting to Binance:', error);
    toast.error('שגיאה בהתחברות לבינאנס');
    return false;
  }
};

// Disconnect from Binance
export const disconnectBinance = (): void => {
  localStorage.removeItem('binance_api_keys');
  toast.success('התנתקת בהצלחה מבינאנס');
};

// Test Binance API connection
export const testBinanceConnection = async (): Promise<boolean> => {
  const credentials = getBinanceCredentials();
  if (!credentials) return false;
  
  try {
    // In a real application, this would make a test API call to Binance
    // For this demo, we'll just simulate a successful connection
    toast.success('בדיקת התחברות לבינאנס הצליחה');
    return true;
  } catch (error) {
    console.error('Error testing Binance connection:', error);
    toast.error('בדיקת התחברות לבינאנס נכשלה');
    return false;
  }
};
