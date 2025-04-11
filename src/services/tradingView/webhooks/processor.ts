
import { WebhookData } from './types';
import { parseWebhookData } from './parser';
import { sendAlert } from '../alerts/sender';
import { toast } from 'sonner';
import { TradingViewAlert } from '../alerts/types';

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
