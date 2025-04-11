
import { WebhookData } from './types';
import { parseWebhookData, validateWebhookData } from './parser';
import { sendAlert } from '../alerts/sender';
import { toast } from 'sonner';
import { TradingViewAlert } from '../alerts/types';
import { generateSampleWebhookData, simulateWebhookRequest } from './sampleGenerator';

/**
 * Process incoming webhook data from TradingView
 */
export const processWebhookData = async (data: WebhookData): Promise<boolean> => {
  console.log('📥 Processing webhook data:', JSON.stringify(data, null, 2));
  
  try {
    // Validate the webhook data
    if (!validateWebhookData(data)) {
      console.error('❌ Webhook validation failed', {
        symbol: data.symbol,
        hasAction: !!data.action,
        hasSignal: !!data.signal,
        hasPrice: !!data.price || !!data.close
      });
      
      toast.error('הווהבוק לא תקין', {
        description: 'חסרים שדות חובה או נתונים לא תקינים'
      });
      return false;
    }
    
    console.log('✅ Webhook data validated successfully');
    
    // Parse the webhook data into an alert
    const alert = parseWebhookData(data);
    
    if (!alert) {
      console.error('❌ Failed to parse webhook data into alert');
      toast.error('שגיאה בפרסור נתוני הווהבוק', {
        description: 'לא ניתן ליצור התראה מהנתונים שהתקבלו'
      });
      return false;
    }
    
    console.log('🔍 Successfully parsed webhook into alert:', JSON.stringify(alert, null, 2));
    
    // Send the alert
    const success = await sendAlert(alert);
    
    if (success) {
      console.log('✅ Successfully processed webhook data and sent alert');
      toast.success('התראה נשלחה בהצלחה', {
        description: `התראת ${alert.action === 'buy' ? 'קנייה' : alert.action === 'sell' ? 'מכירה' : 'מידע'} נשלחה ליעדים המוגדרים`
      });
    } else {
      console.error('❌ Failed to send alert');
      toast.error('שליחת ההתראה נכשלה', {
        description: 'ייתכן שלא הוגדר יעד להתראות או שאירעה שגיאה'
      });
    }
    
    return success;
  } catch (error) {
    console.error('❌ Error processing webhook data:', error);
    toast.error('שגיאה בעיבוד נתוני Webhook', {
      description: 'אירעה שגיאה בעיבוד נתונים מ-TradingView'
    });
    return false;
  }
};

/**
 * Handle webhook request from TradingView
 */
export const handleTradingViewWebhook = async (req: any): Promise<boolean> => {
  console.log('📥 Received webhook request from TradingView', {
    headers: req.headers,
    hasBody: !!req.body,
    bodyType: typeof req.body
  });
  
  try {
    let data = req.body;
    
    // If the request body is a string, try to parse it as JSON
    if (typeof data === 'string') {
      try {
        console.log('Parsing string webhook data as JSON');
        data = JSON.parse(data);
      } catch (e) {
        console.error('❌ Failed to parse webhook data as JSON:', e);
        toast.error('פורמט הווהבוק לא תקין', {
          description: 'הנתונים שהתקבלו אינם JSON תקין'
        });
        return false;
      }
    }
    
    console.log('📊 Received webhook payload:', JSON.stringify(data, null, 2));
    
    // Process the webhook data
    return await processWebhookData(data);
  } catch (error) {
    console.error('❌ Error handling TradingView webhook:', error);
    toast.error('שגיאה בטיפול בווהבוק', {
      description: 'אירעה שגיאה בלתי צפויה בעת טיפול בווהבוק'
    });
    return false;
  }
};

/**
 * Test the webhook flow with sample data
 */
export const testWebhookFlow = async (type: 'buy' | 'sell' | 'info' = 'info'): Promise<boolean> => {
  console.log(`🧪 Testing webhook flow with ${type} signal...`);
  
  try {
    // Generate sample webhook data
    const sampleData = generateSampleWebhookData(type);
    console.log('📤 Generated sample webhook data:', JSON.stringify(sampleData, null, 2));
    
    // Process the sample data
    const success = await processWebhookData(sampleData);
    
    if (success) {
      console.log('✅ Webhook test successful - alert was processed and sent');
      toast.success(`בדיקת Webhook הצליחה`, {
        description: `הודעת ${type === 'buy' ? 'קנייה' : type === 'sell' ? 'מכירה' : 'מידע'} נשלחה בהצלחה`,
      });
    } else {
      console.error('❌ Webhook test failed - could not process or send alert');
      toast.error(`בדיקת Webhook נכשלה`, {
        description: 'לא הצלחנו לשלוח את ההודעה, בדוק את הלוגים לפרטים נוספים'
      });
    }
    
    return success;
  } catch (error) {
    console.error('❌ Error testing webhook flow:', error);
    toast.error('שגיאה בבדיקת Webhook', {
      description: 'אירעה שגיאה בעת ניסיון לבדוק את מנגנון ה-Webhook'
    });
    return false;
  }
};

/**
 * Simulate a webhook request from TradingView
 */
export const simulateWebhook = async (type: 'buy' | 'sell' | 'info' = 'info'): Promise<boolean> => {
  console.log(`🔄 Simulating ${type} webhook request from TradingView...`);
  
  try {
    // Simulate a webhook request
    const req = simulateWebhookRequest(type);
    console.log('📤 Simulated webhook request:', JSON.stringify(req, null, 2));
    
    // Handle the simulated request
    const success = await handleTradingViewWebhook(req);
    
    if (success) {
      console.log('✅ Webhook simulation successful');
      toast.success(`סימולציית Webhook הצליחה`, {
        description: `הודעת ${type === 'buy' ? 'קנייה' : type === 'sell' ? 'מכירה' : 'מידע'} נשלחה בהצלחה`,
      });
    } else {
      console.error('❌ Webhook simulation failed');
      toast.error(`סימולציית Webhook נכשלה`, {
        description: 'לא הצלחנו לשלוח את ההודעה, בדוק את הלוגים לפרטים נוספים'
      });
    }
    
    return success;
  } catch (error) {
    console.error('❌ Error simulating webhook:', error);
    toast.error('שגיאה בסימולציית Webhook', {
      description: 'אירעה שגיאה בעת ניסיון לסמלץ webhook מ-TradingView'
    });
    return false;
  }
};
