
import { TimeframeType } from '@/types/asset';

export interface BacktestSettings {
  startDate: string;  // Changed from Date to string
  endDate: string;    // Changed from Date to string
  strategy: string;
  timeframe: TimeframeType;
  initialCapital: number;
  takeProfit: number;
  stopLoss: number;
  riskPerTrade: number;
  tradeSize: 'fixed' | 'percentage';
  leverage: number;
  compounding: boolean;
  fees: number;
  assetIds?: string[];
  entryType?: string;
  stopLossType?: string;
  takeProfitType?: string;
  riskRewardRatio?: number;
  trailingStop?: boolean;
  maxOpenTrades?: number;
}

export interface BacktestResult {
  id: string;
  assetId: string;
  settings: BacktestSettings;
  trades: BacktestTrade[];
  equity: EquityPoint[];
  monthly?: MonthlyPerformance[];
  assetPerformance?: AssetPerformance[];
  performance?: {
    totalReturn: number;
    totalReturnPercentage: number;
    winRate: number;
    averageWin: number;
    averageLoss: number;
    largestWin: number;
    largestLoss: number;
    profitFactor: number;
    maxDrawdown: number;
    sharpeRatio: number;
    totalTrades: number;
    winningTrades: number;
    losingTrades: number;
    averageTradeDuration: number;
  };
  enhancedAnalysis?: any;
  createdAt: number;
}

export interface BacktestTrade {
  id: string;
  type: 'buy' | 'sell';
  entryPrice: number;
  entryDate: number;
  exitPrice: number;
  exitDate: number;
  quantity: number;
  profit: number;
  profitPercentage: number;
  signal?: string;
  assetId?: string;
  assetName?: string;
  direction?: 'long' | 'short';
  status?: 'open' | 'closed' | 'target' | 'stopped' | 'canceled';
  duration?: number;
  strategyUsed?: string;
}

export interface BacktestSignal {
  id: string;
  type: 'buy' | 'sell';
  price: number;
  date: number;
  strategy: string;
  strength: 'strong' | 'medium' | 'weak';
  executed: boolean;
}

export interface EquityPoint {
  date: number | string;
  equity?: number;
  value: number;
  drawdown: number;
}

export interface MonthlyPerformance {
  period: string;
  return: number;
  trades: number;
}

export interface AssetPerformance {
  assetId: string;
  assetName: string;
  return: number;
  trades: number;
  winRate: number;
}

export type Trade = BacktestTrade;

// נשנה את השם לפי דרישת המשתמש
export type BacktestResults = BacktestResult;
