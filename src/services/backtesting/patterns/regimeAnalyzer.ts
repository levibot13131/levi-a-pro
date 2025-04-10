
import { BacktestResults } from '../types';
import { RegimeAnalysisResult } from './types';

// Analyze market regimes using results
export const analyzeMarketRegimes = (results: BacktestResults): RegimeAnalysisResult => {
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
