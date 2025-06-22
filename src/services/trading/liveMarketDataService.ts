
// Live Market Data Service - Real-time data integration via Supabase Edge Functions
import { supabase } from '@/integrations/supabase/client';

export interface LiveMarketData {
  symbol: string;
  price: number;
  change24h: number;
  volume24h: number;
  high24h: number;
  low24h: number;
  timestamp: number;
}

export interface HealthCheckResult {
  binance: boolean;
  coinGecko: boolean;
  overall: boolean;
  lastChecked: number;
}

class LiveMarketDataService {
  private cache = new Map<string, LiveMarketData>();
  private lastUpdate = 0;
  private updateInterval = 30000; // 30 seconds

  async getMultipleAssets(symbols: string[]): Promise<Map<string, LiveMarketData>> {
    console.log(`🔍 Fetching LIVE data for ${symbols.length} symbols: ${symbols.join(', ')}`);
    
    try {
      // Call live market data Edge function
      const { data, error } = await supabase.functions.invoke('market-data-stream');
      
      if (error) {
        console.error('❌ Error calling market-data-stream:', error);
        throw error;
      }

      if (!data.success) {
        throw new Error('Market data service returned error');
      }

      const results = new Map<string, LiveMarketData>();
      
      // Process live data
      for (const marketData of data.data) {
        if (symbols.includes(marketData.symbol)) {
          results.set(marketData.symbol, marketData);
          this.cache.set(marketData.symbol, marketData);
          
          console.log(`📊 LIVE ${marketData.symbol}: $${marketData.price.toFixed(2)} (${marketData.change24h.toFixed(2)}%) Vol: ${marketData.volume24h.toLocaleString()}`);
        }
      }
      
      this.lastUpdate = Date.now();
      console.log(`✅ LIVE data updated for ${results.size}/${symbols.length} symbols`);
      
      return results;
      
    } catch (error) {
      console.error('❌ Error fetching live market data:', error);
      
      // Fallback to cached data if available
      const results = new Map<string, LiveMarketData>();
      for (const symbol of symbols) {
        const cached = this.cache.get(symbol);
        if (cached) {
          results.set(symbol, cached);
        }
      }
      
      if (results.size === 0) {
        throw new Error('No live market data available and no cache');
      }
      
      return results;
    }
  }

  async performHealthCheck(): Promise<HealthCheckResult> {
    console.log('🔍 Performing LIVE market data health check...');
    
    try {
      const { data, error } = await supabase.functions.invoke('market-data-stream');
      
      const result: HealthCheckResult = {
        binance: false, // Not directly connected
        coinGecko: !error && data?.success,
        overall: !error && data?.success,
        lastChecked: Date.now()
      };
      
      console.log(`📡 LIVE Health Check: CoinGecko=${result.coinGecko ? '✅' : '❌'}`);
      
      return result;
    } catch (error) {
      console.error('❌ Live health check failed:', error);
      return {
        binance: false,
        coinGecko: false,
        overall: false,
        lastChecked: Date.now()
      };
    }
  }

  getDataFreshness(symbol: string): number {
    const cachedData = this.cache.get(symbol);
    if (!cachedData) return -1;
    
    return Date.now() - cachedData.timestamp;
  }

  getConnectionStatus() {
    const isConnected = Date.now() - this.lastUpdate < 60000;
    return {
      connected: isConnected,
      lastUpdate: this.lastUpdate,
      cacheSize: this.cache.size,
      status: isConnected ? 'Connected to LIVE APIs' : 'Disconnected'
    };
  }
}

export const liveMarketDataService = new LiveMarketDataService();
