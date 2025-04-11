
import { useQuery } from '@tanstack/react-query';
import { 
  getStoredWebhookSignals, 
  clearStoredWebhookSignals,
  simulateWebhookSignal, 
  subscribeToWebhookSignals 
} from '@/services/tradingViewWebhookService';
import { useState, useEffect } from 'react';
import { WebhookSignal } from '@/types/webhookSignal';

export const useWebhookSignals = () => {
  const [signalCount, setSignalCount] = useState(0);
  
  // Fetch stored signals using React Query
  const {
    data: signals = [],
    isLoading,
    error,
    refetch
  } = useQuery<WebhookSignal[]>({
    queryKey: ['webhookSignals'],
    queryFn: getStoredWebhookSignals,
  });
  
  // Set up subscription to signal updates
  useEffect(() => {
    const unsubscribe = subscribeToWebhookSignals(() => {
      refetch();
      setSignalCount(prev => prev + 1);
    });
    
    return () => unsubscribe();
  }, [refetch]);
  
  // Functions for managing signals
  const clearSignals = () => {
    clearStoredWebhookSignals();
    refetch();
  };
  
  const simulateSignal = (type: 'buy' | 'sell' | 'info' = 'info') => {
    simulateWebhookSignal(type);
  };
  
  return {
    signals,
    isLoading,
    error,
    clearSignals,
    simulateSignal,
    signalCount
  };
};
