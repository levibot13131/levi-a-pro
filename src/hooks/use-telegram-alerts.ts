
import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { 
  processAndSendAlert, 
  createTradingViewAlert 
} from '@/services/tradingView/tradingViewAlertService';

export const useTelegramAlerts = () => {
  const [sending, setSending] = useState(false);
  const [lastSent, setLastSent] = useState<Date | null>(null);
  
  // Send price alert
  const sendPriceAlert = useCallback(async (
    symbol: string,
    price: number,
    action: 'buy' | 'sell' | 'info',
    message?: string,
    details?: string
  ) => {
    try {
      setSending(true);
      
      // Create alert object
      const alert = createTradingViewAlert({
        symbol,
        price,
        action,
        message: message || `${action.toUpperCase()} Signal for ${symbol} at $${price.toLocaleString()}`,
        timestamp: Date.now(),
        timeframe: '1h',
        type: 'price',
        source: 'binance-realtime',
        details: details || `${action.toUpperCase()} signal generated based on real-time analysis`
      });
      
      // Send the alert
      const success = await processAndSendAlert(alert);
      
      if (success) {
        setLastSent(new Date());
        toast.success('התראה נשלחה', {
          description: `התראת ${action === 'buy' ? 'קנייה' : action === 'sell' ? 'מכירה' : 'מידע'} עבור ${symbol} נשלחה בהצלחה`
        });
        return true;
      } else {
        toast.error('שגיאה בשליחת התראה', {
          description: 'לא ניתן לשלוח את ההתראה. בדוק את הגדרות יעדי ההתראות.'
        });
        return false;
      }
    } catch (error) {
      console.error('Error sending alert:', error);
      toast.error('שגיאה בשליחת התראה');
      return false;
    } finally {
      setSending(false);
    }
  }, []);
  
  // Send technical analysis alert
  const sendTechnicalAlert = useCallback(async (
    symbol: string,
    indicators: string[],
    action: 'buy' | 'sell',
    price: number,
    confidence: number = 0.75
  ) => {
    try {
      setSending(true);
      
      // Create detailed message
      const indicatorsText = indicators.join(', ');
      const message = `${action.toUpperCase()} Signal: ${symbol} at $${price.toLocaleString()}`;
      const details = `Technical analysis based on ${indicatorsText} with ${Math.round(confidence * 100)}% confidence`;
      
      // Create and send alert
      const alert = createTradingViewAlert({
        symbol,
        price,
        action,
        message,
        timestamp: Date.now(),
        timeframe: '1h',
        type: 'custom', // Changed from 'technical' to 'custom' to match allowed values
        indicators,
        details,
        source: 'binance-analysis',
        confidence
      });
      
      const success = await processAndSendAlert(alert);
      
      if (success) {
        setLastSent(new Date());
        toast.success('התראת ניתוח טכני נשלחה', {
          description: `התראת ${action === 'buy' ? 'קנייה' : 'מכירה'} עבור ${symbol} נשלחה בהצלחה`
        });
        return true;
      } else {
        toast.error('שגיאה בשליחת התראת ניתוח טכני');
        return false;
      }
    } catch (error) {
      console.error('Error sending technical alert:', error);
      toast.error('שגיאה בשליחת התראה');
      return false;
    } finally {
      setSending(false);
    }
  }, []);
  
  return {
    sending,
    lastSent,
    sendPriceAlert,
    sendTechnicalAlert
  };
};
