
import { TradingViewAlert, AlertDestination } from './types';
import { formatAlertMessage } from './formatters';
import { toast } from 'sonner';

/**
 * Send an alert to multiple destinations
 */
export async function sendAlertToDestinations(
  alert: TradingViewAlert, 
  destinations: AlertDestination | AlertDestination[]
): Promise<number> {
  try {
    // Convert single destination to array if needed
    const destinationArray = Array.isArray(destinations) ? destinations : [destinations];
    
    // Log the number of destinations
    console.log(`Sending alert to ${destinationArray.length} destinations`);
    
    // Track successful deliveries
    let successCount = 0;
    
    // Process each destination
    for (const destination of destinationArray) {
      if (!destination.active) {
        console.log(`Skipping inactive destination: ${destination.name}`);
        continue;
      }
      
      try {
        const message = formatAlertMessage(alert);
        console.log(`Sending to ${destination.type}: ${destination.name}`);
        
        // Different handling based on destination type
        if (destination.type === 'telegram') {
          // Send to Telegram
          const success = await sendToTelegram(message, destination);
          if (success) successCount++;
        } else if (destination.type === 'webhook') {
          // Send to webhook
          const success = await sendToWebhook(alert, message, destination);
          if (success) successCount++;
        } else if (destination.type === 'whatsapp') {
          // Send to WhatsApp
          const success = await sendToWhatsApp(message, destination);
          if (success) successCount++;
        } else if (destination.type === 'email') {
          // Send to email
          const success = await sendToEmail(message, destination);
          if (success) successCount++;
        }
      } catch (error) {
        console.error(`Error sending to ${destination.type} (${destination.name}):`, error);
      }
    }
    
    return successCount;
  } catch (error) {
    console.error('Error in distribution process:', error);
    return 0;
  }
}

// Helper functions for different destination types

/**
 * Send alert to Telegram
 */
async function sendToTelegram(message: string, destination: AlertDestination): Promise<boolean> {
  try {
    // Telegram implementation would go here
    // For now it's a stub that just logs
    console.log(`[TELEGRAM] Would send: ${message}`);
    return true;
  } catch (error) {
    console.error('Error sending to Telegram:', error);
    return false;
  }
}

/**
 * Send alert to webhook
 */
async function sendToWebhook(
  alert: TradingViewAlert, 
  message: string, 
  destination: AlertDestination
): Promise<boolean> {
  try {
    if (!destination.endpoint) {
      console.error('No webhook endpoint specified');
      return false;
    }
    
    // Create payload
    const payload = {
      alert: {
        ...alert,
        formatted_message: message
      }
    };
    
    // Log attempt
    console.log(`[WEBHOOK] Sending to ${destination.endpoint}`);
    
    // In a real implementation, this would make an HTTP request
    // For now, we'll just simulate a successful response
    console.log(`[WEBHOOK] Would send:`, payload);
    
    return true;
  } catch (error) {
    console.error('Error sending to webhook:', error);
    return false;
  }
}

/**
 * Send alert to WhatsApp
 */
async function sendToWhatsApp(message: string, destination: AlertDestination): Promise<boolean> {
  try {
    // WhatsApp implementation would go here
    console.log(`[WHATSAPP] Would send: ${message}`);
    return true;
  } catch (error) {
    console.error('Error sending to WhatsApp:', error);
    return false;
  }
}

/**
 * Send alert to email
 */
async function sendToEmail(message: string, destination: AlertDestination): Promise<boolean> {
  try {
    // Email implementation would go here
    console.log(`[EMAIL] Would send: ${message}`);
    return true;
  } catch (error) {
    console.error('Error sending to email:', error);
    return false;
  }
}
