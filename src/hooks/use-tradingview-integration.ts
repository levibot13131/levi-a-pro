
import { useTradingViewAuth } from './use-tradingview-auth';
import { useTradingViewSync } from './use-tradingview-sync';
import { useTradingViewData } from './use-tradingview-data';

/**
 * Hook for managing TradingView integration, combining authentication, 
 * data synchronization, and data fetching
 * @returns Object containing all TradingView integration functionality
 */
export function useTradingViewIntegration() {
  // Get authentication state and methods
  const auth = useTradingViewAuth();
  
  // Get sync state and methods
  const sync = useTradingViewSync(auth.isConnected);
  
  // Get data fetching methods
  const data = useTradingViewData();
  
  return {
    // Authentication
    isConnected: auth.isConnected,
    credentials: auth.credentials,
    isAuthLoading: auth.isLoading,
    connect: auth.connect,
    disconnect: auth.disconnect,
    
    // Synchronization
    syncEnabled: sync.syncEnabled,
    isSyncing: sync.isSyncing,
    lastSyncTime: sync.lastSyncTime,
    manualSync: sync.manualSync,
    toggleAutoSync: sync.toggleAutoSync,
    
    // Data fetching
    fetchChartData: data.fetchChartData,
    fetchNews: data.fetchNews
  };
}
