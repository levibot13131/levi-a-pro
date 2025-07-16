import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface CoinGeckoResponse {
  id: string;
  symbol: string;
  name: string;
  market_cap_rank: number;
  market_data: {
    current_price: { usd: number };
    market_cap: { usd: number };
    total_volume: { usd: number };
    price_change_percentage_24h: number;
    price_change_percentage_7d: number;
  };
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('🔄 Starting weekly coin list update...');

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Fetch trending and top volume coins from CoinGecko
    const trendingResponse = await fetch('https://api.coingecko.com/api/v3/search/trending');
    const topVolumeResponse = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=volume_desc&per_page=50&page=1');

    if (!trendingResponse.ok || !topVolumeResponse.ok) {
      throw new Error('Failed to fetch market data from CoinGecko');
    }

    const trendingData = await trendingResponse.json();
    const topVolumeData = await topVolumeResponse.json();

    // Extract coin symbols and analyze
    const trendingCoins = trendingData.coins.map((coin: any) => ({
      symbol: `${coin.item.symbol.toUpperCase()}USDT`,
      score: 1.0,
      reason: 'trending'
    }));

    const highVolumeCoins = topVolumeData
      .filter((coin: any) => coin.total_volume > 100000000) // Min $100M volume
      .slice(0, 20)
      .map((coin: any) => ({
        symbol: `${coin.symbol.toUpperCase()}USDT`,
        score: coin.total_volume / 1000000000, // Normalize by billion
        reason: 'high_volume'
      }));

    // Combine and deduplicate
    const allCoins = [...trendingCoins, ...highVolumeCoins];
    const uniqueCoins = new Map();
    
    allCoins.forEach(coin => {
      if (!uniqueCoins.has(coin.symbol) || uniqueCoins.get(coin.symbol).score < coin.score) {
        uniqueCoins.set(coin.symbol, coin);
      }
    });

    // Current coin list (this would be fetched from database in production)
    const currentCoins = [
      'BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'SOLUSDT', 'XRPUSDT',
      'ADAUSDT', 'AVAXUSDT', 'DOTUSDT', 'LINKUSDT', 'MATICUSDT'
    ];

    // Determine additions (top scoring new coins)
    const newCoins = Array.from(uniqueCoins.entries())
      .filter(([symbol]) => !currentCoins.includes(symbol))
      .sort(([, a], [, b]) => b.score - a.score)
      .slice(0, 5)
      .map(([symbol, data]) => ({ symbol, ...data }));

    // Mock removal logic (remove coins with low recent volume)
    const coinsToRemove = currentCoins
      .filter(symbol => !['BTCUSDT', 'ETHUSDT', 'BNBUSDT'].includes(symbol)) // Keep core coins
      .slice(-2); // Remove last 2 for demo

    // Log the update
    const updateData = {
      title: 'Weekly Coin List Update',
      content_type: 'coin_list_update',
      content: `Added ${newCoins.length} trending coins, removed ${coinsToRemove.length} underperforming coins`,
      source: 'weekly_update_function',
      metadata: {
        added: newCoins.map(c => c.symbol),
        removed: coinsToRemove,
        trending_scores: Object.fromEntries(newCoins.map(c => [c.symbol, c.score])),
        update_timestamp: new Date().toISOString(),
        next_update: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      }
    };

    const { error } = await supabase
      .from('market_intelligence')
      .insert(updateData);

    if (error) {
      console.error('Database error:', error);
      throw error;
    }

    console.log(`✅ Weekly update completed: +${newCoins.length} coins, -${coinsToRemove.length} coins`);

    return new Response(JSON.stringify({
      success: true,
      added: newCoins.map(c => c.symbol),
      removed: coinsToRemove,
      summary: `Updated coin list with ${newCoins.length} new trending coins`,
      next_update: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Weekly update error:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});