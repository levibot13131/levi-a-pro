
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
      toast.error('פרטי החיבור לטלגרם חסרים', {
        description: 'נדרש botToken ו-chatId תקינים'
      });
      return false;
    }
    
    console.log(`Preparing to send Telegram message to chat ${chatId}`);
    console.log(`Message content: ${message}`);
    
    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
    
    console.log('Sending request to Telegram API:', url);
    
    try {
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
      
      // בדיקה אם התגובה היא JSON תקין
      const contentType = response.headers.get('content-type');
      let data;
      
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
        console.log('Telegram API response:', data);
        
        if (data.ok) {
          console.log('✅ Telegram message sent successfully');
          toast.success('הודעת טלגרם נשלחה בהצלחה');
          return true;
        } else {
          console.error('❌ Telegram API error:', data.description);
          toast.error('שגיאה בשליחת הודעה לטלגרם', {
            description: data.description || 'בדוק את הטוקן וה-Chat ID'
          });
          return false;
        }
      } else {
        // בדיקה של קוד התגובה אם התגובה אינה JSON
        if (response.ok) {
          console.log('✅ Telegram message sent successfully (non-JSON response)');
          toast.success('הודעת טלגרם נשלחה בהצלחה');
          return true;
        } else {
          const errorText = await response.text();
          console.error('❌ Telegram API error (non-JSON):', errorText);
          toast.error('שגיאה בשליחת הודעה לטלגרם', {
            description: `שגיאת API: ${response.status} ${response.statusText}`
          });
          return false;
        }
      }
    } catch (error) {
      console.error('❌ Network error sending Telegram message:', error);
      toast.error('שגיאת רשת בשליחת הודעה לטלגרם', {
        description: error instanceof Error ? error.message : 'שגיאת רשת'
      });
      return false;
    }
  } catch (error) {
    console.error('❌ Error sending Telegram message:', error);
    toast.error('שגיאה בשליחת הודעה לטלגרם');
    return false;
  }
}

// פרסור הגדרות טלגרם מפורמט JSON
export function parseTelegramConfig(configString: string): TelegramConfig | null {
  try {
    console.log('Parsing Telegram config string:', configString);
    
    // קלט אפשרי לטיפול
    if (!configString || configString.trim() === '') {
      console.error('Empty Telegram config string');
      return null;
    }
    
    // נסה לפרסר את ה-JSON
    let config: TelegramConfig;
    
    try {
      config = JSON.parse(configString);
    } catch (e) {
      console.error('❌ Failed to parse Telegram config JSON:', e);
      
      // בדוק אם המחרוזת כבר מכילה אובייקט ולא JSON
      if (typeof configString === 'object') {
        config = configString as unknown as TelegramConfig;
      } else {
        return null;
      }
    }
    
    // Validate the config
    if (!config.botToken || !config.chatId) {
      console.error('Invalid Telegram config: missing required fields');
      toast.error('הגדרות טלגרם לא תקינות', {
        description: 'חסרים פרטי botToken או chatId'
      });
      return null;
    }
    
    return config;
  } catch (error) {
    console.error('❌ Error parsing Telegram config:', error);
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
    console.error('❌ Error testing Telegram connection:', error);
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
      "⏱️ זמן: " + new Date().toLocaleString('he-IL');
    
    return await sendTelegramMessage(config, testMessage);
  } catch (error) {
    console.error('❌ Error sending formatted test alert:', error);
    return false;
  }
}
