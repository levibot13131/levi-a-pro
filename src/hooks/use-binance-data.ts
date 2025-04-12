
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
  const [isLoading, setIsLoading] = useState(true); // Add isLoading state

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
    enabled: symbols.length > 0,
    staleTime: 1000 * 60 * 60, // פעם בשעה
  });

  // התחברות לנתונים בזמן אמת
  useEffect(() => {
    if (symbols.length === 0) {
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    
    // אתחול נתוני מחיר ראשוניים
    const initialData: Record<string, MarketData> = {};
    symbols.forEach(symbol => {
      initialData[symbol] = {
        symbol,
        price: Math.random() * 1000 + 100, // מחיר התחלתי אקראי
        change24h: (Math.random() * 10) - 5, // שינוי יומי אקראי
        volume: Math.random() * 1000000,
        lastUpdate: Date.now()
      };
    });
    setMarketData(initialData);
    
    // התחלת עדכוני מחיר בזמן אמת
    const realTimeService = startRealTimeMarketData(symbols);
    setRealTimeActive(true);
    
    // אינטרבל לסימולציה של נתונים בזמן אמת
    const interval = setInterval(() => {
      setMarketData(prev => {
        const updated = { ...prev };
        symbols.forEach(symbol => {
          if (updated[symbol]) {
            // עדכון מחיר בצורה אקראית (לדמות תנודות מחיר)
            const priceChange = updated[symbol].price * (Math.random() * 0.02 - 0.01);
            updated[symbol] = {
              ...updated[symbol],
              price: updated[symbol].price + priceChange,
              change24h: updated[symbol].change24h + (Math.random() * 0.5 - 0.25),
              lastUpdate: Date.now()
            };
          }
        });
        return updated;
      });
    }, 5000); // עדכון כל 5 שניות
    
    setIsLoading(false);
    
    return () => {
      clearInterval(interval);
      if (realTimeService) {
        realTimeService.stop();
      }
      setRealTimeActive(false);
    };
  }, [symbols.join(',')]);

  // עצירת עדכוני מחיר בזמן אמת
  const stopRealTimeUpdates = () => {
    setRealTimeActive(false);
  };

  // התחלת עדכוני מחיר בזמן אמת
  const startRealTimeUpdates = () => {
    setRealTimeActive(true);
  };

  return {
    marketData,
    fundamentalData,
    isRealTimeActive: realTimeActive,
    stopRealTimeUpdates,
    startRealTimeUpdates,
    isLoading: isLoading || isFundamentalLoading // Add isLoading to return
  };
}
