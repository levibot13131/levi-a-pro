
import { TradeSignal } from '@/types/asset';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';

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
 * Hook to access stored signals
 */
export const useStoredSignals = (assetId?: string) => {
  return useQuery({
    queryKey: ['storedSignals', assetId],
    queryFn: () => {
      const signals = getStoredSignals();
      return assetId ? signals.filter(s => s.assetId === assetId) : signals;
    },
    refetchInterval: 10000, // Refresh every 10 seconds
  });
};
