
import { toast } from 'sonner';
import { TradingViewAlert, AlertDestination } from './types';
import { getAlertDestinations } from './destinations';
import { isTradingViewConnected } from '../tradingViewAuthService';
import { sendTelegramMessage, parseTelegramConfig } from '../telegramService';

// Format alert message
export const formatAlertMessage = (alert: TradingViewAlert): string => {
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

// Send message to WhatsApp
const sendWhatsAppMessage = async (webhookUrl: string, message: string): Promise<boolean> => {
  try {
    // במימוש אמיתי, נשלח בקשה לשרת WhatsApp או לשירות הודעות
    // כאן נשתמש בסימולציה פשוטה לצורכי הדגמה
    console.log(`Sending WhatsApp message to webhook: ${webhookUrl}`);
    console.log(`Message content: ${message}`);
    
    // סימולציה של לחיצה על שרת
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return true;
  } catch (error) {
    console.error('Error sending WhatsApp message:', error);
    return false;
  }
};

// Send alert to destinations
export const sendAlertToDestinations = async (
  alert: TradingViewAlert,
  destinations: AlertDestination[]
): Promise<number> => {
  let successCount = 0;
  const formattedMessage = formatAlertMessage(alert);

  // Send to all destinations
  for (const destination of destinations) {
    try {
      if (destination.active) {
        if (destination.type === 'telegram') {
          // Send to Telegram
          const config = parseTelegramConfig(destination.name);
          if (config) {
            const success = await sendTelegramMessage(config, formattedMessage);
            if (success) {
              successCount++;
              toast.success('התראה נשלחה לטלגרם', {
                description: `איתות ${alert.action === 'buy' ? 'קנייה' : alert.action === 'sell' ? 'מכירה' : 'מידע'} עבור ${alert.symbol} נשלח לטלגרם שלך`
              });
            }
          }
        } else if (destination.type === 'whatsapp') {
          // Send to WhatsApp
          const webhookUrl = destination.name;
          const success = await sendWhatsAppMessage(webhookUrl, formattedMessage);
          
          if (success) {
            successCount++;
            toast.success('התראה נשלחה לוואטסאפ', {
              description: `איתות ${alert.action === 'buy' ? 'קנייה' : alert.action === 'sell' ? 'מכירה' : 'מידע'} עבור ${alert.symbol} נשלח לוואטסאפ שלך`
            });
          }
        }
        // ניתן להוסיף בעתיד יעדים נוספים כאן (SMS, Email וכו')
      }
    } catch (error) {
      console.error(`Error sending to ${destination.type}:`, error);
    }
  }
  
  return successCount;
};

// Send alert to all active destinations
export const sendAlert = async (alert: TradingViewAlert): Promise<boolean> => {
  // שים לב שהסרנו את הבדיקה אם TradingView מחובר כדי לאפשר שליחת התראות גם ללא חיבור
  
  // Get active destinations
  const destinations = getAlertDestinations().filter(d => d.active);
  
  if (destinations.length === 0) {
    console.log('No active alert destinations');
    // נשלח התראה למשתמש שאין יעדים פעילים
    toast.warning('אין יעדי התראות פעילים', {
      description: 'הגדר לפחות יעד אחד (טלגרם או וואטסאפ) כדי לקבל התראות'
    });
    return false;
  }
  
  try {
    console.log(`Sending alert for ${alert.symbol} to ${destinations.length} destinations`);
    
    // שליחת ההתראות ליעדים
    const successCount = await sendAlertToDestinations(alert, destinations);
    
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
    toast.error('שגיאה בשליחת התראה', {
      description: 'אירעה שגיאה בשליחת ההתראה, אנא נסה שנית'
    });
    return false;
  }
};
