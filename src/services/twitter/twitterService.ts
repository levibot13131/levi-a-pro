
import { toast } from 'sonner';

// Storage key for Twitter credentials
const TWITTER_AUTH_KEY = 'twitter_auth_credentials';

// Twitter credentials interface
export interface TwitterCredentials {
  apiKey: string;
  apiSecret: string;
  bearerToken: string;
  username: string;
  isConnected: boolean;
  lastConnected?: number;
}

/**
 * Save Twitter API credentials
 */
export const saveTwitterCredentials = (credentials: TwitterCredentials): void => {
  localStorage.setItem(TWITTER_AUTH_KEY, JSON.stringify({
    ...credentials,
    isConnected: true,
    lastConnected: Date.now()
  }));
};

/**
 * Get Twitter API credentials
 */
export const getTwitterCredentials = (): TwitterCredentials | null => {
  const credentials = localStorage.getItem(TWITTER_AUTH_KEY);
  
  if (!credentials) return null;
  
  try {
    return JSON.parse(credentials) as TwitterCredentials;
  } catch (error) {
    console.error('Error parsing Twitter credentials:', error);
    return null;
  }
};

/**
 * Connect to Twitter API
 */
export const connectToTwitter = async (
  apiKey: string,
  apiSecret: string,
  bearerToken: string,
  username: string
): Promise<boolean> => {
  try {
    // Simulate API validation
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // In a real implementation, validate the API credentials
    const isValid = apiKey && apiSecret && bearerToken && username;
    
    if (isValid) {
      saveTwitterCredentials({
        apiKey,
        apiSecret,
        bearerToken,
        username,
        isConnected: true
      });
      
      toast.success('התחברות לטוויטר הצליחה', {
        description: `חיבור API הוגדר עבור המשתמש ${username}`
      });
      return true;
    } else {
      toast.error('פרטי API לא תקינים', {
        description: 'אנא וודא שהזנת את כל פרטי ה-API הנדרשים'
      });
      return false;
    }
  } catch (error) {
    console.error('Error connecting to Twitter:', error);
    toast.error('שגיאה בהתחברות לטוויטר', {
      description: 'אנא וודא שפרטי ה-API תקינים ונסה שוב'
    });
    return false;
  }
};

/**
 * Disconnect from Twitter
 */
export const disconnectFromTwitter = (): void => {
  localStorage.removeItem(TWITTER_AUTH_KEY);
  toast.info('החיבור לטוויטר נותק');
};

/**
 * Check if connected to Twitter
 */
export const isTwitterConnected = (): boolean => {
  const credentials = getTwitterCredentials();
  return !!credentials?.isConnected;
};

/**
 * Fetch Twitter sentiment data (mock implementation)
 */
export const fetchTwitterSentiment = async (
  keyword: string, 
  days: number = 7
): Promise<any[]> => {
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Generate mock sentiment data
    const data = [];
    const now = new Date();
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      
      const dateStr = `${date.getMonth() + 1}/${date.getDate()}`;
      const positive = 30 + Math.random() * 40;
      const negative = 10 + Math.random() * 20;
      const neutral = 100 - positive - negative;
      
      data.push({
        date: dateStr,
        positive,
        negative,
        neutral,
        volume: 1000 + Math.random() * 5000
      });
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching Twitter sentiment:', error);
    toast.error('שגיאה בטעינת נתוני סנטימנט מטוויטר');
    return [];
  }
};
