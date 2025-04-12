
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
  specialty?: string;
  sentiment?: 'positive' | 'negative' | 'neutral';
  platforms?: string[];
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
