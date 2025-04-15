
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

export const useBinanceData = (symbol: string = 'BTCUSDT') => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [priceData, setPriceData] = useState<PriceData | null>(null);
  const [fundamentalData, setFundamentalData] = useState<CurrencyData | null>(null);
  const { demoMode } = useAppSettings();

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        setError(null);

        // In demo mode, generate mock data
        if (demoMode) {
          const mockPrice = symbol.includes('BTC') ? 42000 + (Math.random() * 2000) : 2000 + (Math.random() * 500);
          
          setPriceData({
            symbol,
            price: mockPrice,
            change: (Math.random() * 10) - 5, // -5% to +5%
            high24h: mockPrice * 1.05,
            low24h: mockPrice * 0.95,
            volume: Math.random() * 1000000000,
            lastUpdate: Date.now()
          });
          
          const fundData = await getFundamentalData(symbol);
          setFundamentalData(fundData);
        } else {
          // Start real binance data connection
          const success = startRealTimeMarketData(symbol);
          
          if (!success) {
            throw new Error('Failed to connect to Binance API');
          }
          
          // Get fundamental data
          const fundData = await getFundamentalData(symbol);
          setFundamentalData(fundData);
        }
      } catch (err) {
        console.error('Error fetching Binance data:', err);
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
        toast.error('שגיאה בטעינת נתוני מטבע', {
          description: 'לא ניתן לטעון את נתוני המטבע. בדוק את החיבור שלך.'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();

    // Set up real-time updates
    const unsubscribe = listenToBinanceUpdates((data) => {
      setPriceData(prevData => ({
        ...prevData,
        ...data,
        lastUpdate: Date.now()
      }));
    });

    return () => {
      // Cleanup
      unsubscribe();
    };
  }, [symbol, demoMode]);

  const refreshData = async () => {
    try {
      setLoading(true);
      
      // Fetch fundamental data
      const fundData = await getFundamentalData(symbol);
      
      // Extract and set individual properties safely
      setFundamentalData({
        symbol: fundData.symbol,
        name: fundData.name,
        price: fundData.price,
        change24h: fundData.change24h,
        volume24h: fundData.volume24h,
        marketCap: fundData.marketCap,
        circulatingSupply: fundData.circulatingSupply,
        totalSupply: fundData.totalSupply,
        maxSupply: fundData.maxSupply,
        launchDate: fundData.launchDate,
        allTimeHigh: fundData.allTimeHigh
      });
      
      toast.success('נתונים עודכנו', {
        description: `הנתונים עבור ${symbol} עודכנו בהצלחה`
      });
    } catch (err) {
      console.error('Error refreshing data:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      toast.error('שגיאה בריענון נתונים');
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    priceData,
    fundamentalData,
    refreshData
  };
};
