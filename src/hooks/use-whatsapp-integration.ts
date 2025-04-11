
import { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { 
  updateAlertDestination, 
  getAlertDestinations, 
  AlertDestination,
  TradingViewAlert,
  sendAlert,
  createSampleAlert
} from '@/services/tradingView/tradingViewAlertService';

export type WhatsAppSettings = {
  isConnected: boolean;
  webhookUrl: string;
  destination?: AlertDestination;
};

export function useWhatsappIntegration() {
  const [settings, setSettings] = useState<WhatsAppSettings>({
    isConnected: false,
    webhookUrl: '',
  });
  const [isConfiguring, setIsConfiguring] = useState(false);
  
  // Load existing WhatsApp settings
  useEffect(() => {
    loadWhatsAppSettings();
  }, []);
  
  // Load WhatsApp configuration from storage
  const loadWhatsAppSettings = useCallback(() => {
    const destinations = getAlertDestinations();
    const whatsappSettings = destinations.find(d => d.type === 'whatsapp');
    
    if (whatsappSettings) {
      setSettings({
        isConnected: whatsappSettings.active,
        webhookUrl: whatsappSettings.name,
        destination: whatsappSettings
      });
    } else {
      setSettings({
        isConnected: false,
        webhookUrl: '',
      });
    }
  }, []);
  
  // Configure WhatsApp integration
  const configureWhatsapp = useCallback(async (url: string): Promise<boolean> => {
    if (!url) {
      toast.error('אנא הזן כתובת Webhook תקינה');
      return false;
    }
    
    setIsConfiguring(true);
    
    try {
      // Update WhatsApp destination
      updateAlertDestination('whatsapp', {
        name: url,
        active: true
      });
      
      // Update local state
      setSettings({
        isConnected: true,
        webhookUrl: url,
        destination: {
          id: '', // Will be updated on the next load
          type: 'whatsapp',
          name: url,
          active: true
        }
      });
      
      toast.success('וואטסאפ חובר בהצלחה', {
        description: 'התראות ישלחו לוואטסאפ שלך'
      });
      
      return true;
    } catch (error) {
      console.error('Error configuring WhatsApp:', error);
      toast.error('שגיאה בהגדרת וואטסאפ');
      return false;
    } finally {
      setIsConfiguring(false);
    }
  }, []);
  
  // Disconnect WhatsApp integration
  const disconnectWhatsapp = useCallback((): boolean => {
    try {
      updateAlertDestination('whatsapp', {
        active: false
      });
      
      setSettings(prevSettings => ({
        ...prevSettings,
        isConnected: false
      }));
      
      toast.info('וואטסאפ נותק');
      return true;
    } catch (error) {
      console.error('Error disconnecting WhatsApp:', error);
      toast.error('שגיאה בניתוק וואטסאפ');
      return false;
    }
  }, []);
  
  // Send test message through WhatsApp
  const sendTestMessage = useCallback(async (): Promise<boolean> => {
    if (!settings.isConnected || !settings.webhookUrl) {
      toast.error('וואטסאפ לא מחובר. אנא חבר תחילה.');
      return false;
    }
    
    try {
      // Create test alert with properly formatted indicators
      const sampleAlert = createSampleAlert('info');
      sampleAlert.message = "זוהי הודעת בדיקה מהמערכת לוואטסאפ";
      sampleAlert.details = "בדיקת חיבור לוואטסאפ";
      
      // Ensure indicators is always an array
      sampleAlert.indicators = Array.isArray(sampleAlert.indicators) 
        ? sampleAlert.indicators 
        : (sampleAlert.indicators ? [sampleAlert.indicators] : []);
      
      const sent = await sendAlert(sampleAlert);
      
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
  }, [settings.isConnected, settings.webhookUrl]);
  
  return {
    isConnected: settings.isConnected,
    webhookUrl: settings.webhookUrl,
    isConfiguring,
    configureWhatsapp,
    disconnectWhatsapp,
    sendTestMessage
  };
}
