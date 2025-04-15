
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { BacktestSettings } from '@/services/backtesting/types';
import { getTrackedAssets } from '@/services/assetTracking/storage';
import { useAuth } from '@/contexts/AuthContext';
import { useBinanceConnection } from '@/hooks/use-binance-connection';
import { useBinanceData } from '@/hooks/use-binance-data';
import { getProxyConfig, listenToProxyChanges } from '@/services/proxy/proxyConfig';

import { useStoredSignals, clearStoredSignals } from '@/services/backtesting/realTimeAnalysis/signalStorage';
import { startRealTimeAnalysis } from '@/services/backtesting/realTimeAnalysis/alertSystem';

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
    isBinanceConnected: boolean;
    binanceMarketData: any;
    proxyStatus: { isEnabled: boolean; hasUrl: boolean };
  }) => React.ReactNode;
}

const RealTimeAlertsService: React.FC<RealTimeAlertsServiceProps> = ({ 
  assetIds, 
  settings, 
  children 
}) => {
  const { user, isAdmin } = useAuth();
  const [isActive, setIsActive] = React.useState(false);
  const [alertInstance, setAlertInstance] = React.useState<{ stop: () => void } | null>(null);
  const { data: signals = [], refetch } = useStoredSignals();
  const [autoAlertsEnabled, setAutoAlertsEnabled] = useState(false);
  const [proxyStatus, setProxyStatus] = useState(() => {
    const config = getProxyConfig();
    return { 
      isEnabled: config.isEnabled, 
      hasUrl: !!config.baseUrl?.trim() 
    };
  });
  
  const { isConnected: isBinanceConnected } = useBinanceConnection();
  const mappedAssetIds = assetIds.map(id => {
    switch(id.toLowerCase()) {
      case 'bitcoin': return 'BTCUSDT';
      case 'ethereum': return 'ETHUSDT';
      case 'solana': return 'SOLUSDT';
      default: return id.toUpperCase() + 'USDT';
    }
  });
  
  const { marketData: binanceMarketData } = useBinanceData(isBinanceConnected ? mappedAssetIds : []);
  
  // האזנה לשינויים בהגדרות הפרוקסי
  useEffect(() => {
    const unsubscribe = listenToProxyChanges((config) => {
      console.log('Proxy config changed in RealTimeAlertsService:', config);
      setProxyStatus({
        isEnabled: config.isEnabled,
        hasUrl: !!config.baseUrl?.trim()
      });
      
      // אם הפרוקסי הופעל והתראות פעילות, נודיע למשתמש
      if (config.isEnabled && config.baseUrl && isActive) {
        toast.success('פרוקסי הופעל', {
          description: 'התראות בזמן אמת ישתמשו כעת בפרוקסי'
        });
      }
    });
    
    return () => unsubscribe();
  }, [isActive]);
  
  useEffect(() => {
    if (assetIds.length === 0) {
      const trackedAssets = getTrackedAssets();
      
      if (trackedAssets.length > 0) {
        const trackedIds = trackedAssets
          .filter(asset => asset.alertsEnabled)
          .map(asset => asset.id);
        
        if (trackedIds.length > 0 && autoAlertsEnabled && !isActive) {
          console.log('Auto-starting alerts for tracked assets:', trackedIds);
          startAutomaticAlerts(trackedIds);
        }
      }
    }
  }, [autoAlertsEnabled, assetIds.length, isActive]);
  
  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 5000);
    
    return () => {
      clearInterval(interval);
      if (alertInstance) {
        alertInstance.stop();
      }
    };
  }, [alertInstance, refetch]);
  
  const startAutomaticAlerts = (assets: string[]) => {
    if (!user) {
      toast.error("יש להתחבר כדי להפעיל התראות אוטומטיות");
      return;
    }
    
    if (assets.length === 0) {
      toast.info("אין נכסים עם התראות פעילות");
      return;
    }
    
    // בדיקת הגדרות פרוקסי
    const config = getProxyConfig();
    if (!config.isEnabled || !config.baseUrl) {
      toast.warning('התראות בזמן אמת עשויות לא לעבוד ללא פרוקסי', {
        description: 'מומלץ להגדיר פרוקסי עבור פונקציונליות מלאה'
      });
    }
    
    const instance = startRealTimeAnalysis(assets, settings);
    setAlertInstance(instance);
    setIsActive(true);
    
    toast.success("ניתוח בזמן אמת הופעל אוטומטית", {
      description: `מנטר ${assets.length} נכסים. התראות ישלחו לערוצים המוגדרים.`
    });
  };
  
  const toggleRealTimeAlerts = () => {
    if (!user) {
      toast.error("יש להתחבר כדי להפעיל התראות");
      return;
    }
    
    if (isActive && alertInstance) {
      alertInstance.stop();
      setAlertInstance(null);
      setIsActive(false);
      toast.info("ניתוח בזמן אמת הופסק");
    } else {
      // בדיקת הגדרות פרוקסי לפני הפעלה
      const config = getProxyConfig();
      if (!config.isEnabled || !config.baseUrl) {
        toast.warning('התראות בזמן אמת עשויות לא לעבוד ללא פרוקסי', {
          description: 'מומלץ להגדיר פרוקסי עבור פונקציונליות מלאה'
        });
      }
      
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
    if (!user) {
      toast.error("יש להתחבר כדי להפעיל התראות אוטומטיות");
      return;
    }
    
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
        areAutoAlertsEnabled: autoAlertsEnabled,
        isBinanceConnected,
        binanceMarketData,
        proxyStatus
      })}
    </>
  );
};

export default RealTimeAlertsService;
