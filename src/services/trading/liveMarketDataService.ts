
import { Asset } from '@/types/asset.d';

export interface LiveMarketData {
  symbol: string;
  price: number;
  volume24h: number;
  change24h: number;
  high24h: number;
  low24h: number;
  marketCap?: number;
  lastUpdated: number;
  timestamp: number; // Added timestamp for real-time freshness validation
}

class LiveMarketDataService {
  private cache: Map<string, LiveMarketData> = new Map();
  private lastUpdate: Map<string, number> = new Map();
  private readonly CACHE_DURATION = 30000; // 30 seconds

  async getMultipleAssets(symbols: string[]): Promise<Map<string, LiveMarketData>> {
    const results = new Map<string, LiveMarketData>();
    
    for (const symbol of symbols) {
      try {
        const data = await this.getLiveData(symbol);
        if (data) {
          results.set(symbol, data);
        }
      } catch (error) {
        console.error(`Error fetching live data for ${symbol}:`, error);
      }
    }
    
    return results;
  }

  private async getLiveData(symbol: string): Promise<LiveMarketData | null> {
    // Check cache first
    const cached = this.getCachedData(symbol);
    if (cached) return cached;

    try {
      // Fetch from Binance API
      const data = await this.fetchFromBinance(symbol);
      if (data) {
        this.cache.set(symbol, data);
        this.lastUpdate.set(symbol, Date.now());
        return data;
      }
      
      // Fallback to CoinGecko if Binance fails
      return await this.fetchFromCoinGecko(symbol);
    } catch (error) {
      console.error(`Error fetching live data for ${symbol}:`, error);
      return null;
    }
  }

  private getCachedData(symbol: string): LiveMarketData | null {
    const lastUpdate = this.lastUpdate.get(symbol);
    if (!lastUpdate || Date.now() - lastUpdate > this.CACHE_DURATION) {
      return null;
    }
    return this.cache.get(symbol) || null;
  }

  private async fetchFromBinance(symbol: string): Promise<LiveMarketData | null> {
    try {
      const response = await fetch(`https://api.binance.com/api/v3/ticker/24hr?symbol=${symbol}`);
      
      if (!response.ok) {
        throw new Error(`Binance API error: ${response.status}`);
      }

      const data = await response.json();
      const timestamp = Date.now();
      
      return {
        symbol,
        price: parseFloat(data.lastPrice),
        volume24h: parseFloat(data.volume),
        change24h: parseFloat(data.priceChangePercent),
        high24h: parseFloat(data.highPrice),
        low24h: parseFloat(data.lowPrice),
        lastUpdated: timestamp,
        timestamp // Ensure timestamp is always included
      };
    } catch (error) {
      console.error(`Binance fetch error for ${symbol}:`, error);
      return null;
    }
  }

  private async fetchFromCoinGecko(symbol: string): Promise<LiveMarketData | null> {
    try {
      // Convert symbol to CoinGecko format
      const coinId = this.symbolToCoinGeckoId(symbol);
      const response = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd&include_24hr_change=true&include_24hr_vol=true`
      );
      
      if (!response.ok) {
        throw new Error(`CoinGecko API error: ${response.status}`);
      }

      const data = await response.json();
      const coinData = data[coinId];
      
      if (!coinData) return null;
      
      const timestamp = Date.now();
      
      return {
        symbol,
        price: coinData.usd,
        volume24h: coinData.usd_24h_vol || 0,
        change24h: coinData.usd_24h_change || 0,
        high24h: coinData.usd * (1 + (coinData.usd_24h_change || 0) / 100 * 0.5),
        low24h: coinData.usd * (1 - (coinData.usd_24h_change || 0) / 100 * 0.5),
        lastUpdated: timestamp,
        timestamp // Ensure timestamp is always included for CoinGecko fallback
      };
    } catch (error) {
      console.error(`CoinGecko fetch error for ${symbol}:`, error);
      return null;
    }
  }

  private symbolToCoinGeckoId(symbol: string): string {
    const mapping: Record<string, string> = {
      'BTCUSDT': 'bitcoin',
      'ETHUSDT': 'ethereum',
      'SOLUSDT': 'solana',
      'BNBUSDT': 'binancecoin',
      'ADAUSDT': 'cardano',
      'XRPUSDT': 'ripple',
      'DOTUSDT': 'polkadot',
      'LINKUSDT': 'chainlink'
    };
    
    return mapping[symbol] || symbol.toLowerCase().replace('usdt', '');
  }

  // Add method to get data freshness for diagnostic purposes
  public getDataFreshness(symbol: string): number {
    const data = this.cache.get(symbol);
    if (!data || !data.timestamp) return -1;
    return Date.now() - data.timestamp;
  }

  // Add method to check if all feeds are healthy
  public async performHealthCheck(): Promise<{binance: boolean, coinGecko: boolean}> {
    let binanceHealthy = false;
    let coinGeckoHealthy = false;

    try {
      const binanceTest = await this.fetchFromBinance('BTCUSDT');
      binanceHealthy = binanceTest !== null;
    } catch {
      binanceHealthy = false;
    }

    try {
      const coinGeckoTest = await this.fetchFromCoinGecko('BTCUSDT');
      coinGeckoHealthy = coinGeckoTest !== null;
    } catch {
      coinGeckoHealthy = false;
    }

    return { binance: binanceHealthy, coinGecko: coinGeckoHealthy };
  }
}

export const liveMarketDataService = new LiveMarketDataService();
