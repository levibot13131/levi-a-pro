
import { Trade } from '../types';
import { TrendInfo } from './types';

// Detect trend patterns from a sequence of trades
export const detectMarketTrends = (trades: Trade[]): {
  trends: TrendInfo[];
  overallTrend: string;
} => {
  // Sort trades by date
  const sortedTrades = [...trades].sort((a, b) => 
    new Date(a.entryDate).getTime() - new Date(b.entryDate).getTime()
  );
  
  if (sortedTrades.length < 5) {
    return { 
      trends: [], 
      overallTrend: 'insufficient data' 
    };
  }
  
  // Group trades by month
  const monthlyGroups: Record<string, Trade[]> = {};
  
  sortedTrades.forEach(trade => {
    const yearMonth = trade.entryDate.substring(0, 7); // YYYY-MM
    if (!monthlyGroups[yearMonth]) {
      monthlyGroups[yearMonth] = [];
    }
    monthlyGroups[yearMonth].push(trade);
  });
  
  // Calculate trend for each month
  const trends = Object.entries(monthlyGroups).map(([period, periodTrades]) => {
    const winningTrades = periodTrades.filter(t => (t.profit || 0) > 0);
    const losingTrades = periodTrades.filter(t => (t.profit || 0) <= 0);
    
    // Calculate trend strength (positive is bullish, negative is bearish)
    const tradeResults = periodTrades.map(t => t.profit || 0);
    const netResult = tradeResults.reduce((sum, profit) => sum + profit, 0);
    const averageResult = netResult / periodTrades.length;
    
    // Normalize strength to a -10 to 10 scale
    const strength = Math.min(10, Math.max(-10, averageResult * 5 / Math.max(...tradeResults.map(Math.abs))));
    
    return {
      period,
      direction: strength > 0 ? 'bullish' : strength < 0 ? 'bearish' : 'neutral',
      strength: Math.abs(strength)
    };
  });
  
  // Calculate overall trend
  const trendStrengths = trends.map(t => t.direction === 'bullish' ? t.strength : t.direction === 'bearish' ? -t.strength : 0);
  const averageTrendStrength = trendStrengths.reduce((sum, s) => sum + s, 0) / trendStrengths.length;
  
  let overallTrend = 'neutral';
  if (averageTrendStrength > 2) overallTrend = 'strongly bullish';
  else if (averageTrendStrength > 0.5) overallTrend = 'mildly bullish';
  else if (averageTrendStrength < -2) overallTrend = 'strongly bearish';
  else if (averageTrendStrength < -0.5) overallTrend = 'mildly bearish';
  
  return { trends, overallTrend };
};
