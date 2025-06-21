
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
      name: 'Almog Personal Method - Triangle Magic',
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
        console.log('🛡️ Personal Method is immune to changes');
        return;
      }
      
      Object.assign(strategy, updates);
      this.strategies.set(strategyId, strategy);
      console.log(`✅ Strategy ${strategyId} updated`);
    }
  }

  // ALMOG'S PERSONAL METHOD - THE CORE STRATEGY
  private analyzePersonalMethod(marketData: MarketData): TradingSignal[] {
    const signals: TradingSignal[] = [];
    
    // EMOTIONAL PRESSURE ANALYSIS - CORE OF PERSONAL METHOD
    const emotionalPressure = this.calculateEmotionalPressure(marketData);
    
    // MOMENTUM ANALYSIS WITH CANDLE PATTERNS
    const momentumSignal = this.analyzeMomentumWithCandles(marketData);
    
    // BREAKOUT CONFIRMATION WITH VOLUME
    const breakoutConfirmation = this.analyzeBreakoutWithVolume(marketData);
    
    // COMBINE ALL THREE FOR TRIANGLE MAGIC
    if (emotionalPressure > 0.7 && momentumSignal > 0.6 && breakoutConfirmation) {
      const signal: TradingSignal = {
        id: `personal-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        symbol: marketData.symbol,
        strategy: 'almog-personal-method',
        action: momentumSignal > 0.8 ? 'buy' : 'sell',
        price: marketData.price,
        targetPrice: momentumSignal > 0.8 ? marketData.price * 1.03 : marketData.price * 0.97,
        stopLoss: momentumSignal > 0.8 ? marketData.price * 0.98 : marketData.price * 1.02,
        confidence: Math.min(emotionalPressure * momentumSignal, 0.95),
        riskRewardRatio: 1.5,
        reasoning: `Personal Method Triangle: Emotional Pressure ${(emotionalPressure * 100).toFixed(0)}% + Momentum ${(momentumSignal * 100).toFixed(0)}% + Volume Confirmation`,
        timestamp: Date.now(),
        status: 'active',
        telegramSent: false,
        metadata: {
          personalMethod: true,
          emotionalPressure,
          momentumSignal,
          breakoutConfirmation,
          triangleMagic: true
        }
      };
      
      signals.push(signal);
      console.log('🔥 Personal Method Signal Generated:', signal.symbol, signal.action, `${(signal.confidence * 100).toFixed(0)}%`);
    }
    
    return signals;
  }

  private calculateEmotionalPressure(marketData: MarketData): number {
    // Real emotional pressure calculation based on RSI, volatility, and volume spikes
    const rsi = marketData.rsi || 50;
    const volumeSpike = marketData.volume > marketData.avgVolume * 1.5;
    const priceVolatility = Math.abs(marketData.priceChange / marketData.price) * 100;
    
    let pressure = 0;
    
    // RSI extremes create emotional pressure
    if (rsi > 70) pressure += (rsi - 70) / 30; // Overbought pressure
    if (rsi < 30) pressure += (30 - rsi) / 30; // Oversold pressure
    
    // Volume spikes indicate emotional trading
    if (volumeSpike) pressure += 0.3;
    
    // High volatility = high emotions
    if (priceVolatility > 2) pressure += Math.min(priceVolatility / 10, 0.4);
    
    return Math.min(pressure, 1.0);
  }

  private analyzeMomentumWithCandles(marketData: MarketData): number {
    // Real momentum analysis with candlestick patterns
    const priceChange = marketData.priceChange;
    const volumeRatio = marketData.volume / marketData.avgVolume;
    const candlePattern = marketData.candlestickPattern || '';
    
    let momentum = 0.5;
    
    // Price momentum
    if (Math.abs(priceChange) > marketData.price * 0.01) {
      momentum += priceChange > 0 ? 0.2 : -0.2;
    }
    
    // Volume confirmation
    if (volumeRatio > 1.2) momentum += 0.15;
    
    // Candlestick pattern boost
    const bullishPatterns = ['hammer', 'engulfing_bull', 'piercing_line', 'morning_star'];
    const bearishPatterns = ['shooting_star', 'engulfing_bear', 'dark_cloud', 'evening_star'];
    
    if (bullishPatterns.includes(candlePattern)) momentum += 0.25;
    if (bearishPatterns.includes(candlePattern)) momentum -= 0.25;
    
    return Math.max(0, Math.min(1, momentum));
  }

  private analyzeBreakoutWithVolume(marketData: MarketData): boolean {
    // Real breakout analysis with volume confirmation
    const volumeRatio = marketData.volume / marketData.avgVolume;
    const priceChange = Math.abs(marketData.priceChange);
    const volatility = priceChange / marketData.price;
    
    // Confirmed breakout needs volume spike + significant price move
    return volumeRatio > 1.3 && volatility > 0.015;
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
