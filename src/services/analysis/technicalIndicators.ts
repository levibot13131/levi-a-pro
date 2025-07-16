/**
 * Technical Indicators Calculator
 * Real-time calculation of RSI, MACD, Fibonacci, VWAP, Volume Profile
 */

export interface RSIResult {
  value: number;
  signal: 'oversold' | 'overbought' | 'neutral';
  trend: 'bullish' | 'bearish' | 'neutral';
}

export interface MACDResult {
  macd: number;
  signal: number;
  histogram: number;
  trend: 'bullish' | 'bearish' | 'neutral';
  crossover: 'bullish_crossover' | 'bearish_crossover' | 'none';
}

export interface FibonacciLevel {
  level: number;
  price: number;
  type: 'support' | 'resistance';
}

export interface VWAPResult {
  vwap: number;
  position: 'above' | 'below' | 'at';
  strength: number;
}

export interface VolumeProfileResult {
  poc: number; // Point of Control
  vah: number; // Value Area High
  val: number; // Value Area Low
  highVolumeNodes: number[];
  lowVolumeNodes: number[];
}

export class TechnicalIndicators {
  
  /**
   * Calculate RSI (Relative Strength Index)
   */
  static calculateRSI(prices: number[], period: number = 14): RSIResult {
    if (prices.length < period) {
      throw new Error(`Need at least ${period} price points for RSI calculation`);
    }

    const gains: number[] = [];
    const losses: number[] = [];

    // Calculate price changes
    for (let i = 1; i < prices.length; i++) {
      const change = prices[i] - prices[i - 1];
      gains.push(change > 0 ? change : 0);
      losses.push(change < 0 ? Math.abs(change) : 0);
    }

    // Calculate average gains and losses
    let avgGain = gains.slice(0, period).reduce((sum, gain) => sum + gain, 0) / period;
    let avgLoss = losses.slice(0, period).reduce((sum, loss) => sum + loss, 0) / period;

    // Smooth the averages using Wilder's method
    for (let i = period; i < gains.length; i++) {
      avgGain = (avgGain * (period - 1) + gains[i]) / period;
      avgLoss = (avgLoss * (period - 1) + losses[i]) / period;
    }

    const rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
    const rsi = 100 - (100 / (1 + rs));

    let signal: 'oversold' | 'overbought' | 'neutral' = 'neutral';
    let trend: 'bullish' | 'bearish' | 'neutral' = 'neutral';

    if (rsi <= 30) {
      signal = 'oversold';
      trend = 'bullish';
    } else if (rsi >= 70) {
      signal = 'overbought';
      trend = 'bearish';
    } else if (rsi > 50) {
      trend = 'bullish';
    } else if (rsi < 50) {
      trend = 'bearish';
    }

    return { value: rsi, signal, trend };
  }

  /**
   * Calculate MACD (Moving Average Convergence Divergence)
   */
  static calculateMACD(prices: number[], fastPeriod: number = 12, slowPeriod: number = 26, signalPeriod: number = 9): MACDResult {
    if (prices.length < slowPeriod) {
      throw new Error(`Need at least ${slowPeriod} price points for MACD calculation`);
    }

    // Calculate EMAs
    const fastEMA = this.calculateEMA(prices, fastPeriod);
    const slowEMA = this.calculateEMA(prices, slowPeriod);

    // Calculate MACD line
    const macdLine: number[] = [];
    for (let i = 0; i < Math.min(fastEMA.length, slowEMA.length); i++) {
      macdLine.push(fastEMA[i] - slowEMA[i]);
    }

    // Calculate Signal line (EMA of MACD)
    const signalLine = this.calculateEMA(macdLine, signalPeriod);

    const currentMACD = macdLine[macdLine.length - 1];
    const currentSignal = signalLine[signalLine.length - 1];
    const histogram = currentMACD - currentSignal;

    // Determine trend and crossovers
    let trend: 'bullish' | 'bearish' | 'neutral' = 'neutral';
    let crossover: 'bullish_crossover' | 'bearish_crossover' | 'none' = 'none';

    if (currentMACD > currentSignal) {
      trend = 'bullish';
    } else if (currentMACD < currentSignal) {
      trend = 'bearish';
    }

    // Check for crossovers (simplified)
    if (macdLine.length > 1 && signalLine.length > 1) {
      const prevMACD = macdLine[macdLine.length - 2];
      const prevSignal = signalLine[signalLine.length - 2];

      if (prevMACD <= prevSignal && currentMACD > currentSignal) {
        crossover = 'bullish_crossover';
      } else if (prevMACD >= prevSignal && currentMACD < currentSignal) {
        crossover = 'bearish_crossover';
      }
    }

    return {
      macd: currentMACD,
      signal: currentSignal,
      histogram,
      trend,
      crossover
    };
  }

  /**
   * Calculate Fibonacci Retracement Levels
   */
  static calculateFibonacci(high: number, low: number, trend: 'up' | 'down'): FibonacciLevel[] {
    const range = high - low;
    const levels = [0, 0.236, 0.382, 0.5, 0.618, 0.786, 1];

    return levels.map(level => {
      let price: number;
      let type: 'support' | 'resistance';

      if (trend === 'up') {
        price = high - (range * level);
        type = level < 0.5 ? 'resistance' : 'support';
      } else {
        price = low + (range * level);
        type = level < 0.5 ? 'support' : 'resistance';
      }

      return { level, price, type };
    });
  }

  /**
   * Calculate VWAP (Volume Weighted Average Price)
   */
  static calculateVWAP(prices: number[], volumes: number[], currentPrice: number): VWAPResult {
    if (prices.length !== volumes.length) {
      throw new Error('Prices and volumes arrays must have the same length');
    }

    let totalVolumePrice = 0;
    let totalVolume = 0;

    for (let i = 0; i < prices.length; i++) {
      totalVolumePrice += prices[i] * volumes[i];
      totalVolume += volumes[i];
    }

    const vwap = totalVolume > 0 ? totalVolumePrice / totalVolume : prices[prices.length - 1];
    
    let position: 'above' | 'below' | 'at' = 'at';
    let strength = 0;

    const deviation = Math.abs(currentPrice - vwap) / vwap;
    strength = Math.min(100, deviation * 1000);

    if (currentPrice > vwap * 1.002) {
      position = 'above';
    } else if (currentPrice < vwap * 0.998) {
      position = 'below';
    }

    return { vwap, position, strength };
  }

  /**
   * Calculate Volume Profile
   */
  static calculateVolumeProfile(prices: number[], volumes: number[], bins: number = 20): VolumeProfileResult {
    if (prices.length !== volumes.length) {
      throw new Error('Prices and volumes arrays must have the same length');
    }

    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const priceRange = maxPrice - minPrice;
    const binSize = priceRange / bins;

    // Initialize bins
    const volumeBins: { price: number; volume: number }[] = [];
    for (let i = 0; i < bins; i++) {
      volumeBins.push({
        price: minPrice + (i * binSize) + (binSize / 2),
        volume: 0
      });
    }

    // Distribute volume into bins
    for (let i = 0; i < prices.length; i++) {
      const binIndex = Math.min(bins - 1, Math.floor((prices[i] - minPrice) / binSize));
      volumeBins[binIndex].volume += volumes[i];
    }

    // Sort by volume to find key levels
    const sortedBins = [...volumeBins].sort((a, b) => b.volume - a.volume);

    // Point of Control (highest volume)
    const poc = sortedBins[0].price;

    // Value Area (70% of total volume)
    const totalVolume = volumeBins.reduce((sum, bin) => sum + bin.volume, 0);
    const valueAreaTarget = totalVolume * 0.7;

    let valueAreaVolume = 0;
    const valueAreaPrices: number[] = [];

    for (const bin of sortedBins) {
      if (valueAreaVolume < valueAreaTarget) {
        valueAreaVolume += bin.volume;
        valueAreaPrices.push(bin.price);
      }
    }

    const vah = Math.max(...valueAreaPrices);
    const val = Math.min(...valueAreaPrices);

    // High and Low Volume Nodes
    const avgVolume = totalVolume / bins;
    const highVolumeNodes = volumeBins
      .filter(bin => bin.volume > avgVolume * 1.5)
      .map(bin => bin.price);
    
    const lowVolumeNodes = volumeBins
      .filter(bin => bin.volume < avgVolume * 0.5)
      .map(bin => bin.price);

    return {
      poc,
      vah,
      val,
      highVolumeNodes,
      lowVolumeNodes
    };
  }

  /**
   * Helper: Calculate Exponential Moving Average
   */
  private static calculateEMA(prices: number[], period: number): number[] {
    if (prices.length < period) {
      throw new Error(`Need at least ${period} price points for EMA calculation`);
    }

    const ema: number[] = [];
    const multiplier = 2 / (period + 1);

    // First EMA is simple moving average
    let sum = 0;
    for (let i = 0; i < period; i++) {
      sum += prices[i];
    }
    ema.push(sum / period);

    // Calculate subsequent EMAs
    for (let i = period; i < prices.length; i++) {
      const currentEMA = (prices[i] * multiplier) + (ema[ema.length - 1] * (1 - multiplier));
      ema.push(currentEMA);
    }

    return ema;
  }

  /**
   * Comprehensive Technical Analysis
   */
  static analyzeAll(prices: number[], volumes: number[], currentPrice: number): {
    rsi: RSIResult;
    macd: MACDResult;
    fibonacci: FibonacciLevel[];
    vwap: VWAPResult;
    volumeProfile: VolumeProfileResult;
    overallSignal: 'bullish' | 'bearish' | 'neutral';
    confidence: number;
  } {
    const rsi = this.calculateRSI(prices);
    const macd = this.calculateMACD(prices);
    const fibonacci = this.calculateFibonacci(Math.max(...prices), Math.min(...prices), 'up');
    const vwap = this.calculateVWAP(prices, volumes, currentPrice);
    const volumeProfile = this.calculateVolumeProfile(prices, volumes);

    // Calculate overall signal
    let bullishSignals = 0;
    let bearishSignals = 0;

    if (rsi.trend === 'bullish') bullishSignals++;
    if (rsi.trend === 'bearish') bearishSignals++;

    if (macd.trend === 'bullish') bullishSignals++;
    if (macd.trend === 'bearish') bearishSignals++;

    if (macd.crossover === 'bullish_crossover') bullishSignals += 2;
    if (macd.crossover === 'bearish_crossover') bearishSignals += 2;

    if (vwap.position === 'above') bullishSignals++;
    if (vwap.position === 'below') bearishSignals++;

    const totalSignals = bullishSignals + bearishSignals;
    let overallSignal: 'bullish' | 'bearish' | 'neutral' = 'neutral';
    let confidence = 0;

    if (bullishSignals > bearishSignals) {
      overallSignal = 'bullish';
      confidence = totalSignals > 0 ? (bullishSignals / totalSignals) * 100 : 0;
    } else if (bearishSignals > bullishSignals) {
      overallSignal = 'bearish';
      confidence = totalSignals > 0 ? (bearishSignals / totalSignals) * 100 : 0;
    } else {
      confidence = 50;
    }

    return {
      rsi,
      macd,
      fibonacci,
      vwap,
      volumeProfile,
      overallSignal,
      confidence
    };
  }
}