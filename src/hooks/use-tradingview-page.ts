
import { useState, useEffect, useCallback } from 'react';
import { useTradingViewIntegration } from './use-tradingview-integration';

export function useTradingViewPage() {
  const {
    isConnected,
    syncEnabled,
    isSyncing,
    lastSyncTime,
    manualSync,
    toggleAutoSync
  } = useTradingViewIntegration();
  
  // טיימר לתצוגה של הזמן שעבר מאז העדכון האחרון
  const [refreshTimer, setRefreshTimer] = useState(0);
  const [activeTab, setActiveTab] = useState("charts");
  
  // עדכון טיימר כל שניה
  useEffect(() => {
    const interval = setInterval(() => {
      if (lastSyncTime) {
        const seconds = Math.floor((Date.now() - lastSyncTime.getTime()) / 1000);
        setRefreshTimer(seconds);
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, [lastSyncTime]);
  
  // פורמט להצגת זמן העדכון האחרון
  const formatLastSyncTime = useCallback(() => {
    if (!lastSyncTime) return "לא היה סנכרון";
    
    try {
      const rtf = new Intl.RelativeTimeFormat('he', { numeric: 'auto' });
      const seconds = Math.floor((Date.now() - lastSyncTime.getTime()) / 1000);
      
      if (seconds < 60) {
        return rtf.format(-seconds, 'second');
      } else if (seconds < 3600) {
        return rtf.format(-Math.floor(seconds / 60), 'minute');
      } else {
        return rtf.format(-Math.floor(seconds / 3600), 'hour');
      }
    } catch (error) {
      // פתרון חלופי אם אין תמיכה ב-RelativeTimeFormat
      const minutes = Math.floor((Date.now() - lastSyncTime.getTime()) / 60000);
      if (minutes < 1) {
        return "לפני פחות מדקה";
      } else if (minutes < 60) {
        return `לפני ${minutes} דקות`;
      } else {
        const hours = Math.floor(minutes / 60);
        return `לפני ${hours} שעות`;
      }
    }
  }, [lastSyncTime]);
  
  // פונקציה לסנכרון ידני
  const handleManualRefresh = useCallback(async () => {
    await manualSync(true);
  }, [manualSync]);
  
  return {
    isConnected,
    syncEnabled,
    isSyncing,
    lastSyncTime,
    refreshTimer,
    activeTab,
    setActiveTab,
    formatLastSyncTime,
    handleManualRefresh,
    toggleAutoSync
  };
}
