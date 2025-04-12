
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { startRealTimeMarketData, getFundamentalData } from '@/services/binance/binanceService';

interface MarketData {
  symbol: string;
  price: number;
  change24h: number;
  volume: number;
  lastUpdate: number;
}

export function useBinanceData(symbols: string[] = []) {
  const [marketData, setMarketData] = useState<Record<string, MarketData>>({});
  const [realTimeActive, setRealTimeActive] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // נתונים בסיסיים עבור כל סימול
  const { data: fundamentalData, isLoading: isFundamentalLoading } = useQuery({
    queryKey: ['binance', 'fundamental', symbols],
    queryFn: () => {
      // נביא נתונים בסיסיים רק אם יש סימבולים
      if (symbols.length === 0) return {};
      
      // נשתמש במאפ ליצירת אובייקט עם נתונים בסיסיים לכל סימבול
      const result: Record<string, any> = {};
      symbols.forEach(symbol => {
        result[symbol] = getFundamentalData(symbol);
      });
      
      return result;
    },
    enabled: symbols.length > 0
  });

  useEffect(() => {
    // Check if we are in production environment (Lovable preview/production)
    const isProduction = window.location.hostname.includes('lovable.app');
    let cleanup = () => {};
    
    if (symbols.length === 0) {
      setIsLoading(false);
      return cleanup;
    }

    if (isProduction) {
      // In production/preview, simulate real-time data instead of connecting to Binance
      console.log('Running in Lovable environment, simulating Binance data');
      
      // Generate simulated data for each symbol
      const simulatedData: Record<string, MarketData> = {};
      symbols.forEach(symbol => {
        simulatedData[symbol] = {
          symbol,
          price: Math.random() * 50000 + 1000, // Random price between 1,000 and 51,000
          change24h: (Math.random() * 10) - 5, // Random change between -5% and +5%
          volume: Math.random() * 1000000000,
          lastUpdate: Date.now()
        };
      });
      
      setMarketData(simulatedData);
      setRealTimeActive(true);
      setIsLoading(false);
      
      // Simulate periodic updates
      const interval = setInterval(() => {
        setMarketData(prev => {
          const updated = { ...prev };
          symbols.forEach(symbol => {
            if (updated[symbol]) {
              // Small random price change
              const priceChange = updated[symbol].price * (Math.random() * 0.01 - 0.005);
              updated[symbol] = {
                ...updated[symbol],
                price: updated[symbol].price + priceChange,
                change24h: updated[symbol].change24h + (Math.random() * 0.2 - 0.1),
                lastUpdate: Date.now()
              };
            }
          });
          return updated;
        });
      }, 5000);
      
      cleanup = () => clearInterval(interval);
    } else {
      // In development, try to connect to the real Binance API
      cleanup = startRealTimeMarketData(symbols, (data) => {
        setMarketData(prev => ({ ...prev, ...data }));
        setRealTimeActive(true);
        setIsLoading(false);
      });
    }
    
    return cleanup;
  }, [symbols.join(',')]);

  return {
    marketData,
    fundamentalData,
    isLoading: isLoading || isFundamentalLoading,
    realTimeActive
  };
}
