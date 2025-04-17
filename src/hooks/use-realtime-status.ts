
import { useState, useEffect, useCallback } from 'react';
import { 
  RealTimeStatus, 
  getRealTimeStatus, 
  startRealTimeUpdates, 
  stopRealTimeUpdates 
} from '@/services/realtime/realtimeService';

export function useRealtimeStatus(autoRefresh: boolean = true) {
  const [status, setStatus] = useState<RealTimeStatus | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [autoRefreshEnabled, setAutoRefreshEnabled] = useState<boolean>(autoRefresh);
  
  const refreshStatus = useCallback(async (force: boolean = true) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const updatedStatus = await getRealTimeStatus(force);
      setStatus(updatedStatus);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to get real-time status'));
      console.error('Error getting real-time status:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  const toggleAutoRefresh = useCallback(() => {
    setAutoRefreshEnabled(prev => !prev);
  }, []);
  
  const startUpdates = useCallback(() => {
    const success = startRealTimeUpdates();
    if (success) {
      refreshStatus(true);
    }
    return success;
  }, [refreshStatus]);
  
  const stopUpdates = useCallback(() => {
    return stopRealTimeUpdates();
  }, []);
  
  useEffect(() => {
    // Initial status check
    refreshStatus(true);
    
    // Set up auto-refresh if enabled
    let intervalId: NodeJS.Timeout | null = null;
    
    if (autoRefreshEnabled) {
      intervalId = setInterval(() => {
        refreshStatus(false);
      }, 30000); // Check every 30 seconds
    }
    
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [refreshStatus, autoRefreshEnabled]);
  
  return {
    status,
    isLoading,
    error,
    refreshStatus,
    autoRefreshEnabled,
    toggleAutoRefresh,
    startUpdates,
    stopUpdates
  };
}
