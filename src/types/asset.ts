
// Types for assets and related data

export type AssetType = 'crypto' | 'stocks' | 'forex' | 'commodities';
export type TimeframeType = '1h' | '4h' | '1d' | '1w' | '1m';

export interface Asset {
  id: string;
  symbol: string;
  name: string;
  type: AssetType;
  price: number;
  change24h: number;
  marketCap?: number;
  volume24h?: number;
  supply?: {
    circulating?: number;
    total?: number;
    max?: number;
  };
  rank?: number;
  icon?: string; // Added icon property
  description?: string;
  website?: string;
  whitepaper?: string;
  socials?: {
    twitter?: string;
    telegram?: string;
    reddit?: string;
    github?: string;
  };
  tags?: string[];
  relatedAssets?: string[];
}

export interface PricePoint {
  timestamp: number;
  price: number;
  volume?: number; // Added volume property
}

export interface AssetHistoricalData {
  id: string;
  symbol: string;
  name: string;
  timeframe: TimeframeType;
  data: PricePoint[];
  firstDate: number;
  lastDate: number;
}

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  publishedAt: string;
  source: string;
  url?: string;
  imageUrl?: string;
  sentiment?: 'positive' | 'negative' | 'neutral';
  relatedAssets?: string[];
}

export interface SocialPost {
  id: string;
  author: string;
  authorUsername?: string;
  authorImageUrl?: string;
  content: string;
  publishedAt: string;
  likes: number;
  comments: number;
  sentiment?: 'positive' | 'negative' | 'neutral';
}

export interface TrackedAsset extends Asset {
  isPinned: boolean;
  alertsEnabled: boolean;
  priority: 'high' | 'medium' | 'low';
  notes?: string;
  lastUpdated: number;
}
