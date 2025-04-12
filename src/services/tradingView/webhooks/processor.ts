
import { formatMessage } from '../alerts/formatters';
import { processAndSendAlert } from '../tradingViewAlertService';
import { TradingViewAlert, createTradingViewAlert } from '../alerts/types';
import { parseWebhookData, webhookDataToAlert } from './parser';
import { WebhookData } from './types';
import { toast } from 'sonner';

// Process incoming webhook
export async function processWebhook(data: any): Promise<boolean> {
  try {
    // Parse the webhook data
    const parsedData = parseWebhookData(data);
    console.log('Parsed webhook data:', parsedData);
    
    // Convert to alert
    const alert = webhookDataToAlert(parsedData);
    console.log('Created alert:', alert);
    
    // Process the alert
    return await handleAlert(alert, parsedData);
  } catch (error) {
    console.error('Error processing webhook:', error);
    toast.error('Error processing webhook');
    return false;
  }
}

// Handle the alert
async function handleAlert(
  alert: TradingViewAlert,
  webhookData: WebhookData
): Promise<boolean> {
  try {
    // Check if alert should be sent
    if (shouldSendAlert(alert, webhookData)) {
      // Check if it's a Binance order
      if (webhookData.binanceExecute && webhookData.binanceOrderType) {
        return await executeBinanceOrder(webhookData);
      } else {
        // Regular alert
        return await processAndSendAlert(alert);
      }
    }
    
    // Alert shouldn't be sent
    return false;
  } catch (error) {
    console.error('Error handling alert:', error);
    return false;
  }
}

// Determine if alert should be sent
function shouldSendAlert(
  alert: TradingViewAlert,
  webhookData: WebhookData
): boolean {
  // Check for automatic execution flag
  if (webhookData.automatic === false) {
    return false;
  }
  
  // Always send critical alerts
  if (alert.priority === 'high') {
    return true;
  }
  
  // Logic for determining if an alert should be sent based on settings, time of day, etc.
  // For now, send all alerts
  return true;
}

// Execute a Binance order (mock implementation)
async function executeBinanceOrder(webhookData: WebhookData): Promise<boolean> {
  try {
    console.log('Executing Binance order:', webhookData);
    toast.info(`Simulating Binance ${webhookData.binanceOrderType} order for ${webhookData.symbol}`);
    
    // In a real implementation, this would call the Binance API
    
    // Mock success for now
    return true;
  } catch (error) {
    console.error('Error executing Binance order:', error);
    toast.error('Error executing Binance order');
    return false;
  }
}

// Send a test alert
export async function sendTestAlert(symbol: string = 'BTC/USDT'): Promise<boolean> {
  try {
    const alert = createTradingViewAlert({
      symbol,
      message: `Test alert for ${symbol}`,
      type: 'custom',
      action: 'info',
      timeframe: '1h',
      timestamp: Date.now(),
      price: 45000, // Just a sample price
      source: 'test',
      priority: 'low'
    });
    
    return await processAndSendAlert(alert);
  } catch (error) {
    console.error('Error sending test alert:', error);
    return false;
  }
}
