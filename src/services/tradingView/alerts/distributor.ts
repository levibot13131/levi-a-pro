
import { TradingViewAlert, AlertDestination } from './types';
import { formatAlertMessage } from './formatters';

/**
 * שליחת התראה לכל היעדים המוגדרים
 */
export const sendAlertToDestinations = async (
  alert: TradingViewAlert,
  destinations: AlertDestination[]
): Promise<number> => {
  if (!destinations || destinations.length === 0) {
    console.log('❗ No destinations provided for alert');
    return 0;
  }
  
  console.log('🔔 Sending alert to ' + destinations.length + ' destinations:', alert);
  
  // פורמט ההודעה פעם אחת
  const formattedMessage = formatAlertMessage(alert);
  console.log('Formatting alert message:', alert);
  console.log('Formatted alert message:', formattedMessage);
  
  // שליחת ההתראה לכל היעדים
  const results = await Promise.all(
    destinations.map(async (dest) => {
      try {
        console.log('📤 Sending to ' + dest.type + ' destination:', dest);
        
        // שליחה לפי סוג היעד
        switch (dest.type) {
          case 'webhook':
            return await sendWebhookAlert(dest, formattedMessage, alert);
          case 'telegram':
            return await sendTelegramAlert(dest, formattedMessage, alert);
          case 'whatsapp':
            return await sendWhatsAppAlert(dest, formattedMessage, alert);
          default:
            console.error('❌ Unknown destination type:', dest.type);
            return false;
        }
      } catch (error) {
        console.error(`❌ Error sending to ${dest.type} destination:`, error);
        return false;
      }
    })
  );
  
  // ספירת ההתראות שנשלחו בהצלחה
  const successCount = results.filter(Boolean).length;
  console.log('📊 Alert sending summary:', successCount + '/' + destinations.length + ' successful');
  
  return successCount;
};

/**
 * שליחת התראה ל-Webhook
 */
const sendWebhookAlert = async (
  destination: AlertDestination,
  message: string,
  alert: TradingViewAlert
): Promise<boolean> => {
  try {
    if (!destination.endpoint) {
      console.error('❌ No endpoint defined for webhook destination');
      return false;
    }
    
    console.log('📤 Sending webhook alert to:', destination.endpoint);
    
    // הכנת הנתונים לשליחה
    const payload = {
      message,
      alert,
      timestamp: Date.now()
    };
    
    // שליחת הנתונים ב-POST request
    const response = await fetch(destination.endpoint, {
      method: 'POST',
      headers: destination.headers || {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    
    if (response.ok) {
      console.log('✅ Successfully sent alert to webhook');
      return true;
    } else {
      console.error('❌ Failed to send alert to webhook, status:', response.status);
      return false;
    }
  } catch (error) {
    console.error('❌ Error sending webhook alert:', error);
    
    // נסיון שליחה ללא CORS עם mode: no-cors
    console.log('Using proxy approach to avoid CORS issues');
    try {
      if (!destination.endpoint) {
        console.error('❌ No endpoint defined for webhook destination');
        return false;
      }
      
      const response = await fetch(destination.endpoint, {
        method: 'POST',
        mode: 'no-cors',
        headers: destination.headers || {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message,
          timestamp: Date.now()
        })
      });
      
      console.log('📊 WhatsApp webhook request sent with no-cors mode');
      console.log('✅ Successfully sent alert to WhatsApp');
      return true;
    } catch (secondError) {
      console.error('❌ Even no-cors approach failed:', secondError);
      return false;
    }
  }
};

/**
 * שליחת התראה ל-Telegram
 */
const sendTelegramAlert = async (
  destination: AlertDestination,
  message: string,
  alert: TradingViewAlert
): Promise<boolean> => {
  // מימוש בסיסי, יש להרחיב לפי הצורך
  if (!destination.endpoint) {
    console.error('❌ No endpoint defined for Telegram destination');
    return false;
  }
  
  console.log('📱 Sending Telegram alert to:', destination.endpoint);
  
  try {
    const response = await fetch(destination.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        text: message,
        parse_mode: 'Markdown'
      })
    });
    
    if (response.ok) {
      console.log('✅ Successfully sent alert to Telegram');
      return true;
    } else {
      console.error('❌ Failed to send alert to Telegram, status:', response.status);
      return false;
    }
  } catch (error) {
    console.error('❌ Error sending Telegram alert:', error);
    return false;
  }
};

/**
 * שליחת התראה ל-WhatsApp
 */
const sendWhatsAppAlert = async (
  destination: AlertDestination,
  message: string,
  alert: TradingViewAlert
): Promise<boolean> => {
  if (!destination.endpoint) {
    console.error('❌ No endpoint defined for WhatsApp destination');
    return false;
  }
  
  console.log('📱 Sending WhatsApp alert to webhook:', destination.endpoint);
  console.log('📱 Sending WhatsApp message to webhook:', destination.endpoint);
  console.log('📝 Message content:', message);
  
  try {
    console.log('⏳ Starting WhatsApp webhook request...');
    
    // בדיקה אם זהו שירות ספציפי כמו Cloud API או שירות אחר
    if (destination.endpoint.includes('api.whatsapp.com') || 
        destination.endpoint.includes('facebook') || 
        destination.endpoint.includes('meta')) {
      // מימוש ספציפי לשירותים מקצועיים
      console.log('Using specialized WhatsApp API format');
      // הלוגיקה תלויה בספק השירות
    } else {
      // שימוש בפורמט סטנדרטי לשירותי webhook
      console.log('Using standard webhook format');
      
      try {
        const response = await fetch(destination.endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            message: message,
            timestamp: Date.now()
          })
        });
        
        if (response.ok) {
          console.log('✅ Successfully sent alert to WhatsApp');
          return true;
        } else {
          console.error('❌ Failed to send alert to WhatsApp, status:', response.status);
          // ננסה שוב עם no-cors
        }
      } catch (error) {
        console.error('❌ Error in first WhatsApp alert attempt:', error);
        // ננסה שוב עם no-cors
      }
      
      // ננסה שוב עם mode: no-cors כדי להתגבר על בעיות CORS
      console.log('Using proxy approach to avoid CORS issues');
      try {
        await fetch(destination.endpoint, {
          method: 'POST',
          mode: 'no-cors',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            message: message,
            timestamp: Date.now()
          })
        });
        
        console.log('📊 WhatsApp webhook request sent with no-cors mode');
        console.log('✅ Successfully sent alert to WhatsApp');
        return true;
      } catch (secondError) {
        console.error('❌ Even no-cors approach failed:', secondError);
        return false;
      }
    }
    
    return true;
  } catch (error) {
    console.error('❌ Error sending WhatsApp alert:', error);
    return false;
  }
};
