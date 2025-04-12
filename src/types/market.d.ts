
export interface MarketInfluencer {
  id: string;
  name: string;
  username: string;
  platform: 'twitter' | 'youtube' | 'telegram' | 'other';
  profileUrl: string;
  avatarUrl?: string;
  followers: number;
  assetsDiscussed: string[];
  influence: number;
  verified: boolean;
  description?: string;
  isFollowing?: boolean;
}

export interface MarketSource {
  id: string;
  name: string;
  type: 'news' | 'research' | 'data' | 'social' | 'other';
  url: string;
  description: string;
  reliability: number;
  isPremium: boolean;
  imageUrl?: string;
  apiAvailable: boolean;
  languages: string[];
  categories: string[];
}

export interface MarketTrend {
  id: string;
  keyword: string;
  popularity: number;
  change24h: number;
  sentiment: 'positive' | 'negative' | 'neutral';
  relatedAssets: string[];
  sources: string[];
  timestamp: string;
}
