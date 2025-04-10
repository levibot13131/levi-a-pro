
// Types for financial news and market sources
export interface FinancialDataSource {
  id: string;
  name: string;
  description: string;
  url: string;
  category: 'news' | 'data' | 'analysis' | 'social';
  reliability: number; // 1-10 scale
  accessType: 'free' | 'paid' | 'api' | 'freemium';
  languages: string[];
  updateFrequency: string;
  focused: boolean; // Is this source in user's focused list
}

export interface MarketInfluencer {
  id: string;
  name: string;
  description: string;
  platforms: {
    type: 'twitter' | 'linkedin' | 'youtube' | 'blog' | 'other';
    url: string;
    followers: number;
  }[];
  specialty: string[];
  reliability: number; // 1-10 scale
  sentiment: 'bullish' | 'bearish' | 'neutral' | 'variable';
  followStatus: 'following' | 'not-following';
}

export interface MarketEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  category: 'economic' | 'earnings' | 'political' | 'regulatory' | 'other';
  importance: 'low' | 'medium' | 'high' | 'critical';
  relatedAssets?: string[];
  expectedImpact?: 'positive' | 'negative' | 'neutral' | 'variable';
  source: string;
  reminder: boolean; // Has user set a reminder
}
