
import { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { AlertDestination, updateAlertDestination, getAlertDestinations, sendAlert } from '@/services/tradingView/tradingViewAlertService';
import { testTelegramConnection } from '@/services/tradingView/telegramService';

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
      try {
        console.log('Loading Telegram settings');
        const destinations = getAlertDestinations();
        const telegramSettings = destinations.find(d => d.type === 'telegram');
        
        console.log('Found Telegram settings:', telegramSettings);
        
        if (telegramSettings?.active) {
          setIsConnected(true);
          
          // נשמר מידע נוסף ב-name בפורמט JSON
          try {
            if (telegramSettings.name.includes('{')) {
              const configData = JSON.parse(telegramSettings.name);
              console.log('Parsed Telegram config:', { 
                hasToken: !!configData.botToken, 
                hasChatId: !!configData.chatId 
              });
              setConfig(configData);
            } else {
              console.warn('Telegram config does not contain JSON data');
            }
          } catch (error) {
            console.error('Error parsing telegram config:', error);
          }
        } else {
          console.log('No active Telegram settings found');
        }
      } catch (error) {
        console.error('Error loading Telegram settings:', error);
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
    console.log('Configuring Telegram with:', { botToken: botToken.substring(0, 5) + '...', chatId });
    
    try {
      // Test the connection before saving
      const configTest = { botToken, chatId };
      const testResult = await testTelegramConnection(configTest);
      
      if (!testResult) {
        console.error('Test connection to Telegram failed');
        toast.error('בדיקת החיבור לטלגרם נכשלה', {
          description: 'בדוק את ה-Token וה-Chat ID שלך'
        });
        return false;
      }
      
      // שמירת הגדרות בשם בפורמט JSON
      const configData = { botToken, chatId };
      const configString = JSON.stringify(configData);
      
      console.log('Saving Telegram config');
      
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
      console.log('Disconnecting Telegram');
      
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
      console.log('Sending test message with config:', { 
        hasToken: !!config.botToken, 
        hasChatId: !!config.chatId 
      });
      
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
        console.error('Failed to send test message');
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
