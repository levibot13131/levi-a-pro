
import { useState, useEffect, useCallback } from 'react';
import { getAssets } from '@/services/mockDataService';
import { Asset, MarketData } from '@/types/asset';
import { toast } from 'sonner';

export const useTrendingCoins = () => {
  const [trendingCoins, setTrendingCoins] = useState<Asset[]>([]);
  const [allAssets, setAllAssets] = useState<Asset[]>([]);
  const [isRealTimeActive, setIsRealTimeActive] = useState(false);
  const [updateInterval, setUpdateInterval] = useState<NodeJS.Timeout | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Market and fundamental data
  const [marketData, setMarketData] = useState<Record<string, MarketData>>({});
  const [fundamentalData, setFundamentalData] = useState<Record<string, any>>({});
  
  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const assets = await getAssets();
        
        // Sort by percent change for trending
        const sorted = [...assets].sort((a, b) => {
          return Math.abs(b.change24h) - Math.abs(a.change24h);
        });
        
        setAllAssets(assets);
        setTrendingCoins(sorted.slice(0, 10)); // Top 10 trending
        
        // Initialize empty market data
        const initialMarketData: Record<string, MarketData> = {};
        assets.forEach(asset => {
          initialMarketData[asset.id] = {
            priceUsd: asset.price,
            volume24h: asset.volume24h,
            priceChange24h: 0,
            priceChangePercentage24h: asset.change24h,
            marketCap: asset.marketCap
          };
        });
        setMarketData(initialMarketData);
        
        // Initialize empty fundamental data
        const initialFundamentalData: Record<string, any> = {};
        assets.forEach(asset => {
          initialFundamentalData[asset.id] = {
            description: asset.details?.description || '',
            website: asset.details?.website || '',
            github: asset.details?.github || '',
            launchDate: asset.details?.launchDate || ''
          };
        });
        setFundamentalData(initialFundamentalData);
      } catch (error) {
        console.error('Error fetching trending coins:', error);
        toast.error('שגיאה בטעינת המטבעות המובילים');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Function to start real-time updates
  const startRealTimeUpdates = useCallback(() => {
    if (updateInterval) {
      clearInterval(updateInterval);
    }
    
    const interval = setInterval(() => {
      if (allAssets.length === 0) return;
      
      // Simulate data updates
      const updatedAssets = allAssets.map(asset => {
        const changePercent = asset.change24h + (Math.random() * 2 - 1);
        const newPrice = asset.price * (1 + changePercent / 100);
        
        return {
          ...asset,
          price: newPrice,
          change24h: changePercent
        };
      });
      
      // Re-sort for trending
      const newTrending = [...updatedAssets].sort((a, b) => {
        return Math.abs(b.change24h) - Math.abs(a.change24h);
      });
      
      setAllAssets(updatedAssets);
      setTrendingCoins(newTrending.slice(0, 10));
      
      // Update market data
      const newMarketData = { ...marketData };
      for (const assetId in newMarketData) {
        newMarketData[assetId] = {
          ...newMarketData[assetId],
          priceChange24h: newMarketData[assetId].priceChange24h + (Math.random() * 0.4 - 0.2),
          priceChangePercentage24h: newMarketData[assetId].priceChangePercentage24h + (Math.random() * 2 - 1)
        };
      }
      setMarketData(newMarketData);
      
    }, 30000); // Update every 30 seconds
    
    setUpdateInterval(interval);
    setIsRealTimeActive(true);
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [allAssets, marketData]);
  
  // Function to stop real-time updates
  const stopRealTimeUpdates = useCallback(() => {
    if (updateInterval) {
      clearInterval(updateInterval);
      setUpdateInterval(null);
    }
    setIsRealTimeActive(false);
  }, [updateInterval]);
  
  return {
    trendingCoins,
    allAssets,
    marketData,
    fundamentalData,
    isRealTimeActive,
    isLoading,
    startRealTimeUpdates,
    stopRealTimeUpdates
  };
};
