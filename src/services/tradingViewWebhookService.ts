
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import { WebhookSignal } from '@/types/webhookSignal';
import { simulateWebhook, testWebhookFlow } from './tradingView/webhooks/processor';

// Local storage key for webhook signals
const WEBHOOK_SIGNALS_KEY = 'tradingview-webhook-signals';

// Store for event subscribers
type WebhookCallback = () => void;
const subscribers: WebhookCallback[] = [];

/**
 * Get stored webhook signals from local storage
 */
export const getStoredWebhookSignals = (): WebhookSignal[] => {
  try {
    const storedSignals = localStorage.getItem(WEBHOOK_SIGNALS_KEY);
    if (storedSignals) {
      return JSON.parse(storedSignals);
    }
  } catch (error) {
    console.error('Error getting stored webhook signals:', error);
  }
  return [];
};

/**
 * Store webhook signal
 */
export const storeWebhookSignal = (signal: WebhookSignal): void => {
  try {
    const signals = getStoredWebhookSignals();
    signals.unshift(signal);
    
    // Limit to 50 signals
    const limitedSignals = signals.slice(0, 50);
    
    localStorage.setItem(WEBHOOK_SIGNALS_KEY, JSON.stringify(limitedSignals));
    
    // Notify subscribers
    notifySignalSubscribers();
  } catch (error) {
    console.error('Error storing webhook signal:', error);
  }
};

/**
 * Clear stored webhook signals
 */
export const clearStoredWebhookSignals = (): void => {
  try {
    localStorage.removeItem(WEBHOOK_SIGNALS_KEY);
    notifySignalSubscribers();
    toast.success('האיתותים נוקו בהצלחה');
  } catch (error) {
    console.error('Error clearing webhook signals:', error);
    toast.error('שגיאה בניקוי האיתותים');
  }
};

/**
 * Subscribe to webhook signal updates
 */
export const subscribeToWebhookSignals = (callback: WebhookCallback): (() => void) => {
  subscribers.push(callback);
  
  // Return unsubscribe function
  return () => {
    const index = subscribers.indexOf(callback);
    if (index > -1) {
      subscribers.splice(index, 1);
    }
  };
};

/**
 * Notify all subscribers
 */
const notifySignalSubscribers = (): void => {
  subscribers.forEach(callback => callback());
};

/**
 * Simulate a webhook signal for testing
 */
export const simulateWebhookSignal = async (type: 'buy' | 'sell' | 'info' = 'info'): Promise<boolean> => {
  try {
    // Simulate webhook to test the flow
    const result = await simulateWebhook(type);
    
    // Create a simulated webhook signal for UI display
    const signal: WebhookSignal = {
      id: uuidv4(),
      timestamp: Date.now(),
      symbol: type === 'buy' ? 'BTC/USD' : type === 'sell' ? 'ETH/USD' : 'XRP/USD',
      message: type === 'buy' ? 'איתות קנייה לדוגמה' : type === 'sell' ? 'איתות מכירה לדוגמה' : 'עדכון שוק לדוגמה',
      action: type,
      source: 'סימולציית Webhook',
      details: 'איתות לדוגמה שנוצר בלחיצת כפתור'
    };
    
    // Store the signal for UI display
    storeWebhookSignal(signal);
    
    toast.success(`איתות ${type} לדוגמה נוצר בהצלחה`);
    return result;
  } catch (error) {
    console.error('Error simulating webhook signal:', error);
    toast.error('שגיאה ביצירת איתות לדוגמה');
    return false;
  }
};

/**
 * Test the webhook flow with real implementation
 */
export const testWebhookSignalFlow = async (type: 'buy' | 'sell' | 'info' = 'info'): Promise<boolean> => {
  try {
    return await testWebhookFlow(type);
  } catch (error) {
    console.error('Error testing webhook signal flow:', error);
    return false;
  }
};
