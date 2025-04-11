
import { toast } from 'sonner';

// תצורת טלגרם
export interface TelegramConfig {
  botToken: string;
  chatId: string;
}

// פונקציה לשליחת הודעה לטלגרם
export async function sendTelegramMessage(
  config: TelegramConfig,
  message: string
): Promise<boolean> {
  try {
    // Extract token and chat ID
    const { botToken, chatId } = config;
    
    if (!botToken || !chatId) {
      console.error('Missing Telegram credentials (botToken or chatId)');
      return false;
    }
    
    console.log(`Preparing to send Telegram message to chat ${chatId}`);
    
    // In production, we'd use an actual API call. Here's the implementation:
    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
    
    console.log('Sending request to Telegram API:', url);
    
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
    console.log('Telegram API response:', data);
    
    // Check if the request was successful
    if (data.ok) {
      console.log('Telegram message sent successfully');
      return true;
    } else {
      console.error('Telegram API error:', data.description);
      toast.error('שגיאה בשליחת הודעה לטלגרם', {
        description: data.description || 'בדוק את הטוקן וה-Chat ID'
      });
      return false;
    }
  } catch (error) {
    console.error('Error sending Telegram message:', error);
    return false;
  }
}

// פרסור הגדרות טלגרם מפורמט JSON
export function parseTelegramConfig(configString: string): TelegramConfig | null {
  try {
    console.log('Parsing Telegram config string:', configString);
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
    console.log('Testing Telegram connection with config:', { 
      hasToken: !!config.botToken, 
      hasChatId: !!config.chatId 
    });
    
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

// Create a test alert message to verify formatting
export async function sendFormattedTestAlert(config: TelegramConfig): Promise<boolean> {
  try {
    console.log('Sending formatted test alert with config:', { 
      hasToken: !!config.botToken, 
      hasChatId: !!config.chatId 
    });
    
    // Create a test alert with proper formatting
    const testMessage = 
      "🟢 *קנייה: BTC/USD*\n" +
      "💰 מחיר: $42,500.00\n" +
      "📊 טווח זמן: 1d\n" +
      "🔺 *אסטרטגיה:* משולש הקסם - זיהוי נקודות מפנה לפי דפוסי מחיר\n" +
      "📈 אינדיקטורים: RSI, MA Cross\n" +
      "📝 *הודעה:* זוהתה פריצת משולש הקסם כלפי מעלה\n" +
      "🔍 *פרטים:* RSI מעל 60, חציית ממוצעים נעים\n" +
      "📊 [לצפייה בגרף](https://www.tradingview.com/chart/?symbol=BTCUSD)\n" +
      "⏱️ זמן: 11/04/2025 10:30";
    
    return await sendTelegramMessage(config, testMessage);
  } catch (error) {
    console.error('Error sending formatted test alert:', error);
    return false;
  }
}
