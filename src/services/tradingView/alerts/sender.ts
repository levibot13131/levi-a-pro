
import { toast } from 'sonner';
import { TradingViewAlert, AlertDestination } from './types';
import { getAlertDestinations } from './destinations';
import { isTradingViewConnected } from '../tradingViewAuthService';
import { sendTelegramMessage, parseTelegramConfig } from '../telegramService';

// Format alert message with detailed technical analysis
export const formatAlertMessage = (alert: TradingViewAlert): string => {
  console.log('Formatting alert message:', JSON.stringify(alert, null, 2));
  
  // Choose appropriate emojis based on action and strategy
  const actionEmoji = alert.action === 'buy' ? '🟢' : alert.action === 'sell' ? '🔴' : 'ℹ️';
  const actionText = alert.action === 'buy' ? 'קנייה' : alert.action === 'sell' ? 'מכירה' : 'מידע';
  
  // Get strategy-specific emoji and text
  const strategyInfo = getStrategyInfo(alert);
  
  // Format price with commas and fixed decimal places
  const formattedPrice = typeof alert.price === 'number' 
    ? alert.price.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })
    : String(alert.price);
  
  // Format timestamp
  const dateOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric', 
    month: '2-digit', 
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  };
  
  const formattedDate = new Date(alert.timestamp).toLocaleString('he-IL', dateOptions);
  
  // Build the main message with markdown formatting for Telegram
  let message = `${actionEmoji} *${actionText}: ${alert.symbol}*\n`
    + `💰 מחיר: $${formattedPrice}\n`
    + `📊 טווח זמן: ${alert.timeframe}\n`;
    
  // Add strategy specific information with proper emoji
  if (strategyInfo.text) {
    message += `${strategyInfo.emoji} *אסטרטגיה:* ${strategyInfo.text}\n`;
  }
  
  // Add indicators information
  if (alert.indicators && alert.indicators.length > 0) {
    message += `📈 אינדיקטורים: ${alert.indicators.join(', ')}\n`;
  }
  
  // Add the alert message with formatting if it's not already included
  message += `📝 *הודעה:* ${alert.message}\n`;
  
  // Add details if available (with proper formatting)
  if (alert.details) {
    message += `🔍 *פרטים:* ${alert.details}\n`;
  }
  
  // Add chart URL if available (as markdown link)
  if (alert.chartUrl) {
    message += `📊 [לצפייה בגרף](${alert.chartUrl})\n`;
  }
  
  // Add timestamp in readable format
  message += `⏱️ זמן: ${formattedDate}`;
  
  console.log('Formatted alert message:', message);
  return message;
};

// Get strategy-specific information
const getStrategyInfo = (alert: TradingViewAlert): { emoji: string; text: string } => {
  if (!alert.strategy) {
    return { emoji: '📊', text: '' };
  }
  
  const strategy = alert.strategy.toLowerCase();
  
  if (strategy.includes('wyckoff')) {
    return {
      emoji: '🧠',
      text: 'וייקוף - זיהוי מבני מחיר של צבירה/חלוקה'
    };
  } else if (strategy.includes('magic') || strategy.includes('triangle')) {
    return {
      emoji: '🔺',
      text: 'משולש הקסם - זיהוי נקודות מפנה לפי דפוסי מחיר'
    };
  } else if (strategy.includes('quarters')) {
    return {
      emoji: '🔄',
      text: 'שיטת הרבעים - זיהוי תיקונים ורמות פיבונאצ׳י'
    };
  } else {
    return {
      emoji: '📊',
      text: alert.strategy
    };
  }
};

// Send message to WhatsApp
const sendWhatsAppMessage = async (webhookUrl: string, message: string): Promise<boolean> => {
  try {
    console.log(`📱 Sending WhatsApp message to webhook: ${webhookUrl}`);
    console.log(`📝 Message content: ${message}`);
    
    // Here we would typically send a POST request to the WhatsApp webhook
    // For example using a service like Pipedream or Make.com
    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message,
          timestamp: Date.now()
        })
      });
      
      if (!response.ok) {
        console.error('❌ WhatsApp webhook error:', response.status, response.statusText);
        return false;
      }
      
      const data = await response.json();
      console.log('📊 WhatsApp webhook response:', data);
      
      return true;
    } catch (error) {
      console.error('❌ Error calling WhatsApp webhook:', error);
      return false;
    }
  } catch (error) {
    console.error('❌ Error sending WhatsApp message:', error);
    return false;
  }
};

// Send alert to destinations
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

// Send alert to all active destinations
export const sendAlert = async (alert: TradingViewAlert): Promise<boolean> => {
  // Get active destinations
  const destinations = getAlertDestinations().filter(d => d.active);
  
  if (destinations.length === 0) {
    console.log('❗ No active alert destinations');
    // נשלח התראה למשתמש שאין יעדים פעילים
    toast.warning('אין יעדי התראות פעילים', {
      description: 'הגדר לפחות יעד אחד (טלגרם או וואטסאפ) כדי לקבל התראות'
    });
    return false;
  }
  
  try {
    console.log(`🔔 Sending alert for ${alert.symbol} to ${destinations.length} destinations:`, alert);
    
    // שליחת ההתראות ליעדים
    const successCount = await sendAlertToDestinations(alert, destinations);
    
    if (successCount > 0) {
      toast.success('התראה נשלחה', {
        description: `התראה עבור ${alert.symbol} נשלחה ל-${successCount} יעדים`
      });
      return true;
    } else {
      toast.error('שליחת התראה נכשלה', {
        description: 'אירעה שגיאה בשליחת ההתראה, אנא נסה שנית'
      });
      return false;
    }
  } catch (error) {
    console.error('❌ Error sending alert:', error);
    toast.error('שגיאה בשליחת התראה', {
      description: 'אירעה שגיאה בשליחת ההתראה, אנא נסה שנית'
    });
    return false;
  }
};
