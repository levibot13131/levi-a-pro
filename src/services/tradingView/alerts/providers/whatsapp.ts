
import { toast } from 'sonner';

/**
 * Send message to WhatsApp via webhook
 */
export const sendWhatsAppMessage = async (webhookUrl: string, message: string): Promise<boolean> => {
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
      
      // בדיקה אם התגובה היא JSON תקין
      // אם לא, נחשיב את התגובה כהצלחה אם הסטטוס קוד הוא 200
      let responseData: any;
      try {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          responseData = await response.json();
        } else {
          // אם התגובה אינה JSON, נחשיב אותה כהצלחה אם הסטטוס תקין
          const textResponse = await response.text();
          console.log('📊 WhatsApp webhook response (text):', textResponse);
          // בהנחה שאם הגענו לכאן והסטטוס הוא 200, התגובה היא הצלחה
          return true;
        }
      } catch (error) {
        // אם יש שגיאה בפרסור JSON, אבל הסטטוס הוא 200, נחשיב את הבקשה כהצלחה
        console.warn('⚠️ Failed to parse response as JSON, but status is OK:', error);
        return response.ok;
      }
      
      console.log('📊 WhatsApp webhook response:', responseData);
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
