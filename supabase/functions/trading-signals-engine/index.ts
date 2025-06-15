
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    console.log('🚀 Trading Signals Engine started');

    // Define symbols to monitor
    const symbols = ['BTCUSDT', 'ETHUSDT', 'SOLUSDT', 'BNBUSDT'];
    
    for (const symbol of symbols) {
      try {
        // Fetch market data from Binance
        const marketData = await fetchBinanceData(symbol);
        
        if (!marketData) {
          console.log(`❌ No market data for ${symbol}`);
          continue;
        }

        // Run technical analysis
        const signals = await analyzeMarketData(symbol, marketData);
        
        // Process each signal
        for (const signal of signals) {
          // Save to database
          const { data, error } = await supabase
            .from('trading_signals')
            .insert({
              signal_id: `${symbol}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              symbol: symbol,
              strategy: signal.strategy,
              action: signal.action,
              price: signal.price,
              target_price: signal.targetPrice,
              stop_loss: signal.stopLoss,
              confidence: signal.confidence,
              risk_reward_ratio: signal.riskRewardRatio,
              reasoning: signal.reasoning,
              status: 'active',
              user_id: '00000000-0000-0000-0000-000000000000', // System user
              telegram_sent: false,
              metadata: { source: 'automated', timestamp: Date.now() }
            });

          if (error) {
            console.error(`Error saving signal for ${symbol}:`, error);
            continue;
          }

          console.log(`✅ Signal saved for ${symbol}: ${signal.action} at ${signal.price}`);

          // Send to Telegram
          await sendTelegramSignal(signal, symbol);
        }
      } catch (error) {
        console.error(`Error processing ${symbol}:`, error);
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Trading signals engine completed',
        timestamp: new Date().toISOString()
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Trading engine error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});

async function fetchBinanceData(symbol: string) {
  try {
    const response = await fetch(`https://api.binance.com/api/v3/ticker/24hr?symbol=${symbol}`);
    if (!response.ok) return null;
    
    const data = await response.json();
    return {
      price: parseFloat(data.lastPrice),
      volume: parseFloat(data.volume),
      priceChange: parseFloat(data.priceChange),
      priceChangePercent: parseFloat(data.priceChangePercent),
      high: parseFloat(data.highPrice),
      low: parseFloat(data.lowPrice)
    };
  } catch (error) {
    console.error(`Error fetching Binance data for ${symbol}:`, error);
    return null;
  }
}

async function analyzeMarketData(symbol: string, marketData: any) {
  const signals = [];
  
  // Simple RSI-like momentum strategy
  const priceChangePercent = marketData.priceChangePercent;
  const volumeRatio = marketData.volume / 1000000; // Simplified volume analysis
  
  // Buy signal conditions
  if (priceChangePercent > 2 && volumeRatio > 0.5) {
    signals.push({
      strategy: 'momentum-breakout',
      action: 'buy',
      price: marketData.price,
      targetPrice: marketData.price * 1.03, // 3% target
      stopLoss: marketData.price * 0.98, // 2% stop loss
      confidence: 0.75,
      riskRewardRatio: 1.5,
      reasoning: `מומנטום חיובי: מחיר עלה ${priceChangePercent.toFixed(2)}% עם נפח גבוה`
    });
  }
  
  // Sell signal conditions
  if (priceChangePercent < -2 && volumeRatio > 0.5) {
    signals.push({
      strategy: 'momentum-breakdown',
      action: 'sell',
      price: marketData.price,
      targetPrice: marketData.price * 0.97, // 3% target down
      stopLoss: marketData.price * 1.02, // 2% stop loss
      confidence: 0.75,
      riskRewardRatio: 1.5,
      reasoning: `מומנטום שלילי: מחיר ירד ${Math.abs(priceChangePercent).toFixed(2)}% עם נפח גבוה`
    });
  }
  
  return signals;
}

async function sendTelegramSignal(signal: any, symbol: string) {
  try {
    const botToken = '7639756648:AAG0-DpkgBCwdRFU1J9A9wktbL9DH4LpFdk';
    const chatId = '809305569';
    
    const action = signal.action === 'buy' ? '🟢 קנייה' : '🔴 מכירה';
    const message = `
🔔 *LeviPro - איתות מסחר חדש*

${action} *${symbol}*

💰 מחיר נוכחי: $${signal.price.toFixed(4)}
🎯 מחיר יעד: $${signal.targetPrice.toFixed(4)}
🛡️ סטופ לוס: $${signal.stopLoss.toFixed(4)}
📊 רמת ביטחון: ${(signal.confidence * 100).toFixed(0)}%
⚖️ יחס סיכוי/סיכון: 1:${signal.riskRewardRatio}

💡 נימוק: ${signal.reasoning}

📈 אסטרטגיה: ${signal.strategy}
⏰ זמן: ${new Date().toLocaleString('he-IL')}

#LeviPro #${symbol} #TradingSignal
    `;

    const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
    
    const response = await fetch(telegramUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'Markdown'
      })
    });

    if (response.ok) {
      console.log(`📱 Telegram signal sent for ${symbol}`);
    } else {
      console.error(`Failed to send Telegram signal for ${symbol}`);
    }
  } catch (error) {
    console.error(`Error sending Telegram signal for ${symbol}:`, error);
  }
}
