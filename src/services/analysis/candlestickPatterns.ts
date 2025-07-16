/**
 * Candlestick Pattern Recognition
 * Identifies bullish and bearish candlestick patterns
 */

export interface CandlestickData {
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  timestamp: number;
}

export interface PatternResult {
  name: string;
  type: 'bullish' | 'bearish' | 'neutral';
  confidence: number;
  description: string;
  reliability: 'high' | 'medium' | 'low';
}

export class CandlestickPatterns {

  /**
   * Analyze candlestick patterns in the given data
   */
  static analyzePatterns(candles: CandlestickData[]): PatternResult[] {
    if (candles.length < 2) {
      return [];
    }

    const patterns: PatternResult[] = [];

    // Single candlestick patterns
    patterns.push(...this.analyzeSingleCandlePatterns(candles));

    // Two-candle patterns
    if (candles.length >= 2) {
      patterns.push(...this.analyzeTwoCandlePatterns(candles));
    }

    // Three-candle patterns
    if (candles.length >= 3) {
      patterns.push(...this.analyzeThreeCandlePatterns(candles));
    }

    return patterns.filter(pattern => pattern.confidence > 60);
  }

  /**
   * Single candlestick patterns
   */
  private static analyzeSingleCandlePatterns(candles: CandlestickData[]): PatternResult[] {
    const patterns: PatternResult[] = [];
    const current = candles[candles.length - 1];

    // Doji
    if (this.isDoji(current)) {
      patterns.push({
        name: 'Doji',
        type: 'neutral',
        confidence: 75,
        description: 'Market indecision - potential reversal signal',
        reliability: 'medium'
      });
    }

    // Hammer
    if (this.isHammer(current)) {
      patterns.push({
        name: 'Hammer',
        type: 'bullish',
        confidence: 80,
        description: 'Potential bullish reversal after downtrend',
        reliability: 'high'
      });
    }

    // Hanging Man
    if (this.isHangingMan(current)) {
      patterns.push({
        name: 'Hanging Man',
        type: 'bearish',
        confidence: 75,
        description: 'Potential bearish reversal after uptrend',
        reliability: 'medium'
      });
    }

    // Shooting Star
    if (this.isShootingStar(current)) {
      patterns.push({
        name: 'Shooting Star',
        type: 'bearish',
        confidence: 80,
        description: 'Strong bearish reversal signal',
        reliability: 'high'
      });
    }

    // Marubozu
    if (this.isMarubozu(current)) {
      const type = current.close > current.open ? 'bullish' : 'bearish';
      patterns.push({
        name: `${type === 'bullish' ? 'Bullish' : 'Bearish'} Marubozu`,
        type,
        confidence: 85,
        description: `Strong ${type} continuation signal`,
        reliability: 'high'
      });
    }

    return patterns;
  }

  /**
   * Two candlestick patterns
   */
  private static analyzeTwoCandlePatterns(candles: CandlestickData[]): PatternResult[] {
    const patterns: PatternResult[] = [];
    if (candles.length < 2) return patterns;

    const current = candles[candles.length - 1];
    const previous = candles[candles.length - 2];

    // Bullish Engulfing
    if (this.isBullishEngulfing(previous, current)) {
      patterns.push({
        name: 'Bullish Engulfing',
        type: 'bullish',
        confidence: 85,
        description: 'Strong bullish reversal pattern',
        reliability: 'high'
      });
    }

    // Bearish Engulfing
    if (this.isBearishEngulfing(previous, current)) {
      patterns.push({
        name: 'Bearish Engulfing',
        type: 'bearish',
        confidence: 85,
        description: 'Strong bearish reversal pattern',
        reliability: 'high'
      });
    }

    // Piercing Pattern
    if (this.isPiercingPattern(previous, current)) {
      patterns.push({
        name: 'Piercing Pattern',
        type: 'bullish',
        confidence: 80,
        description: 'Bullish reversal after downtrend',
        reliability: 'high'
      });
    }

    // Dark Cloud Cover
    if (this.isDarkCloudCover(previous, current)) {
      patterns.push({
        name: 'Dark Cloud Cover',
        type: 'bearish',
        confidence: 80,
        description: 'Bearish reversal after uptrend',
        reliability: 'high'
      });
    }

    // Harami
    if (this.isHarami(previous, current)) {
      const type = current.close > current.open ? 'bullish' : 'bearish';
      patterns.push({
        name: `${type === 'bullish' ? 'Bullish' : 'Bearish'} Harami`,
        type,
        confidence: 70,
        description: `${type === 'bullish' ? 'Bullish' : 'Bearish'} reversal indication`,
        reliability: 'medium'
      });
    }

    return patterns;
  }

  /**
   * Three candlestick patterns
   */
  private static analyzeThreeCandlePatterns(candles: CandlestickData[]): PatternResult[] {
    const patterns: PatternResult[] = [];
    if (candles.length < 3) return patterns;

    const current = candles[candles.length - 1];
    const middle = candles[candles.length - 2];
    const first = candles[candles.length - 3];

    // Morning Star
    if (this.isMorningStar(first, middle, current)) {
      patterns.push({
        name: 'Morning Star',
        type: 'bullish',
        confidence: 90,
        description: 'Very strong bullish reversal pattern',
        reliability: 'high'
      });
    }

    // Evening Star
    if (this.isEveningStar(first, middle, current)) {
      patterns.push({
        name: 'Evening Star',
        type: 'bearish',
        confidence: 90,
        description: 'Very strong bearish reversal pattern',
        reliability: 'high'
      });
    }

    // Three White Soldiers
    if (this.isThreeWhiteSoldiers(first, middle, current)) {
      patterns.push({
        name: 'Three White Soldiers',
        type: 'bullish',
        confidence: 85,
        description: 'Strong bullish continuation pattern',
        reliability: 'high'
      });
    }

    // Three Black Crows
    if (this.isThreeBlackCrows(first, middle, current)) {
      patterns.push({
        name: 'Three Black Crows',
        type: 'bearish',
        confidence: 85,
        description: 'Strong bearish continuation pattern',
        reliability: 'high'
      });
    }

    return patterns;
  }

  // Pattern detection methods
  private static isDoji(candle: CandlestickData): boolean {
    const bodySize = Math.abs(candle.close - candle.open);
    const range = candle.high - candle.low;
    return bodySize <= range * 0.1; // Body is less than 10% of the range
  }

  private static isHammer(candle: CandlestickData): boolean {
    const bodySize = Math.abs(candle.close - candle.open);
    const lowerShadow = Math.min(candle.open, candle.close) - candle.low;
    const upperShadow = candle.high - Math.max(candle.open, candle.close);
    
    return lowerShadow >= bodySize * 2 && upperShadow <= bodySize * 0.1;
  }

  private static isHangingMan(candle: CandlestickData): boolean {
    return this.isHammer(candle); // Same structure, different context
  }

  private static isShootingStar(candle: CandlestickData): boolean {
    const bodySize = Math.abs(candle.close - candle.open);
    const upperShadow = candle.high - Math.max(candle.open, candle.close);
    const lowerShadow = Math.min(candle.open, candle.close) - candle.low;
    
    return upperShadow >= bodySize * 2 && lowerShadow <= bodySize * 0.1;
  }

  private static isMarubozu(candle: CandlestickData): boolean {
    const upperShadow = candle.high - Math.max(candle.open, candle.close);
    const lowerShadow = Math.min(candle.open, candle.close) - candle.low;
    const range = candle.high - candle.low;
    
    return upperShadow <= range * 0.05 && lowerShadow <= range * 0.05;
  }

  private static isBullishEngulfing(prev: CandlestickData, curr: CandlestickData): boolean {
    return prev.close < prev.open && // Previous is bearish
           curr.close > curr.open && // Current is bullish
           curr.open < prev.close && // Current opens below previous close
           curr.close > prev.open;   // Current closes above previous open
  }

  private static isBearishEngulfing(prev: CandlestickData, curr: CandlestickData): boolean {
    return prev.close > prev.open && // Previous is bullish
           curr.close < curr.open && // Current is bearish
           curr.open > prev.close && // Current opens above previous close
           curr.close < prev.open;   // Current closes below previous open
  }

  private static isPiercingPattern(prev: CandlestickData, curr: CandlestickData): boolean {
    const prevMidpoint = (prev.open + prev.close) / 2;
    return prev.close < prev.open && // Previous is bearish
           curr.close > curr.open && // Current is bullish
           curr.open < prev.close && // Current opens below previous close
           curr.close > prevMidpoint; // Current closes above previous midpoint
  }

  private static isDarkCloudCover(prev: CandlestickData, curr: CandlestickData): boolean {
    const prevMidpoint = (prev.open + prev.close) / 2;
    return prev.close > prev.open && // Previous is bullish
           curr.close < curr.open && // Current is bearish
           curr.open > prev.close && // Current opens above previous close
           curr.close < prevMidpoint; // Current closes below previous midpoint
  }

  private static isHarami(prev: CandlestickData, curr: CandlestickData): boolean {
    return Math.abs(prev.close - prev.open) > Math.abs(curr.close - curr.open) &&
           Math.max(curr.open, curr.close) < Math.max(prev.open, prev.close) &&
           Math.min(curr.open, curr.close) > Math.min(prev.open, prev.close);
  }

  private static isMorningStar(first: CandlestickData, middle: CandlestickData, last: CandlestickData): boolean {
    return first.close < first.open && // First candle is bearish
           this.isDoji(middle) && // Middle is doji-like
           last.close > last.open && // Last candle is bullish
           last.close > (first.open + first.close) / 2; // Last closes above first midpoint
  }

  private static isEveningStar(first: CandlestickData, middle: CandlestickData, last: CandlestickData): boolean {
    return first.close > first.open && // First candle is bullish
           this.isDoji(middle) && // Middle is doji-like
           last.close < last.open && // Last candle is bearish
           last.close < (first.open + first.close) / 2; // Last closes below first midpoint
  }

  private static isThreeWhiteSoldiers(first: CandlestickData, middle: CandlestickData, last: CandlestickData): boolean {
    return first.close > first.open &&
           middle.close > middle.open &&
           last.close > last.open &&
           middle.close > first.close &&
           last.close > middle.close &&
           middle.open > first.open &&
           middle.open < first.close &&
           last.open > middle.open &&
           last.open < middle.close;
  }

  private static isThreeBlackCrows(first: CandlestickData, middle: CandlestickData, last: CandlestickData): boolean {
    return first.close < first.open &&
           middle.close < middle.open &&
           last.close < last.open &&
           middle.close < first.close &&
           last.close < middle.close &&
           middle.open < first.open &&
           middle.open > first.close &&
           last.open < middle.open &&
           last.open > middle.close;
  }

  /**
   * Get pattern strength based on volume confirmation
   */
  static getPatternStrength(pattern: PatternResult, candles: CandlestickData[]): number {
    if (candles.length < 2) return pattern.confidence;

    const current = candles[candles.length - 1];
    const previous = candles[candles.length - 2];
    
    // Volume confirmation
    let volumeBonus = 0;
    if (current.volume > previous.volume * 1.2) {
      volumeBonus = 10;
    } else if (current.volume < previous.volume * 0.8) {
      volumeBonus = -5;
    }

    return Math.min(100, Math.max(0, pattern.confidence + volumeBonus));
  }
}