
import { useCallback, useState, useEffect } from 'react';
import { useBinanceData } from './use-binance-data';
import { MarketDataEntry } from '@/services/binance/types';
import { getKlines } from '@/services/binance/api';
import { toast } from 'sonner';
import { getProxyConfig } from '@/services/proxy/proxyConfig';

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
  const [isLiveData, setIsLiveData] = useState<boolean>(false);
  
  // Get current market data for the symbol
  const currentData: MarketDataEntry | undefined = marketData[symbol];
  
  // Check if we're using the proxy and are getting live data
  useEffect(() => {
    const proxyConfig = getProxyConfig();
    setIsLiveData(proxyConfig.isEnabled && !!proxyConfig.baseUrl);
    
    // Listen for changes to the proxy configuration
    const handleProxyChange = () => {
      const updatedConfig = getProxyConfig();
      setIsLiveData(updatedConfig.isEnabled && !!updatedConfig.baseUrl);
      
      // Reload chart data when proxy config changes
      loadChartData();
    };
    
    window.addEventListener('proxy-config-changed', handleProxyChange);
    return () => {
      window.removeEventListener('proxy-config-changed', handleProxyChange);
    };
  }, []);
  
  // Load chart data with error handling and retries
  const loadChartData = useCallback(async (interval: string = timeframe, retryCount = 0) => {
    try {
      setChartLoading(true);
      setChartError(null);
      
      console.log(`Loading Binance klines for ${symbol} with interval ${interval}`);
      const data = await getKlines(symbol, interval, 100);
      
      if (data && data.length > 0) {
        setChartData(data);
        setTimeframe(interval);
        setIsLiveData(true);
        console.log(`Successfully loaded ${data.length} klines for ${symbol}`);
      } else if (retryCount < 2) {
        console.warn(`No data received for ${symbol}, retrying (${retryCount + 1}/3)...`);
        setTimeout(() => loadChartData(interval, retryCount + 1), 2000);
      } else {
        setChartError('No data available for the selected timeframe');
        toast.error('שגיאה בטעינת נתוני גרף', {
          description: 'לא ניתן לטעון נתונים עבור הסימול או טווח הזמן שנבחר'
        });
      }
    } catch (err) {
      console.error('Error loading chart data:', err);
      setChartError('Failed to load chart data');
      
      if (retryCount < 2) {
        console.warn(`Error loading data for ${symbol}, retrying (${retryCount + 1}/3)...`);
        setTimeout(() => loadChartData(interval, retryCount + 1), 2000);
      } else {
        toast.error('שגיאה בטעינת נתוני גרף', {
          description: 'בדוק את הגדרות הפרוקסי וחיבור לאינטרנט'
        });
      }
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
  
  // Listen for refresh requests
  useEffect(() => {
    const handleRefreshRequest = () => {
      console.log('Manual refresh requested for chart data');
      loadChartData();
    };
    
    window.addEventListener('binance-refresh-request', handleRefreshRequest);
    return () => {
      window.removeEventListener('binance-refresh-request', handleRefreshRequest);
    };
  }, [loadChartData]);
  
  // Start real-time updates and load initial data
  useEffect(() => {
    startRealTimeUpdates();
    loadChartData();
    
    // Refresh chart data periodically
    const intervalId = setInterval(() => {
      loadChartData();
    }, 60000); // Refresh every minute
    
    return () => clearInterval(intervalId);
  }, [symbol, loadChartData, startRealTimeUpdates]);
  
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
    changeTimeframe,
    isLiveData
  };
};
