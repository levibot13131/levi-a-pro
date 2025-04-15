
import { useState, useEffect } from 'react';
import { useAppSettings } from './use-app-settings';
import { isRealTimeMode, setRealTimeMode } from '@/services/binance/marketData';

interface DataSource {
  type: 'binance' | 'tradingview' | 'twitter';
  status: 'active' | 'inactive' | 'error';
  lastUpdated: Date | null;
}

export const useSystemStatus = () => {
  const { demoMode } = useAppSettings((state: any) => ({
    demoMode: state.demoMode
  }));
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'partial'>('disconnected');
  const [isRealTime, setIsRealTime] = useState<boolean>(isRealTimeMode());
  const [dataSources, setDataSources] = useState<DataSource[]>([
    { type: 'binance', status: 'inactive', lastUpdated: null },
    { type: 'tradingview', status: 'inactive', lastUpdated: null },
    { type: 'twitter', status: 'inactive', lastUpdated: null },
  ]);

  // Update connection status based on data sources
  useEffect(() => {
    const activeSources = dataSources.filter(source => source.status === 'active');
    
    if (activeSources.length === 0) {
      setConnectionStatus('disconnected');
    } else if (activeSources.length === dataSources.length) {
      setConnectionStatus('connected');
    } else {
      setConnectionStatus('partial');
    }
  }, [dataSources]);
  
  // Check the real-time status initially and when demoMode changes
  useEffect(() => {
    if (demoMode) {
      setIsRealTime(false);
    }
  }, [demoMode]);

  // Function to enable real-time mode
  const enableRealTimeMode = () => {
    // Don't allow real-time in demo mode
    if (demoMode) {
      return false;
    }
    
    const realTimeModeEnabled = setRealTimeMode(true);
    setIsRealTime(realTimeModeEnabled);
    
    // Mock updating the data sources (in a real app, this would update based on actual connections)
    setDataSources(prev => {
      return prev.map(source => ({
        ...source,
        status: source.type === 'binance' ? 'active' : source.status,
        lastUpdated: source.type === 'binance' ? new Date() : source.lastUpdated
      }));
    });
    
    return realTimeModeEnabled;
  };

  // Function to update a data source status
  const updateDataSource = (type: 'binance' | 'tradingview' | 'twitter', status: 'active' | 'inactive' | 'error') => {
    setDataSources(prev => {
      return prev.map(source => {
        if (source.type === type) {
          return {
            ...source,
            status,
            lastUpdated: status === 'active' ? new Date() : source.lastUpdated
          };
        }
        return source;
      });
    });
  };

  return {
    connectionStatus,
    isRealTime,
    dataSources,
    enableRealTimeMode,
    updateDataSource
  };
};
