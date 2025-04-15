
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useAppSettings } from './use-app-settings';
import { startRealTimeMarketData, listenToBinanceUpdates, getFundamentalData, CurrencyData } from '../services/binance/marketData';

export type PriceData = {
  symbol: string;
  price: number;
  change: number;
  high24h: number;
  low24h: number;
  volume: number;
  lastUpdate: number;
};

interface MarketDataEntry {
  symbol: string;
  price: number;
  change24h: number;
  high24h: number;
  low24h: number;
  volume24h: number;
  lastUpdated: number;
}

export const useBinanceData = (symbols: string | string[] = 'BTCUSDT') => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [priceData, setPriceData] = useState<PriceData | null>(null);
  const [fundamentalData, setFundamentalData] = useState<CurrencyData | null>(null);
  const [marketData, setMarketData] = useState<Record<string, MarketDataEntry>>({});
  const [isLoading, setIsLoading] = useState(true);
  const { demoMode } = useAppSettings();

  // Normalize symbols to always be an array for internal use
  const symbolsArray = Array.isArray(symbols) ? symbols : [symbols];

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        setIsLoading(true);
        setError(null);

        // In demo mode, generate mock data
        if (demoMode) {
          const newMarketData: Record<string, MarketDataEntry> = {};
          
          for (const symbol of symbolsArray) {
            const mockPrice = symbol.includes('BTC') ? 42000 + (Math.random() * 2000) : 
                             symbol.includes('ETH') ? 2000 + (Math.random() * 500) :
                             500 + (Math.random() * 100);
            
            newMarketData[symbol] = {
              symbol,
              price: mockPrice,
              change24h: (Math.random() * 10) - 5, // -5% to +5%
              high24h: mockPrice * 1.05,
              low24h: mockPrice * 0.95,
              volume24h: Math.random() * 1000000000,
              lastUpdated: Date.now()
            };
          }
          
          setMarketData(newMarketData);
          
          // For backward compatibility
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
            
            const fundData = await getFundamentalData(singleSymbol);
            setFundamentalData(fundData);
          }
        } else {
          // Start real binance data connection
          for (const symbol of symbolsArray) {
            const success = startRealTimeMarketData(symbol);
            
            if (!success) {
              throw new Error('Failed to connect to Binance API');
            }
          }
          
          // For backward compatibility with single symbol case
          if (symbolsArray.length === 1) {
            const fundData = await getFundamentalData(symbolsArray[0]);
            setFundamentalData(fundData);
          }
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

    // Set up real-time updates
    const unsubscribe = listenToBinanceUpdates((data) => {
      // Update both priceData and marketData
      setPriceData(prevData => ({
        ...prevData,
        ...data,
        lastUpdate: Date.now()
      }));
      
      setMarketData(prevData => {
        // If symbol exists in the update, update it
        if (data.symbol) {
          const symbol = data.symbol;
          return {
            ...prevData,
            [symbol]: {
              ...prevData[symbol],
              ...data,
              lastUpdated: Date.now()
            }
          };
        }
        return prevData;
      });
    });

    return () => {
      // Cleanup
      unsubscribe();
    };
  }, [symbolsArray.join(','), demoMode]);

  const refreshData = async () => {
    try {
      setLoading(true);
      
      const updatedMarketData = { ...marketData };
      
      for (const symbol of symbolsArray) {
        // Fetch fundamental data
        const fundData = await getFundamentalData(symbol);
        
        // Update marketData entry
        if (updatedMarketData[symbol]) {
          updatedMarketData[symbol] = {
            ...updatedMarketData[symbol],
            price: fundData.price,
            change24h: fundData.change24h,
            volume24h: fundData.volume24h,
            lastUpdated: Date.now()
          };
        }
        
        // For backward compatibility
        if (symbolsArray.length === 1) {
          setFundamentalData(fundData);
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
  };

  const startRealTimeUpdates = () => {
    console.log('Starting real-time updates for', symbolsArray);
    for (const symbol of symbolsArray) {
      startRealTimeMarketData(symbol);
    }
  };

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
