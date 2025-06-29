
import { TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID } from '@/config/telegram';

export interface TelegramResponse {
  ok: boolean;
  result?: any;
  error_code?: number;
  description?: string;
}

export async function sendTelegramMessage(text: string, html = false): Promise<TelegramResponse> {
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
  
  console.log(`📤 Sending Telegram message to chat ${TELEGRAM_CHAT_ID}`);
  console.log(`📝 Message content: ${text.substring(0, 100)}...`);
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text,
        parse_mode: html ? 'HTML' : undefined,
        disable_web_page_preview: true
      })
    });

    const data: TelegramResponse = await response.json();

    if (!data.ok) {
      console.error('❌ Telegram API error:', {
        error_code: data.error_code,
        description: data.description,
        response_status: response.status
      });
      throw new Error(`TelegramError: ${data.description || 'Unknown error'}`);
    }

    console.log('✅ Telegram message sent successfully:', {
      message_id: data.result?.message_id,
      chat_id: data.result?.chat?.id,
      date: new Date(data.result?.date * 1000).toISOString()
    });

    return data;
  } catch (error) {
    console.error('❌ Telegram send failed:', error);
    throw error;
  }
}

export async function testTelegramBot(): Promise<boolean> {
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getMe`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.ok) {
      console.log('✅ Bot validated:', {
        username: data.result.username,
        first_name: data.result.first_name,
        id: data.result.id
      });
      return true;
    } else {
      console.error('❌ Bot validation failed:', data);
      return false;
    }
  } catch (error) {
    console.error('❌ Bot validation error:', error);
    return false;
  }
}

export async function sendTestMessage(): Promise<boolean> {
  const testMessage = `
🧪 <b>LeviPro Test Message</b>

✅ מערכת: פעילה
🤖 בוט: מחובר
⏰ זמן: ${new Date().toLocaleString('he-IL')}
📊 מצב: מוכן לאיתותי מסחר

<i>זוהי הודעת בדיקה לאימות החיבור לטלגרם</i>
`;

  try {
    await sendTelegramMessage(testMessage, true);
    return true;
  } catch (error) {
    console.error('❌ Test message failed:', error);
    return false;
  }
}
