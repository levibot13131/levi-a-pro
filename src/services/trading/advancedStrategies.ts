// Advanced Trading Strategies Integration
// Complete implementation of Wyckoff, SMC, Elliott Waves, Fibonacci, and more

import { PricePoint } from '@/types/trading';

export interface WyckoffAnalysis {
  phase: 'accumulation' | 'markup' | 'distribution' | 'markdown' | 'unknown';
  subPhase: string;
  confidence: number;
  keyLevels: number[];
  volumeSignals: string[];
  priceAction: string[];
  nextTarget: number;
  invalidationLevel: number;
}

export interface SMCAnalysis {
  structure: 'bullish' | 'bearish' | 'neutral';
  bos: boolean; // Break of Structure
  choch: boolean; // Change of Character
  orderBlocks: { level: number; type: 'bullish' | 'bearish'; strength: number }[];
  fairValueGaps: { top: number; bottom: number; filled: boolean }[];
  liquidityLevels: { level: number; type: 'buy' | 'sell'; strength: number }[];
  breakers: { level: number; type: 'bullish' | 'bearish'; active: boolean }[];
  confidence: number;
}

export interface ElliottWaveAnalysis {
  currentWave: '1' | '2' | '3' | '4' | '5' | 'A' | 'B' | 'C';
  waveType: 'impulse' | 'corrective';
  degree: 'primary' | 'intermediate' | 'minor';
  projectedTarget: number;
  invalidationLevel: number;
  confidence: number;
  subWaveCount: number;
  fibonacciTargets: number[];
}

export interface FibonacciAnalysis {
  retracementLevels: { level: number; price: number; tested: boolean }[];
  extensionLevels: { level: number; price: number; strength: number }[];
  activeSupport: number[];
  activeResistance: number[];
  keyZone: { top: number; bottom: number; strength: 'strong' | 'medium' | 'weak' };
  confluence: number;
}

export interface VolumeProfileAnalysis {
  pocLevel: number; // Point of Control
  valueAreaHigh: number;
  valueAreaLow: number;
  highVolumeNodes: number[];
  lowVolumeNodes: number[];
  volumeImbalance: { level: number; direction: 'up' | 'down' }[];
  strength: number;
}

export class AdvancedStrategies {

  /**
   * Complete Wyckoff Method Analysis
   */
  public analyzeWyckoff(priceData: PricePoint[], volumeData: number[]): WyckoffAnalysis {
    const recentPrices = priceData.slice(-100); // Last 100 candles
    const recentVolumes = volumeData.slice(-100);
    
    // Phase identification
    const phase = this.identifyWyckoffPhase(recentPrices, recentVolumes);
    const subPhase = this.identifyWyckoffSubPhase(recentPrices, recentVolumes, phase);
    
    // Key level identification
    const keyLevels = this.findWyckoffKeyLevels(recentPrices, recentVolumes);
    
    // Volume analysis
    const volumeSignals = this.analyzeWyckoffVolume(recentPrices, recentVolumes);
    
    // Price action analysis
    const priceAction = this.analyzeWyckoffPriceAction(recentPrices);
    
    // Calculate confidence based on volume-price relationship
    const confidence = this.calculateWyckoffConfidence(recentPrices, recentVolumes, phase);
    
    return {
      phase,
      subPhase,
      confidence,
      keyLevels,
      volumeSignals,
      priceAction,
      nextTarget: this.calculateWyckoffTarget(recentPrices, phase),
      invalidationLevel: this.calculateWyckoffInvalidation(recentPrices, phase)
    };
  }

  /**
   * Smart Money Concepts (SMC) Analysis
   */
  public analyzeSMC(priceData: PricePoint[]): SMCAnalysis {
    const recentPrices = priceData.slice(-50);
    
    // Market structure analysis
    const structure = this.identifyMarketStructure(recentPrices);
    
    // Break of Structure detection
    const bos = this.detectBreakOfStructure(recentPrices);
    
    // Change of Character detection
    const choch = this.detectChangeOfCharacter(recentPrices);
    
    // Order Blocks identification
    const orderBlocks = this.identifyOrderBlocks(recentPrices);
    
    // Fair Value Gap detection
    const fairValueGaps = this.identifyFairValueGaps(recentPrices);
    
    // Liquidity level identification
    const liquidityLevels = this.identifyLiquidityLevels(recentPrices);
    
    // Breaker blocks
    const breakers = this.identifyBreakerBlocks(recentPrices);
    
    const confidence = this.calculateSMCConfidence(structure, bos, choch, orderBlocks);
    
    return {
      structure,
      bos,
      choch,
      orderBlocks,
      fairValueGaps,
      liquidityLevels,
      breakers,
      confidence
    };
  }

  /**
   * Elliott Wave Analysis
   */
  public analyzeElliottWave(priceData: PricePoint[]): ElliottWaveAnalysis {
    const prices = priceData.slice(-200); // Analyze last 200 candles
    
    // Identify major swing points
    const swingPoints = this.identifySwingPoints(prices);
    
    // Wave counting
    const waveCount = this.countElliottWaves(swingPoints);
    
    // Current wave identification
    const currentWave = this.identifyCurrentWave(waveCount);
    
    // Wave type (impulse or corrective)
    const waveType = this.identifyWaveType(waveCount);
    
    // Fibonacci projections
    const fibonacciTargets = this.calculateWaveTargets(swingPoints, currentWave);
    
    const confidence = this.calculateWaveConfidence(waveCount, swingPoints);
    
    return {
      currentWave,
      waveType,
      degree: 'intermediate',
      projectedTarget: fibonacciTargets[0] || 0,
      invalidationLevel: this.calculateWaveInvalidation(swingPoints, currentWave),
      confidence,
      subWaveCount: waveCount.length,
      fibonacciTargets
    };
  }

  /**
   * Comprehensive Fibonacci Analysis
   */
  public analyzeFibonacci(priceData: PricePoint[]): FibonacciAnalysis {
    const prices = priceData.slice(-100);
    
    // Find major swing high and low
    const swingHigh = Math.max(...prices.map(p => p.high));
    const swingLow = Math.min(...prices.map(p => p.low));
    const range = swingHigh - swingLow;
    
    // Calculate retracement levels
    const fibLevels = [0.236, 0.382, 0.5, 0.618, 0.786];
    const retracementLevels = fibLevels.map(level => ({
      level,
      price: swingHigh - (range * level),
      tested: this.isPriceLevelTested(prices, swingHigh - (range * level))
    }));
    
    // Calculate extension levels
    const extensionLevels = [1.272, 1.414, 1.618, 2.0, 2.618].map(level => ({
      level,
      price: swingHigh + (range * (level - 1)),
      strength: this.calculateFibStrength(prices, swingHigh + (range * (level - 1)))
    }));
    
    // Identify active support/resistance
    const activeSupport = retracementLevels
      .filter(level => level.price < prices[prices.length - 1].close)
      .map(level => level.price);
      
    const activeResistance = retracementLevels
      .filter(level => level.price > prices[prices.length - 1].close)
      .map(level => level.price);
    
    // Key zone identification
    const keyZone = this.identifyKeyFibZone(retracementLevels, prices);
    
    // Confluence calculation
    const confluence = this.calculateFibConfluence(retracementLevels, extensionLevels);
    
    return {
      retracementLevels,
      extensionLevels,
      activeSupport,
      activeResistance,
      keyZone,
      confluence
    };
  }

  /**
   * Volume Profile Analysis
   */
  public analyzeVolumeProfile(priceData: PricePoint[], volumeData: number[]): VolumeProfileAnalysis {
    const profiles = this.buildVolumeProfile(priceData, volumeData);
    
    // Point of Control (highest volume level)
    const pocLevel = this.findPointOfControl(profiles);
    
    // Value Area (70% of volume)
    const valueArea = this.calculateValueArea(profiles);
    
    // High Volume Nodes
    const highVolumeNodes = this.identifyHighVolumeNodes(profiles);
    
    // Low Volume Nodes (gaps)
    const lowVolumeNodes = this.identifyLowVolumeNodes(profiles);
    
    // Volume imbalances
    const volumeImbalance = this.identifyVolumeImbalances(priceData, volumeData);
    
    const strength = this.calculateVolumeProfileStrength(profiles);
    
    return {
      pocLevel,
      valueAreaHigh: valueArea.high,
      valueAreaLow: valueArea.low,
      highVolumeNodes,
      lowVolumeNodes,
      volumeImbalance,
      strength
    };
  }

  /**
   * Confluence Analysis - Combine all methods
   */
  public analyzeConfluence(
    wyckoff: WyckoffAnalysis,
    smc: SMCAnalysis,
    elliott: ElliottWaveAnalysis,
    fibonacci: FibonacciAnalysis,
    volumeProfile: VolumeProfileAnalysis
  ): {
    confluenceScore: number;
    keyLevels: number[];
    direction: 'bullish' | 'bearish' | 'neutral';
    strength: 'strong' | 'medium' | 'weak';
    methods: string[];
  } {
    const confluenceLevels: { level: number; methods: string[]; score: number }[] = [];
    
    // Collect key levels from all methods
    wyckoff.keyLevels.forEach(level => {
      confluenceLevels.push({ level, methods: ['Wyckoff'], score: wyckoff.confidence });
    });
    
    smc.orderBlocks.forEach(ob => {
      confluenceLevels.push({ level: ob.level, methods: ['SMC'], score: smc.confidence });
    });
    
    fibonacci.retracementLevels.forEach(fib => {
      confluenceLevels.push({ level: fib.price, methods: ['Fibonacci'], score: 70 });
    });
    
    // Add Volume Profile levels
    confluenceLevels.push({ 
      level: volumeProfile.pocLevel, 
      methods: ['Volume Profile'], 
      score: volumeProfile.strength 
    });
    
    // Find confluences (levels within 1% of each other)
    const confluences = this.findLevelConfluences(confluenceLevels);
    
    // Calculate overall direction
    const direction = this.calculateOverallDirection(wyckoff, smc, elliott);
    
    // Calculate strength
    const strength = this.calculateConfluenceStrength(confluences);
    
    return {
      confluenceScore: confluences.reduce((sum, c) => sum + c.score, 0) / confluences.length || 0,
      keyLevels: confluences.map(c => c.level),
      direction,
      strength,
      methods: [...new Set(confluences.flatMap(c => c.methods))]
    };
  }

  // Helper methods implementation
  private identifyWyckoffPhase(prices: PricePoint[], volumes: number[]): WyckoffAnalysis['phase'] {
    // Simplified Wyckoff phase identification
    const priceRange = this.calculatePriceRange(prices);
    const volumeProfile = this.calculateVolumeCharacteristics(volumes);
    
    if (priceRange.trend === 'sideways' && volumeProfile.increasing) {
      return volumes[volumes.length - 1] > this.average(volumes) * 1.5 ? 'accumulation' : 'distribution';
    }
    
    if (priceRange.trend === 'up' && volumeProfile.strong) return 'markup';
    if (priceRange.trend === 'down' && volumeProfile.strong) return 'markdown';
    
    return 'unknown';
  }

  private identifyWyckoffSubPhase(prices: PricePoint[], volumes: number[], phase: string): string {
    // Implementation depends on phase
    switch (phase) {
      case 'accumulation':
        return this.identifyAccumulationSubPhase(prices, volumes);
      case 'distribution':
        return this.identifyDistributionSubPhase(prices, volumes);
      default:
        return 'unknown';
    }
  }

  private identifyAccumulationSubPhase(prices: PricePoint[], volumes: number[]): string {
    // PS (Preliminary Support), SC (Selling Climax), AR (Automatic Rally), etc.
    if (this.detectSellingClimax(prices, volumes)) return 'SC';
    if (this.detectAutomaticRally(prices, volumes)) return 'AR';
    if (this.detectSecondaryTest(prices, volumes)) return 'ST';
    if (this.detectSpringAction(prices, volumes)) return 'SPRING';
    return 'PHASE_A';
  }

  private identifyDistributionSubPhase(prices: PricePoint[], volumes: number[]): string {
    // PSY (Preliminary Supply), BC (Buying Climax), AD (Automatic Reaction), etc.
    if (this.detectBuyingClimax(prices, volumes)) return 'BC';
    if (this.detectAutomaticReaction(prices, volumes)) return 'AD';
    if (this.detectUpthrust(prices, volumes)) return 'UT';
    return 'PHASE_A';
  }

  private detectSellingClimax(prices: PricePoint[], volumes: number[]): boolean {
    const recent = prices.slice(-10);
    const recentVolumes = volumes.slice(-10);
    const avgVolume = this.average(volumes);
    
    return recent.some((price, i) => 
      price.low === Math.min(...recent.map(p => p.low)) && 
      recentVolumes[i] > avgVolume * 2
    );
  }

  private detectAutomaticRally(prices: PricePoint[], volumes: number[]): boolean {
    // Look for strong price rally after selling climax
    const recent = prices.slice(-5);
    return recent.every((price, i) => i === 0 || price.close > recent[i - 1].close);
  }

  private detectSecondaryTest(prices: PricePoint[], volumes: number[]): boolean {
    // Test of selling climax low with lower volume
    return false; // Simplified
  }

  private detectSpringAction(prices: PricePoint[], volumes: number[]): boolean {
    // Brief break below support followed by reversal
    return false; // Simplified
  }

  private detectBuyingClimax(prices: PricePoint[], volumes: number[]): boolean {
    const recent = prices.slice(-10);
    const recentVolumes = volumes.slice(-10);
    const avgVolume = this.average(volumes);
    
    return recent.some((price, i) => 
      price.high === Math.max(...recent.map(p => p.high)) && 
      recentVolumes[i] > avgVolume * 2
    );
  }

  private detectAutomaticReaction(prices: PricePoint[], volumes: number[]): boolean {
    // Strong price decline after buying climax
    const recent = prices.slice(-5);
    return recent.every((price, i) => i === 0 || price.close < recent[i - 1].close);
  }

  private detectUpthrust(prices: PricePoint[], volumes: number[]): boolean {
    // False breakout above resistance
    return false; // Simplified
  }

  private findWyckoffKeyLevels(prices: PricePoint[], volumes: number[]): number[] {
    // Identify key support/resistance levels based on volume
    const levels: number[] = [];
    
    // Find significant volume spikes and corresponding price levels
    const avgVolume = this.average(volumes);
    volumes.forEach((vol, i) => {
      if (vol > avgVolume * 1.8 && prices[i]) {
        levels.push(prices[i].low, prices[i].high);
      }
    });
    
    return [...new Set(levels)].sort((a, b) => a - b);
  }

  private analyzeWyckoffVolume(prices: PricePoint[], volumes: number[]): string[] {
    const signals: string[] = [];
    const avgVolume = this.average(volumes);
    
    volumes.forEach((vol, i) => {
      if (vol > avgVolume * 2) {
        signals.push(`High volume at ${prices[i]?.close.toFixed(2)}`);
      }
    });
    
    return signals;
  }

  private analyzeWyckoffPriceAction(prices: PricePoint[]): string[] {
    const signals: string[] = [];
    
    // Look for wide spread bars, no demand bars, etc.
    prices.forEach((price, i) => {
      const spread = price.high - price.low;
      const avgSpread = this.average(prices.map(p => p.high - p.low));
      
      if (spread > avgSpread * 1.5) {
        signals.push(`Wide spread bar at ${price.close.toFixed(2)}`);
      }
    });
    
    return signals;
  }

  private calculateWyckoffConfidence(prices: PricePoint[], volumes: number[], phase: string): number {
    // Calculate confidence based on volume-price relationships
    let confidence = 50;
    
    if (phase !== 'unknown') confidence += 20;
    
    // Add confidence based on volume characteristics
    const volumeStrength = this.calculateVolumeStrength(volumes);
    confidence += volumeStrength * 30;
    
    return Math.min(95, confidence);
  }

  private calculateWyckoffTarget(prices: PricePoint[], phase: string): number {
    const currentPrice = prices[prices.length - 1].close;
    const range = Math.max(...prices.map(p => p.high)) - Math.min(...prices.map(p => p.low));
    
    switch (phase) {
      case 'accumulation':
        return currentPrice + range;
      case 'distribution':
        return currentPrice - range;
      default:
        return currentPrice;
    }
  }

  private calculateWyckoffInvalidation(prices: PricePoint[], phase: string): number {
    const currentPrice = prices[prices.length - 1].close;
    const support = Math.min(...prices.slice(-20).map(p => p.low));
    const resistance = Math.max(...prices.slice(-20).map(p => p.high));
    
    switch (phase) {
      case 'accumulation':
        return support * 0.98;
      case 'distribution':
        return resistance * 1.02;
      default:
        return currentPrice * 0.95;
    }
  }

  // SMC Helper Methods
  private identifyMarketStructure(prices: PricePoint[]): 'bullish' | 'bearish' | 'neutral' {
    const highs = prices.map(p => p.high);
    const lows = prices.map(p => p.low);
    
    const recentHighs = highs.slice(-5);
    const recentLows = lows.slice(-5);
    
    const isHigherHighs = recentHighs.every((high, i) => i === 0 || high >= recentHighs[i - 1]);
    const isHigherLows = recentLows.every((low, i) => i === 0 || low >= recentLows[i - 1]);
    
    if (isHigherHighs && isHigherLows) return 'bullish';
    if (!isHigherHighs && !isHigherLows) return 'bearish';
    return 'neutral';
  }

  private detectBreakOfStructure(prices: PricePoint[]): boolean {
    // Simplified BOS detection
    const recent = prices.slice(-10);
    const previousHigh = Math.max(...recent.slice(0, -3).map(p => p.high));
    const currentHigh = Math.max(...recent.slice(-3).map(p => p.high));
    
    return currentHigh > previousHigh * 1.01; // 1% break
  }

  private detectChangeOfCharacter(prices: PricePoint[]): boolean {
    // Simplified CHOCH detection
    const recent = prices.slice(-10);
    const volatility = this.calculateVolatility(recent);
    
    return volatility > 0.05; // 5% volatility threshold
  }

  private identifyOrderBlocks(prices: PricePoint[]): SMCAnalysis['orderBlocks'] {
    const blocks: SMCAnalysis['orderBlocks'] = [];
    
    prices.forEach((price, i) => {
      if (i < 5) return;
      
      const previousPrices = prices.slice(i - 5, i);
      const isSignificantMove = Math.abs(price.close - previousPrices[0].close) / previousPrices[0].close > 0.02;
      
      if (isSignificantMove) {
        blocks.push({
          level: (price.high + price.low) / 2,
          type: price.close > previousPrices[0].close ? 'bullish' : 'bearish',
          strength: Math.min(100, Math.abs(price.close - previousPrices[0].close) / previousPrices[0].close * 1000)
        });
      }
    });
    
    return blocks.slice(-10); // Keep last 10 order blocks
  }

  private identifyFairValueGaps(prices: PricePoint[]): SMCAnalysis['fairValueGaps'] {
    const gaps: SMCAnalysis['fairValueGaps'] = [];
    
    for (let i = 1; i < prices.length - 1; i++) {
      const prev = prices[i - 1];
      const current = prices[i];
      const next = prices[i + 1];
      
      // Bullish FVG
      if (prev.high < next.low) {
        gaps.push({
          top: next.low,
          bottom: prev.high,
          filled: this.isGapFilled(prices.slice(i + 1), prev.high, next.low)
        });
      }
      
      // Bearish FVG
      if (prev.low > next.high) {
        gaps.push({
          top: prev.low,
          bottom: next.high,
          filled: this.isGapFilled(prices.slice(i + 1), next.high, prev.low)
        });
      }
    }
    
    return gaps.slice(-5); // Keep last 5 gaps
  }

  private identifyLiquidityLevels(prices: PricePoint[]): SMCAnalysis['liquidityLevels'] {
    const levels: SMCAnalysis['liquidityLevels'] = [];
    
    // Identify equal highs and lows (liquidity pools)
    const highs = prices.map(p => p.high);
    const lows = prices.map(p => p.low);
    
    // Find repeated levels (within 0.5% tolerance)
    const tolerance = 0.005;
    
    highs.forEach((high, i) => {
      const similarHighs = highs.filter(h => Math.abs(h - high) / high < tolerance);
      if (similarHighs.length >= 2) {
        levels.push({
          level: high,
          type: 'sell',
          strength: similarHighs.length * 20
        });
      }
    });
    
    lows.forEach((low, i) => {
      const similarLows = lows.filter(l => Math.abs(l - low) / low < tolerance);
      if (similarLows.length >= 2) {
        levels.push({
          level: low,
          type: 'buy',
          strength: similarLows.length * 20
        });
      }
    });
    
    return levels;
  }

  private identifyBreakerBlocks(prices: PricePoint[]): SMCAnalysis['breakers'] {
    // Simplified breaker identification
    return [];
  }

  private calculateSMCConfidence(
    structure: string,
    bos: boolean,
    choch: boolean,
    orderBlocks: any[]
  ): number {
    let confidence = 50;
    
    if (structure !== 'neutral') confidence += 15;
    if (bos) confidence += 10;
    if (choch) confidence += 5;
    if (orderBlocks.length > 0) confidence += orderBlocks.length * 5;
    
    return Math.min(95, confidence);
  }

  // Elliott Wave Helper Methods
  private identifySwingPoints(prices: PricePoint[]): { high: number; low: number; index: number }[] {
    const swings: { high: number; low: number; index: number }[] = [];
    
    for (let i = 2; i < prices.length - 2; i++) {
      const isSwingHigh = 
        prices[i].high > prices[i - 1].high &&
        prices[i].high > prices[i - 2].high &&
        prices[i].high > prices[i + 1].high &&
        prices[i].high > prices[i + 2].high;
        
      const isSwingLow = 
        prices[i].low < prices[i - 1].low &&
        prices[i].low < prices[i - 2].low &&
        prices[i].low < prices[i + 1].low &&
        prices[i].low < prices[i + 2].low;
        
      if (isSwingHigh || isSwingLow) {
        swings.push({
          high: prices[i].high,
          low: prices[i].low,
          index: i
        });
      }
    }
    
    return swings;
  }

  private countElliottWaves(swingPoints: any[]): any[] {
    // Simplified wave counting
    return swingPoints.slice(-8); // Last 8 swing points for analysis
  }

  private identifyCurrentWave(waveCount: any[]): ElliottWaveAnalysis['currentWave'] {
    // Simplified current wave identification
    const waveNumber = waveCount.length % 5;
    switch (waveNumber) {
      case 1: return '1';
      case 2: return '2';
      case 3: return '3';
      case 4: return '4';
      case 0: return '5';
      default: return '1';
    }
  }

  private identifyWaveType(waveCount: any[]): 'impulse' | 'corrective' {
    // Simplified wave type identification
    return waveCount.length % 2 === 0 ? 'impulse' : 'corrective';
  }

  private calculateWaveTargets(swingPoints: any[], currentWave: string): number[] {
    if (swingPoints.length < 3) return [];
    
    const lastSwing = swingPoints[swingPoints.length - 1];
    const secondLastSwing = swingPoints[swingPoints.length - 2];
    const range = Math.abs(lastSwing.high - lastSwing.low);
    
    // Fibonacci projections
    return [
      lastSwing.high + range * 1.618,
      lastSwing.high + range * 2.618,
      lastSwing.high + range * 4.236
    ];
  }

  private calculateWaveConfidence(waveCount: any[], swingPoints: any[]): number {
    if (swingPoints.length < 5) return 30;
    if (swingPoints.length >= 8) return 80;
    return 60;
  }

  private calculateWaveInvalidation(swingPoints: any[], currentWave: string): number {
    if (swingPoints.length === 0) return 0;
    
    const lastSwing = swingPoints[swingPoints.length - 1];
    return currentWave === '3' ? lastSwing.low * 0.95 : lastSwing.high * 1.05;
  }

  // Fibonacci Helper Methods
  private isPriceLevelTested(prices: PricePoint[], level: number): boolean {
    const tolerance = 0.01; // 1% tolerance
    return prices.some(price => 
      Math.abs(price.low - level) / level < tolerance ||
      Math.abs(price.high - level) / level < tolerance
    );
  }

  private calculateFibStrength(prices: PricePoint[], level: number): number {
    const reactions = prices.filter(price => 
      Math.abs(price.low - level) / level < 0.02 ||
      Math.abs(price.high - level) / level < 0.02
    );
    
    return Math.min(100, reactions.length * 20);
  }

  private identifyKeyFibZone(retracementLevels: any[], prices: PricePoint[]): FibonacciAnalysis['keyZone'] {
    // Find the most significant retracement zone (typically 0.618-0.786)
    const goldenZone = retracementLevels.filter(level => 
      level.level >= 0.618 && level.level <= 0.786
    );
    
    if (goldenZone.length >= 2) {
      return {
        top: Math.max(...goldenZone.map(z => z.price)),
        bottom: Math.min(...goldenZone.map(z => z.price)),
        strength: 'strong'
      };
    }
    
    return {
      top: 0,
      bottom: 0,
      strength: 'weak'
    };
  }

  private calculateFibConfluence(retracementLevels: any[], extensionLevels: any[]): number {
    // Calculate confluence score based on level clustering
    let confluenceScore = 0;
    const allLevels = [...retracementLevels, ...extensionLevels];
    
    allLevels.forEach(level1 => {
      allLevels.forEach(level2 => {
        if (level1 !== level2) {
          const distance = Math.abs(level1.price - level2.price) / level1.price;
          if (distance < 0.02) { // Within 2%
            confluenceScore += 10;
          }
        }
      });
    });
    
    return Math.min(100, confluenceScore);
  }

  // Volume Profile Helper Methods
  private buildVolumeProfile(priceData: PricePoint[], volumeData: number[]): Map<number, number> {
    const profile = new Map<number, number>();
    
    priceData.forEach((price, i) => {
      const volume = volumeData[i] || 0;
      const bucketSize = 10; // Price bucket size
      const bucket = Math.floor(price.close / bucketSize) * bucketSize;
      
      profile.set(bucket, (profile.get(bucket) || 0) + volume);
    });
    
    return profile;
  }

  private findPointOfControl(profile: Map<number, number>): number {
    let maxVolume = 0;
    let pocLevel = 0;
    
    profile.forEach((volume, price) => {
      if (volume > maxVolume) {
        maxVolume = volume;
        pocLevel = price;
      }
    });
    
    return pocLevel;
  }

  private calculateValueArea(profile: Map<number, number>): { high: number; low: number } {
    const totalVolume = Array.from(profile.values()).reduce((sum, vol) => sum + vol, 0);
    const targetVolume = totalVolume * 0.7; // 70% of volume
    
    const sortedLevels = Array.from(profile.entries())
      .sort(([, vol1], [, vol2]) => vol2 - vol1);
    
    let accumulatedVolume = 0;
    const valueAreaLevels: number[] = [];
    
    for (const [price, volume] of sortedLevels) {
      accumulatedVolume += volume;
      valueAreaLevels.push(price);
      
      if (accumulatedVolume >= targetVolume) break;
    }
    
    return {
      high: Math.max(...valueAreaLevels),
      low: Math.min(...valueAreaLevels)
    };
  }

  private identifyHighVolumeNodes(profile: Map<number, number>): number[] {
    const avgVolume = Array.from(profile.values()).reduce((sum, vol) => sum + vol, 0) / profile.size;
    
    return Array.from(profile.entries())
      .filter(([, volume]) => volume > avgVolume * 1.5)
      .map(([price]) => price);
  }

  private identifyLowVolumeNodes(profile: Map<number, number>): number[] {
    const avgVolume = Array.from(profile.values()).reduce((sum, vol) => sum + vol, 0) / profile.size;
    
    return Array.from(profile.entries())
      .filter(([, volume]) => volume < avgVolume * 0.3)
      .map(([price]) => price);
  }

  private identifyVolumeImbalances(priceData: PricePoint[], volumeData: number[]): VolumeProfileAnalysis['volumeImbalance'] {
    const imbalances: VolumeProfileAnalysis['volumeImbalance'] = [];
    
    for (let i = 1; i < priceData.length; i++) {
      const currentPrice = priceData[i];
      const previousPrice = priceData[i - 1];
      const currentVolume = volumeData[i];
      const previousVolume = volumeData[i - 1];
      
      const priceMove = (currentPrice.close - previousPrice.close) / previousPrice.close;
      const volumeRatio = currentVolume / previousVolume;
      
      // Identify significant price moves with low volume (imbalance)
      if (Math.abs(priceMove) > 0.02 && volumeRatio < 0.7) {
        imbalances.push({
          level: currentPrice.close,
          direction: priceMove > 0 ? 'up' : 'down'
        });
      }
    }
    
    return imbalances.slice(-10); // Last 10 imbalances
  }

  private calculateVolumeProfileStrength(profile: Map<number, number>): number {
    const volumes = Array.from(profile.values());
    const maxVolume = Math.max(...volumes);
    const avgVolume = volumes.reduce((sum, vol) => sum + vol, 0) / volumes.length;
    
    return Math.min(100, (maxVolume / avgVolume) * 10);
  }

  // Confluence Helper Methods
  private findLevelConfluences(levels: any[]): any[] {
    const confluences: any[] = [];
    const tolerance = 0.01; // 1% tolerance
    
    levels.forEach((level1, i) => {
      const nearbyLevels = levels.filter((level2, j) => 
        i !== j && Math.abs(level1.level - level2.level) / level1.level < tolerance
      );
      
      if (nearbyLevels.length > 0) {
        const allLevels = [level1, ...nearbyLevels];
        const avgLevel = allLevels.reduce((sum, l) => sum + l.level, 0) / allLevels.length;
        const allMethods = [...new Set(allLevels.flatMap(l => l.methods))];
        const avgScore = allLevels.reduce((sum, l) => sum + l.score, 0) / allLevels.length;
        
        confluences.push({
          level: avgLevel,
          methods: allMethods,
          score: avgScore + (allMethods.length * 10) // Bonus for multiple methods
        });
      }
    });
    
    // Remove duplicates and sort by score
    return confluences
      .filter((confluence, i, arr) => 
        arr.findIndex(c => Math.abs(c.level - confluence.level) / confluence.level < tolerance) === i
      )
      .sort((a, b) => b.score - a.score);
  }

  private calculateOverallDirection(
    wyckoff: WyckoffAnalysis,
    smc: SMCAnalysis,
    elliott: ElliottWaveAnalysis
  ): 'bullish' | 'bearish' | 'neutral' {
    let bullishVotes = 0;
    let bearishVotes = 0;
    
    // Wyckoff vote
    if (wyckoff.phase === 'accumulation' || wyckoff.phase === 'markup') bullishVotes++;
    if (wyckoff.phase === 'distribution' || wyckoff.phase === 'markdown') bearishVotes++;
    
    // SMC vote
    if (smc.structure === 'bullish' || smc.bos) bullishVotes++;
    if (smc.structure === 'bearish') bearishVotes++;
    
    // Elliott Wave vote
    if (elliott.currentWave === '1' || elliott.currentWave === '3' || elliott.currentWave === '5') {
      bullishVotes++;
    }
    if (elliott.currentWave === '2' || elliott.currentWave === '4' || elliott.waveType === 'corrective') {
      bearishVotes++;
    }
    
    if (bullishVotes > bearishVotes) return 'bullish';
    if (bearishVotes > bullishVotes) return 'bearish';
    return 'neutral';
  }

  private calculateConfluenceStrength(confluences: any[]): 'strong' | 'medium' | 'weak' {
    if (confluences.length === 0) return 'weak';
    
    const avgScore = confluences.reduce((sum, c) => sum + c.score, 0) / confluences.length;
    const maxMethods = Math.max(...confluences.map(c => c.methods.length));
    
    if (avgScore > 80 && maxMethods >= 3) return 'strong';
    if (avgScore > 60 && maxMethods >= 2) return 'medium';
    return 'weak';
  }

  // Utility helper methods
  private calculatePriceRange(prices: PricePoint[]): { trend: 'up' | 'down' | 'sideways'; volatility: number } {
    const firstPrice = prices[0].close;
    const lastPrice = prices[prices.length - 1].close;
    const change = (lastPrice - firstPrice) / firstPrice;
    
    let trend: 'up' | 'down' | 'sideways';
    if (change > 0.02) trend = 'up';
    else if (change < -0.02) trend = 'down';
    else trend = 'sideways';
    
    const volatility = this.calculateVolatility(prices);
    
    return { trend, volatility };
  }

  private calculateVolumeCharacteristics(volumes: number[]): { increasing: boolean; strong: boolean } {
    const recent = volumes.slice(-10);
    const earlier = volumes.slice(-20, -10);
    
    const recentAvg = this.average(recent);
    const earlierAvg = this.average(earlier);
    const overallAvg = this.average(volumes);
    
    return {
      increasing: recentAvg > earlierAvg,
      strong: recentAvg > overallAvg * 1.5
    };
  }

  private calculateVolumeStrength(volumes: number[]): number {
    const avgVolume = this.average(volumes);
    const recentVolume = this.average(volumes.slice(-5));
    
    return Math.min(1, recentVolume / avgVolume / 2);
  }

  private calculateVolatility(prices: PricePoint[]): number {
    const returns = prices.slice(1).map((price, i) => 
      (price.close - prices[i].close) / prices[i].close
    );
    
    const meanReturn = this.average(returns);
    const variance = returns.reduce((sum, ret) => sum + Math.pow(ret - meanReturn, 2), 0) / returns.length;
    
    return Math.sqrt(variance);
  }

  private isGapFilled(subsequentPrices: PricePoint[], gapBottom: number, gapTop: number): boolean {
    return subsequentPrices.some(price => 
      price.low <= gapBottom && price.high >= gapTop
    );
  }

  private average(numbers: number[]): number {
    return numbers.reduce((sum, num) => sum + num, 0) / numbers.length;
  }
}

export const advancedStrategies = new AdvancedStrategies();