
import { toast } from 'sonner';
import { processWebhook, testWebhookSignalFlow, sendTestAlert } from './tradingView/webhooks/processor';
import { getAlertDestinations, updateAlertDestination } from './tradingView/tradingViewAlertService';

// Process an incoming webhook from TradingView
export async function handleTradingViewWebhook(data: any): Promise<boolean> {
  try {
    console.log('Received TradingView webhook:', data);
    return await processWebhook(data);
  } catch (error) {
    console.error('Error handling TradingView webhook:', error);
    toast.error('Error processing webhook from TradingView');
    return false;
  }
}

// Simulate a webhook signal for testing
export async function simulateWebhookSignal(type: 'buy' | 'sell' | 'info'): Promise<boolean> {
  try {
    console.log(`Simulating ${type} webhook signal`);
    toast.info(`Simulating ${type} webhook signal...`);
    return await testWebhookSignalFlow(type);
  } catch (error) {
    console.error('Error simulating webhook signal:', error);
    toast.error('Error simulating webhook signal');
    return false;
  }
}

// Test webhook integration with all configured destinations
export async function testWebhookIntegration(): Promise<boolean> {
  const destinations = getAlertDestinations();
  const activeDestinations = destinations.filter(d => d.active);
  
  if (activeDestinations.length === 0) {
    toast.warning('No active destinations configured for webhooks', {
      description: 'Configure at least one destination to test webhook integration'
    });
    return false;
  }
  
  try {
    console.log('Testing webhook integration with destinations:', 
      activeDestinations.map(d => d.type)
    );
    
    toast.info('Testing webhook integration with all destinations...');
    
    const result = await sendTestAlert();
    
    if (result) {
      toast.success('Webhook test completed successfully');
    } else {
      toast.error('Webhook test failed');
    }
    
    return result;
  } catch (error) {
    console.error('Error testing webhook integration:', error);
    toast.error('Error testing webhook integration');
    return false;
  }
}

// Update webhook settings
export function updateWebhookSettings(enabled: boolean): boolean {
  try {
    // Update 'webhook' destination
    const result = updateAlertDestination('webhook', {
      active: enabled,
      name: 'TradingView Webhook',
    });
    
    if (result) {
      toast.success(
        enabled ? 'Webhook integration enabled' : 'Webhook integration disabled'
      );
    }
    
    return result;
  } catch (error) {
    console.error('Error updating webhook settings:', error);
    toast.error('Error updating webhook settings');
    return false;
  }
}
