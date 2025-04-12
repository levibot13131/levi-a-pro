
// Extend the TradeSignal interface to include notes
export interface TradeSignal {
  id: string;
  assetId: string;
  symbolName?: string;
  type: 'buy' | 'sell';
  price: number;
  timestamp: number;
  strength: 'weak' | 'medium' | 'strong';
  strategy: string;
  timeframe: TimeframeType;
  targetPrice?: number;
  stopLoss?: number;
  riskRewardRatio?: number;
  createdAt?: number;
  confidence?: number;
  indicator?: string;
  description?: string;
  notes?: string;
}
