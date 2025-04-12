
import React, { useEffect, useState } from 'react';
import { useStoredSignals, startRealTimeAnalysis, clearStoredSignals } from '@/services/backtesting/realTimeAnalysis';
import { toast } from 'sonner';
import { BacktestSettings } from '@/services/backtesting/types';
import { getTrackedAssets } from '@/services/assetTracking/storage';

interface RealTimeAlertsServiceProps {
  assetIds: string[];
  settings: Partial<BacktestSettings>;
  children: (props: {
    signals: any[];
    isActive: boolean;
    toggleRealTimeAlerts: () => void;
    handleClearSignals: () => void;
    enableAutomaticAlerts: () => void;
    areAutoAlertsEnabled: boolean;
  }) => React.ReactNode;
}

const RealTimeAlertsService: React.FC<RealTimeAlertsServiceProps> = ({ 
  assetIds, 
  settings, 
  children 
}) => {
  const [isActive, setIsActive] = React.useState(false);
  const [alertInstance, setAlertInstance] = React.useState<{ stop: () => void } | null>(null);
  const { data: signals = [], refetch } = useStoredSignals();
  const [autoAlertsEnabled, setAutoAlertsEnabled] = useState(false);
  
  // למצוא נכסים במעקב באופן אוטומטי
  useEffect(() => {
    // אם לא הוגדרו נכסים ויש נכסים במעקב, נשתמש בהם
    if (assetIds.length === 0) {
      const trackedAssets = getTrackedAssets();
      
      if (trackedAssets.length > 0) {
        const trackedIds = trackedAssets
          .filter(asset => asset.alertsEnabled)
          .map(asset => asset.id);
        
        // אם מצאנו נכסים עם התראות פעילות, נפעיל את הניתוח עליהם
        if (trackedIds.length > 0 && autoAlertsEnabled && !isActive) {
          console.log('Auto-starting alerts for tracked assets:', trackedIds);
          startAutomaticAlerts(trackedIds);
        }
      }
    }
  }, [autoAlertsEnabled, assetIds.length]);
  
  useEffect(() => {
    // Refetch signals periodically
    const interval = setInterval(() => {
      refetch();
    }, 5000);
    
    return () => {
      clearInterval(interval);
      // Cleanup any active instance on unmount
      if (alertInstance) {
        alertInstance.stop();
      }
    };
  }, [alertInstance, refetch]);
  
  const startAutomaticAlerts = (assets: string[]) => {
    if (assets.length === 0) {
      toast.info("אין נכסים עם התראות פעילות");
      return;
    }
    
    const instance = startRealTimeAnalysis(assets, settings);
    setAlertInstance(instance);
    setIsActive(true);
    
    toast.success("ניתוח בזמן אמת הופעל אוטומטית", {
      description: `מנטר ${assets.length} נכסים. התראות ישלחו לערוצים המוגדרים.`
    });
  };
  
  const toggleRealTimeAlerts = () => {
    if (isActive && alertInstance) {
      // Stop current analysis
      alertInstance.stop();
      setAlertInstance(null);
      setIsActive(false);
      toast.info("ניתוח בזמן אמת הופסק");
    } else {
      // Start new analysis
      const instance = startRealTimeAnalysis(assetIds, settings);
      setAlertInstance(instance);
      setIsActive(true);
      toast.success("ניתוח בזמן אמת הופעל", {
        description: "המערכת תתחיל לשלוח התראות בזמן אמת"
      });
    }
  };
  
  const handleClearSignals = () => {
    clearStoredSignals();
    toast.info("כל ההתראות נמחקו");
    refetch();
  };
  
  const enableAutomaticAlerts = () => {
    setAutoAlertsEnabled(true);
    
    const trackedAssets = getTrackedAssets();
    const trackedIds = trackedAssets
      .filter(asset => asset.alertsEnabled)
      .map(asset => asset.id);
    
    if (trackedIds.length > 0) {
      startAutomaticAlerts(trackedIds);
    } else {
      toast.info("אין נכסים עם התראות פעילות", {
        description: "הפעל התראות לנכסים ברשימת המעקב שלך"
      });
    }
  };

  return (
    <>
      {children({
        signals,
        isActive,
        toggleRealTimeAlerts,
        handleClearSignals,
        enableAutomaticAlerts,
        areAutoAlertsEnabled: autoAlertsEnabled
      })}
    </>
  );
};

export default RealTimeAlertsService;
