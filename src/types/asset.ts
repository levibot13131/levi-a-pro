export interface Asset {
  id: string;
  name: string;
  symbol: string;
  price: number;
  marketCap: number;
  volume24h: number;
  change24h: number;
  type: 'crypto' | 'stocks' | 'forex' | 'commodities';
  imageUrl?: string;
}

export type TimeframeType = '1m' | '3m' | '5m' | '15m' | '30m' | '1h' | '4h' | '1d' | '1w' | '1M' | '1y' | 'all';

export interface AssetHistoricalData {
  assetId: string;
  timeframe: TimeframeType;
  data: {
    timestamp: number;
    price: number;
  }[];
  volumeData?: VolumePoint[];
}

export interface PricePoint {
  timestamp: number;
  price: number;
}

export interface VolumePoint {
  timestamp: number;
  volume: number;
  abnormal?: boolean;
}

export interface ChartArea {
  startTimestamp: number;
  endTimestamp: number;
  minPrice: number;
  maxPrice: number;
}

// טיפוסים למערכת איתותי מסחר
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
  notes?: string;
}

// טיפוסים לניתוחי שוק
export interface MarketAnalysis {
  id: string;
  title: string;
  summary: string;
  type: 'technical' | 'fundamental' | 'sentiment';
  assetId?: string;
  marketSector?: string;
  publishedAt: string;
  author: string;
  content: string;
  keyPoints: string[];
  conclusion: string;
  sentiment: 'bullish' | 'bearish' | 'neutral';
}

// טיפוסים לבוטים של מסחר
export interface TradingBot {
  id: string;
  name: string;
  description: string;
  strategy: string;
  performance: {
    totalReturn: number;
    winRate: number;
    averageProfit: number;
    averageLoss: number;
    sharpeRatio: number;
    maxDrawdown: number;
  };
  supportedAssets: string[];
  monthlyReturns: { month: string; return: number }[];
  riskLevel: 'low' | 'medium' | 'high';
  creatorInfo: string;
  imageUrl: string;
}

// טיפוסים ליומן מסחר
export interface TradeJournalEntry {
  id: string;
  date: string;
  assetId: string;
  assetName: string;
  direction: 'long' | 'short';
  entryPrice: number;
  exitPrice?: number;
  stopLoss: number;
  targetPrice?: number;
  positionSize: number;
  risk: number;
  outcome?: 'win' | 'loss' | 'breakeven' | 'open';
  profit?: number;
  profitPercentage?: number;
  notes?: string;
  tags?: string[];
  screenshot?: string;
  strategy: string;
}

// טיפוסים לחדשות שוק
export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  source: string;
  url: string;
  publishedAt: string;
  imageUrl?: string;
  category: 'crypto' | 'stocks' | 'forex' | 'economy' | 'regulation';
  relatedAssets?: string[];
  sentiment?: 'positive' | 'negative' | 'neutral';
}

// טיפוסים לפוסטים חברתיים
export interface SocialPost {
  id: string;
  platform: 'twitter' | 'reddit' | 'telegram' | 'discord';
  author: string;
  authorUsername?: string;
  authorImageUrl?: string;
  content: string;
  publishedAt: string;
  likes: number;
  comments: number;
  shares?: number;
  sentiment?: 'positive' | 'negative' | 'neutral';
  relatedAssets?: string[];
  postUrl?: string;
}
