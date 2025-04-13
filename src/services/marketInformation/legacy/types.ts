
// Legacy type definitions for compatibility
export interface LegacyFinancialDataSource {
  id: string;
  name: string;
  url: string;
  category: string;
  dataPoints: string[];
  description: string;
  reliabilityRating: number;
  reliability?: number;
  accessType?: 'free' | 'paid' | 'api' | 'freemium';
  languages?: string[];
  updateFrequency?: string;
  focused?: boolean;
}

export interface LegacyMarketInfluencer {
  id: string;
  name: string;
  position: string;
  company: string;
  influence: number;
  recentStatements: string[];
  sentiment: 'bullish' | 'bearish' | 'neutral';
  description?: string;
  platforms?: {
    type: 'twitter' | 'linkedin' | 'youtube' | 'blog' | 'other';
    url: string;
    followers: number;
  }[];
  specialty?: string[];
  reliability?: number;
  followStatus?: 'following' | 'not-following';
}

export interface LegacyMarketEvent {
  id: string;
  title: string;
  date: string;
  category: string;
  impact: string;
  description: string;
  expectedVolatility?: string;
  assetImpact?: {
    [key: string]: string;
  };
  importance?: 'low' | 'medium' | 'high' | 'critical';
  source?: string;
  reminder?: boolean;
}
