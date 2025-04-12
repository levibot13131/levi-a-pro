
import { handleTradingViewWebhook, testWebhookFlow, simulateWebhook } from './tradingView/webhooks/processor';
import { isTradingViewConnected } from './tradingView/tradingViewAuthService';
import { getAlertDestinations } from './tradingView/tradingViewAlertService';
import { toast } from 'sonner';
import { WebhookSignal } from '@/types/webhookSignal';

// Store for webhook signals
let webhookSignals: WebhookSignal[] = [];
const signalListeners: Array<() => void> = [];

/**
 * Get stored webhook signals
 */
export const getStoredWebhookSignals = (): WebhookSignal[] => {
  return [...webhookSignals];
};

/**
 * Clear all stored webhook signals
 */
export const clearStoredWebhookSignals = (): void => {
  webhookSignals = [];
  notifySignalListeners();
};

/**
 * Subscribe to webhook signal updates
 */
export const subscribeToWebhookSignals = (callback: () => void): (() => void) => {
  signalListeners.push(callback);
  return () => {
    const index = signalListeners.indexOf(callback);
    if (index > -1) {
      signalListeners.splice(index, 1);
    }
  };
};

/**
 * Notify all signal listeners of updates
 */
const notifySignalListeners = (): void => {
  signalListeners.forEach(listener => listener());
};

/**
 * Add a new webhook signal
 */
export const addWebhookSignal = (signal: WebhookSignal): void => {
  webhookSignals = [signal, ...webhookSignals].slice(0, 100); // Keep only the latest 100 signals
  notifySignalListeners();
};

/**
 * Try to simulate a webhook signal and process it through the system
 */
export const simulateWebhookSignal = async (type: 'buy' | 'sell' | 'info' = 'info'): Promise<boolean> => {
  if (!checkIntegrationReady()) {
    return false;
  }
  
  try {
    toast.info(`סימולציית Webhook מסוג ${getActionTypeName(type)}`, {
      description: 'הסימולציה החלה, אנא המתן לתוצאות'
    });
    
    const result = await simulateWebhook(type);
    return result;
  } catch (error) {
    console.error('Error simulating webhook signal:', error);
    toast.error('שגיאה בסימולציית Webhook', {
      description: 'אירעה שגיאה בלתי צפויה. בדוק את הקונסול לפרטים נוספים'
    });
    return false;
  }
};

/**
 * Test the webhook flow with a test signal
 */
export const testWebhookSignalFlow = async (type: 'buy' | 'sell' | 'info' = 'info'): Promise<boolean> => {
  if (!checkIntegrationReady()) {
    return false;
  }
  
  try {
    toast.info(`בדיקת Webhook מסוג ${getActionTypeName(type)}`, {
      description: 'הבדיקה החלה, אנא המתן לתוצאות'
    });
    
    const result = await testWebhookFlow(type);
    return result;
  } catch (error) {
    console.error('Error testing webhook flow:', error);
    toast.error('שגיאה בבדיקת Webhook', {
      description: 'אירעה שגיאה בלתי צפויה. בדוק את הקונסול לפרטים נוספים'
    });
    return false;
  }
};

/**
 * Helper function to check if the integration is ready
 */
const checkIntegrationReady = (): boolean => {
  if (!isTradingViewConnected()) {
    toast.error('אינך מחובר ל-TradingView', {
      description: 'חבר את המערכת ל-TradingView לפני ביצוע בדיקות'
    });
    return false;
  }
  
  const destinations = getAlertDestinations().filter(d => d.active);
  if (destinations.length === 0) {
    toast.warning('אין יעדי התראות פעילים', {
      description: 'הגדר לפחות יעד התראות אחד פעיל לפני ביצוע בדיקות'
    });
    return false;
  }
  
  return true;
};

/**
 * Helper function to get the action type name in Hebrew
 */
const getActionTypeName = (type: string): string => {
  switch (type) {
    case 'buy': return 'קנייה';
    case 'sell': return 'מכירה';
    case 'info': return 'מידע';
    default: return type;
  }
};

// Re-export some functions for direct use
export { handleTradingViewWebhook };
