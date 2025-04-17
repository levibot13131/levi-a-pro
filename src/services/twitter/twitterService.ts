
import { toast } from 'sonner';

// Twitter credentials interface
export interface TwitterCredentials {
  apiKey: string;
  apiSecret: string;
  bearerToken: string;
  username?: string;
  lastConnected: number;
}

// Check if environment has pre-configured Twitter credentials
const hasEnvCredentials = () => {
  return !!(
    import.meta.env.VITE_TWITTER_API_KEY &&
    import.meta.env.VITE_TWITTER_API_SECRET &&
    import.meta.env.VITE_TWITTER_BEARER_TOKEN
  );
};

// Initialize credentials from environment variables if available
const initFromEnv = (): TwitterCredentials | null => {
  if (!hasEnvCredentials()) return null;
  
  return {
    apiKey: import.meta.env.VITE_TWITTER_API_KEY as string,
    apiSecret: import.meta.env.VITE_TWITTER_API_SECRET as string,
    bearerToken: import.meta.env.VITE_TWITTER_BEARER_TOKEN as string,
    username: import.meta.env.VITE_TWITTER_USERNAME as string || 'env-user',
    lastConnected: Date.now()
  };
};

// Check if Twitter is connected
export const isTwitterConnected = (): boolean => {
  const credentials = getTwitterCredentials();
  return !!credentials && !!credentials.bearerToken;
};

// Get Twitter credentials from localStorage or environment
export const getTwitterCredentials = (): TwitterCredentials | null => {
  try {
    // First check localStorage
    const storedCredentials = localStorage.getItem('twitter_api_keys');
    if (storedCredentials) return JSON.parse(storedCredentials);
    
    // If not in localStorage, check environment
    return initFromEnv();
  } catch (error) {
    console.error('Error parsing Twitter credentials:', error);
    return null;
  }
};

// Connect to Twitter with API keys
export const connectToTwitter = async (credentials: Omit<TwitterCredentials, 'lastConnected'>): Promise<boolean> => {
  try {
    // In a real application, we would validate these credentials with the Twitter API
    // For this demo, we'll just simulate a successful connection
    const enhancedCredentials: TwitterCredentials = {
      ...credentials,
      username: credentials.username || 'user' + Math.floor(Math.random() * 1000),
      lastConnected: Date.now()
    };
    
    localStorage.setItem('twitter_api_keys', JSON.stringify(enhancedCredentials));
    toast.success('התחברת בהצלחה לטוויטר');
    return true;
  } catch (error) {
    console.error('Error connecting to Twitter:', error);
    toast.error('שגיאה בהתחברות לטוויטר');
    return false;
  }
};

// Disconnect from Twitter
export const disconnectFromTwitter = (): void => {
  localStorage.removeItem('twitter_api_keys');
  toast.success('התנתקת בהצלחה מטוויטר');
};

// Mock Twitter sentiment data
export const fetchTwitterSentiment = async (
  symbol: string,
  days: number = 7
): Promise<any[]> => {
  // This would be an API call in a real application
  return new Promise((resolve) => {
    setTimeout(() => {
      const data = generateMockSentimentData(symbol, days);
      resolve(data);
    }, 1500);
  });
};

// Generate mock sentiment data
const generateMockSentimentData = (symbol: string, days: number): any[] => {
  const data = [];
  const now = Date.now();
  const dayMs = 24 * 60 * 60 * 1000;
  
  for (let i = days; i >= 0; i--) {
    const date = new Date(now - i * dayMs);
    
    // Generate random sentiment values with some coherence
    const positive = 30 + Math.random() * 40;
    const negative = 10 + Math.random() * 30;
    const neutral = 100 - positive - negative;
    
    // Generate random volume with a trend based on symbol
    let volume;
    if (symbol === 'bitcoin') {
      volume = 5000 + Math.random() * 10000;
    } else if (symbol === 'ethereum') {
      volume = 3000 + Math.random() * 8000;
    } else {
      volume = 1000 + Math.random() * 5000;
    }
    
    // Random sentiment score between -1 and 1
    const sentimentScore = (positive - negative) / 100;
    
    data.push({
      date: date.toISOString().split('T')[0],
      positive,
      negative,
      neutral,
      volume,
      sentimentScore
    });
  }
  
  return data;
};

// Test Twitter API connection
export const testTwitterConnection = async (): Promise<boolean> => {
  const credentials = getTwitterCredentials();
  if (!credentials) return false;
  
  try {
    // In a real application, this would make a test API call to Twitter
    // For this demo, we'll just simulate a successful connection
    toast.success('בדיקת התחברות לטוויטר הצליחה');
    return true;
  } catch (error) {
    console.error('Error testing Twitter connection:', error);
    toast.error('בדיקת התחברות לטוויטר נכשלה');
    return false;
  }
};
