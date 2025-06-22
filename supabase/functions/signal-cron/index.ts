
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

    console.log('⏰ CRON: Triggering automated signal analysis...')

    // Fetch fresh market data
    const marketDataResponse = await supabase.functions.invoke('market-data-stream')
    if (!marketDataResponse.error) {
      console.log('✅ CRON: Market data updated')
    }

    // Fetch fresh news
    const newsResponse = await supabase.functions.invoke('news-aggregator')
    if (!newsResponse.error) {
      console.log('✅ CRON: News data updated')
    }

    // Run signal analysis
    const signalsResponse = await supabase.functions.invoke('trading-signals-engine')
    if (!signalsResponse.error) {
      const result = await signalsResponse.json()
      console.log(`✅ CRON: Signal analysis complete - ${result.signals_generated} signals generated`)
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        timestamp: new Date().toISOString(),
        message: 'Automated analysis completed'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('❌ CRON error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})
