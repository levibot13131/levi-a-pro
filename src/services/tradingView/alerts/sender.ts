
import { toast } from 'sonner';
import { TradingViewAlert } from './types';
import { getAlertDestinations } from './destinations';
import { isTradingViewConnected } from '../tradingViewAuthService';
import { sendAlertToDestinations } from './distributor';
import { formatAlertMessage } from './formatters';

// Re-export formatAlertMessage for use elsewhere
export { formatAlertMessage } from './formatters';

/**
 * Send alert to all active destinations
 */
export const sendAlert = async (alert: TradingViewAlert): Promise<boolean> => {
  try {
    // בדיקת לוג נוסף לצורך דיבוג
    console.log('🔔 Sending alert for ' + alert.symbol + ' to destinations:', alert);
    
    // Get active destinations
    const destinations = getAlertDestinations().filter(d => d.active);
    
    if (destinations.length === 0) {
      console.log('❗ No active alert destinations');
      // נשלח התראה למשתמש שאין יעדים פעילים
      toast.warning('אין יעדי התראות פעילים', {
        description: 'הגדר לפחות יעד אחד (Webhook) כדי לקבל התראות - לחץ על "הגדרות התראות"'
      });
      return false;
    }
    
    console.log('🔔 Sending alert to ' + destinations.length + ' destinations:', alert);
    
    // שליחת ההתראות ליעדים
    const successCount = await sendAlertToDestinations(alert, destinations);
    
    if (successCount > 0) {
      toast.success('התראה נשלחה', {
        description: `התראה עבור ${alert.symbol} נשלחה ל-${successCount} יעדים`
      });
      return true;
    } else {
      toast.error('שליחת התראה נכשלה', {
        description: 'אירעה שגיאה בשליחת ההתראה, אנא בדוק את היעדים ונסה שנית'
      });
      return false;
    }
  } catch (error) {
    console.error('❌ Error sending alert:', error);
    toast.error('שגיאה בשליחת התראה', {
      description: 'אירעה שגיאה בשליחת ההתראה, אנא נסה שנית'
    });
    return false;
  }
};

// Re-export sendAlertToDestinations for direct access if needed
export { sendAlertToDestinations };
