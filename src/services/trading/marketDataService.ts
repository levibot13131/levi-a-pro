
export class MarketDataService {
  private priceCache = new Map<string, { price: number; timestamp: number }>();
  private readonly CACHE_DURATION = 30000; // 30 seconds cache

  public static getInstance() {
    return new MarketDataService();
  }

  public async getCurrentMarketData() {
    try {
      console.log('🔍 Getting LIVE market data from CoinGecko...');
      const btcPrice = await this.getRealTimePrice('BTCUSDT');
      const ethPrice = await this.getRealTimePrice('ETHUSDT');
      
      console.log(`✅ LIVE prices: BTC=$${btcPrice.toFixed(2)}, ETH=$${ethPrice.toFixed(2)}`);
      
      return {
        timestamp: Date.now(),
        btcPrice,
        ethPrice,
        marketSentiment: this.calculateMarketSentiment(btcPrice, ethPrice),
        volatility: 0.15
      };
    } catch (error) {
      console.error('❌ CRITICAL: Cannot get LIVE market data:', error);
      // DO NOT USE FALLBACK DATA - ENFORCE REAL PRICES ONLY
      throw new Error(`LIVE MARKET DATA REQUIRED: ${error.message}`);
    }
  }

  public async getMarketData(symbol: string) {
    try {
      console.log(`🔍 Getting LIVE market data for ${symbol}...`);
      const price = await this.getRealTimePrice(symbol);
      const previousPrice = this.getPreviousPrice(symbol);
      const priceChange = previousPrice ? (price - previousPrice) / previousPrice : 0;
      
      // Use live market data service for volume data
      const liveData = await this.getLiveMarketVolume(symbol);
      
      console.log(`✅ LIVE data for ${symbol}: Price=$${price.toFixed(2)}, Change=${(priceChange*100).toFixed(2)}%`);
      
      return {
        symbol,
        price,
        volume: liveData.volume || 0,
        priceChange,
        timestamp: Date.now(),
        wyckoffPhase: this.analyzeWyckoffPhase(symbol, price),
        rsi: 45 + Math.random() * 20, // TODO: Connect to real RSI calculation
        vwap: price * (0.98 + Math.random() * 0.04) // TODO: Connect to real VWAP
      };
    } catch (error) {
      console.error(`❌ CRITICAL: Failed to get LIVE market data for ${symbol}:`, error);
      // DO NOT USE FALLBACK - ENFORCE REAL DATA ONLY
      throw new Error(`LIVE MARKET DATA REQUIRED for ${symbol}: ${error.message}`);
    }
  }

  private async getLiveMarketVolume(symbol: string): Promise<{ volume: number }> {
    try {
      // Import here to avoid circular dependency
      const { liveMarketDataService } = await import('./liveMarketDataService');
      const liveData = await liveMarketDataService.getMultipleAssets([symbol]);
      const symbolData = liveData.get(symbol);
      
      return {
        volume: symbolData?.volume24h || 0
      };
    } catch (error) {
      console.warn(`⚠️ Could not get live volume for ${symbol}, using 0`);
      return { volume: 0 };
    }
  }

  public async getRealTimePrice(symbol: string): Promise<number> {
    // Check cache first
    const cached = this.priceCache.get(symbol);
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      console.log(`📊 LIVE PRICE (cached): ${symbol} = $${cached.price.toFixed(2)}`);
      return cached.price;
    }

    try {
      const coinGeckoIds: Record<string, string> = {
        'BTCUSDT': 'bitcoin',
        'ETHUSDT': 'ethereum',
        'BNBUSDT': 'binancecoin',
        'SOLUSDT': 'solana',
        'XRPUSDT': 'ripple',
        'ADAUSDT': 'cardano',
        'AVAXUSDT': 'avalanche-2',
        'DOTUSDT': 'polkadot',
        'LINKUSDT': 'chainlink',
        'MATICUSDT': 'matic-network',
        'TRXUSDT': 'tron',
        'LTCUSDT': 'litecoin',
        'BCHUSDT': 'bitcoin-cash',
        'EOSUSDT': 'eos',
        'XLMUSDT': 'stellar',
        'ATOMUSDT': 'cosmos',
        'VETUSDT': 'vechain',
        'FILUSDT': 'filecoin',
        'AAVEUSDT': 'aave',
        'UNIUSDT': 'uniswap'
      };

      const coinId = coinGeckoIds[symbol];
      if (!coinId) {
        console.warn(`⚠️ Unknown symbol ${symbol} - skipping price fetch`);
        return null; // Return null instead of throwing error
      }

      console.log(`🔍 Fetching LIVE PRICE from CoinGecko: ${symbol} (${coinId})`);
      
      const response = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd&include_24hr_change=true`,
        {
          headers: { 'Accept': 'application/json' }
        }
      );

      if (!response.ok) {
        throw new Error(`❌ CoinGecko API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const price = data[coinId]?.usd;

      if (!price || typeof price !== 'number' || price <= 0) {
        throw new Error(`❌ CRITICAL: Invalid price data for ${symbol}: ${price}`);
      }

      // Cache the price
      this.priceCache.set(symbol, { price, timestamp: Date.now() });
      console.log(`✅ LIVE PRICE SUCCESS: ${symbol} = $${price.toFixed(2)} from CoinGecko`);
      return price;

    } catch (error) {
      console.error(`❌ CRITICAL: Failed to fetch LIVE price for ${symbol}:`, error);
      // DO NOT USE FALLBACK - ENFORCE REAL PRICES ONLY
      throw new Error(`LIVE PRICE REQUIRED: Cannot generate signal for ${symbol} without real-time price data. Error: ${error.message}`);
    }
  }

  public async getMultipleMarketData(symbols: string[]) {
    const results = new Map();
    
    console.log(`🔍 Getting LIVE market data for ${symbols.length} symbols: ${symbols.join(', ')}`);
    
    // Fetch all symbols in parallel for better performance
    const dataPromises = symbols.map(symbol => this.getMarketData(symbol));
    const dataResults = await Promise.allSettled(dataPromises);
    
    symbols.forEach((symbol, index) => {
      const result = dataResults[index];
      if (result.status === 'fulfilled') {
        results.set(symbol, result.value);
        console.log(`✅ LIVE data success: ${symbol}`);
      } else {
        console.error(`❌ CRITICAL: Failed to get LIVE data for ${symbol}:`, result.reason);
        // DO NOT USE FALLBACK - SKIP SYMBOLS WITHOUT REAL DATA
        console.log(`🚫 Skipping ${symbol} - real-time data required`);
      }
    });
    
    console.log(`✅ LIVE data retrieved for ${results.size}/${symbols.length} symbols`);
    return results;
  }

  private getPreviousPrice(symbol: string): number | null {
    const cached = this.priceCache.get(symbol);
    return cached ? cached.price : null;
  }

  // FALLBACK FUNCTIONS REMOVED - REAL-TIME DATA ONLY

  private calculateMarketSentiment(btcPrice: number, ethPrice: number): 'bullish' | 'bearish' | 'neutral' {
    // Simple sentiment based on price movement (can be enhanced)
    const btcChange = this.getPriceChange('BTCUSDT', btcPrice);
    const ethChange = this.getPriceChange('ETHUSDT', ethPrice);
    
    const avgChange = (btcChange + ethChange) / 2;
    
    if (avgChange > 0.02) return 'bullish';
    if (avgChange < -0.02) return 'bearish';
    return 'neutral';
  }

  private getPriceChange(symbol: string, currentPrice: number): number {
    const previous = this.getPreviousPrice(symbol);
    return previous ? (currentPrice - previous) / previous : 0;
  }

  private analyzeWyckoffPhase(symbol: string, price: number): string {
    // Mock Wyckoff analysis - in production, this would use technical indicators
    const phases = ['Accumulation', 'Mark-up', 'Distribution', 'Mark-down'];
    return phases[Math.floor(Math.random() * phases.length)];
  }
}

export const marketDataService = MarketDataService.getInstance();
