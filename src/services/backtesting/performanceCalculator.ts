
import { BacktestSettings, BacktestTrade, EquityPoint, MonthlyPerformance, AssetPerformance } from './types';

// Calculate performance metrics from a list of trades
export function calculatePerformance(trades: BacktestTrade[], settings: BacktestSettings) {
  // If no trades, return empty metrics
  if (!trades || trades.length === 0) {
    return {
      metrics: {
        totalReturn: 0,
        totalReturnPercentage: 0,
        winRate: 0,
        averageWin: 0,
        averageLoss: 0,
        largestWin: 0,
        largestLoss: 0,
        profitFactor: 0,
        maxDrawdown: 0,
        sharpeRatio: 0,
        totalTrades: 0,
        winningTrades: 0,
        losingTrades: 0,
        averageTradeDuration: 0
      },
      equity: [],
      monthly: [],
      assetPerformance: []
    };
  }
  
  // Sort trades by entry date
  const sortedTrades = [...trades].sort((a, b) => a.entryDate - b.entryDate);
  
  // Calculate basic metrics
  const totalTrades = sortedTrades.length;
  const winningTrades = sortedTrades.filter(trade => (trade.profit || 0) > 0).length;
  const losingTrades = totalTrades - winningTrades;
  const winRate = (winningTrades / totalTrades) * 100;
  
  // Calculate profit metrics
  const winningTradesArray = sortedTrades.filter(trade => (trade.profit || 0) > 0);
  const losingTradesArray = sortedTrades.filter(trade => (trade.profit || 0) <= 0);
  
  const totalProfit = sortedTrades.reduce((sum, trade) => sum + (trade.profit || 0), 0);
  const totalProfitPercentage = sortedTrades.reduce((sum, trade) => sum + (trade.profitPercentage || 0), 0);
  
  const totalWinAmount = winningTradesArray.reduce((sum, trade) => sum + (trade.profit || 0), 0);
  const totalLossAmount = losingTradesArray.reduce((sum, trade) => sum + (trade.profit || 0), 0);
  
  const averageWin = winningTradesArray.length > 0 ? totalWinAmount / winningTradesArray.length : 0;
  const averageLoss = losingTradesArray.length > 0 ? totalLossAmount / losingTradesArray.length : 0;
  
  const largestWin = winningTradesArray.length > 0 
    ? Math.max(...winningTradesArray.map(trade => trade.profit || 0))
    : 0;
    
  const largestLoss = losingTradesArray.length > 0 
    ? Math.min(...losingTradesArray.map(trade => trade.profit || 0))
    : 0;
  
  const profitFactor = totalLossAmount !== 0 ? Math.abs(totalWinAmount / totalLossAmount) : totalWinAmount > 0 ? Infinity : 0;
  
  // Calculate average trade duration (if available)
  let averageTradeDuration = 0;
  const tradesWithDuration = sortedTrades.filter(trade => trade.duration !== undefined);
  if (tradesWithDuration.length > 0) {
    averageTradeDuration = tradesWithDuration.reduce((sum, trade) => sum + (trade.duration || 0), 0) / tradesWithDuration.length;
  }
  
  // Build equity curve
  const equity: EquityPoint[] = [];
  let balance = settings.initialCapital;
  let maxBalance = balance;
  let currentDrawdown = 0;
  let maxDrawdown = 0;
  
  // Start with initial balance
  equity.push({
    date: sortedTrades[0].entryDate,
    value: balance,
    equity: balance,
    drawdown: 0
  });
  
  // Process each trade
  sortedTrades.forEach(trade => {
    balance += (trade.profit || 0);
    
    if (balance > maxBalance) {
      maxBalance = balance;
      currentDrawdown = 0;
    } else {
      currentDrawdown = (maxBalance - balance) / maxBalance * 100;
      if (currentDrawdown > maxDrawdown) {
        maxDrawdown = currentDrawdown;
      }
    }
    
    equity.push({
      date: trade.exitDate,
      value: balance,
      equity: balance,
      drawdown: currentDrawdown
    });
  });
  
  // Calculate monthly performance
  const monthly: MonthlyPerformance[] = [];
  const tradesByMonth: { [key: string]: BacktestTrade[] } = {};
  
  sortedTrades.forEach(trade => {
    const date = new Date(trade.entryDate);
    const monthKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
    
    if (!tradesByMonth[monthKey]) {
      tradesByMonth[monthKey] = [];
    }
    
    tradesByMonth[monthKey].push(trade);
  });
  
  Object.keys(tradesByMonth).forEach(period => {
    const monthTrades = tradesByMonth[period];
    const monthReturn = monthTrades.reduce((sum, trade) => sum + (trade.profit || 0), 0);
    
    monthly.push({
      period,
      return: monthReturn,
      trades: monthTrades.length
    });
  });
  
  // Calculate performance by asset
  const assetPerformance: AssetPerformance[] = [];
  const tradesByAsset: { [key: string]: BacktestTrade[] } = {};
  
  sortedTrades.forEach(trade => {
    if (!trade.assetId) return;
    
    if (!tradesByAsset[trade.assetId]) {
      tradesByAsset[trade.assetId] = [];
    }
    
    tradesByAsset[trade.assetId].push(trade);
  });
  
  Object.keys(tradesByAsset).forEach(assetId => {
    const assetTrades = tradesByAsset[assetId];
    const assetReturn = assetTrades.reduce((sum, trade) => sum + (trade.profit || 0), 0);
    const assetWinningTrades = assetTrades.filter(trade => (trade.profit || 0) > 0).length;
    const assetWinRate = (assetWinningTrades / assetTrades.length) * 100;
    
    assetPerformance.push({
      assetId,
      assetName: assetTrades[0].assetName || assetId,
      return: assetReturn,
      trades: assetTrades.length,
      winRate: assetWinRate
    });
  });
  
  // Sharpe ratio calculation (simplified, using a risk-free rate of 0)
  const returns = sortedTrades.map(trade => trade.profitPercentage || 0);
  const mean = returns.reduce((sum, ret) => sum + ret, 0) / returns.length;
  const variance = returns.reduce((sum, ret) => sum + Math.pow(ret - mean, 2), 0) / returns.length;
  const stdDev = Math.sqrt(variance);
  const sharpeRatio = stdDev !== 0 ? mean / stdDev : 0;
  
  // Return all calculated metrics
  return {
    metrics: {
      totalReturn: totalProfit,
      totalReturnPercentage: totalProfitPercentage,
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
      averageTradeDuration
    },
    equity,
    monthly,
    assetPerformance
  };
}
