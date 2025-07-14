// Magic Triangle Core Implementation
// Advanced emotional pressure detection and pattern recognition
// Based on uploaded training materials and psychological market analysis

import { PricePoint } from '@/types/trading';

export interface EmotionalZoneAnalysis {
  pressureLevel: 'extreme' | 'high' | 'medium' | 'low';
  score: number; // 0-100
  volumeContext: {
    surge: boolean;
    dryUp: boolean;
    absorption: boolean;
    climax: boolean;
  };
  priceAction: {
    compression: boolean;
    breakoutPending: boolean;
    rejectionSignal: boolean;
    exhaustion: boolean;
  };
  timeframe: string;
  keyLevel: number;
  strength: number;
}

export interface PatternValidation {
  pattern: 'triangle_compression' | 'pressure_buildup' | 'exhaustion_reversal' | 'breakout_confirmation' | 'false_breakout' | 'none';
  isValid: boolean;
  confidence: number;
  invalidationLevel: number;
  confirmationCriteria: string[];
  metCriteria: string[];
  failedCriteria: string[];
  timeframeAlignment: boolean;
  volumeConfirmation: boolean;
}

export interface EntryExitRules {
  entryCondition: 'immediate' | 'pullback' | 'breakout' | 'reversal' | 'none';
  entryPrice: number;
  stopLoss: number;
  targets: number[];
  riskReward: number;
  positionSizing: number;
  timeframe: string;
  maxRisk: number;
  reasoning: string[];
}

export class MagicTriangleCore {

  /**
   * Core Emotional Pressure Analysis
   * Multi-timeframe psychological level analysis with volume context
   */
  public analyzeEmotionalPressure(
    priceData: PricePoint[],
    volumeData: { time: number; value: number }[],
    timeframe: string
  ): EmotionalZoneAnalysis {
    
    const currentPrice = priceData[priceData.length - 1];
    const recentPrices = priceData.slice(-30);
    const recentVolumes = volumeData.slice(-30);
    
    // 1. Key Level Identification (psychological levels)
    const keyLevel = this.identifyKeyPsychologicalLevel(currentPrice.close);
    const distanceToLevel = Math.abs(currentPrice.close - keyLevel) / currentPrice.close;
    
    // 2. Volume Context Analysis
    const volumeContext = this.analyzeVolumeContext(recentVolumes, recentPrices);
    
    // 3. Price Action Analysis
    const priceAction = this.analyzePriceAction(recentPrices, currentPrice);
    
    // 4. Multi-timeframe Pressure Calculation
    let pressureScore = 0;
    
    // Distance to psychological level (closer = higher pressure)
    pressureScore += Math.max(0, 30 - (distanceToLevel * 3000));
    
    // Volume surge/absorption patterns
    if (volumeContext.surge) pressureScore += 25;
    if (volumeContext.absorption) pressureScore += 20;
    if (volumeContext.climax) pressureScore += 30;
    if (volumeContext.dryUp) pressureScore += 15;
    
    // Price action compression/exhaustion
    if (priceAction.compression) pressureScore += 20;
    if (priceAction.exhaustion) pressureScore += 25;
    if (priceAction.rejectionSignal) pressureScore += 15;
    
    // Timeframe weight adjustment
    const timeframeWeight = this.getTimeframeEmotionalWeight(timeframe);
    pressureScore *= timeframeWeight;
    
    pressureScore = Math.min(100, Math.max(0, pressureScore));
    
    // Determine pressure level
    let pressureLevel: 'extreme' | 'high' | 'medium' | 'low';
    if (pressureScore >= 85) pressureLevel = 'extreme';
    else if (pressureScore >= 70) pressureLevel = 'high';
    else if (pressureScore >= 50) pressureLevel = 'medium';
    else pressureLevel = 'low';
    
    return {
      pressureLevel,
      score: pressureScore,
      volumeContext,
      priceAction,
      timeframe,
      keyLevel,
      strength: this.calculatePressureStrength(recentPrices, keyLevel)
    };
  }

  /**
   * Pattern Validation with Invalidation Logic
   * Based on training material pattern recognition rules
   */
  public validatePattern(
    priceData: PricePoint[],
    emotionalZone: EmotionalZoneAnalysis,
    candleAnalysis: any
  ): PatternValidation {
    
    const currentPrice = priceData[priceData.length - 1];
    const recentPrices = priceData.slice(-20);
    
    // Pattern detection based on emotional pressure and price action
    const pattern = this.detectMagicTrianglePattern(emotionalZone, candleAnalysis, recentPrices);
    
    // Confirmation criteria based on training materials
    const confirmationCriteria = [
      'Emotional pressure zone active (≥70)',
      'Volume confirmation present',
      'Clear price action signal',
      'Multi-timeframe alignment',
      'Psychological level confluence',
      'Pattern invalidation level defined'
    ];
    
    const metCriteria: string[] = [];
    const failedCriteria: string[] = [];
    
    // Check each criterion
    if (emotionalZone.score >= 70) {
      metCriteria.push('Emotional pressure zone active (≥70)');
    } else {
      failedCriteria.push('Emotional pressure zone active (≥70)');
    }
    
    if (emotionalZone.volumeContext.surge || emotionalZone.volumeContext.absorption) {
      metCriteria.push('Volume confirmation present');
    } else {
      failedCriteria.push('Volume confirmation present');
    }
    
    if (emotionalZone.priceAction.compression || emotionalZone.priceAction.exhaustion) {
      metCriteria.push('Clear price action signal');
    } else {
      failedCriteria.push('Clear price action signal');
    }
    
    const timeframeAlignment = this.checkTimeframeAlignment(recentPrices);
    if (timeframeAlignment) {
      metCriteria.push('Multi-timeframe alignment');
    } else {
      failedCriteria.push('Multi-timeframe alignment');
    }
    
    const psychologicalConfluence = Math.abs(currentPrice.close - emotionalZone.keyLevel) / currentPrice.close < 0.02;
    if (psychologicalConfluence) {
      metCriteria.push('Psychological level confluence');
    } else {
      failedCriteria.push('Psychological level confluence');
    }
    
    // Pattern invalidation level
    const invalidationLevel = this.calculateInvalidationLevel(currentPrice, emotionalZone, pattern);
    if (invalidationLevel > 0) {
      metCriteria.push('Pattern invalidation level defined');
    } else {
      failedCriteria.push('Pattern invalidation level defined');
    }
    
    // Pattern validation
    const isValid = metCriteria.length >= 4; // Need at least 4 out of 6 criteria
    const confidence = (metCriteria.length / confirmationCriteria.length) * 100;
    
    return {
      pattern,
      isValid,
      confidence,
      invalidationLevel,
      confirmationCriteria,
      metCriteria,
      failedCriteria,
      timeframeAlignment,
      volumeConfirmation: emotionalZone.volumeContext.surge || emotionalZone.volumeContext.absorption
    };
  }

  /**
   * Entry/Exit Rules Implementation
   * Based on training material risk management and entry logic
   */
  public generateEntryExitRules(
    priceData: PricePoint[],
    emotionalZone: EmotionalZoneAnalysis,
    patternValidation: PatternValidation,
    atr: number
  ): EntryExitRules {
    
    const currentPrice = priceData[priceData.length - 1];
    
    if (!patternValidation.isValid) {
      return {
        entryCondition: 'none',
        entryPrice: 0,
        stopLoss: 0,
        targets: [],
        riskReward: 0,
        positionSizing: 0,
        timeframe: emotionalZone.timeframe,
        maxRisk: 0.02, // 2% max risk
        reasoning: ['Pattern validation failed']
      };
    }
    
    // Determine entry condition based on pattern and emotional pressure
    let entryCondition: 'immediate' | 'pullback' | 'breakout' | 'reversal' | 'none';
    let entryPrice: number;
    let stopLoss: number;
    let targets: number[] = [];
    
    const direction = this.determineDirection(emotionalZone, patternValidation);
    
    if (direction === 'long') {
      // Long setup based on training materials
      entryCondition = emotionalZone.priceAction.breakoutPending ? 'breakout' : 'immediate';
      entryPrice = currentPrice.close;
      
      // Stop loss based on psychological levels and ATR
      const supportLevel = this.findNearestSupport(priceData.slice(-20));
      stopLoss = Math.min(supportLevel - (atr * 0.5), entryPrice - (atr * 1.5));
      
      // Targets based on resistance levels and R/R ratios
      const resistance1 = this.findNearestResistance(priceData.slice(-20));
      const resistance2 = emotionalZone.keyLevel;
      
      targets.push(entryPrice + (Math.abs(entryPrice - stopLoss) * 2.0)); // 2:1 R/R
      targets.push(entryPrice + (Math.abs(entryPrice - stopLoss) * 3.5)); // 3.5:1 R/R
      
    } else if (direction === 'short') {
      // Short setup based on training materials
      entryCondition = emotionalZone.priceAction.exhaustion ? 'reversal' : 'immediate';
      entryPrice = currentPrice.close;
      
      // Stop loss based on psychological levels and ATR
      const resistanceLevel = this.findNearestResistance(priceData.slice(-20));
      stopLoss = Math.max(resistanceLevel + (atr * 0.5), entryPrice + (atr * 1.5));
      
      // Targets based on support levels and R/R ratios
      targets.push(entryPrice - (Math.abs(stopLoss - entryPrice) * 2.0)); // 2:1 R/R
      targets.push(entryPrice - (Math.abs(stopLoss - entryPrice) * 3.5)); // 3.5:1 R/R
      
    } else {
      entryCondition = 'none';
      entryPrice = 0;
      stopLoss = 0;
    }
    
    const riskAmount = Math.abs(entryPrice - stopLoss);
    const rewardAmount = targets.length > 0 ? Math.abs(targets[0] - entryPrice) : 0;
    const riskReward = riskAmount > 0 ? rewardAmount / riskAmount : 0;
    
    // Position sizing based on risk management rules from training materials
    const maxRisk = 0.02; // 2% of account
    const positionSizing = maxRisk / (riskAmount / entryPrice);
    
    const reasoning = this.generateEntryReasoning(emotionalZone, patternValidation, direction);
    
    return {
      entryCondition,
      entryPrice,
      stopLoss,
      targets,
      riskReward,
      positionSizing,
      timeframe: emotionalZone.timeframe,
      maxRisk,
      reasoning
    };
  }

  // Helper methods implementation
  private identifyKeyPsychologicalLevel(price: number): number {
    // Round numbers, previous highs/lows, major levels
    const roundLevels = [
      Math.floor(price / 1000) * 1000,
      Math.ceil(price / 1000) * 1000,
      Math.floor(price / 500) * 500,
      Math.ceil(price / 500) * 500,
      Math.floor(price / 100) * 100,
      Math.ceil(price / 100) * 100
    ];
    
    // Find closest round level
    return roundLevels.reduce((closest, level) => 
      Math.abs(level - price) < Math.abs(closest - price) ? level : closest
    );
  }

  private analyzeVolumeContext(
    volumes: { time: number; value: number }[],
    prices: PricePoint[]
  ) {
    const avgVolume = volumes.reduce((sum, v) => sum + v.value, 0) / volumes.length;
    const recentVolumes = volumes.slice(-5);
    const currentVolume = volumes[volumes.length - 1]?.value || 0;
    
    return {
      surge: currentVolume > avgVolume * 2.5,
      dryUp: recentVolumes.every(v => v.value < avgVolume * 0.6),
      absorption: this.detectVolumeAbsorption(prices, volumes),
      climax: currentVolume > avgVolume * 4.0 && this.detectPriceExhaustion(prices)
    };
  }

  private analyzePriceAction(prices: PricePoint[], currentPrice: PricePoint) {
    const ranges = prices.map(p => p.high - p.low);
    const avgRange = ranges.reduce((sum, r) => sum + r, 0) / ranges.length;
    const currentRange = currentPrice.high - currentPrice.low;
    
    return {
      compression: currentRange < avgRange * 0.6,
      breakoutPending: this.detectCompressionPattern(prices),
      rejectionSignal: this.detectRejectionCandle(currentPrice),
      exhaustion: this.detectPriceExhaustion(prices.slice(-5))
    };
  }

  private detectVolumeAbsorption(prices: PricePoint[], volumes: { time: number; value: number }[]): boolean {
    if (prices.length < 3 || volumes.length < 3) return false;
    
    const lastThreePrices = prices.slice(-3);
    const lastThreeVolumes = volumes.slice(-3);
    
    // High volume with small price movement = absorption
    const avgVolume = volumes.reduce((sum, v) => sum + v.value, 0) / volumes.length;
    const highVolume = lastThreeVolumes.some(v => v.value > avgVolume * 1.5);
    const smallMovement = lastThreePrices.every(p => (p.high - p.low) < (p.close * 0.02));
    
    return highVolume && smallMovement;
  }

  private detectPriceExhaustion(prices: PricePoint[]): boolean {
    if (prices.length < 5) return false;
    
    // Look for diminishing momentum patterns
    const highs = prices.map(p => p.high);
    const lows = prices.map(p => p.low);
    
    const trend = highs[highs.length - 1] > highs[0] ? 'up' : 'down';
    
    if (trend === 'up') {
      // Higher highs with decreasing momentum
      return highs.slice(-3).every((high, i, arr) => i === 0 || high > arr[i-1]) &&
             this.detectDecreasingMomentum(prices);
    } else {
      // Lower lows with decreasing momentum
      return lows.slice(-3).every((low, i, arr) => i === 0 || low < arr[i-1]) &&
             this.detectDecreasingMomentum(prices);
    }
  }

  private detectDecreasingMomentum(prices: PricePoint[]): boolean {
    const ranges = prices.slice(-3).map(p => p.high - p.low);
    return ranges.length >= 2 && ranges[ranges.length - 1] < ranges[0];
  }

  private getTimeframeEmotionalWeight(timeframe: string): number {
    const weights = {
      '1m': 0.6,
      '5m': 0.8,
      '15m': 0.9,
      '1h': 1.0,
      '4h': 1.2,
      '1d': 1.4
    };
    return weights[timeframe as keyof typeof weights] || 1.0;
  }

  private calculatePressureStrength(prices: PricePoint[], keyLevel: number): number {
    // Count how many times price tested the level
    const tests = prices.filter(p => 
      Math.abs(p.high - keyLevel) / keyLevel < 0.01 || 
      Math.abs(p.low - keyLevel) / keyLevel < 0.01
    ).length;
    
    return Math.min(100, tests * 15);
  }

  private detectMagicTrianglePattern(
    emotionalZone: EmotionalZoneAnalysis,
    candleAnalysis: any,
    prices: PricePoint[]
  ): PatternValidation['pattern'] {
    
    if (emotionalZone.priceAction.compression && emotionalZone.volumeContext.dryUp) {
      return 'triangle_compression';
    }
    
    if (emotionalZone.pressureLevel === 'extreme' && emotionalZone.volumeContext.surge) {
      return 'pressure_buildup';
    }
    
    if (emotionalZone.priceAction.exhaustion && emotionalZone.volumeContext.climax) {
      return 'exhaustion_reversal';
    }
    
    if (emotionalZone.priceAction.breakoutPending && emotionalZone.volumeContext.surge) {
      return 'breakout_confirmation';
    }
    
    // Check for false breakout pattern
    if (this.detectFalseBreakout(prices, emotionalZone.keyLevel)) {
      return 'false_breakout';
    }
    
    return 'none';
  }

  private checkTimeframeAlignment(prices: PricePoint[]): boolean {
    // Simplified timeframe alignment check
    const trend = this.calculateTrend(prices);
    return Math.abs(trend) > 0.02; // At least 2% trend
  }

  private calculateTrend(prices: PricePoint[]): number {
    if (prices.length < 2) return 0;
    return (prices[prices.length - 1].close - prices[0].close) / prices[0].close;
  }

  private calculateInvalidationLevel(
    currentPrice: PricePoint,
    emotionalZone: EmotionalZoneAnalysis,
    pattern: PatternValidation['pattern']
  ): number {
    switch (pattern) {
      case 'triangle_compression':
        return emotionalZone.keyLevel * 0.98; // 2% below key level
      case 'pressure_buildup':
        return currentPrice.low * 0.95; // 5% below recent low
      case 'exhaustion_reversal':
        return currentPrice.high * 1.05; // 5% above recent high
      default:
        return currentPrice.close * 0.97; // 3% below current price
    }
  }

  private determineDirection(
    emotionalZone: EmotionalZoneAnalysis,
    patternValidation: PatternValidation
  ): 'long' | 'short' | 'none' {
    
    if (patternValidation.pattern === 'pressure_buildup' || patternValidation.pattern === 'triangle_compression') {
      // Pressure buildup at support = long
      // Pressure buildup at resistance = short
      return emotionalZone.keyLevel < emotionalZone.keyLevel ? 'long' : 'short';
    }
    
    if (patternValidation.pattern === 'exhaustion_reversal') {
      // Exhaustion at top = short, exhaustion at bottom = long
      return emotionalZone.priceAction.exhaustion ? 'short' : 'long';
    }
    
    if (patternValidation.pattern === 'breakout_confirmation') {
      // Direction based on breakout direction
      return 'long'; // Simplified - would analyze breakout direction
    }
    
    return 'none';
  }

  private findNearestSupport(prices: PricePoint[]): number {
    const lows = prices.map(p => p.low);
    return Math.min(...lows);
  }

  private findNearestResistance(prices: PricePoint[]): number {
    const highs = prices.map(p => p.high);
    return Math.max(...highs);
  }

  private detectCompressionPattern(prices: PricePoint[]): boolean {
    if (prices.length < 10) return false;
    
    const ranges = prices.slice(-10).map(p => p.high - p.low);
    const avgRange = ranges.reduce((sum, r) => sum + r, 0) / ranges.length;
    const recentRanges = ranges.slice(-3);
    
    return recentRanges.every(r => r < avgRange * 0.7);
  }

  private detectRejectionCandle(candle: PricePoint): boolean {
    const body = Math.abs(candle.close - candle.open);
    const upperWick = candle.high - Math.max(candle.open, candle.close);
    const lowerWick = Math.min(candle.open, candle.close) - candle.low;
    const totalRange = candle.high - candle.low;
    
    return (upperWick > body * 2) || (lowerWick > body * 2);
  }

  private detectFalseBreakout(prices: PricePoint[], keyLevel: number): boolean {
    if (prices.length < 5) return false;
    
    const recent = prices.slice(-3);
    const breakoutCandle = recent.find(p => p.high > keyLevel || p.low < keyLevel);
    
    if (!breakoutCandle) return false;
    
    // Check if price quickly returned inside the level
    const subsequentCandles = recent.slice(recent.indexOf(breakoutCandle) + 1);
    return subsequentCandles.some(p => 
      (breakoutCandle.high > keyLevel && p.close < keyLevel) ||
      (breakoutCandle.low < keyLevel && p.close > keyLevel)
    );
  }

  private generateEntryReasoning(
    emotionalZone: EmotionalZoneAnalysis,
    patternValidation: PatternValidation,
    direction: 'long' | 'short' | 'none'
  ): string[] {
    const reasoning = [];
    
    reasoning.push(`Magic Triangle ${patternValidation.pattern} pattern detected`);
    reasoning.push(`Emotional pressure level: ${emotionalZone.pressureLevel} (${emotionalZone.score.toFixed(1)}%)`);
    reasoning.push(`Volume context: ${Object.entries(emotionalZone.volumeContext).filter(([_, v]) => v).map(([k]) => k).join(', ')}`);
    reasoning.push(`Price action: ${Object.entries(emotionalZone.priceAction).filter(([_, v]) => v).map(([k]) => k).join(', ')}`);
    reasoning.push(`Key psychological level: $${emotionalZone.keyLevel.toFixed(2)}`);
    reasoning.push(`Pattern confidence: ${patternValidation.confidence.toFixed(1)}%`);
    
    if (direction !== 'none') {
      reasoning.push(`${direction.toUpperCase()} setup confirmed by ${patternValidation.metCriteria.length}/${patternValidation.confirmationCriteria.length} criteria`);
    }
    
    return reasoning;
  }
}

export const magicTriangleCore = new MagicTriangleCore();