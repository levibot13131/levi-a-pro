
import { toast } from 'sonner';

export interface LiveMarketData {
  symbol: string;
  price: number;
  volume24h: number;
  change24h: number;
  high24h: number;
  low24h: number;
  lastUpdate: number;
}

export interface CoinGeckoData {
  id: string;
  current_price: number;
  price_change_percentage_24h: number;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  market_cap: number;
}

class LiveMarketDataService {
  private cache: Map<string, LiveMarketData> = new Map();
  private lastUpdate = 0;
  private readonly CACHE_DURATION = 10000; // 10 seconds cache

  async getLiveMarketData(symbol: string): Promise<LiveMarketData | null> {
    const cacheKey = symbol.toUpperCase();
    
    // Check cache first
    if (this.cache.has(cacheKey) && Date.now() - this.lastUpdate < this.CACHE_DURATION) {
      return this.cache.get(cacheKey)!;
    }

    try {
      // Try Binance first
      const binanceData = await this.fetchFromBinance(symbol);
      if (binanceData) {
        this.cache.set(cacheKey, binanceData);
        this.lastUpdate = Date.now();
        return binanceData;
      }

      // Fallback to CoinGecko
      const coinGeckoData = await this.fetchFromCoinGecko(symbol);
      if (coinGeckoData) {
        this.cache.set(cacheKey, coinGeckoData);
        this.lastUpdate = Date.now();
        return coinGeckoData;
      }

      console.warn(`No live data available for ${symbol}`);
      return null;
    } catch (error) {
      console.error(`Error fetching live data for ${symbol}:`, error);
      return null;
    }
  }

  private async fetchFromBinance(symbol: string): Promise<LiveMarketData | null> {
    try {
      const binanceSymbol = symbol.replace('USD', 'USDT');
      const response = await fetch(`https://api.binance.com/api/v3/ticker/24hr?symbol=${binanceSymbol}`);
      
      if (!response.ok) {
        throw new Error(`Binance API error: ${response.status}`);
      }

      const data = await response.json();
      
      return {
        symbol: binanceSymbol,
        price: parseFloat(data.lastPrice),
        volume24h: parseFloat(data.volume),
        change24h: parseFloat(data.priceChangePercent),
        high24h: parseFloat(data.highPrice),
        low24h: parseFloat(data.lowPrice),
        lastUpdate: Date.now()
      };
    } catch (error) {
      console.error('Binance API error:', error);
      return null;
    }
  }

  private async fetchFromCoinGecko(symbol: string): Promise<LiveMarketData | null> {
    try {
      // Map symbols to CoinGecko IDs
      const coinGeckoIds: Record<string, string> = {
        'BTCUSDT': 'bitcoin',
        'ETHUSDT': 'ethereum',
        'SOLUSDT': 'solana',
        'BNBUSDT': 'binancecoin',
        'ADAUSDT': 'cardano',
        'DOTUSDT': 'polkadot',
        'AVAXUSDT': 'avalanche-2'
      };

      const coinId = coinGeckoIds[symbol.toUpperCase()] || 'bitcoin';
      
      const response = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd&include_24hr_change=true&include_24hr_vol=true&include_high_low_24h=true`
      );

      if (!response.ok) {
        throw new Error(`CoinGecko API error: ${response.status}`);
      }

      const data = await response.json();
      const coinData = data[coinId];

      if (!coinData) {
        throw new Error(`No data found for ${coinId}`);
      }

      return {
        symbol: symbol.toUpperCase(),
        price: coinData.usd,
        volume24h: coinData.usd_24h_vol || 0,
        change24h: coinData.usd_24h_change || 0,
        high24h: coinData.usd_24h_high || coinData.usd,
        low24h: coinData.usd_24h_low || coinData.usd,
        lastUpdate: Date.now()
      };
    } catch (error) {
      console.error('CoinGecko API error:', error);
      return null;
    }
  }

  async getMultipleAssets(symbols: string[]): Promise<Map<string, LiveMarketData>> {
    const results = new Map<string, LiveMarketData>();
    
    for (const symbol of symbols) {
      const data = await this.getLiveMarketData(symbol);
      if (data) {
        results.set(symbol, data);
      }
    }
    
    return results;
  }

  clearCache(): void {
    this.cache.clear();
    this.lastUpdate = 0;
  }
}

export const liveMarketDataService = new LiveMarketDataService();
