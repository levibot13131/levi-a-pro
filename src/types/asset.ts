export interface Asset {
  id: string;
  name: string;
  symbol: string;
  type: string;
  price: number;
  change24h: number;
  marketCap: number;
  volume24h: number;
  rank: number;
  supply?: {
    circulating?: number;
    total?: number;
    max?: number;
  };
  description?: string;
  tags?: string[];
  socials?: {
    twitter?: string;
    telegram?: string;
    reddit?: string;
    github?: string;
  };
  website?: string;
  whitepaper?: string;
  icon?: string;
  imageUrl?: string;
}

export interface AssetHistoricalData {
  id: string;
  name: string;
  symbol: string;
  timeframe: TimeframeType;
  data: {
    timestamp: number;
    price: number;
    volume?: number;
  }[];
  firstDate: number;
  lastDate: number;
}

export type TimeframeType = 
  | '1m' | '3m' | '5m' | '15m' | '30m' 
  | '1h' | '2h' | '4h' | '6h' | '8h' | '12h' 
  | '1d' | '3d' | '1w' | '1M'
  | string; // מאפשר גם סטרינגים אחרים כדי לפתור את השגיאות

export interface MarketData {
  marketCap: number;
  volume24h: number;
  dominance: number;
  totalSupply?: number;
  circulatingSupply?: number;
  maxSupply?: number;
  allTimeHigh?: number;
  allTimeHighDate?: string;
  priceChange24h: number;
  priceChangePercentage24h: number;
  priceChange7d?: number;
  priceChangePercentage7d?: number;
  priceChange30d?: number;
  priceChangePercentage30d?: number;
}

export interface PricePoint {
  price: number;
  timestamp: number;
  volume?: number;
  open?: number;
  high?: number;
  low?: number;
  close?: number;
}

export interface SocialPost {
  id: string;
  content: string;
  author: string;
  authorUsername?: string;
  authorImageUrl?: string;
  publishedAt: string;
  platform: 'twitter' | 'reddit' | 'telegram' | string;
  likes: number;
  comments?: number;
  shares?: number;
  sentiment?: 'positive' | 'negative' | 'neutral';
  relatedAssets?: string[];
  postUrl?: string;
}

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  content: string;
  publishedAt: string;
  source: string;
  url: string;
  imageUrl?: string;
  sentiment?: 'positive' | 'negative' | 'neutral';
  relatedAssets?: string[];
}

export interface TradeSignal {
  id: string;
  assetId: string;
  type: 'buy' | 'sell';
  price: number;
  timestamp: number;
  strength: 'strong' | 'medium' | 'weak';
  strategy: string;
  timeframe: TimeframeType;
  targetPrice?: number;
  stopLoss?: number;
  riskRewardRatio?: number;
  notes?: string;
  source?: string;
  createdAt: number;
}

export interface MarketAnalysis {
  id: string;
  title: string;
  summary: string;
  type: 'technical' | 'fundamental' | 'sentiment';
  assetId?: string;
  marketSector?: string;
  timeframe: TimeframeType;
  timestamp: number;
  publishedAt: string;
  author: string;
  content: string;
  keyPoints: string[];
  conclusion: string;
  sentiment: 'bullish' | 'bearish' | 'neutral';
  source: string;
  confidence: number;
}

export interface TradeJournalEntry {
  id: string;
  date: string;
  assetId: string;
  assetName: string;
  type?: 'buy' | 'sell';
  quantity?: number;
  direction: 'long' | 'short';
  entryDate?: string;
  entryPrice: number;
  exitDate?: string;
  exitPrice?: number;
  stopLoss: number;
  targetPrice?: number;
  positionSize: number;
  risk: number;
  reason?: string;
  notes?: string;
  status?: 'open' | 'closed';
  strategy?: string;
  tags?: string[];
  outcome?: 'win' | 'loss' | 'open';
}

export interface ChartArea {
  id: string;
  assetId: string;
  name: string;
  description: string;
  startTimestamp: number;
  endTimestamp: number;
  minPrice: number;
  maxPrice: number;
  type: 'support' | 'resistance' | 'accumulation' | 'distribution' | 'pattern';
  color?: string;
}

export interface TradingBot {
  id: string;
  name: string;
  description: string;
  strategy: string;
  isActive: boolean;
  performance: {
    winRate: number;
    totalTrades: number;
    profitLoss: number;
    totalReturn?: number;
    averageProfit?: number;
    averageLoss?: number;
    sharpeRatio?: number;
    maxDrawdown?: number;
  };
  timeframe: TimeframeType;
  assets: string[];
  lastSignal?: TradeSignal;
  createdAt: string;
  updatedAt: string;
}
