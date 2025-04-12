
import { toast } from 'sonner';
import { createSampleAlert, sendAlert } from '../tradingViewAlertService';
import { isTradingViewConnected } from '../tradingViewAuthService';
import { WebhookSignal } from '@/types/webhookSignal';

// סוגי האיתותים שאנחנו מקבלים מ-TradingView
export type WebhookSignalType = 'buy' | 'sell' | 'info';

/**
 * מטפל בבקשת webhook שהתקבלה מ-TradingView
 */
export const handleTradingViewWebhook = async (data: any): Promise<boolean> => {
  if (!isTradingViewConnected()) {
    console.error('Cannot process webhook: TradingView not connected');
    return false;
  }
  
  try {
    console.log('Received webhook data:', data);
    
    // עיבוד הנתונים שהתקבלו
    const processedSignal = processWebhookData(data);
    
    if (!processedSignal) {
      console.error('Invalid webhook data format');
      return false;
    }
    
    // שליחת ההתראה דרך השירות
    await sendAlert(processedSignal);
    
    return true;
  } catch (error) {
    console.error('Error processing TradingView webhook:', error);
    return false;
  }
};

/**
 * עיבוד נתוני ה-webhook לפורמט הפנימי שלנו
 */
const processWebhookData = (data: any): WebhookSignal | null => {
  // וידוא שהנתונים תקינים
  if (!data || typeof data !== 'object') {
    return null;
  }
  
  // חילוץ הנתונים מה-payload
  const {
    symbol = 'UNKNOWN',
    strategy = 'Unknown',
    timeframe = '1d',
    price,
    message,
    action = 'info'
  } = data;
  
  // המרת הפעולה לסוג האיתות המוכר שלנו
  let signalType: WebhookSignalType = 'info';
  
  if (typeof action === 'string') {
    const actionLower = action.toLowerCase();
    if (actionLower.includes('buy') || actionLower.includes('long')) {
      signalType = 'buy';
    } else if (actionLower.includes('sell') || actionLower.includes('short')) {
      signalType = 'sell';
    }
  }
  
  // יצירת האיתות
  return {
    symbol,
    message: message || `${signalType.toUpperCase()} Alert for ${symbol}`,
    indicators: strategy ? [strategy] : [],
    timeframe,
    timestamp: Date.now(),
    price: parseFloat(price) || 0,
    action: signalType,
    strength: signalType === 'info' ? 5 : 8
  };
};

/**
 * בודק את תהליך ה-webhook מקצה לקצה
 */
export const testWebhookFlow = async (type: WebhookSignalType = 'info'): Promise<boolean> => {
  if (!isTradingViewConnected()) {
    toast.error('שגיאה בבדיקת Webhook', {
      description: 'אינך מחובר ל-TradingView'
    });
    return false;
  }
  
  try {
    // יצירת מידע לבדיקה
    const testData = {
      symbol: 'BTC/USD',
      strategy: 'Test Strategy',
      timeframe: '1h',
      price: '50000',
      message: `TEST ${type.toUpperCase()} SIGNAL`,
      action: type
    };
    
    // עיבוד הנתונים ושליחת ההתראה
    const success = await handleTradingViewWebhook(testData);
    
    if (success) {
      toast.success('בדיקת Webhook הצליחה', {
        description: `האיתות נשלח בהצלחה לכל היעדים המוגדרים`
      });
    } else {
      toast.error('בדיקת Webhook נכשלה', {
        description: 'אירעה שגיאה בעיבוד האיתות'
      });
    }
    
    return success;
  } catch (error) {
    console.error('Error testing webhook flow:', error);
    toast.error('שגיאה בבדיקת Webhook', {
      description: 'אירעה שגיאה בלתי צפויה'
    });
    return false;
  }
};

/**
 * מדמה קבלת איתות webhook מ-TradingView
 */
export const simulateWebhook = async (type: WebhookSignalType = 'info'): Promise<boolean> => {
  if (!isTradingViewConnected()) {
    toast.error('שגיאה בסימולציית Webhook', {
      description: 'אינך מחובר ל-TradingView'
    });
    return false;
  }
  
  try {
    // יצירת התראה לדוגמה
    const sampleAlert = createSampleAlert(type);
    
    // שליחת ההתראה
    await sendAlert(sampleAlert);
    
    toast.success('סימולציית Webhook הצליחה', {
      description: `האיתות מסוג ${type.toUpperCase()} נשלח בהצלחה לכל היעדים`
    });
    
    return true;
  } catch (error) {
    console.error('Error simulating webhook:', error);
    toast.error('שגיאה בסימולציית Webhook', {
      description: 'אירעה שגיאה בלתי צפויה'
    });
    return false;
  }
};
