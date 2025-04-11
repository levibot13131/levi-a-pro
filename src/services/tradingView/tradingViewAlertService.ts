
import { isTradingViewConnected } from './tradingViewAuthService';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import { sendTelegramMessage, parseTelegramConfig } from './telegramService';

export type AlertDestination = {
  id: string;
  name: string;
  type: 'telegram' | 'whatsapp' | 'email' | 'sms';
  active: boolean;
};

export type TradingViewAlert = {
  symbol: string;
  message: string;
  indicators: string[];
  timeframe: string;
  timestamp: number;
  price: number;
  action: 'buy' | 'sell' | 'info';
  strength?: number;
  details?: string;
};

const LOCAL_STORAGE_KEY = 'tradingview_alert_destinations';

// קבלת יעדי התראות מוגדרים
export const getAlertDestinations = (): AlertDestination[] => {
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    console.error('Error loading alert destinations:', error);
  }
  
  // יעדים ברירת מחדל
  const defaultDestinations: AlertDestination[] = [
    {
      id: uuidv4(),
      name: '{"botToken":"","chatId":""}',
      type: 'telegram',
      active: false
    }
  ];
  
  // שמירת יעדים ברירת מחדל
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(defaultDestinations));
  
  return defaultDestinations;
};

// שמירת יעדי התראות
export const saveAlertDestinations = (destinations: AlertDestination[]): void => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(destinations));
};

// הוספת יעד התראה חדש
export const addAlertDestination = (destination: Omit<AlertDestination, 'id'>): void => {
  const destinations = getAlertDestinations();
  const newDestination = {
    ...destination,
    id: uuidv4()
  };
  
  destinations.push(newDestination);
  saveAlertDestinations(destinations);
  
  toast.success('יעד התראות חדש נוסף', {
    description: `יעד מסוג ${getDestinationTypeName(destination.type)} נוסף בהצלחה`
  });
};

// עדכון יעד התראה
export const updateAlertDestination = (type: AlertDestination['type'], updates: Partial<AlertDestination>): void => {
  const destinations = getAlertDestinations();
  const index = destinations.findIndex(d => d.type === type);
  
  if (index !== -1) {
    destinations[index] = { ...destinations[index], ...updates };
    saveAlertDestinations(destinations);
    
    toast.success('יעד התראות עודכן', {
      description: `יעד ${getDestinationTypeName(type)} עודכן בהצלחה`
    });
  } else {
    // אם היעד לא קיים, נוסיף אותו
    addAlertDestination({
      name: updates.name || type,
      type,
      active: updates.active || false
    });
  }
};

// מחיקת יעד התראה
export const deleteAlertDestination = (id: string): void => {
  const destinations = getAlertDestinations();
  const filtered = destinations.filter(d => d.id !== id);
  
  if (filtered.length !== destinations.length) {
    saveAlertDestinations(filtered);
    
    toast.success('יעד התראות נמחק', {
      description: 'יעד ההתראות נמחק בהצלחה'
    });
  }
};

// שליחת התראה ליעדים
export const sendAlert = async (alert: TradingViewAlert): Promise<boolean> => {
  if (!isTradingViewConnected()) {
    console.error('Cannot send alert: TradingView is not connected');
    return false;
  }
  
  const destinations = getAlertDestinations().filter(d => d.active);
  
  if (destinations.length === 0) {
    console.log('No active alert destinations');
    return false;
  }
  
  try {
    // כאן במערכת אמיתית היינו שולחים את ההתראות לשרת
    console.log(`Sending alert for ${alert.symbol} to ${destinations.length} destinations`);
    
    // סימולציה של שליחת התראות
    const successCount = await simulateSendAlerts(alert, destinations);
    
    if (successCount > 0) {
      toast.success('התראה נשלחה', {
        description: `התראה עבור ${alert.symbol} נשלחה ל-${successCount} יעדים`
      });
      return true;
    } else {
      toast.error('שליחת התראה נכשלה', {
        description: 'אירעה שגיאה בשליחת ההתראה, אנא נסה שנית'
      });
      return false;
    }
  } catch (error) {
    console.error('Error sending alert:', error);
    toast.error('שליחת התראה נכשלה', {
      description: 'אירעה שגיאה בשליחת ההתראה, אנא נסה שנית'
    });
    return false;
  }
};

// שם סוג יעד
const getDestinationTypeName = (type: AlertDestination['type']): string => {
  switch (type) {
    case 'telegram':
      return 'טלגרם';
    case 'whatsapp':
      return 'וואטסאפ';
    case 'email':
      return 'אימייל';
    case 'sms':
      return 'SMS';
    default:
      return type;
  }
};

// סימולציה של שליחת התראות (לצורך המחשה בלבד)
const simulateSendAlerts = async (
  alert: TradingViewAlert,
  destinations: AlertDestination[]
): Promise<number> => {
  let successCount = 0;
  
  // יצירת הודעה מפורמטת
  const formatAlertMessage = (alert: TradingViewAlert) => {
    const actionEmoji = alert.action === 'buy' ? '🟢' : alert.action === 'sell' ? '🔴' : 'ℹ️';
    const actionText = alert.action === 'buy' ? 'קנייה' : alert.action === 'sell' ? 'מכירה' : 'מידע';
    
    return `${actionEmoji} *${actionText}: ${alert.symbol}*\n`
      + `💰 מחיר: $${alert.price.toLocaleString()}\n`
      + `📊 טווח זמן: ${alert.timeframe}\n`
      + (alert.indicators.length > 0 ? `📈 אינדיקטורים: ${alert.indicators.join(', ')}\n` : '')
      + `📝 הודעה: ${alert.message}\n`
      + (alert.details ? `🔍 פרטים: ${alert.details}\n` : '')
      + `⏱️ זמן: ${new Date(alert.timestamp).toLocaleString('he-IL')}`;
  };

  // שליחה לכל היעדים
  for (const destination of destinations) {
    try {
      if (destination.type === 'telegram' && destination.active) {
        // שליחה לטלגרם
        const config = parseTelegramConfig(destination.name);
        if (config) {
          const message = formatAlertMessage(alert);
          const success = await sendTelegramMessage(config, message);
          if (success) {
            successCount++;
            toast.success('התראה נשלחה לטלגרם', {
              description: `איתות ${alert.action === 'buy' ? 'קנייה' : alert.action === 'sell' ? 'מכירה' : 'מידע'} עבור ${alert.symbol} נשלח לטלגרם שלך`
            });
          }
        }
      }
      // במקרה שנרצה להוסיף יעדים נוספים בעתיד
    } catch (error) {
      console.error(`Error sending to ${destination.type}:`, error);
    }
  }
  
  return successCount;
};
