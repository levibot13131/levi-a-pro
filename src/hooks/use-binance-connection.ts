
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
  
  // Check connection status on mount
  useEffect(() => {
    const connected = isBinanceConnected();
    setIsConnected(connected);
    
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
    disconnect,
    refreshConnection,
  };
}
