
import { TradeSignal } from '@/types/asset';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';

// Event emitter for real-time updates
const listeners: Array<() => void> = [];

/**
 * Subscribe to signal updates
 */
export const subscribeToSignals = (callback: () => void) => {
  listeners.push(callback);
  return () => {
    const index = listeners.indexOf(callback);
    if (index > -1) {
      listeners.splice(index, 1);
    }
  };
};

/**
 * Notify all listeners of signal updates
 */
const notifyListeners = () => {
  listeners.forEach(callback => callback());
};

/**
 * Process a new trading signal
 */
export const processSignal = (signal: TradeSignal) => {
  // Store signal in localStorage for persistence
  const storedSignals = JSON.parse(localStorage.getItem('tradingSignals') || '[]');
  storedSignals.push(signal);
  localStorage.setItem('tradingSignals', JSON.stringify(storedSignals));
  
  // Show toast notification for the signal
  const toastType = signal.type === 'buy' ? toast.success : toast.warning;
  toastType(`איתות ${signal.type === 'buy' ? 'קנייה' : 'מכירה'} התקבל`,
    {
      description: `${signal.strategy} - מחיר ${signal.price.toLocaleString()} - חוזק: ${
        signal.strength === 'strong' ? 'חזק' : 
        signal.strength === 'medium' ? 'בינוני' : 'חלש'
      }`,
      duration: 8000,
    }
  );
  
  // Notify all listeners that new data is available
  notifyListeners();
  
  // Trigger any webhook notifications here if configured
  // This would be implemented in a real application
};

/**
 * Get stored signals from localStorage
 */
export const getStoredSignals = (): TradeSignal[] => {
  return JSON.parse(localStorage.getItem('tradingSignals') || '[]');
};

/**
 * Clear all stored signals
 */
export const clearStoredSignals = () => {
  localStorage.removeItem('tradingSignals');
  notifyListeners();
};

/**
 * Hook to access stored signals
 */
export const useStoredSignals = () => {
  return useQuery({
    queryKey: ['storedSignals'],
    queryFn: () => {
      return getStoredSignals();
    },
    refetchInterval: 5000, // Refresh every 5 seconds
  });
};
