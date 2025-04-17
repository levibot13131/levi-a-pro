
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useTradingViewIntegration } from './use-tradingview-integration';
import { TradingViewChartData, TradingViewDataPoint } from '../services/tradingView/types';

/**
 * Calculates percentage change between first and last data points
 * @param data - Array of price data points
 * @returns Formatted percentage change string or null if not enough data
 */
const calculatePercentChange = (data: TradingViewDataPoint[]): string | null => {
  if (!data || data.length < 2) return null;
  
  const firstPrice = data[0].price;
  const lastPrice = data[data.length - 1].price;
  const change = ((lastPrice - firstPrice) / firstPrice) * 100;
  
  return change.toFixed(2);
};

/**
 * Hook for fetching and managing chart data from TradingView
 * @param symbol - Trading symbol (e.g., 'BTCUSD')
 * @param timeframe - Chart timeframe (e.g., '1D', '4h')
 * @returns Object containing chart data, loading state, error state, and utility functions
 */
export function useChartData(symbol: string, timeframe: string = '1D') {
  const [chartData, setChartData] = useState<TradingViewChartData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const { fetchChartData, isConnected } = useTradingViewIntegration();
  
  /**
   * Loads chart data for the specified symbol and timeframe
   * Handles authentication, loading states, and error conditions
   */
  const loadChartData = useCallback(async () => {
    if (!isConnected) {
      setError('אנא התחבר ל-TradingView תחילה');
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    try {
      const data = await fetchChartData(symbol, timeframe);
      
      if (data) {
        setChartData(data);
        setError(null);
      } else {
        setError('לא ניתן לטעון את נתוני הגרף');
      }
    } catch (err) {
      console.error('Error loading TradingView chart data:', err);
      setError('שגיאה בטעינת הגרף');
    } finally {
      setIsLoading(false);
    }
  }, [symbol, timeframe, fetchChartData, isConnected]);
  
  // Initial data load
  useEffect(() => {
    loadChartData();
  }, [loadChartData]);
  
  // Set up automatic refresh every 10 seconds
  useEffect(() => {
    if (!isConnected) return;
    
    const interval = setInterval(loadChartData, 10000);
    return () => clearInterval(interval);
  }, [isConnected, loadChartData]);
  
  // Memoized data processing
  const chartProcessedData = useMemo(() => {
    if (!chartData?.data) return null;
    
    return {
      percentChange: calculatePercentChange(chartData.data),
      isPositiveChange: calculatePercentChange(chartData.data) 
        ? parseFloat(calculatePercentChange(chartData.data)!) >= 0 
        : false
    };
  }, [chartData]);
  
  return {
    chartData,
    isLoading,
    error,
    loadChartData,
    ...chartProcessedData
  };
}
