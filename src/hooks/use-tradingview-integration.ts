
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
import { useRealTimeSync } from './use-realtime-sync';

/**
 * Hook for managing TradingView integration, data fetching, and real-time sync
 * @returns Object containing connection state, sync methods, and data fetching functions
 */
export function useTradingViewIntegration() {
  const { isConnected } = useTradingViewConnection();
  const [syncEnabled, setSyncEnabled] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);
  const syncInProgress = useRef(false);
  
  // Get real-time sync functions from custom hook
  const { 
    realTimeUpdateInterval,
    startRealTimeUpdates,
    stopRealTimeUpdates 
  } = useRealTimeSync(isConnected, manualSync);
  
  // Initialize sync status
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
  }, [isConnected, startRealTimeUpdates, stopRealTimeUpdates]);
  
  /**
   * Manually trigger a TradingView sync
   * @param showToast - Whether to show success/error toasts
   * @returns Promise resolving to boolean indicating success
   */
  async function manualSync(showToast: boolean = true) {
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
  }
  
  /**
   * Toggle automatic sync on/off
   */
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
  
  /**
   * Fetch chart data for a specific symbol and timeframe
   * @param symbol - Trading symbol (e.g., 'BTCUSD')
   * @param timeframe - Chart timeframe (e.g., '1D', '4h')
   * @returns Promise resolving to chart data or null
   */
  const fetchChartData = useCallback(async (
    symbol: string, 
    timeframe: string = '1D'
  ): Promise<TradingViewChartData | null> => {
    try {
      return await getChartData(symbol, timeframe);
    } catch (error) {
      console.error("Error fetching chart data:", error);
      return null;
    }
  }, []);
  
  /**
   * Fetch news from TradingView
   * @param limit - Maximum number of news items to return
   * @returns Promise resolving to array of news items
   */
  const fetchNews = useCallback(async (
    limit: number = 10
  ): Promise<TradingViewNewsItem[]> => {
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
