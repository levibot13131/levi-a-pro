
import { useState, useEffect } from 'react';
import { useTradingViewConnection } from './use-tradingview-connection';
import { 
  initializeTradingViewSync, 
  stopTradingViewSync, 
  isSyncActive,
  syncWithTradingView,
  getChartData,
  getTradingViewNews,
  TradingViewChartData,
  TradingViewNewsItem
} from '../services/tradingView/tradingViewIntegrationService';
import { toast } from 'sonner';

export function useTradingViewIntegration() {
  const { isConnected } = useTradingViewConnection();
  const [syncEnabled, setSyncEnabled] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);
  const [realTimeUpdateInterval, setRealTimeUpdateInterval] = useState<NodeJS.Timeout | null>(null);
  
  // Initialize or stop sync based on connection status
  useEffect(() => {
    if (isConnected && !isSyncActive()) {
      const initialized = initializeTradingViewSync();
      setSyncEnabled(initialized);
      if (initialized) {
        setLastSyncTime(new Date());
        startRealTimeUpdates();
      }
    } else if (!isConnected && isSyncActive()) {
      stopTradingViewSync();
      setSyncEnabled(false);
      stopRealTimeUpdates();
    }
    
    return () => {
      // Clean up on unmount
      stopTradingViewSync();
      stopRealTimeUpdates();
    };
  }, [isConnected]);

  // Start real-time updates
  const startRealTimeUpdates = () => {
    if (realTimeUpdateInterval) {
      clearInterval(realTimeUpdateInterval);
    }
    
    // Set up interval to sync data every 30 seconds
    const interval = setInterval(async () => {
      if (!isSyncing && isConnected) {
        await manualSync(false);
      }
    }, 30000); // 30 seconds
    
    setRealTimeUpdateInterval(interval);
    console.log('Real-time TradingView updates started');
  };
  
  // Stop real-time updates
  const stopRealTimeUpdates = () => {
    if (realTimeUpdateInterval) {
      clearInterval(realTimeUpdateInterval);
      setRealTimeUpdateInterval(null);
      console.log('Real-time TradingView updates stopped');
    }
  };
  
  // Manual sync function
  const manualSync = async (showToast: boolean = true) => {
    if (!isConnected) return false;
    
    setIsSyncing(true);
    try {
      const success = await syncWithTradingView();
      if (success) {
        setLastSyncTime(new Date());
        if (showToast) {
          toast.success("סנכרון הצליח", {
            description: "נתונים מעודכנים התקבלו מ-TradingView"
          });
        }
      } else if (showToast) {
        toast.error("הסנכרון נכשל", {
          description: "לא הצלחנו לקבל נתונים מעודכנים מ-TradingView"
        });
      }
      return success;
    } catch (error) {
      if (showToast) {
        toast.error("שגיאה בסנכרון", {
          description: "אירעה שגיאה בתהליך הסנכרון עם TradingView"
        });
      }
      console.error("TradingView sync error:", error);
      return false;
    } finally {
      setIsSyncing(false);
    }
  };
  
  // Toggle auto-sync
  const toggleAutoSync = () => {
    if (syncEnabled) {
      stopTradingViewSync();
      stopRealTimeUpdates();
      setSyncEnabled(false);
      toast.info("סנכרון אוטומטי הופסק");
    } else if (isConnected) {
      const initialized = initializeTradingViewSync();
      setSyncEnabled(initialized);
      if (initialized) {
        startRealTimeUpdates();
        setLastSyncTime(new Date());
        toast.success("סנכרון אוטומטי הופעל", {
          description: "נתונים יעודכנו כל 30 שניות"
        });
      }
    }
  };
  
  // Fetch chart data
  const fetchChartData = async (symbol: string, timeframe: string = '1D') => {
    try {
      return await getChartData(symbol, timeframe);
    } catch (error) {
      console.error("Error fetching chart data:", error);
      return null;
    }
  };
  
  // Fetch news
  const fetchNews = async (limit: number = 10) => {
    try {
      return await getTradingViewNews(limit);
    } catch (error) {
      console.error("Error fetching news:", error);
      return [];
    }
  };
  
  return {
    isConnected,
    syncEnabled,
    isSyncing,
    lastSyncTime,
    manualSync,
    toggleAutoSync,
    fetchChartData,
    fetchNews
  };
}
