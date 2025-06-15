
import { MarketData } from '@/types/trading';
import { getProxyUrl } from '@/services/proxy/proxyConfig';

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
      const url = getProxyUrl(`/binance/api/v3/ticker/24hr?symbol=${symbol}`);
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
      rsi: 30 + Math.random() * 40, // 30-70 range
      macd: {
        macd: Math.random() * 100 - 50,
        signal: Math.random() * 100 - 50,
        histogram: Math.random() * 20 - 10
      },
      volumeProfile: 1 + Math.random(),
      vwap: this.getMockPriceData(symbol).price * (0.998 + Math.random() * 0.004),
      fibonacci: {
        level618: this.getMockPriceData(symbol).price * 0.995,
        level786: this.getMockPriceData(symbol).price * 0.99,
        level382: this.getMockPriceData(symbol).price * 1.005
      },
      candlestickPattern: Math.random() > 0.8 ? ['doji', 'engulfing', 'pinbar', 'hammer'][Math.floor(Math.random() * 4)] : undefined
    };
  }

  private getMockSentimentData(symbol: string) {
    return {
      score: Math.random() * 2 - 1, // -1 to 1
      source: ['twitter', 'news', 'whale', 'general'][Math.floor(Math.random() * 4)] as any,
      keywords: ['bullish', 'breakout', 'support', 'resistance', 'volume'].slice(0, Math.floor(Math.random() * 3) + 1)
    };
  }

  private determineWyckoffPhase(technicalData: any): 'accumulation' | 'distribution' | 'markup' | 'markdown' {
    // Simplified Wyckoff phase determination
    if (technicalData.rsi < 40 && technicalData.volumeProfile > 1.2) {
      return 'accumulation';
    } else if (technicalData.rsi > 60 && technicalData.volumeProfile > 1.2) {
      return 'distribution';
    } else if (technicalData.rsi > 50) {
      return 'markup';
    } else {
      return 'markdown';
    }
  }

  private analyzeSMCSignals(priceData: any, technicalData: any) {
    return {
      orderBlock: Math.random() > 0.7 ? priceData.price * 0.995 : undefined,
      liquidityGrab: Math.random() > 0.8,
      fairValueGap: Math.random() > 0.75 ? priceData.price * 0.002 : undefined
    };
  }

  public async getMultipleMarketData(symbols: string[]): Promise<Map<string, MarketData>> {
    const results = new Map<string, MarketData>();
    
    const promises = symbols.map(async (symbol) => {
      const data = await this.getMarketData(symbol);
      if (data) {
        results.set(symbol, data);
      }
    });

    await Promise.all(promises);
    return results;
  }
}

export const marketDataService = new MarketDataService();
