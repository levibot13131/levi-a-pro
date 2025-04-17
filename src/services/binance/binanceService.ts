
import { toast } from 'sonner';

/**
 * Interface for Binance API credentials
 * @property apiKey - Binance API key
 * @property apiSecret - Binance API secret
 * @property testnet - Whether to use Binance testnet
 * @property lastConnected - Timestamp of last successful connection
 * @property isConnected - Deprecated; use lastConnected to determine connection status
 */
export interface BinanceCredentials {
  apiKey: string;
  apiSecret: string;
  testnet: boolean;
  lastConnected: number;
  isConnected?: boolean; // Added for backward compatibility
}

/**
 * Checks if Binance is connected
 * @returns boolean indicating connection status
 */
export const isBinanceConnected = (): boolean => {
  const credentials = getBinanceCredentials();
  return !!credentials;
};

/**
 * Gets Binance credentials from localStorage
 * @returns BinanceCredentials or null if not found/invalid
 */
export const getBinanceCredentials = (): BinanceCredentials | null => {
  try {
    const storedCredentials = localStorage.getItem('binance_api_keys');
    if (!storedCredentials) return null;
    
    const credentials = JSON.parse(storedCredentials);
    // Add isConnected property for backward compatibility
    credentials.isConnected = true;
    // Ensure testnet property exists
    if (credentials.testnet === undefined) {
      credentials.testnet = false;
    }
    return credentials;
  } catch (error) {
    console.error('Error parsing Binance credentials:', error);
    return null;
  }
};

/**
 * Connects to Binance with API keys
 * @param credentials - Object containing apiKey, apiSecret, and testnet flag
 * @returns Promise resolving to boolean indicating success
 */
export const connectToBinance = async (
  credentials: Omit<BinanceCredentials, 'lastConnected' | 'isConnected'>
): Promise<boolean> => {
  try {
    // In a real application, we would validate these credentials with the Binance API
    // For this demo, we'll just simulate a successful connection
    const enhancedCredentials: BinanceCredentials = {
      ...credentials,
      lastConnected: Date.now(),
      isConnected: true,
      testnet: credentials.testnet ?? false
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

/**
 * Disconnects from Binance
 */
export const disconnectBinance = (): void => {
  localStorage.removeItem('binance_api_keys');
  toast.success('התנתקת בהצלחה מבינאנס');
};

/**
 * Tests Binance API connection
 * @returns Promise resolving to boolean indicating success
 */
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

/**
 * Validates Binance credentials and connects if valid
 * @param credentials - Object containing apiKey, apiSecret, and optional testnet flag
 * @returns Promise resolving to boolean indicating success
 */
export const validateBinanceCredentials = async (
  credentials: Partial<BinanceCredentials>
): Promise<boolean> => {
  if (!credentials.apiKey || !credentials.apiSecret) {
    toast.error('חסרים פרטי התחברות לבינאנס');
    return false;
  }
  
  try {
    // Enhance credentials with default values if needed
    const enhancedCredentials = {
      apiKey: credentials.apiKey,
      apiSecret: credentials.apiSecret,
      testnet: credentials.testnet ?? false,
      lastConnected: Date.now(),
      isConnected: true
    };
    
    // Store the credentials
    localStorage.setItem('binance_api_keys', JSON.stringify(enhancedCredentials));
    
    // Test the connection
    return await testBinanceConnection();
  } catch (error) {
    console.error('Error validating Binance credentials:', error);
    return false;
  }
};

// For backward compatibility with existing code, alias clearBinanceCredentials to disconnectBinance
export const clearBinanceCredentials = disconnectBinance;

/**
 * Saves Binance credentials
 * @param credentials - Object containing credential information
 */
export const saveBinanceCredentials = (credentials: any): void => {
  const enhancedCredentials: BinanceCredentials = {
    apiKey: credentials.apiKey,
    apiSecret: credentials.apiSecret,
    testnet: credentials.testnet ?? false,
    lastConnected: Date.now(),
    isConnected: true
  };
  
  localStorage.setItem('binance_api_keys', JSON.stringify(enhancedCredentials));
  toast.success('פרטי התחברות לבינאנס נשמרו בהצלחה');
};
