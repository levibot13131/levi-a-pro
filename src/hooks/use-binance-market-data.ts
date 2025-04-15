
import { useCallback, useState } from 'react';
import { useBinanceData } from './use-binance-data';
import { MarketDataEntry } from '@/services/binance/types';
import { getKlines } from '@/services/binance/api';
import { toast } from 'sonner';

export interface ChartDataPoint {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export const useBinanceMarketData = (symbol: string = 'BTCUSDT') => {
  const { marketData, loading, error, refreshData, startRealTimeUpdates } = useBinanceData(symbol);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [chartLoading, setChartLoading] = useState(false);
  const [chartError, setChartError] = useState<string | null>(null);
  const [timeframe, setTimeframe] = useState<string>('1h');
  
  // Get current market data for the symbol
  const currentData: MarketDataEntry | undefined = marketData[symbol];
  
  // Load chart data
  const loadChartData = useCallback(async (interval: string = timeframe) => {
    try {
      setChartLoading(true);
      setChartError(null);
      
      const data = await getKlines(symbol, interval, 100);
      setChartData(data);
      setTimeframe(interval);
    } catch (err) {
      console.error('Error loading chart data:', err);
      setChartError('Failed to load chart data');
      toast.error('שגיאה בטעינת נתוני גרף');
    } finally {
      setChartLoading(false);
    }
  }, [symbol, timeframe]);
  
  // Change timeframe
  const changeTimeframe = useCallback((newTimeframe: string) => {
    if (newTimeframe !== timeframe) {
      loadChartData(newTimeframe);
    }
  }, [timeframe, loadChartData]);
  
  return {
    // Market data
    marketData: currentData,
    loading,
    error,
    refreshData,
    startRealTimeUpdates,
    
    // Chart data
    chartData,
    chartLoading,
    chartError,
    loadChartData,
    timeframe,
    changeTimeframe
  };
};
