
import { WebhookData } from './types';
import { parseWebhookData } from './parser';
import { sendAlert } from '../alerts/sender';
import { toast } from 'sonner';
import { TradingViewAlert } from '../alerts/types';
import { generateSampleWebhookData, simulateWebhookRequest } from './sampleGenerator';

/**
 * Process incoming webhook data from TradingView
 */
export const processWebhookData = async (data: WebhookData): Promise<boolean> => {
  try {
    console.log('Processing webhook data:', data);
    
    // Parse the webhook data into an alert
    const alert = parseWebhookData(data);
    
    if (!alert) {
      console.error('Failed to parse webhook data into alert');
      return false;
    }
    
    // Send the alert
    const success = await sendAlert(alert);
    
    if (success) {
      console.log('Successfully processed webhook data and sent alert');
    } else {
      console.error('Failed to send alert');
    }
    
    return success;
  } catch (error) {
    console.error('Error processing webhook data:', error);
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
  try {
    let data = req.body;
    
    // If the request body is a string, try to parse it as JSON
    if (typeof data === 'string') {
      try {
        data = JSON.parse(data);
      } catch (e) {
        console.error('Failed to parse webhook data as JSON');
        return false;
      }
    }
    
    console.log('Received webhook from TradingView:', data);
    
    // Process the webhook data
    return await processWebhookData(data);
  } catch (error) {
    console.error('Error handling TradingView webhook:', error);
    return false;
  }
};

/**
 * Test the webhook flow with sample data
 */
export const testWebhookFlow = async (type: 'buy' | 'sell' | 'info' = 'info'): Promise<boolean> => {
  try {
    console.log(`Testing webhook flow with ${type} signal...`);
    
    // Generate sample webhook data
    const sampleData = generateSampleWebhookData(type);
    console.log('Generated sample webhook data:', sampleData);
    
    // Process the sample data
    const success = await processWebhookData(sampleData);
    
    if (success) {
      toast.success(`בדיקת Webhook הצליחה`, {
        description: `הודעת ${type === 'buy' ? 'קנייה' : type === 'sell' ? 'מכירה' : 'מידע'} נשלחה בהצלחה`,
      });
    } else {
      toast.error(`בדיקת Webhook נכשלה`, {
        description: 'לא הצלחנו לשלוח את ההודעה, בדוק את הלוגים לפרטים נוספים'
      });
    }
    
    return success;
  } catch (error) {
    console.error('Error testing webhook flow:', error);
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
  try {
    console.log(`Simulating ${type} webhook request from TradingView...`);
    
    // Simulate a webhook request
    const req = simulateWebhookRequest(type);
    console.log('Simulated webhook request:', req);
    
    // Handle the simulated request
    const success = await handleTradingViewWebhook(req);
    
    if (success) {
      toast.success(`סימולציית Webhook הצליחה`, {
        description: `הודעת ${type === 'buy' ? 'קנייה' : type === 'sell' ? 'מכירה' : 'מידע'} נשלחה בהצלחה`,
      });
    } else {
      toast.error(`סימולציית Webhook נכשלה`, {
        description: 'לא הצלחנו לשלוח את ההודעה, בדוק את הלוגים לפרטים נוספים'
      });
    }
    
    return success;
  } catch (error) {
    console.error('Error simulating webhook:', error);
    toast.error('שגיאה בסימולציית Webhook', {
      description: 'אירעה שגיאה בעת ניסיון לסמלץ webhook מ-TradingView'
    });
    return false;
  }
};
