
export interface MarketEvent {
  id: string;
  title: string;
  date: string;
  importance: string;
  category: string;
  description: string;
  relatedAssets: string[];
  expectedImpact: string;
  source: string;
  reminder: boolean;
  type: string;
}

export interface MarketInfluencer {
  id: string;
  name: string;
  platform: string;
  followers: number;
  reliability: number;
  expertise: string[];
  imageUrl?: string;
  description: string;
  lastPrediction?: string;
  isPremium?: boolean;
  username?: string;
  profileUrl?: string;
  avatarUrl?: string;
  bio?: string;
}

export interface FinancialDataSource {
  id: string;
  name: string;
  type: string;
  reliability: number;
  category: string[];
  url: string;
  description: string;
  isPaid: boolean;
  frequencyUpdate: string;
  categories?: string[];
  rating?: number;
  platform?: string;
}
