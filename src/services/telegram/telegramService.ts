
import { supabase } from '@/integrations/supabase/client';

export interface TelegramResponse {
  ok: boolean;
  result?: any;
  error_code?: number;
  description?: string;
  error?: string;
}

export async function sendTelegramMessage(text: string, html = false): Promise<TelegramResponse> {
  console.log(`📤 Sending Telegram message via Edge Function`);
  console.log(`📝 Message content: ${text.substring(0, 100)}...`);
  
  try {
    const { data, error } = await supabase.functions.invoke('send-telegram-message', {
      body: { text, html }
    });

    if (error) {
      console.error('❌ Edge Function error:', error);
      throw new Error(`EdgeFunctionError: ${error.message}`);
    }

    if (!data.ok) {
      console.error('❌ Telegram API error via Edge Function:', data);
      throw new Error(`TelegramError: ${data.error || 'Unknown error'}`);
    }

    console.log('✅ Telegram message sent successfully via Edge Function');
    return data;
  } catch (error) {
    console.error('❌ Telegram send failed:', error);
    throw error;
  }
}

export async function testTelegramBot(): Promise<boolean> {
  try {
    const response = await sendTelegramMessage('🧪 Bot connection test', false);
    return response.ok;
  } catch (error) {
    console.error('❌ Bot test failed:', error);
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
