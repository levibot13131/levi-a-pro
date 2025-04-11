
import { useState, useEffect, useCallback } from 'react';
import { useTradingViewIntegration } from './use-tradingview-integration';
import { toast } from 'sonner';

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
      } else if (seconds < 86400) {
        return rtf.format(-Math.floor(seconds / 3600), 'hour');
      } else {
        return rtf.format(-Math.floor(seconds / 86400), 'day');
      }
    } catch (error) {
      // פתרון חלופי אם אין תמיכה ב-RelativeTimeFormat
      console.error('Error using RelativeTimeFormat:', error);
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
    console.log('Manual refresh requested');
    if (isSyncing) {
      console.log('Sync already in progress, ignoring request');
      toast.info("סנכרון כבר מתבצע");
      return;
    }
    
    try {
      const success = await manualSync(true);
      if (success) {
        console.log('Manual sync completed successfully');
      } else {
        console.log('Manual sync failed');
      }
    } catch (error) {
      console.error('Error during manual sync:', error);
      toast.error("שגיאה בסנכרון ידני", {
        description: "אירעה שגיאה בעת ביצוע הסנכרון הידני"
      });
    }
  }, [manualSync, isSyncing]);
  
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
