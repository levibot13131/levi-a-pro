
export interface TradingStrategy {
  id: string;
  name: string;
  type: 'personal' | 'wyckoff' | 'smc' | 'fibonacci' | 'momentum' | 'candlestick' | 'volume' | 'rsi_macd' | 'patterns';
  isActive: boolean;
  weight: number; // Success-based weight (0-1)
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
    confirmationPattern?: string;
  };
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
  status: 'active' | 'executed' | 'stopped' | 'expired';
  result?: {
    executedPrice?: number;
    exitPrice?: number;
    profit?: number;
    profitPercent?: number;
    exitReason?: 'target' | 'stop' | 'manual' | 'timeout';
    executedAt?: number;
  };
  telegramSent: boolean;
  metadata?: Record<string, any>;
}

export interface MarketData {
  symbol: string;
  price: number;
  volume: number;
  rsi: number;
  macd: {
    signal: number;
    histogram: number;
    macd: number;
  };
  volumeProfile: number;
  vwap: number;
  fibonacci: {
    level618: number;
    level786: number;
    level382: number;
  };
  candlestickPattern?: string;
  wyckoffPhase?: 'accumulation' | 'distribution' | 'markup' | 'markdown';
  smcSignal?: {
    orderBlock?: number;
    liquidityGrab?: boolean;
    fairValueGap?: number;
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

export interface UserSettings {
  id: string;
  email: string;
  telegramBotToken?: string;
  telegramChatId?: string;
  binanceApiKey?: string;
  binanceSecretKey?: string;
  tradingViewUsername?: string;
  maxRiskPerTrade: number;
  autoTradingEnabled: boolean;
  strategiesEnabled: string[];
  notificationSettings: {
    telegram: boolean;
    email: boolean;
    pushNotifications: boolean;
  };
  createdAt: number;
  updatedAt: number;
}
