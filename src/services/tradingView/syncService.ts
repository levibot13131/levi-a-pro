
import { toast } from 'sonner';
import { getTradingViewCredentials } from './tradingViewAuthService';
import { clearChartDataCache, setLastSyncTimestamp } from './chartDataService';
import { clearNewsCache } from './newsService';

// Variable to store the auto-sync interval
let syncInterval: number | null = null;

/**
 * Synchronize data with TradingView
 */
export const syncWithTradingView = async (): Promise<boolean> => {
  const credentials = getTradingViewCredentials();
  
  if (!credentials?.isConnected) {
    toast.error('אינך מחובר לחשבון TradingView', {
      description: 'אנא התחבר תחילה לחשבון TradingView'
    });
    return false;
  }
  
  try {
    // Simulate API call to TradingView
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Update last sync timestamp
    const timestamp = Date.now();
    setLastSyncTimestamp(timestamp);
    
    // Clear cache to force refresh on next data request
    clearChartDataCache();
    clearNewsCache();
    
    return true;
  } catch (error) {
    console.error('Error syncing with TradingView:', error);
    toast.error('שגיאה בסנכרון נתונים מ-TradingView', {
      description: 'אנא נסה שנית מאוחר יותר'
    });
    return false;
  }
};

/**
 * Initialize TradingView auto-sync
 * Setup automatic synchronization with TradingView every 5 minutes
 */
export const initializeTradingViewSync = () => {
  const credentials = getTradingViewCredentials();
  
  if (!credentials?.isConnected) {
    return false;
  }
  
  // Clear any existing interval
  if (syncInterval) {
    clearInterval(syncInterval);
  }
  
  // Set up auto-sync every 5 minutes
  syncInterval = window.setInterval(() => {
    syncWithTradingView();
  }, 5 * 60 * 1000);
  
  // Perform initial sync
  syncWithTradingView();
  
  return true;
};

/**
 * Stop TradingView auto-sync
 */
export const stopTradingViewSync = () => {
  if (syncInterval) {
    clearInterval(syncInterval);
    syncInterval = null;
  }
};

/**
 * Check if TradingView auto-sync is active
 */
export const isSyncActive = (): boolean => {
  return syncInterval !== null;
};

/**
 * Get the sync interval (for testing purposes)
 */
export const getSyncInterval = () => syncInterval;
