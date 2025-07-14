// LeviPro Trading Methods Integration System
// Integrates all trading methodologies including the custom "משולש הקסם" method

interface MethodAnalysis {
  method: string;
  signal: 'BUY' | 'SELL' | 'NEUTRAL';
  confidence: number; // 0-100
  strength: number; // 0-10
  reasoning: string[];
  confluences: string[];
  timeframe: string;
}

interface MagicTriangleSignal {
  // משולש הקסם - Magic Triangle Method
  setup: 'long' | 'short' | 'none';
  fibonacciLevel: number; // 0.618, 0.786, etc.
  compressionZone: boolean;
  parabolicShift: boolean;
  fakeBreakout: boolean;
  trendExhaustion: boolean;
  engulfingPattern: boolean;
  volumeConfirmation: boolean;
  confidence: number;
}

interface WyckoffAnalysis {
  phase: 'Accumulation' | 'Mark-up' | 'Distribution' | 'Mark-down';
  confidence: number;
  volumeAnalysis: {
    climacticAction: boolean;
    testVolume: boolean;
    absorptionVolume: boolean;
  };
}

interface SMCAnalysis {
  marketStructure: 'bullish' | 'bearish' | 'consolidation';
  liquidityGrabs: number;
  orderBlocks: string[];
  fairValueGaps: boolean;
  institutionalMovement: boolean;
  confidence: number;
}

interface ElliottWaveAnalysis {
  currentWave: number; // 1-5 or A-C
  waveType: 'impulse' | 'corrective';
  completion: number; // Percentage complete
  nextTarget: number;
  confidence: number;
}

export class TradingMethodsIntegration {
  
  // Magic Triangle Method - משולש הקסם (Your Custom Method)
  public analyzeMagicTriangle(priceData: any[], symbol: string, timeframe: string): MagicTriangleSignal {
    const latestPrice = priceData[priceData.length - 1];
    const previousPrices = priceData.slice(-20); // Last 20 candles
    
    // Fibonacci Analysis
    const high = Math.max(...previousPrices.map(p => p.high));
    const low = Math.min(...previousPrices.map(p => p.low));
    const fibLevels = this.calculateFibonacciLevels(high, low);
    
    // Check for key Fibonacci retracements (0.618, 0.786)
    const currentPrice = latestPrice.close;
    const fib618 = Math.abs(currentPrice - fibLevels[0.618]) / currentPrice < 0.005;
    const fib786 = Math.abs(currentPrice - fibLevels[0.786]) / currentPrice < 0.005;
    
    // Compression Zone Detection
    const recentRange = previousPrices.slice(-10);
    const avgRange = recentRange.reduce((sum, p) => sum + (p.high - p.low), 0) / recentRange.length;
    const currentRange = latestPrice.high - latestPrice.low;
    const compressionZone = currentRange < avgRange * 0.5;
    
    // Parabolic Shift Detection
    const priceChanges = previousPrices.slice(-5).map((p, i, arr) => 
      i > 0 ? (p.close - arr[i-1].close) / arr[i-1].close : 0
    );
    const avgChange = priceChanges.reduce((sum, change) => sum + Math.abs(change), 0) / priceChanges.length;
    const parabolicShift = avgChange > 0.03; // More than 3% average change
    
    // Fake Breakout Detection
    const resistance = Math.max(...previousPrices.slice(-10).map(p => p.high));
    const support = Math.min(...previousPrices.slice(-10).map(p => p.low));
    const fakeBreakout = (currentPrice > resistance * 1.002 && latestPrice.close < resistance * 1.001) ||
                        (currentPrice < support * 0.998 && latestPrice.close > support * 0.999);
    
    // Trend Exhaustion
    const longTermTrend = this.calculateTrend(previousPrices.slice(-15));
    const shortTermTrend = this.calculateTrend(previousPrices.slice(-5));
    const trendExhaustion = Math.abs(longTermTrend - shortTermTrend) > 0.02;
    
    // Engulfing Pattern
    const engulfingPattern = this.detectEngulfingPattern(previousPrices.slice(-3));
    
    // Volume Confirmation (simplified)
    const avgVolume = previousPrices.slice(-10).reduce((sum, p) => sum + (p.volume || 0), 0) / 10;
    const volumeConfirmation = (latestPrice.volume || 0) > avgVolume * 1.5;
    
    // Calculate setup and confidence
    let setup: 'long' | 'short' | 'none' = 'none';
    let confidence = 0;
    
    if ((fib618 || fib786) && compressionZone && volumeConfirmation) {
      setup = longTermTrend > 0 ? 'long' : 'short';
      confidence = 75;
    }
    
    if (parabolicShift && !fakeBreakout && engulfingPattern) {
      confidence += 15;
    }
    
    if (trendExhaustion) {
      setup = setup === 'long' ? 'short' : 'long';
      confidence = Math.max(60, confidence);
    }
    
    return {
      setup,
      fibonacciLevel: fib618 ? 0.618 : fib786 ? 0.786 : 0.5,
      compressionZone,
      parabolicShift,
      fakeBreakout,
      trendExhaustion,
      engulfingPattern,
      volumeConfirmation,
      confidence: Math.min(95, confidence)
    };
  }

  // Wyckoff Method Analysis
  public analyzeWyckoff(priceData: any[], volumeData: any[]): WyckoffAnalysis {
    const recentPrices = priceData.slice(-20);
    const recentVolumes = volumeData.slice(-20);
    
    // Volume analysis
    const avgVolume = recentVolumes.reduce((sum, v) => sum + v.value, 0) / recentVolumes.length;
    const climacticAction = recentVolumes.some(v => v.value > avgVolume * 3);
    const testVolume = recentVolumes.slice(-3).every(v => v.value < avgVolume * 0.7);
    const absorptionVolume = recentVolumes.slice(-5).some(v => v.value > avgVolume * 2);
    
    // Price action analysis
    const priceRange = Math.max(...recentPrices.map(p => p.high)) - Math.min(...recentPrices.map(p => p.low));
    const currentPrice = recentPrices[recentPrices.length - 1].close;
    
    // Determine Wyckoff phase
    let phase: 'Accumulation' | 'Mark-up' | 'Distribution' | 'Mark-down';
    let confidence = 0;
    
    if (climacticAction && testVolume) {
      phase = currentPrice < (Math.min(...recentPrices.map(p => p.low)) + priceRange * 0.3) ? 'Accumulation' : 'Distribution';
      confidence = 80;
    } else if (absorptionVolume && !testVolume) {
      phase = 'Mark-up';
      confidence = 70;
    } else {
      phase = 'Mark-down';
      confidence = 60;
    }
    
    return {
      phase,
      confidence,
      volumeAnalysis: {
        climacticAction,
        testVolume,
        absorptionVolume
      }
    };
  }

  // Smart Money Concepts (SMC) Analysis
  public analyzeSMC(priceData: any[]): SMCAnalysis {
    const recentPrices = priceData.slice(-30);
    
    // Market Structure Analysis
    const highs = recentPrices.map(p => p.high);
    const lows = recentPrices.map(p => p.low);
    
    const recentHighs = highs.slice(-5);
    const recentLows = lows.slice(-5);
    const olderHighs = highs.slice(-15, -5);
    const olderLows = lows.slice(-15, -5);
    
    const isBreakingHigher = Math.max(...recentHighs) > Math.max(...olderHighs);
    const isBreakingLower = Math.min(...recentLows) < Math.min(...olderLows);
    
    let marketStructure: 'bullish' | 'bearish' | 'consolidation';
    if (isBreakingHigher && !isBreakingLower) {
      marketStructure = 'bullish';
    } else if (isBreakingLower && !isBreakingHigher) {
      marketStructure = 'bearish';
    } else {
      marketStructure = 'consolidation';
    }
    
    // Liquidity Grabs (simplified)
    const liquidityGrabs = this.detectLiquidityGrabs(recentPrices);
    
    // Order Blocks Detection
    const orderBlocks = this.detectOrderBlocks(recentPrices);
    
    // Fair Value Gaps
    const fairValueGaps = this.detectFairValueGaps(recentPrices.slice(-10));
    
    // Institutional Movement (volume + price action)
    const institutionalMovement = this.detectInstitutionalMovement(recentPrices);
    
    return {
      marketStructure,
      liquidityGrabs,
      orderBlocks,
      fairValueGaps,
      institutionalMovement,
      confidence: 75
    };
  }

  // Elliott Wave Analysis
  public analyzeElliottWave(priceData: any[]): ElliottWaveAnalysis {
    // Simplified Elliott Wave analysis
    const prices = priceData.slice(-50).map(p => p.close);
    const pivots = this.findPivotPoints(prices);
    
    // Determine current wave (simplified)
    const currentWave = (pivots.length % 5) + 1;
    const waveType = currentWave <= 5 ? 'impulse' : 'corrective';
    
    // Calculate completion percentage
    const completion = ((currentWave - 1) / 5) * 100;
    
    // Next target (simplified)
    const currentPrice = prices[prices.length - 1];
    const trend = prices.slice(-10).reduce((sum, p, i, arr) => 
      i > 0 ? sum + (p - arr[i-1]) : sum, 0
    );
    
    const nextTarget = currentPrice + (trend * 0.618); // Fibonacci projection
    
    return {
      currentWave,
      waveType,
      completion,
      nextTarget,
      confidence: 65
    };
  }

  // Comprehensive Multi-Method Analysis
  public performMultiMethodAnalysis(priceData: any[], volumeData: any[], symbol: string, timeframe: string): MethodAnalysis[] {
    const analyses: MethodAnalysis[] = [];
    
    // Magic Triangle (משולש הקסם)
    const magicTriangle = this.analyzeMagicTriangle(priceData, symbol, timeframe);
    if (magicTriangle.setup !== 'none') {
      analyses.push({
        method: 'Magic Triangle (משולש הקסם)',
        signal: magicTriangle.setup === 'long' ? 'BUY' : 'SELL',
        confidence: magicTriangle.confidence,
        strength: magicTriangle.confidence / 10,
        reasoning: this.generateMagicTriangleReasoning(magicTriangle),
        confluences: this.getMagicTriangleConfluences(magicTriangle),
        timeframe
      });
    }
    
    // Wyckoff
    const wyckoff = this.analyzeWyckoff(priceData, volumeData);
    const wyckoffSignal = wyckoff.phase === 'Accumulation' ? 'BUY' : 
                         wyckoff.phase === 'Distribution' ? 'SELL' : 'NEUTRAL';
    if (wyckoffSignal !== 'NEUTRAL') {
      analyses.push({
        method: 'Wyckoff',
        signal: wyckoffSignal,
        confidence: wyckoff.confidence,
        strength: wyckoff.confidence / 10,
        reasoning: [`Wyckoff ${wyckoff.phase} phase detected`],
        confluences: [`Volume Analysis: ${wyckoff.phase}`],
        timeframe
      });
    }
    
    // SMC
    const smc = this.analyzeSMC(priceData);
    const smcSignal = smc.marketStructure === 'bullish' ? 'BUY' : 
                     smc.marketStructure === 'bearish' ? 'SELL' : 'NEUTRAL';
    if (smcSignal !== 'NEUTRAL') {
      analyses.push({
        method: 'Smart Money Concepts',
        signal: smcSignal,
        confidence: smc.confidence,
        strength: smc.confidence / 10,
        reasoning: [`SMC Market Structure: ${smc.marketStructure}`],
        confluences: [`Liquidity Grabs: ${smc.liquidityGrabs}`, `Order Blocks: ${smc.orderBlocks.length}`],
        timeframe
      });
    }
    
    // Add other methods (RSI Divergence, Volume Profile, etc.)
    analyses.push(...this.analyzeOtherMethods(priceData, volumeData, timeframe));
    
    return analyses;
  }

  // Helper Methods
  private calculateFibonacciLevels(high: number, low: number): Record<number, number> {
    const diff = high - low;
    return {
      0: high,
      0.236: high - diff * 0.236,
      0.382: high - diff * 0.382,
      0.5: high - diff * 0.5,
      0.618: high - diff * 0.618,
      0.786: high - diff * 0.786,
      1: low
    };
  }

  private calculateTrend(priceData: any[]): number {
    if (priceData.length < 2) return 0;
    
    const start = priceData[0].close;
    const end = priceData[priceData.length - 1].close;
    return (end - start) / start;
  }

  private detectEngulfingPattern(priceData: any[]): boolean {
    if (priceData.length < 2) return false;
    
    const prev = priceData[priceData.length - 2];
    const current = priceData[priceData.length - 1];
    
    // Bullish engulfing
    const bullishEngulfing = prev.close < prev.open && 
                            current.close > current.open &&
                            current.open < prev.close &&
                            current.close > prev.open;
    
    // Bearish engulfing
    const bearishEngulfing = prev.close > prev.open && 
                            current.close < current.open &&
                            current.open > prev.close &&
                            current.close < prev.open;
    
    return bullishEngulfing || bearishEngulfing;
  }

  private detectLiquidityGrabs(priceData: any[]): number {
    // Simplified liquidity grab detection
    let grabs = 0;
    for (let i = 1; i < priceData.length - 1; i++) {
      const prev = priceData[i - 1];
      const current = priceData[i];
      const next = priceData[i + 1];
      
      // Check for quick spike and retrace
      if ((current.high > prev.high * 1.005 && next.close < current.high * 0.995) ||
          (current.low < prev.low * 0.995 && next.close > current.low * 1.005)) {
        grabs++;
      }
    }
    return grabs;
  }

  private detectOrderBlocks(priceData: any[]): string[] {
    // Simplified order block detection
    const blocks: string[] = [];
    
    for (let i = 2; i < priceData.length - 2; i++) {
      const candle = priceData[i];
      const bodySize = Math.abs(candle.close - candle.open);
      const totalSize = candle.high - candle.low;
      
      // Strong bullish candle with small wicks
      if (candle.close > candle.open && bodySize > totalSize * 0.7) {
        blocks.push(`Bullish Order Block at ${candle.low.toFixed(2)}`);
      }
      
      // Strong bearish candle with small wicks
      if (candle.close < candle.open && bodySize > totalSize * 0.7) {
        blocks.push(`Bearish Order Block at ${candle.high.toFixed(2)}`);
      }
    }
    
    return blocks.slice(-5); // Last 5 order blocks
  }

  private detectFairValueGaps(priceData: any[]): boolean {
    // Detect fair value gaps (price gaps that haven't been filled)
    for (let i = 1; i < priceData.length; i++) {
      const prev = priceData[i - 1];
      const current = priceData[i];
      
      // Bullish gap
      if (current.low > prev.high) return true;
      
      // Bearish gap
      if (current.high < prev.low) return true;
    }
    return false;
  }

  private detectInstitutionalMovement(priceData: any[]): boolean {
    // Simplified institutional movement detection
    const recentCandles = priceData.slice(-5);
    const avgVolume = recentCandles.reduce((sum, p) => sum + (p.volume || 0), 0) / recentCandles.length;
    
    return recentCandles.some(candle => {
      const bodySize = Math.abs(candle.close - candle.open);
      const priceMovement = bodySize / candle.open;
      const volumeSpike = (candle.volume || 0) > avgVolume * 2;
      
      return priceMovement > 0.02 && volumeSpike; // 2%+ move with volume
    });
  }

  private findPivotPoints(prices: number[]): number[] {
    const pivots: number[] = [];
    
    for (let i = 2; i < prices.length - 2; i++) {
      const current = prices[i];
      const prev2 = prices[i - 2];
      const prev1 = prices[i - 1];
      const next1 = prices[i + 1];
      const next2 = prices[i + 2];
      
      // Local high
      if (current > prev2 && current > prev1 && current > next1 && current > next2) {
        pivots.push(current);
      }
      
      // Local low
      if (current < prev2 && current < prev1 && current < next1 && current < next2) {
        pivots.push(current);
      }
    }
    
    return pivots;
  }

  private generateMagicTriangleReasoning(analysis: MagicTriangleSignal): string[] {
    const reasoning: string[] = [];
    
    if (analysis.fibonacciLevel === 0.618) {
      reasoning.push('🎯 Golden Fibonacci 61.8% retracement level');
    }
    if (analysis.compressionZone) {
      reasoning.push('🔒 Price compression zone detected');
    }
    if (analysis.parabolicShift) {
      reasoning.push('📈 Parabolic price movement shift');
    }
    if (analysis.engulfingPattern) {
      reasoning.push('🕯️ Engulfing candlestick pattern');
    }
    if (analysis.volumeConfirmation) {
      reasoning.push('📊 Volume confirmation present');
    }
    
    return reasoning;
  }

  private getMagicTriangleConfluences(analysis: MagicTriangleSignal): string[] {
    const confluences: string[] = [];
    
    if (analysis.fibonacciLevel === 0.618 || analysis.fibonacciLevel === 0.786) {
      confluences.push('Fibonacci Retracement');
    }
    if (analysis.compressionZone) {
      confluences.push('Compression Zone');
    }
    if (analysis.parabolicShift) {
      confluences.push('Parabolic Shift');
    }
    if (analysis.engulfingPattern) {
      confluences.push('Engulfing Pattern');
    }
    if (analysis.volumeConfirmation) {
      confluences.push('Volume Confirmation');
    }
    if (analysis.trendExhaustion) {
      confluences.push('Trend Exhaustion');
    }
    
    return confluences;
  }

  private analyzeOtherMethods(priceData: any[], volumeData: any[], timeframe: string): MethodAnalysis[] {
    const analyses: MethodAnalysis[] = [];
    
    // RSI Divergence
    const rsiAnalysis = this.analyzeRSIDivergence(priceData);
    if (rsiAnalysis.signal !== 'NEUTRAL') {
      analyses.push(rsiAnalysis);
    }
    
    // Volume Profile
    const volumeAnalysis = this.analyzeVolumeProfile(priceData, volumeData, timeframe);
    if (volumeAnalysis.signal !== 'NEUTRAL') {
      analyses.push(volumeAnalysis);
    }
    
    // Support/Resistance
    const srAnalysis = this.analyzeSupportResistance(priceData, timeframe);
    if (srAnalysis.signal !== 'NEUTRAL') {
      analyses.push(srAnalysis);
    }
    
    return analyses;
  }

  private analyzeRSIDivergence(priceData: any[]): MethodAnalysis {
    // Simplified RSI divergence analysis
    const rsiValues = this.calculateRSI(priceData.slice(-14));
    const prices = priceData.slice(-14).map(p => p.close);
    
    const currentRSI = rsiValues[rsiValues.length - 1];
    const prevRSI = rsiValues[rsiValues.length - 2];
    const currentPrice = prices[prices.length - 1];
    const prevPrice = prices[prices.length - 2];
    
    let signal: 'BUY' | 'SELL' | 'NEUTRAL' = 'NEUTRAL';
    let confidence = 0;
    
    // Bullish divergence
    if (currentPrice < prevPrice && currentRSI > prevRSI && currentRSI < 30) {
      signal = 'BUY';
      confidence = 75;
    }
    
    // Bearish divergence
    if (currentPrice > prevPrice && currentRSI < prevRSI && currentRSI > 70) {
      signal = 'SELL';
      confidence = 75;
    }
    
    return {
      method: 'RSI Divergence',
      signal,
      confidence,
      strength: confidence / 10,
      reasoning: [`RSI: ${currentRSI.toFixed(1)}`],
      confluences: signal !== 'NEUTRAL' ? ['RSI Divergence'] : [],
      timeframe: 'Multiple'
    };
  }

  private analyzeVolumeProfile(priceData: any[], volumeData: any[], timeframe: string): MethodAnalysis {
    // Simplified volume profile analysis
    const avgVolume = volumeData.slice(-20).reduce((sum, v) => sum + v.value, 0) / 20;
    const recentVolume = volumeData.slice(-3).reduce((sum, v) => sum + v.value, 0) / 3;
    
    let signal: 'BUY' | 'SELL' | 'NEUTRAL' = 'NEUTRAL';
    let confidence = 0;
    
    if (recentVolume > avgVolume * 1.5) {
      const priceDirection = priceData[priceData.length - 1].close - priceData[priceData.length - 2].close;
      signal = priceDirection > 0 ? 'BUY' : 'SELL';
      confidence = 70;
    }
    
    return {
      method: 'Volume Profile',
      signal,
      confidence,
      strength: confidence / 10,
      reasoning: [`Volume: ${(recentVolume / avgVolume).toFixed(1)}x average`],
      confluences: signal !== 'NEUTRAL' ? ['Volume Spike'] : [],
      timeframe
    };
  }

  private analyzeSupportResistance(priceData: any[], timeframe: string): MethodAnalysis {
    // Simplified support/resistance analysis
    const prices = priceData.slice(-20);
    const currentPrice = prices[prices.length - 1].close;
    
    const highs = prices.map(p => p.high);
    const lows = prices.map(p => p.low);
    
    const resistance = Math.max(...highs.slice(-10));
    const support = Math.min(...lows.slice(-10));
    
    let signal: 'BUY' | 'SELL' | 'NEUTRAL' = 'NEUTRAL';
    let confidence = 0;
    
    // Near support
    if (Math.abs(currentPrice - support) / currentPrice < 0.02) {
      signal = 'BUY';
      confidence = 65;
    }
    
    // Near resistance
    if (Math.abs(currentPrice - resistance) / currentPrice < 0.02) {
      signal = 'SELL';
      confidence = 65;
    }
    
    return {
      method: 'Support/Resistance',
      signal,
      confidence,
      strength: confidence / 10,
      reasoning: [`Price near ${signal === 'BUY' ? 'support' : 'resistance'}`],
      confluences: signal !== 'NEUTRAL' ? ['Key Level'] : [],
      timeframe
    };
  }

  private calculateRSI(priceData: any[], period: number = 14): number[] {
    // Simplified RSI calculation
    const rsi: number[] = [];
    const prices = priceData.map(p => p.close);
    
    for (let i = period; i < prices.length; i++) {
      const gains: number[] = [];
      const losses: number[] = [];
      
      for (let j = i - period + 1; j <= i; j++) {
        const change = prices[j] - prices[j - 1];
        if (change > 0) {
          gains.push(change);
          losses.push(0);
        } else {
          gains.push(0);
          losses.push(Math.abs(change));
        }
      }
      
      const avgGain = gains.reduce((sum, gain) => sum + gain, 0) / period;
      const avgLoss = losses.reduce((sum, loss) => sum + loss, 0) / period;
      
      const rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
      const rsiValue = 100 - (100 / (1 + rs));
      rsi.push(rsiValue);
    }
    
    return rsi;
  }
}

export const tradingMethodsIntegration = new TradingMethodsIntegration();