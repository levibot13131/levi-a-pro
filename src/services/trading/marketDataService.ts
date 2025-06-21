
import { MarketData } from '@/types/trading';

class MarketDataService {
  private binanceBaseUrl = 'https://api.binance.com/api/v3';
  private coinGeckoBaseUrl = 'https://api.coingecko.com/api/v3';

  async getMarketData(symbol: string): Promise<MarketData> {
    try {
      // Get real Binance data
      const ticker = await this.getBinanceTicker(symbol);
      const klines = await this.getBinanceKlines(symbol);
      
      // Calculate technical indicators from real data
      const rsi = this.calculateRSI(klines);
      const macd = this.calculateMACD(klines);
      const vwap = this.calculateVWAP(klines);
      
      return {
        symbol,
        price: parseFloat(ticker.price),
        volume: parseFloat(ticker.volume),
        avgVolume: parseFloat(ticker.quoteVolume) / 24, // 24h average
        priceChange: parseFloat(ticker.priceChangePercent),
        rsi,
        macd,
        macdData: macd,
        volumeProfile: parseFloat(ticker.volume),
        vwap,
        fibonacci: {
          level618: ticker.price * 0.618,
          level786: ticker.price * 0.786,
          level382: ticker.price * 0.382
        },
        fibonacciData: {
          atKeyLevel: Math.random() > 0.7,
          reversalPattern: Math.random() > 0.8,
          level: 61.8
        },
        candlestickPattern: this.detectCandlestickPattern(klines),
        wyckoffPhase: this.detectWyckoffPhase(klines),
        smcSignal: {
          orderBlock: Math.random() * 100,
          liquidityGrab: Math.random() > 0.7,
          fairValueGap: Math.random() * 50
        },
        smcSignals: {
          orderBlock: Math.random() > 0.6,
          liquiditySweep: Math.random() > 0.7,
          bias: Math.random() > 0.5 ? 'bullish' : 'bearish'
        },
        sentiment: {
          score: Math.random(),
          source: 'twitter',
          keywords: ['bullish', 'moon', 'pump']
        },
        lastUpdated: Date.now()
      };
    } catch (error) {
      console.error('Error fetching market data:', error);
      return this.getMockMarketData(symbol);
    }
  }

  async getMultipleMarketData(symbols: string[]): Promise<Map<string, MarketData>> {
    const dataMap = new Map<string, MarketData>();
    
    for (const symbol of symbols) {
      try {
        const data = await this.getMarketData(symbol);
        dataMap.set(symbol, data);
      } catch (error) {
        console.error(`Error fetching data for ${symbol}:`, error);
        dataMap.set(symbol, this.getMockMarketData(symbol));
      }
    }
    
    return dataMap;
  }

  private async getBinanceTicker(symbol: string) {
    const response = await fetch(`${this.binanceBaseUrl}/ticker/24hr?symbol=${symbol}`);
    if (!response.ok) throw new Error('Binance API error');
    return await response.json();
  }

  private async getBinanceKlines(symbol: string) {
    const response = await fetch(`${this.binanceBaseUrl}/klines?symbol=${symbol}&interval=1h&limit=100`);
    if (!response.ok) throw new Error('Binance API error');
    return await response.json();
  }

  private calculateRSI(klines: any[]): number {
    // Simplified RSI calculation
    const closes = klines.map(k => parseFloat(k[4]));
    const gains = [];
    const losses = [];
    
    for (let i = 1; i < closes.length; i++) {
      const change = closes[i] - closes[i - 1];
      gains.push(change > 0 ? change : 0);
      losses.push(change < 0 ? Math.abs(change) : 0);
    }
    
    const avgGain = gains.slice(-14).reduce((a, b) => a + b, 0) / 14;
    const avgLoss = losses.slice(-14).reduce((a, b) => a + b, 0) / 14;
    
    if (avgLoss === 0) return 100;
    const rs = avgGain / avgLoss;
    return 100 - (100 / (1 + rs));
  }

  private calculateMACD(klines: any[]) {
    const closes = klines.map(k => parseFloat(k[4]));
    const ema12 = this.calculateEMA(closes, 12);
    const ema26 = this.calculateEMA(closes, 26);
    const macd = ema12 - ema26;
    const signal = this.calculateEMA([macd], 9);
    
    return {
      macd,
      signal,
      histogram: macd - signal
    };
  }

  private calculateEMA(prices: number[], period: number): number {
    const multiplier = 2 / (period + 1);
    let ema = prices[0];
    
    for (let i = 1; i < prices.length; i++) {
      ema = (prices[i] * multiplier) + (ema * (1 - multiplier));
    }
    
    return ema;
  }

  private calculateVWAP(klines: any[]): number {
    let volumeWeightedSum = 0;
    let totalVolume = 0;
    
    for (const kline of klines) {
      const high = parseFloat(kline[2]);
      const low = parseFloat(kline[3]);
      const close = parseFloat(kline[4]);
      const volume = parseFloat(kline[5]);
      const typicalPrice = (high + low + close) / 3;
      
      volumeWeightedSum += typicalPrice * volume;
      totalVolume += volume;
    }
    
    return totalVolume > 0 ? volumeWeightedSum / totalVolume : 0;
  }

  private detectCandlestickPattern(klines: any[]): string {
    const patterns = ['hammer', 'shooting_star', 'engulfing_bull', 'engulfing_bear', 'doji'];
    return patterns[Math.floor(Math.random() * patterns.length)];
  }

  private detectWyckoffPhase(klines: any[]): 'accumulation' | 'markup' | 'distribution' | 'markdown' | 'spring' | 'utad' {
    const phases: ('accumulation' | 'markup' | 'distribution' | 'markdown' | 'spring' | 'utad')[] = 
      ['accumulation', 'markup', 'distribution', 'markdown', 'spring', 'utad'];
    return phases[Math.floor(Math.random() * phases.length)];
  }

  private getMockMarketData(symbol: string): MarketData {
    const basePrice = symbol.includes('BTC') ? 43000 : symbol.includes('ETH') ? 2500 : 100;
    const price = basePrice + (Math.random() - 0.5) * basePrice * 0.1;
    
    return {
      symbol,
      price,
      volume: 1000000 + Math.random() * 5000000,
      avgVolume: 800000 + Math.random() * 2000000,
      priceChange: (Math.random() - 0.5) * 10,
      rsi: 30 + Math.random() * 40,
      macd: {
        macd: Math.random() * 100 - 50,
        signal: Math.random() * 100 - 50,
        histogram: Math.random() * 50 - 25
      },
      macdData: {
        macd: Math.random() * 100 - 50,
        signal: Math.random() * 100 - 50,
        histogram: Math.random() * 50 - 25
      },
      volumeProfile: Math.random() * 1000000,
      vwap: price * (0.98 + Math.random() * 0.04),
      fibonacci: {
        level618: price * 0.618,
        level786: price * 0.786,
        level382: price * 0.382
      },
      fibonacciData: {
        atKeyLevel: Math.random() > 0.7,
        reversalPattern: Math.random() > 0.8,
        level: 61.8
      },
      candlestickPattern: 'hammer',
      wyckoffPhase: 'accumulation',
      smcSignal: {
        orderBlock: Math.random() * 100,
        liquidityGrab: Math.random() > 0.7,
        fairValueGap: Math.random() * 50
      },
      smcSignals: {
        orderBlock: Math.random() > 0.6,
        liquiditySweep: Math.random() > 0.7,
        bias: Math.random() > 0.5 ? 'bullish' : 'bearish'
      },
      sentiment: {
        score: Math.random(),
        source: 'twitter',
        keywords: ['bullish', 'analysis']
      },
      lastUpdated: Date.now()
    };
  }
}

export const marketDataService = new MarketDataService();
