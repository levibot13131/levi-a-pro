
import { TradeJournalEntry } from '@/types/journal';

export interface PositionSizingCalculation {
  positionSize: number;
  riskAmount: number;
  potentialProfit: number;
  riskRewardRatio: number;
  maxLossAmount: number;
  takeProfitPrice: number;
}

export interface TradingPerformanceStats {
  winRate: number;
  profitFactor: number;
  averageWin: number;
  averageLoss: number;
  expectancy: number;
  totalTrades: number;
  consecutiveWins: number;
  consecutiveLosses: number;
}

export interface TrendTradingStats {
  trendAccuracy: number;
  avgTrendDuration: number;
  majorTrendsIdentified: number;
  falseBreakouts: number;
  successfulTrades: number;
}

// Calculate position size based on risk parameters
export const calculatePositionSize = (
  accountSize: number,
  riskPercentage: number,
  entryPrice: number,
  stopLoss: number,
  direction: 'long' | 'short'
): PositionSizingCalculation => {
  // Calculate risk amount based on account size and risk percentage
  const riskAmount = accountSize * (riskPercentage / 100);
  
  // Calculate risk per unit (difference between entry and stop loss)
  const riskPerUnit = Math.abs(entryPrice - stopLoss);
  
  if (riskPerUnit === 0) {
    throw new Error('Entry price cannot be the same as stop loss');
  }
  
  // Calculate position size in units
  const units = riskAmount / riskPerUnit;
  
  // Calculate total position value
  const positionSize = units * entryPrice;
  
  // Calculate target price based on risk-reward ratio of 2:1
  const targetPriceDistance = riskPerUnit * 2;
  const targetPrice = direction === 'long' 
    ? entryPrice + targetPriceDistance 
    : entryPrice - targetPriceDistance;
  
  // Calculate potential profit
  const potentialProfit = units * targetPriceDistance;
  
  return {
    positionSize,
    riskAmount,
    potentialProfit,
    riskRewardRatio: potentialProfit / riskAmount,
    maxLossAmount: riskAmount,
    takeProfitPrice: targetPrice
  };
};

// Get trading performance stats
export const getTradingPerformanceStats = (): TradingPerformanceStats => {
  // In a real app, this would fetch data from an API or calculate from trade history
  return {
    winRate: 58.5,
    profitFactor: 1.85,
    averageWin: 2.3,
    averageLoss: 1.0,
    expectancy: 0.75,
    totalTrades: 142,
    consecutiveWins: 7,
    consecutiveLosses: 3
  };
};

// Get trend trading stats
export const getTrendTradingStats = (): TrendTradingStats => {
  // In a real app, this would fetch data from an API or calculate from trend analysis
  return {
    trendAccuracy: 72.4,
    avgTrendDuration: 14.2,
    majorTrendsIdentified: 18,
    falseBreakouts: 7,
    successfulTrades: 26
  };
};

// Get mock journal entries
export const getJournalEntries = (): TradeJournalEntry[] => {
  return [
    {
      id: "1",
      assetId: "bitcoin",
      assetName: "Bitcoin",
      type: "buy",
      entryPrice: 50000,
      entryDate: "2023-09-15",
      exitPrice: 55000,
      exitDate: 1692979200000,
      quantity: 0.5,
      leverage: 1,
      fees: 25,
      profit: 2500,
      profitPercentage: 5,
      outcome: "win",
      notes: "נכנסתי לאחר פריצת התנגדות ב-50K עם נפח גבוה. יציאה מוקדמת מדי.",
      tags: ["breakout", "bitcoin", "trend-following"],
      strategy: "breakout",
      date: "2023-09-15",
      symbol: "BTC/USD",
      direction: "long",
      stopLoss: 48000,
      targetPrice: 58000,
      positionSize: 25000,
      risk: 1
    },
    {
      id: "2",
      assetId: "ethereum",
      assetName: "Ethereum",
      type: "sell",
      entryPrice: 3200,
      entryDate: "2023-08-22",
      exitPrice: 2800,
      exitDate: 1692376800000,
      quantity: 3,
      leverage: 1,
      fees: 15,
      profit: 1200,
      profitPercentage: 12.5,
      outcome: "win",
      notes: "שורט בעקבות דיברגנס ב-RSI והיפוך ב-4H. הוספתי לפוזיציה בירידה.",
      tags: ["divergence", "ethereum", "reversal"],
      strategy: "technical",
      date: "2023-08-22",
      symbol: "ETH/USD",
      direction: "short",
      stopLoss: 3350,
      targetPrice: 2600,
      positionSize: 9600,
      risk: 1.2
    },
    {
      id: "3",
      assetId: "solana",
      assetName: "Solana",
      type: "buy",
      entryPrice: 85,
      entryDate: "2023-10-05",
      exitPrice: 82,
      exitDate: 1696550400000,
      quantity: 25,
      leverage: 1,
      fees: 8,
      profit: -75,
      profitPercentage: -3.5,
      outcome: "loss",
      notes: "כניסה מוקדמת מדי לפני אימות התבנית. הפעם הבאה אחכה לאימות נוסף.",
      tags: ["cup-and-handle", "solana"],
      strategy: "pattern",
      date: "2023-10-05",
      symbol: "SOL/USD",
      direction: "long",
      stopLoss: 80,
      targetPrice: 95,
      positionSize: 2125,
      risk: 0.8
    }
  ];
};
