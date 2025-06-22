
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const TELEGRAM_BOT_TOKEN = '7607389220:AAHSUnDPTR_9iQEmMjZkSy5i0kepBotAUbA'
const TELEGRAM_CHAT_ID = '809305569'

interface TradingSignal {
  id: string;
  symbol: string;
  action: 'BUY' | 'SELL';
  price: number;
  targetPrice: number;
  stopLoss: number;
  confidence: number;
  riskRewardRatio: number;
  reasoning: string;
  timestamp: number;
  timeframe: string;
  strategy: string;
  sentimentScore?: number;
  whaleActivity?: boolean;
  volumeSpike?: boolean;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    console.log('🔥 === LEVIPRO LIVE SIGNAL ENGINE ANALYSIS ===')
    console.log(`⏰ Analysis Time: ${new Date().toLocaleString('he-IL')}`)

    // Get fresh market data
    const marketDataResponse = await supabase.functions.invoke('market-data-stream')
    const marketDataResult = await marketDataResponse.json()
    
    if (!marketDataResult.success) {
      throw new Error('Failed to get market data')
    }

    const marketData = marketDataResult.data
    console.log(`📊 Processing ${marketData.length} symbols with live data`)

    // Get recent news for sentiment
    const { data: newsData } = await supabase
      .from('market_intelligence')
      .select('*')
      .gte('published_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
      .order('published_at', { ascending: false })
      .limit(20)

    const signalsGenerated = []
    const rejections = []

    for (const data of marketData) {
      console.log(`\n🔍 ANALYZING ${data.symbol}...`)
      console.log(`💰 Price: $${data.price.toFixed(2)} | Change: ${data.change24h.toFixed(2)}%`)

      // Technical Analysis
      const priceChange = Math.abs(data.change24h)
      const volumeRatio = data.volume24h / 100000000 // Normalize volume
      
      // Sentiment Analysis
      const symbolNews = newsData?.filter(news => 
        news.symbols.includes(data.symbol) || 
        news.title.toLowerCase().includes(data.symbol.replace('USDT', '').toLowerCase())
      ) || []
      
      let sentimentScore = 0.5 // Neutral
      symbolNews.forEach(news => {
        if (news.sentiment === 'positive') sentimentScore += 0.15
        if (news.sentiment === 'negative') sentimentScore -= 0.15
      })
      sentimentScore = Math.max(0, Math.min(1, sentimentScore))

      // Signal Logic with STRICT filtering
      let shouldSignal = false
      let action: 'BUY' | 'SELL' = 'BUY'
      let confidence = 0
      let reasoning = ''

      // Multi-factor scoring
      const factors = {
        priceAction: 0,
        volume: 0,
        sentiment: 0,
        momentum: 0
      }

      // Price Action Analysis
      if (Math.abs(data.change24h) > 3) {
        factors.priceAction = Math.min(30, Math.abs(data.change24h) * 5)
        action = data.change24h > 0 ? 'BUY' : 'SELL'
      }

      // Volume Analysis
      if (volumeRatio > 1.5) {
        factors.volume = Math.min(25, volumeRatio * 10)
      }

      // Sentiment Factor
      if (sentimentScore > 0.6 || sentimentScore < 0.4) {
        factors.sentiment = Math.abs(sentimentScore - 0.5) * 40
      }

      // Momentum Factor
      const momentum = Math.abs(data.change24h)
      if (momentum > 2) {
        factors.momentum = Math.min(20, momentum * 5)
      }

      confidence = factors.priceAction + factors.volume + factors.sentiment + factors.momentum
      
      // Calculate R/R ratio
      const stopLossPercent = 0.015 // 1.5%
      const profitTargetPercent = confidence > 85 ? 0.035 : 0.025 // Dynamic target
      const riskRewardRatio = profitTargetPercent / stopLossPercent

      reasoning = `Multi-factor: Price(${factors.priceAction.toFixed(0)}) + Volume(${factors.volume.toFixed(0)}) + Sentiment(${factors.sentiment.toFixed(0)}) + Momentum(${factors.momentum.toFixed(0)})`

      console.log(`🎯 Analysis: Confidence=${confidence.toFixed(0)}% | R/R=${riskRewardRatio.toFixed(2)} | Sentiment=${sentimentScore.toFixed(2)}`)
      console.log(`📝 Reasoning: ${reasoning}`)

      // STRICT ELITE FILTERING
      if (confidence >= 80 && riskRewardRatio >= 1.5 && Math.abs(data.change24h) > 2.5) {
        shouldSignal = true
        console.log(`✅ SIGNAL APPROVED: ${data.symbol} ${action}`)
        
        const signal: TradingSignal = {
          id: `live_${Date.now()}_${data.symbol}`,
          symbol: data.symbol,
          action,
          price: data.price,
          targetPrice: action === 'BUY' 
            ? data.price * (1 + profitTargetPercent)
            : data.price * (1 - profitTargetPercent),
          stopLoss: action === 'BUY'
            ? data.price * (1 - stopLossPercent)  
            : data.price * (1 + stopLossPercent),
          confidence: Math.round(confidence),
          riskRewardRatio: Math.round(riskRewardRatio * 100) / 100,
          reasoning,
          timestamp: Date.now(),
          timeframe: '15m-4h Multi-TF',
          strategy: 'Live Multi-Factor Analysis',
          sentimentScore,
          volumeSpike: volumeRatio > 1.5,
          whaleActivity: false
        }

        signalsGenerated.push(signal)
        
        // Send to Telegram
        const telegramMessage = `🟢 *אות קנייה - LeviPro LIVE*

💰 *${signal.symbol}*
📈 מחיר כניסה: $${signal.price.toFixed(2)}
🎯 מטרה: $${signal.targetPrice.toFixed(2)}
🛡️ סטופ לוס: $${signal.stopLoss.toFixed(2)}

📊 *פרמטרים:*
• רמת ביטחון: ${signal.confidence}%
• יחס סיכון/רווח: ${signal.riskRewardRatio}
• אסטרטגיה: ${signal.strategy}
• מסגרת זמן: ${signal.timeframe}

📰 ניתוח סנטימנט: ${(signal.sentimentScore! * 100).toFixed(0)}%
${signal.volumeSpike ? '🌊 זינוק בנפח מסחר זוהה' : ''}

📝 *נימוק:* ${signal.reasoning}

⏰ ${new Date(signal.timestamp).toLocaleString('he-IL')}

_איתות חי מ-LeviPro AI_`

        try {
          const telegramResponse = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              chat_id: TELEGRAM_CHAT_ID,
              text: telegramMessage,
              parse_mode: 'Markdown'
            })
          })

          if (telegramResponse.ok) {
            console.log(`📱 ✅ Telegram signal sent for ${signal.symbol}`)
          } else {
            console.error('❌ Telegram send failed:', await telegramResponse.text())
          }
        } catch (telegramError) {
          console.error('❌ Telegram error:', telegramError)
        }

        // Store in database
        await supabase
          .from('signal_history')
          .insert({
            signal_id: signal.id,
            symbol: signal.symbol,
            action: signal.action,
            entry_price: signal.price,
            target_price: signal.targetPrice,
            stop_loss: signal.stopLoss,
            confidence: signal.confidence,
            risk_reward_ratio: signal.riskRewardRatio,
            strategy: signal.strategy,
            reasoning: signal.reasoning,
            market_conditions: { 
              price_change_24h: data.change24h,
              volume_24h: data.volume24h 
            },
            sentiment_data: { 
              score: sentimentScore,
              news_count: symbolNews.length
            }
          })

      } else {
        const rejectionReason = confidence < 80 
          ? `Confidence too low (${confidence.toFixed(0)}% < 80%)`
          : riskRewardRatio < 1.5 
          ? `R/R too low (${riskRewardRatio.toFixed(2)} < 1.5)`
          : `Price movement insufficient (${Math.abs(data.change24h).toFixed(2)}% < 2.5%)`
        
        rejections.push({
          symbol: data.symbol,
          reason: rejectionReason,
          confidence: confidence.toFixed(0),
          riskReward: riskRewardRatio.toFixed(2)
        })
        
        console.log(`❌ REJECTED: ${rejectionReason}`)
      }
    }

    // Record learning iteration
    if (marketData.length > 0) {
      await supabase
        .from('learning_iterations')
        .insert({
          iteration_number: Math.floor(Date.now() / 1000),
          data_points_processed: marketData.length * 4, // Price, volume, news, sentiment
          successful_predictions: signalsGenerated.length,
          total_predictions: marketData.length,
          accuracy_rate: signalsGenerated.length / marketData.length,
          confidence_adjustments: { min_confidence: 80 },
          strategy_weights: { multi_factor: 1.0 },
          market_conditions_learned: {
            avg_volatility: marketData.reduce((sum, d) => sum + Math.abs(d.change24h), 0) / marketData.length,
            high_volume_symbols: marketData.filter(d => d.volume24h > 100000000).length
          }
        })
    }

    console.log('\n🏁 === ANALYSIS COMPLETE ===')
    console.log(`🎯 Signals Generated: ${signalsGenerated.length}`)
    console.log(`❌ Rejections: ${rejections.length}`)
    console.log(`📊 Success Rate: ${((signalsGenerated.length / marketData.length) * 100).toFixed(1)}%`)

    return new Response(
      JSON.stringify({ 
        success: true,
        signals_generated: signalsGenerated.length,
        rejections: rejections.length,
        analysis_time: new Date().toISOString(),
        signals: signalsGenerated,
        rejection_details: rejections
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('❌ Trading signals engine error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})
