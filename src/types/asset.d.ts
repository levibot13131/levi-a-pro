
// Add the TradeJournalEntry interface
export interface TradeJournalEntry {
  id: string;
  date: string;
  assetId: string;
  assetName: string;
  direction: 'long' | 'short';
  entryPrice: number;
  stopLoss: number;
  targetPrice?: number;
  positionSize: number;
  risk: number;
  notes?: string;
  strategy: string; // Required property
  tags?: string[];
  outcome: 'open' | 'closed' | 'win' | 'loss' | 'breakeven';
}

// Add missing properties to TradeSignal
export interface TradeSignal {
  id: string;
  assetId: string;
  type: 'buy' | 'sell';
  price: number;
  timestamp: number;
  strength: 'weak' | 'medium' | 'strong';
  strategy: string;
  timeframe: TimeframeType;
  targetPrice?: number;
  stopLoss?: number;
  riskRewardRatio?: number;
  notes?: string;
  createdAt: number;
  // Additional properties needed by CustomSignals component
  symbolName?: string;
  confidence?: number;
  indicator?: string;
  description?: string;
}

// Define TimeframeType
export type TimeframeType = '1m' | '5m' | '15m' | '30m' | '1h' | '4h' | '1d' | '1w' | '1M';
