
import { useState, useEffect } from 'react';
import { Asset, MarketData } from '@/types/asset';
import { fetchTrendingCoins, fetchMarketData } from '@/services/marketDataService';

export const useTrendingCoins = () => {
  const [marketData, setMarketData] = useState<Record<string, MarketData>>({});
  const [fundamentalData, setFundamentalData] = useState<Record<string, any>>({});
  const [isRealTimeActive, setIsRealTimeActive] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Add isLoading state

  // Initial data loading
  useEffect(() => {
    const loadMarketData = async () => {
      setIsLoading(true);
      try {
        const trendingCoins = await fetchTrendingCoins();
        const marketDataResult = await fetchMarketData(trendingCoins.map(c => c.id));
        
        setMarketData(marketDataResult);
        
        // Fetch additional fundamental data
        // This would be implemented in a real app
        setFundamentalData({});
      } catch (error) {
        console.error('Error loading trending coins data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadMarketData();
  }, []);

  // Functions to start/stop real-time updates
  const startRealTimeUpdates = () => {
    setIsRealTimeActive(true);
    // Implementation of real-time updates
  };
  
  const stopRealTimeUpdates = () => {
    setIsRealTimeActive(false);
  };

  return {
    marketData,
    fundamentalData,
    isRealTimeActive,
    stopRealTimeUpdates,
    startRealTimeUpdates,
    isLoading // Include isLoading in return value
  };
};
