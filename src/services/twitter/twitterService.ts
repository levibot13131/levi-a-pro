
import { toast } from 'sonner';

export interface TwitterCredentials {
  apiKey: string;
  apiSecret: string;
  bearerToken: string;
  accessToken: string;
  accessTokenSecret: string;
  isConnected: boolean;
  lastConnected?: number;
  username?: string;
}

const TWITTER_CREDS_KEY = 'levi_bot_twitter_credentials';

// קבלת פרטי התחברות לטוויטר
export const getTwitterCredentials = (): TwitterCredentials | null => {
  try {
    const savedCreds = localStorage.getItem(TWITTER_CREDS_KEY);
    if (savedCreds) {
      return JSON.parse(savedCreds);
    }
  } catch (error) {
    console.error('Error parsing Twitter credentials:', error);
  }
  return null;
};

// שמירת פרטי התחברות לטוויטר
export const saveTwitterCredentials = (credentials: TwitterCredentials): void => {
  try {
    localStorage.setItem(TWITTER_CREDS_KEY, JSON.stringify(credentials));
    console.log('Twitter credentials saved');
  } catch (error) {
    console.error('Error saving Twitter credentials:', error);
    toast.error('שגיאה בשמירת פרטי התחברות לטוויטר');
  }
};

// בדיקה האם מחובר לטוויטר
export const isTwitterConnected = (): boolean => {
  const creds = getTwitterCredentials();
  return !!creds?.isConnected;
};

// התחברות לטוויטר
export const connectToTwitter = async (credentials: Partial<TwitterCredentials>): Promise<boolean> => {
  try {
    console.log('Connecting to Twitter...');
    
    // בדיקה שיש את כל הפרטים הנדרשים
    if (!credentials.apiKey || !credentials.apiSecret || !credentials.bearerToken) {
      toast.error('חסרים פרטי התחברות לטוויטר');
      return false;
    }
    
    // במצב פיתוח, נדמה הצלחת התחברות
    setTimeout(() => {
      const fullCredentials: TwitterCredentials = {
        apiKey: credentials.apiKey || '',
        apiSecret: credentials.apiSecret || '',
        bearerToken: credentials.bearerToken || '',
        accessToken: credentials.accessToken || '',
        accessTokenSecret: credentials.accessTokenSecret || '',
        isConnected: true,
        lastConnected: Date.now(),
        username: '@levi_trader_bot'
      };
      
      saveTwitterCredentials(fullCredentials);
      
      toast.success('התחברת בהצלחה לטוויטר', {
        description: 'המפתחות נשמרו במכשיר שלך בלבד.'
      });
    }, 1000);
    
    return true;
  } catch (error) {
    console.error('Error connecting to Twitter:', error);
    toast.error('שגיאה בהתחברות לטוויטר');
    return false;
  }
};

// התנתקות מטוויטר
export const disconnectFromTwitter = (): void => {
  try {
    localStorage.removeItem(TWITTER_CREDS_KEY);
    console.log('Disconnected from Twitter');
    toast.info('התנתקת מחשבון הטוויטר');
  } catch (error) {
    console.error('Error disconnecting from Twitter:', error);
    toast.error('שגיאה בהתנתקות מטוויטר');
  }
};

// פונקציה לשליפת נתוני סנטימנט מטוויטר
export const fetchTwitterSentiment = async (cryptoName: string, days: number = 7): Promise<any[]> => {
  console.log(`Fetching Twitter sentiment for ${cryptoName} over ${days} days`);
  
  // Generate mock data
  const generateSentimentData = (days: number) => {
    const data = [];
    const today = new Date();
    
    for (let i = 0; i < days; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - (days - i - 1));
      
      // Random sentiment values
      const positive = 30 + Math.floor(Math.random() * 40); // 30-70%
      const neutral = Math.floor(Math.random() * 20); // 0-20%
      const negative = 100 - positive - neutral;
      
      // Mentions and volume with some randomness but trending
      const baseVolume = 500 + (i * 50); // Base volume increases over time
      const randomFactor = 0.8 + (Math.random() * 0.4); // 0.8-1.2 random factor
      
      data.push({
        date: date.toISOString().split('T')[0],
        positive,
        neutral,
        negative,
        mentions: Math.floor(baseVolume * randomFactor * 1.5),
        volume: Math.floor(baseVolume * randomFactor),
        sentimentScore: ((positive * 1) + (neutral * 0.5) + (negative * 0)) / 100,
      });
    }
    
    return data;
  };
  
  // Wait for a short time to simulate API call
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return generateSentimentData(days);
};
