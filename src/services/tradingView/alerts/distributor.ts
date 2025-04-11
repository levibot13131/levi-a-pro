
import { TradingViewAlert, AlertDestination } from './types';
import { formatAlertMessage } from './formatters';
import { sendWhatsAppMessage } from './providers/whatsapp';
import { parseTelegramConfig, sendTelegramMessage } from '../telegramService';
import { toast } from 'sonner';

// Maximum retries for sending alerts
const MAX_RETRIES = 2;

/**
 * Send alert to all active destinations
 */
export const sendAlertToDestinations = async (
  alert: TradingViewAlert,
  destinations: AlertDestination[]
): Promise<number> => {
  let successCount = 0;
  console.log(`🔔 Sending alert to ${destinations.length} destinations:`, JSON.stringify(alert, null, 2));
  
  // בדיקה אם יש יעדים פעילים
  const activeDestinations = destinations.filter(d => d.active);
  if (activeDestinations.length === 0) {
    console.log('⚠️ No active destinations found');
    toast.warning('אין יעדי התראות פעילים', {
      description: 'הגדר לפחות יעד אחד פעיל כדי לקבל התראות'
    });
    return 0;
  }
  
  const formattedMessage = formatAlertMessage(alert);
  console.log(`📝 Formatted message: ${formattedMessage.substring(0, 100)}...`);

  // Send to all destinations with retries
  for (const destination of activeDestinations) {
    try {
      let success = false;
      let retries = 0;
      
      console.log(`📤 Sending to ${destination.type} destination:`, {
        id: destination.id,
        name: destination.name.substring(0, 20) + '...',
        active: destination.active
      });
      
      while (!success && retries <= MAX_RETRIES) {
        if (retries > 0) {
          console.log(`Retry attempt ${retries} for ${destination.type}...`);
        }
        
        if (destination.type === 'telegram') {
          // בדיקה מקדימה של תצורת הטלגרם
          const config = parseTelegramConfig(destination.name);
          if (!config) {
            console.error('❌ Invalid Telegram config, skipping destination');
            break;
          }
          
          console.log('📱 Sending Telegram alert with config:', { 
            hasToken: !!config.botToken, 
            hasChatId: !!config.chatId,
            tokenLength: config.botToken.length,
            chatIdLength: config.chatId.length
          });
          
          success = await sendTelegramMessage(config, formattedMessage);
          if (success) {
            successCount++;
            
            // Show success notification
            const actionText = alert.action === 'buy' ? 'קנייה' : alert.action === 'sell' ? 'מכירה' : 'מידע';
            toast.success(`התראת ${actionText} נשלחה לטלגרם`, {
              description: `${alert.symbol}: ${alert.message.substring(0, 50)}${alert.message.length > 50 ? '...' : ''}`
            });
            
            console.log('✅ Successfully sent alert to Telegram');
            break;
          } else {
            console.error('❌ Failed to send message to Telegram, attempt', retries + 1);
          }
        } else if (destination.type === 'whatsapp') {
          // בדיקה מקדימה של כתובת ה-webhook
          if (!destination.name || destination.name.trim() === '') {
            console.error('❌ Empty WhatsApp webhook URL, skipping destination');
            break;
          }
          
          const webhookUrl = destination.name;
          console.log(`📱 Sending WhatsApp alert to webhook: ${webhookUrl}`);
          
          success = await sendWhatsAppMessage(webhookUrl, formattedMessage);
          
          if (success) {
            successCount++;
            
            // Show success notification
            toast.success('התראה נשלחה לוואטסאפ', {
              description: `איתות ${alert.action} עבור ${alert.symbol} נשלח לוואטסאפ שלך`
            });
            
            console.log('✅ Successfully sent alert to WhatsApp');
            break;
          } else {
            console.error('❌ Failed to send message to WhatsApp, attempt', retries + 1);
          }
        }
        
        retries++;
        
        if (!success && retries <= MAX_RETRIES) {
          // Wait a short time before retry
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
      // ניתן להוסיף בעתיד יעדים נוספים כאן (SMS, Email וכו')
    } catch (error) {
      console.error(`❌ Error sending to ${destination.type}:`, error);
    }
  }
  
  console.log(`📊 Alert sending summary: ${successCount}/${activeDestinations.length} successful`);
  return successCount;
};

/**
 * Check if destinations are properly configured
 */
export const checkDestinationsConfiguration = (): { 
  isConfigured: boolean;
  telegram: boolean;
  whatsapp: boolean;
} => {
  try {
    const destinations = destinations.filter(d => d.active);
    
    let telegramConfigured = false;
    let whatsappConfigured = false;
    
    for (const destination of destinations) {
      if (destination.type === 'telegram' && destination.active) {
        const config = parseTelegramConfig(destination.name);
        telegramConfigured = !!config && !!config.botToken && !!config.chatId;
      }
      
      if (destination.type === 'whatsapp' && destination.active) {
        whatsappConfigured = !!destination.name && destination.name.trim() !== '';
      }
    }
    
    return {
      isConfigured: telegramConfigured || whatsappConfigured,
      telegram: telegramConfigured,
      whatsapp: whatsappConfigured
    };
  } catch (error) {
    console.error('Error checking destinations configuration:', error);
    return {
      isConfigured: false,
      telegram: false,
      whatsapp: false
    };
  }
};
