
import { useState, useEffect, useRef } from 'react';
import { 
  getSimplePrices, 
  getCoinsMarkets, 
  CoinPriceData 
} from '@/services/crypto/coinGeckoService';

export interface UseCoinGeckoOptions {
  refreshInterval?: number;  // in milliseconds, 0 means no auto-refresh
  coins?: string[];  // coin IDs to fetch (for simple prices)
  currencies?: string[];  // currencies to fetch prices in
  marketDataPerPage?: number;  // number of coins to fetch for market data
  marketDataPage?: number;  // which page of market data to fetch
}

export interface UseCoinGeckoReturn {
  simplePrices: Record<string, any> | null;
  marketData: CoinPriceData[] | null;
  isLoading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  refreshData: () => Promise<void>;
  isRefreshing: boolean;
}

const defaultOptions: UseCoinGeckoOptions = {
  refreshInterval: 30000,  // 30 seconds
  coins: ['bitcoin', 'ethereum', 'solana', 'cardano', 'binancecoin'],
  currencies: ['usd', 'ils'],
  marketDataPerPage: 20,
  marketDataPage: 1
};

export const useCoinGeckoData = (options: UseCoinGeckoOptions = {}): UseCoinGeckoReturn => {
  const mergedOptions = { ...defaultOptions, ...options };
  
  const [simplePrices, setSimplePrices] = useState<Record<string, any> | null>(null);
  const [marketData, setMarketData] = useState<CoinPriceData[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  
  const intervalRef = useRef<number | null>(null);

  const fetchData = async () => {
    try {
      setIsRefreshing(true);
      setError(null);
      
      // Fetch simple prices
      const pricesData = await getSimplePrices(
        mergedOptions.coins,
        mergedOptions.currencies
      );
      
      if (pricesData) {
        setSimplePrices(pricesData);
      }
      
      // Fetch market data
      const marketsData = await getCoinsMarkets(
        'usd',
        mergedOptions.marketDataPerPage,
        mergedOptions.marketDataPage
      );
      
      if (marketsData) {
        setMarketData(marketsData);
      }
      
      setLastUpdated(new Date());
    } catch (err) {
      setError('שגיאה בטעינת נתונים מ-CoinGecko');
      console.error('Error fetching CoinGecko data:', err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  // Start auto-refresh if interval is set
  useEffect(() => {
    // Fetch initial data
    fetchData();
    
    // Set up refresh interval if needed
    if (mergedOptions.refreshInterval && mergedOptions.refreshInterval > 0) {
      intervalRef.current = window.setInterval(() => {
        fetchData();
      }, mergedOptions.refreshInterval);
    }
    
    // Clean up interval on unmount
    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
      }
    };
  }, [
    mergedOptions.refreshInterval,
    mergedOptions.coins?.join(','),
    mergedOptions.currencies?.join(','),
    mergedOptions.marketDataPage,
    mergedOptions.marketDataPerPage
  ]);

  return {
    simplePrices,
    marketData,
    isLoading,
    error,
    lastUpdated,
    refreshData: fetchData,
    isRefreshing
  };
};
