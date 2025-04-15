
import { useState, useEffect } from 'react';
import { isRealTimeMode, setRealTimeMode } from '@/services/binance/marketData';
import { toast } from 'sonner';

interface DataSource {
  type: 'binance' | 'tradingview' | 'proxy';
  status: 'active' | 'inactive' | 'error';
  lastUpdated?: Date;
}

interface SystemStatus {
  isRealTime: boolean;
  connectionStatus: 'connected' | 'partial' | 'disconnected';
  hasProxyConfig: boolean;
  dataSources: DataSource[];
  enableRealTimeMode: () => boolean;
  disableRealTimeMode: () => boolean;
  toggleRealTimeMode: () => boolean;
}

export const useSystemStatus = (): SystemStatus => {
  const [isRealTime, setIsRealTime] = useState<boolean>(localStorage.getItem('system_real_time_mode') === 'true');
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'partial' | 'disconnected'>('disconnected');
  const [hasProxyConfig, setHasProxyConfig] = useState<boolean>(false);
  const [dataSources, setDataSources] = useState<DataSource[]>([
    { type: 'binance', status: 'inactive' },
    { type: 'tradingview', status: 'inactive' },
    { type: 'proxy', status: 'inactive' }
  ]);

  // אתחול המצב בטעינה ראשונית
  useEffect(() => {
    // בדיקה האם יש פרוקסי מוגדר
    const proxyConfigured = localStorage.getItem('levi_bot_proxy_url') !== null;
    setHasProxyConfig(proxyConfigured);
    
    // בדיקה אם יש התחברות לבינאנס
    const binanceConnected = localStorage.getItem('levi_bot_binance_credentials') !== null;
    
    // בדיקה אם יש התחברות ל-TradingView
    const tradingViewConnected = localStorage.getItem('tradingview_auth_credentials') !== null;
    
    // עדכון מצב החיבור הכללי
    if (binanceConnected && tradingViewConnected) {
      setConnectionStatus('connected');
    } else if (binanceConnected || tradingViewConnected) {
      setConnectionStatus('partial');
    } else {
      setConnectionStatus('disconnected');
    }
    
    // עדכון מקורות הנתונים
    setDataSources([
      { 
        type: 'binance', 
        status: binanceConnected ? 'active' : 'inactive',
        lastUpdated: binanceConnected ? new Date() : undefined
      },
      { 
        type: 'tradingview', 
        status: tradingViewConnected ? 'active' : 'inactive',
        lastUpdated: tradingViewConnected ? new Date() : undefined
      },
      { 
        type: 'proxy', 
        status: proxyConfigured ? 'active' : 'inactive' 
      }
    ]);
    
    // טעינת מצב זמן אמת מהזיכרון
    const savedRealTimeMode = localStorage.getItem('system_real_time_mode') === 'true';
    setIsRealTime(savedRealTimeMode);
    
    // טעינת הגדרת מצב זמן אמת מצב Binance
    if (isRealTimeMode() !== savedRealTimeMode) {
      // עדכון ההגדרה בשירות Binance
      setRealTimeMode(savedRealTimeMode);
    }
  }, []);
  
  // האזנה לשינויים במצב החיבור
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'levi_bot_proxy_url') {
        setHasProxyConfig(e.newValue !== null);
        setDataSources(prev => prev.map(source => 
          source.type === 'proxy' ? 
            { ...source, status: e.newValue !== null ? 'active' : 'inactive' } : 
            source
        ));
      } else if (e.key === 'levi_bot_binance_credentials') {
        const binanceConnected = e.newValue !== null;
        setDataSources(prev => prev.map(source => 
          source.type === 'binance' ? 
            { ...source, status: binanceConnected ? 'active' : 'inactive', lastUpdated: binanceConnected ? new Date() : undefined } : 
            source
        ));
        
        updateConnectionStatus();
      } else if (e.key === 'tradingview_auth_credentials') {
        const tradingViewConnected = e.newValue !== null;
        setDataSources(prev => prev.map(source => 
          source.type === 'tradingview' ? 
            { ...source, status: tradingViewConnected ? 'active' : 'inactive', lastUpdated: tradingViewConnected ? new Date() : undefined } : 
            source
        ));
        
        updateConnectionStatus();
      } else if (e.key === 'system_real_time_mode') {
        setIsRealTime(e.newValue === 'true');
        
        // עדכון הגדרת מצב זמן אמת בשירות Binance
        setRealTimeMode(e.newValue === 'true');
      }
    };
    
    const updateConnectionStatus = () => {
      const binanceConnected = localStorage.getItem('levi_bot_binance_credentials') !== null;
      const tradingViewConnected = localStorage.getItem('tradingview_auth_credentials') !== null;
      
      if (binanceConnected && tradingViewConnected) {
        setConnectionStatus('connected');
      } else if (binanceConnected || tradingViewConnected) {
        setConnectionStatus('partial');
      } else {
        setConnectionStatus('disconnected');
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);
  
  const enableRealTimeMode = (): boolean => {
    try {
      localStorage.setItem('system_real_time_mode', 'true');
      setIsRealTime(true);
      
      // עדכון הגדרת מצב זמן אמת בשירות Binance
      setRealTimeMode(true);
      
      return true;
    } catch (error) {
      console.error('Error enabling real-time mode:', error);
      toast.error('שגיאה בהפעלת מצב זמן אמת');
      return false;
    }
  };
  
  const disableRealTimeMode = (): boolean => {
    try {
      localStorage.setItem('system_real_time_mode', 'false');
      setIsRealTime(false);
      
      // עדכון הגדרת מצב זמן אמת בשירות Binance
      setRealTimeMode(false);
      
      return true;
    } catch (error) {
      console.error('Error disabling real-time mode:', error);
      toast.error('שגיאה בכיבוי מצב זמן אמת');
      return false;
    }
  };
  
  const toggleRealTimeMode = (): boolean => {
    return isRealTime ? disableRealTimeMode() : enableRealTimeMode();
  };
  
  return {
    isRealTime,
    connectionStatus,
    hasProxyConfig,
    dataSources,
    enableRealTimeMode,
    disableRealTimeMode,
    toggleRealTimeMode
  };
};
