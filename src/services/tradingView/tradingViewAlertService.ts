
import { isTradingViewConnected } from './tradingViewAuthService';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';

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
      name: 'וואטסאפ אישי',
      type: 'whatsapp',
      active: true
    },
    {
      id: uuidv4(),
      name: 'טלגרם - קבוצת איתותים',
      type: 'telegram',
      active: true
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
export const updateAlertDestination = (id: string, updates: Partial<AlertDestination>): void => {
  const destinations = getAlertDestinations();
  const index = destinations.findIndex(d => d.id === id);
  
  if (index !== -1) {
    destinations[index] = { ...destinations[index], ...updates };
    saveAlertDestinations(destinations);
    
    toast.success('יעד התראות עודכן', {
      description: `יעד ${destinations[index].name} עודכן בהצלחה`
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
  // כאן היה קוד אמיתי שמתחבר לשרת ושולח התראות
  
  // סימולציה של זמן תגובה
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // מציג התראה על שליחת ההודעה בוואטסאפ
  const whatsappDestinations = destinations.filter(d => d.type === 'whatsapp');
  if (whatsappDestinations.length > 0) {
    toast.success('התראה נשלחה לוואטסאפ', {
      description: `איתות ${alert.action === 'buy' ? 'קנייה' : alert.action === 'sell' ? 'מכירה' : 'מידע'} עבור ${alert.symbol} נשלח לוואטסאפ שלך`
    });
  }
  
  // מציג התראה על שליחת ההודעה בטלגרם
  const telegramDestinations = destinations.filter(d => d.type === 'telegram');
  if (telegramDestinations.length > 0) {
    toast.success('התראה נשלחה לטלגרם', {
      description: `איתות ${alert.action === 'buy' ? 'קנייה' : alert.action === 'sell' ? 'מכירה' : 'מידע'} עבור ${alert.symbol} נשלח לערוץ הטלגרם שלך`
    });
  }
  
  // החזרת מספר היעדים שההתראה נשלחה אליהם
  return destinations.length;
};
