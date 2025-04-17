
import { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { 
  initializeTradingViewSync, 
  stopTradingViewSync, 
  isSyncActive,
  syncWithTradingView
} from '../services/tradingView';
import { useRealTimeSync } from './use-realtime-sync';

/**
 * Hook for managing TradingView data synchronization
 * @param isConnected - Whether the user is connected to TradingView
 * @returns Object containing sync state and control methods
 */
export function useTradingViewSync(isConnected: boolean) {
  const [syncEnabled, setSyncEnabled] = useState<boolean>(false);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);

  /**
   * Manually trigger a TradingView sync
   * @param showToast - Whether to show success/error toasts
   * @returns Promise resolving to boolean indicating success
   */
  const manualSync = useCallback(async (showToast: boolean = true): Promise<boolean> => {
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
  }, [isConnected, isSyncing]);

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

  return {
    syncEnabled,
    isSyncing,
    lastSyncTime,
    manualSync,
    toggleAutoSync,
    realTimeUpdateInterval
  };
}
