
import { toast } from 'sonner';
import { getTradingViewCredentials } from './tradingViewAuthService';

// שירות שליחת התראות מ-TradingView למערכות חיצוניות
export interface AlertDestination {
  type: 'whatsapp' | 'telegram' | 'email' | 'sms';
  webhookUrl?: string;
  enabled: boolean;
}

// מידע אודות ההתראה
export interface TradingViewAlert {
  symbol: string;
  message: string;
  indicators: string[];
  timeframe: string;
  timestamp: number;
  price: number;
  action: 'buy' | 'sell' | 'info';
  strength: number; // 1-10
}

// הגדרות השליחה של התראות
let alertDestinations: AlertDestination[] = [
  { type: 'whatsapp', enabled: false },
  { type: 'telegram', enabled: false },
  { type: 'email', enabled: false },
  { type: 'sms', enabled: false }
];

/**
 * קבלת הגדרות היעדים להתראות
 */
export const getAlertDestinations = (): AlertDestination[] => {
  // בדיקה אם יש הגדרות במקומי
  const savedDestinations = localStorage.getItem('alertDestinations');
  if (savedDestinations) {
    alertDestinations = JSON.parse(savedDestinations);
  }
  return alertDestinations;
};

/**
 * עדכון הגדרות יעד להתראות
 */
export const updateAlertDestination = (type: string, settings: Partial<AlertDestination>): boolean => {
  const index = alertDestinations.findIndex(d => d.type === type);
  if (index >= 0) {
    alertDestinations[index] = { ...alertDestinations[index], ...settings };
    localStorage.setItem('alertDestinations', JSON.stringify(alertDestinations));
    return true;
  }
  return false;
};

/**
 * שליחת התראה ליעדים מוגדרים
 */
export const sendAlert = async (alert: TradingViewAlert): Promise<boolean> => {
  const credentials = getTradingViewCredentials();
  if (!credentials?.isConnected) {
    console.error('Cannot send alerts: Not connected to TradingView');
    return false;
  }

  let sentToAny = false;
  const destinations = getAlertDestinations();

  // תוכן ההודעה
  const message = `
*${alert.action === 'buy' ? '🟢 איתות קנייה' : alert.action === 'sell' ? '🔴 איתות מכירה' : '🔵 מידע'}*
סימול: ${alert.symbol}
מחיר: $${alert.price.toLocaleString()}
עוצמה: ${alert.strength}/10
מקור: TradingView
${alert.message}
`;

  // עבור על כל היעדים המוגדרים ושלח התראה אם מופעל
  for (const destination of destinations) {
    if (destination.enabled && destination.webhookUrl) {
      try {
        // שליחה לוואטסאפ
        if (destination.type === 'whatsapp') {
          await fetch(`${destination.webhookUrl}&text=${encodeURIComponent(message)}`, {
            method: 'POST',
            mode: 'no-cors',
          });
          sentToAny = true;
          console.log(`Alert sent to WhatsApp: ${alert.symbol}`);
        }
        
        // שליחה לטלגרם
        else if (destination.type === 'telegram') {
          await fetch(destination.webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: message }),
            mode: 'no-cors',
          });
          sentToAny = true;
          console.log(`Alert sent to Telegram: ${alert.symbol}`);
        }
      } catch (error) {
        console.error(`Error sending alert to ${destination.type}:`, error);
      }
    }
  }

  return sentToAny;
};

/**
 * בדיקת חיבורים ליעדים
 */
export const testAlertDestination = async (type: string): Promise<boolean> => {
  const destination = alertDestinations.find(d => d.type === type);
  if (!destination || !destination.enabled || !destination.webhookUrl) {
    return false;
  }

  const testAlert: TradingViewAlert = {
    symbol: 'TEST',
    message: 'זוהי הודעת בדיקה ממערכת ההתראות',
    indicators: ['TEST'],
    timeframe: '1d',
    timestamp: Date.now(),
    price: 1000,
    action: 'info',
    strength: 5
  };

  try {
    // שליחה לוואטסאפ
    if (type === 'whatsapp') {
      await fetch(`${destination.webhookUrl}&text=${encodeURIComponent('הודעת בדיקה ממערכת ההתראות')}`, {
        method: 'POST',
        mode: 'no-cors',
      });
      return true;
    }
    
    // שליחה לטלגרם
    else if (type === 'telegram') {
      await fetch(destination.webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: 'הודעת בדיקה ממערכת ההתראות' }),
        mode: 'no-cors',
      });
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`Error testing alert to ${type}:`, error);
    return false;
  }
};
