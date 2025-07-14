import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface TelegramRequest {
  text: string;
  html?: boolean;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get secrets from Supabase environment
    const TELEGRAM_BOT_TOKEN = Deno.env.get('TELEGRAM_BOT_TOKEN');
    const TELEGRAM_CHAT_ID = Deno.env.get('TELEGRAM_CHAT_ID');
    
    // Validate and format chat ID properly
    let formattedChatId = TELEGRAM_CHAT_ID;
    if (TELEGRAM_CHAT_ID) {
      formattedChatId = TELEGRAM_CHAT_ID.trim();
      // Ensure numeric chat IDs are properly formatted
      if (/^\d+$/.test(formattedChatId)) {
        // For positive user IDs, keep as is
        formattedChatId = formattedChatId;
      } else if (formattedChatId.startsWith('-')) {
        // For group/channel IDs, keep as is
        formattedChatId = formattedChatId;
      }
    }

    console.log('🔐 Checking Telegram credentials...');
    console.log(`Bot Token exists: ${!!TELEGRAM_BOT_TOKEN}`);
    console.log(`Chat ID exists: ${!!TELEGRAM_CHAT_ID}`);
    
    if (TELEGRAM_BOT_TOKEN) {
      console.log(`Bot Token (first 10 chars): ${TELEGRAM_BOT_TOKEN.substring(0, 10)}...`);
    }
    if (TELEGRAM_CHAT_ID) {
      console.log(`Chat ID: ${TELEGRAM_CHAT_ID}`);
    }

    if (!TELEGRAM_BOT_TOKEN || !formattedChatId) {
      console.error('❌ Missing Telegram credentials in secrets');
      return new Response(
        JSON.stringify({ 
          ok: false, 
          error: 'Telegram credentials not configured',
          details: {
            hasToken: !!TELEGRAM_BOT_TOKEN,
            hasChatId: !!formattedChatId,
            originalChatId: TELEGRAM_CHAT_ID
          }
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Parse request body
    const { text, html = false }: TelegramRequest = await req.json();

    if (!text) {
      return new Response(
        JSON.stringify({ ok: false, error: 'Text is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Send message to Telegram
    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    
    console.log(`📤 Sending Telegram message to chat ${formattedChatId}`);
    console.log(`📝 Message content: ${text.substring(0, 100)}...`);
    console.log(`🔧 Bot token: ${TELEGRAM_BOT_TOKEN.substring(0, 10)}...`);

    const response = await fetch(url, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        chat_id: formattedChatId,
        text,
        parse_mode: html ? 'HTML' : undefined,
        disable_web_page_preview: true
      })
    });

    const data = await response.json();

    if (!data.ok) {
      console.error('❌ Telegram API error:', {
        error_code: data.error_code,
        description: data.description,
        response_status: response.status
      });
      return new Response(
        JSON.stringify({ 
          ok: false, 
          error: `TelegramError: ${data.description || 'Unknown error'}` 
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('✅ Telegram message sent successfully:', {
      message_id: data.result?.message_id,
      chat_id: data.result?.chat?.id,
      date: new Date(data.result?.date * 1000).toISOString()
    });

    return new Response(
      JSON.stringify({ ok: true, result: data.result }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('❌ Telegram send failed:', error);
    return new Response(
      JSON.stringify({ 
        ok: false, 
        error: error.message || 'Unknown error' 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});