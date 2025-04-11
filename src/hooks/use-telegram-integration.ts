
import { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { 
  AlertDestination, 
  updateAlertDestination, 
  getAlertDestinations, 
  sendAlert,
  createSampleAlert 
} from '@/services/tradingView/tradingViewAlertService';
import { 
  testTelegramConnection, 
  parseTelegramConfig, 
  sendFormattedTestAlert 
} from '@/services/tradingView/telegramService';

interface TelegramConfig {
  botToken: string;
  chatId: string;
}

export function useTelegramIntegration() {
  const [isConnected, setIsConnected] = useState(false);
  const [config, setConfig] = useState<TelegramConfig | null>(null);
  const [isConfiguring, setIsConfiguring] = useState(false);
  const [lastTestTime, setLastTestTime] = useState<Date | null>(null);
  
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
                hasChatId: !!configData.chatId,
                tokenLength: configData.botToken?.length || 0,
                chatIdLength: configData.chatId?.length || 0
              });
              setConfig(configData);
            } else {
              console.warn('Telegram config does not contain JSON data:', telegramSettings.name);
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
    console.log('Configuring Telegram with:', { 
      botToken: botToken.substring(0, 5) + '...', 
      botTokenLength: botToken.length,
      chatId: chatId.substring(0, 5) + '...',
      chatIdLength: chatId.length
    });
    
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
      setLastTestTime(new Date());
      
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
      setLastTestTime(null);
      
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
        tokenLength: config.botToken?.length || 0,
        hasChatId: !!config.chatId,
        chatIdLength: config.chatId?.length || 0
      });
      
      // יצירת התראת בדיקה
      const sampleAlert = createSampleAlert('info');
      sampleAlert.message = "זוהי הודעת בדיקה מהמערכת לטלגרם";
      sampleAlert.details = "בדיקת חיבור ושליחת הודעות";
      sampleAlert.timestamp = Date.now();
      
      // שליחת התראת בדיקה לטלגרם
      const sent = await sendAlert(sampleAlert);
      
      if (sent) {
        setLastTestTime(new Date());
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
  
  // שליחת הודעת בדיקה מפורמטת
  const sendFormattedTest = useCallback(async () => {
    if (!isConnected || !config) {
      toast.error('טלגרם לא מחובר. אנא חבר תחילה.');
      return false;
    }
    
    try {
      const sent = await sendFormattedTestAlert(config);
      
      if (sent) {
        setLastTestTime(new Date());
        toast.success('הודעת בדיקה מפורמטת נשלחה לטלגרם');
        return true;
      } else {
        toast.error('שליחת הודעה מפורמטת נכשלה');
        return false;
      }
    } catch (error) {
      console.error('Error sending formatted test message:', error);
      toast.error('שגיאה בשליחת הודעה מפורמטת');
      return false;
    }
  }, [isConnected, config]);
  
  return {
    isConnected,
    config,
    isConfiguring,
    lastTestTime,
    configureTelegram,
    disconnectTelegram,
    sendTestMessage,
    sendFormattedTest
  };
}
