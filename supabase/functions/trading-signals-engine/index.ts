
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    console.log('🚀 LeviPro Trading Engine - Real-time Analysis Started');

    const symbols = ['BTCUSDT', 'ETHUSDT', 'SOLUSDT', 'BNBUSDT'];
    const signalsGenerated = [];
    
    for (const symbol of symbols) {
      try {
        console.log(`📊 Analyzing ${symbol}...`);
        
        // Fetch real market data from Binance
        const marketData = await fetchBinanceData(symbol);
        
        if (!marketData) {
          console.log(`❌ No market data for ${symbol}`);
          continue;
        }

        console.log(`💹 ${symbol}: Price=${marketData.price}, Change=${marketData.priceChangePercent}%`);

        // Run comprehensive analysis with all strategies
        const signals = await analyzeWithAllStrategies(symbol, marketData);
        
        for (const signal of signals) {
          try {
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
                user_id: '00000000-0000-0000-0000-000000000000',
                telegram_sent: false,
                metadata: { 
                  source: 'real-time-engine', 
                  timestamp: Date.now(),
                  marketConditions: marketData
                }
              });

            if (error) {
              console.error(`Error saving signal for ${symbol}:`, error);
              continue;
            }

            console.log(`✅ Signal saved: ${signal.action.toUpperCase()} ${symbol} at $${signal.price}`);
            signalsGenerated.push(signal);

            // Send to Telegram immediately
            await sendEnhancedTelegramSignal(signal, symbol, marketData);

          } catch (signalError) {
            console.error(`Error processing signal for ${symbol}:`, signalError);
          }
        }
      } catch (error) {
        console.error(`Error analyzing ${symbol}:`, error);
      }
    }

    const summary = {
      success: true,
      message: 'LeviPro Engine completed successfully',
      timestamp: new Date().toISOString(),
      signalsGenerated: signalsGenerated.length,
      symbolsAnalyzed: symbols.length,
      details: signalsGenerated.map(s => `${s.action} ${s.symbol} @${s.price}`)
    };

    console.log(`🎯 Engine Summary: ${signalsGenerated.length} signals generated from ${symbols.length} symbols`);

    return new Response(JSON.stringify(summary), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200 
    });

  } catch (error) {
    console.error('❌ Trading Engine Error:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        timestamp: new Date().toISOString(),
        status: 'failed'
      }),
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
      symbol,
      price: parseFloat(data.lastPrice),
      volume: parseFloat(data.volume),
      priceChange: parseFloat(data.priceChange),
      priceChangePercent: parseFloat(data.priceChangePercent),
      high: parseFloat(data.highPrice),
      low: parseFloat(data.lowPrice),
      openPrice: parseFloat(data.openPrice),
      count: parseInt(data.count)
    };
  } catch (error) {
    console.error(`Error fetching Binance data for ${symbol}:`, error);
    return null;
  }
}

async function analyzeWithAllStrategies(symbol: string, marketData: any) {
  const signals = [];
  
  // Personal Strategy - Almog's Method
  const personalSignal = analyzePersonalStrategy(symbol, marketData);
  if (personalSignal) signals.push(personalSignal);
  
  // Momentum Strategy
  const momentumSignal = analyzeMomentumStrategy(symbol, marketData);
  if (momentumSignal) signals.push(momentumSignal);
  
  // RSI Strategy
  const rsiSignal = analyzeRSIStrategy(symbol, marketData);
  if (rsiSignal) signals.push(rsiSignal);
  
  // Volume Strategy
  const volumeSignal = analyzeVolumeStrategy(symbol, marketData);
  if (volumeSignal) signals.push(volumeSignal);
  
  return signals;
}

function analyzePersonalStrategy(symbol: string, marketData: any) {
  const priceChangePercent = marketData.priceChangePercent;
  const volumeRatio = marketData.volume / 1000000;
  
  // Personal strategy conditions - strong momentum + volume confirmation
  if (priceChangePercent > 3 && volumeRatio > 1.2) {
    return {
      strategy: 'personal-almog-method',
      action: 'buy',
      price: marketData.price,
      targetPrice: marketData.price * 1.04,
      stopLoss: marketData.price * 0.975,
      confidence: 0.88,
      riskRewardRatio: 2.6,
      reasoning: `🧠 השיטה האישית: מומנטום חזק ${priceChangePercent.toFixed(2)}% + נפח יוצא דופן + פריצת התנגדות`
    };
  }
  
  if (priceChangePercent < -3 && volumeRatio > 1.0) {
    return {
      strategy: 'personal-almog-method',
      action: 'sell',
      price: marketData.price,
      targetPrice: marketData.price * 0.96,
      stopLoss: marketData.price * 1.025,
      confidence: 0.85,
      riskRewardRatio: 2.4,
      reasoning: `🧠 השיטה האישית: מומנטום שלילי ${Math.abs(priceChangePercent).toFixed(2)}% + נפח גבוה + שבירת תמיכה`
    };
  }
  
  return null;
}

function analyzeMomentumStrategy(symbol: string, marketData: any) {
  const priceChangePercent = marketData.priceChangePercent;
  const volumeIncrease = marketData.volume > 800000;
  
  if (priceChangePercent > 2.5 && volumeIncrease) {
    return {
      strategy: 'momentum-breakout',
      action: 'buy',
      price: marketData.price,
      targetPrice: marketData.price * 1.035,
      stopLoss: marketData.price * 0.98,
      confidence: 0.78,
      riskRewardRatio: 1.75,
      reasoning: `📈 Momentum: פריצה חזקה ${priceChangePercent.toFixed(2)}% עם נפח מוגבר`
    };
  }
  
  return null;
}

function analyzeRSIStrategy(symbol: string, marketData: any) {
  // Simulate RSI calculation based on price movement
  const rsi = 50 + (marketData.priceChangePercent * 2);
  
  if (rsi < 35 && marketData.priceChangePercent < -1) {
    return {
      strategy: 'rsi-oversold',
      action: 'buy',
      price: marketData.price,
      targetPrice: marketData.price * 1.03,
      stopLoss: marketData.price * 0.985,
      confidence: 0.72,
      riskRewardRatio: 2.0,
      reasoning: `📊 RSI: אזור מכירת יתר RSI~${rsi.toFixed(0)} - הזדמנות קנייה`
    };
  }
  
  if (rsi > 75 && marketData.priceChangePercent > 1) {
    return {
      strategy: 'rsi-overbought',
      action: 'sell',
      price: marketData.price,
      targetPrice: marketData.price * 0.97,
      stopLoss: marketData.price * 1.015,
      confidence: 0.70,
      riskRewardRatio: 2.0,
      reasoning: `📊 RSI: אזור קניית יתר RSI~${rsi.toFixed(0)} - הזדמנות מכירה`
    };
  }
  
  return null;
}

function analyzeVolumeStrategy(symbol: string, marketData: any) {
  const avgVolume = 500000; // Baseline average
  const volumeSpike = marketData.volume > (avgVolume * 2);
  
  if (volumeSpike && Math.abs(marketData.priceChangePercent) > 1.5) {
    const action = marketData.priceChangePercent > 0 ? 'buy' : 'sell';
    const multiplier = action === 'buy' ? 1.025 : 0.975;
    const stopMultiplier = action === 'buy' ? 0.985 : 1.015;
    
    return {
      strategy: 'volume-spike',
      action,
      price: marketData.price,
      targetPrice: marketData.price * multiplier,
      stopLoss: marketData.price * stopMultiplier,
      confidence: 0.75,
      riskRewardRatio: 1.8,
      reasoning: `📊 Volume: פרץ נפח x${(marketData.volume/avgVolume).toFixed(1)} + תנועת מחיר ${marketData.priceChangePercent.toFixed(2)}%`
    };
  }
  
  return null;
}

async function sendEnhancedTelegramSignal(signal: any, symbol: string, marketData: any) {
  try {
    const botToken = '7639756648:AAG0-DpkgBCwdRFU1J9A9wktbL9DH4LpFdk';
    const chatId = '809305569';
    
    const action = signal.action === 'buy' ? '🟢 קנייה' : '🔴 מכירה';
    const confidenceStars = '⭐'.repeat(Math.ceil(signal.confidence * 5));
    const signalId = `${Date.now().toString().slice(-6)}${Math.random().toString(36).substr(2, 3).toUpperCase()}`;
    
    const message = `
🔥 <b>LeviPro - איתות חי</b> 🔥

${action} <b>${symbol}</b>

🧠 <b>אסטרטגיה:</b> ${signal.strategy}
💡 <b>נימוק:</b> ${signal.reasoning}

📊 <b>נתוני עסקה:</b>
💰 מחיר כניסה: $${signal.price.toFixed(4)}
🎯 יעד רווח: $${signal.targetPrice.toFixed(4)}
🛑 סטופ לוס: $${signal.stopLoss.toFixed(4)}
⚖️ יחס R/R: 1:${signal.riskRewardRatio.toFixed(1)}

📈 <b>נתוני שוק:</b>
📊 שינוי 24 שעות: ${marketData.priceChangePercent.toFixed(2)}%
📦 נפח: ${(marketData.volume/1000000).toFixed(2)}M
🔝 גבוה: $${marketData.high.toFixed(4)}
🔻 נמוך: $${marketData.low.toFixed(4)}

${confidenceStars} <b>ביטחון:</b> ${(signal.confidence * 100).toFixed(0)}%
🕐 <b>זמן:</b> ${new Date().toLocaleString('he-IL')}
🆔 <b>מזהה:</b> ${signalId}

🤖 <b>מערכת אוטומטית - LeviPro Live</b>
#TradingSignal #${symbol} #LeviPro #RealTime
`;

    const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
    
    const response = await fetch(telegramUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'HTML',
        disable_web_page_preview: true
      })
    });

    if (response.ok) {
      console.log(`📱 Enhanced Telegram signal sent: ${symbol}`);
    } else {
      const errorData = await response.json();
      console.error(`❌ Telegram send failed for ${symbol}:`, errorData);
    }
  } catch (error) {
    console.error(`❌ Telegram error for ${symbol}:`, error);
  }
}
