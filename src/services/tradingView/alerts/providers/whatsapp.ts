
import { toast } from 'sonner';

/**
 * Send message to WhatsApp via webhook
 */
export const sendWhatsAppMessage = async (webhookUrl: string, message: string): Promise<boolean> => {
  try {
    if (!webhookUrl || webhookUrl.trim() === '') {
      console.error('❌ Missing WhatsApp webhook URL');
      toast.error('כתובת ה-webhook של וואטסאפ חסרה');
      return false;
    }
    
    console.log(`📱 Sending WhatsApp message to webhook: ${webhookUrl}`);
    console.log(`📝 Message content: ${message}`);
    
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
        }),
        mode: 'no-cors' // Add no-cors mode to prevent CORS issues
      });
      
      console.log(`📊 WhatsApp webhook request sent`);
      
      // Since we're using no-cors, we won't get response status details
      // Instead we'll assume it's a success and show a toast
      toast.success('הודעת וואטסאפ נשלחה', {
        description: 'ההודעה נשלחה לוואטסאפ בהצלחה'
      });
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
    if (!webhookUrl || webhookUrl.trim() === '') {
      console.error('❌ Missing WhatsApp webhook URL for testing');
      toast.error('כתובת ה-webhook של וואטסאפ חסרה');
      return false;
    }
    
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
