export interface Asset {
  id: string;
  name: string;
  symbol: string;
  imageUrl: string;
  price: number;
  marketCap: number;
  fullyDilutedValuation: number;
  volume24h: number;
  volumeChange24h: number;
  circulatingSupply: number;
  totalSupply: number;
  maxSupply: number;
  ath: number;
  athChangePercentage: number;
  athDate: string;
  atl: number;
  atlChangePercentage: number;
  atlDate: string;
  roi: null | {
      times: number;
      currency: string;
      percentage: number;
  };
  lastUpdated: string;
  sparklineIn7d: {
      price: number[];
  };
  priceChangePercentage24h: number;
}

export interface AssetHistoricalData {
  prices: number[][];
  market_caps: number[][];
  total_volumes: number[][];
}

export type TimeframeType = 
  | '1m' | '3m' | '5m' | '15m' | '30m' 
  | '1h' | '2h' | '4h' | '6h' | '8h' | '12h' 
  | '1d' | '3d' | '1w' | '1M'
  | string; // מאפשר גם סטרינגים אחרים כדי לפתור את השגיאות

export interface MarketData {
  [timestamp: number]: {
    price: number;
    volume: number;
  };
}

export interface PricePoint {
  time: string;
  value: number;
}

export interface SocialPost {
  id: string;
  assetId: string;
  source: string;
  author: string;
  text: string;
  likes: number;
  retweets: number;
  date: string;
  url: string;
}

export interface NewsItem {
  id: string;
  assetId: string;
  source: string;
  title: string;
  content: string;
  date: string;
  url: string;
  imageUrl: string;
}

export interface TradeSignal {
  id: string;
  assetId: string;
  type: 'buy' | 'sell';
  price: number;
  timestamp: number;
  strength: 'strong' | 'medium' | 'weak';
  strategy: string;
  timeframe: string;
  targetPrice?: number;
  stopLoss?: number;
  riskRewardRatio?: number;
  notes?: string;
  source?: string;
  createdAt?: number;
  symbolName?: string;
  confidence?: number;
  indicator?: string;
  description?: string;
}

export interface MarketAnalysis {
  assetId: string;
  date: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  summary: string;
  analyst: string;
  rating: 'buy' | 'sell' | 'hold';
  targetPrice: number;
}

export interface TradeJournalEntry {
  id: string;
  date: string; // Making this required to match with journal.ts
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
  top: number;
  left: number;
  width: number;
  height: number;
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
