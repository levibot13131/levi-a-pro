
import { TimeframeType } from '@/types/asset';

export interface BacktestSettings {
  startDate: Date;
  endDate: Date;
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
}

export interface BacktestResult {
  id: string;
  assetId: string;
  settings: BacktestSettings;
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  winRate: number;
  profitLoss: number;
  profitLossPercentage: number;
  maxDrawdown: number;
  maxDrawdownPercentage: number;
  sharpeRatio: number;
  volatility: number;
  finalCapital: number;
  trades: BacktestTrade[];
  signals: BacktestSignal[];
  equity: EquityPoint[];
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
  date: number;
  equity: number;
}
