
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

interface RealTimeConnectionState {
  apiConnected: boolean;
  webSocketsConnected: boolean;
  lastChecked: number;
  isChecking: boolean;
}

export function useRealTimeConnection() {
  const [connectionState, setConnectionState] = useState<RealTimeConnectionState>({
    apiConnected: false,
    webSocketsConnected: false,
    lastChecked: 0,
    isChecking: false
  });
  
  const checkConnections = useCallback(async () => {
    setConnectionState(prev => ({ ...prev, isChecking: true }));
    
    try {
      console.log('Checking direct cloud API connections...');
      
      // Test direct Binance API connection
      const binanceResponse = await fetch('https://api.binance.com/api/v3/ping');
      const apiConnected = binanceResponse.ok;
      
      // Update state
      setConnectionState({
        apiConnected,
        webSocketsConnected: connectionState.webSocketsConnected,
        lastChecked: Date.now(),
        isChecking: false
      });
      
      // Show status
      if (apiConnected) {
        toast.success('Connected to external data sources', {
          description: 'Real-time data is now available'
        });
      } else {
        toast.error('Connection to data sources failed', {
          description: 'Check network connectivity'
        });
      }
      
      return { apiConnected };
    } catch (error) {
      console.error('Connection check error:', error);
      setConnectionState(prev => ({ 
        ...prev, 
        isChecking: false,
        lastChecked: Date.now()
      }));
      
      toast.error('Error checking connections', {
        description: error instanceof Error ? error.message : 'Unknown error'
      });
      
      return { apiConnected: false };
    }
  }, [connectionState.webSocketsConnected]);
  
  // Check connections on mount
  useEffect(() => {
    checkConnections();
    
    // Setup websocket status listener
    const handleWebSocketStatus = (event: Event) => {
      const customEvent = event as CustomEvent<{connected: boolean}>;
      setConnectionState(prev => ({
        ...prev,
        webSocketsConnected: customEvent.detail.connected
      }));
    };
    
    window.addEventListener('websocket-status-change', handleWebSocketStatus);
    
    return () => {
      window.removeEventListener('websocket-status-change', handleWebSocketStatus);
    };
  }, [checkConnections]);
  
  // Setup periodic connection check (every 5 minutes)
  useEffect(() => {
    const interval = setInterval(() => {
      checkConnections();
    }, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [checkConnections]);
  
  return {
    ...connectionState,
    checkConnections
  };
}
