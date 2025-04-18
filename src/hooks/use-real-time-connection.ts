
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { testProxyConnection, getProxyConfig } from '@/services/proxy/proxyConfig';
import { apiClient } from '@/services/api-client-example';

interface RealTimeConnectionState {
  proxyConnected: boolean;
  apiConnected: boolean;
  webSocketsConnected: boolean;
  lastChecked: number;
  isChecking: boolean;
}

export function useRealTimeConnection() {
  const [connectionState, setConnectionState] = useState<RealTimeConnectionState>({
    proxyConnected: false,
    apiConnected: false,
    webSocketsConnected: false,
    lastChecked: 0,
    isChecking: false
  });
  
  const checkConnections = async () => {
    setConnectionState(prev => ({ ...prev, isChecking: true }));
    
    try {
      // Check proxy connection
      const proxyConfig = getProxyConfig();
      console.log('Checking proxy connection to:', proxyConfig.baseUrl);
      
      const proxyConnected = await testProxyConnection();
      
      // Check API connection
      let apiConnected = false;
      if (proxyConnected) {
        apiConnected = await apiClient.testProxyConnection();
      }
      
      // Update state
      setConnectionState({
        proxyConnected,
        apiConnected,
        webSocketsConnected: false, // This will be updated by a socket connection event
        lastChecked: Date.now(),
        isChecking: false
      });
      
      // Show status
      if (proxyConnected && apiConnected) {
        toast.success('Connected to external data sources', {
          description: 'Real-time data is now available'
        });
      } else if (proxyConnected) {
        toast.warning('Partial connection established', {
          description: 'Proxy is working but API connection failed'
        });
      } else {
        toast.error('Connection to data sources failed', {
          description: 'Check proxy settings and network connectivity'
        });
      }
      
      return { proxyConnected, apiConnected };
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
      
      return { proxyConnected: false, apiConnected: false };
    }
  };
  
  // Check connections on mount
  useEffect(() => {
    checkConnections();
    
    // Setup listener for proxy config changes
    const handleProxyChange = () => {
      checkConnections();
    };
    
    window.addEventListener('proxy-config-changed', handleProxyChange);
    
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
      window.removeEventListener('proxy-config-changed', handleProxyChange);
      window.removeEventListener('websocket-status-change', handleWebSocketStatus);
    };
  }, []);
  
  // Setup periodic connection check (every 5 minutes)
  useEffect(() => {
    const interval = setInterval(() => {
      checkConnections();
    }, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  return {
    ...connectionState,
    checkConnections
  };
}
