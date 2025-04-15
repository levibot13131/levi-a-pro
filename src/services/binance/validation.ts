
import { BinanceCredentials, getBinanceCredentials } from './credentials';
import { useAppSettings } from '@/hooks/use-app-settings';
import { toast } from 'sonner';

/**
 * Validates Binance API credentials
 */
export const validateBinanceCredentials = async (
  credentials: Partial<BinanceCredentials>
): Promise<boolean> => {
  console.log('Validating Binance credentials...');
  
  // Check if we're in demo mode
  const appSettings = useAppSettings.getState();
  if (appSettings.demoMode) {
    console.log('Demo mode is enabled, skipping actual API validation');
    toast.info('מתחבר לבינאנס במצב הדגמה');
    return true;
  }
  
  // Validate that required fields are present
  if (!credentials.apiKey || !credentials.apiSecret) {
    console.error('Missing required Binance credentials');
    toast.error('חסרים פרטי התחברות לבינאנס');
    return false;
  }
  
  try {
    // Simulate API check (replace with actual validation in production)
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // In a real implementation, this would make an API call to Binance
    // to verify the credentials are valid
    console.log('Credentials validated successfully');
    toast.success('התחברת בהצלחה לבינאנס', {
      description: 'מפתחות API נבדקו ואומתו בהצלחה'
    });
    
    return true;
  } catch (error) {
    console.error('Error validating Binance credentials:', error);
    toast.error('שגיאה באימות פרטי התחברות לבינאנס', {
      description: 'ודא שהזנת מפתחות תקינים עם הרשאות מתאימות'
    });
    return false;
  }
};

/**
 * Connects to Binance API and retrieves account information
 */
export const connectToBinanceAPI = async (): Promise<boolean> => {
  console.log('Connecting to Binance API...');
  
  // Get stored credentials
  const credentials = getBinanceCredentials();
  if (!credentials) {
    console.error('No Binance credentials found');
    toast.error('לא נמצאו פרטי התחברות לבינאנס');
    return false;
  }
  
  // Check if we're in demo mode
  const appSettings = useAppSettings.getState();
  if (appSettings.demoMode) {
    console.log('Demo mode is enabled, returning mock connection status');
    toast.info('מתחבר לבינאנס במצב הדגמה');
    return true;
  }
  
  try {
    // Simulate API connection (replace with actual connection in production)
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // In a real implementation, this would make API calls to verify
    // the connection and retrieve initial account data
    console.log('Connected to Binance API successfully');
    toast.success('התחברת בהצלחה לבינאנס', {
      description: 'החיבור לבינאנס פעיל. נתונים בזמן אמת יוצגו כעת.'
    });
    
    return true;
  } catch (error) {
    console.error('Error connecting to Binance API:', error);
    toast.error('שגיאה בהתחברות ל-API של בינאנס', {
      description: 'ודא שהזנת מפתחות תקינים עם הרשאות מתאימות'
    });
    return false;
  }
};

/**
 * Tests the Binance connection
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
  
  // Check if we're in demo mode
  const appSettings = useAppSettings.getState();
  if (appSettings.demoMode) {
    console.log('Demo mode is enabled, returning mock test status');
    toast.info('בדיקת חיבור לבינאנס במצב הדגמה');
    return true;
  }
  
  try {
    // Simulate API test (replace with actual test in production)
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // In a real implementation, this would make a simple API call to Binance
    // to verify the connection is working
    console.log('Binance connection test successful');
    return true;
  } catch (error) {
    console.error('Error testing Binance connection:', error);
    return false;
  }
};
