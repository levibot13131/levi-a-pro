
import { useState, useEffect, useCallback, useRef } from 'react';
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
} from '../services/tradingView';
import { toast } from 'sonner';

export function useTradingViewIntegration() {
  const { isConnected } = useTradingViewConnection();
  const [syncEnabled, setSyncEnabled] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);
  const [realTimeUpdateInterval, setRealTimeUpdateInterval] = useState<NodeJS.Timeout | null>(null);
  const syncInProgress = useRef(false);
  
  useEffect(() => {
    // Check initial sync status
    const syncStatus = isSyncActive();
    setSyncEnabled(syncStatus);
    console.log(`Initial sync status: ${syncStatus ? 'Active' : 'Inactive'}`);
    
    if (isConnected) {
      if (!syncStatus) {
        console.log('Connected but sync not active, initializing...');
        const initialized = initializeTradingViewSync();
        setSyncEnabled(initialized);
        if (initialized) {
          setLastSyncTime(new Date());
          startRealTimeUpdates();
          console.log('Sync initialized successfully');
        } else {
          console.log('Failed to initialize sync');
        }
      } else {
        console.log('Connected and sync already active');
        startRealTimeUpdates();
      }
    } else if (!isConnected && syncStatus) {
      console.log('Not connected but sync active, stopping sync');
      stopTradingViewSync();
      setSyncEnabled(false);
      stopRealTimeUpdates();
    }
    
    return () => {
      stopRealTimeUpdates();
    };
  }, [isConnected]);

  const startRealTimeUpdates = useCallback(() => {
    if (realTimeUpdateInterval) {
      clearInterval(realTimeUpdateInterval);
    }
    
    const interval = setInterval(async () => {
      if (syncInProgress.current) {
        console.log('Previous sync still in progress, skipping...');
        return;
      }
      
      if (isConnected) {
        console.log('Auto-sync triggered');
        syncInProgress.current = true;
        try {
          await manualSync(false);
        } finally {
          syncInProgress.current = false;
        }
      }
    }, 30000); // Update every 30 seconds
    
    setRealTimeUpdateInterval(interval);
    console.log('Real-time TradingView updates started');
  }, [isConnected]);
  
  const stopRealTimeUpdates = useCallback(() => {
    if (realTimeUpdateInterval) {
      clearInterval(realTimeUpdateInterval);
      setRealTimeUpdateInterval(null);
      console.log('Real-time TradingView updates stopped');
    }
  }, [realTimeUpdateInterval]);
  
  const manualSync = async (showToast: boolean = true) => {
    if (!isConnected) {
      if (showToast) {
        toast.error("לא ניתן לסנכרן", {
          description: "אינך מחובר ל-TradingView"
        });
      }
      return false;
    }
    
    if (isSyncing) {
      if (showToast) {
        toast.info("סנכרון כבר מתבצע", {
          description: "יש סנכרון פעיל, אנא המתן לסיומו"
        });
      }
      return false;
    }
    
    setIsSyncing(true);
    console.log('Manual sync started');
    try {
      const success = await syncWithTradingView();
      if (success) {
        setLastSyncTime(new Date());
        if (showToast) {
          toast.success("סנכרון הצליח", {
            description: "נתונים מעודכנים התקבלו מ-TradingView"
          });
        }
        console.log('Sync completed successfully');
      } else if (showToast) {
        toast.error("הסנכרון נכשל", {
          description: "לא הצלחנו לקבל נתונים מעודכנים מ-TradingView"
        });
        console.log('Sync failed');
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
  
  const toggleAutoSync = useCallback(() => {
    if (syncEnabled) {
      stopTradingViewSync();
      stopRealTimeUpdates();
      setSyncEnabled(false);
      toast.info("סנכרון אוטומטי הופסק");
      console.log('Auto-sync disabled');
    } else if (isConnected) {
      const initialized = initializeTradingViewSync();
      setSyncEnabled(initialized);
      if (initialized) {
        startRealTimeUpdates();
        setLastSyncTime(new Date());
        toast.success("סנכרון אוטומטי הופעל", {
          description: "נתונים יעודכנו כל 30 שניות"
        });
        console.log('Auto-sync enabled');
      } else {
        toast.error("לא ניתן להפעיל סנכרון אוטומטי", {
          description: "אירעה שגיאה בהפעלת הסנכרון האוטומטי"
        });
        console.log('Failed to initialize auto-sync');
      }
    } else {
      toast.error("לא ניתן להפעיל סנכרון אוטומטי", {
        description: "אינך מחובר ל-TradingView"
      });
      console.log('Cannot enable auto-sync, not connected');
    }
  }, [syncEnabled, isConnected, startRealTimeUpdates, stopRealTimeUpdates]);
  
  const fetchChartData = useCallback(async (symbol: string, timeframe: string = '1D'): Promise<TradingViewChartData | null> => {
    try {
      return await getChartData(symbol, timeframe);
    } catch (error) {
      console.error("Error fetching chart data:", error);
      return null;
    }
  }, []);
  
  const fetchNews = useCallback(async (limit: number = 10): Promise<TradingViewNewsItem[]> => {
    try {
      return await getTradingViewNews(limit);
    } catch (error) {
      console.error("Error fetching news:", error);
      return [];
    }
  }, []);
  
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
