
// Core trading types
export interface PricePoint {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

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
  metadata?: Record<string, any>;
  profit?: number;
  profitPercent?: number;
  executedPrice?: number;
  exitPrice?: number;
  executedAt?: number;
  exitReason?: string;
}

export interface MarketData {
  symbol: string;
  price: number;
  volume: number;
  avgVolume: number; // Added missing property
  priceChange: number; // Added missing property
  rsi: number;
  macd: {
    signal: number;
    histogram: number;
    macd: number;
  };
  macdData: { // Added missing property
    macd: number;
    signal: number;
    histogram: number;
  };
  volumeProfile: number;
  vwap: number;
  fibonacci: {
    level618: number;
    level786: number;
    level382: number;
  };
  fibonacciData: { // Added missing property
    atKeyLevel: boolean;
    reversalPattern: boolean;
    level: number;
  };
  candlestickPattern: string;
  wyckoffPhase: 'accumulation' | 'markup' | 'distribution' | 'markdown' | 'spring' | 'utad'; // Extended enum
  smcSignal: {
    orderBlock: number;
    liquidityGrab: boolean;
    fairValueGap: number;
  };
  smcSignals: { // Added missing property
    orderBlock: boolean;
    liquiditySweep: boolean;
    bias: 'bullish' | 'bearish';
  };
  sentiment: {
    score: number;
    source: 'twitter' | 'news' | 'whale' | 'general';
    keywords: string[];
  };
  lastUpdated: number;
}

export interface SystemHealth {
  binance: boolean;
  tradingView: boolean;
  twitter: boolean;
  coinGecko: boolean;
  telegram: boolean;
  fundamentalData: boolean;
  lastCheck: number;
}

export interface TradingStrategy {
  id: string;
  name: string;
  type: string;
  isActive: boolean;
  weight: number;
  parameters: Record<string, any>;
  successRate: number;
  totalSignals: number;
  profitableSignals: number;
  createdAt: number;
  updatedAt: number;
}

export interface PersonalTradingStrategy extends TradingStrategy {
  type: 'personal';
  parameters: {
    rsiThreshold: number;
    volumeIncreaseRequired: boolean;
    resistanceBreakRequired: boolean;
    profitTargetPercent: number;
    stopLossPercent: number;
    maxRiskPercent: number;
    riskRewardRatio: number;
  };
}
