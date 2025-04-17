
import { toast } from 'sonner';

export interface TradingViewCredentials {
  username: string;
  password?: string; // We won't store this in localStorage for security
  apiKey?: string;   // Alternative to password
  lastConnected: number;
}

// Check if TradingView is connected
export const isTradingViewConnected = (): boolean => {
  const credentials = getTradingViewCredentials();
  return !!credentials;
};

// Get TradingView credentials from localStorage
export const getTradingViewCredentials = (): TradingViewCredentials | null => {
  try {
    const storedCredentials = localStorage.getItem('tradingview_auth_credentials');
    if (!storedCredentials) return null;
    return JSON.parse(storedCredentials);
  } catch (error) {
    console.error('Error parsing TradingView credentials:', error);
    return null;
  }
};

// Validate and save TradingView credentials
export const validateTradingViewCredentials = async (
  credentials: { username: string; password?: string; apiKey?: string }
): Promise<boolean> => {
  try {
    // In a real application, we would validate these credentials with the TradingView API
    // For this demo, we'll just simulate a successful validation
    
    // Check if we have either password or apiKey
    if (!credentials.password && !credentials.apiKey) {
      return false;
    }
    
    const enhancedCredentials: TradingViewCredentials = {
      username: credentials.username,
      apiKey: credentials.apiKey,
      lastConnected: Date.now()
    };
    
    localStorage.setItem('tradingview_auth_credentials', JSON.stringify(enhancedCredentials));
    toast.success('התחברת בהצלחה ל-TradingView');
    return true;
  } catch (error) {
    console.error('Error validating TradingView credentials:', error);
    return false;
  }
};

// Disconnect from TradingView
export const disconnectTradingView = (): void => {
  localStorage.removeItem('tradingview_auth_credentials');
  toast.success('התנתקת בהצלחה מ-TradingView');
};

// Initialize TradingView integration
export const initializeTradingView = (): boolean => {
  if (!isTradingViewConnected()) {
    return false;
  }
  
  try {
    // Here we would initialize any TradingView specific services
    // For this demo, we'll just return true
    return true;
  } catch (error) {
    console.error('Error initializing TradingView:', error);
    return false;
  }
};
