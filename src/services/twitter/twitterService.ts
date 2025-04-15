
import { toast } from 'sonner';

// Key for storing Twitter credentials in local storage
const TWITTER_AUTH_KEY = 'levi_bot_twitter_credentials';

// Twitter credentials interface
export interface TwitterCredentials {
  apiKey: string;
  apiSecret: string;
  accessToken?: string;
  accessTokenSecret?: string;
  isConnected: boolean;
  lastConnected?: number;
  username?: string;
}

/**
 * התחברות לטוויטר
 */
export const connectToTwitter = async (credentials: Omit<TwitterCredentials, 'isConnected' | 'lastConnected'>): Promise<boolean> => {
  try {
    // בסביבת פיתוח נדמה התחברות מוצלחת
    
    // שמור את פרטי החיבור בלוקל סטורג'
    const fullCredentials: TwitterCredentials = {
      ...credentials,
      isConnected: true,
      lastConnected: Date.now()
    };
    
    localStorage.setItem(TWITTER_AUTH_KEY, JSON.stringify(fullCredentials));
    
    // שליחת אירוע שינוי חיבור
    window.dispatchEvent(new CustomEvent('twitter-connection-changed', {
      detail: { isConnected: true }
    }));
    
    // בסביבת אמת היינו עושים בדיקת תקפות של המפתחות מול ה-API
    console.log('Connected to Twitter with credentials:', credentials);
    
    return true;
  } catch (error) {
    console.error('Error connecting to Twitter:', error);
    toast.error('שגיאה בהתחברות לטוויטר', {
      description: 'אנא בדוק את פרטי ההתחברות ונסה שוב'
    });
    return false;
  }
};

/**
 * ניתוק מטוויטר
 */
export const disconnectFromTwitter = async (): Promise<void> => {
  localStorage.removeItem(TWITTER_AUTH_KEY);
  
  // שליחת אירוע שינוי חיבור
  window.dispatchEvent(new CustomEvent('twitter-connection-changed', {
    detail: { isConnected: false }
  }));
  
  console.log('Disconnected from Twitter');
};

/**
 * קבלת פרטי חיבור לטוויטר
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
 * בדיקה האם מחובר לטוויטר
 */
export const isTwitterConnected = (): boolean => {
  const credentials = getTwitterCredentials();
  return credentials?.isConnected === true;
};

/**
 * האזנה לשינויים בחיבור לטוויטר
 */
export const listenToTwitterConnectionChanges = (callback: (isConnected: boolean) => void): () => void => {
  const handleConnectionChange = (event: Event) => {
    const customEvent = event as CustomEvent<{ isConnected: boolean }>;
    callback(customEvent.detail.isConnected);
  };
  
  window.addEventListener('twitter-connection-changed', handleConnectionChange);
  
  return () => {
    window.removeEventListener('twitter-connection-changed', handleConnectionChange);
  };
};

/**
 * ניתוח סנטימנט - דמו בלבד
 * בסביבת אמת זה יתחבר ל-API של טוויטר
 */
export const analyzeSentiment = async (query: string, days: number = 7): Promise<any> => {
  console.log(`Analyzing sentiment for ${query} over the last ${days} days`);
  
  // בדמו תחזיר נתונים מוגדרים מראש
  return {
    positive: 65,
    negative: 15,
    neutral: 20,
    volume: 2487,
    uniqueUsers: 1243,
    totalImpact: 3800000,
    trend: 'positive',
    trendStrength: 'strong'
  };
};

/**
 * קבלת ציוצים לפי מילת מפתח - דמו בלבד
 */
export const getTweetsByKeyword = async (keyword: string, limit: number = 10): Promise<any[]> => {
  console.log(`Getting tweets for keyword: ${keyword}, limit: ${limit}`);
  
  // בדמו נחזיר מערך נתונים קבוע
  return [
    {
      id: '1',
      text: `This is a tweet about ${keyword}`,
      username: 'user1',
      profileImageUrl: 'https://randomuser.me/api/portraits/men/1.jpg',
      createdAt: new Date().toISOString(),
      likes: 123,
      retweets: 45,
      sentiment: 'positive'
    },
    {
      id: '2',
      text: `Another tweet about ${keyword} with some more text`,
      username: 'user2',
      profileImageUrl: 'https://randomuser.me/api/portraits/women/2.jpg',
      createdAt: new Date(Date.now() - 3600000).toISOString(),
      likes: 88,
      retweets: 12,
      sentiment: 'neutral'
    },
    {
      id: '3',
      text: `I'm not sure about ${keyword}, seems risky`,
      username: 'user3',
      profileImageUrl: 'https://randomuser.me/api/portraits/men/3.jpg',
      createdAt: new Date(Date.now() - 7200000).toISOString(),
      likes: 45,
      retweets: 5,
      sentiment: 'negative'
    }
  ];
};
