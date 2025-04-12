import { BacktestTrade, BacktestResult, EquityPoint, MonthlyPerformance, AssetPerformance } from './types';

// Process trade data and calculate performance metrics
export const calculatePerformance = (trades: BacktestTrade[], initialCapital: number = 10000) => {
  // Basic metrics
  const totalTrades = trades.length;
  const winningTrades = trades.filter(t => t.profit > 0).length;
  const losingTrades = trades.filter(t => t.profit <= 0).length;
  const winRate = totalTrades > 0 ? (winningTrades / totalTrades) * 100 : 0;
  
  // Profit metrics
  const totalProfit = trades.reduce((sum, t) => sum + t.profit, 0);
  const totalReturn = totalProfit;
  const totalReturnPercentage = (totalProfit / initialCapital) * 100;
  
  // Win/Loss metrics
  const winningTradesData = trades.filter(t => t.profit > 0);
  const losingTradesData = trades.filter(t => t.profit <= 0);
  
  const totalWinAmount = winningTradesData.reduce((sum, t) => sum + t.profit, 0);
  const totalLossAmount = losingTradesData.reduce((sum, t) => sum + t.profit, 0);
  
  const averageWin = winningTradesData.length > 0 ? totalWinAmount / winningTradesData.length : 0;
  const averageLoss = losingTradesData.length > 0 ? totalLossAmount / losingTradesData.length : 0;
  
  const largestWin = winningTradesData.length > 0 
    ? Math.max(...winningTradesData.map(t => t.profit))
    : 0;
    
  const largestLoss = losingTradesData.length > 0 
    ? Math.min(...losingTradesData.map(t => t.profit))
    : 0;
  
  // Ratio metrics
  const profitFactor = Math.abs(totalLossAmount) > 0 
    ? Math.abs(totalWinAmount / totalLossAmount)
    : totalWinAmount > 0 ? 999 : 0;
  
  // Drawdown calculation
  const equity = calculateEquityCurve(trades, initialCapital);
  const maxDrawdown = calculateMaxDrawdown(equity);
  
  // Time-based metrics
  const averageTradeDuration = calculateAverageTradeDuration(trades);
  
  // Risk-adjusted return (simple Sharpe ratio)
  const dailyReturns = calculateDailyReturns(equity);
  const sharpeRatio = calculateSharpeRatio(dailyReturns);
  
  // Monthly performance breakdown
  const monthly = calculateMonthlyPerformance(trades);
  
  // Asset performance breakdown
  const assetPerformance = calculateAssetPerformance(trades);
  
  return {
    totalReturn,
    totalReturnPercentage,
    winRate,
    averageWin,
    averageLoss,
    largestWin,
    largestLoss,
    profitFactor,
    maxDrawdown,
    sharpeRatio,
    totalTrades,
    winningTrades,
    losingTrades,
    averageTradeDuration,
    equity,
    monthly,
    assetPerformance
  };
};

// Calculate equity curve with drawdown
export const calculateEquityCurve = (trades: BacktestTrade[], initialCapital: number): EquityPoint[] => {
  let equity = initialCapital;
  let peak = initialCapital;
  const equityCurve: EquityPoint[] = [
    { date: trades.length > 0 ? new Date(trades[0].entryDate).toISOString() : new Date().toISOString(), value: initialCapital, drawdown: 0 }
  ];
  
  // Sort trades by exit date
  const sortedTrades = [...trades].sort((a, b) => a.exitDate - b.exitDate);
  
  for (let i = 0; i < sortedTrades.length; i++) {
    const trade = sortedTrades[i];
    const exitDate = new Date(trade.exitDate).toISOString();
    
    // Update equity with trade profit/loss
    equity += trade.profit;
    
    // Update peak if new high
    if (equity > peak) {
      peak = equity;
    }
    
    // Calculate drawdown from peak
    const drawdown = ((peak - equity) / peak) * 100;
    
    equityCurve.push({
      date: exitDate,
      value: equity,
      drawdown
    });
  }
  
  return equityCurve;
};

// Calculate maximum drawdown from equity curve
const calculateMaxDrawdown = (equityCurve: EquityPoint[]): number => {
  return Math.max(...equityCurve.map(point => point.drawdown));
};

// Calculate daily returns from equity curve
const calculateDailyReturns = (equityCurve: EquityPoint[]): number[] => {
  const returns = [];
  
  for (let i = 1; i < equityCurve.length; i++) {
    const previousValue = equityCurve[i-1].value;
    const currentValue = equityCurve[i].value;
    const dailyReturn = (currentValue - previousValue) / previousValue;
    returns.push(dailyReturn);
  }
  
  return returns;
};

// Calculate Sharpe ratio
const calculateSharpeRatio = (returns: number[], riskFreeRate: number = 0.02/365): number => {
  if (returns.length === 0) return 0;
  
  const meanReturn = returns.reduce((sum, r) => sum + r, 0) / returns.length;
  const excessReturns = returns.map(r => r - riskFreeRate);
  const variance = excessReturns.reduce((sum, r) => sum + Math.pow(r - meanReturn, 2), 0) / excessReturns.length;
  const standardDeviation = Math.sqrt(variance);
  
  if (standardDeviation === 0) return 0;
  
  return (meanReturn - riskFreeRate) / standardDeviation * Math.sqrt(252); // Annualize
};

// Calculate monthly performance
const calculateMonthlyPerformance = (trades: BacktestTrade[]): MonthlyPerformance[] => {
  const monthlyData = {};
  
  trades.forEach(trade => {
    // Use a string for the date to safely use substring
    const exitDate = new Date(trade.exitDate);
    const monthKey = `${exitDate.getFullYear()}-${String(exitDate.getMonth() + 1).padStart(2, '0')}`;
    
    if (!monthlyData[monthKey]) {
      monthlyData[monthKey] = { profit: 0, trades: 0 };
    }
    
    monthlyData[monthKey].profit += trade.profit;
    monthlyData[monthKey].trades += 1;
  });
  
  const monthlyPerformance: MonthlyPerformance[] = Object.keys(monthlyData)
    .sort()
    .map(month => ({
      period: month,
      return: monthlyData[month].profit,
      trades: monthlyData[month].trades
    }));
  
  return monthlyPerformance;
};

// Calculate performance by asset
const calculateAssetPerformance = (trades: BacktestTrade[]): AssetPerformance[] => {
  const assetData = {};
  
  trades.forEach(trade => {
    const assetId = trade.assetId || 'unknown';
    
    if (!assetData[assetId]) {
      assetData[assetId] = { 
        profits: 0, 
        trades: 0, 
        wins: 0,
        assetName: trade.assetName || assetId
      };
    }
    
    assetData[assetId].profits += trade.profit;
    assetData[assetId].trades += 1;
    if (trade.profit > 0) {
      assetData[assetId].wins += 1;
    }
  });
  
  const assetPerformance: AssetPerformance[] = Object.keys(assetData)
    .map(assetId => ({
      assetId,
      assetName: assetData[assetId].assetName,
      return: assetData[assetId].profits,
      trades: assetData[assetId].trades,
      winRate: (assetData[assetId].wins / assetData[assetId].trades) * 100
    }));
  
  return assetPerformance;
};

// Calculate average trade duration in days
const calculateAverageTradeDuration = (trades: BacktestTrade[]): number => {
  if (trades.length === 0) return 0;
  
  // Use the duration property if available
  const tradesWithDuration = trades.filter(t => t.duration !== undefined);
  if (tradesWithDuration.length > 0) {
    return tradesWithDuration.reduce((sum, t) => sum + (t.duration || 0), 0) / tradesWithDuration.length;
  }
  
  // Otherwise calculate from entry/exit dates
  let totalDuration = 0;
  
  trades.forEach(trade => {
    const entryDate = new Date(trade.entryDate);
    const exitDate = new Date(trade.exitDate);
    const durationMs = exitDate.getTime() - entryDate.getTime();
    const durationDays = durationMs / (1000 * 60 * 60 * 24);
    totalDuration += durationDays;
  });
  
  return totalDuration / trades.length;
};
