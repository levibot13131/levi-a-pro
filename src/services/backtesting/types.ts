
import { PositionSizingCalculation } from "@/services/customTradingStrategyService";

export interface BacktestSettings {
  initialCapital: number;
  riskPerTrade: number;
  strategy: 'KSEM' | 'SMC' | 'Wyckoff' | 'Custom';
  entryType: 'market' | 'limit';
  stopLossType: 'fixed' | 'atr' | 'support';
  takeProfitType: 'fixed' | 'resistance' | 'riskReward';
  riskRewardRatio: number;
  timeframe: string;
  startDate: string;
  endDate: string;
  trailingStop: boolean;
  maxOpenTrades: number;
  assetIds: string[];
}

export interface Trade {
  id: string;
  assetId: string;
  assetName: string;
  direction: 'long' | 'short';
  entryDate: string;
  entryPrice: number;
  stopLoss: number;
  takeProfit: number;
  positionSize: number;
  exitDate?: string;
  exitPrice?: number;
  profit?: number;
  profitPercentage?: number;
  status: 'open' | 'closed' | 'stopped' | 'target';
  duration?: number; // in days
  maxDrawdown?: number;
  strategyUsed: string;
  signalId?: string;
}

export interface BacktestResults {
  trades: Trade[];
  performance: {
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
  equity: {
    date: string;
    value: number;
    drawdown: number;
  }[];
  monthly: {
    period: string;
    return: number;
    trades: number;
  }[];
  assetPerformance: {
    assetId: string;
    assetName: string;
    return: number;
    trades: number;
    winRate: number;
  }[];
}
