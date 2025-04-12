
// Add the following fields to TradeSignal interface
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
  source?: string;
  createdAt: number;
  // Additional properties used in CustomSignals.tsx
  symbolName?: string;
  confidence?: number;
  indicator?: string;
  description?: string;
}
