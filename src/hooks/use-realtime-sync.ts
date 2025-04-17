
import { useState, useCallback, useRef } from 'react';

/**
 * Hook for managing real-time data synchronization
 * @param isConnected - Whether the connection is active
 * @param syncFunction - Function to call for syncing data
 * @param intervalMs - Sync interval in milliseconds
 * @returns Object containing interval reference and control functions
 */
export function useRealTimeSync(
  isConnected: boolean,
  syncFunction: (showToast: boolean) => Promise<boolean>,
  intervalMs: number = 30000
) {
  const [realTimeUpdateInterval, setRealTimeUpdateInterval] = useState<NodeJS.Timeout | null>(null);
  const syncInProgress = useRef(false);
  
  /**
   * Starts real-time updates at the specified interval
   */
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
          await syncFunction(false);
        } finally {
          syncInProgress.current = false;
        }
      }
    }, intervalMs);
    
    setRealTimeUpdateInterval(interval);
    console.log('Real-time updates started');
  }, [isConnected, intervalMs, syncFunction, realTimeUpdateInterval]);
  
  /**
   * Stops real-time updates
   */
  const stopRealTimeUpdates = useCallback(() => {
    if (realTimeUpdateInterval) {
      clearInterval(realTimeUpdateInterval);
      setRealTimeUpdateInterval(null);
      console.log('Real-time updates stopped');
    }
  }, [realTimeUpdateInterval]);
  
  return {
    realTimeUpdateInterval,
    startRealTimeUpdates,
    stopRealTimeUpdates
  };
}
