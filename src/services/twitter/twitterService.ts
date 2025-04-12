
import { toast } from 'sonner';

// Twitter API credentials storage key
const TWITTER_API_KEYS_KEY = 'twitter_api_keys';

// Twitter API Credentials
export interface TwitterCredentials {
  apiKey: string;
  apiSecret: string;
  bearerToken: string;
  isConnected: boolean;
  lastConnected?: number;
}

/**
 * Save Twitter API credentials
 */
export const saveTwitterCredentials = (credentials: Omit<TwitterCredentials, 'isConnected' | 'lastConnected'>): TwitterCredentials => {
  const savedCreds: TwitterCredentials = {
    ...credentials,
    isConnected: true,
    lastConnected: Date.now()
  };
  
  localStorage.setItem(TWITTER_API_KEYS_KEY, JSON.stringify(savedCreds));
  toast.success('התחברות ל-Twitter בוצעה בהצלחה');
  
  return savedCreds;
};

/**
 * Get Twitter API credentials
 */
export const getTwitterCredentials = (): TwitterCredentials | null => {
  const credentials = localStorage.getItem(TWITTER_API_KEYS_KEY);
  
  if (!credentials) return null;
  
  try {
    return JSON.parse(credentials) as TwitterCredentials;
  } catch (error) {
    console.error('Error parsing Twitter credentials:', error);
    return null;
  }
};

/**
 * Validate Twitter API credentials
 * In a real implementation, this would make a request to Twitter API
 */
export const validateTwitterCredentials = async (
  apiKey: string,
  apiSecret: string,
  bearerToken: string
): Promise<boolean> => {
  try {
    // Simulate API validation delay
    return new Promise(resolve => {
      setTimeout(() => {
        // Very basic validation
        const valid = apiKey?.trim().length > 10 && 
                     apiSecret?.trim().length > 10 && 
                     bearerToken?.trim().length > 10;
        
        if (valid) {
          saveTwitterCredentials({ apiKey, apiSecret, bearerToken });
        }
        
        resolve(valid);
      }, 1500);
    });
  } catch (error) {
    console.error('Error validating Twitter credentials:', error);
    return false;
  }
};

/**
 * Disconnect from Twitter
 */
export const disconnectTwitter = (): void => {
  localStorage.removeItem(TWITTER_API_KEYS_KEY);
  toast.info('החיבור ל-Twitter נותק');
};

/**
 * Check if connected to Twitter
 */
export const isTwitterConnected = (): boolean => {
  const credentials = getTwitterCredentials();
  return credentials?.isConnected === true;
};

/**
 * Get tweets from key figures
 * In a real implementation, this would make a request to Twitter API
 */
export const getKeyFigureTweets = async (): Promise<any[]> => {
  if (!isTwitterConnected()) {
    toast.error('אנא התחבר ל-Twitter כדי לקבל ציוצים');
    return [];
  }
  
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Mock data - in a real app this would come from the Twitter API
  return [
    {
      id: '1',
      author: 'Vitalik Buterin',
      username: 'VitalikButerin',
      content: 'Excited about the upcoming Ethereum updates! More scalability and efficiency coming soon.',
      timestamp: Date.now() - (2 * 60 * 60 * 1000), // 2 hours ago
      likes: 3200,
      retweets: 842,
      sentiment: 'positive'
    },
    {
      id: '2',
      author: 'CZ Binance',
      username: 'cz_binance',
      content: 'Binance volume hit new all-time high today. Thank you for your support!',
      timestamp: Date.now() - (5 * 60 * 60 * 1000), // 5 hours ago
      likes: 5100,
      retweets: 1240,
      sentiment: 'positive'
    },
    {
      id: '3',
      author: 'Michael Saylor',
      username: 'michael_saylor',
      content: 'Bitcoin is digital energy. Its value is derived from its ability to provide final settlement to billions of people via an incorruptible, energy-backed monetary network.',
      timestamp: Date.now() - (8 * 60 * 60 * 1000), // 8 hours ago
      likes: 4800,
      retweets: 1540,
      sentiment: 'positive'
    },
    {
      id: '4',
      author: 'Elon Musk',
      username: 'elonmusk',
      content: 'Crypto seems promising, but please invest with caution.',
      timestamp: Date.now() - (12 * 60 * 60 * 1000), // 12 hours ago
      likes: 128000,
      retweets: 24200,
      sentiment: 'neutral'
    }
  ];
};

/**
 * Get setup instructions for Twitter API
 */
export const getTwitterSetupInstructions = (): string => {
  return `
1. צור חשבון פיתוח ב-Twitter Developer Portal: https://developer.twitter.com/
2. צור פרויקט חדש ואפליקציה
3. קבל את מפתחות ה-API (API Key, API Secret) ואת ה-Bearer Token
4. הזן את הפרטים במערכת
  `;
};
