// Magic Triangle Strategy Implementation (משולש הקסם)
// Based on comprehensive uploaded training materials
// Full emotional pressure zones, candle analysis, and psychological stop logic

import { PricePoint } from '@/types/trading';

export interface EmotionalPressureZone {
  level: 'extreme' | 'high' | 'medium' | 'low';
  score: number; // 0-100
  timeframe: string;
  volumeContext: {
    surgeDetected: boolean;
    dryUpDetected: boolean;
    absorptionDetected: boolean;
  };
  psychologicalLevel: number;
  resistanceStrength: number;
  supportStrength: number;
}

export interface CandleBehaviorAnalysis {
  pattern: 'engulfing' | 'doji' | 'hammer' | 'shooting_star' | 'spinning_top' | 'marubozu' | 'none';
  bodyRatio: number; // Body size / Total range
  wickAnalysis: {
    upperWick: number;
    lowerWick: number;
    upperWickRatio: number;
    lowerWickRatio: number;
  };
  volumeConfirmation: boolean;
  rejectionSignal: boolean;
  indecisionSignal: boolean;
  momentumSignal: boolean;
}

export interface PsychologicalStopZone {
  level: number;
  strength: number; // 0-100
  type: 'round_number' | 'previous_high' | 'previous_low' | 'fibonacci' | 'moving_average';
  testCount: number;
  lastTest: number;
  volumeAtLevel: number;
}

export interface PatternConfirmation {
  pattern: string;
  confirmed: boolean;
  confidence: number;
  invalidationLevel: number;
  confirmationCriteria: string[];
  metCriteria: string[];
  failedCriteria: string[];
}

export interface MagicTriangleSetup {
  isValid: boolean;
  direction: 'long' | 'short' | 'none';
  confidence: number;
  entry: number;
  stopLoss: number;
  target1: number;
  target2: number;
  riskRewardRatio: number;
  timeframe: string;
  
  // Core components
  emotionalPressure: EmotionalPressureZone;
  candleAnalysis: CandleBehaviorAnalysis;
  psychologicalStops: PsychologicalStopZone[];
  patternConfirmation: PatternConfirmation;
  
  // Supporting evidence
  fibonacciLevel: number;
  trendAlignment: boolean;
  volumeProfile: number;
  momentum: number;
  
  reasoning: string[];
  confluences: string[];
  warnings: string[];
}

export class MagicTriangleStrategy {
  
  /**
   * Main analysis function - performs complete Magic Triangle analysis
   */
  public analyzeMagicTriangle(
    priceData: PricePoint[], 
    volumeData: { time: number; value: number }[],
    symbol: string, 
    timeframe: string
  ): MagicTriangleSetup {
    
    if (priceData.length < 50) {
      return this.createEmptySetup('Insufficient data for analysis');
    }

    // 1. Emotional Pressure Zone Analysis (Multi-timeframe + Volume)
    const emotionalPressure = this.analyzeEmotionalPressureZones(priceData, volumeData, timeframe);
    
    // 2. Comprehensive Candle Behavior Analysis
    const candleAnalysis = this.analyzeCandleBehavior(priceData, volumeData);
    
    // 3. Psychological Stop Zone Identification
    const psychologicalStops = this.identifyPsychologicalStopZones(priceData, symbol);
    
    // 4. Pattern Confirmation and Invalidation Logic
    const patternConfirmation = this.analyzePatternConfirmation(priceData, emotionalPressure, candleAnalysis);
    
    // 5. Entry/Exit Rules Implementation
    const setup = this.generateMagicTriangleSetup(
      priceData,
      emotionalPressure,
      candleAnalysis,
      psychologicalStops,
      patternConfirmation,
      timeframe
    );
    
    return setup;
  }

  /**
   * Emotional Pressure Zones - Multi-timeframe analysis with volume context
   */
  private analyzeEmotionalPressureZones(
    priceData: PricePoint[], 
    volumeData: { time: number; value: number }[],
    timeframe: string
  ): EmotionalPressureZone {
    
    const recentPrices = priceData.slice(-20);
    const recentVolumes = volumeData.slice(-20);
    const currentPrice = recentPrices[recentPrices.length - 1];
    
    // Calculate pressure indicators
    const priceRange = this.calculateRecentRange(recentPrices);
    const volatility = this.calculateVolatility(recentPrices);
    const volumeProfile = this.analyzeVolumeProfile(recentVolumes);
    
    // Psychological levels (round numbers, previous highs/lows)
    const psychologicalLevel = this.findNearestPsychologicalLevel(currentPrice.close);
    const distanceToLevel = Math.abs(currentPrice.close - psychologicalLevel) / currentPrice.close;
    
    // Resistance/Support strength
    const resistanceStrength = this.calculateResistanceStrength(recentPrices, psychologicalLevel);
    const supportStrength = this.calculateSupportStrength(recentPrices, psychologicalLevel);
    
    // Volume context analysis
    const avgVolume = recentVolumes.reduce((sum, v) => sum + v.value, 0) / recentVolumes.length;
    const volumeContext = {
      surgeDetected: recentVolumes.slice(-3).some(v => v.value > avgVolume * 2.5),
      dryUpDetected: recentVolumes.slice(-5).every(v => v.value < avgVolume * 0.6),
      absorptionDetected: this.detectVolumeAbsorption(recentPrices, recentVolumes)
    };
    
    // Calculate emotional pressure score
    let pressureScore = 0;
    
    // Distance to psychological level (closer = higher pressure)
    pressureScore += (1 - distanceToLevel * 100) * 30;
    
    // Volatility component
    pressureScore += Math.min(volatility * 100, 25);
    
    // Volume surge/dry up
    if (volumeContext.surgeDetected) pressureScore += 20;
    if (volumeContext.dryUpDetected) pressureScore += 15;
    if (volumeContext.absorptionDetected) pressureScore += 25;
    
    // Resistance/Support strength
    pressureScore += (resistanceStrength + supportStrength) / 2 * 0.2;
    
    pressureScore = Math.min(100, Math.max(0, pressureScore));
    
    // Determine pressure level
    let level: 'extreme' | 'high' | 'medium' | 'low';
    if (pressureScore >= 80) level = 'extreme';
    else if (pressureScore >= 65) level = 'high';
    else if (pressureScore >= 40) level = 'medium';
    else level = 'low';
    
    return {
      level,
      score: pressureScore,
      timeframe,
      volumeContext,
      psychologicalLevel,
      resistanceStrength,
      supportStrength
    };
  }

  /**
   * Complete Candle Behavior Analysis
   */
  private analyzeCandleBehavior(
    priceData: PricePoint[], 
    volumeData: { time: number; value: number }[]
  ): CandleBehaviorAnalysis {
    
    const currentCandle = priceData[priceData.length - 1];
    const previousCandle = priceData[priceData.length - 2];
    
    // Calculate candle metrics
    const totalRange = currentCandle.high - currentCandle.low;
    const bodySize = Math.abs(currentCandle.close - currentCandle.open);
    const bodyRatio = totalRange > 0 ? bodySize / totalRange : 0;
    
    const upperWick = currentCandle.high - Math.max(currentCandle.open, currentCandle.close);
    const lowerWick = Math.min(currentCandle.open, currentCandle.close) - currentCandle.low;
    const upperWickRatio = totalRange > 0 ? upperWick / totalRange : 0;
    const lowerWickRatio = totalRange > 0 ? lowerWick / totalRange : 0;
    
    // Pattern detection
    const pattern = this.detectCandlestickPattern(currentCandle, previousCandle);
    
    // Volume confirmation
    const avgVolume = volumeData.slice(-10).reduce((sum, v) => sum + v.value, 0) / 10;
    const currentVolume = volumeData[volumeData.length - 1]?.value || 0;
    const volumeConfirmation = currentVolume > avgVolume * 1.3;
    
    // Signal analysis
    const rejectionSignal = upperWickRatio > 0.4 || lowerWickRatio > 0.4;
    const indecisionSignal = bodyRatio < 0.3 && upperWickRatio > 0.25 && lowerWickRatio > 0.25;
    const momentumSignal = bodyRatio > 0.7 && volumeConfirmation;
    
    return {
      pattern,
      bodyRatio,
      wickAnalysis: {
        upperWick,
        lowerWick,
        upperWickRatio,
        lowerWickRatio
      },
      volumeConfirmation,
      rejectionSignal,
      indecisionSignal,
      momentumSignal
    };
  }

  /**
   * Psychological Stop Zones Identification
   */
  private identifyPsychologicalStopZones(priceData: PricePoint[], symbol: string): PsychologicalStopZone[] {
    const zones: PsychologicalStopZone[] = [];
    const recentPrices = priceData.slice(-50);
    const currentPrice = recentPrices[recentPrices.length - 1].close;
    
    // Round number zones
    const roundNumbers = this.generateRoundNumberZones(currentPrice);
    zones.push(...roundNumbers);
    
    // Previous highs and lows
    const pivots = this.findSignificantPivots(recentPrices);
    zones.push(...pivots);
    
    // Fibonacci levels
    const fibZones = this.calculateFibonacciZones(recentPrices);
    zones.push(...fibZones);
    
    // Moving average zones
    const maZones = this.calculateMovingAverageZones(recentPrices);
    zones.push(...maZones);
    
    // Sort by proximity to current price and filter relevant zones
    return zones
      .filter(zone => Math.abs(zone.level - currentPrice) / currentPrice < 0.1) // Within 10%
      .sort((a, b) => Math.abs(a.level - currentPrice) - Math.abs(b.level - currentPrice))
      .slice(0, 8); // Keep top 8 most relevant zones
  }

  /**
   * Pattern Confirmation and Invalidation Logic
   */
  private analyzePatternConfirmation(
    priceData: PricePoint[],
    emotionalPressure: EmotionalPressureZone,
    candleAnalysis: CandleBehaviorAnalysis
  ): PatternConfirmation {
    
    const currentPrice = priceData[priceData.length - 1].close;
    
    // Define confirmation criteria based on Magic Triangle rules
    const confirmationCriteria = [
      'Emotional pressure zone active (≥65)',
      'Volume confirmation present',
      'Clear candlestick signal',
      'Fibonacci level confluence',
      'Trend alignment confirmed'
    ];
    
    const metCriteria: string[] = [];
    const failedCriteria: string[] = [];
    
    // Check each criterion
    if (emotionalPressure.score >= 65) {
      metCriteria.push('Emotional pressure zone active (≥65)');
    } else {
      failedCriteria.push('Emotional pressure zone active (≥65)');
    }
    
    if (candleAnalysis.volumeConfirmation) {
      metCriteria.push('Volume confirmation present');
    } else {
      failedCriteria.push('Volume confirmation present');
    }
    
    if (candleAnalysis.pattern !== 'none' && (candleAnalysis.rejectionSignal || candleAnalysis.momentumSignal)) {
      metCriteria.push('Clear candlestick signal');
    } else {
      failedCriteria.push('Clear candlestick signal');
    }
    
    // Fibonacci confluence check
    const fibLevels = this.calculateFibonacciLevels(priceData.slice(-30));
    const nearFibLevel = Object.values(fibLevels).some(level => 
      Math.abs(currentPrice - level) / currentPrice < 0.01
    );
    
    if (nearFibLevel) {
      metCriteria.push('Fibonacci level confluence');
    } else {
      failedCriteria.push('Fibonacci level confluence');
    }
    
    // Trend alignment
    const trend = this.calculateTrendAlignment(priceData.slice(-20));
    if (Math.abs(trend) > 0.02) { // At least 2% trend
      metCriteria.push('Trend alignment confirmed');
    } else {
      failedCriteria.push('Trend alignment confirmed');
    }
    
    // Pattern confirmation
    const confirmed = metCriteria.length >= 3; // Need at least 3 criteria
    const confidence = (metCriteria.length / confirmationCriteria.length) * 100;
    
    // Calculate invalidation level
    const invalidationLevel = this.calculateInvalidationLevel(priceData, emotionalPressure);
    
    return {
      pattern: 'Magic Triangle Setup',
      confirmed,
      confidence,
      invalidationLevel,
      confirmationCriteria,
      metCriteria,
      failedCriteria
    };
  }

  /**
   * Generate complete Magic Triangle setup with entry/exit rules
   */
  private generateMagicTriangleSetup(
    priceData: PricePoint[],
    emotionalPressure: EmotionalPressureZone,
    candleAnalysis: CandleBehaviorAnalysis,
    psychologicalStops: PsychologicalStopZone[],
    patternConfirmation: PatternConfirmation,
    timeframe: string
  ): MagicTriangleSetup {
    
    const currentPrice = priceData[priceData.length - 1].close;
    const atr = this.calculateATR(priceData.slice(-20));
    
    // Determine direction based on analysis
    let direction: 'long' | 'short' | 'none' = 'none';
    
    if (patternConfirmation.confirmed) {
      if (emotionalPressure.level === 'extreme' || emotionalPressure.level === 'high') {
        // High pressure at resistance = short setup
        // High pressure at support = long setup
        if (emotionalPressure.resistanceStrength > emotionalPressure.supportStrength) {
          direction = 'short';
        } else {
          direction = 'long';
        }
      }
    }
    
    if (direction === 'none') {
      return this.createEmptySetup('No valid Magic Triangle setup detected');
    }
    
    // Calculate entry, stops, and targets
    const entry = currentPrice;
    let stopLoss: number;
    let target1: number;
    let target2: number;
    
    if (direction === 'long') {
      // Long setup: Stop below recent low, targets above
      const recentLow = Math.min(...priceData.slice(-10).map(p => p.low));
      stopLoss = Math.min(recentLow - (atr * 0.5), entry - (atr * 1.5));
      target1 = entry + (Math.abs(entry - stopLoss) * 1.8); // 1.8:1 R/R
      target2 = entry + (Math.abs(entry - stopLoss) * 3.0); // 3:1 R/R
    } else {
      // Short setup: Stop above recent high, targets below
      const recentHigh = Math.max(...priceData.slice(-10).map(p => p.high));
      stopLoss = Math.max(recentHigh + (atr * 0.5), entry + (atr * 1.5));
      target1 = entry - (Math.abs(stopLoss - entry) * 1.8); // 1.8:1 R/R
      target2 = entry - (Math.abs(stopLoss - entry) * 3.0); // 3:1 R/R
    }
    
    const riskAmount = Math.abs(entry - stopLoss);
    const rewardAmount = Math.abs(target1 - entry);
    const riskRewardRatio = rewardAmount / riskAmount;
    
    // Calculate overall confidence
    const baseConfidence = patternConfirmation.confidence;
    const pressureBonus = emotionalPressure.score * 0.3;
    const candleBonus = this.getCandleConfidenceBonus(candleAnalysis);
    const finalConfidence = Math.min(95, baseConfidence + pressureBonus + candleBonus);
    
    // Generate reasoning and confluences
    const reasoning = this.generateMagicTriangleReasoning(
      emotionalPressure, candleAnalysis, patternConfirmation, direction
    );
    
    const confluences = this.generateMagicTriangleConfluences(
      emotionalPressure, candleAnalysis, psychologicalStops
    );
    
    const warnings = this.generateMagicTriangleWarnings(
      emotionalPressure, candleAnalysis, riskRewardRatio
    );
    
    return {
      isValid: true,
      direction,
      confidence: finalConfidence,
      entry,
      stopLoss,
      target1,
      target2,
      riskRewardRatio,
      timeframe,
      emotionalPressure,
      candleAnalysis,
      psychologicalStops,
      patternConfirmation,
      fibonacciLevel: this.getNearestFibLevel(priceData, currentPrice),
      trendAlignment: this.calculateTrendAlignment(priceData.slice(-20)) > 0,
      volumeProfile: emotionalPressure.score,
      momentum: candleAnalysis.momentumSignal ? 80 : 40,
      reasoning,
      confluences,
      warnings
    };
  }

  // Helper methods
  private createEmptySetup(reason: string): MagicTriangleSetup {
    return {
      isValid: false,
      direction: 'none',
      confidence: 0,
      entry: 0,
      stopLoss: 0,
      target1: 0,
      target2: 0,
      riskRewardRatio: 0,
      timeframe: '',
      emotionalPressure: {} as EmotionalPressureZone,
      candleAnalysis: {} as CandleBehaviorAnalysis,
      psychologicalStops: [],
      patternConfirmation: {} as PatternConfirmation,
      fibonacciLevel: 0,
      trendAlignment: false,
      volumeProfile: 0,
      momentum: 0,
      reasoning: [reason],
      confluences: [],
      warnings: []
    };
  }

  private calculateRecentRange(prices: PricePoint[]): number {
    const highs = prices.map(p => p.high);
    const lows = prices.map(p => p.low);
    return Math.max(...highs) - Math.min(...lows);
  }

  private calculateVolatility(prices: PricePoint[]): number {
    const returns = [];
    for (let i = 1; i < prices.length; i++) {
      returns.push((prices[i].close - prices[i-1].close) / prices[i-1].close);
    }
    const mean = returns.reduce((sum, r) => sum + r, 0) / returns.length;
    const variance = returns.reduce((sum, r) => sum + Math.pow(r - mean, 2), 0) / returns.length;
    return Math.sqrt(variance);
  }

  private analyzeVolumeProfile(volumes: { time: number; value: number }[]): number {
    const avgVolume = volumes.reduce((sum, v) => sum + v.value, 0) / volumes.length;
    const recentVolume = volumes[volumes.length - 1]?.value || 0;
    return recentVolume / avgVolume;
  }

  private findNearestPsychologicalLevel(price: number): number {
    const magnitude = Math.pow(10, Math.floor(Math.log10(price)));
    const normalized = price / magnitude;
    
    const levels = [1, 1.5, 2, 2.5, 3, 4, 5, 6, 7, 8, 9, 10];
    const nearest = levels.reduce((prev, curr) => 
      Math.abs(curr - normalized) < Math.abs(prev - normalized) ? curr : prev
    );
    
    return nearest * magnitude;
  }

  private calculateResistanceStrength(prices: PricePoint[], level: number): number {
    let touches = 0;
    let rejections = 0;
    
    for (const price of prices) {
      const distanceToLevel = Math.abs(price.high - level) / level;
      if (distanceToLevel < 0.005) { // Within 0.5%
        touches++;
        if (price.close < level) rejections++;
      }
    }
    
    return touches > 0 ? (rejections / touches) * 100 : 0;
  }

  private calculateSupportStrength(prices: PricePoint[], level: number): number {
    let touches = 0;
    let bounces = 0;
    
    for (const price of prices) {
      const distanceToLevel = Math.abs(price.low - level) / level;
      if (distanceToLevel < 0.005) { // Within 0.5%
        touches++;
        if (price.close > level) bounces++;
      }
    }
    
    return touches > 0 ? (bounces / touches) * 100 : 0;
  }

  private detectVolumeAbsorption(prices: PricePoint[], volumes: { time: number; value: number }[]): boolean {
    // High volume with small price movement indicates absorption
    const recentPrices = prices.slice(-5);
    const recentVolumes = volumes.slice(-5);
    
    const avgVolume = volumes.slice(-20).reduce((sum, v) => sum + v.value, 0) / 20;
    const priceRange = Math.max(...recentPrices.map(p => p.high)) - Math.min(...recentPrices.map(p => p.low));
    const avgPriceRange = prices.slice(-20).reduce((sum, p) => sum + (p.high - p.low), 0) / 20;
    
    const highVolume = recentVolumes.some(v => v.value > avgVolume * 2);
    const smallRange = priceRange < avgPriceRange * 0.7;
    
    return highVolume && smallRange;
  }

  private detectCandlestickPattern(current: PricePoint, previous: PricePoint): CandleBehaviorAnalysis['pattern'] {
    const currentBody = Math.abs(current.close - current.open);
    const currentRange = current.high - current.low;
    const bodyRatio = currentRange > 0 ? currentBody / currentRange : 0;
    
    // Doji pattern
    if (bodyRatio < 0.1) return 'doji';
    
    // Engulfing patterns
    if (previous.close < previous.open && current.close > current.open &&
        current.open < previous.close && current.close > previous.open) {
      return 'engulfing';
    }
    
    if (previous.close > previous.open && current.close < current.open &&
        current.open > previous.close && current.close < previous.open) {
      return 'engulfing';
    }
    
    // Hammer/Shooting star
    const upperWick = current.high - Math.max(current.open, current.close);
    const lowerWick = Math.min(current.open, current.close) - current.low;
    
    if (lowerWick > currentBody * 2 && upperWick < currentBody * 0.5) return 'hammer';
    if (upperWick > currentBody * 2 && lowerWick < currentBody * 0.5) return 'shooting_star';
    
    // Marubozu
    if (bodyRatio > 0.95) return 'marubozu';
    
    // Spinning top
    if (bodyRatio < 0.4 && upperWick > currentBody * 0.5 && lowerWick > currentBody * 0.5) {
      return 'spinning_top';
    }
    
    return 'none';
  }

  private generateRoundNumberZones(price: number): PsychologicalStopZone[] {
    const zones: PsychologicalStopZone[] = [];
    const magnitude = Math.pow(10, Math.floor(Math.log10(price)));
    
    // Generate round numbers around current price
    for (let i = -2; i <= 2; i++) {
      const level = Math.round((price + i * magnitude * 0.5) / (magnitude * 0.5)) * (magnitude * 0.5);
      if (level > 0 && Math.abs(level - price) / price < 0.1) {
        zones.push({
          level,
          strength: 70,
          type: 'round_number',
          testCount: 0,
          lastTest: 0,
          volumeAtLevel: 0
        });
      }
    }
    
    return zones;
  }

  private findSignificantPivots(prices: PricePoint[]): PsychologicalStopZone[] {
    const zones: PsychologicalStopZone[] = [];
    
    // Find swing highs and lows
    for (let i = 2; i < prices.length - 2; i++) {
      const current = prices[i];
      const isSwingHigh = current.high > prices[i-2].high && current.high > prices[i-1].high &&
                         current.high > prices[i+1].high && current.high > prices[i+2].high;
      const isSwingLow = current.low < prices[i-2].low && current.low < prices[i-1].low &&
                        current.low < prices[i+1].low && current.low < prices[i+2].low;
      
      if (isSwingHigh) {
        zones.push({
          level: current.high,
          strength: 80,
          type: 'previous_high',
          testCount: 1,
          lastTest: current.timestamp,
          volumeAtLevel: current.volume || 0
        });
      }
      
      if (isSwingLow) {
        zones.push({
          level: current.low,
          strength: 80,
          type: 'previous_low',
          testCount: 1,
          lastTest: current.timestamp,
          volumeAtLevel: current.volume || 0
        });
      }
    }
    
    return zones.slice(-10); // Keep most recent 10 pivots
  }

  private calculateFibonacciZones(prices: PricePoint[]): PsychologicalStopZone[] {
    const high = Math.max(...prices.map(p => p.high));
    const low = Math.min(...prices.map(p => p.low));
    const range = high - low;
    
    const fibLevels = [0.236, 0.382, 0.5, 0.618, 0.786];
    
    return fibLevels.map(level => ({
      level: high - (range * level),
      strength: level === 0.618 || level === 0.382 ? 90 : 75,
      type: 'fibonacci' as const,
      testCount: 0,
      lastTest: 0,
      volumeAtLevel: 0
    }));
  }

  private calculateMovingAverageZones(prices: PricePoint[]): PsychologicalStopZone[] {
    const zones: PsychologicalStopZone[] = [];
    const periods = [20, 50, 200];
    
    for (const period of periods) {
      if (prices.length >= period) {
        const ma = prices.slice(-period).reduce((sum, p) => sum + p.close, 0) / period;
        zones.push({
          level: ma,
          strength: period === 200 ? 85 : period === 50 ? 75 : 65,
          type: 'moving_average',
          testCount: 0,
          lastTest: 0,
          volumeAtLevel: 0
        });
      }
    }
    
    return zones;
  }

  private calculateFibonacciLevels(prices: PricePoint[]): Record<number, number> {
    const high = Math.max(...prices.map(p => p.high));
    const low = Math.min(...prices.map(p => p.low));
    const range = high - low;
    
    return {
      0: high,
      0.236: high - range * 0.236,
      0.382: high - range * 0.382,
      0.5: high - range * 0.5,
      0.618: high - range * 0.618,
      0.786: high - range * 0.786,
      1: low
    };
  }

  private calculateTrendAlignment(prices: PricePoint[]): number {
    const closes = prices.map(p => p.close);
    const firstHalf = closes.slice(0, Math.floor(closes.length / 2));
    const secondHalf = closes.slice(Math.floor(closes.length / 2));
    
    const firstAvg = firstHalf.reduce((sum, p) => sum + p, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((sum, p) => sum + p, 0) / secondHalf.length;
    
    return (secondAvg - firstAvg) / firstAvg;
  }

  private calculateInvalidationLevel(prices: PricePoint[], emotionalPressure: EmotionalPressureZone): number {
    const currentPrice = prices[prices.length - 1].close;
    const atr = this.calculateATR(prices.slice(-20));
    
    // Invalidation is typically 1-2 ATR beyond the psychological level
    return emotionalPressure.resistanceStrength > emotionalPressure.supportStrength 
      ? emotionalPressure.psychologicalLevel + (atr * 1.5)
      : emotionalPressure.psychologicalLevel - (atr * 1.5);
  }

  private calculateATR(prices: PricePoint[]): number {
    let atrSum = 0;
    for (let i = 1; i < prices.length; i++) {
      const current = prices[i];
      const previous = prices[i - 1];
      
      const tr = Math.max(
        current.high - current.low,
        Math.abs(current.high - previous.close),
        Math.abs(current.low - previous.close)
      );
      
      atrSum += tr;
    }
    
    return atrSum / (prices.length - 1);
  }

  private getCandleConfidenceBonus(candleAnalysis: CandleBehaviorAnalysis): number {
    let bonus = 0;
    
    if (candleAnalysis.pattern !== 'none') bonus += 5;
    if (candleAnalysis.volumeConfirmation) bonus += 10;
    if (candleAnalysis.rejectionSignal) bonus += 8;
    if (candleAnalysis.momentumSignal) bonus += 12;
    
    return Math.min(25, bonus);
  }

  private getNearestFibLevel(prices: PricePoint[], currentPrice: number): number {
    const fibLevels = this.calculateFibonacciLevels(prices.slice(-30));
    
    let nearestLevel = 0.5;
    let smallestDistance = Infinity;
    
    for (const [levelKey, levelValue] of Object.entries(fibLevels)) {
      const distance = Math.abs(currentPrice - levelValue);
      if (distance < smallestDistance) {
        smallestDistance = distance;
        nearestLevel = parseFloat(levelKey);
      }
    }
    
    return nearestLevel;
  }

  private generateMagicTriangleReasoning(
    emotionalPressure: EmotionalPressureZone,
    candleAnalysis: CandleBehaviorAnalysis,
    patternConfirmation: PatternConfirmation,
    direction: 'long' | 'short'
  ): string[] {
    const reasoning: string[] = [];
    
    reasoning.push(`🎯 Magic Triangle ${direction.toUpperCase()} setup detected`);
    reasoning.push(`💥 Emotional pressure: ${emotionalPressure.level} (${emotionalPressure.score.toFixed(0)}%)`);
    
    if (candleAnalysis.pattern !== 'none') {
      reasoning.push(`🕯️ Candlestick pattern: ${candleAnalysis.pattern.replace('_', ' ')}`);
    }
    
    if (emotionalPressure.volumeContext.surgeDetected) {
      reasoning.push(`📊 Volume surge detected - institutional activity`);
    }
    
    if (emotionalPressure.volumeContext.absorptionDetected) {
      reasoning.push(`🧽 Volume absorption at key level`);
    }
    
    if (candleAnalysis.rejectionSignal) {
      reasoning.push(`❌ Price rejection signal confirmed`);
    }
    
    if (candleAnalysis.momentumSignal) {
      reasoning.push(`🚀 Strong momentum signal with volume`);
    }
    
    reasoning.push(`✅ Pattern confirmation: ${patternConfirmation.confidence.toFixed(0)}%`);
    
    return reasoning;
  }

  private generateMagicTriangleConfluences(
    emotionalPressure: EmotionalPressureZone,
    candleAnalysis: CandleBehaviorAnalysis,
    psychologicalStops: PsychologicalStopZone[]
  ): string[] {
    const confluences: string[] = [];
    
    confluences.push('Magic Triangle Setup');
    confluences.push(`Emotional Pressure Zone (${emotionalPressure.level})`);
    
    if (candleAnalysis.pattern !== 'none') {
      confluences.push(`Candlestick Pattern (${candleAnalysis.pattern})`);
    }
    
    if (candleAnalysis.volumeConfirmation) {
      confluences.push('Volume Confirmation');
    }
    
    // Add psychological levels confluence
    const strongLevels = psychologicalStops.filter(zone => zone.strength > 80);
    if (strongLevels.length > 0) {
      confluences.push(`${strongLevels.length} Strong Psychological Level(s)`);
    }
    
    if (emotionalPressure.volumeContext.absorptionDetected) {
      confluences.push('Volume Absorption');
    }
    
    return confluences;
  }

  private generateMagicTriangleWarnings(
    emotionalPressure: EmotionalPressureZone,
    candleAnalysis: CandleBehaviorAnalysis,
    riskRewardRatio: number
  ): string[] {
    const warnings: string[] = [];
    
    if (emotionalPressure.score < 50) {
      warnings.push('⚠️ Low emotional pressure - setup may lack conviction');
    }
    
    if (!candleAnalysis.volumeConfirmation) {
      warnings.push('⚠️ No volume confirmation - watch for fake moves');
    }
    
    if (riskRewardRatio < 1.8) {
      warnings.push('⚠️ Risk/Reward ratio below 1.8:1');
    }
    
    if (candleAnalysis.indecisionSignal) {
      warnings.push('⚠️ Indecision candle detected - wait for confirmation');
    }
    
    return warnings;
  }
}

export const magicTriangleStrategy = new MagicTriangleStrategy();