
export interface OrderBlock {
  id: string;
  symbol: string;
  price_level: number;
  block_type: 'bullish' | 'bearish';
  volume: number;
  timestamp: number;
  strength: 'weak' | 'medium' | 'strong';
  tested: boolean;
  invalidated: boolean;
}

export interface LiquidityZone {
  id: string;
  symbol: string;
  zone_type: 'buy_side' | 'sell_side';
  price_high: number;
  price_low: number;
  liquidity_strength: number;
  sweep_potential: number;
  timestamp: number;
}

export interface FairValueGap {
  id: string;
  symbol: string;
  gap_high: number;
  gap_low: number;
  gap_type: 'bullish' | 'bearish';
  filled: boolean;
  timestamp: number;
}

class SmartMoneyEngine {
  private minOrderBlockVolume = 1000000; // Minimum volume for valid order block
  private liquidityThreshold = 0.02; // 2% price level for liquidity zones

  analyzeOrderBlocks(priceData: any[], volumeData: any[], symbol: string): OrderBlock[] {
    const orderBlocks: OrderBlock[] = [];
    
    try {
      if (!priceData || priceData.length < 20) return orderBlocks;

      for (let i = 3; i < priceData.length - 3; i++) {
        const current = priceData[i];
        const volume = volumeData[i]?.value || 0;
        
        if (volume < this.minOrderBlockVolume) continue;

        // Look for bullish order blocks (strong buying pressure)
        if (this.isBullishOrderBlock(priceData, i)) {
          orderBlocks.push({
            id: `ob-bull-${symbol}-${i}`,
            symbol,
            price_level: current.low,
            block_type: 'bullish',
            volume,
            timestamp: current.time,
            strength: this.calculateOrderBlockStrength(priceData, i, volume),
            tested: false,
            invalidated: false
          });
        }

        // Look for bearish order blocks (strong selling pressure)
        if (this.isBearishOrderBlock(priceData, i)) {
          orderBlocks.push({
            id: `ob-bear-${symbol}-${i}`,
            symbol,
            price_level: current.high,
            block_type: 'bearish',
            volume,
            timestamp: current.time,
            strength: this.calculateOrderBlockStrength(priceData, i, volume),
            tested: false,
            invalidated: false
          });
        }
      }

      return orderBlocks.slice(-10); // Return last 10 order blocks
    } catch (error) {
      console.error('Error analyzing order blocks:', error);
      return [];
    }
  }

  private isBullishOrderBlock(priceData: any[], index: number): boolean {
    const current = priceData[index];
    const prev = priceData[index - 1];
    const next = priceData[index + 1];
    const next2 = priceData[index + 2];

    // Check for strong bullish candle followed by upward movement
    const isBullishCandle = current.close > current.open;
    const strongMove = (current.close - current.open) / current.open > 0.02;
    const continuedUp = next && next2 && next.close > current.close && next2.close > next.close;

    return isBullishCandle && strongMove && continuedUp;
  }

  private isBearishOrderBlock(priceData: any[], index: number): boolean {
    const current = priceData[index];
    const next = priceData[index + 1];
    const next2 = priceData[index + 2];

    // Check for strong bearish candle followed by downward movement
    const isBearishCandle = current.close < current.open;
    const strongMove = (current.open - current.close) / current.open > 0.02;
    const continuedDown = next && next2 && next.close < current.close && next2.close < next.close;

    return isBearishCandle && strongMove && continuedDown;
  }

  private calculateOrderBlockStrength(priceData: any[], index: number, volume: number): 'weak' | 'medium' | 'strong' {
    const current = priceData[index];
    const bodySize = Math.abs(current.close - current.open) / current.open;
    const relativeVolume = volume / this.minOrderBlockVolume;

    if (bodySize > 0.04 && relativeVolume > 2) return 'strong';
    if (bodySize > 0.02 && relativeVolume > 1.5) return 'medium';
    return 'weak';
  }

  analyzeLiquidityZones(priceData: any[], symbol: string): LiquidityZone[] {
    const liquidityZones: LiquidityZone[] = [];
    
    try {
      if (!priceData || priceData.length < 50) return liquidityZones;

      // Find significant highs and lows
      const significantLevels = this.findSignificantLevels(priceData);
      
      significantLevels.forEach((level, index) => {
        const liquidityStrength = this.calculateLiquidityStrength(priceData, level.price);
        const sweepPotential = this.calculateSweepPotential(priceData, level.price, level.type);

        if (liquidityStrength > 0.6) {
          liquidityZones.push({
            id: `liq-${symbol}-${index}`,
            symbol,
            zone_type: level.type === 'high' ? 'sell_side' : 'buy_side',
            price_high: level.price * (1 + this.liquidityThreshold),
            price_low: level.price * (1 - this.liquidityThreshold),
            liquidity_strength: liquidityStrength,
            sweep_potential: sweepPotential,
            timestamp: level.timestamp
          });
        }
      });

      return liquidityZones.slice(-8); // Return last 8 liquidity zones
    } catch (error) {
      console.error('Error analyzing liquidity zones:', error);
      return [];
    }
  }

  private findSignificantLevels(priceData: any[]): Array<{price: number, type: 'high' | 'low', timestamp: number}> {
    const levels: Array<{price: number, type: 'high' | 'low', timestamp: number}> = [];
    const lookback = 10;

    for (let i = lookback; i < priceData.length - lookback; i++) {
      const current = priceData[i];
      
      // Check for significant high
      let isSignificantHigh = true;
      for (let j = i - lookback; j <= i + lookback; j++) {
        if (j !== i && priceData[j] && priceData[j].high >= current.high) {
          isSignificantHigh = false;
          break;
        }
      }

      // Check for significant low
      let isSignificantLow = true;
      for (let j = i - lookback; j <= i + lookback; j++) {
        if (j !== i && priceData[j] && priceData[j].low <= current.low) {
          isSignificantLow = false;
          break;
        }
      }

      if (isSignificantHigh) {
        levels.push({
          price: current.high,
          type: 'high',
          timestamp: current.time
        });
      }

      if (isSignificantLow) {
        levels.push({
          price: current.low,
          type: 'low',
          timestamp: current.time
        });
      }
    }

    return levels;
  }

  private calculateLiquidityStrength(priceData: any[], level: number): number {
    let touchCount = 0;
    let reactionStrength = 0;

    priceData.forEach((candle, index) => {
      const touchThreshold = level * 0.005; // 0.5% threshold
      
      if (Math.abs(candle.high - level) <= touchThreshold || Math.abs(candle.low - level) <= touchThreshold) {
        touchCount++;
        
        // Measure reaction strength
        if (index < priceData.length - 1) {
          const nextCandle = priceData[index + 1];
          const reaction = Math.abs(nextCandle.close - candle.close) / candle.close;
          reactionStrength += reaction;
        }
      }
    });

    // Normalize strength (more touches + stronger reactions = higher strength)
    const normalizedTouches = Math.min(touchCount / 5, 1);
    const normalizedReaction = Math.min(reactionStrength / touchCount, 1);
    
    return (normalizedTouches * 0.6) + (normalizedReaction * 0.4);
  }

  private calculateSweepPotential(priceData: any[], level: number, levelType: 'high' | 'low'): number {
    const currentPrice = priceData[priceData.length - 1].close;
    const distanceToLevel = Math.abs(currentPrice - level) / currentPrice;
    
    // Closer levels with recent testing have higher sweep potential
    const proximityScore = Math.max(0, 1 - (distanceToLevel * 10));
    
    // Check recent approaches to the level
    let recentApproaches = 0;
    for (let i = Math.max(0, priceData.length - 20); i < priceData.length; i++) {
      const candle = priceData[i];
      const approachThreshold = level * 0.01; // 1% threshold
      
      if (levelType === 'high' && candle.high >= level - approachThreshold) {
        recentApproaches++;
      } else if (levelType === 'low' && candle.low <= level + approachThreshold) {
        recentApproaches++;
      }
    }

    const approachScore = Math.min(recentApproaches / 5, 1);
    
    return (proximityScore * 0.7) + (approachScore * 0.3);
  }

  detectFairValueGaps(priceData: any[], symbol: string): FairValueGap[] {
    const gaps: FairValueGap[] = [];
    
    try {
      if (!priceData || priceData.length < 3) return gaps;

      for (let i = 1; i < priceData.length - 1; i++) {
        const prev = priceData[i - 1];
        const current = priceData[i];
        const next = priceData[i + 1];

        // Bullish FVG: Previous high < Next low (gap up)
        if (prev.high < next.low && current.close > current.open) {
          gaps.push({
            id: `fvg-bull-${symbol}-${i}`,
            symbol,
            gap_high: next.low,
            gap_low: prev.high,
            gap_type: 'bullish',
            filled: false,
            timestamp: current.time
          });
        }

        // Bearish FVG: Previous low > Next high (gap down)
        if (prev.low > next.high && current.close < current.open) {
          gaps.push({
            id: `fvg-bear-${symbol}-${i}`,
            symbol,
            gap_high: prev.low,
            gap_low: next.high,
            gap_type: 'bearish',
            filled: false,
            timestamp: current.time
          });
        }
      }

      return gaps.slice(-5); // Return last 5 FVGs
    } catch (error) {
      console.error('Error detecting fair value gaps:', error);
      return [];
    }
  }

  generateSmartMoneySignal(
    orderBlocks: OrderBlock[],
    liquidityZones: LiquidityZone[],
    fvgs: FairValueGap[],
    currentPrice: number
  ): { action: 'buy' | 'sell' | null; confidence: number; reasoning: string } {
    let bullishSignals = 0;
    let bearishSignals = 0;
    let reasoning: string[] = [];

    // Analyze order blocks
    orderBlocks.forEach(ob => {
      const distanceToPrice = Math.abs(currentPrice - ob.price_level) / currentPrice;
      
      if (distanceToPrice < 0.01 && !ob.invalidated) { // Within 1% of order block
        if (ob.block_type === 'bullish') {
          bullishSignals += ob.strength === 'strong' ? 3 : ob.strength === 'medium' ? 2 : 1;
          reasoning.push(`תמיכה בבלוק אורדר שורי`);
        } else {
          bearishSignals += ob.strength === 'strong' ? 3 : ob.strength === 'medium' ? 2 : 1;
          reasoning.push(`התנגדות בבלוק אורדר דובי`);
        }
      }
    });

    // Analyze liquidity zones
    liquidityZones.forEach(lz => {
      if (currentPrice >= lz.price_low && currentPrice <= lz.price_high) {
        if (lz.zone_type === 'buy_side' && lz.sweep_potential > 0.7) {
          bullishSignals += 2;
          reasoning.push(`אזור נזילות קנייה עם פוטנציאל סוויפ`);
        } else if (lz.zone_type === 'sell_side' && lz.sweep_potential > 0.7) {
          bearishSignals += 2;
          reasoning.push(`אזור נזילות מכירה עם פוטנציאל סוויפ`);
        }
      }
    });

    // Analyze fair value gaps
    fvgs.forEach(fvg => {
      if (!fvg.filled && currentPrice >= fvg.gap_low && currentPrice <= fvg.gap_high) {
        if (fvg.gap_type === 'bullish') {
          bullishSignals += 2;
          reasoning.push(`מילוי פער ערך הוגן שורי`);
        } else {
          bearishSignals += 2;
          reasoning.push(`מילוי פער ערך הוגן דובי`);
        }
      }
    });

    // Determine signal
    const totalSignals = bullishSignals + bearishSignals;
    if (totalSignals < 3) {
      return { action: null, confidence: 0, reasoning: 'אין מספיק איתותים מ-Smart Money' };
    }

    const bullishRatio = bullishSignals / totalSignals;
    const bearishRatio = bearishSignals / totalSignals;

    if (bullishRatio > 0.65) {
      return {
        action: 'buy',
        confidence: Math.min(0.95, bullishRatio),
        reasoning: `Smart Money - ${reasoning.join(', ')}`
      };
    } else if (bearishRatio > 0.65) {
      return {
        action: 'sell',
        confidence: Math.min(0.95, bearishRatio),
        reasoning: `Smart Money - ${reasoning.join(', ')}`
      };
    }

    return { action: null, confidence: 0, reasoning: 'איתותים מעורבים מ-Smart Money' };
  }
}

export const smartMoneyEngine = new SmartMoneyEngine();
