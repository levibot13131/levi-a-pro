
import { useState, useEffect, useCallback } from 'react';
import { Asset } from '@/types/asset';
import { MarketData } from '@/types/marketData';
import { fetchTrendingCoins, fetchMarketData } from '@/services/marketDataService';
import { toast } from 'sonner';

export const useTrendingCoins = () => {
  const [marketData, setMarketData] = useState<Record<string, MarketData>>({});
  const [fundamentalData, setFundamentalData] = useState<Record<string, any>>({});
  const [isRealTimeActive, setIsRealTimeActive] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updateInterval, setUpdateInterval] = useState<NodeJS.Timeout | null>(null);

  // Initial data loading
  const loadMarketData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const trendingCoins = await fetchTrendingCoins();
      const marketDataResult = await fetchMarketData(trendingCoins.map(c => c.id));
      
      // Using a function to update state to ensure React's state setter is properly typed
      setMarketData(prevState => ({ ...prevState, ...marketDataResult }));
      
      // Fetch additional fundamental data
      // This would be implemented in a real app
      setFundamentalData({});
    } catch (error) {
      console.error('Error loading trending coins data:', error);
      setError('שגיאה בטעינת נתונים. אנא נסה שוב מאוחר יותר.');
      toast.error('שגיאה בטעינת נתוני מטבעות');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMarketData();
  }, [loadMarketData]);

  // Start real-time updates
  const startRealTimeUpdates = useCallback(() => {
    if (isRealTimeActive) return;
    
    toast.success('עדכון נתונים בזמן אמת הופעל');
    
    // Clear any existing interval
    if (updateInterval) {
      clearInterval(updateInterval);
    }
    
    // Set up new interval
    const interval = setInterval(() => {
      loadMarketData();
    }, 10000); // Update every 10 seconds
    
    setUpdateInterval(interval);
    setIsRealTimeActive(true);
  }, [isRealTimeActive, loadMarketData, updateInterval]);
  
  // Stop real-time updates
  const stopRealTimeUpdates = useCallback(() => {
    if (!isRealTimeActive || !updateInterval) return;
    
    clearInterval(updateInterval);
    setUpdateInterval(null);
    setIsRealTimeActive(false);
    
    toast.info('עדכון נתונים בזמן אמת הופסק');
  }, [isRealTimeActive, updateInterval]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (updateInterval) {
        clearInterval(updateInterval);
      }
    };
  }, [updateInterval]);

  // Force refresh data
  const refreshData = useCallback(() => {
    toast.info('מעדכן נתונים...');
    loadMarketData();
  }, [loadMarketData]);

  return {
    marketData,
    fundamentalData,
    isRealTimeActive,
    isLoading,
    error,
    refreshData,
    stopRealTimeUpdates,
    startRealTimeUpdates
  };
};
