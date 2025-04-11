
import { toast } from 'sonner';
import { TradingViewAlert, AlertDestination } from './types';
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

// Send alert to destinations
export const sendAlertToDestinations = async (
  alert: TradingViewAlert,
  destinations: AlertDestination[]
): Promise<number> => {
  let successCount = 0;

  // Send to all destinations
  for (const destination of destinations) {
    try {
      if (destination.type === 'telegram' && destination.active) {
        // Send to Telegram
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
      // Future destination types can be added here
    } catch (error) {
      console.error(`Error sending to ${destination.type}:`, error);
    }
  }
  
  return successCount;
};

// Send alert to all active destinations
export const sendAlert = async (alert: TradingViewAlert): Promise<boolean> => {
  if (!isTradingViewConnected()) {
    console.error('Cannot send alert: TradingView is not connected');
    return false;
  }
  
  // Get active destinations
  const destinations = (await import('./destinations')).getAlertDestinations().filter(d => d.active);
  
  if (destinations.length === 0) {
    console.log('No active alert destinations');
    return false;
  }
  
  try {
    // In a real system, we would send the alerts to a server
    console.log(`Sending alert for ${alert.symbol} to ${destinations.length} destinations`);
    
    // Simulate sending alerts
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
    toast.error('שליחת התראה נכשלה', {
      description: 'אירעה שגיאה בשליחת ההתראה, אנא נסה שנית'
    });
    return false;
  }
};
