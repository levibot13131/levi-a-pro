
// Types for assets and related data

export type AssetType = 'crypto' | 'stocks' | 'forex' | 'commodities';
export type TimeframeType = '1h' | '4h' | '1d' | '1w' | '1m' | '3m' | '1y';

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
  icon?: string;
  imageUrl?: string; // Added imageUrl property
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
  volume?: number;
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
  platform?: 'twitter' | 'telegram' | 'reddit' | 'discord';
  shares?: number;
  postUrl?: string;
  sentiment?: 'positive' | 'negative' | 'neutral';
}

export interface TrackedAsset extends Asset {
  isPinned: boolean;
  alertsEnabled: boolean;
  priority: 'high' | 'medium' | 'low';
  notes?: string;
  lastUpdated: number;
}

// Trade Signal interface
export interface TradeSignal {
  id: string;
  assetId: string;
  type: 'buy' | 'sell';
  strategy: string;
  timeframe: string;
  price: number;
  timestamp: number;
  strength: 'strong' | 'medium' | 'weak';
  notes?: string;
  targetPrice?: number;
  stopLoss?: number;
  riskRewardRatio?: number;
}

// Market Analysis interface
export interface MarketAnalysis {
  id: string;
  assetId: string;
  date: string;
  title: string;
  summary: string;
  timeframe: string;
  direction: 'bullish' | 'bearish' | 'neutral';
  confidence: number;
  author?: string;
  indicators?: string[];
  targets?: {
    price: number;
    probability: number;
    timeframe: string;
  }[];
  risks?: string[];
  catalysts?: string[];
}

// Trading Journal Entry interface
export interface TradeJournalEntry {
  id: string;
  assetId: string;
  type: 'buy' | 'sell';
  entryPrice: number;
  entryDate: string;
  quantity: number;
  exitPrice?: number;
  exitDate?: string;
  profit?: number;
  profitPercentage?: number;
  strategy: string;
  reason: string;
  notes?: string;
  emotions?: string;
  lessons?: string;
  screenshots?: string[];
  status: 'open' | 'closed' | 'cancelled';
}

// Chart Area interface
export interface ChartArea {
  id: string;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  type: 'support' | 'resistance' | 'trend' | 'fibonacci' | 'pattern';
  color: string;
  notes?: string;
}

// Trading Bot interface
export interface TradingBot {
  id: string;
  name: string;
  strategy: string;
  status: 'active' | 'paused' | 'inactive';
  assets: string[];
  performance: {
    winRate: number;
    totalTrades: number;
    profitLoss: number;
  };
  settings: Record<string, any>;
}
