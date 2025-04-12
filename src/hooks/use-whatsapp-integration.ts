
import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { TradingViewAlert } from '@/services/tradingView/alerts/types';

// מפתח לשמירת פרטי חיבור בלוקל סטורג'
const WHATSAPP_STORAGE_KEY = 'levi_bot_whatsapp_config';

export interface WhatsAppConfig {
  phoneNumber: string;
  enabled: boolean;
  alertTypes: ('buy' | 'sell' | 'info')[];
  isTestNumber?: boolean;
  lastUpdated?: number;
}

export function useWhatsAppIntegration() {
  const [isLoading, setIsLoading] = useState(false);
  const [config, setConfig] = useState<WhatsAppConfig>(() => {
    const storedConfig = localStorage.getItem(WHATSAPP_STORAGE_KEY);
    if (storedConfig) {
      try {
        return JSON.parse(storedConfig);
      } catch (error) {
        console.error('Error parsing WhatsApp config:', error);
      }
    }
    return {
      phoneNumber: '',
      enabled: false,
      alertTypes: ['buy', 'sell', 'info']
    };
  });

  const saveConfig = useCallback((newConfig: WhatsAppConfig) => {
    const configToSave = {
      ...newConfig,
      lastUpdated: Date.now()
    };
    localStorage.setItem(WHATSAPP_STORAGE_KEY, JSON.stringify(configToSave));
    setConfig(configToSave);
    return true;
  }, []);

  const updateConfig = useCallback((updates: Partial<WhatsAppConfig>) => {
    const updatedConfig = {
      ...config,
      ...updates,
      lastUpdated: Date.now()
    };
    localStorage.setItem(WHATSAPP_STORAGE_KEY, JSON.stringify(updatedConfig));
    setConfig(updatedConfig);
    return true;
  }, [config]);

  const validatePhoneNumber = useCallback((phoneNumber: string) => {
    // בסיסי, ניתן להרחיב
    return phoneNumber.replace(/\D/g, '').length >= 10;
  }, []);

  const testConnection = useCallback(async () => {
    if (!config.phoneNumber || !validatePhoneNumber(config.phoneNumber)) {
      toast.error('מספר הטלפון אינו תקין');
      return false;
    }

    setIsLoading(true);
    try {
      // סימולציה של שליחת הודעה
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success('הודעת בדיקה נשלחה בהצלחה', {
        description: `נשלחה הודעת בדיקה למספר ${config.phoneNumber}`
      });
      
      return true;
    } catch (error) {
      toast.error('שגיאה בשליחת הודעת בדיקה', {
        description: 'נא לוודא שהמספר תקין ושיש חיבור אינטרנט'
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [config.phoneNumber, validatePhoneNumber]);

  const sendAlert = useCallback((alert: TradingViewAlert) => {
    if (!config.enabled || !config.phoneNumber) {
      console.log('WhatsApp alerts are disabled or no phone number configured');
      return false;
    }

    // פורמט ההודעה לוואטסאפ
    const message = formatWhatsAppMessage(alert);
    
    // סימולציה של שליחת הודעה
    console.log(`[WhatsApp] Sending alert to ${config.phoneNumber}:`, message);
    
    return true;
  }, [config]);

  const formatWhatsAppMessage = (alert: TradingViewAlert): string => {
    const actionEmoji = alert.type === 'buy' ? '🟢' : 
                        alert.type === 'sell' ? '🔴' : 'ℹ️';
    
    let message = `*Levi Bot Alert*\n\n`;
    message += `${actionEmoji} *${alert.type.toUpperCase()}* ${alert.symbol}\n`;
    message += `💰 Price: $${alert.price.toLocaleString()}\n`;
    message += `⏰ Timeframe: ${alert.timeframe}\n`;
    
    if (alert.details) {
      message += `\n📝 Details: ${alert.details}\n`;
    }
    
    message += `\n⏱️ ${new Date(alert.timestamp).toLocaleString('he-IL')}`;
    
    return message;
  };

  const toggleEnabled = useCallback(() => {
    const newState = !config.enabled;
    updateConfig({ enabled: newState });
    
    toast[newState ? 'success' : 'info'](
      newState ? 'התראות וואטסאפ הופעלו' : 'התראות וואטסאפ כובו',
      { description: newState ? 'תקבל התראות במספר שהגדרת' : 'לא תקבל יותר התראות בוואטסאפ' }
    );
    
    return newState;
  }, [config.enabled, updateConfig]);

  return {
    config,
    isLoading,
    saveConfig,
    updateConfig,
    testConnection,
    sendAlert,
    validatePhoneNumber,
    toggleEnabled
  };
}

export default useWhatsAppIntegration;
