
import { useState, useEffect } from 'react';
import { 
  isTradingViewConnected, 
  getTradingViewCredentials,
  TradingViewCredentials
} from '@/services/tradingView/tradingViewAuthService';

export function useTradingViewConnection() {
  const [isConnected, setIsConnected] = useState(false);
  const [credentials, setCredentials] = useState<TradingViewCredentials | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkConnection = () => {
      const connected = isTradingViewConnected();
      setIsConnected(connected);
      
      if (connected) {
        setCredentials(getTradingViewCredentials());
      } else {
        setCredentials(null);
      }
      
      setLoading(false);
    };
    
    checkConnection();
    
    // הוספת האזנה לשינויים בלוקל סטורג'
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'tradingview_auth_credentials') {
        checkConnection();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return {
    isConnected,
    credentials,
    loading
  };
}
