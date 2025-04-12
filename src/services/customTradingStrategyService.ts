
// Custom trading strategy service exports

export interface PositionSizingCalculation {
  positionSize: number;
  riskAmount: number;
  potentialProfit: number;
  riskRewardRatio: number;
}

export interface TradingPerformanceStats {
  winRate: number;
  averageProfit: number;
  profitFactor: number;
  maxDrawdown: number;
  sharpeRatio: number;
}

export interface TrendTradingStats {
  trendStrength: number;
  averageTrendDuration: number;
  winRateInTrend: number;
}

export const tradingApproach = {
  name: "Trend Following",
  description: "Strategy focusing on identifying and following established market trends",
  timeframes: ["1h", "4h", "1d"],
  indicators: ["Moving Averages", "MACD", "RSI"],
  rules: [
    "Enter when price breaks above/below key moving averages",
    "Use RSI to confirm trend strength",
    "Set stop-loss at recent swing high/low"
  ]
};

export const riskManagementRules = [
  "Never risk more than 1-2% per trade",
  "Always use a stop-loss order",
  "Ensure risk-reward ratio of at least 1:2",
  "Avoid trading during major news events",
  "Reduce position size during periods of high volatility"
];

export const calculatePositionSize = (
  accountSize: number,
  riskPercentage: number,
  entryPrice: number,
  stopLossPrice: number
): PositionSizingCalculation => {
  const direction = entryPrice > stopLossPrice ? 'long' : 'short';
  const riskPerShare = Math.abs(entryPrice - stopLossPrice);
  const riskAmount = accountSize * (riskPercentage / 100);
  const shares = riskAmount / riskPerShare;
  
  const positionSize = shares * entryPrice;
  const targetPrice = direction === 'long' 
    ? entryPrice + (riskPerShare * 2) 
    : entryPrice - (riskPerShare * 2);
  
  const potentialProfit = shares * Math.abs(targetPrice - entryPrice);
  
  return {
    positionSize,
    riskAmount,
    potentialProfit,
    riskRewardRatio: potentialProfit / riskAmount
  };
};

export const getTradingPerformanceStats = (): TradingPerformanceStats => {
  return {
    winRate: 62.5,
    averageProfit: 1.8,
    profitFactor: 2.1,
    maxDrawdown: 12.3,
    sharpeRatio: 1.45
  };
};

export const getTrendTradingStats = (): TrendTradingStats => {
  return {
    trendStrength: 7.2,
    averageTrendDuration: 14.5,
    winRateInTrend: 78.3
  };
};
