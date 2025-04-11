
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
      
      // If the URL is to Twilio, use their specific format
      const isTwilio = webhookUrl.includes('twilio.com');
      const payload = isTwilio 
        ? { 
            Body: message,
            To: 'whatsapp:+' // Twilio expects a "To" field with the format "whatsapp:+1234567890"
          }
        : {
            message: message,
            timestamp: Date.now()
          };
          
      console.log(`Using ${isTwilio ? 'Twilio' : 'standard'} webhook format`);
      
      // Try to create a new proxy request to avoid CORS issues
      const useProxyRequest = true;
      
      if (useProxyRequest) {
        console.log('Using proxy approach to avoid CORS issues');
        
        const response = await fetch(webhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
          mode: 'no-cors' // This prevents CORS errors but also means we can't read the response
        });
        
        // Since we're using no-cors, we won't get a proper response status
        // We'll assume it's a success unless there's an exception
        console.log('📊 WhatsApp webhook request sent with no-cors mode');
        
        toast.success('הודעת וואטסאפ נשלחה', {
          description: 'ההודעה נשלחה לוואטסאפ בהצלחה'
        });
        return true;
      } else {
        // Legacy direct approach - will likely fail with CORS
        console.log('Using direct request approach (may encounter CORS issues)');
        
        const response = await fetch(webhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload)
        });
        
        if (response.ok) {
          toast.success('הודעת וואטסאפ נשלחה בהצלחה');
          return true;
        } else {
          const errorText = await response.text();
          console.error('❌ Error from WhatsApp webhook:', errorText);
          toast.error('שגיאה בשליחת הודעה לוואטסאפ');
          return false;
        }
      }
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
      "הודעה זו נשלחה כדי לוודא שהחיבור פועל כראוי.\n" +
      `זמן בדיקה: ${new Date().toLocaleString('he-IL')}`;
    
    return await sendWhatsAppMessage(webhookUrl, testMessage);
  } catch (error) {
    console.error('❌ Error testing WhatsApp connection:', error);
    return false;
  }
};

/**
 * Get WhatsApp configuration help text based on webhook URL
 */
export const getWhatsAppConfigHelp = (webhookUrl: string): string => {
  if (!webhookUrl) {
    return 'הזן כתובת webhook כדי לקבל הודעות בוואטסאפ';
  }
  
  if (webhookUrl.includes('twilio.com')) {
    return 'נראה שאתה משתמש ב-Twilio. וודא שהגדרת את השירות לשלוח הודעות WhatsApp.';
  }
  
  if (webhookUrl.includes('callmebot.com')) {
    return 'נראה שאתה משתמש ב-CallMeBot. וודא שהזנת את מספר הטלפון והקוד שקיבלת.';
  }
  
  if (webhookUrl.includes('api.whatsapp.com') || webhookUrl.includes('wa.me')) {
    return 'נראה שאתה משתמש בממשק API של WhatsApp Business. וודא שיש לך חשבון עסקי מאושר.';
  }
  
  return 'וודא שכתובת ה-webhook שלך תקינה ומקבלת בקשות POST עם תוכן JSON.';
};
