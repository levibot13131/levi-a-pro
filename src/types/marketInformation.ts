
export interface MarketEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  importance: 'critical' | 'high' | 'medium' | 'low';
  reminder: boolean;
  type: 'economic' | 'regulatory' | 'project' | 'other';
  relatedAssets?: string[];
  category?: string;
  expectedImpact?: 'positive' | 'negative' | 'neutral';
  source?: string;
}

export interface MarketInfluencer {
  id: string;
  name: string;
  handle: string;
  platform: string;
  followers: number;
  influence: number;
  description: string;
  topics: string[];
  reliability: number;
  imageUrl?: string;
}

export interface FinancialDataSource {
  id: string;
  name: string;
  url: string;
  type: string;
  reliability: number;
  category: string;
  description: string;
  isPremium: boolean;
  updateFrequency: string;
}
