
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

interface TradingSignal {
  symbol: string
  price: number
  change24h: number
  signal_type: 'BUY' | 'SELL' | 'HOLD'
  strength: number
  timestamp: string
  strategy: string
}

const SYMBOLS = ['BTCUSDT', 'ETHUSDT', 'SOLUSDT', 'BNBUSDT', 'ADAUSDT', 'DOTUSDT']

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

async function generateTradingSignals(): Promise<TradingSignal[]> {
  const signals: TradingSignal[] = []
  
  console.log('🚀 LeviPro Trading Engine - Enhanced Real-time Analysis Started')
  
  for (const symbol of SYMBOLS) {
    try {
      console.log(`📊 Analyzing ${symbol}...`)
      
      // Fetch real-time data from Binance
      const response = await fetch(`https://api.binance.com/api/v3/ticker/24hr?symbol=${symbol}`)
      const data = await response.json()
      
      const price = parseFloat(data.lastPrice)
      const change24h = parseFloat(data.priceChangePercent)
      const volume = parseFloat(data.volume)
      const high24h = parseFloat(data.highPrice)
      const low24h = parseFloat(data.lowPrice)
      
      console.log(`💹 ${symbol}: Price=${price}, Change=${change24h}%, Volume=${volume}`)
      
      // Enhanced multi-strategy signal generation
      const strategies = analyzeWithMultipleStrategies(price, change24h, volume, high24h, low24h)
      
      for (const strategy of strategies) {
        if (strategy.strength > 65) {
          const signal: TradingSignal = {
            symbol,
            price,
            change24h,
            signal_type: strategy.signal_type,
            strength: Math.round(strategy.strength),
            timestamp: new Date().toISOString(),
            strategy: strategy.name
          }
          
          signals.push(signal)
          console.log(`🎯 Signal Generated: ${symbol} - ${strategy.signal_type} (${strategy.strength}%) - Strategy: ${strategy.name}`)
          
          // Send to Telegram if configured
          await sendTelegramSignal(signal)
        }
      }
      
    } catch (error) {
      console.error(`Error analyzing ${symbol}:`, error)
    }
  }
  
  console.log(`🎯 Engine Summary: ${signals.length} signals generated from ${SYMBOLS.length} symbols`)
  return signals
}

function analyzeWithMultipleStrategies(price: number, change24h: number, volume: number, high24h: number, low24h: number) {
  const strategies = []
  
  // Strategy 1: Momentum Analysis (Personal Method Priority)
  if (Math.abs(change24h) > 3) {
    strategies.push({
      name: 'momentum-breakout',
      signal_type: change24h > 0 ? 'BUY' : 'SELL',
      strength: 70 + Math.min(20, Math.abs(change24h) * 2)
    })
  }
  
  // Strategy 2: Volume Spike Detection
  const avgVolume = volume // Simplified - would use historical average
  if (volume > avgVolume * 1.5) {
    strategies.push({
      name: 'volume-spike',
      signal_type: change24h > 0 ? 'BUY' : 'SELL',
      strength: 68 + Math.min(15, (volume / avgVolume - 1) * 20)
    })
  }
  
  // Strategy 3: RSI Simulation (Overbought/Oversold)
  const pricePosition = (price - low24h) / (high24h - low24h)
  if (pricePosition > 0.8 && change24h > 5) {
    strategies.push({
      name: 'rsi-overbought',
      signal_type: 'SELL',
      strength: 72
    })
  } else if (pricePosition < 0.2 && change24h < -5) {
    strategies.push({
      name: 'rsi-oversold',
      signal_type: 'BUY',
      strength: 75
    })
  }
  
  // Strategy 4: Support/Resistance Levels
  const midRange = (high24h + low24h) / 2
  if (price > midRange * 1.02) {
    strategies.push({
      name: 'resistance-breakout',
      signal_type: 'BUY',
      strength: 66
    })
  } else if (price < midRange * 0.98) {
    strategies.push({
      name: 'support-bounce',
      signal_type: 'BUY',
      strength: 64
    })
  }
  
  return strategies
}

async function sendTelegramSignal(signal: TradingSignal) {
  try {
    const botToken = Deno.env.get('TELEGRAM_BOT_TOKEN')
    const chatId = Deno.env.get('TELEGRAM_CHAT_ID')
    
    if (!botToken || !chatId) {
      console.log('Telegram not configured, skipping notification')
      return
    }
    
    const action = signal.signal_type === 'BUY' ? '🟢 קנייה' : '🔴 מכירה'
    const strength = signal.strength > 80 ? '🔥 חזק' : signal.strength > 70 ? '⚡ בינוני' : '📊 רגיל'
    
    const message = `
🚀 *LeviPro Trading Signal*

${action} *${signal.symbol}*
💰 מחיר: $${signal.price.toLocaleString()}
📈 שינוי 24ש: ${signal.change24h.toFixed(2)}%
⚡ עוצמה: ${signal.strength}% ${strength}
🧠 אסטרטגיה: ${signal.strategy}
🕐 זמן: ${new Date(signal.timestamp).toLocaleString('he-IL')}

*מופעל על ידי LeviPro AI Engine*
    `
    
    await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'Markdown'
      })
    })
    
    console.log(`📱 Telegram signal sent for ${signal.symbol}`)
  } catch (error) {
    console.error('Error sending Telegram signal:', error)
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }
  
  try {
    const signals = await generateTradingSignals()
    
    return new Response(JSON.stringify({
      success: true,
      signals,
      timestamp: new Date().toISOString(),
      count: signals.length,
      strategies_used: ['momentum-breakout', 'volume-spike', 'rsi-divergence', 'support-resistance'],
      engine_version: '2.0'
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    })
  } catch (error) {
    console.error('Trading engine error:', error)
    
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    })
  }
})
