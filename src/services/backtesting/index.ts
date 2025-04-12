
import { BacktestResult, BacktestSettings, BacktestTrade } from './types';
import { calculatePerformance } from './performanceCalculator';
import { detectTrends } from './patterns/trendAnalyzer';
import { generateHistoricalData } from './mockDataGenerator';
import { detectPatterns } from './patterns/candlestickPatterns';

// Main function to run a backtest
export async function runBacktest(settings: BacktestSettings): Promise<BacktestResult> {
  // In a real implementation, this would fetch actual market data and apply strategies
  // For demo purposes, we're generating mock data
  
  const historicalData = await generateHistoricalData(settings.assetIds?.[0] || 'bitcoin', settings.timeframe);
  
  // Generate trades based on the strategy
  const trades = generateMockTrades(historicalData.data, settings);
  
  // Calculate performance metrics
  const performance = calculatePerformance(trades, settings);
  
  // Create and return the backtest result
  const result: BacktestResult = {
    id: `backtest-${Date.now()}`,
    assetId: settings.assetIds?.[0] || 'bitcoin',
    settings,
    trades,
    equity: performance.equity,
    monthly: performance.monthly,
    assetPerformance: performance.assetPerformance,
    performance: performance.metrics,
    enhancedAnalysis: {
      patterns: detectPatterns(historicalData.data),
      trends: detectTrends(trades)
    },
    createdAt: Date.now()
  };
  
  return result;
}

// Helper function to generate mock trades
function generateMockTrades(priceData: any[], settings: BacktestSettings): BacktestTrade[] {
  const trades: BacktestTrade[] = [];
  const startDate = new Date(settings.startDate).getTime();
  const endDate = new Date(settings.endDate).getTime();
  
  // Filter price data to the selected date range
  const filteredData = priceData.filter(point => {
    const timestamp = typeof point.timestamp === 'number' ? point.timestamp : new Date(point.timestamp).getTime();
    return timestamp >= startDate && timestamp <= endDate;
  });
  
  if (filteredData.length < 2) {
    return trades;
  }
  
  // Generate mock trades
  // In a real implementation, this would apply the actual strategy
  for (let i = 10; i < filteredData.length - 10; i += 20) {
    const point = filteredData[i];
    const futurePoint = filteredData[i + 10];
    
    const isBuy = Math.random() > 0.5;
    const entryPrice = point.price;
    const exitPrice = futurePoint.price;
    const profit = isBuy ? exitPrice - entryPrice : entryPrice - exitPrice;
    const profitPercentage = (profit / entryPrice) * 100;
    
    trades.push({
      id: `trade-${i}`,
      type: isBuy ? 'buy' : 'sell',
      entryPrice,
      entryDate: point.timestamp,
      exitPrice,
      exitDate: futurePoint.timestamp,
      quantity: settings.initialCapital * (settings.riskPerTrade / 100) / entryPrice,
      profit,
      profitPercentage,
      assetId: settings.assetIds?.[0],
      assetName: settings.assetIds?.[0],
      direction: isBuy ? 'long' : 'short',
      status: 'closed',
      duration: 10,
      strategyUsed: settings.strategy
    });
  }
  
  return trades;
}

// Function to analyze backtesting trends
export function analyzeBacktestTrends(result: BacktestResult) {
  const trendAnalysis = detectTrends(result.trades);
  return {
    trends: trendAnalysis.trends,
    monthlyPerformance: trendAnalysis.monthlyPerformance,
    overallTrend: trendAnalysis.overallTrend || 'neutral'
  };
}

export * from './types';
export * from './signals';
export * from './patterns';
