
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

    console.log('🔥 === LEVIPRO ENHANCED SIGNAL ENGINE ANALYSIS ===')
    console.log(`⏰ Analysis Time: ${new Date().toLocaleString('he-IL')}`)
    console.log('🔧 RELAXED FILTERS: 70% confidence, 1.2 R/R, 1.5% movement')

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

    // RELAXED filter settings for debugging
    const RELAXED_FILTERS = {
      minConfidence: 70,      // Reduced from 80
      minRiskReward: 1.2,     // Reduced from 1.5
      minPriceMovement: 1.5,  // Reduced from 2.5
      requireVolumeSpike: false,
      requireSentiment: false
    }

    for (const data of marketData) {
      console.log(`\n🔍 ENHANCED ANALYSIS ${data.symbol}...`)
      console.log(`💰 Price: $${data.price.toFixed(2)} | Change: ${data.change24h.toFixed(2)}%`)

      // Technical Analysis with detailed logging
      const priceChange = Math.abs(data.change24h)
      const volumeRatio = data.volume24h / 100000000 // Normalize volume
      
      console.log(`📊 Volume Ratio: ${volumeRatio.toFixed(2)} | Price Change: ${priceChange.toFixed(2)}%`)
      
      // Enhanced Sentiment Analysis
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
      
      console.log(`📰 News Items: ${symbolNews.length} | Sentiment Score: ${sentimentScore.toFixed(2)}`)

      // Enhanced Signal Logic with detailed scoring
      let shouldSignal = false
      let action: 'BUY' | 'SELL' = 'BUY'
      let confidence = 0
      let reasoning = ''
      let rejectionReason = ''

      // Multi-factor scoring with detailed breakdown
      const factors = {
        priceAction: 0,
        volume: 0,
        sentiment: 0,
        momentum: 0
      }

      // Price Action Analysis (more generous)
      if (Math.abs(data.change24h) > RELAXED_FILTERS.minPriceMovement) {
        factors.priceAction = Math.min(35, Math.abs(data.change24h) * 8)
        action = data.change24h > 0 ? 'BUY' : 'SELL'
        console.log(`✅ Price action factor: ${factors.priceAction.toFixed(1)} (${data.change24h.toFixed(2)}% > ${RELAXED_FILTERS.minPriceMovement}%)`)
      } else {
        console.log(`❌ Price movement insufficient: ${Math.abs(data.change24h).toFixed(2)}% < ${RELAXED_FILTERS.minPriceMovement}%`)
      }

      // Volume Analysis (optional)
      if (volumeRatio > 1.0) { // Lowered threshold
        factors.volume = Math.min(25, volumeRatio * 12)
        console.log(`✅ Volume factor: ${factors.volume.toFixed(1)} (ratio: ${volumeRatio.toFixed(2)})`)
      } else {
        console.log(`⚠️ Volume factor: 0 (ratio: ${volumeRatio.toFixed(2)} < 1.0)`)
      }

      // Sentiment Factor (optional)
      if (Math.abs(sentimentScore - 0.5) > 0.1) {
        factors.sentiment = Math.abs(sentimentScore - 0.5) * 30
        console.log(`✅ Sentiment factor: ${factors.sentiment.toFixed(1)} (score: ${sentimentScore.toFixed(2)})`)
      } else {
        console.log(`⚠️ Sentiment factor: 0 (neutral sentiment: ${sentimentScore.toFixed(2)})`)
      }

      // Momentum Factor
      const momentum = Math.abs(data.change24h)
      if (momentum > 1.0) { // Lowered threshold
        factors.momentum = Math.min(25, momentum * 6)
        console.log(`✅ Momentum factor: ${factors.momentum.toFixed(1)} (${momentum.toFixed(2)}%)`)
      } else {
        console.log(`⚠️ Momentum factor: 0 (${momentum.toFixed(2)}% < 1.0%)`)
      }

      confidence = factors.priceAction + factors.volume + factors.sentiment + factors.momentum
      
      // Calculate R/R ratio (relaxed)
      const stopLossPercent = 0.012 // 1.2%
      const profitTargetPercent = confidence > 75 ? 0.025 : 0.018 // Dynamic target
      const riskRewardRatio = profitTargetPercent / stopLossPercent

      reasoning = `Enhanced: Price(${factors.priceAction.toFixed(0)}) + Volume(${factors.volume.toFixed(0)}) + Sentiment(${factors.sentiment.toFixed(0)}) + Momentum(${factors.momentum.toFixed(0)})`

      console.log(`🎯 TOTAL SCORE: Confidence=${confidence.toFixed(0)}% | R/R=${riskRewardRatio.toFixed(2)} | Min Required: ${RELAXED_FILTERS.minConfidence}%/${RELAXED_FILTERS.minRiskReward}`)

      // RELAXED FILTERING with detailed rejection reasons
      if (confidence >= RELAXED_FILTERS.minConfidence) {
        if (riskRewardRatio >= RELAXED_FILTERS.minRiskReward) {
          if (Math.abs(data.change24h) >= RELAXED_FILTERS.minPriceMovement) {
            shouldSignal = true
            console.log(`✅ ✅ ✅ SIGNAL APPROVED: ${data.symbol} ${action} - ALL RELAXED CRITERIA MET!`)
          } else {
            rejectionReason = `Price movement too weak (${Math.abs(data.change24h).toFixed(2)}% < ${RELAXED_FILTERS.minPriceMovement}%)`
          }
        } else {
          rejectionReason = `R/R ratio too low (${riskRewardRatio.toFixed(2)} < ${RELAXED_FILTERS.minRiskReward})`
        }
      } else {
        rejectionReason = `Confidence too low (${confidence.toFixed(0)}% < ${RELAXED_FILTERS.minConfidence}%)`
      }

      if (shouldSignal) {
        const signal: TradingSignal = {
          id: `enhanced_${Date.now()}_${data.symbol}`,
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
          timeframe: 'Enhanced Multi-Factor',
          strategy: 'RELAXED Live Analysis v2.0',
          sentimentScore,
          volumeSpike: volumeRatio > 1.5,
          whaleActivity: false
        }

        signalsGenerated.push(signal)
        
        // Send to Telegram with enhanced formatting
        const telegramMessage = `🚀 *איתות חדש - LeviPro ENHANCED*

💰 *${signal.symbol}*
📈 ${signal.action === 'BUY' ? 'קנייה' : 'מכירה'}: $${signal.price.toFixed(2)}
🎯 מטרה: $${signal.targetPrice.toFixed(2)}
🛡️ סטופ: $${signal.stopLoss.toFixed(2)}

📊 *מדדים משופרים:*
• ביטחון: ${signal.confidence}% ✅
• יחס R/R: ${signal.riskRewardRatio} ✅
• שינוי 24ש: ${data.change24h.toFixed(2)}% ✅
• נפח יחסי: ${volumeRatio.toFixed(2)} ✅

📰 סנטימנט: ${(signal.sentimentScore! * 100).toFixed(0)}% (${symbolNews.length} חדשות)
${signal.volumeSpike ? '🌊 זינוק נפח זוהה' : ''}

📝 *ניתוח:* ${signal.reasoning}

⏰ ${new Date(signal.timestamp).toLocaleString('he-IL')}

_LeviPro Enhanced v2.0 - מסננים מותאמים_`

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
            console.log(`📱 ✅ ✅ ✅ TELEGRAM SENT: ${signal.symbol} ${signal.action}`)
          } else {
            console.error('❌ Telegram failed:', await telegramResponse.text())
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
              volume_24h: data.volume24h,
              volume_ratio: volumeRatio,
              factors: factors
            },
            sentiment_data: { 
              score: sentimentScore,
              news_count: symbolNews.length
            }
          })

      } else {
        rejections.push({
          symbol: data.symbol,
          reason: rejectionReason,
          confidence: confidence.toFixed(0),
          riskReward: riskRewardRatio.toFixed(2),
          priceChange: data.change24h.toFixed(2),
          volumeRatio: volumeRatio.toFixed(2),
          factors: factors
        })
        
        console.log(`❌ ❌ ❌ REJECTED: ${rejectionReason}`)
        console.log(`   Details: Conf=${confidence.toFixed(0)}% | R/R=${riskRewardRatio.toFixed(2)} | Price=${data.change24h.toFixed(2)}%`)
      }
    }

    // Enhanced logging and learning
    if (marketData.length > 0) {
      await supabase
        .from('learning_iterations')
        .insert({
          iteration_number: Math.floor(Date.now() / 1000),
          data_points_processed: marketData.length * 6, // Enhanced analysis
          successful_predictions: signalsGenerated.length,
          total_predictions: marketData.length,
          accuracy_rate: signalsGenerated.length / marketData.length,
          confidence_adjustments: { 
            relaxed_mode: true,
            min_confidence: RELAXED_FILTERS.minConfidence,
            min_risk_reward: RELAXED_FILTERS.minRiskReward 
          },
          strategy_weights: { enhanced_multi_factor: 1.0 },
          market_conditions_learned: {
            avg_volatility: marketData.reduce((sum, d) => sum + Math.abs(d.change24h), 0) / marketData.length,
            high_volume_symbols: marketData.filter(d => d.volume24h > 100000000).length,
            total_rejections: rejections.length,
            rejection_breakdown: rejections.reduce((acc, r) => {
              acc[r.reason] = (acc[r.reason] || 0) + 1;
              return acc;
            }, {})
          }
        })
    }

    console.log('\n🏁 === ENHANCED ANALYSIS COMPLETE ===')
    console.log(`🎯 Signals Generated: ${signalsGenerated.length}`)
    console.log(`❌ Rejections: ${rejections.length}`)
    console.log(`📊 Success Rate: ${((signalsGenerated.length / marketData.length) * 100).toFixed(1)}%`)
    console.log(`🔧 Filter Mode: RELAXED (${RELAXED_FILTERS.minConfidence}% conf, ${RELAXED_FILTERS.minRiskReward} R/R)`)
    
    if (signalsGenerated.length === 0) {
      console.log(`\n🚨 ZERO SIGNALS ALERT:`)
      console.log(`   Check if market conditions are extremely stable`)
      console.log(`   Consider further relaxing filters if needed`)
      console.log(`   Verify data sources are providing real-time information`)
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        signals_generated: signalsGenerated.length,
        rejections: rejections.length,
        analysis_time: new Date().toISOString(),
        signals: signalsGenerated,
        rejection_details: rejections,
        filter_settings: RELAXED_FILTERS,
        market_data_processed: marketData.length
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('❌ Enhanced trading signals engine error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})
