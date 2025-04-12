export interface Asset {
  // ... keep existing code
}

export interface AssetHistoricalData {
  // ... keep existing code
}

export type TimeframeType = 
  | '1m' | '3m' | '5m' | '15m' | '30m' 
  | '1h' | '2h' | '4h' | '6h' | '8h' | '12h' 
  | '1d' | '3d' | '1w' | '1M'
  | string; // מאפשר גם סטרינגים אחרים כדי לפתור את השגיאות

export interface MarketData {
  // ... keep existing code
}

export interface PricePoint {
  // ... keep existing code
}

export interface SocialPost {
  // ... keep existing code
}

export interface NewsItem {
  // ... keep existing code
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
  // ... keep existing code
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
  // ... keep existing code
}

export interface TradingBot {
  // ... keep existing code
}
