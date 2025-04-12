
export interface MarketEvent {
  id: string;
  type: 'economic' | 'news' | 'earnings' | 'regulatory' | 'other';
  title: string;
  description: string;
  date: string;
  category: string;
  importance: 'low' | 'medium' | 'high' | 'critical';
  relatedAssets: string[];
  expectedImpact: 'positive' | 'negative' | 'neutral';
  source: string;
  reminder: boolean;
}

export interface MarketInfluencer {
  id: string;
  name: string;
  platform: string;
  platforms?: string[]; // Added for backward compatibility
  bio: string;
  avatarUrl: string;
  followers: number;
  accuracy: number;
  lastPost: string;
  specialty?: string[];
  sentiment?: 'bullish' | 'bearish' | 'neutral' | 'variable';
  followStatus?: 'following' | 'not-following';
}

export interface FinancialDataSource {
  id: string;
  name: string;
  description: string;
  url: string;
  category: 'news' | 'analytics' | 'research' | 'data' | 'charts';
  pricing: 'free' | 'freemium' | 'paid';
  rating: number;
  logoUrl: string;
  isOfficial: boolean;
  reliability: number;
  accessType?: string;
  focused?: boolean;
  languages?: string[];
}
