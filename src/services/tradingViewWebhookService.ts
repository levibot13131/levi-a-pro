
import { WebhookSignal } from '@/types/webhookSignal';
import { v4 as uuidv4 } from 'uuid';
import { testWebhookFlow, simulateWebhook } from './tradingView/webhooks/processor';
import { toast } from 'sonner';
import { processWebhookData } from './tradingView/webhooks/processor';

// מאגר האיתותים
let storedSignals: WebhookSignal[] = [];
// רשימת המנויים לשינויים
const subscribers: (() => void)[] = [];

/**
 * קבלת האיתותים השמורים
 */
export const getStoredWebhookSignals = (): WebhookSignal[] => {
  return [...storedSignals];
};

/**
 * הוספת איתות חדש למאגר
 */
export const addWebhookSignal = (signal: Omit<WebhookSignal, 'id'>): WebhookSignal => {
  const newSignal: WebhookSignal = {
    id: uuidv4(),
    ...signal
  };
  
  storedSignals = [newSignal, ...storedSignals].slice(0, 100); // שמירת מקסימום 100 איתותים
  notifySubscribers();
  
  return newSignal;
};

/**
 * ניקוי כל האיתותים השמורים
 */
export const clearStoredWebhookSignals = (): void => {
  storedSignals = [];
  notifySubscribers();
};

/**
 * סימולציית איתות מטריידינגוויו
 */
export const simulateWebhookSignal = async (type: 'buy' | 'sell' | 'info' = 'info'): Promise<boolean> => {
  try {
    // הוספת האיתות למאגר המקומי
    const timestamp = Date.now();
    const symbol = type === 'buy' ? 'BTC/USD' : type === 'sell' ? 'ETH/USD' : 'XRP/USD';
    
    // מוסיף את האיתות למאגר המקומי (נראה בממשק)
    addWebhookSignal({
      symbol,
      timestamp,
      message: type === 'buy' 
        ? 'זוהה איתות קנייה חזק' 
        : type === 'sell' 
          ? 'איתות מכירה זוהה במחיר הנוכחי' 
          : 'הודעת מידע: מחיר הגיע לרמה מהותית',
      action: type,
      source: 'WebhookTester',
      details: `סימולציית איתות ${type} במערכת, ${new Date().toLocaleString('he-IL')}`
    });
    
    toast.success(`סימולציית איתות ${type} הצליחה`, {
      description: 'האיתות הוצג במערכת ונשמר במאגר'
    });
    
    return true;
  } catch (error) {
    console.error('Error simulating webhook signal:', error);
    toast.error('שגיאה בסימולציית האיתות');
    return false;
  }
};

/**
 * בדיקת זרימת webhook מלאה
 */
export const testWebhookSignalFlow = async (type: 'buy' | 'sell' | 'info' = 'info'): Promise<boolean> => {
  try {
    // השתמש בפונקציה הקיימת לבדיקת הזרימה המלאה
    return await testWebhookFlow(type);
  } catch (error) {
    console.error('Error testing webhook flow:', error);
    toast.error('שגיאה בבדיקת זרימת הווהבוק');
    return false;
  }
};

/**
 * רישום למנוי לשינויים באיתותים
 */
export const subscribeToWebhookSignals = (callback: () => void): () => void => {
  subscribers.push(callback);
  return () => {
    const index = subscribers.indexOf(callback);
    if (index > -1) {
      subscribers.splice(index, 1);
    }
  };
};

/**
 * הודעה לכל המנויים על שינוי באיתותים
 */
const notifySubscribers = (): void => {
  subscribers.forEach(callback => callback());
};

/**
 * העברת webhook למערכת העיבוד
 */
export const processIncomingWebhook = async (data: any): Promise<boolean> => {
  const timestamp = Date.now();
  try {
    // מוסיף את האיתות הגולמי למאגר המקומי (נראה בממשק)
    const action = data.action || data.signal?.toLowerCase().includes('buy') 
      ? 'buy' 
      : data.signal?.toLowerCase().includes('sell') 
        ? 'sell' 
        : 'info';
    
    addWebhookSignal({
      symbol: data.symbol || 'Unknown',
      timestamp,
      message: data.message || data.signal || `איתות ${action} התקבל`,
      action,
      source: 'TradingView',
      details: data.details || `מחיר: ${data.price || data.close || 'N/A'}`
    });
    
    // מעביר את הנתונים לפונקציית העיבוד של המערכת
    return await processWebhookData(data);
  } catch (error) {
    console.error('Error processing incoming webhook:', error);
    return false;
  }
};
