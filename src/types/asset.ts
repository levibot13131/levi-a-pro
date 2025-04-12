
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
