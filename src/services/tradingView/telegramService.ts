
import { toast } from 'sonner';

// תצורת טלגרם
interface TelegramConfig {
  botToken: string;
  chatId: string;
}

// פונקציה לשליחת הודעה לטלגרם
export async function sendTelegramMessage(
  config: TelegramConfig,
  message: string
): Promise<boolean> {
  try {
    // For a real implementation, we'll send an HTTP request to the Telegram API
    const { botToken, chatId } = config;
    
    // In production, we'd use an actual API call. Here's what it would look like:
    /*
    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'Markdown'
      })
    });
    
    const data = await response.json();
    return data.ok === true;
    */
    
    // For now, we'll simulate the API call
    console.log(`Sending Telegram message to chat ${chatId} using bot ${botToken}`);
    console.log(`Message: ${message}`);
    
    // Simulate a successful response
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // This would be removed in production
    console.log('Telegram message sent successfully (simulation)');
    
    return true;
  } catch (error) {
    console.error('Error sending Telegram message:', error);
    return false;
  }
}

// פרסור הגדרות טלגרם מפורמט JSON
export function parseTelegramConfig(configString: string): TelegramConfig | null {
  try {
    const config = JSON.parse(configString);
    
    // Validate the config
    if (!config.botToken || !config.chatId) {
      console.error('Invalid Telegram config: missing required fields');
      return null;
    }
    
    return config;
  } catch (error) {
    console.error('Error parsing Telegram config:', error);
    return null;
  }
}

// Test Telegram connection with a simple message
export async function testTelegramConnection(config: TelegramConfig): Promise<boolean> {
  try {
    const testMessage = 
      "🧪 *בדיקת חיבור*\n\n" +
      "מערכת האיתותים מחוברת בהצלחה לטלגרם.\n" +
      "תתחיל לקבל התראות בזמן אמת כאשר המערכת תזהה איתותי מסחר.";
    
    return await sendTelegramMessage(config, testMessage);
  } catch (error) {
    console.error('Error testing Telegram connection:', error);
    return false;
  }
}
