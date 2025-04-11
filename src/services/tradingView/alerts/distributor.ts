
import { TradingViewAlert, AlertDestination } from './types';
import { formatAlertMessage } from './formatters';
import { sendWhatsAppMessage } from './providers/whatsapp';
import { parseTelegramConfig, sendTelegramMessage } from '../telegramService';
import { toast } from 'sonner';

/**
 * Send alert to all active destinations
 */
export const sendAlertToDestinations = async (
  alert: TradingViewAlert,
  destinations: AlertDestination[]
): Promise<number> => {
  let successCount = 0;
  console.log(`🔔 Sending alert to ${destinations.length} destinations:`, JSON.stringify(alert, null, 2));
  
  const formattedMessage = formatAlertMessage(alert);

  // Send to all destinations
  for (const destination of destinations) {
    try {
      if (destination.active) {
        console.log(`📤 Sending to ${destination.type} destination:`, {
          id: destination.id,
          name: destination.name.substring(0, 20) + '...',
          active: destination.active
        });
        
        if (destination.type === 'telegram') {
          // Send to Telegram
          const config = parseTelegramConfig(destination.name);
          if (config) {
            console.log('📱 Sending Telegram alert with config:', { 
              hasToken: !!config.botToken, 
              hasChatId: !!config.chatId 
            });
            
            const success = await sendTelegramMessage(config, formattedMessage);
            if (success) {
              successCount++;
              
              // Show success notification
              const actionText = alert.action === 'buy' ? 'קנייה' : alert.action === 'sell' ? 'מכירה' : 'מידע';
              toast.success(`התראת ${actionText} נשלחה לטלגרם`, {
                description: `${alert.symbol}: ${alert.message.substring(0, 50)}${alert.message.length > 50 ? '...' : ''}`
              });
              
              console.log('✅ Successfully sent alert to Telegram');
            } else {
              console.error('❌ Failed to send message to Telegram');
            }
          } else {
            console.error('❌ Invalid Telegram config');
          }
        } else if (destination.type === 'whatsapp') {
          // Send to WhatsApp
          const webhookUrl = destination.name;
          console.log(`📱 Sending WhatsApp alert to webhook: ${webhookUrl}`);
          
          const success = await sendWhatsAppMessage(webhookUrl, formattedMessage);
          
          if (success) {
            successCount++;
            
            // Show success notification
            toast.success('התראה נשלחה לוואטסאפ', {
              description: `איתות ${alert.action} עבור ${alert.symbol} נשלח לוואטסאפ שלך`
            });
            
            console.log('✅ Successfully sent alert to WhatsApp');
          } else {
            console.error('❌ Failed to send message to WhatsApp');
          }
        }
        // ניתן להוסיף בעתיד יעדים נוספים כאן (SMS, Email וכו')
      } else {
        console.log(`⏭️ Skipping inactive destination: ${destination.type}`);
      }
    } catch (error) {
      console.error(`❌ Error sending to ${destination.type}:`, error);
    }
  }
  
  console.log(`📊 Alert sending summary: ${successCount}/${destinations.length} successful`);
  return successCount;
};
