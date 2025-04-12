
export type TimeframeType = '1d' | '1h' | '15m' | '1w' | '1m' | '5m' | '4h';
export type AssetType = 'crypto' | 'stocks' | 'forex' | 'commodities';

export interface Asset {
  id: string;
  name: string;
  symbol: string;
  type: AssetType;
  price: number;
  change24h: number;
  marketCap?: number;
  volume24h?: number;
  circulatingSupply?: number;
  maxSupply?: number;
  description?: string;
  imageUrl?: string;
  icon?: string;
  rank?: number;
  supply?: {
    circulating?: number;
    total?: number;
    max?: number;
  };
  website?: string;
  whitepaper?: string;
  socials?: {
    twitter?: string;
    telegram?: string;
    reddit?: string;
    github?: string;
  };
  tags?: string[];
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
  content: string;
  source: string;
  url: string;
  imageUrl?: string;
  publishedAt: string;
  sentiment?: 'positive' | 'negative' | 'neutral';
  relatedAssets?: string[];
  summary?: string;
}

export interface SocialPost {
  id: string;
  author: string;
  content: string;
  publishedAt: string;
  likes: number;
  shares?: number;
  platform?: 'twitter' | 'reddit' | 'telegram';
  sentiment?: 'positive' | 'negative' | 'neutral';
  postUrl?: string;
  relatedAssets?: string[];
  authorImageUrl?: string;
  authorUsername?: string;
  comments?: number;
}

export interface TradeSignal {
  id: string;
  assetId: string;
  type: 'buy' | 'sell' | 'hold';
  price: number;
  timestamp: number;
  strength: 'high' | 'medium' | 'low' | 'strong' | 'weak'; // Added 'strong' and 'weak' to make compatible
  timeframe: TimeframeType;
  source: string;
  description?: string;
  targetPrice?: number;
  stopLoss?: number;
  expiresAt?: number;
  confidence?: number;
  indicator?: string;
  createdAt: number;
  strategy?: string;
  notes?: string;
  riskRewardRatio?: number;
}

export interface MarketAnalysis {
  id: string;
  assetId: string;
  title: string;
  content?: string;
  timeframe: TimeframeType;
  timestamp: number;
  sentiment?: 'bullish' | 'bearish' | 'neutral';
  type?: 'technical' | 'fundamental' | 'sentiment';
  author: string;
  source: string;
  confidence: number;
  keyPoints?: string[];
  marketSector?: string;
  conclusion?: string;
  publishedAt?: string;
  summary?: string;
}

export interface TradeJournalEntry {
  id: string;
  assetId: string;
  assetName?: string;
  type: 'buy' | 'sell';
  entryPrice: number;
  exitPrice?: number;
  quantity: number;
  entryDate: number;
  exitDate?: number;
  reason: string;
  status: 'open' | 'closed';
  profit?: number;
  profitPercentage?: number;
  notes?: string;
  direction?: 'long' | 'short';
  stopLoss?: number;
  targetPrice?: number;
  positionSize?: number;
  risk?: number;
  strategy?: string;
  tags?: string[];
  date?: string;
  outcome?: 'win' | 'loss' | 'break-even';
  duration?: number;
}

export interface TradingJournalEntry extends TradeJournalEntry {}

export interface TradingBot {
  id: string;
  name: string;
  description: string;
  strategy: string;
  assets: string[];
  timeframes: TimeframeType[];
  active: boolean;
  createdAt: number;
  updatedAt: number;
  performance: {
    winRate: number;
    totalTrades: number;
    profitLoss: number;
    totalReturn?: number;
    averageProfit?: number;
    averageLoss?: number; // Added for compatibility
  };
  riskLevel: 'high' | 'medium' | 'low';
  creator: string;
}

export interface ChartArea {
  id: string;
  assetId: string;
  name: string;
  description: string;
  type: 'support' | 'resistance' | 'trendline' | 'channel';
  startPrice: number;
  endPrice: number;
  startTimestamp: number;
  endTimestamp: number;
  color: string;
  strength: 'strong' | 'medium' | 'weak';
  minPrice?: number;
  maxPrice?: number;
}

export interface WhaleMovement {
  id: string;
  assetId: string;
  type: 'exchange_deposit' | 'exchange_withdrawal' | 'wallet_transfer';
  amount: number;
  amountUsd: number;
  timestamp: number;
  walletAddress?: string;
  walletLabel?: string;
  source?: string;
  destination?: string;
  impact?: 'high' | 'medium' | 'low' | 'unknown';
  priceImpact?: number;
}

export interface WhaleBehaviorPattern {
  id: string;
  assetId: string;
  description: string;
  strength: 'high' | 'medium' | 'low';
  frequency: number;
  pattern?: string;
  occurrences: number;
  lastOccurrence?: number;
  priceImpact?: number;
  recommendation?: string;
}

// Additional types for backtest results
export interface EquityPoint {
  date: string;
  equity: number;
  value: number;
  drawdown: number;
}

export interface BacktestTrade {
  id: string;
  entryTime: number;
  exitTime: number | null;
  entryPrice: number;
  exitPrice: number | null;
  profit: number;
  profitPercent: number;
  direction: 'long' | 'short';
  status: 'open' | 'closed' | 'canceled';
  assetId: string;
  assetName: string;
  strategyUsed: string;
  duration: number;
}

// Define types for financial data sources
export interface FinancialDataSource {
  id: string;
  name: string;
  url: string;
  description: string;
  category: string;
  tags: string[];
  rating: number;
  isPremium: boolean;
  isRecommended: boolean;
  platform: string;
  accessType?: 'free' | 'premium' | 'subscription'; // Added for compatibility
  focused?: boolean; // Added for compatibility
  languages?: string[]; // Added for compatibility
}

// Define type for market events
export interface MarketEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  type: string;
  category: string;
  importance: 'high' | 'medium' | 'low' | 'critical';
  relatedAssets: string[];
  expectedImpact: 'positive' | 'negative' | 'neutral' | 'variable'; // Added 'variable' for compatibility
  source: string;
  reminder?: boolean;
}

// Define type for market influencers
export interface MarketInfluencer {
  id: string;
  name: string;
  platform: string;
  platformId: string;
  followers: number;
  description: string;
  profileImage: string;
  url: string;
  reliability: number;
  specialty?: string; // Added for compatibility
  sentiment?: 'bullish' | 'bearish' | 'neutral'; // Added for compatibility
  followStatus?: 'following' | 'not-following'; // Added for compatibility
  platforms?: string[]; // Added for compatibility
}
