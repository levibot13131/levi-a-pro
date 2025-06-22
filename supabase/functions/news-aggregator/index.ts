
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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

    console.log('📰 Fetching live crypto news...')

    // Fetch from CoinDesk RSS (free)
    const rssResponse = await fetch('https://www.coindesk.com/arc/outboundfeeds/rss/')
    const rssText = await rssResponse.text()
    
    // Simple RSS parsing
    const items = rssText.match(/<item>[\s\S]*?<\/item>/g) || []
    const newsItems = []

    for (const item of items.slice(0, 10)) {
      const title = item.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/)?.[1] || ''
      const description = item.match(/<description><!\[CDATA\[(.*?)\]\]><\/description>/)?.[1] || ''
      const pubDate = item.match(/<pubDate>(.*?)<\/pubDate>/)?.[1] || ''
      
      if (title) {
        // Simple sentiment analysis based on keywords
        const positiveWords = ['bull', 'surge', 'rise', 'gain', 'positive', 'growth', 'adoption']
        const negativeWords = ['bear', 'crash', 'fall', 'drop', 'negative', 'decline', 'regulatory']
        
        const text = (title + ' ' + description).toLowerCase()
        const hasPositive = positiveWords.some(word => text.includes(word))
        const hasNegative = negativeWords.some(word => text.includes(word))
        
        let sentiment = 'neutral'
        let impact_level = 'low'
        
        if (hasPositive && !hasNegative) {
          sentiment = 'positive'
          impact_level = 'medium'
        } else if (hasNegative && !hasPositive) {
          sentiment = 'negative'
          impact_level = 'medium'
        }
        
        // Detect crypto symbols
        const symbols: string[] = ['BTCUSDT', 'ETHUSDT', 'SOLUSDT', 'BNBUSDT']
          .filter(symbol => {
            const coin = symbol.replace('USDT', '').toLowerCase()
            return text.includes(coin) || text.includes('bitcoin') || text.includes('ethereum')
          })

        newsItems.push({
          source: 'CoinDesk',
          content_type: 'news',
          title,
          content: description.substring(0, 500),
          impact_level,
          sentiment,
          symbols: symbols.length > 0 ? symbols : ['BTCUSDT'],
          published_at: new Date(pubDate).toISOString(),
          metadata: { source_url: 'coindesk' }
        })
      }
    }

    // Insert into database
    if (newsItems.length > 0) {
      const { error } = await supabase
        .from('market_intelligence')
        .upsert(newsItems, { onConflict: 'title' })
      
      if (error) {
        console.error('Error inserting news:', error)
      } else {
        console.log(`✅ Inserted ${newsItems.length} news items`)
      }
    }

    // Update API status
    await supabase
      .from('api_status')
      .upsert({
        service_name: 'news_aggregator',
        is_active: newsItems.length > 0,
        last_health_check: new Date().toISOString(),
        error_count: newsItems.length === 0 ? 1 : 0
      })

    return new Response(
      JSON.stringify({ 
        success: true, 
        news_count: newsItems.length,
        timestamp: new Date().toISOString()
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('❌ News aggregator error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})
