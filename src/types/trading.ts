
export interface TradingSignal {
  id: string;
  symbol: string;
  strategy: string;
  action: 'buy' | 'sell';
  price: number;
  targetPrice: number;
  stopLoss: number;
  confidence: number;
  riskRewardRatio: number;
  reasoning: string;
  timestamp: number;
  status: 'active' | 'completed' | 'cancelled';
  telegramSent: boolean;
  intelligenceScore?: number;
  riskData?: {
    recommendedPositionSize: number;
    maxPositionValue: number;
    riskAmount: number;
    exposurePercent: number;
  };
}

export interface SignalAnalysis {
  signal: TradingSignal;
  qualityRating: 'ELITE' | 'HIGH' | 'MEDIUM' | 'LOW';
  shouldSend: boolean;
  intelligenceData: {
    whaleActivity?: any;
    sentiment?: any;
    fearGreed?: any;
    fundamentalRisk?: string;
  };
}
