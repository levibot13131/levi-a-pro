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
  profitPercent?: number;
  metadata?: Record<string, any>;
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

export interface TradingStrategy {
  id: string;
  name: string;
  type: 'personal' | 'technical' | 'fundamental';
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
    profitTargetPercent: number;
    stopLossPercent: number;
    maxRiskPercent: number;
    riskRewardRatio: number;
    volumeIncreaseRequired: boolean;
    resistanceBreakRequired: boolean;
  };
}

export interface MarketData {
  symbol: string;
  price: number;
  volume: number;
  priceChange?: number;
  timestamp: number;
  wyckoffPhase?: string;
  candlestickPattern?: string;
  rsi?: number;
  macdData?: any;
  volumeProfile?: number;
  vwap?: number;
  fibonacciData?: any;
  smcSignals?: any;
  sentimentData?: any;
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

export interface PricePoint {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  price: number;
  timestamp: number;
  volume?: number;
}

// Additional types for comprehensive system support
export interface SignalScoringStats {
  totalSignalsAnalyzed: number;
  signalsPassedFilter: number;
  averageScore: number;
  topScore: number;
  rejectionRate: number;
  totalSent: number;
  intelligenceEnhanced: number;
  lastAnalysis?: string;
}

export interface IntelligenceData {
  whaleActivity: {
    sentiment: string;
    impact: number;
  };
  sentiment: {
    overallSentiment: string;
    score: number;
  };
  fearGreed: {
    classification: string;
    index: number;
  };
  fundamentalRisk: string;
}

export interface RiskData {
  recommendedPositionSize: number;
  maxPositionValue: number;
  riskAmount: number;
  exposurePercent: number;
  allowed: boolean;
  reason?: string;
}

export interface EngineStatus {
  isRunning: boolean;
  signalQuality: string;
  totalSignals: number;
  totalRejections: number;
  lastAnalysis: number;
  analysisCount: number;
  lastAnalysisReport: string;
  signalsLast24h?: number;
  lastSuccessfulSignal?: number;
  scoringStats: SignalScoringStats;
  intelligenceLayer: {
    whaleMonitoring: boolean;
    sentimentAnalysis: boolean;
    fearGreedIntegration: boolean;
    fundamentalRiskScoring: boolean;
  };
  healthCheck?: {
    overallHealth: string;
    dataConnection: boolean;
    aiProcessor: boolean;
  };
  currentCycle?: string;
  marketDataStatus?: string;
  productionFilters?: {
    minConfidence: number;
    minRiskReward: number;
    minPriceMovement: number;
    cooldownMinutes: number;
  };
  recentRejections?: any[];
}
