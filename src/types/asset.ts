
export type AssetType = 'crypto' | 'stock' | 'forex';

export interface Asset {
  id: string;
  symbol: string;
  name: string;
  type: AssetType;
  price: number;
  change24h: number; // באחוזים
  volume24h: number;
  marketCap?: number; // רלוונטי בעיקר לקריפטו ומניות
  imageUrl?: string;
}

export interface PricePoint {
  timestamp: number; // UNIX timestamp
  price: number;
}

export interface AssetHistoricalData {
  assetId: string;
  timeframe: '1d' | '1w' | '1m' | '3m' | '1y' | 'all';
  data: PricePoint[];
}

// הוספת סוגי נתונים חדשים לתמיכה בתכונות מבוקשות

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  source: string;
  url: string;
  publishedAt: string;
  sentiment?: 'positive' | 'neutral' | 'negative';
  relatedAssets?: string[]; // מזהי נכסים קשורים
  imageUrl?: string;
}

export interface SocialPost {
  id: string;
  platform: 'twitter' | 'reddit' | 'telegram' | 'other';
  author: string;
  authorUsername?: string;
  authorImageUrl?: string;
  content: string;
  postUrl: string;
  publishedAt: string;
  likes?: number;
  comments?: number;
  shares?: number;
  sentiment?: 'positive' | 'neutral' | 'negative';
  relatedAssets?: string[]; // מזהי נכסים קשורים
}

export interface TradingBot {
  id: string;
  name: string;
  description: string;
  strategy: string;
  performance: {
    totalReturn: number; // באחוזים
    winRate: number; // באחוזים
    averageProfit: number; // באחוזים
    averageLoss: number; // באחוזים
    sharpeRatio?: number;
    maxDrawdown: number; // באחוזים
  };
  supportedAssets: AssetType[];
  monthlyReturns: { month: string; return: number }[];
  riskLevel: 'low' | 'medium' | 'high';
  creatorInfo?: string;
  imageUrl?: string;
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
  notes?: string;
}

export interface MarketAnalysis {
  id: string;
  title: string;
  summary: string;
  type: 'fundamental' | 'technical' | 'sentiment';
  assetId?: string; // אם זה ניתוח ספציפי לנכס
  marketSector?: string; // למשל "crypto", "technology stocks" וכו'
  publishedAt: string;
  author: string;
  content: string;
  keyPoints: string[];
  conclusion: string;
  sentiment: 'bullish' | 'bearish' | 'neutral';
}

export interface TradeJournalEntry {
  id: string;
  assetId: string;
  entryPrice: number;
  exitPrice?: number;
  entryDate: string;
  exitDate?: string;
  type: 'buy' | 'sell';
  quantity: number;
  profit?: number;
  profitPercentage?: number;
  strategy: string;
  setupType: string;
  notes: string;
  screenshots?: string[];
  emotions?: string;
  lessonLearned?: string;
  riskRewardSetup?: number;
  riskRewardActual?: number;
  tags?: string[];
}
