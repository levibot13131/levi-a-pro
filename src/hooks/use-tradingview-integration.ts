
import { useState, useEffect } from 'react';
import { useTradingViewConnection } from './use-tradingview-connection';
import { 
  initializeTradingViewSync, 
  stopTradingViewSync, 
  isSyncActive,
  syncWithTradingView,
  getChartData,
  getTradingViewNews,
  TradingViewChartData,
  TradingViewNewsItem
} from '@/services/tradingView/tradingViewIntegrationService';

export function useTradingViewIntegration() {
  const { isConnected } = useTradingViewConnection();
  const [syncEnabled, setSyncEnabled] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);
  
  // Initialize or stop sync based on connection status
  useEffect(() => {
    if (isConnected && !isSyncActive()) {
      const initialized = initializeTradingViewSync();
      setSyncEnabled(initialized);
      if (initialized) {
        setLastSyncTime(new Date());
      }
    } else if (!isConnected && isSyncActive()) {
      stopTradingViewSync();
      setSyncEnabled(false);
    }
    
    return () => {
      // Clean up on unmount
      stopTradingViewSync();
    };
  }, [isConnected]);
  
  // Manual sync function
  const manualSync = async () => {
    if (!isConnected) return false;
    
    setIsSyncing(true);
    try {
      const success = await syncWithTradingView();
      if (success) {
        setLastSyncTime(new Date());
      }
      return success;
    } finally {
      setIsSyncing(false);
    }
  };
  
  // Toggle auto-sync
  const toggleAutoSync = () => {
    if (syncEnabled) {
      stopTradingViewSync();
      setSyncEnabled(false);
    } else if (isConnected) {
      const initialized = initializeTradingViewSync();
      setSyncEnabled(initialized);
      if (initialized) {
        setLastSyncTime(new Date());
      }
    }
  };
  
  // Fetch chart data
  const fetchChartData = async (symbol: string, timeframe: string = '1D') => {
    return getChartData(symbol, timeframe);
  };
  
  // Fetch news
  const fetchNews = async (limit: number = 10) => {
    return getTradingViewNews(limit);
  };
  
  return {
    isConnected,
    syncEnabled,
    isSyncing,
    lastSyncTime,
    manualSync,
    toggleAutoSync,
    fetchChartData,
    fetchNews
  };
}
