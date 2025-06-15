
import { MarketData } from '@/types/trading';

export class MarketDataService {
  private cache: Map<string, MarketData> = new Map();
  private lastUpdate: Map<string, number> = new Map();
  private readonly CACHE_DURATION = 30000; // 30 seconds

  public async getMarketData(symbol: string): Promise<MarketData | null> {
    // Check cache first
    const cached = this.getCachedData(symbol);
    if (cached) return cached;

    try {
      // Fetch fresh data
      const data = await this.fetchMarketData(symbol);
      if (data) {
        this.cache.set(symbol, data);
        this.lastUpdate.set(symbol, Date.now());
      }
      return data;
    } catch (error) {
      console.error(`Error fetching market data for ${symbol}:`, error);
      return null;
    }
  }

  public async getMultipleMarketData(symbols: string[]): Promise<Map<string, MarketData>> {
    const results = new Map<string, MarketData>();
    
    for (const symbol of symbols) {
      try {
        const data = await this.getMarketData(symbol);
        if (data) {
          results.set(symbol, data);
        }
      } catch (error) {
        console.error(`Error fetching data for ${symbol}:`, error);
      }
    }
    
    return results;
  }

  private getCachedData(symbol: string): MarketData | null {
    const lastUpdate = this.lastUpdate.get(symbol);
    if (!lastUpdate || Date.now() - lastUpdate > this.CACHE_DURATION) {
      return null;
    }
    return this.cache.get(symbol) || null;
  }

  private async fetchMarketData(symbol: string): Promise<MarketData | null> {
    try {
      // Fetch price data from Binance
      const priceData = await this.fetchPriceData(symbol);
      if (!priceData) return null;

      // Fetch technical indicators
      const technicalData = await this.fetchTechnicalIndicators(symbol);
      
      // Fetch sentiment data
      const sentimentData = await this.fetchSentimentData(symbol);

      // Combine all data
      const marketData: MarketData = {
        symbol,
        price: priceData.price,
        volume: priceData.volume,
        rsi: technicalData.rsi,
        macd: technicalData.macd,
        volumeProfile: technicalData.volumeProfile,
        vwap: technicalData.vwap,
        fibonacci: technicalData.fibonacci,
        candlestickPattern: technicalData.candlestickPattern,
        wyckoffPhase: this.determineWyckoffPhase(technicalData),
        smcSignal: this.analyzeSMCSignals(priceData, technicalData),
        sentiment: sentimentData,
        lastUpdated: Date.now()
      };

      return marketData;
    } catch (error) {
      console.error(`Error in fetchMarketData for ${symbol}:`, error);
      return null;
    }
  }

  private async fetchPriceData(symbol: string) {
    try {
      const url = `https://api.binance.com/api/v3/ticker/24hr?symbol=${symbol}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch price data: ${response.status}`);
      }

      const data = await response.json();
      
      return {
        price: parseFloat(data.lastPrice),
        volume: parseFloat(data.volume),
        priceChange: parseFloat(data.priceChange),
        priceChangePercent: parseFloat(data.priceChangePercent)
      };
    } catch (error) {
      console.error(`Error fetching price data for ${symbol}:`, error);
      // Return mock data for development
      return this.getMockPriceData(symbol);
    }
  }

  private async fetchTechnicalIndicators(symbol: string) {
    try {
      // In production, this would call TradingView or another technical analysis API
      // For now, return calculated/mock technical data
      return this.getMockTechnicalData(symbol);
    } catch (error) {
      console.error(`Error fetching technical indicators for ${symbol}:`, error);
      return this.getMockTechnicalData(symbol);
    }
  }

  private async fetchSentimentData(symbol: string) {
    try {
      // In production, this would aggregate sentiment from Twitter, news, etc.
      return this.getMockSentimentData(symbol);
    } catch (error) {
      console.error(`Error fetching sentiment data for ${symbol}:`, error);
      return this.getMockSentimentData(symbol);
    }
  }

  private getMockPriceData(symbol: string) {
    const basePrice = symbol.includes('BTC') ? 43000 : 
                     symbol.includes('ETH') ? 2600 : 
                     symbol.includes('SOL') ? 125 : 
                     symbol.includes('BNB') ? 380 : 100;
    
    const variation = (Math.random() - 0.5) * 0.02; // ±1%
    const price = basePrice * (1 + variation);
    
    return {
      price,
      volume: Math.random() * 1000000 + 500000,
      priceChange: price * variation,
      priceChangePercent: variation * 100
    };
  }

  private getMockTechnicalData(symbol: string) {
    return {
      rsi: Math.random() * 100,
      macd: {
        signal: Math.random() * 10 - 5,
        histogram: Math.random() * 10 - 5,
        macd: Math.random() * 10 - 5
      },
      volumeProfile: Math.random() * 1000000,
      vwap: Math.random() * 50000,
      fibonacci: {
        level618: Math.random() * 45000,
        level786: Math.random() * 47000,
        level382: Math.random() * 42000
      },
      candlestickPattern: 'doji'
    };
  }

  private getMockSentimentData(symbol: string) {
    const sources = ['twitter', 'news', 'whale', 'general'] as const;
    const keywords = ['bullish', 'bearish', 'pump', 'dump', 'moon', 'crash'];
    
    return {
      score: Math.random() * 100 - 50, // -50 to +50
      source: sources[Math.floor(Math.random() * sources.length)],
      keywords: keywords.slice(0, Math.floor(Math.random() * 3) + 1)
    };
  }

  private determineWyckoffPhase(technicalData: any): 'accumulation' | 'markup' | 'distribution' | 'markdown' {
    const phases: ('accumulation' | 'markup' | 'distribution' | 'markdown')[] = 
      ['accumulation', 'markup', 'distribution', 'markdown'];
    return phases[Math.floor(Math.random() * phases.length)];
  }

  private analyzeSMCSignals(priceData: any, technicalData: any) {
    return {
      orderBlock: Math.random() * 1000,
      liquidityGrab: Math.random() > 0.5,
      fairValueGap: Math.random() * 500
    };
  }
}

export const marketDataService = new MarketDataService();
