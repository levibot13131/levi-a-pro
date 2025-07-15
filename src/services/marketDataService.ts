import { Asset } from '@/types/asset';
import { MarketData } from '@/types/marketData';

// Fetch trending coins with LIVE prices from CoinGecko
export const fetchTrendingCoins = async (): Promise<Asset[]> => {
  console.log('🔍 Fetching trending coins with LIVE prices...');
  
  try {
    // Import here to avoid circular dependency
    const { getCoinsMarkets } = await import('./crypto/coinGeckoService');
    
    const liveData = await getCoinsMarkets('usd', 10, 1);
    
    if (!liveData || liveData.length === 0) {
      throw new Error('No live data received from CoinGecko');
    }
    
    const assets: Asset[] = liveData.map((coin, index) => ({
      id: coin.id,
      name: coin.name,
      symbol: coin.symbol.toUpperCase(),
      type: 'crypto',
      price: coin.current_price || 0,
      change24h: coin.price_change_percentage_24h || 0,
      marketCap: coin.market_cap || 0,
      volume24h: coin.total_volume || 0,
      rank: coin.market_cap_rank || index + 1
    }));
    
    console.log(`✅ Fetched ${assets.length} trending coins with LIVE prices`);
    return assets;
    
  } catch (error) {
    console.error('❌ Failed to fetch live trending coins:', error);
    // Return empty array instead of mock data
    throw new Error(`Failed to fetch live market data: ${error.message}`);
  }
};

// Fetch market data for specific coins with LIVE prices
export const fetchMarketData = async (coinIds: string[]): Promise<Record<string, MarketData>> => {
  console.log(`🔍 Fetching LIVE market data for coins: ${coinIds.join(', ')}`);
  
  try {
    // Import here to avoid circular dependency  
    const { getSimplePrices } = await import('./crypto/coinGeckoService');
    
    const livePrices = await getSimplePrices(coinIds, ['usd']);
    const result: Record<string, MarketData> = {};
    
    for (const coinId of coinIds) {
      const coinData = livePrices[coinId];
      if (!coinData) {
        console.warn(`⚠️ No live data for ${coinId}`);
        continue;
      }
      
      // Map to standardized format
      result[coinId] = {
        name: coinId.charAt(0).toUpperCase() + coinId.slice(1),
        symbol: coinId === 'bitcoin' ? 'BTC' : coinId === 'ethereum' ? 'ETH' : coinId.toUpperCase(),
        price: coinData.usd || 0,
        marketCap: coinData.usd_market_cap || 0,
        volume24h: coinData.usd_24h_vol || 0,
        change24h: coinData.usd_24h_change || 0,
        lastUpdated: new Date().toISOString(),
        dominance: 0, // Would need separate API call
        volume: coinData.usd_24h_vol || 0,
        priceChange24h: coinData.usd_24h_change || 0,
        priceChangePercentage24h: coinData.usd_24h_change || 0,
        priceChange7d: 0, // Would need historical data
        priceChangePercentage7d: 0 // Would need historical data
      };
    }
    
    console.log(`✅ Fetched LIVE market data for ${Object.keys(result).length} coins`);
    return result;
    
  } catch (error) {
    console.error('❌ Failed to fetch live market data:', error);
    throw new Error(`Failed to fetch live market data: ${error.message}`);
  }
};
