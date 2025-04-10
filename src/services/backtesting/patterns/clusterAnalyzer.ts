
import { Trade } from '../types';
import { ClusterInfo } from './types';

// Advanced analysis of trade clustering
export const analyzeTradeClusters = (
  trades: Trade[]
): {
  clusters: ClusterInfo[];
  bestTimesToTrade: string[];
  worstTimesToTrade: string[];
} => {
  // Sort trades by date
  const sortedTrades = [...trades].sort((a, b) => 
    new Date(a.entryDate).getTime() - new Date(b.entryDate).getTime()
  );
  
  // Extract hour of day for each trade
  const tradeHours = sortedTrades.map(trade => {
    const date = new Date(trade.entryDate);
    return {
      hour: date.getHours(),
      profit: trade.profit || 0,
      strategy: trade.strategyUsed
    };
  });
  
  // Group by hour
  const hourlyGroups: Record<number, { profits: number[]; strategies: Record<string, number> }> = {};
  
  tradeHours.forEach(trade => {
    if (!hourlyGroups[trade.hour]) {
      hourlyGroups[trade.hour] = { profits: [], strategies: {} };
    }
    hourlyGroups[trade.hour].profits.push(trade.profit);
    
    if (!hourlyGroups[trade.hour].strategies[trade.strategy]) {
      hourlyGroups[trade.hour].strategies[trade.strategy] = 0;
    }
    hourlyGroups[trade.hour].strategies[trade.strategy]++;
  });
  
  // Calculate performance for each hour
  const clusters = Object.entries(hourlyGroups).map(([hour, data]) => {
    const totalProfit = data.profits.reduce((sum, p) => sum + p, 0);
    const avgPerformance = totalProfit / data.profits.length;
    
    // Find most common strategy in this hour
    let bestStrategy = '';
    let maxCount = 0;
    
    Object.entries(data.strategies).forEach(([strategy, count]) => {
      if (count > maxCount) {
        maxCount = count;
        bestStrategy = strategy;
      }
    });
    
    return {
      period: `${hour}:00-${Number(hour) + 1}:00`,
      count: data.profits.length,
      performance: avgPerformance,
      strategy: bestStrategy
    };
  });
  
  // Sort clusters by performance
  const sortedClusters = [...clusters].sort((a, b) => b.performance - a.performance);
  
  // Extract best and worst times
  const bestTimesToTrade = sortedClusters
    .filter(c => c.performance > 0 && c.count >= 3)
    .slice(0, 3)
    .map(c => c.period);
    
  const worstTimesToTrade = sortedClusters
    .filter(c => c.performance < 0 && c.count >= 3)
    .slice(0, 3)
    .map(c => c.period);
  
  return {
    clusters,
    bestTimesToTrade,
    worstTimesToTrade
  };
};
