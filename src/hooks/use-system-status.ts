
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { getRealTimeStatus, startRealTimeUpdates } from '@/services/realtime/realtimeService';

interface DataSource {
  type: string;
  name: string;
  status: 'active' | 'inactive' | 'error';
  lastUpdate?: Date;
}

export const useSystemStatus = () => {
  const [isRealTime, setIsRealTime] = useState<boolean>(false);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'partial'>('disconnected');
  const [dataSources, setDataSources] = useState<DataSource[]>([
    { type: 'binance', name: 'Binance API', status: 'inactive' },
    { type: 'tradingview', name: 'TradingView', status: 'inactive' },
    { type: 'twitter', name: 'Twitter API', status: 'inactive' }
  ]);
  
  const updateStatus = useCallback(async () => {
    try {
      const realTimeStatus = await getRealTimeStatus();
      
      // Update data sources based on real-time status
      const updatedSources = [...dataSources];
      
      // Update TradingView status
      const tvIndex = updatedSources.findIndex(s => s.type === 'tradingview');
      if (tvIndex !== -1) {
        updatedSources[tvIndex].status = realTimeStatus.tradingView ? 'active' : 'inactive';
        updatedSources[tvIndex].lastUpdate = new Date();
      }
      
      // Update Binance status
      const binanceIndex = updatedSources.findIndex(s => s.type === 'binance');
      if (binanceIndex !== -1) {
        updatedSources[binanceIndex].status = realTimeStatus.binance ? 'active' : 'inactive';
        updatedSources[binanceIndex].lastUpdate = new Date();
      }
      
      // Update Twitter status
      const twitterIndex = updatedSources.findIndex(s => s.type === 'twitter');
      if (twitterIndex !== -1) {
        updatedSources[twitterIndex].status = realTimeStatus.twitter ? 'active' : 'inactive';
        updatedSources[twitterIndex].lastUpdate = new Date();
      }
      
      setDataSources(updatedSources);
      
      // Determine overall connection status
      const activeCount = updatedSources.filter(s => s.status === 'active').length;
      if (activeCount === 0) {
        setConnectionStatus('disconnected');
        setIsRealTime(false);
      } else if (activeCount === updatedSources.length) {
        setConnectionStatus('connected');
        setIsRealTime(true);
      } else {
        setConnectionStatus('partial');
        setIsRealTime(activeCount > 0);
      }
    } catch (error) {
      console.error('Error updating system status:', error);
    }
  }, [dataSources]);
  
  useEffect(() => {
    // Initial status update
    updateStatus();
    
    // Set up interval to update status
    const intervalId = setInterval(updateStatus, 60000); // Update every minute
    
    return () => {
      clearInterval(intervalId);
    };
  }, [updateStatus]);
  
  const enableRealTimeMode = useCallback(() => {
    try {
      const success = startRealTimeUpdates();
      
      if (success) {
        setIsRealTime(true);
        updateStatus();
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error enabling real-time mode:', error);
      return false;
    }
  }, [updateStatus]);
  
  return {
    isRealTime,
    connectionStatus,
    dataSources,
    updateStatus,
    enableRealTimeMode
  };
};
