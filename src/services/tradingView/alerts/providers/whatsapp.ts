
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
      // Add additional debugging
      console.log('⏳ Starting WhatsApp webhook request...');
      
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
      
      console.log(`📊 WhatsApp webhook response status: ${response.status}`);
      
      if (!response.ok) {
        console.error('❌ WhatsApp webhook error:', response.status, response.statusText);
        toast.error(`שגיאה בשליחת הודעת וואטסאפ (${response.status})`, {
          description: response.statusText || 'בדוק את כתובת ה-webhook'
        });
        return false;
      }
      
      // בדיקה אם התגובה היא JSON תקין
      // אם לא, נחשיב את התגובה כהצלחה אם הסטטוס קוד הוא 200
      let responseData: any;
      try {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          responseData = await response.json();
          console.log('📊 WhatsApp webhook JSON response:', responseData);
        } else {
          // אם התגובה אינה JSON, נחשיב אותה כהצלחה אם הסטטוס תקין
          const textResponse = await response.text();
          console.log('📊 WhatsApp webhook response (text):', textResponse);
          
          // בהנחה שאם הגענו לכאן והסטטוס הוא 200, התגובה היא הצלחה
          toast.success('הודעת וואטסאפ נשלחה', {
            description: 'ההודעה נשלחה לוואטסאפ בהצלחה'
          });
          return true;
        }
      } catch (error) {
        // אם יש שגיאה בפרסור JSON, אבל הסטטוס הוא 200, נחשיב את הבקשה כהצלחה
        console.warn('⚠️ Failed to parse response as JSON, but status is OK:', error);
        
        if (response.ok) {
          toast.success('הודעת וואטסאפ נשלחה', {
            description: 'ההודעה נשלחה לוואטסאפ בהצלחה, אך התגובה לא הייתה בפורמט JSON'
          });
        }
        
        return response.ok;
      }
      
      toast.success('הודעת וואטסאפ נשלחה בהצלחה');
      return true;
    } catch (error) {
      console.error('❌ Error calling WhatsApp webhook:', error);
      toast.error('שגיאה בשליחת הודעה לוואטסאפ', {
        description: error instanceof Error ? error.message : 'שגיאה בלתי ידועה'
      });
      return false;
    }
  } catch (error) {
    console.error('❌ Error sending WhatsApp message:', error);
    toast.error('שגיאה כללית בשליחת הודעה לוואטסאפ');
    return false;
  }
};

/**
 * Test WhatsApp webhook connection
 */
export const testWhatsAppConnection = async (webhookUrl: string): Promise<boolean> => {
  try {
    console.log(`🧪 Testing WhatsApp webhook connection: ${webhookUrl}`);
    
    const testMessage = 
      "🧪 בדיקת חיבור וואטסאפ\n\n" +
      "חיבור למערכת האיתותים הושלם בהצלחה.\n" +
      "הודעה זו נשלחה כדי לוודא שהחיבור פועל כראוי.";
    
    return await sendWhatsAppMessage(webhookUrl, testMessage);
  } catch (error) {
    console.error('❌ Error testing WhatsApp connection:', error);
    return false;
  }
};
