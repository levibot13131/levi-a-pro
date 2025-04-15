
import { useState, useEffect } from 'react';
import {
  getBinanceCredentials,
  isBinanceConnected,
  disconnectBinance,
  BinanceCredentials
} from '@/services/binance/binanceService';

export function useBinanceConnection() {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [credentials, setCredentials] = useState<BinanceCredentials | null>(null);
  const [isDevelopmentMode, setIsDevelopmentMode] = useState<boolean>(false);
  
  // Check connection status on mount
  useEffect(() => {
    const connected = isBinanceConnected();
    setIsConnected(connected);
    
    // בדיקה האם המערכת רצה במצב פיתוח
    const isDevMode = process.env.NODE_ENV === 'development' || 
                      !window.location.hostname.includes('lovable.app');
    setIsDevelopmentMode(isDevMode);
    
    if (connected) {
      setCredentials(getBinanceCredentials());
    }
  }, []);
  
  // Disconnect from Binance
  const disconnect = () => {
    disconnectBinance();
    setIsConnected(false);
    setCredentials(null);
  };
  
  // Refresh connection status
  const refreshConnection = () => {
    const connected = isBinanceConnected();
    setIsConnected(connected);
    
    if (connected) {
      setCredentials(getBinanceCredentials());
    } else {
      setCredentials(null);
    }
  };
  
  return {
    isConnected,
    credentials,
    isDevelopmentMode,
    disconnect,
    refreshConnection,
  };
}
