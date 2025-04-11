
import { WebhookSignal } from '@/types/webhookSignal';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';

// Event emitter for real-time updates
const listeners: Array<() => void> = [];

/**
 * Subscribe to webhook signal updates
 */
export const subscribeToWebhookSignals = (callback: () => void) => {
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
 * Process a new webhook signal from TradingView
 */
export const processWebhookSignal = (signal: Partial<WebhookSignal>) => {
  // Create a valid signal with required fields
  const completeSignal: WebhookSignal = {
    id: uuidv4(),
    timestamp: signal.timestamp || Date.now(),
    symbol: signal.symbol || 'UNKNOWN',
    message: signal.message || 'התקבל איתות חדש',
    action: signal.action || 'info',
    source: signal.source || 'TradingView',
    details: signal.details
  };
  
  // Store signal in localStorage for persistence
  const storedSignals = JSON.parse(localStorage.getItem('tradingViewSignals') || '[]');
  storedSignals.push(completeSignal);
  localStorage.setItem('tradingViewSignals', JSON.stringify(storedSignals));
  
  // Show toast notification for the signal
  const toastType = 
    completeSignal.action === 'buy' ? toast.success : 
    completeSignal.action === 'sell' ? toast.warning : 
    toast.info;
  
  toastType(`איתות ${
    completeSignal.action === 'buy' ? 'קנייה' : 
    completeSignal.action === 'sell' ? 'מכירה' : 
    'מידע'} התקבל`,
    {
      description: `${completeSignal.symbol} - ${completeSignal.message}`,
      duration: 8000,
    }
  );
  
  // Notify all listeners that new data is available
  notifyListeners();
};

/**
 * Get stored webhook signals from localStorage
 */
export const getStoredWebhookSignals = (): WebhookSignal[] => {
  return JSON.parse(localStorage.getItem('tradingViewSignals') || '[]');
};

/**
 * Clear all stored webhook signals
 */
export const clearStoredWebhookSignals = () => {
  localStorage.removeItem('tradingViewSignals');
  notifyListeners();
};

// Mock function to simulate receiving a webhook from TradingView
export const simulateWebhookSignal = (type: 'buy' | 'sell' | 'info' = 'info') => {
  const assets = ['BTC', 'ETH', 'SOL', 'ADA', 'BNB'];
  const randomAsset = assets[Math.floor(Math.random() * assets.length)];
  
  let message = '';
  if (type === 'buy') {
    message = `איתות קנייה ל-${randomAsset} - חציית ממוצע נע 50 כלפי מעלה`;
  } else if (type === 'sell') {
    message = `איתות מכירה ל-${randomAsset} - שבירת תמיכה`;
  } else {
    message = `תנועה משמעותית ב-${randomAsset}`;
  }
  
  const signal: Partial<WebhookSignal> = {
    symbol: `${randomAsset}/USD`,
    message,
    action: type,
    source: 'TradingView Webhook',
    details: 'איתות לדוגמה - הסימולציה הופעלה מהאפליקציה'
  };
  
  processWebhookSignal(signal);
  return signal;
};
