
import { useState, useEffect, useCallback } from 'react';
import { useTradingViewIntegration } from './use-tradingview-integration';
import { TradingViewChartData } from '../services/tradingView/types';

/**
 * Hook for fetching and managing chart data from TradingView
 * @param symbol - The trading symbol to get chart data for
 * @param timeframe - The chart timeframe (e.g., '1h', '4h', '1D')
 * @returns Object containing chart data, loading state, error state, and helper functions
 */
export function useChartData(symbol: string, timeframe: string) {
  const [chartData, setChartData] = useState<TradingViewChartData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const { fetchChartData, isConnected } = useTradingViewIntegration();
  
  /**
   * Loads chart data for the specified symbol and timeframe
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
        // Ensure data conforms to expected format
        const formattedData: TradingViewChartData = {
          symbol: data.symbol,
          timeframe: data.timeframe,
          data: data.data,
          indicators: data.indicators || [],
          lastUpdate: data.lastUpdate || data.lastUpdated || Date.now()
        };
        
        setChartData(formattedData);
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
    
    const interval = setInterval(() => {
      loadChartData();
    }, 10000); // Refresh every 10 seconds
    
    return () => clearInterval(interval);
  }, [isConnected, loadChartData]);

  /**
   * Calculates the percentage change between first and last price points
   * @returns Formatted percentage change or null if insufficient data
   */
  const getPercentChange = useCallback(() => {
    if (!chartData || !chartData.data || chartData.data.length < 2) return null;
    
    const firstPrice = chartData.data[0].price;
    const lastPrice = chartData.data[chartData.data.length - 1].price;
    const change = ((lastPrice - firstPrice) / firstPrice) * 100;
    
    return change.toFixed(2);
  }, [chartData]);

  const percentChange = getPercentChange();
  const isPositiveChange = percentChange && parseFloat(percentChange) >= 0;
  
  return {
    chartData,
    isLoading,
    error,
    loadChartData,
    percentChange,
    isPositiveChange
  };
}
