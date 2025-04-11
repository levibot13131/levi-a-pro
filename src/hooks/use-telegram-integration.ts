
import { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { AlertDestination, updateAlertDestination, getAlertDestinations, sendAlert } from '@/services/tradingView/tradingViewAlertService';

interface TelegramConfig {
  botToken: string;
  chatId: string;
}

export function useTelegramIntegration() {
  const [isConnected, setIsConnected] = useState(false);
  const [config, setConfig] = useState<TelegramConfig | null>(null);
  const [isConfiguring, setIsConfiguring] = useState(false);
  
  // טעינת ההגדרות הקיימות
  useEffect(() => {
    const loadSettings = () => {
      const destinations = getAlertDestinations();
      const telegramSettings = destinations.find(d => d.type === 'telegram');
      
      if (telegramSettings?.active) {
        setIsConnected(true);
        
        // נשמר מידע נוסף ב-name בפורמט JSON
        try {
          if (telegramSettings.name.includes('{')) {
            const configData = JSON.parse(telegramSettings.name);
            setConfig(configData);
          }
        } catch (error) {
          console.error('Error parsing telegram config:', error);
        }
      }
    };
    
    loadSettings();
  }, []);
  
  // הגדרת טלגרם
  const configureTelegram = useCallback(async (botToken: string, chatId: string) => {
    if (!botToken || !chatId) {
      toast.error('אנא הזן את כל הפרטים הנדרשים');
      return false;
    }
    
    setIsConfiguring(true);
    
    try {
      // שמירת הגדרות בשם בפורמט JSON
      const configData = { botToken, chatId };
      const configString = JSON.stringify(configData);
      
      // עדכון הגדרות טלגרם
      updateAlertDestination('telegram', {
        name: configString,
        active: true
      });
      
      setIsConnected(true);
      setConfig(configData);
      
      toast.success('הטלגרם חובר בהצלחה', {
        description: 'התראות ישלחו לטלגרם שלך'
      });
      
      return true;
    } catch (error) {
      console.error('Error configuring Telegram:', error);
      toast.error('שגיאה בהגדרת הטלגרם');
      return false;
    } finally {
      setIsConfiguring(false);
    }
  }, []);
  
  // ניתוק טלגרם
  const disconnectTelegram = useCallback(() => {
    try {
      updateAlertDestination('telegram', {
        active: false
      });
      
      setIsConnected(false);
      setConfig(null);
      
      toast.info('הטלגרם נותק');
      
      return true;
    } catch (error) {
      console.error('Error disconnecting Telegram:', error);
      toast.error('שגיאה בניתוק הטלגרם');
      return false;
    }
  }, []);
  
  // שליחת הודעת בדיקה
  const sendTestMessage = useCallback(async () => {
    if (!isConnected || !config) {
      toast.error('טלגרם לא מחובר. אנא חבר תחילה.');
      return false;
    }
    
    try {
      // שליחת התראת בדיקה לטלגרם
      const sent = await sendAlert({
        symbol: "TEST",
        message: "זוהי הודעת בדיקה מהמערכת",
        indicators: ["Test"],
        timeframe: "1d",
        timestamp: Date.now(),
        price: 50000,
        action: 'info',
        details: "בדיקת חיבור לטלגרם"
      });
      
      if (sent) {
        toast.success('הודעת בדיקה נשלחה לטלגרם');
        return true;
      } else {
        toast.error('שליחת הודעת הבדיקה נכשלה');
        return false;
      }
    } catch (error) {
      console.error('Error sending test message:', error);
      toast.error('שגיאה בשליחת הודעת בדיקה');
      return false;
    }
  }, [isConnected, config]);
  
  return {
    isConnected,
    config,
    isConfiguring,
    configureTelegram,
    disconnectTelegram,
    sendTestMessage
  };
}
