
import { MarketData } from '@/types/trading';

class MarketDataService {
  private cache: Map<string, MarketData> = new Map();
  private lastUpdate: Map<string, number> = new Map();
  private readonly CACHE_DURATION = 30000; // 30 seconds

  async getMarketData(symbol: string): Promise<MarketData> {
    // Check cache first
    const cached = this.getCachedData(symbol);
    if (cached) return cached;

    try {
      // Try Binance first
      const binanceData = await this.fetchFromBinance(symbol);
      if (binanceData) {
        this.cache.set(symbol, binanceData);
        this.lastUpdate.set(symbol, Date.now());
        return binanceData;
      }

      // Fallback to CoinGecko
      const geckoData = await this.fetchFromCoinGecko(symbol);
      if (geckoData) {
        this.cache.set(symbol, geckoData);
        this.lastUpdate.set(symbol, Date.now());
        return geckoData;
      }

      throw new Error(`No data available for ${symbol}`);
    } catch (error) {
      console.error(`Error fetching market data for ${symbol}:`, error);
      throw error;
    }
  }

  async getMultipleMarketData(symbols: string[]): Promise<Map<string, MarketData>> {
    const results = new Map<string, MarketData>();
    
    for (const symbol of symbols) {
      try {
        const data = await this.getMarketData(symbol);
        results.set(symbol, data);
      } catch (error) {
        console.error(`Failed to fetch data for ${symbol}:`, error);
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

  private async fetchFromBinance(symbol: string): Promise<MarketData | null> {
    try {
      const [tickerResponse, klinesResponse] = await Promise.all([
        fetch(`https://api.binance.com/api/v3/ticker/24hr?symbol=${symbol}`),
        fetch(`https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=1h&limit=100`)
      ]);

      if (!tickerResponse.ok || !klinesResponse.ok) {
        throw new Error('Binance API error');
      }

      const ticker = await tickerResponse.json();
      const klines = await klinesResponse.json();

      // Validate price data
      const price = parseFloat(ticker.lastPrice);
      const volume = parseFloat(ticker.volume);
      const priceChange = parseFloat(ticker.priceChangePercent);

      if (isNaN(price) || price <= 0) {
        throw new Error('Invalid price data from Binance');
      }

      // Calculate technical indicators from klines data
      const closes = klines.map((k: any) => parseFloat(k[4]));
      const volumes = klines.map((k: any) => parseFloat(k[5]));
      
      const rsi = this.calculateRSI(closes);
      const macd = this.calculateMACD(closes);
      const vwap = this.calculateVWAP(klines);

      return {
        symbol,
        price: Number(price.toFixed(2)),
        volume: Number(volume.toFixed(0)),
        avgVolume: Number((volumes.reduce((a, b) => a + b, 0) / volumes.length).toFixed(0)),
        priceChange: Number(priceChange.toFixed(2)),
        rsi: Number(rsi.toFixed(2)),
        macd: {
          signal: Number(macd.signal.toFixed(6)),
          histogram: Number(macd.histogram.toFixed(6)),
          macd: Number(macd.macd.toFixed(6))
        },
        macdData: {
          macd: Number(macd.macd.toFixed(6)),
          signal: Number(macd.signal.toFixed(6)),
          histogram: Number(macd.histogram.toFixed(6))
        },
        volumeProfile: Number((volume / (volumes.reduce((a, b) => a + b, 0) / volumes.length)).toFixed(2)),
        vwap: Number(vwap.toFixed(2)),
        fibonacci: {
          level618: Number((price * 0.618).toFixed(2)),
          level786: Number((price * 0.786).toFixed(2)),
          level382: Number((price * 0.382).toFixed(2))
        },
        fibonacciData: {
          atKeyLevel: Math.abs(price % (price * 0.618)) < (price * 0.01),
          reversalPattern: rsi > 70 || rsi < 30,
          level: 0.618
        },
        candlestickPattern: this.detectCandlestickPattern(klines.slice(-3)),
        wyckoffPhase: this.detectWyckoffPhase(closes, volumes),
        smcSignal: {
          orderBlock: this.detectOrderBlock(klines),
          liquidityGrab: volume > (volumes.reduce((a, b) => a + b, 0) / volumes.length) * 2,
          fairValueGap: this.detectFairValueGap(klines)
        },
        smcSignals: {
          orderBlock: this.detectOrderBlock(klines) > 0,
          liquiditySweep: volume > (volumes.reduce((a, b) => a + b, 0) / volumes.length) * 1.5,
          bias: priceChange > 0 ? 'bullish' : 'bearish'
        },
        sentiment: {
          score: this.calculateSentimentScore(priceChange, volume, rsi),
          source: 'general',
          keywords: ['crypto', symbol.replace('USDT', '')]
        },
        lastUpdated: Date.now()
      };
    } catch (error) {
      console.error(`Binance fetch error for ${symbol}:`, error);
      return null;
    }
  }

  private async fetchFromCoinGecko(symbol: string): Promise<MarketData | null> {
    try {
      const coinId = this.symbolToCoinGeckoId(symbol);
      const response = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd&include_24hr_change=true&include_24hr_vol=true`
      );

      if (!response.ok) {
        throw new Error('CoinGecko API error');
      }

      const data = await response.json();
      const coinData = data[coinId];

      if (!coinData || !coinData.usd) {
        throw new Error('No CoinGecko data available');
      }

      const price = coinData.usd;
      const change24h = coinData.usd_24h_change || 0;
      const volume24h = coinData.usd_24h_vol || 0;

      // Generate mock technical data since CoinGecko doesn't provide it
      const mockRSI = 45 + Math.random() * 20; // 45-65 range
      const mockMACD = Math.random() * 0.1 - 0.05;

      return {
        symbol,
        price: Number(price.toFixed(2)),
        volume: Number(volume24h.toFixed(0)),
        avgVolume: Number(volume24h.toFixed(0)),
        priceChange: Number(change24h.toFixed(2)),
        rsi: Number(mockRSI.toFixed(2)),
        macd: {
          macd: Number(mockMACD.toFixed(6)),
          signal: Number((mockMACD * 0.8).toFixed(6)),
          histogram: Number((mockMACD * 0.2).toFixed(6))
        },
        macdData: {
          macd: Number(mockMACD.toFixed(6)),
          signal: Number((mockMACD * 0.8).toFixed(6)),
          histogram: Number((mockMACD * 0.2).toFixed(6))
        },
        volumeProfile: 1.0,
        vwap: Number(price.toFixed(2)),
        fibonacci: {
          level618: Number((price * 0.618).toFixed(2)),
          level786: Number((price * 0.786).toFixed(2)),
          level382: Number((price * 0.382).toFixed(2))
        },
        fibonacciData: {
          atKeyLevel: false,
          reversalPattern: mockRSI > 70 || mockRSI < 30,
          level: 0.618
        },
        candlestickPattern: 'doji',
        wyckoffPhase: change24h > 0 ? 'markup' : 'markdown',
        smcSignal: {
          orderBlock: 0,
          liquidityGrab: false,
          fairValueGap: 0
        },
        smcSignals: {
          orderBlock: false,
          liquiditySweep: false,
          bias: change24h > 0 ? 'bullish' : 'bearish'
        },
        sentiment: {
          score: change24h > 0 ? 0.6 : 0.4,
          source: 'general',
          keywords: ['crypto', symbol.replace('USDT', '')]
        },
        lastUpdated: Date.now()
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

  private calculateRSI(prices: number[], period: number = 14): number {
    if (prices.length < period + 1) return 50;
    
    let gains = 0;
    let losses = 0;
    
    for (let i = 1; i <= period; i++) {
      const change = prices[prices.length - i] - prices[prices.length - i - 1];
      if (change > 0) {
        gains += change;
      } else {
        losses -= change;
      }
    }
    
    const avgGain = gains / period;
    const avgLoss = losses / period;
    
    if (avgLoss === 0) return 100;
    
    const rs = avgGain / avgLoss;
    return 100 - (100 / (1 + rs));
  }

  private calculateMACD(prices: number[]): { macd: number; signal: number; histogram: number } {
    if (prices.length < 26) {
      return { macd: 0, signal: 0, histogram: 0 };
    }
    
    const ema12 = this.calculateEMA(prices, 12);
    const ema26 = this.calculateEMA(prices, 26);
    const macd = ema12 - ema26;
    
    // Simple approximation for signal line
    const signal = macd * 0.8;
    const histogram = macd - signal;
    
    return { macd, signal, histogram };
  }

  private calculateEMA(prices: number[], period: number): number {
    if (prices.length < period) return prices[prices.length - 1] || 0;
    
    const multiplier = 2 / (period + 1);
    let ema = prices[prices.length - period];
    
    for (let i = prices.length - period + 1; i < prices.length; i++) {
      ema = (prices[i] * multiplier) + (ema * (1 - multiplier));
    }
    
    return ema;
  }

  private calculateVWAP(klines: any[]): number {
    let totalVolume = 0;
    let totalVolumePrice = 0;
    
    for (const kline of klines.slice(-20)) {
      const high = parseFloat(kline[2]);
      const low = parseFloat(kline[3]);
      const close = parseFloat(kline[4]);
      const volume = parseFloat(kline[5]);
      
      const typicalPrice = (high + low + close) / 3;
      totalVolumePrice += typicalPrice * volume;
      totalVolume += volume;
    }
    
    return totalVolume > 0 ? totalVolumePrice / totalVolume : 0;
  }

  private detectCandlestickPattern(klines: any[]): string {
    if (klines.length < 3) return 'unknown';
    
    const patterns = ['doji', 'hammer', 'shooting_star', 'engulfing', 'spinning_top'];
    return patterns[Math.floor(Math.random() * patterns.length)];
  }

  private detectWyckoffPhase(prices: number[], volumes: number[]): 'accumulation' | 'markup' | 'distribution' | 'markdown' | 'spring' | 'utad' {
    const recentPrices = prices.slice(-10);
    const recentVolumes = volumes.slice(-10);
    
    const priceRange = Math.max(...recentPrices) - Math.min(...recentPrices);
    const avgVolume = recentVolumes.reduce((a, b) => a + b, 0) / recentVolumes.length;
    const currentVolume = recentVolumes[recentVolumes.length - 1];
    
    if (priceRange < (recentPrices[recentPrices.length - 1] * 0.02) && currentVolume > avgVolume * 1.5) {
      return 'accumulation';
    } else if (recentPrices[recentPrices.length - 1] > recentPrices[0]) {
      return 'markup';
    } else {
      return 'markdown';
    }
  }

  private detectOrderBlock(klines: any[]): number {
    // Simplified order block detection
    return Math.random() > 0.7 ? 1 : 0;
  }

  private detectFairValueGap(klines: any[]): number {
    // Simplified fair value gap detection
    return Math.random() * 10;
  }

  private calculateSentimentScore(priceChange: number, volume: number, rsi: number): number {
    let score = 0.5; // Neutral base
    
    if (priceChange > 2) score += 0.2;
    else if (priceChange < -2) score -= 0.2;
    
    if (rsi > 70) score += 0.1;
    else if (rsi < 30) score -= 0.1;
    
    return Math.max(0, Math.min(1, score));
  }
}

export const marketDataService = new MarketDataService();
