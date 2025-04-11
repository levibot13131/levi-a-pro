
import { useState, useEffect, useCallback } from 'react';
import { useTradingViewConnection } from './use-tradingview-connection';
import { useTradingViewIntegration } from './use-tradingview-integration';
import { toast } from 'sonner';

export function useTradingViewPage() {
  const { isConnected } = useTradingViewConnection();
  const { 
    syncEnabled, 
    isSyncing, 
    lastSyncTime, 
    manualSync
  } = useTradingViewIntegration();
  
  const [refreshTimer, setRefreshTimer] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<string>('charts');
  
  useEffect(() => {
    if (syncEnabled) {
      const timer = setInterval(() => {
        if (lastSyncTime) {
          const seconds = Math.floor((new Date().getTime() - lastSyncTime.getTime()) / 1000);
          setRefreshTimer(seconds);
        }
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [syncEnabled, lastSyncTime]);
  
  const formatLastSyncTime = useCallback(() => {
    if (!lastSyncTime) return 'אף פעם';
    
    if (refreshTimer < 60) {
      return `לפני ${refreshTimer} שניות`;
    }
    
    if (refreshTimer < 3600) {
      const minutes = Math.floor(refreshTimer / 60);
      return `לפני ${minutes} דקות`;
    }
    
    return lastSyncTime.toLocaleTimeString('he-IL', { 
      hour: '2-digit',
      minute: '2-digit'
    });
  }, [lastSyncTime, refreshTimer]);
  
  const handleManualRefresh = async () => {
    if (isSyncing) return;
    
    const success = await manualSync();
    if (success) {
      if (activeTab === 'charts') {
        toast.success("גרפים עודכנו בהצלחה");
      } else if (activeTab === 'news') {
        toast.success("חדשות עודכנו בהצלחה");
      }
    }
  };
  
  return {
    isConnected,
    syncEnabled,
    isSyncing,
    lastSyncTime,
    refreshTimer,
    activeTab,
    setActiveTab,
    formatLastSyncTime,
    handleManualRefresh
  };
}
