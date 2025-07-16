/**
 * Wyckoff Method Analysis
 * Implementation of Richard Wyckoff's market analysis method
 */

export interface WyckoffPhase {
  phase: 'Accumulation' | 'Mark-up' | 'Distribution' | 'Mark-down';
  subPhase: string;
  confidence: number;
  description: string;
  signals: string[];
  volumeCharacteristics: string;
  priceAction: string;
}

export interface WyckoffAnalysis {
  currentPhase: WyckoffPhase;
  trend: 'bullish' | 'bearish' | 'neutral';
  strength: number;
  volumeAnalysis: {
    trend: 'increasing' | 'decreasing' | 'neutral';
    confirmation: boolean;
    anomalies: string[];
  };
  supplyDemand: {
    supply: number;
    demand: number;
    balance: 'supply' | 'demand' | 'balanced';
  };
  actionables: string[];
}

export class WyckoffAnalysis {
  
  /**
   * Analyze market using Wyckoff Method
   */
  static analyzeMarket(
    prices: number[], 
    volumes: number[], 
    highs: number[], 
    lows: number[]
  ): WyckoffAnalysis {
    if (prices.length < 20) {
      throw new Error('Need at least 20 data points for Wyckoff analysis');
    }

    const currentPhase = this.identifyWyckoffPhase(prices, volumes, highs, lows);
    const trend = this.determineTrend(prices);
    const strength = this.calculateStrength(prices, volumes);
    const volumeAnalysis = this.analyzeVolume(volumes, prices);
    const supplyDemand = this.analyzeSupplyDemand(prices, volumes);
    const actionables = this.generateActionables(currentPhase, trend, supplyDemand);

    return {
      currentPhase,
      trend,
      strength,
      volumeAnalysis,
      supplyDemand,
      actionables
    };
  }

  /**
   * Identify current Wyckoff phase
   */
  private static identifyWyckoffPhase(
    prices: number[], 
    volumes: number[], 
    highs: number[], 
    lows: number[]
  ): WyckoffPhase {
    const recentPrices = prices.slice(-20);
    const recentVolumes = volumes.slice(-20);
    const recentHighs = highs.slice(-20);
    const recentLows = lows.slice(-20);

    // Calculate price volatility and volume patterns
    const priceRange = Math.max(...recentPrices) - Math.min(...recentPrices);
    const avgPrice = recentPrices.reduce((sum, price) => sum + price, 0) / recentPrices.length;
    const priceVariation = this.calculateVariation(recentPrices);
    
    const avgVolume = recentVolumes.reduce((sum, vol) => sum + vol, 0) / recentVolumes.length;
    const volumeVariation = this.calculateVariation(recentVolumes);
    
    // Identify phase based on Wyckoff principles
    if (priceVariation < 0.02 && volumeVariation > 0.3) {
      // Low price movement with high volume variation = Accumulation
      return {
        phase: 'Accumulation',
        subPhase: this.identifyAccumulationSubPhase(recentPrices, recentVolumes),
        confidence: 80,
        description: 'Market is in accumulation phase - smart money is buying',
        signals: ['Volume increasing on minor declines', 'Price holding support levels'],
        volumeCharacteristics: 'High volume on down moves, low volume on up moves',
        priceAction: 'Sideways with higher lows'
      };
    } else if (priceVariation > 0.05 && this.isUptrend(recentPrices) && volumeVariation > 0.2) {
      // Strong price movement up with volume = Mark-up
      return {
        phase: 'Mark-up',
        subPhase: this.identifyMarkupSubPhase(recentPrices, recentVolumes),
        confidence: 85,
        description: 'Market is marking up - strong upward momentum',
        signals: ['Volume confirming price advances', 'Breaking resistance levels'],
        volumeCharacteristics: 'High volume on advances, low volume on reactions',
        priceAction: 'Strong upward movement with pullbacks'
      };
    } else if (priceVariation < 0.02 && this.isAtHighs(recentPrices, recentHighs)) {
      // Low variation at high prices = Distribution
      return {
        phase: 'Distribution',
        subPhase: this.identifyDistributionSubPhase(recentPrices, recentVolumes),
        confidence: 75,
        description: 'Market is in distribution phase - smart money is selling',
        signals: ['Volume increasing on rallies', 'Price failing at resistance'],
        volumeCharacteristics: 'High volume on up moves, persistent volume on declines',
        priceAction: 'Sideways with lower highs'
      };
    } else {
      // Default to Mark-down
      return {
        phase: 'Mark-down',
        subPhase: this.identifyMarkdownSubPhase(recentPrices, recentVolumes),
        confidence: 70,
        description: 'Market is marking down - downward pressure',
        signals: ['Volume confirming price declines', 'Breaking support levels'],
        volumeCharacteristics: 'High volume on declines, low volume on rallies',
        priceAction: 'Strong downward movement with rallies'
      };
    }
  }

  /**
   * Identify accumulation sub-phases
   */
  private static identifyAccumulationSubPhase(prices: number[], volumes: number[]): string {
    const currentPrice = prices[prices.length - 1];
    const minPrice = Math.min(...prices);
    const pricePosition = (currentPrice - minPrice) / (Math.max(...prices) - minPrice);
    
    if (pricePosition < 0.3) {
      return 'Phase A - Selling Climax Area';
    } else if (pricePosition < 0.6) {
      return 'Phase B - Building Support';
    } else {
      return 'Phase C - Testing Support';
    }
  }

  /**
   * Identify markup sub-phases
   */
  private static identifyMarkupSubPhase(prices: number[], volumes: number[]): string {
    const recentVolumes = volumes.slice(-5);
    const avgRecentVolume = recentVolumes.reduce((sum, vol) => sum + vol, 0) / recentVolumes.length;
    const overallAvgVolume = volumes.reduce((sum, vol) => sum + vol, 0) / volumes.length;
    
    if (avgRecentVolume > overallAvgVolume * 1.5) {
      return 'Strong Mark-up with Volume Confirmation';
    } else {
      return 'Early Mark-up Phase';
    }
  }

  /**
   * Identify distribution sub-phases
   */
  private static identifyDistributionSubPhase(prices: number[], volumes: number[]): string {
    const currentPrice = prices[prices.length - 1];
    const maxPrice = Math.max(...prices);
    const pricePosition = currentPrice / maxPrice;
    
    if (pricePosition > 0.95) {
      return 'Phase A - Buying Climax Area';
    } else if (pricePosition > 0.85) {
      return 'Phase B - Building Resistance';
    } else {
      return 'Phase C - Testing Resistance';
    }
  }

  /**
   * Identify markdown sub-phases
   */
  private static identifyMarkdownSubPhase(prices: number[], volumes: number[]): string {
    const priceDecline = this.calculatePriceDecline(prices);
    
    if (priceDecline > 0.1) {
      return 'Strong Mark-down with Momentum';
    } else {
      return 'Early Mark-down Phase';
    }
  }

  /**
   * Determine overall trend
   */
  private static determineTrend(prices: number[]): 'bullish' | 'bearish' | 'neutral' {
    if (prices.length < 10) return 'neutral';
    
    const recent = prices.slice(-10);
    const earlier = prices.slice(-20, -10);
    
    const recentAvg = recent.reduce((sum, price) => sum + price, 0) / recent.length;
    const earlierAvg = earlier.reduce((sum, price) => sum + price, 0) / earlier.length;
    
    const change = (recentAvg - earlierAvg) / earlierAvg;
    
    if (change > 0.02) return 'bullish';
    if (change < -0.02) return 'bearish';
    return 'neutral';
  }

  /**
   * Calculate market strength
   */
  private static calculateStrength(prices: number[], volumes: number[]): number {
    const priceStrength = this.calculatePriceStrength(prices);
    const volumeStrength = this.calculateVolumeStrength(volumes);
    
    return Math.round((priceStrength + volumeStrength) / 2);
  }

  /**
   * Analyze volume characteristics
   */
  private static analyzeVolume(volumes: number[], prices: number[]): {
    trend: 'increasing' | 'decreasing' | 'neutral';
    confirmation: boolean;
    anomalies: string[];
  } {
    const recentVolumes = volumes.slice(-10);
    const earlierVolumes = volumes.slice(-20, -10);
    
    const recentAvg = recentVolumes.reduce((sum, vol) => sum + vol, 0) / recentVolumes.length;
    const earlierAvg = earlierVolumes.reduce((sum, vol) => sum + vol, 0) / earlierVolumes.length;
    
    const volumeChange = (recentAvg - earlierAvg) / earlierAvg;
    
    let trend: 'increasing' | 'decreasing' | 'neutral' = 'neutral';
    if (volumeChange > 0.2) trend = 'increasing';
    else if (volumeChange < -0.2) trend = 'decreasing';
    
    const priceDirection = this.determineTrend(prices);
    const confirmation = this.isVolumeConfirming(trend, priceDirection);
    
    const anomalies = this.identifyVolumeAnomalies(volumes, prices);
    
    return { trend, confirmation, anomalies };
  }

  /**
   * Analyze supply and demand
   */
  private static analyzeSupplyDemand(prices: number[], volumes: number[]): {
    supply: number;
    demand: number;
    balance: 'supply' | 'demand' | 'balanced';
  } {
    let supply = 0;
    let demand = 0;
    
    // Analyze last 10 periods
    for (let i = prices.length - 10; i < prices.length - 1; i++) {
      if (i < 0) continue;
      
      const priceChange = prices[i + 1] - prices[i];
      const volume = volumes[i];
      
      if (priceChange > 0) {
        demand += volume * Math.abs(priceChange);
      } else {
        supply += volume * Math.abs(priceChange);
      }
    }
    
    const total = supply + demand;
    const supplyPercent = total > 0 ? (supply / total) * 100 : 50;
    const demandPercent = total > 0 ? (demand / total) * 100 : 50;
    
    let balance: 'supply' | 'demand' | 'balanced' = 'balanced';
    if (demandPercent > 60) balance = 'demand';
    else if (supplyPercent > 60) balance = 'supply';
    
    return {
      supply: Math.round(supplyPercent),
      demand: Math.round(demandPercent),
      balance
    };
  }

  /**
   * Generate actionable insights
   */
  private static generateActionables(
    phase: WyckoffPhase, 
    trend: string, 
    supplyDemand: any
  ): string[] {
    const actionables: string[] = [];
    
    switch (phase.phase) {
      case 'Accumulation':
        actionables.push('Look for buying opportunities on weakness');
        actionables.push('Watch for volume spikes on declines');
        if (supplyDemand.balance === 'demand') {
          actionables.push('Demand is overcoming supply - prepare for markup');
        }
        break;
        
      case 'Mark-up':
        actionables.push('Hold positions and ride the trend');
        actionables.push('Look for pullback entries');
        if (phase.confidence > 80) {
          actionables.push('Strong markup confirmed - maintain bullish bias');
        }
        break;
        
      case 'Distribution':
        actionables.push('Consider taking profits on rallies');
        actionables.push('Watch for volume on any rallies');
        if (supplyDemand.balance === 'supply') {
          actionables.push('Supply is overcoming demand - prepare for markdown');
        }
        break;
        
      case 'Mark-down':
        actionables.push('Avoid buying - wait for accumulation');
        actionables.push('Consider short opportunities on rallies');
        actionables.push('Watch for selling climax');
        break;
    }
    
    return actionables;
  }

  // Helper methods
  private static calculateVariation(data: number[]): number {
    const mean = data.reduce((sum, val) => sum + val, 0) / data.length;
    const variance = data.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / data.length;
    return Math.sqrt(variance) / mean;
  }

  private static isUptrend(prices: number[]): boolean {
    const recent = prices.slice(-5);
    const earlier = prices.slice(-10, -5);
    const recentAvg = recent.reduce((sum, p) => sum + p, 0) / recent.length;
    const earlierAvg = earlier.reduce((sum, p) => sum + p, 0) / earlier.length;
    return recentAvg > earlierAvg;
  }

  private static isAtHighs(prices: number[], highs: number[]): boolean {
    const currentPrice = prices[prices.length - 1];
    const recentHigh = Math.max(...highs.slice(-20));
    return currentPrice > recentHigh * 0.95;
  }

  private static calculatePriceDecline(prices: number[]): number {
    const maxPrice = Math.max(...prices);
    const currentPrice = prices[prices.length - 1];
    return (maxPrice - currentPrice) / maxPrice;
  }

  private static calculatePriceStrength(prices: number[]): number {
    const momentum = this.calculateMomentum(prices);
    return Math.min(100, Math.max(0, 50 + momentum * 100));
  }

  private static calculateVolumeStrength(volumes: number[]): number {
    const recent = volumes.slice(-5);
    const overall = volumes;
    const recentAvg = recent.reduce((sum, v) => sum + v, 0) / recent.length;
    const overallAvg = overall.reduce((sum, v) => sum + v, 0) / overall.length;
    const strength = (recentAvg / overallAvg - 1) * 100;
    return Math.min(100, Math.max(0, 50 + strength));
  }

  private static calculateMomentum(prices: number[]): number {
    if (prices.length < 10) return 0;
    const recent = prices.slice(-5);
    const earlier = prices.slice(-10, -5);
    const recentAvg = recent.reduce((sum, p) => sum + p, 0) / recent.length;
    const earlierAvg = earlier.reduce((sum, p) => sum + p, 0) / earlier.length;
    return (recentAvg - earlierAvg) / earlierAvg;
  }

  private static isVolumeConfirming(volumeTrend: string, priceTrend: string): boolean {
    if (priceTrend === 'bullish' && volumeTrend === 'increasing') return true;
    if (priceTrend === 'bearish' && volumeTrend === 'increasing') return true;
    return false;
  }

  private static identifyVolumeAnomalies(volumes: number[], prices: number[]): string[] {
    const anomalies: string[] = [];
    const avgVolume = volumes.reduce((sum, v) => sum + v, 0) / volumes.length;
    
    // Check for volume spikes
    const recentVolumes = volumes.slice(-5);
    for (const volume of recentVolumes) {
      if (volume > avgVolume * 2) {
        anomalies.push('High volume spike detected');
        break;
      }
    }
    
    // Check for volume drying up
    const veryRecentVolumes = volumes.slice(-3);
    const recentAvgVol = veryRecentVolumes.reduce((sum, v) => sum + v, 0) / veryRecentVolumes.length;
    if (recentAvgVol < avgVolume * 0.5) {
      anomalies.push('Volume drying up');
    }
    
    return anomalies;
  }
}