
import { BacktestSettings, BacktestResults } from './types';
import { generateMockBacktestData } from './mockDataGenerator';
import { calculatePerformanceMetrics } from './performanceCalculator';
import { calculateOptimalPosition, calculatePositionWithVolatility, calculateKellyPosition } from './positionSizer';
import { generateSignalsFromHistory } from './signalGenerator';
import { 
  detectMarketTrends, 
  detectPatterns, 
  analyzeTradeClusters,
  analyzeMarketRegimes
} from './patterns';

// Main function to run a backtest
export const runBacktest = async (
  settings: BacktestSettings
): Promise<BacktestResults> => {
  // Simulate waiting for calculation
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Generate mock data for the backtest
  const { mockTrades, mockEquity, mockPriceData } = generateMockBacktestData(settings);
  
  // Calculate performance metrics
  const results = calculatePerformanceMetrics(mockTrades, settings, mockEquity);
  
  // Enhanced analysis
  if (mockPriceData && mockPriceData.length > 0) {
    // Detect trading patterns
    const patterns = detectPatterns(mockTrades, mockPriceData);
    
    // Detect market trends
    const { trends, overallTrend } = detectMarketTrends(mockTrades);
    
    // Analyze trade clusters
    const clusterAnalysis = analyzeTradeClusters(mockTrades);
    
    // Analyze market regimes
    const regimeAnalysis = analyzeMarketRegimes(results);
    
    // Add enhanced analysis to results
    results.enhancedAnalysis = {
      patterns,
      trends,
      overallTrend,
      tradeClusters: clusterAnalysis,
      marketRegimes: regimeAnalysis
    };
  }
  
  return results;
};

// Calculate optimal position size for a new trade
export const calculateOptimalTradePosition = (
  settings: {
    capital: number;
    riskPerTrade: number;
    entryPrice: number;
    stopLossPrice: number;
    takeProfitPrice?: number;
    useVolatility?: boolean;
    atrValue?: number;
    useKelly?: boolean;
    winRate?: number;
    averageWin?: number;
    averageLoss?: number;
  }
) => {
  if (settings.useVolatility && settings.atrValue) {
    return calculatePositionWithVolatility(
      settings.capital,
      settings.riskPerTrade,
      settings.entryPrice,
      settings.atrValue
    );
  } else if (settings.useKelly && settings.winRate && settings.averageWin && settings.averageLoss) {
    const kellySize = calculateKellyPosition(
      settings.capital,
      settings.winRate,
      settings.averageWin,
      settings.averageLoss
    );
    
    return {
      accountSize: settings.capital,
      riskPercentage: (kellySize / settings.capital) * 100,
      entryPrice: settings.entryPrice,
      stopLossPrice: settings.stopLossPrice,
      takeProfitPrice: settings.takeProfitPrice,
      positionSize: kellySize / settings.entryPrice,
      maxLossAmount: kellySize,
      potentialProfit: settings.takeProfitPrice 
        ? Math.abs(settings.takeProfitPrice - settings.entryPrice) * (kellySize / settings.entryPrice)
        : 0,
      riskRewardRatio: settings.takeProfitPrice 
        ? Math.abs(settings.takeProfitPrice - settings.entryPrice) / Math.abs(settings.stopLossPrice - settings.entryPrice)
        : 0,
    };
  } else {
    return calculateOptimalPosition(
      settings.capital,
      settings.riskPerTrade,
      settings.entryPrice,
      settings.stopLossPrice,
      settings.takeProfitPrice
    );
  }
};

// Advanced backtest that runs multiple parameter combinations
export const runParameterSweep = async (
  baseSettings: BacktestSettings,
  parameterRanges: {
    parameter: keyof BacktestSettings;
    values: any[];
  }[]
): Promise<{
  results: { parameters: Record<string, any>; performance: BacktestResults }[];
  bestParameters: Record<string, any>;
  worstParameters: Record<string, any>;
}> => {
  // Generate all parameter combinations
  const paramCombinations: Record<string, any>[] = [{}];
  
  parameterRanges.forEach(range => {
    const newCombinations: Record<string, any>[] = [];
    
    paramCombinations.forEach(existingCombo => {
      range.values.forEach(value => {
        newCombinations.push({
          ...existingCombo,
          [range.parameter]: value
        });
      });
    });
    
    paramCombinations.length = 0;
    paramCombinations.push(...newCombinations);
  });
  
  // Run backtest for each parameter combination
  const results = await Promise.all(
    paramCombinations.map(async (paramSet) => {
      const settings = { ...baseSettings } as BacktestSettings;
      
      // Apply parameters from this combination
      Object.entries(paramSet).forEach(([param, value]) => {
        // Fixed the error here by using the proper type indexing
        (settings as any)[param] = value;
      });
      
      // Run backtest with these settings
      const result = await runBacktest(settings);
      
      return {
        parameters: paramSet,
        performance: result
      };
    })
  );
  
  // Find best and worst parameter sets
  results.sort((a, b) => 
    b.performance.performance.totalReturnPercentage - 
    a.performance.performance.totalReturnPercentage
  );
  
  return {
    results,
    bestParameters: results[0].parameters,
    worstParameters: results[results.length - 1].parameters
  };
};

// Export types and all functions
export * from './types';
export * from './signalGenerator';
export * from './positionSizer';
export * from './performanceCalculator';
export * from './mockDataGenerator';
export * from './patterns';
