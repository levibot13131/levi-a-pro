
import { Trade, BacktestResults } from './types';

// Pattern types for market analysis
export type PatternType = 'bullish' | 'bearish' | 'neutral';

// Interface for detected patterns
export interface DetectedPattern {
  name: string;
  type: PatternType;
  startDate: string;
  endDate: string;
  significance: number; // 1-10 rating
  description: string;
}

// Detect trend patterns from a sequence of trades
export const detectMarketTrends = (trades: Trade[]): {
  trends: { period: string; direction: string; strength: number }[];
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

// Detect candlestick patterns in trade history
export const detectPatterns = (
  trades: Trade[], 
  assetPrices: { date: string; open: number; high: number; low: number; close: number; volume: number }[]
): DetectedPattern[] => {
  const patterns: DetectedPattern[] = [];
  
  // Need at least a few data points for pattern detection
  if (assetPrices.length < 5) return patterns;
  
  // Example pattern detection (in reality, would use more sophisticated algorithms)
  
  // Check for double bottom pattern
  for (let i = 2; i < assetPrices.length - 2; i++) {
    const firstBottom = assetPrices[i-2];
    const middle = assetPrices[i];
    const secondBottom = assetPrices[i+2];
    
    if (
      firstBottom.low < firstBottom.open && 
      firstBottom.low < assetPrices[i-1].low &&
      secondBottom.low < secondBottom.open &&
      secondBottom.low < assetPrices[i+1].low &&
      Math.abs(firstBottom.low - secondBottom.low) / firstBottom.low < 0.03 && // Bottoms within 3%
      middle.low > firstBottom.low * 1.03 // Middle at least 3% higher
    ) {
      patterns.push({
        name: 'Double Bottom',
        type: 'bullish',
        startDate: new Date(firstBottom.date).toISOString(),
        endDate: new Date(secondBottom.date).toISOString(),
        significance: 8,
        description: 'תבנית דאבל בוטום מצביעה על תמיכה משמעותית והיפוך מגמה פוטנציאלי'
      });
    }
  }
  
  // Check for head and shoulders pattern
  for (let i = 4; i < assetPrices.length - 2; i++) {
    const leftShoulder = assetPrices[i-4];
    const head = assetPrices[i-2];
    const rightShoulder = assetPrices[i];
    
    if (
      head.high > leftShoulder.high &&
      head.high > rightShoulder.high &&
      Math.abs(leftShoulder.high - rightShoulder.high) / leftShoulder.high < 0.05 && // Shoulders within 5%
      assetPrices[i-3].low < leftShoulder.low * 1.02 && // Neck line
      assetPrices[i-1].low < rightShoulder.low * 1.02
    ) {
      patterns.push({
        name: 'Head and Shoulders',
        type: 'bearish',
        startDate: new Date(leftShoulder.date).toISOString(),
        endDate: new Date(rightShoulder.date).toISOString(),
        significance: 9,
        description: 'תבנית הראש והכתפיים מצביעה על היפוך מגמה מעליות לירידות, סיכוי גבוה לתחילת מגמה יורדת'
      });
    }
  }
  
  // More patterns could be added here...
  
  return patterns;
};

// Advanced analysis of trade clustering
export const analyzeTradeClusters = (
  trades: Trade[]
): {
  clusters: { period: string; count: number; performance: number; strategy: string }[];
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

// New function to analyze market regimes using results
export const analyzeMarketRegimes = (results: BacktestResults): {
  bullMarketPerformance: number;
  bearMarketPerformance: number;
  rangeBoundPerformance: number;
  volatilePerformance: number;
  bestRegime: string;
} => {
  // Placeholder for real implementation
  // In a real implementation, this would analyze equity curve and volatility
  
  // Calculate volatility over periods to identify regimes
  const dailyReturns: number[] = [];
  
  for (let i = 1; i < results.equity.length; i++) {
    const todayValue = results.equity[i].value;
    const yesterdayValue = results.equity[i-1].value;
    const dailyReturn = (todayValue - yesterdayValue) / yesterdayValue;
    dailyReturns.push(dailyReturn);
  }
  
  // Calculate rolling volatility
  const rollingWindow = 10; // 10-day volatility
  const rollingVol: number[] = [];
  
  for (let i = rollingWindow; i <= dailyReturns.length; i++) {
    const windowReturns = dailyReturns.slice(i - rollingWindow, i);
    const mean = windowReturns.reduce((sum, r) => sum + r, 0) / rollingWindow;
    const variance = windowReturns.reduce((sum, r) => sum + Math.pow(r - mean, 2), 0) / rollingWindow;
    const volatility = Math.sqrt(variance);
    rollingVol.push(volatility);
  }
  
  // Classify regimes based on returns and volatility
  const regimes: ('bull' | 'bear' | 'range' | 'volatile')[] = [];
  
  for (let i = 0; i < rollingVol.length; i++) {
    const avgReturn = dailyReturns.slice(i, i + rollingWindow).reduce((sum, r) => sum + r, 0) / rollingWindow;
    const vol = rollingVol[i];
    
    if (avgReturn > 0.005 && vol < 0.015) {
      regimes.push('bull');
    } else if (avgReturn < -0.005 && vol < 0.015) {
      regimes.push('bear');
    } else if (Math.abs(avgReturn) < 0.002) {
      regimes.push('range');
    } else {
      regimes.push('volatile');
    }
  }
  
  // Calculate performance in each regime type
  const regimePerformance = {
    bull: 0,
    bear: 0,
    range: 0,
    volatile: 0
  };
  
  const regimeCounts = {
    bull: 0,
    bear: 0,
    range: 0,
    volatile: 0
  };
  
  // Analyze trades in each regime
  results.trades.forEach(trade => {
    const tradeDate = new Date(trade.entryDate).getTime();
    
    // Find corresponding regime period
    for (let i = 0; i < regimes.length; i++) {
      const regimeDate = new Date(results.equity[i + rollingWindow].date).getTime();
      
      // If trade is within 2 days of this regime date, count it
      if (Math.abs(tradeDate - regimeDate) < 2 * 24 * 60 * 60 * 1000) {
        regimePerformance[regimes[i]] += trade.profitPercentage || 0;
        regimeCounts[regimes[i]]++;
        break;
      }
    }
  });
  
  // Calculate average performance per regime
  const bullMarketPerformance = regimeCounts.bull ? regimePerformance.bull / regimeCounts.bull : 0;
  const bearMarketPerformance = regimeCounts.bear ? regimePerformance.bear / regimeCounts.bear : 0;
  const rangeBoundPerformance = regimeCounts.range ? regimePerformance.range / regimeCounts.range : 0;
  const volatilePerformance = regimeCounts.volatile ? regimePerformance.volatile / regimeCounts.volatile : 0;
  
  // Determine best regime
  const performances = [
    { regime: 'Bull Market', performance: bullMarketPerformance },
    { regime: 'Bear Market', performance: bearMarketPerformance },
    { regime: 'Range Bound', performance: rangeBoundPerformance },
    { regime: 'Volatile Market', performance: volatilePerformance }
  ];
  
  performances.sort((a, b) => b.performance - a.performance);
  const bestRegime = performances[0].regime;
  
  return {
    bullMarketPerformance,
    bearMarketPerformance,
    rangeBoundPerformance,
    volatilePerformance,
    bestRegime
  };
};
