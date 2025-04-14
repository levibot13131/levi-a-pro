
import { toast } from 'sonner';

// Constants
const TRADINGVIEW_API_KEY_STORAGE = 'tradingview_api_key';
const TRADINGVIEW_USERNAME_STORAGE = 'tradingview_username';
const TRADINGVIEW_CONNECTION_STATE = 'tradingview_connected';

/**
 * Get TradingView API key from localStorage
 */
export const getTradingViewApiKey = (): string | null => {
  return localStorage.getItem(TRADINGVIEW_API_KEY_STORAGE);
};

/**
 * Set TradingView API key in localStorage
 */
export const setTradingViewApiKey = (apiKey: string): void => {
  localStorage.setItem(TRADINGVIEW_API_KEY_STORAGE, apiKey);
};

/**
 * Get TradingView username from localStorage
 */
export const getTradingViewUsername = (): string | null => {
  return localStorage.getItem(TRADINGVIEW_USERNAME_STORAGE);
};

/**
 * Set TradingView username in localStorage
 */
export const setTradingViewUsername = (username: string): void => {
  localStorage.setItem(TRADINGVIEW_USERNAME_STORAGE, username);
};

/**
 * Get TradingView connection state from localStorage
 */
export const getTradingViewConnectionState = (): boolean => {
  return localStorage.getItem(TRADINGVIEW_CONNECTION_STATE) === 'true';
};

/**
 * Set TradingView connection state in localStorage
 */
export const setTradingViewConnectionState = (isConnected: boolean): void => {
  localStorage.setItem(TRADINGVIEW_CONNECTION_STATE, isConnected.toString());
};

/**
 * Save TradingView credentials
 */
export const saveTradingViewCredentials = (username: string, apiKey: string): void => {
  setTradingViewUsername(username);
  setTradingViewApiKey(apiKey);
  setTradingViewConnectionState(true);
  toast.success('פרטי TradingView נשמרו בהצלחה');
};

/**
 * Check if TradingView is configured
 */
export const isTradingViewConfigured = (): boolean => {
  const apiKey = getTradingViewApiKey();
  const username = getTradingViewUsername();
  return !!apiKey && !!username && getTradingViewConnectionState();
};

/**
 * Clear TradingView credentials
 */
export const clearTradingViewCredentials = (): void => {
  localStorage.removeItem(TRADINGVIEW_API_KEY_STORAGE);
  localStorage.removeItem(TRADINGVIEW_USERNAME_STORAGE);
  localStorage.removeItem(TRADINGVIEW_CONNECTION_STATE);
  toast.success('פרטי TradingView נמחקו');
};

/**
 * Validate TradingView credentials
 * Note: This is a mock function since we don't have a real API to validate against
 */
export const validateTradingViewCredentials = async (username: string, apiKey: string): Promise<boolean> => {
  if (!username || !apiKey) {
    toast.error('שם משתמש ומפתח API נדרשים');
    return false;
  }
  
  try {
    // For now, we'll just simulate a successful validation
    // In a real implementation, we would make a call to the TradingView API
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Save credentials
    saveTradingViewCredentials(username, apiKey);
    
    return true;
  } catch (error) {
    console.error('Error validating TradingView credentials:', error);
    toast.error('שגיאה באימות פרטי TradingView');
    return false;
  }
};
