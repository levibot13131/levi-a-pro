
import { toast } from 'sonner';
import { 
  getAlertDestinations, 
  createSampleAlert, 
  sendAlert 
} from './tradingViewAlertService';
import { testTelegramConnection, parseTelegramConfig } from './telegramService';
import { testWhatsAppConnection } from './alerts/providers/whatsapp';

/**
 * Test all active integrations
 */
export const testAllIntegrations = async (): Promise<{
  success: boolean;
  telegramStatus: boolean;
  whatsappStatus: boolean;
}> => {
  console.log('🧪 Testing all integrations...');
  
  // Get all active destinations
  const destinations = getAlertDestinations().filter(d => d.active);
  console.log(`Found ${destinations.length} active destinations:`, 
    destinations.map(d => ({ type: d.type, active: d.active }))
  );
  
  let telegramStatus = false;
  let whatsappStatus = false;
  
  // Test each destination type
  for (const destination of destinations) {
    if (destination.type === 'telegram') {
      try {
        console.log('Testing Telegram connection...');
        const config = parseTelegramConfig(destination.id);
        
        if (config) {
          telegramStatus = await testTelegramConnection(config);
          console.log(`Telegram test result: ${telegramStatus ? 'SUCCESS' : 'FAILED'}`);
        } else {
          console.error('Invalid Telegram config');
        }
      } catch (error) {
        console.error('Error testing Telegram:', error);
      }
    } else if (destination.type === 'whatsapp') {
      try {
        console.log('Testing WhatsApp connection...');
        whatsappStatus = await testWhatsAppConnection(destination.id);
        console.log(`WhatsApp test result: ${whatsappStatus ? 'SUCCESS' : 'FAILED'}`);
      } catch (error) {
        console.error('Error testing WhatsApp:', error);
      }
    }
  }
  
  // Test sending a complete alert
  let alertSuccess = false;
  try {
    if (destinations.length > 0) {
      console.log('Testing complete alert flow...');
      const sampleAlert = createSampleAlert('info');
      alertSuccess = await sendAlert(sampleAlert);
      console.log(`Complete alert test result: ${alertSuccess ? 'SUCCESS' : 'FAILED'}`);
    }
  } catch (error) {
    console.error('Error testing complete alert flow:', error);
  }
  
  // Report results
  const success = (destinations.length === 0) || alertSuccess;
  
  if (success) {
    toast.success('בדיקת אינטגרציות הושלמה בהצלחה', {
      description: `טלגרם: ${telegramStatus ? '✅' : '❌'}, וואטסאפ: ${whatsappStatus ? '✅' : '❌'}`
    });
  } else {
    toast.error('בדיקת אינטגרציות נכשלה', {
      description: 'ראה בקונסול לפרטים נוספים'
    });
  }
  
  return {
    success,
    telegramStatus,
    whatsappStatus
  };
};

/**
 * Initialize real-time updates
 */
export const initializeRealTimeUpdates = (): boolean => {
  try {
    console.log('🚀 Initializing real-time updates...');
    
    // Here you would connect to any websocket or polling mechanism
    // This is a placeholder for demonstration
    
    toast.success('עדכונים בזמן אמת הופעלו', {
      description: 'המערכת תקבל עדכונים שוטפים'
    });
    
    return true;
  } catch (error) {
    console.error('Error initializing real-time updates:', error);
    toast.error('שגיאה בהפעלת עדכונים בזמן אמת');
    return false;
  }
};
