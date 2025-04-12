
import { useEffect, useState } from 'react';
import { MarketData } from '@/types/marketData';

// Mock data functions
const mockMarketData = (): Record<string, MarketData> => {
  return {
    'bitcoin': {
      id: 'bitcoin',
      name: 'Bitcoin',
      symbol: 'BTC',
      price: 50000,
      marketCap: 950000000000,
      volume24h: 30000000000,
      change24h: 2.5,
      lastUpdated: new Date().toISOString()
    },
    'ethereum': {
      id: 'ethereum',
      name: 'Ethereum',
      symbol: 'ETH',
      price: 3000,
      marketCap: 350000000000,
      volume24h: 15000000000,
      change24h: 1.8,
      lastUpdated: new Date().toISOString()
    }
  };
};

const mockFundamentalData = () => {
  return {
    'bitcoin': {
      supply: {
        circulating: 19000000,
        total: 21000000,
        maxSupply: 21000000
      },
      marketData: {
        marketCap: 950000000000,
        fullyDilutedValuation: 1050000000000,
        totalVolume: 30000000000
      },
      score: {
        fundamentalScore: 85,
        socialScore: 90,
        developerScore: 88
      }
    },
    'ethereum': {
      // ... similar structure
    }
  };
};

export const useTrendingCoins = () => {
  const [marketData, setMarketData] = useState<Record<string, MarketData>>({});
  const [fundamentalData, setFundamentalData] = useState<Record<string, any>>({});
  const [isRealTimeActive, setIsRealTimeActive] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const fetchData = async () => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setMarketData(mockMarketData());
      setFundamentalData(mockFundamentalData());
      setIsLoading(false);
    }, 500);
  };
  
  const startRealTimeUpdates = () => {
    setIsRealTimeActive(true);
  };
  
  const stopRealTimeUpdates = () => {
    setIsRealTimeActive(false);
  };
  
  useEffect(() => {
    fetchData();
    
    return () => {
      stopRealTimeUpdates();
    };
  }, []);
  
  return {
    marketData,
    fundamentalData,
    isRealTimeActive,
    isLoading,
    startRealTimeUpdates,
    stopRealTimeUpdates
  };
};
