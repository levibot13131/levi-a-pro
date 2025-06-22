
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface MarketData {
  symbol: string;
  price: number;
  change24h: number;
  volume24h: number;
  high24h: number;
  low24h: number;
  timestamp: number;
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

    const symbols = ['BTCUSDT', 'ETHUSDT', 'SOLUSDT', 'BNBUSDT', 'ADAUSDT', 'DOTUSDT']
    const marketData: MarketData[] = []

    console.log('🔍 Fetching live market data from CoinGecko...')

    // Fetch live data from CoinGecko API
    for (const symbol of symbols) {
      try {
        const coinId = symbol.replace('USDT', '').toLowerCase()
        const coinIdMap: Record<string, string> = {
          'btc': 'bitcoin',
          'eth': 'ethereum', 
          'sol': 'solana',
          'bnb': 'binancecoin',
          'ada': 'cardano',
          'dot': 'polkadot'
        }
        
        const actualCoinId = coinIdMap[coinId] || coinId
        
        const response = await fetch(
          `https://api.coingecko.com/api/v3/simple/price?ids=${actualCoinId}&vs_currencies=usd&include_24hr_change=true&include_24hr_vol=true`
        )
        
        if (!response.ok) {
          console.error(`Failed to fetch data for ${symbol}: ${response.status}`)
          continue
        }
        
        const data = await response.json()
        const coinData = data[actualCoinId]
        
        if (coinData) {
          marketData.push({
            symbol,
            price: coinData.usd,
            change24h: coinData.usd_24h_change || 0,
            volume24h: coinData.usd_24h_vol || 0,
            high24h: coinData.usd * 1.02, // Approximate
            low24h: coinData.usd * 0.98,  // Approximate
            timestamp: Date.now()
          })
          
          console.log(`📊 ${symbol}: $${coinData.usd} (${coinData.usd_24h_change?.toFixed(2)}%)`)
        }
        
        // Rate limiting
        await new Promise(resolve => setTimeout(resolve, 200))
        
      } catch (error) {
        console.error(`Error fetching ${symbol}:`, error)
      }
    }

    // Update API status
    await supabase
      .from('api_status')
      .upsert({
        service_name: 'coingecko_api',
        is_active: marketData.length > 0,
        last_health_check: new Date().toISOString(),
        error_count: symbols.length - marketData.length
      })

    console.log(`✅ Live market data updated: ${marketData.length}/${symbols.length} symbols`)

    return new Response(
      JSON.stringify({ 
        success: true, 
        data: marketData,
        timestamp: new Date().toISOString()
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('❌ Market data stream error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})
