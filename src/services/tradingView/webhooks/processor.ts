
import { toast } from 'sonner';
import { parseWebhookData, webhookDataToAlert } from './parser';
import { processAndSendAlert } from '../tradingViewAlertService';
import { WebhookData } from './types';
import { createTradingViewAlert, TradingViewAlert } from '../alerts/types';

/**
 * Process webhook data from TradingView
 */
export async function processWebhook(data: any): Promise<boolean> {
  try {
    // Parse the webhook data
    const parsedData: WebhookData = parseWebhookData(data);
    console.log('Parsed webhook data:', parsedData);
    
    // Create an alert object
    const alert: TradingViewAlert = webhookDataToAlert(parsedData);
    console.log('Created alert from webhook data:', alert);
    
    // Process and send the alert
    const success = await processAndSendAlert(alert);
    
    if (success) {
      toast.success(`Processed webhook for ${alert.symbol}`, {
        description: `Signal: ${alert.action.toUpperCase()} at $${alert.price}`
      });
    } else {
      toast.error(`Failed to process webhook for ${alert.symbol}`);
    }
    
    return success;
  } catch (error) {
    console.error('Error processing webhook:', error);
    toast.error('Error processing webhook data');
    return false;
  }
}

/**
 * Test the webhook signal flow with sample data
 */
export async function testWebhookSignalFlow(type: 'buy' | 'sell' | 'info'): Promise<boolean> {
  try {
    // Import createSampleAlert directly from tradingViewAlertService
    const { createSampleAlert } = require('../tradingViewAlertService');
    
    // Create a sample alert
    const sampleAlert = createSampleAlert(type);
    console.log('Created sample alert for testing:', sampleAlert);
    
    // Process and send the alert
    const success = await processAndSendAlert(sampleAlert);
    
    return success;
  } catch (error) {
    console.error('Error in webhook signal flow test:', error);
    return false;
  }
}

/**
 * Send a test alert to all configured destinations
 */
export async function sendTestAlert(): Promise<boolean> {
  try {
    // Create a test alert
    const testAlert = createTradingViewAlert({
      symbol: 'TEST/USD',
      message: 'This is a test alert from the system',
      action: 'info',
      timestamp: Date.now(),
      price: 1000,
      timeframe: '1h',
      type: 'custom',
      source: 'system-test',
      details: 'This alert was generated automatically to test the webhook integration.'
    });
    
    console.log('Created test alert:', testAlert);
    
    // Process and send the alert
    const success = await processAndSendAlert(testAlert);
    
    return success;
  } catch (error) {
    console.error('Error sending test alert:', error);
    return false;
  }
}
