
import { useAppSettings } from '@/hooks/use-app-settings';

// Type definitions
export interface Tweet {
  id: string;
  username: string;
  text: string;
  createdAt: string;
  likes: number;
  retweets: number;
  sentiment: 'positive' | 'negative' | 'neutral';
  profileImageUrl: string;
}

export interface TwitterCredentials {
  apiKey: string;
  apiSecret: string;
  bearerToken: string;
  isConnected?: boolean;
  lastConnected?: number;
}

// Mock data for key figure tweets
const mockKeyFigureTweets = [
  {
    id: 't1',
    username: 'elonmusk',
    text: 'ביטקוין הוא עתיד המטבעות הדיגיטליים. טסלה מחזיקה BTC במאזן.',
    createdAt: '2025-04-14T15:34:00Z',
    likes: 85000,
    retweets: 12000,
    sentiment: 'positive' as const,
    profileImageUrl: 'https://randomuser.me/api/portraits/men/11.jpg',
  },
  {
    id: 't2',
    username: 'VitalikButerin',
    text: 'שכבת L2 של אית׳ריום ממשיכה להתפתח. סקלביליות היא המפתח לאימוץ המוני.',
    createdAt: '2025-04-14T12:22:00Z',
    likes: 12500,
    retweets: 3200,
    sentiment: 'positive' as const,
    profileImageUrl: 'https://randomuser.me/api/portraits/men/12.jpg',
  },
  {
    id: 't3',
    username: 'cz_binance',
    text: 'הנפח המסחרי בבורסת Binance שבר היום שיא חדש. התנודתיות בשוק מייצרת הזדמנויות.',
    createdAt: '2025-04-14T10:15:00Z',
    likes: 9800,
    retweets: 2100,
    sentiment: 'neutral' as const,
    profileImageUrl: 'https://randomuser.me/api/portraits/men/13.jpg',
  },
  {
    id: 't4',
    username: 'PeterSchiff',
    text: 'ביטקוין הוא בועה שתתפוצץ בקרוב. זהב הוא המקלט הבטוח האמיתי.',
    createdAt: '2025-04-14T09:05:00Z',
    likes: 3400,
    retweets: 980,
    sentiment: 'negative' as const,
    profileImageUrl: 'https://randomuser.me/api/portraits/men/14.jpg',
  },
  {
    id: 't5',
    username: 'PlanB',
    text: 'מודל S2F עדיין תקף. צפי למחיר BTC של $250K בסוף המחזור הנוכחי.',
    createdAt: '2025-04-14T07:30:00Z',
    likes: 15600,
    retweets: 4200,
    sentiment: 'positive' as const,
    profileImageUrl: 'https://randomuser.me/api/portraits/men/15.jpg',
  },
];

// Save Twitter credentials
export const saveTwitterCredentials = (credentials: TwitterCredentials): void => {
  localStorage.setItem('twitter_credentials', JSON.stringify(credentials));
};

// Get Twitter credentials
export const getTwitterCredentials = (): TwitterCredentials | null => {
  const storedCredentials = localStorage.getItem('twitter_credentials');
  return storedCredentials ? JSON.parse(storedCredentials) : null;
};

// Check if Twitter is connected
export const isTwitterConnected = (): boolean => {
  const credentials = getTwitterCredentials();
  return !!credentials?.isConnected;
};

// Get tweets from key crypto figures
export const getKeyFigureTweets = async (asset: string = 'BTC'): Promise<Tweet[]> => {
  const isDemoMode = useAppSettings.getState().demoMode;
  
  // In demo mode, return mock data
  if (isDemoMode) {
    console.log('Returning mock Twitter data (demo mode)');
    return mockKeyFigureTweets;
  }
  
  // Check if we have valid credentials
  const credentials = getTwitterCredentials();
  if (!credentials?.isConnected) {
    console.log('No Twitter credentials found or not connected');
    return [];
  }
  
  try {
    // This would be a real API call in production
    console.log(`Fetching Twitter data for ${asset} from API`);
    
    // For now, just return the mock data
    // In a real implementation, this would use the Twitter API
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(mockKeyFigureTweets);
      }, 500);
    });
  } catch (error) {
    console.error('Error fetching Twitter data:', error);
    return [];
  }
};

// Function to validate Twitter credentials
export const validateTwitterCredentials = async (credentials: TwitterCredentials): Promise<boolean> => {
  try {
    const isDemoMode = useAppSettings.getState().demoMode;
    
    // In demo mode, always return success
    if (isDemoMode) {
      const validatedCredentials: TwitterCredentials = {
        ...credentials,
        isConnected: true,
        lastConnected: Date.now()
      };
      
      saveTwitterCredentials(validatedCredentials);
      return true;
    }
    
    // In a real implementation, this would verify the credentials with Twitter API
    
    // For now, simulate successful validation
    const validatedCredentials: TwitterCredentials = {
      ...credentials,
      isConnected: true,
      lastConnected: Date.now()
    };
    
    saveTwitterCredentials(validatedCredentials);
    return true;
  } catch (error) {
    console.error('Error validating Twitter credentials:', error);
    return false;
  }
};
