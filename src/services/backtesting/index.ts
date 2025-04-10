
import { BacktestSettings, BacktestResults } from './types';
import { generateMockBacktestData } from './mockDataGenerator';
import { calculatePerformanceMetrics } from './performanceCalculator';
import { calculateOptimalPosition } from './positionSizer';
import { generateSignalsFromHistory } from './signalGenerator';

// Main function to run a backtest
export const runBacktest = async (
  settings: BacktestSettings
): Promise<BacktestResults> => {
  // Simulate waiting for calculation
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Generate mock data for the backtest
  const { mockTrades, mockEquity } = generateMockBacktestData(settings);
  
  // Calculate performance metrics
  return calculatePerformanceMetrics(mockTrades, settings, mockEquity);
};

// Export types and all functions
export * from './types';
export * from './signalGenerator';
export * from './positionSizer';
export * from './performanceCalculator';
export * from './mockDataGenerator';
