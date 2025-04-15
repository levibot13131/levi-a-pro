
import { useState, useEffect, useRef } from 'react';
import { getProxyStatus } from '../services/proxy/proxyConfig';
import { startRealTimeMarketData, listenToBinanceUpdates, getFundamentalData } from '../services/binance/marketData';

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
  sentiment?: number;
}

export interface UseBinanceDataReturn {
  marketData: Record<string, BinanceMarketData>;
  fundamentalData: Record<string, BinanceFundamentalData>;
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
  startRealTimeUpdates: () => void;
  stopRealTimeUpdates: () => void;
  lastUpdateTime: number;
  refreshData: () => void;
}

export const useBinanceData = (symbols: string[]): UseBinanceDataReturn => {
  const [marketData, setMarketData] = useState<Record<string, BinanceMarketData>>({});
  const [fundamentalData, setFundamentalData] = useState<Record<string, BinanceFundamentalData>>({});
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdateTime, setLastUpdateTime] = useState<number>(0);
  const updateServiceRef = useRef<{ stop: () => void, getData: () => any } | null>(null);

  // בדיקת הגדרות פרוקסי
  const proxyStatus = getProxyStatus();
  const isDevelopment = process.env.NODE_ENV === 'development' || 
                       !window.location.hostname.includes('lovable.app');

  // טעינה ראשונית של נתונים
  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      try {
        // בדיקה אם יש סימבולים להביא
        if (symbols.length === 0) {
          setIsLoading(false);
          return;
        }

        // Initialize data objects
        const initialMarketData: Record<string, BinanceMarketData> = {};
        const initialFundamentalData: Record<string, BinanceFundamentalData> = {};
        
        symbols.forEach(symbol => {
          // Generate initial market data
          initialMarketData[symbol] = {
            symbol,
            price: symbol.includes('BTC') ? 50000 + Math.random() * 5000 : 
                  symbol.includes('ETH') ? 3000 + Math.random() * 300 : 
                  symbol.includes('SOL') ? 100 + Math.random() * 20 : 
                  10 + Math.random() * 100,
            change24h: (Math.random() * 10) - 5,
            volume24h: Math.random() * 1000000000,
            high24h: 15000 + Math.random() * 50000,
            low24h: 9000 + Math.random() * 40000,
            lastUpdated: Date.now()
          };
          
          // טעינת נתונים פונדמנטליים עבור כל סימבול
          const fundData = getFundamentalData(symbol);
          initialFundamentalData[symbol] = {
            symbol,
            marketCap: fundData.marketCap,
            circulatingSupply: fundData.circulatingSupply,
            totalSupply: fundData.totalSupply,
            maxSupply: fundData.maxSupply,
            launchDate: fundData.launchDate?.toISOString(),
            website: 'https://example.com',
            allTimeHigh: fundData.allTimeHigh,
            allTimeHighDate: '2021-11-10',
            fundamentalScore: Math.floor(Math.random() * 100),
            socialMentions24h: Math.floor(Math.random() * 100000),
            sentiment: Math.random() // 0-1 scale
          };
        });
        
        setMarketData(initialMarketData);
        setFundamentalData(initialFundamentalData);
        setIsConnected(true);
        setLastUpdateTime(Date.now());
        
        console.log(`נטענו נתוני בינאנס מוק עבור ${symbols.length} סימבולים`, 
                    { development: isDevelopment, proxyConfigured: proxyStatus.isEnabled });
      } catch (err) {
        setError('Failed to fetch initial data');
        console.error('Error fetching Binance data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (symbols.length > 0) {
      fetchInitialData();
    } else {
      setIsLoading(false);
    }
    
    return () => {
      if (updateServiceRef.current) {
        updateServiceRef.current.stop();
        updateServiceRef.current = null;
      }
    };
  }, [symbols, isDevelopment, proxyStatus.isEnabled]);

  // האזנה לעדכוני בינאנס
  useEffect(() => {
    if (isConnected) {
      const unsubscribe = listenToBinanceUpdates((data) => {
        if (data) {
          // המרת נתוני בינאנס לפורמט של הוק
          const updatedMarketData = { ...marketData };
          
          Object.keys(data).forEach(symbol => {
            if (symbols.includes(symbol) && data[symbol]) {
              updatedMarketData[symbol] = {
                symbol,
                price: data[symbol].price,
                change24h: data[symbol].priceChangePercent || 0,
                volume24h: data[symbol].volume || 0,
                high24h: data[symbol].high24h || 0,
                low24h: data[symbol].low24h || 0,
                lastUpdated: data[symbol].lastUpdateTime || Date.now()
              };
            }
          });
          
          setMarketData(updatedMarketData);
          setLastUpdateTime(Date.now());
        }
      });
      
      return unsubscribe;
    }
  }, [isConnected, symbols, marketData]);

  const startRealTimeUpdates = () => {
    // עצירת שירות קודם אם קיים
    if (updateServiceRef.current) {
      updateServiceRef.current.stop();
    }
    
    console.log('Starting Binance real-time updates for symbols:', symbols);
    
    // הפעלת שירות עדכון נתונים בזמן אמת
    const updateService = startRealTimeMarketData(symbols);
    updateServiceRef.current = updateService;
    
    setIsConnected(true);
    
    return updateService;
  };

  const stopRealTimeUpdates = () => {
    if (updateServiceRef.current) {
      updateServiceRef.current.stop();
      updateServiceRef.current = null;
      console.log('Stopped Binance real-time updates');
    }
  };
  
  const refreshData = () => {
    if (updateServiceRef.current) {
      // אם יש שירות פעיל, נבקש את הנתונים העדכניים ממנו
      const currentData = updateServiceRef.current.getData();
      
      // המרת נתוני הבקשה לפורמט של הוק
      const updatedMarketData = { ...marketData };
      
      Object.keys(currentData).forEach(symbol => {
        if (symbols.includes(symbol) && currentData[symbol]) {
          updatedMarketData[symbol] = {
            symbol,
            price: currentData[symbol].price,
            change24h: currentData[symbol].priceChangePercent || 0,
            volume24h: currentData[symbol].volume || 0,
            high24h: currentData[symbol].high24h || 0,
            low24h: currentData[symbol].low24h || 0,
            lastUpdated: currentData[symbol].lastUpdateTime || Date.now()
          };
        }
      });
      
      setMarketData(updatedMarketData);
      setLastUpdateTime(Date.now());
      console.log('Manually refreshed Binance data at', new Date().toLocaleTimeString());
    } else {
      // אם אין שירות פעיל, נפעיל אותו
      startRealTimeUpdates();
    }
  };

  return {
    marketData,
    fundamentalData,
    isConnected,
    isLoading,
    error,
    startRealTimeUpdates,
    stopRealTimeUpdates,
    lastUpdateTime,
    refreshData
  };
};

export default useBinanceData;
