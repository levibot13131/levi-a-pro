import { MarketData, TradingStrategy } from '@/types/trading';
import { TradingSignal } from '@/types/trading';

export class StrategyEngine {
  private strategies = new Map<string, any>();
  private weights = new Map<string, number>();

  constructor() {
    this.initializeStrategies();
  }

  private initializeStrategies() {
    console.log('🧠 Initializing LeviPro Strategy Engine with Personal Method Priority');
    
    // ALMOG'S PERSONAL STRATEGY - HARDCODED 80% WEIGHT - IMMUNE TO AUTO-DISABLE
    this.strategies.set('almog-personal-method', {
      name: 'Almog Personal Method - LeviPro Triangle Magic',
      weight: 0.80, // HARDCODED - NEVER CHANGES
      immune: true, // IMMUNE TO AUTO-DISABLE
      priority: 1, // ALWAYS FIRST
      analyze: this.analyzePersonalMethod.bind(this)
    });

    // RSI + MACD Strategy
    this.strategies.set('rsi-macd-strategy', {
      name: 'RSI + MACD Confluence',
      weight: 0.15,
      immune: false,
      priority: 2,
      analyze: this.analyzeRSI_MACD.bind(this)
    });

    // VWAP Strategy
    this.strategies.set('vwap-strategy', {
      name: 'VWAP + Volume Profile',
      weight: 0.12,
      immune: false,
      priority: 3,
      analyze: this.analyzeVWAP.bind(this)
    });

    // Smart Money Concepts
    this.strategies.set('smc-strategy', {
      name: 'Smart Money Concepts',
      weight: 0.10,
      immune: false,
      priority: 4,
      analyze: this.analyzeSMC.bind(this)
    });

    // Wyckoff Method
    this.strategies.set('wyckoff-strategy', {
      name: 'Wyckoff Method',
      weight: 0.08,
      immune: false,
      priority: 5,
      analyze: this.analyzeWyckoff.bind(this)
    });

    // Elliott Wave
    this.strategies.set('elliott-wave-strategy', {
      name: 'Elliott Wave Theory',
      weight: 0.07,
      immune: false,
      priority: 6,
      analyze: this.analyzeElliottWave.bind(this)
    });

    // Fibonacci Strategy
    this.strategies.set('fibonacci-strategy', {
      name: 'Fibonacci Retracement',
      weight: 0.06,
      immune: false,
      priority: 7,
      analyze: this.analyzeFibonacci.bind(this)
    });

    // Candlestick Patterns
    this.strategies.set('candlestick-strategy', {
      name: 'Advanced Candlestick Patterns',
      weight: 0.05,
      immune: false,
      priority: 8,
      analyze: this.analyzeCandlesticks.bind(this)
    });

    console.log('✅ Strategy Engine initialized with 8 strategies');
    console.log('🔥 Personal Method Priority: 80% weight, immune to disable');
  }

  // ADD MISSING METHOD
  public updateStrategy(strategyId: string, updates: Partial<any>): void {
    const strategy = this.strategies.get(strategyId);
    if (strategy) {
      // Personal method is immune to changes
      if (strategyId === 'almog-personal-method' && strategy.immune) {
        console.log('🛡️ Personal Method is immune to changes - maintaining 80% weight');
        return;
      }
      
      Object.assign(strategy, updates);
      this.strategies.set(strategyId, strategy);
      console.log(`✅ Strategy ${strategyId} updated`);
    }
  }

  // ALMOG'S PERSONAL METHOD - THE CORE STRATEGY - FULLY ENHANCED
  private analyzePersonalMethod(marketData: MarketData): TradingSignal[] {
    const signals: TradingSignal[] = [];
    
    console.log(`🧠 Analyzing ${marketData.symbol} with Personal Method - Price: $${marketData.price?.toFixed(2) || 'N/A'}`);
    
    // EMOTIONAL PRESSURE ANALYSIS - CORE OF PERSONAL METHOD
    const emotionalPressure = this.calculateEmotionalPressure(marketData);
    
    // MOMENTUM ANALYSIS WITH CANDLE PATTERNS
    const momentumSignal = this.analyzeMomentumWithCandles(marketData);
    
    // BREAKOUT CONFIRMATION WITH VOLUME
    const breakoutConfirmation = this.analyzeBreakoutWithVolume(marketData);
    
    // TRIANGLE PATTERN DETECTION
    const trianglePattern = this.detectTrianglePattern(marketData);
    
    // PRESSURE ZONES IDENTIFICATION
    const pressureZones = this.identifyPressureZones(marketData);
    
    console.log(`📊 ${marketData.symbol} Analysis: Emotional=${(emotionalPressure*100).toFixed(0)}%, Momentum=${(momentumSignal*100).toFixed(0)}%, Breakout=${breakoutConfirmation}, Triangle=${trianglePattern}, Zones=${pressureZones.length}`);
    
    // COMBINE ALL FACTORS FOR LEVIPI METHOD
    const combinedSignal = this.combineLeviProFactors(emotionalPressure, momentumSignal, breakoutConfirmation, trianglePattern, pressureZones);
    
    if (combinedSignal.shouldTrade) {
      const currentPrice = marketData.price || 0;
      
      // Calculate proper entry, target, and stop loss based on method
      const { targetPrice, stopLoss } = this.calculatePersonalMethodLevels(currentPrice, combinedSignal.action, marketData);
      
      const signal: TradingSignal = {
        id: `personal-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        symbol: marketData.symbol,
        strategy: 'almog-personal-method',
        action: combinedSignal.action,
        price: currentPrice,
        targetPrice,
        stopLoss,
        confidence: combinedSignal.confidence,
        riskRewardRatio: Math.abs(targetPrice - currentPrice) / Math.abs(currentPrice - stopLoss),
        reasoning: `LeviPro Method: ${combinedSignal.reasoning}`,
        timestamp: Date.now(),
        status: 'active',
        telegramSent: false,
        metadata: {
          personalMethod: true,
          emotionalPressure,
          momentumSignal,
          breakoutConfirmation,
          trianglePattern,
          pressureZones: pressureZones.length,
          leviProMethod: true
        }
      };
      
      signals.push(signal);
      console.log(`🔥 PERSONAL METHOD SIGNAL: ${signal.action.toUpperCase()} ${signal.symbol} at $${signal.price.toFixed(2)} -> TP: $${signal.targetPrice.toFixed(2)}, SL: $${signal.stopLoss.toFixed(2)} (${(signal.confidence * 100).toFixed(0)}%)`);
    }
    
    return signals;
  }

  private calculateEmotionalPressure(marketData: MarketData): number {
    const rsi = marketData.rsi || 50;
    const volumeSpike = (marketData.volume || 0) > (marketData.avgVolume || 1) * 1.5;
    const priceVolatility = Math.abs((marketData.priceChange || 0)) / (marketData.price || 1) * 100;
    
    let pressure = 0;
    
    // RSI extremes create emotional pressure
    if (rsi > 70) pressure += (rsi - 70) / 30; // Overbought pressure
    if (rsi < 30) pressure += (30 - rsi) / 30; // Oversold pressure
    
    // Volume spikes indicate emotional trading
    if (volumeSpike) pressure += 0.3;
    
    // High volatility = high emotions
    if (priceVolatility > 2) pressure += Math.min(priceVolatility / 10, 0.4);
    
    // MACD divergence adds pressure
    const macd = marketData.macdData || marketData.macd;
    if (macd && Math.abs(macd.histogram || 0) > 50) pressure += 0.2;
    
    return Math.min(pressure, 1.0);
  }

  private analyzeMomentumWithCandles(marketData: MarketData): number {
    const priceChange = marketData.priceChange || 0;
    const volumeRatio = (marketData.volume || 0) / (marketData.avgVolume || 1);
    const candlePattern = marketData.candlestickPattern || '';
    
    let momentum = 0.5;
    
    // Price momentum
    if (Math.abs(priceChange) > 1) {
      momentum += priceChange > 0 ? 0.2 : -0.2;
    }
    
    // Volume confirmation
    if (volumeRatio > 1.2) momentum += 0.15;
    
    // Candlestick pattern boost
    const bullishPatterns = ['hammer', 'engulfing_bull', 'piercing_line', 'morning_star'];
    const bearishPatterns = ['shooting_star', 'engulfing_bear', 'dark_cloud', 'evening_star'];
    
    if (bullishPatterns.includes(candlePattern)) momentum += 0.25;
    if (bearishPatterns.includes(candlePattern)) momentum -= 0.25;
    
    // VWAP momentum
    const price = marketData.price || 0;
    const vwap = marketData.vwap || price;
    if (price > vwap * 1.005) momentum += 0.1;
    if (price < vwap * 0.995) momentum -= 0.1;
    
    return Math.max(0, Math.min(1, momentum));
  }

  private analyzeBreakoutWithVolume(marketData: MarketData): boolean {
    const volumeRatio = (marketData.volume || 0) / (marketData.avgVolume || 1);
    const priceChange = Math.abs(marketData.priceChange || 0);
    
    // Confirmed breakout needs volume spike + significant price move
    return volumeRatio > 1.3 && priceChange > 1.5;
  }

  private detectTrianglePattern(marketData: MarketData): boolean {
    // Simplified triangle detection based on price action and volatility
    const rsi = marketData.rsi || 50;
    const priceChange = Math.abs(marketData.priceChange || 0);
    const volumeRatio = (marketData.volume || 0) / (marketData.avgVolume || 1);
    
    // Triangle formation: decreasing volatility + RSI in middle range + volume buildup
    const isTriangle = priceChange < 2 && rsi > 40 && rsi < 60 && volumeRatio > 1.1;
    
    return isTriangle;
  }

  private identifyPressureZones(marketData: MarketData): Array<{level: number, type: 'support' | 'resistance'}> {
    const price = marketData.price || 0;
    const zones = [];
    
    // VWAP as dynamic support/resistance
    const vwap = marketData.vwap || price;
    if (Math.abs(price - vwap) / price < 0.01) {
      zones.push({ level: vwap, type: price > vwap ? 'support' : 'resistance' });
    }
    
    // Fibonacci levels as pressure zones
    const fib = marketData.fibonacci;
    if (fib) {
      if (Math.abs(price - fib.level618) / price < 0.005) {
        zones.push({ level: fib.level618, type: 'support' });
      }
      if (Math.abs(price - fib.level786) / price < 0.005) {
        zones.push({ level: fib.level786, type: 'resistance' });
      }
    }
    
    return zones;
  }

  private combineLeviProFactors(
    emotionalPressure: number,
    momentumSignal: number,
    breakoutConfirmation: boolean,
    trianglePattern: boolean,
    pressureZones: Array<{level: number, type: 'support' | 'resistance'}>
  ): { shouldTrade: boolean; action: 'buy' | 'sell'; confidence: number; reasoning: string } {
    
    // LeviPro Method requires multiple confirmations
    const hasEmotionalSignal = emotionalPressure > 0.6;
    const hasMomentumSignal = momentumSignal > 0.6 || momentumSignal < 0.4;
    const hasVolumeConfirmation = breakoutConfirmation;
    const hasPatternSetup = trianglePattern || pressureZones.length > 0;
    
    const confirmations = [hasEmotionalSignal, hasMomentumSignal, hasVolumeConfirmation, hasPatternSetup].filter(Boolean).length;
    
    if (confirmations >= 3) {
      const action = momentumSignal > 0.5 ? 'buy' : 'sell';
      const confidence = Math.min((emotionalPressure + Math.abs(momentumSignal - 0.5) * 2 + (breakoutConfirmation ? 0.2 : 0)) / 1.4, 0.95);
      
      const reasoning = `Emotional pressure ${(emotionalPressure * 100).toFixed(0)}% + Momentum ${action} + ${breakoutConfirmation ? 'Volume breakout' : 'Pattern setup'} + ${pressureZones.length} pressure zones`;
      
      return {
        shouldTrade: true,
        action,
        confidence,
        reasoning
      };
    }
    
    return {
      shouldTrade: false,
      action: 'buy',
      confidence: 0,
      reasoning: `Insufficient confirmations: ${confirmations}/4 required`
    };
  }

  private calculatePersonalMethodLevels(currentPrice: number, action: 'buy' | 'sell', marketData: MarketData): { targetPrice: number; stopLoss: number } {
    const volatilityMultiplier = Math.max(Math.abs(marketData.priceChange || 2) / 100, 0.015);
    
    if (action === 'buy') {
      return {
        targetPrice: currentPrice * (1 + volatilityMultiplier * 2), // 2:1 R/R minimum
        stopLoss: currentPrice * (1 - volatilityMultiplier)
      };
    } else {
      return {
        targetPrice: currentPrice * (1 - volatilityMultiplier * 2),
        stopLoss: currentPrice * (1 + volatilityMultiplier)
      };
    }
  }

  // RSI + MACD Strategy Implementation
  private analyzeRSI_MACD(marketData: MarketData): TradingSignal[] {
    const signals: TradingSignal[] = [];
    const rsi = marketData.rsi;
    const macd = marketData.macdData;
    
    // RSI oversold + MACD bullish crossover
    if (rsi < 30 && macd.macd > macd.signal && macd.histogram > 0) {
      signals.push(this.createSignal(marketData, 'rsi-macd-strategy', 'buy', 0.75, 'RSI oversold + MACD bullish crossover'));
    }
    
    // RSI overbought + MACD bearish crossover
    if (rsi > 70 && macd.macd < macd.signal && macd.histogram < 0) {
      signals.push(this.createSignal(marketData, 'rsi-macd-strategy', 'sell', 0.75, 'RSI overbought + MACD bearish crossover'));
    }
    
    return signals;
  }

  // VWAP Strategy Implementation
  private analyzeVWAP(marketData: MarketData): TradingSignal[] {
    const signals: TradingSignal[] = [];
    const price = marketData.price;
    const vwap = marketData.vwap;
    const volumeRatio = marketData.volume / marketData.avgVolume;
    
    // Price above VWAP with volume confirmation
    if (price > vwap * 1.005 && volumeRatio > 1.2) {
      signals.push(this.createSignal(marketData, 'vwap-strategy', 'buy', 0.65, 'Price above VWAP with volume'));
    }
    
    // Price below VWAP with volume confirmation
    if (price < vwap * 0.995 && volumeRatio > 1.2) {
      signals.push(this.createSignal(marketData, 'vwap-strategy', 'sell', 0.65, 'Price below VWAP with volume'));
    }
    
    return signals;
  }

  // Smart Money Concepts Strategy
  private analyzeSMC(marketData: MarketData): TradingSignal[] {
    const signals: TradingSignal[] = [];
    const smc = marketData.smcSignals;
    
    if (smc.orderBlock && smc.liquiditySweep) {
      const action = smc.bias === 'bullish' ? 'buy' : 'sell';
      signals.push(this.createSignal(marketData, 'smc-strategy', action, 0.8, `SMC ${smc.bias} bias with order block`));
    }
    
    return signals;
  }

  // Wyckoff Method Strategy
  private analyzeWyckoff(marketData: MarketData): TradingSignal[] {
    const signals: TradingSignal[] = [];
    const phase = marketData.wyckoffPhase;
    const volumeRatio = marketData.volume / marketData.avgVolume;
    
    // Accumulation phase with volume
    if (phase === 'accumulation' && volumeRatio > 1.5) {
      signals.push(this.createSignal(marketData, 'wyckoff-strategy', 'buy', 0.7, 'Wyckoff accumulation phase'));
    }
    
    // Distribution phase with volume
    if (phase === 'distribution' && volumeRatio > 1.5) {
      signals.push(this.createSignal(marketData, 'wyckoff-strategy', 'sell', 0.7, 'Wyckoff distribution phase'));
    }

    // Spring test (end of accumulation)
    if (phase === 'spring' && volumeRatio > 1.3) {
      signals.push(this.createSignal(marketData, 'wyckoff-strategy', 'buy', 0.85, 'Wyckoff spring - end of accumulation'));
    }

    // UTAD (end of distribution)
    if (phase === 'utad' && volumeRatio > 1.3) {
      signals.push(this.createSignal(marketData, 'wyckoff-strategy', 'sell', 0.85, 'Wyckoff UTAD - end of distribution'));
    }
    
    return signals;
  }

  // Elliott Wave Strategy
  private analyzeElliottWave(marketData: MarketData): TradingSignal[] {
    const signals: TradingSignal[] = [];
    const priceChange = marketData.priceChange;
    const volumeRatio = marketData.volume / marketData.avgVolume;
    
    // Simplified Elliott Wave - Wave 3 detection
    if (Math.abs(priceChange) > marketData.price * 0.02 && volumeRatio > 1.4) {
      const action = priceChange > 0 ? 'buy' : 'sell';
      signals.push(this.createSignal(marketData, 'elliott-wave-strategy', action, 0.6, 'Potential Elliott Wave 3'));
    }
    
    return signals;
  }

  // Fibonacci Strategy
  private analyzeFibonacci(marketData: MarketData): TradingSignal[] {
    const signals: TradingSignal[] = [];
    const fib = marketData.fibonacciData;
    
    if (fib.atKeyLevel && fib.reversalPattern) {
      const action = marketData.price > marketData.vwap ? 'sell' : 'buy';
      signals.push(this.createSignal(marketData, 'fibonacci-strategy', action, 0.65, `Fibonacci ${fib.level}% level reversal`));
    }
    
    return signals;
  }

  // Candlestick Patterns Strategy
  private analyzeCandlesticks(marketData: MarketData): TradingSignal[] {
    const signals: TradingSignal[] = [];
    const pattern = marketData.candlestickPattern;
    
    const bullishPatterns = ['hammer', 'engulfing_bull', 'piercing_line', 'morning_star'];
    const bearishPatterns = ['shooting_star', 'engulfing_bear', 'dark_cloud', 'evening_star'];
    
    if (bullishPatterns.includes(pattern)) {
      signals.push(this.createSignal(marketData, 'candlestick-strategy', 'buy', 0.6, `Bullish ${pattern} pattern`));
    }
    
    if (bearishPatterns.includes(pattern)) {
      signals.push(this.createSignal(marketData, 'candlestick-strategy', 'sell', 0.6, `Bearish ${pattern} pattern`));
    }
    
    return signals;
  }

  private createSignal(marketData: MarketData, strategy: string, action: 'buy' | 'sell', confidence: number, reasoning: string): TradingSignal {
    return {
      id: `${strategy}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      symbol: marketData.symbol,
      strategy,
      action,
      price: marketData.price,
      targetPrice: action === 'buy' ? marketData.price * 1.025 : marketData.price * 0.975,
      stopLoss: action === 'buy' ? marketData.price * 0.98 : marketData.price * 1.02,
      confidence,
      riskRewardRatio: 1.25,
      reasoning,
      timestamp: Date.now(),
      status: 'active',
      telegramSent: false
    };
  }

  public analyzeMarket(marketData: MarketData): TradingSignal[] {
    const allSignals: TradingSignal[] = [];
    
    // Get strategies sorted by priority
    const sortedStrategies = Array.from(this.strategies.entries())
      .sort(([,a], [,b]) => a.priority - b.priority);
    
    for (const [strategyId, strategy] of sortedStrategies) {
      if (strategy.analyze) {
        try {
          const signals = strategy.analyze(marketData);
          allSignals.push(...signals);
          
          if (strategyId === 'almog-personal-method' && signals.length > 0) {
            console.log('🔥 Personal Method generated signals - highest priority!');
          }
        } catch (error) {
          console.error(`Error in strategy ${strategyId}:`, error);
        }
      }
    }
    
    return allSignals;
  }

  public getActiveStrategies(): TradingStrategy[] {
    const strategies: TradingStrategy[] = [];
    
    for (const [id, strategy] of this.strategies) {
      strategies.push({
        id,
        name: strategy.name,
        type: id === 'almog-personal-method' ? 'personal' : 'technical',
        isActive: true,
        weight: strategy.weight,
        parameters: {},
        successRate: Math.random() * 0.3 + 0.7, // Mock success rate 70-100%
        totalSignals: Math.floor(Math.random() * 50) + 10,
        profitableSignals: Math.floor(Math.random() * 40) + 8,
        createdAt: Date.now() - Math.random() * 86400000 * 30,
        updatedAt: Date.now()
      });
    }
    
    return strategies;
  }
}

export const strategyEngine = new StrategyEngine();
