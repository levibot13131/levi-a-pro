
// Export all the type definitions

export interface Asset {
  id: string;
  name: string;
  symbol: string;
  imageUrl?: string;
  price: number;
  marketCap?: number;
  fullyDilutedValuation?: number;
  volume24h?: number;
  volumeChange24h?: number;
  circulatingSupply?: number;
  totalSupply?: number;
  maxSupply?: number;
  ath?: number;
  athChangePercentage?: number;
  athDate?: string;
  atl?: number;
  atlChangePercentage?: number;
  atlDate?: string;
  roi?: null | {
      times: number;
      currency: string;
      percentage: number;
  };
  lastUpdated?: string;
  sparklineIn7d?: {
      price: number[];
  };
  priceChangePercentage24h?: number;
  change24h?: number;
  type?: 'crypto' | 'stocks' | 'forex' | 'commodities';
  rank?: number;
  status?: string;
  priceAtAdd?: number;
  addedAt?: number;
  tags?: string[];
  strategy?: string;
  relatedAssets?: string[];
  // Add missing properties
  icon?: string;
  description?: string;
  website?: string;
  whitepaper?: string;
  socials?: {
    twitter?: string;
    telegram?: string;
    reddit?: string;
    github?: string;
    discord?: string;
    [key: string]: string | undefined;
  };
  supply?: {
    circulating?: number;
    total?: number;
    max?: number;
  };
}

export interface AssetHistoricalData {
  prices: number[][];
  market_caps: number[][];
  total_volumes: number[][];
  // Add missing properties
  id?: string;
  symbol?: string;
  name?: string;
  timeframe?: string;
  data?: Array<{
    timestamp: number;
    price: number;
    volume?: number;
  }>;
  firstDate?: number;
  lastDate?: number;
}

export type TimeframeType = 
  | '1m' | '3m' | '5m' | '15m' | '30m' 
  | '1h' | '2h' | '4h' | '6h' | '8h' | '12h' 
  | '1d' | '3d' | '1w' | '1M'
  | string; // allows other string values to resolve errors

export interface MarketData {
  [timestamp: number]: {
    price: number;
    volume: number;
  };
}

export interface PricePoint {
  time: string;
  value: number;
  timestamp?: number; // Add missing property
}

export interface SocialPost {
  id: string;
  assetId: string;
  source: string;
  author: string;
  text?: string;
  content?: string;
  likes: number;
  retweets?: number;
  comments?: number;
  shares?: number;
  date?: string;
  publishedAt: string;
  url?: string;
  postUrl?: string;
  platform?: string;
  authorImageUrl?: string;
  authorUsername?: string;
  sentiment?: 'positive' | 'neutral' | 'negative';
}

export interface NewsItem {
  id: string;
  assetId: string;
  source: string;
  title: string;
  content?: string;
  summary?: string;
  date?: string;
  publishedAt: string;
  url?: string;
  imageUrl?: string;
  sentiment?: 'positive' | 'neutral' | 'negative';
  relatedAssets?: string[];
}

export interface TradeSignal {
  id: string;
  assetId: string;
  type: 'buy' | 'sell';
  price: number;
  timestamp: number;
  strength: 'weak' | 'medium' | 'strong';
  strategy: string;
  timeframe: string;
  targetPrice?: number;
  stopLoss?: number;
  riskRewardRatio?: number;
  createdAt: number;
  notes?: string;
  symbolName?: string;
  confidence?: number;
  indicator?: string;
  description?: string;
}

export interface MarketAnalysis {
  id: string;
  assetId: string;
  type: 'technical' | 'fundamental' | 'sentiment';
  sentiment: 'bullish' | 'bearish' | 'neutral';
  summary: string;
  title: string;
  conclusion: string;
  keyPoints: string[];
  author: string;
  date: string;
  publishedAt: number;
  marketSector?: string;
  rating?: 'buy' | 'sell' | 'hold';
  targetPrice?: number;
  analyst?: string;
  content?: string; // Add missing property
  timeframe?: string; // Add missing property
  timestamp?: number; // Add missing property
  confidence?: number; // Add missing property
  source?: string; // Add missing property
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
  type: string;
  top?: number;
  left?: number;
  width?: number;
  height?: number;
}

export interface TradingBot {
  id: string;
  name: string;
  description: string;
  assetId: string;
  strategy: string;
  parameters: { [key: string]: any };
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}
