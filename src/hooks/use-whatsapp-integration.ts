
import { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { updateAlertDestination, getAlertDestinations, testAlertDestination } from '@/services/tradingView/tradingViewAlertService';

export function useWhatsappIntegration() {
  const [isConnected, setIsConnected] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState('');
  const [isConfiguring, setIsConfiguring] = useState(false);
  
  // טעינת ההגדרות הקיימות
  useEffect(() => {
    const loadSettings = () => {
      const destinations = getAlertDestinations();
      const whatsappSettings = destinations.find(d => d.type === 'whatsapp');
      
      if (whatsappSettings) {
        setIsConnected(whatsappSettings.enabled);
        setWebhookUrl(whatsappSettings.webhookUrl || '');
      }
    };
    
    loadSettings();
  }, []);
  
  // הגדרת וואטסאפ
  const configureWhatsapp = useCallback(async (url: string) => {
    if (!url) {
      toast.error('אנא הזן כתובת Webhook תקינה');
      return false;
    }
    
    setIsConfiguring(true);
    
    try {
      // עדכון הגדרות וואטסאפ
      const updated = updateAlertDestination('whatsapp', {
        webhookUrl: url,
        enabled: true
      });
      
      if (updated) {
        setIsConnected(true);
        setWebhookUrl(url);
        
        toast.success('וואטסאפ חובר בהצלחה', {
          description: 'התראות ישלחו לוואטסאפ שלך'
        });
        
        return true;
      } else {
        toast.error('שגיאה בעדכון הגדרות וואטסאפ');
        return false;
      }
    } catch (error) {
      console.error('Error configuring WhatsApp:', error);
      toast.error('שגיאה בהגדרת וואטסאפ');
      return false;
    } finally {
      setIsConfiguring(false);
    }
  }, []);
  
  // ניתוק וואטסאפ
  const disconnectWhatsapp = useCallback(() => {
    updateAlertDestination('whatsapp', {
      enabled: false
    });
    
    setIsConnected(false);
    toast.info('וואטסאפ נותק');
    
    return true;
  }, []);
  
  // שליחת הודעת בדיקה
  const sendTestMessage = useCallback(async () => {
    if (!isConnected || !webhookUrl) {
      toast.error('וואטסאפ לא מחובר. אנא חבר תחילה.');
      return false;
    }
    
    try {
      const sent = await testAlertDestination('whatsapp');
      
      if (sent) {
        toast.success('הודעת בדיקה נשלחה לוואטסאפ');
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
  }, [isConnected, webhookUrl]);
  
  return {
    isConnected,
    webhookUrl,
    isConfiguring,
    configureWhatsapp,
    disconnectWhatsapp,
    sendTestMessage
  };
}
