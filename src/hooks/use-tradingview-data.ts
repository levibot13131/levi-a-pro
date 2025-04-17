
import { useCallback } from 'react';
import { 
  getChartData, 
  getTradingViewNews,
  TradingViewChartData, 
  TradingViewNewsItem 
} from '../services/tradingView';

/**
 * Hook for fetching data from TradingView
 * @returns Object containing data fetching methods
 */
export function useTradingViewData() {
  /**
   * Fetch chart data for a specific symbol and timeframe
   * @param symbol - Trading symbol (e.g., 'BTCUSD')
   * @param timeframe - Chart timeframe (e.g., '1D', '4h')
   * @returns Promise resolving to chart data or null
   */
  const fetchChartData = useCallback(async (
    symbol: string, 
    timeframe: string = '1D'
  ): Promise<TradingViewChartData | null> => {
    try {
      return await getChartData(symbol, timeframe);
    } catch (error) {
      console.error("Error fetching chart data:", error);
      return null;
    }
  }, []);
  
  /**
   * Fetch news from TradingView
   * @param limit - Maximum number of news items to return
   * @returns Promise resolving to array of news items
   */
  const fetchNews = useCallback(async (
    limit: number = 10
  ): Promise<TradingViewNewsItem[]> => {
    try {
      return await getTradingViewNews(limit);
    } catch (error) {
      console.error("Error fetching news:", error);
      return [];
    }
  }, []);

  return {
    fetchChartData,
    fetchNews
  };
}
