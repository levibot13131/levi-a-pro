
import { BacktestTrade } from '../types';

// Analyze trades to detect market trends
export function detectTrends(trades: BacktestTrade[]): { 
  trends: any[]; 
  monthlyPerformance: any[];
  overallTrend: string;
} {
  if (!trades || trades.length === 0) {
    return { trends: [], monthlyPerformance: [], overallTrend: 'neutral' };
  }
  
  // Sort trades by entry date
  const sortedTrades = [...trades].sort((a, b) => a.entryDate - b.entryDate);
  
  // Group trades by month
  const tradesByMonth: { [key: string]: BacktestTrade[] } = {};
  
  sortedTrades.forEach(trade => {
    const date = new Date(trade.entryDate);
    const monthKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
    
    if (!tradesByMonth[monthKey]) {
      tradesByMonth[monthKey] = [];
    }
    
    tradesByMonth[monthKey].push(trade);
  });
  
  // Analyze monthly performance
  const monthlyPerformance = Object.keys(tradesByMonth).map(month => {
    const monthTrades = tradesByMonth[month];
    const totalProfit = monthTrades.reduce((sum, trade) => sum + (trade.profit || 0), 0);
    const winningTrades = monthTrades.filter(trade => (trade.profit || 0) > 0).length;
    const winRate = (winningTrades / monthTrades.length) * 100;
    
    return {
      month,
      totalProfit,
      tradeCount: monthTrades.length,
      winRate,
      winningTrades,
      losingTrades: monthTrades.length - winningTrades
    };
  });
  
  // Detect trend changes
  const trends = [];
  let currentTrend = 'neutral';
  let trendStart = 0;
  let consecutiveWins = 0;
  let consecutiveLosses = 0;
  
  for (let i = 0; i < sortedTrades.length; i++) {
    const trade = sortedTrades[i];
    
    if ((trade.profit || 0) > 0) {
      consecutiveWins++;
      consecutiveLosses = 0;
    } else {
      consecutiveLosses++;
      consecutiveWins = 0;
    }
    
    // Check for trend changes
    if (consecutiveWins >= 3 && currentTrend !== 'bullish') {
      if (trendStart > 0) {
        trends.push({
          type: currentTrend,
          startDate: new Date(sortedTrades[trendStart].entryDate).toISOString().substring(0, 10),
          endDate: new Date(sortedTrades[i - 1].entryDate).toISOString().substring(0, 10),
          tradeCount: i - trendStart
        });
      }
      
      currentTrend = 'bullish';
      trendStart = i;
    } else if (consecutiveLosses >= 3 && currentTrend !== 'bearish') {
      if (trendStart > 0) {
        trends.push({
          type: currentTrend,
          startDate: new Date(sortedTrades[trendStart].entryDate).toISOString().substring(0, 10),
          endDate: new Date(sortedTrades[i - 1].entryDate).toISOString().substring(0, 10),
          tradeCount: i - trendStart
        });
      }
      
      currentTrend = 'bearish';
      trendStart = i;
    }
  }
  
  // Add the last trend
  if (trendStart < sortedTrades.length - 1) {
    trends.push({
      type: currentTrend,
      startDate: new Date(sortedTrades[trendStart].entryDate).toISOString().substring(0, 10),
      endDate: new Date(sortedTrades[sortedTrades.length - 1].entryDate).toISOString().substring(0, 10),
      tradeCount: sortedTrades.length - trendStart
    });
  }
  
  // Calculate overall trend
  const totalProfit = sortedTrades.reduce((sum, trade) => sum + (trade.profit || 0), 0);
  const overallTrend = totalProfit > 0 ? 'bullish' : totalProfit < 0 ? 'bearish' : 'neutral';
  
  return { trends, monthlyPerformance, overallTrend };
}
