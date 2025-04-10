
import { BacktestSettings, Trade, BacktestResults } from './types';

// Calculate performance metrics from a list of trades
export const calculatePerformanceMetrics = (
  trades: Trade[], 
  settings: BacktestSettings,
  equityCurve: { date: string; value: number; drawdown: number }[]
): BacktestResults => {
  // Calculate winning and losing trades
  const winningTrades = trades.filter(t => (t.profit || 0) > 0);
  const losingTrades = trades.filter(t => (t.profit || 0) <= 0);
  
  // Calculate total return
  const totalReturn = trades.reduce((sum, trade) => sum + (trade.profit || 0), 0);
  const totalReturnPercentage = (totalReturn / settings.initialCapital) * 100;
  const winRate = (winningTrades.length / trades.length) * 100;
  
  // Calculate average win/loss
  const averageWin = winningTrades.length
    ? winningTrades.reduce((sum, trade) => sum + (trade.profitPercentage || 0), 0) / winningTrades.length
    : 0;
    
  const averageLoss = losingTrades.length
    ? losingTrades.reduce((sum, trade) => sum + (trade.profitPercentage || 0), 0) / losingTrades.length
    : 0;
    
  // Calculate largest win/loss
  const largestWin = winningTrades.length
    ? Math.max(...winningTrades.map(trade => trade.profitPercentage || 0))
    : 0;
    
  const largestLoss = losingTrades.length
    ? Math.min(...losingTrades.map(trade => trade.profitPercentage || 0))
    : 0;
    
  // Calculate profit factor
  const profitFactor = Math.abs(averageLoss) > 0
    ? Math.abs(averageWin / averageLoss)
    : Infinity;
  
  // Calculate max drawdown from equity curve
  const maxDrawdown = equityCurve.length
    ? Math.max(...equityCurve.map(point => point.drawdown))
    : 0;
  
  // Calculate Sharpe ratio (simplified)
  const returns = equityCurve.map((point, index, array) => {
    if (index === 0) return 0;
    return (point.value - array[index - 1].value) / array[index - 1].value;
  });
  
  const averageReturn = returns.reduce((sum, ret) => sum + ret, 0) / returns.length;
  const stdDeviation = Math.sqrt(
    returns.reduce((sum, ret) => sum + Math.pow(ret - averageReturn, 2), 0) / returns.length
  );
  
  const sharpeRatio = stdDeviation > 0 ? (averageReturn / stdDeviation) * Math.sqrt(252) : 0;
  
  // Generate monthly performance data
  const monthlyMap = generateMonthlyPerformance(trades);
  
  // Generate asset performance data
  const assetPerformance = generateAssetPerformance(trades);
  
  // Return the results
  return {
    trades,
    performance: {
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
      totalTrades: trades.length,
      winningTrades: winningTrades.length,
      losingTrades: losingTrades.length,
      averageTradeDuration: trades.reduce((sum, trade) => sum + (trade.duration || 0), 0) / trades.length
    },
    equity: equityCurve,
    monthly: monthlyMap,
    assetPerformance
  };
};

// Generate monthly performance data
const generateMonthlyPerformance = (trades: Trade[]) => {
  const monthlyMap = new Map<string, {return: number, trades: number}>();
  
  trades.forEach(trade => {
    const month = trade.entryDate.substring(0, 7); // YYYY-MM
    const existingData = monthlyMap.get(month) || {return: 0, trades: 0};
    monthlyMap.set(month, {
      return: existingData.return + (trade.profitPercentage || 0),
      trades: existingData.trades + 1
    });
  });
  
  return Array.from(monthlyMap.entries()).map(([period, data]) => ({
    period,
    return: data.return,
    trades: data.trades
  }));
};

// Generate asset performance data
const generateAssetPerformance = (trades: Trade[]) => {
  const assetMap = new Map<string, {
    assetName: string,
    return: number,
    trades: number,
    wins: number
  }>();
  
  trades.forEach(trade => {
    const existingData = assetMap.get(trade.assetId) || {
      assetName: trade.assetName,
      return: 0,
      trades: 0,
      wins: 0
    };
    
    assetMap.set(trade.assetId, {
      assetName: trade.assetName,
      return: existingData.return + (trade.profitPercentage || 0),
      trades: existingData.trades + 1,
      wins: existingData.wins + ((trade.profit || 0) > 0 ? 1 : 0)
    });
  });
  
  return Array.from(assetMap.entries()).map(([assetId, data]) => ({
    assetId,
    assetName: data.assetName,
    return: data.return,
    trades: data.trades,
    winRate: (data.wins / data.trades) * 100
  }));
};

