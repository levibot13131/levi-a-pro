
export interface MarketInfluencer {
  id: string;
  name: string;
  platform: string;
  followers: number;
  description: string;
  topics: string[];
  isFollowed: boolean;
  influence: number;
  avatarUrl: string;
  // These are from the older type but might be needed
  username?: string;
  reliability?: number;
  expertise?: string[];
  bio?: string;
  profileUrl?: string;
  isVerified?: boolean;
  imageUrl?: string;
  assetsDiscussed?: string[];
}

export interface FinancialDataSource {
  id: string;
  name: string;
  type: string;
  url: string;
  description: string;
  reliability: number;
  isPaid: boolean;
  frequencyUpdate: string;
  imageUrl: string;
  languages: string[];
  categories: string[];
  isFeatured: boolean;
  rating: number;
  platform: string;
  category?: string | string[];
}

export interface MarketEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  category: string;
  impact: 'high' | 'medium' | 'low';
  source: string;
  time: string;
  link: string;
  hasReminder: boolean;
  // These are from the older type but might be needed
  reminder?: boolean;
  importance?: string;
  type?: string;
  relatedAssets?: string[];
  expectedImpact?: string;
}

export type MarketSource = FinancialDataSource;
