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

export type { PriceData };

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

  const symbolsArray = Array.isArray(symbols) ? symbols : [symbols];

  const handleStreamMessage = useCallback((message: BinanceStreamMessage) => {
    const { symbol, data, type } = message;
    
    if (type === 'ticker') {
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

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        setIsLoading(true);
        setError(null);

        setRealTimeMode(!demoMode);

        const newMarketData: Record<string, MarketDataEntry> = {};
        
        for (const symbol of symbolsArray) {
          try {
            if (demoMode) {
              const data = await getFundamentalData(symbol);
              newMarketData[symbol] = {
                symbol,
                price: data.price,
                change24h: data.change24h,
                high24h: data.high24h,
                low24h: data.low24h,
                volume24h: data.volume24h,
                lastUpdated: Date.now()
              };
            } else {
              const data = await fetchFundamentalData(symbol);
              newMarketData[symbol] = {
                symbol,
                price: data.price,
                change24h: data.change24h,
                high24h: data.high24h,
                low24h: data.low24h,
                volume24h: data.volume24h,
                lastUpdated: Date.now()
              };
            }
          } catch (err) {
            console.error(`Error fetching data for ${symbol}:`, err);
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

    const unsubscribe = subscribeToMarketData(
      symbolsArray,
      handleStreamMessage,
      (error) => {
        console.error('WebSocket error:', error);
        setError('WebSocket connection error');
      }
    );

    return () => {
      unsubscribe();
    };
  }, [symbolsArray.join(','), demoMode, handleStreamMessage]);

  const refreshData = useCallback(async () => {
    try {
      setLoading(true);
      
      const updatedMarketData = { ...marketData };
      
      for (const symbol of symbolsArray) {
        const data = demoMode
          ? await getFundamentalData(symbol)
          : await fetchFundamentalData(symbol);
        
        updatedMarketData[symbol] = {
          symbol,
          price: data.price,
          change24h: data.change24h,
          high24h: data.high24h,
          low24h: data.low24h,
          volume24h: data.volume24h,
          lastUpdated: Date.now()
        };
        
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

  const startRealTimeUpdates = useCallback(() => {
    console.log('Starting real-time updates for', symbolsArray);
    setRealTimeMode(true);
    
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
