
import { useState, useEffect } from 'react';

// Mock Binance market data
interface BinanceMarketData {
  price: number;
  change24h: number;
  volume: number;
  high24h: number;
  low24h: number;
  lastUpdated: number;
}

// Types for hook return values
interface UseBinanceDataReturn {
  marketData: Record<string, BinanceMarketData>;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

export const useBinanceData = (symbols: string[]): UseBinanceDataReturn => {
  const [marketData, setMarketData] = useState<Record<string, BinanceMarketData>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [refreshCounter, setRefreshCounter] = useState(0);

  const refetch = () => {
    setRefreshCounter(prev => prev + 1);
  };

  useEffect(() => {
    let isMounted = true;
    let intervalId: number | null = null;

    const fetchData = async () => {
      if (symbols.length === 0) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        // Simulate fetching data from Binance API
        const mockData: Record<string, BinanceMarketData> = {};
        
        for (const symbol of symbols) {
          const basePrice = symbol.includes('BTC') ? 45000 : 
                          symbol.includes('ETH') ? 3000 : 
                          symbol.includes('SOL') ? 120 : 
                          symbol.includes('BNB') ? 400 : 50;
          
          // Add some random variation
          const randomFactor = 0.98 + Math.random() * 0.04; // +/- 2%
          const price = basePrice * randomFactor;
          
          mockData[symbol] = {
            price,
            change24h: (Math.random() * 10) - 5, // -5% to +5%
            volume: Math.random() * 100000000,
            high24h: price * 1.02,
            low24h: price * 0.98,
            lastUpdated: Date.now()
          };
        }

        if (isMounted) {
          setMarketData(mockData);
          setIsLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error('Failed to fetch data'));
          setIsLoading(false);
        }
      }
    };

    fetchData();

    // Refresh every 10 seconds for real-time simulation
    if (symbols.length > 0) {
      intervalId = window.setInterval(fetchData, 10000);
    }

    return () => {
      isMounted = false;
      if (intervalId !== null) clearInterval(intervalId);
    };
  }, [symbols, refreshCounter]);

  return { marketData, isLoading, error, refetch };
};
