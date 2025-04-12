
import { BacktestTrade } from '../types';

// Function to detect market trends based on trade patterns
export const detectMarketTrends = (trades: BacktestTrade[]) => {
  const trendPeriods = [];
  const monthlyPerformance = getMonthlyPerformance(trades);
  
  // Define some thresholds
  const BULL_MARKET_THRESHOLD = 0.05; // 5% growth
  const BEAR_MARKET_THRESHOLD = -0.03; // 3% decline
  
  // Find consecutive months with similar trend
  let currentTrend = null;
  let trendStart = '';
  let trendPoints = [];
  
  for (let i = 0; i < monthlyPerformance.length; i++) {
    const month = monthlyPerformance[i];
    
    if (month.return > BULL_MARKET_THRESHOLD) {
      // Bullish month
      if (currentTrend === 'bull') {
        // Continue existing bull trend
        trendPoints.push(month);
      } else {
        // Start new bull trend
        if (currentTrend !== null && trendPoints.length > 0) {
          trendPeriods.push({
            type: currentTrend,
            start: trendStart,
            end: monthlyPerformance[i-1].period,
            strength: getTrendStrength(trendPoints),
            duration: trendPoints.length
          });
        }
        
        currentTrend = 'bull';
        trendStart = month.period;
        trendPoints = [month];
      }
    } else if (month.return < BEAR_MARKET_THRESHOLD) {
      // Bearish month
      if (currentTrend === 'bear') {
        // Continue existing bear trend
        trendPoints.push(month);
      } else {
        // Start new bear trend
        if (currentTrend !== null && trendPoints.length > 0) {
          trendPeriods.push({
            type: currentTrend,
            start: trendStart,
            end: monthlyPerformance[i-1].period,
            strength: getTrendStrength(trendPoints),
            duration: trendPoints.length
          });
        }
        
        currentTrend = 'bear';
        trendStart = month.period;
        trendPoints = [month];
      }
    } else {
      // Sideways/consolidation
      if (currentTrend === 'sideways') {
        // Continue sideways
        trendPoints.push(month);
      } else {
        // Start new sideways trend
        if (currentTrend !== null && trendPoints.length > 0) {
          trendPeriods.push({
            type: currentTrend,
            start: trendStart,
            end: monthlyPerformance[i-1].period,
            strength: getTrendStrength(trendPoints),
            duration: trendPoints.length
          });
        }
        
        currentTrend = 'sideways';
        trendStart = month.period;
        trendPoints = [month];
      }
    }
  }
  
  // Add the last trend if exists
  if (currentTrend !== null && trendPoints.length > 0) {
    trendPeriods.push({
      type: currentTrend,
      start: trendStart,
      end: monthlyPerformance[monthlyPerformance.length - 1].period,
      strength: getTrendStrength(trendPoints),
      duration: trendPoints.length
    });
  }
  
  return {
    trends: trendPeriods,
    monthlyPerformance: monthlyPerformance
  };
};

// Helper function to calculate monthly performance
const getMonthlyPerformance = (trades: BacktestTrade[]) => {
  const monthlyTrades = {};
  const monthlyPerformance = [];
  
  // Group trades by month
  trades.forEach(trade => {
    // Use a string for the date instead of a number
    const entryDate = new Date(trade.entryDate);
    const month = `${entryDate.getFullYear()}-${String(entryDate.getMonth() + 1).padStart(2, '0')}`;
    
    if (!monthlyTrades[month]) {
      monthlyTrades[month] = [];
    }
    
    monthlyTrades[month].push(trade);
  });
  
  // Calculate performance for each month
  Object.keys(monthlyTrades).sort().forEach(month => {
    const monthTrades = monthlyTrades[month];
    const totalReturn = monthTrades.reduce((sum, trade) => sum + trade.profit, 0);
    
    monthlyPerformance.push({
      period: month,
      return: totalReturn,
      trades: monthTrades.length
    });
  });
  
  return monthlyPerformance;
};

// Helper to calculate trend strength
const getTrendStrength = (trendPoints) => {
  if (trendPoints.length === 0) return 0;
  
  const avgReturn = trendPoints.reduce((sum, point) => sum + point.return, 0) / trendPoints.length;
  
  // Strength based on average return and duration
  const strengthValue = Math.abs(avgReturn) * Math.min(trendPoints.length, 6) / 6;
  
  if (strengthValue > 0.05) return 'strong';
  if (strengthValue > 0.02) return 'medium';
  return 'weak';
};
