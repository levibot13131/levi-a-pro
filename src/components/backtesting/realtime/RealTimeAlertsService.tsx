
import React, { useEffect } from 'react';
import { useStoredSignals, startRealTimeAnalysis, clearStoredSignals } from '@/services/backtesting/realTimeAnalysis';
import { toast } from 'sonner';
import { BacktestSettings } from '@/services/backtesting/types';

interface RealTimeAlertsServiceProps {
  assetIds: string[];
  settings: Partial<BacktestSettings>;
  children: (props: {
    signals: any[];
    isActive: boolean;
    toggleRealTimeAlerts: () => void;
    handleClearSignals: () => void;
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

  return (
    <>
      {children({
        signals,
        isActive,
        toggleRealTimeAlerts,
        handleClearSignals
      })}
    </>
  );
};

export default RealTimeAlertsService;
