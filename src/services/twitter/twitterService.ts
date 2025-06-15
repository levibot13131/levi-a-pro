
import { toast } from 'sonner';

export interface TwitterCredentials {
  apiKey: string;
  apiSecret: string;
  bearerToken: string;
  lastConnected?: number;
}

export interface TwitterSentimentData {
  timestamp: number;
  sentiment: number; // -1 to 1
  volume: number;
  positive: number;
  negative: number;
  neutral: number;
}

const TWITTER_CREDENTIALS_KEY = 'twitter_credentials';

/**
 * Check if Twitter is connected
 */
export const isTwitterConnected = (): boolean => {
  const credentials = getTwitterCredentials();
  return !!credentials && !!credentials.apiKey && !!credentials.bearerToken;
};

/**
 * Get Twitter credentials from localStorage
 */
export const getTwitterCredentials = (): TwitterCredentials | null => {
  try {
    const stored = localStorage.getItem(TWITTER_CREDENTIALS_KEY);
    if (!stored) return null;
    
    return JSON.parse(stored) as TwitterCredentials;
  } catch (error) {
    console.error('Error parsing Twitter credentials:', error);
    return null;
  }
};

/**
 * Save Twitter credentials
 */
export const saveTwitterCredentials = (credentials: TwitterCredentials): void => {
  try {
    const credentialsWithTimestamp = {
      ...credentials,
      lastConnected: Date.now()
    };
    
    localStorage.setItem(TWITTER_CREDENTIALS_KEY, JSON.stringify(credentialsWithTimestamp));
    console.log('Twitter credentials saved successfully');
    toast.success('Twitter credentials saved successfully');
  } catch (error) {
    console.error('Error saving Twitter credentials:', error);
    toast.error('Failed to save Twitter credentials');
  }
};

/**
 * Disconnect from Twitter
 */
export const disconnectFromTwitter = (): void => {
  localStorage.removeItem(TWITTER_CREDENTIALS_KEY);
  console.log('Twitter credentials removed');
  toast.success('Disconnected from Twitter');
};

/**
 * Validate Twitter credentials
 */
export const validateTwitterCredentials = async (credentials: TwitterCredentials): Promise<boolean> => {
  try {
    console.log('Validating Twitter credentials...');
    
    // In a real implementation, this would make an API call to Twitter
    // to verify the credentials are valid
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    console.log('Twitter credentials validated successfully');
    toast.success('Twitter connection validated successfully');
    
    return true;
  } catch (error) {
    console.error('Error validating Twitter credentials:', error);
    toast.error('Failed to validate Twitter credentials');
    return false;
  }
};

/**
 * Fetch Twitter sentiment data for a cryptocurrency
 */
export const fetchTwitterSentiment = async (
  crypto: string, 
  days: number = 7
): Promise<TwitterSentimentData[]> => {
  try {
    console.log(`Fetching Twitter sentiment for ${crypto} over ${days} days`);
    
    // Generate mock sentiment data
    const data: TwitterSentimentData[] = [];
    const now = Date.now();
    const dayMs = 24 * 60 * 60 * 1000;
    
    for (let i = days - 1; i >= 0; i--) {
      const timestamp = now - (i * dayMs);
      const baseSentiment = Math.sin(i * 0.5) * 0.3; // Oscillating base sentiment
      const randomVariation = (Math.random() - 0.5) * 0.4;
      const sentiment = Math.max(-1, Math.min(1, baseSentiment + randomVariation));
      
      // Calculate positive/negative/neutral percentages
      const sentimentNormalized = (sentiment + 1) / 2; // 0 to 1
      const positive = Math.round(sentimentNormalized * 60 + 20); // 20-80%
      const negative = Math.round((1 - sentimentNormalized) * 40 + 10); // 10-50%
      const neutral = 100 - positive - negative;
      
      data.push({
        timestamp,
        sentiment,
        volume: Math.floor(Math.random() * 10000 + 5000),
        positive,
        negative,
        neutral
      });
    }
    
    console.log(`Generated ${data.length} sentiment data points for ${crypto}`);
    return data;
  } catch (error) {
    console.error('Error fetching Twitter sentiment:', error);
    toast.error('Failed to fetch Twitter sentiment data');
    return [];
  }
};

/**
 * Test Twitter connection
 */
export const testTwitterConnection = async (): Promise<boolean> => {
  try {
    const credentials = getTwitterCredentials();
    if (!credentials) {
      toast.error('No Twitter credentials found');
      return false;
    }
    
    // In a real implementation, this would make a test API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log('Twitter connection test successful');
    toast.success('Twitter connection test successful');
    return true;
  } catch (error) {
    console.error('Twitter connection test failed:', error);
    toast.error('Twitter connection test failed');
    return false;
  }
};
