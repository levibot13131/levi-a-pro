
import { useState, useEffect } from 'react';

export interface BinanceMarketData {
  symbol: string;
  price: number;
  change24h: number;
  volume24h: number;
  high24h: number;
  low24h: number;
  lastUpdated: number;
}

export interface BinanceFundamentalData {
  symbol: string;
  marketCap: number;
  circulatingSupply: number;
  totalSupply: number;
  maxSupply?: number;
  launchDate?: string;
  website?: string;
  allTimeHigh?: number;
  allTimeHighDate?: string;
  fundamentalScore?: number;
  socialMentions24h?: number;
  sentiment?: number; // Added missing properties
}

export interface UseBinanceDataReturn {
  marketData: Record<string, BinanceMarketData>;
  fundamentalData: Record<string, BinanceFundamentalData>; // Added missing property
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
  startRealTimeUpdates: () => void;
  stopRealTimeUpdates: () => void;
}

export const useBinanceData = (symbols: string[]): UseBinanceDataReturn => {
  const [marketData, setMarketData] = useState<Record<string, BinanceMarketData>>({});
  const [fundamentalData, setFundamentalData] = useState<Record<string, BinanceFundamentalData>>({});
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updateInstance, setUpdateInstance] = useState<{ stop: () => void } | null>(null);

  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      try {
        // Mock initial data loading
        const mockMarketData: Record<string, BinanceMarketData> = {};
        const mockFundamentalData: Record<string, BinanceFundamentalData> = {};
        
        symbols.forEach(symbol => {
          // Generate mock market data
          mockMarketData[symbol] = {
            symbol,
            price: 10000 + Math.random() * 50000,
            change24h: (Math.random() * 10) - 5,
            volume24h: Math.random() * 1000000000,
            high24h: 15000 + Math.random() * 50000,
            low24h: 9000 + Math.random() * 40000,
            lastUpdated: Date.now()
          };
          
          // Generate mock fundamental data
          mockFundamentalData[symbol] = {
            symbol,
            marketCap: Math.random() * 1000000000000,
            circulatingSupply: Math.random() * 100000000,
            totalSupply: Math.random() * 200000000,
            maxSupply: symbol.includes('BTC') ? 21000000 : undefined,
            launchDate: '2010-01-01',
            website: 'https://example.com',
            allTimeHigh: 69000,
            allTimeHighDate: '2021-11-10',
            fundamentalScore: Math.floor(Math.random() * 100),
            socialMentions24h: Math.floor(Math.random() * 100000),
            sentiment: Math.random() // 0-1 scale
          };
        });
        
        setMarketData(mockMarketData);
        setFundamentalData(mockFundamentalData);
        setIsConnected(true);
      } catch (err) {
        setError('Failed to fetch initial data');
        console.error('Error fetching Binance data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (symbols.length > 0) {
      fetchInitialData();
    }
    
    return () => {
      if (updateInstance) {
        updateInstance.stop();
      }
    };
  }, [symbols]);

  const startRealTimeUpdates = () => {
    if (updateInstance) {
      return;
    }
    
    // Mock real-time updates
    const intervalId = setInterval(() => {
      setMarketData(prevData => {
        const newData = { ...prevData };
        
        Object.keys(newData).forEach(symbol => {
          const change = (Math.random() * 2) - 1; // -1% to +1%
          const currentPrice = newData[symbol].price;
          const newPrice = currentPrice * (1 + change / 100);
          
          newData[symbol] = {
            ...newData[symbol],
            price: newPrice,
            change24h: newData[symbol].change24h + (Math.random() * 0.2) - 0.1,
            lastUpdated: Date.now()
          };
        });
        
        return newData;
      });
    }, 5000);
    
    const stopFn = {
      stop: () => clearInterval(intervalId)
    };
    
    setUpdateInstance(stopFn);
  };

  const stopRealTimeUpdates = () => {
    if (updateInstance) {
      updateInstance.stop();
      setUpdateInstance(null);
    }
  };

  return {
    marketData,
    fundamentalData,
    isConnected,
    isLoading,
    error,
    startRealTimeUpdates,
    stopRealTimeUpdates
  };
};

export default useBinanceData;
