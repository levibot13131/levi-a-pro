
export interface FinancialDataSource {
  id: string;
  name: string;
  description: string;
  url: string;
  type: string;
  category: string;
  rating: number;
  platform: string;
  // Additional fields needed per errors
  focused?: boolean;
  accessType?: 'free' | 'freemium' | 'premium' | 'subscription';
  languages?: string[];
  reliability?: number;
  updateFrequency?: string;
}

export interface PlatformInfo {
  type: string;
  url: string;
  followers: number;
}

export interface MarketInfluencer {
  id: string;
  name: string;
  platform: string;
  followers: number;
  bio: string;
  profileUrl: string;
  expertise: string[];
  // Additional fields needed per errors
  followStatus?: boolean;
  specialty?: string[];
  sentiment?: 'positive' | 'negative' | 'neutral' | 'bullish' | 'bearish' | 'variable';
  platforms?: PlatformInfo[];
  description?: string;
  reliability?: number;
}

export interface MarketEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  category: string;
  importance: 'low' | 'medium' | 'high' | 'critical';
  relatedAssets: string[];
  expectedImpact: 'positive' | 'negative' | 'neutral' | 'variable';
  source: string;
  reminder: boolean;
  type: string; // Required field per error
}
