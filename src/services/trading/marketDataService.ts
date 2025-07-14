
export class MarketDataService {
  private priceCache = new Map<string, { price: number; timestamp: number }>();
  private readonly CACHE_DURATION = 30000; // 30 seconds cache

  public static getInstance() {
    return new MarketDataService();
  }

  public async getCurrentMarketData() {
    try {
      const btcPrice = await this.getRealTimePrice('BTCUSDT');
      const ethPrice = await this.getRealTimePrice('ETHUSDT');
      
      return {
        timestamp: Date.now(),
        btcPrice,
        ethPrice,
        marketSentiment: this.calculateMarketSentiment(btcPrice, ethPrice),
        volatility: 0.15
      };
    } catch (error) {
      console.error('Failed to get current market data:', error);
      return {
        timestamp: Date.now(),
        btcPrice: 67500,
        ethPrice: 3520,
        marketSentiment: 'neutral',
        volatility: 0.15
      };
    }
  }

  public async getMarketData(symbol: string) {
    try {
      const price = await this.getRealTimePrice(symbol);
      const previousPrice = this.getPreviousPrice(symbol);
      const priceChange = previousPrice ? (price - previousPrice) / previousPrice : 0;
      
      return {
        symbol,
        price,
        volume: Math.random() * 1000000, // Mock volume for now
        priceChange,
        timestamp: Date.now(),
        wyckoffPhase: this.analyzeWyckoffPhase(symbol, price),
        rsi: 45 + Math.random() * 20,
        vwap: price * (0.98 + Math.random() * 0.04)
      };
    } catch (error) {
      console.error(`Failed to get market data for ${symbol}:`, error);
      return this.getFallbackMarketData(symbol);
    }
  }

  private async getRealTimePrice(symbol: string): Promise<number> {
    // Check cache first
    const cached = this.priceCache.get(symbol);
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
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
        'MATICUSDT': 'matic-network'
      };

      const coinId = coinGeckoIds[symbol];
      if (!coinId) {
        throw new Error(`Unknown symbol: ${symbol}`);
      }

      const response = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd&include_24hr_change=true`,
        {
          headers: { 'Accept': 'application/json' }
        }
      );

      if (!response.ok) {
        throw new Error(`CoinGecko API error: ${response.status}`);
      }

      const data = await response.json();
      const price = data[coinId]?.usd;

      if (!price || typeof price !== 'number') {
        throw new Error(`Invalid price data for ${symbol}`);
      }

      // Cache the price
      this.priceCache.set(symbol, { price, timestamp: Date.now() });
      return price;

    } catch (error) {
      console.error(`Failed to fetch real-time price for ${symbol}:`, error);
      return this.getFallbackPrice(symbol);
    }
  }

  public async getMultipleMarketData(symbols: string[]) {
    const results = new Map();
    
    // Fetch all symbols in parallel for better performance
    const dataPromises = symbols.map(symbol => this.getMarketData(symbol));
    const dataResults = await Promise.allSettled(dataPromises);
    
    symbols.forEach((symbol, index) => {
      const result = dataResults[index];
      if (result.status === 'fulfilled') {
        results.set(symbol, result.value);
      } else {
        console.error(`Failed to get data for ${symbol}:`, result.reason);
        results.set(symbol, this.getFallbackMarketData(symbol));
      }
    });
    
    return results;
  }

  private getPreviousPrice(symbol: string): number | null {
    const cached = this.priceCache.get(symbol);
    return cached ? cached.price : null;
  }

  private getFallbackPrice(symbol: string): number {
    const fallbackPrices: Record<string, number> = {
      'BTCUSDT': 67000,
      'ETHUSDT': 3900,
      'BNBUSDT': 650,
      'SOLUSDT': 220,
      'XRPUSDT': 2.45,
      'ADAUSDT': 1.15,
      'AVAXUSDT': 45,
      'DOTUSDT': 8.5,
      'LINKUSDT': 22,
      'MATICUSDT': 1.2
    };
    return fallbackPrices[symbol] || 100;
  }

  private getFallbackMarketData(symbol: string) {
    const price = this.getFallbackPrice(symbol);
    return {
      symbol,
      price,
      volume: Math.random() * 1000000,
      priceChange: (Math.random() - 0.5) * 0.05,
      timestamp: Date.now(),
      wyckoffPhase: 'Accumulation',
      rsi: 45 + Math.random() * 20,
      vwap: price * (0.98 + Math.random() * 0.04)
    };
  }

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
