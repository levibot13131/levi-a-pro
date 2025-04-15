
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { useAppSettings } from './use-app-settings';
import { 
  getFundamentalData, 
  isRealTimeMode, 
  setRealTimeMode
} from '@/services/binance/marketData';
import { 
  subscribeToMarketData, 
  closeAllConnections 
} from '@/services/binance/websocket';
import { 
  fetchFundamentalData 
} from '@/services/binance/api';
import { 
  PriceData, 
  MarketDataEntry, 
  BinanceStreamMessage 
} from '@/services/binance/types';

export { PriceData };

export const useBinanceData = (symbols: string | string[] = 'BTCUSDT') => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [priceData, setPriceData] = useState<PriceData | null>(null);
  const [fundamentalData, setFundamentalData] = useState<any | null>(null);
  const [marketData, setMarketData] = useState<Record<string, MarketDataEntry>>({});
  const [isLoading, setIsLoading] = useState(true);
  
  const { demoMode } = useAppSettings((state: any) => ({
    demoMode: state.demoMode
  }));

  // Normalize symbols to always be an array for internal use
  const symbolsArray = Array.isArray(symbols) ? symbols : [symbols];

  // Handle WebSocket/stream messages
  const handleStreamMessage = useCallback((message: BinanceStreamMessage) => {
    const { symbol, data, type } = message;
    
    if (type === 'ticker') {
      // Update marketData
      setMarketData(prevData => ({
        ...prevData,
        [symbol]: {
          symbol,
          price: data.price,
          change24h: data.change,
          high24h: data.high24h,
          low24h: data.low24h,
          volume24h: data.volume24h || 0,
          lastUpdated: Date.now()
        }
      }));
      
      // If this is the first symbol and we're maintaining priceData for backward compatibility
      if (symbol === symbolsArray[0]) {
        setPriceData({
          symbol,
          price: data.price,
          change: data.change,
          high24h: data.high24h,
          low24h: data.low24h,
          volume: data.volume24h || 0,
          lastUpdate: Date.now()
        });
      }
    }
  }, [symbolsArray]);

  // Initialize data and subscriptions
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        setIsLoading(true);
        setError(null);

        // Update real-time mode based on demoMode setting
        setRealTimeMode(!demoMode);

        // Initial market data for all symbols
        const newMarketData: Record<string, MarketDataEntry> = {};
        
        for (const symbol of symbolsArray) {
          try {
            // Fetch initial data
            const data = demoMode 
              ? await getFundamentalData(symbol) // Use mock data in demo mode
              : await fetchFundamentalData(symbol); // Use real API in production
            
            newMarketData[symbol] = {
              symbol,
              price: data.price,
              change24h: data.change24h,
              high24h: data.high24h,
              low24h: data.low24h,
              volume24h: data.volume24h,
              lastUpdated: Date.now()
            };
          } catch (err) {
            console.error(`Error fetching data for ${symbol}:`, err);
            // Add fallback/empty data in case of error
            newMarketData[symbol] = {
              symbol,
              price: 0,
              change24h: 0,
              high24h: 0,
              low24h: 0,
              volume24h: 0,
              lastUpdated: Date.now()
            };
          }
        }
        
        setMarketData(newMarketData);
        
        // For backward compatibility with single symbol
        if (symbolsArray.length === 1) {
          const singleSymbol = symbolsArray[0];
          const singleData = newMarketData[singleSymbol];
          
          setPriceData({
            symbol: singleData.symbol,
            price: singleData.price,
            change: singleData.change24h,
            high24h: singleData.high24h,
            low24h: singleData.low24h,
            volume: singleData.volume24h,
            lastUpdate: singleData.lastUpdated
          });
          
          setFundamentalData(await getFundamentalData(singleSymbol));
        }
      } catch (err) {
        console.error('Error fetching Binance data:', err);
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
        toast.error('שגיאה בטעינת נתוני מטבע', {
          description: 'לא ניתן לטעון את נתוני המטבע. בדוק את החיבור שלך.'
        });
      } finally {
        setLoading(false);
        setIsLoading(false);
      }
    };

    fetchInitialData();

    // Set up real-time data subscriptions
    const unsubscribe = subscribeToMarketData(
      symbolsArray,
      handleStreamMessage,
      (error) => {
        console.error('WebSocket error:', error);
        setError('WebSocket connection error');
      }
    );

    return () => {
      // Cleanup
      unsubscribe();
    };
  }, [symbolsArray.join(','), demoMode, handleStreamMessage]);

  // Refresh data manually
  const refreshData = useCallback(async () => {
    try {
      setLoading(true);
      
      const updatedMarketData = { ...marketData };
      
      for (const symbol of symbolsArray) {
        // Fetch fresh data
        const data = demoMode
          ? await getFundamentalData(symbol)
          : await fetchFundamentalData(symbol);
        
        // Update marketData entry
        updatedMarketData[symbol] = {
          symbol,
          price: data.price,
          change24h: data.change24h,
          high24h: data.high24h,
          low24h: data.low24h,
          volume24h: data.volume24h,
          lastUpdated: Date.now()
        };
        
        // For backward compatibility
        if (symbolsArray.length === 1) {
          setFundamentalData(data);
          
          setPriceData({
            symbol,
            price: data.price,
            change: data.change24h,
            high24h: data.high24h,
            low24h: data.low24h,
            volume: data.volume24h,
            lastUpdate: Date.now()
          });
        }
      }
      
      setMarketData(updatedMarketData);
      
      toast.success('נתונים עודכנו', {
        description: `הנתונים עבור ${symbolsArray.join(', ')} עודכנו בהצלחה`
      });
    } catch (err) {
      console.error('Error refreshing data:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      toast.error('שגיאה בריענון נתונים');
    } finally {
      setLoading(false);
    }
  }, [symbolsArray, marketData, demoMode]);

  // Start real-time updates explicitly
  const startRealTimeUpdates = useCallback(() => {
    console.log('Starting real-time updates for', symbolsArray);
    setRealTimeMode(true);
    
    // Force resubscribe to all symbols
    const cleanup = subscribeToMarketData(
      symbolsArray,
      handleStreamMessage,
      (error) => {
        console.error('WebSocket error:', error);
      }
    );
    
    toast.success('עדכוני זמן אמת הופעלו', {
      description: `מקבל עדכונים בזמן אמת עבור ${symbolsArray.length} סמלים`
    });
    
    // Returning the cleanup function (not calling it)
    return cleanup;
  }, [symbolsArray, handleStreamMessage]);

  return {
    loading,
    error,
    priceData,
    fundamentalData,
    marketData,
    isLoading,
    refreshData,
    startRealTimeUpdates
  };
};
