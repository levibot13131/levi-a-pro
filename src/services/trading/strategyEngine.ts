
import { MarketData } from '@/types/trading';
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
    const volumeSpike = (marketData.volume || 0) > (marketData.avgVolume || 1) * 1.5;
    const priceVolatility = Math.abs((marketData.priceChange || 0) / marketData.price) * 100;
    
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
    const priceChange = marketData.priceChange || 0;
    const volumeRatio = (marketData.volume || 0) / (marketData.avgVolume || 1);
    const candlePattern = marketData.candlestickPattern || '';
    
    let momentum = 0.5;
    
    // Price momentum
    if (Math.abs(priceChange) > marketData.price * 0.01) {
      momentum += priceChange > 0 ? 0.2 : -0.2;
    }
    
    // Volume confirmation
    if (volumeRatio > 1.2) momentum += 0.15;
    
    // Candlest ick pattern boost
    const bullishPatterns = ['hammer', 'engulfing_bull', 'piercing_line', 'morning_star'];
    const bearishPatterns = ['shooting_star', 'engulfing_bear', 'dark_cloud', 'evening_star'];
    
    if (bullishPatterns.includes(candlePattern)) momentum += 0.25;
    if (bearishPatterns.includes(candlePattern)) momentum -= 0.25;
    
    return Math.max(0, Math.min(1, momentum));
  }

  private analyzeBreakoutWithVolume(marketData: MarketData): boolean {
    // Real breakout analysis with volume confirmation
    const volumeRatio = (marketData.volume || 0) / (marketData.avgVolume || 1);
    const priceChange = Math.abs(marketData.priceChange || 0);
    const volatility = priceChange / marketData.price;
    
    // Confirmed breakout needs volume spike + significant price move
    return volumeRatio > 1.3 && volatility > 0.015;
  }

  // RSI + MACD Strategy Implementation
  private analyzeRSI_MACD(marketData: MarketData): TradingSignal[] {
    const signals: TradingSignal[] = [];
    const rsi = marketData.rsi || 50;
    const macd = marketData.macdData;
    
    if (!macd) return signals;
    
    // RSI oversold + MACD bullish crossover
    if (rsi < 30 && macd.histogram > 0 && macd.macd > macd.signal) {
      signals.push(this.createSignal(marketData, 'rsi-macd-strategy', 'buy', 0.75, 'RSI Oversold + MACD Bullish'));
    }
    
    // RSI overbought + MACD bearish crossover
    if (rsi > 70 && macd.histogram < 0 && macd.macd < macd.signal) {
      signals.push(this.createSignal(marketData, 'rsi-macd-strategy', 'sell', 0.75, 'RSI Overbought + MACD Bearish'));
    }
    
    return signals;
  }

  // VWAP Strategy Implementation
  private analyzeVWAP(marketData: MarketData): TradingSignal[] {
    const signals: TradingSignal[] = [];
    const vwap = marketData.vwap;
    const price = marketData.price;
    
    if (!vwap) return signals;
    
    // Price above VWAP with volume confirmation
    if (price > vwap * 1.002 && (marketData.volume || 0) > (marketData.avgVolume || 1) * 1.2) {
      signals.push(this.createSignal(marketData, 'vwap-strategy', 'buy', 0.70, 'Price Above VWAP + Volume'));
    }
    
    // Price below VWAP with volume confirmation
    if (price < vwap * 0.998 && (marketData.volume || 0) > (marketData.avgVolume || 1) * 1.2) {
      signals.push(this.createSignal(marketData, 'vwap-strategy', 'sell', 0.70, 'Price Below VWAP + Volume'));
    }
    
    return signals;
  }

  // Smart Money Concepts Implementation
  private analyzeSMC(marketData: MarketData): TradingSignal[] {
    const signals: TradingSignal[] = [];
    const smcData = marketData.smcSignals;
    
    if (!smcData) return signals;
    
    // Order block identification and liquidity sweep
    if (smcData.orderBlock && smcData.liquiditySweep) {
      const action = smcData.bias === 'bullish' ? 'buy' : 'sell';
      signals.push(this.createSignal(marketData, 'smc-strategy', action, 0.80, 'Order Block + Liquidity Sweep'));
    }
    
    return signals;
  }

  // Wyckoff Method Implementation
  private analyzeWyckoff(marketData: MarketData): TradingSignal[] {
    const signals: TradingSignal[] = [];
    const phase = marketData.wyckoffPhase;
    
    if (!phase) return signals;
    
    // Wyckoff Spring (buy signal)
    if (phase === 'spring' && marketData.volume && marketData.volume > (marketData.avgVolume || 1) * 1.1) {
      signals.push(this.createSignal(marketData, 'wyckoff-strategy', 'buy', 0.85, 'Wyckoff Spring Phase'));
    }
    
    // Wyckoff UTAD (sell signal)
    if (phase === 'utad' && marketData.volume && marketData.volume > (marketData.avgVolume || 1) * 1.1) {
      signals.push(this.createSignal(marketData, 'wyckoff-strategy', 'sell', 0.85, 'Wyckoff UTAD Phase'));
    }
    
    return signals;
  }

  // Elliott Wave Implementation
  private analyzeElliottWave(marketData: MarketData): TradingSignal[] {
    const signals: TradingSignal[] = [];
    
    // Simplified Elliott Wave - Wave 3 detection
    const priceChange = marketData.priceChange || 0;
    const volumeRatio = (marketData.volume || 0) / (marketData.avgVolume || 1);
    
    // Strong momentum with volume suggests Wave 3
    if (Math.abs(priceChange) > marketData.price * 0.02 && volumeRatio > 1.5) {
      const action = priceChange > 0 ? 'buy' : 'sell';
      signals.push(this.createSignal(marketData, 'elliott-wave-strategy', action, 0.65, 'Elliott Wave 3 Detection'));
    }
    
    return signals;
  }

  // Fibonacci Strategy Implementation
  private analyzeFibonacci(marketData: MarketData): TradingSignal[] {
    const signals: TradingSignal[] = [];
    const fibData = marketData.fibonacciData;
    
    if (!fibData) return signals;
    
    // Price at key Fibonacci level with reversal signs
    if (fibData.atKeyLevel && fibData.reversalPattern) {
      const action = fibData.level < 50 ? 'buy' : 'sell'; // Below 50% = buy, above = sell
      signals.push(this.createSignal(marketData, 'fibonacci-strategy', action, 0.70, `Fibonacci ${fibData.level}% Reversal`));
    }
    
    return signals;
  }

  // Candlestick Patterns Implementation
  private analyzeCandlesticks(marketData: MarketData): TradingSignal[] {
    const signals: TradingSignal[] = [];
    const pattern = marketData.candlestickPattern;
    
    if (!pattern) return signals;
    
    const bullishPatterns = ['hammer', 'engulfing_bull', 'piercing_line', 'morning_star', 'dragonfly_doji'];
    const bearishPatterns = ['shooting_star', 'engulfing_bear', 'dark_cloud', 'evening_star', 'gravestone_doji'];
    
    if (bullishPatterns.includes(pattern)) {
      signals.push(this.createSignal(marketData, 'candlestick-strategy', 'buy', 0.60, `Bullish ${pattern}`));
    }
    
    if (bearishPatterns.includes(pattern)) {
      signals.push(this.createSignal(marketData, 'candlestick-strategy', 'sell', 0.60, `Bearish ${pattern}`));
    }
    
    return signals;
  }

  private createSignal(
    marketData: MarketData, 
    strategy: string, 
    action: 'buy' | 'sell', 
    confidence: number, 
    reasoning: string
  ): TradingSignal {
    return {
      id: `${strategy}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      symbol: marketData.symbol,
      strategy,
      action,
      price: marketData.price,
      targetPrice: action === 'buy' ? marketData.price * 1.025 : marketData.price * 0.975,
      stopLoss: action === 'buy' ? marketData.price * 0.985 : marketData.price * 1.015,
      confidence,
      riskRewardRatio: 1.67,
      reasoning,
      timestamp: Date.now(),
      status: 'active',
      telegramSent: false,
      metadata: { strategy, automated: true }
    };
  }

  public analyzeMarket(marketData: MarketData): TradingSignal[] {
    const allSignals: TradingSignal[] = [];
    
    // ALWAYS ANALYZE PERSONAL METHOD FIRST - IMMUNE AND PRIORITIZED
    const personalMethodStrategy = this.strategies.get('almog-personal-method');
    if (personalMethodStrategy) {
      const personalSignals = personalMethodStrategy.analyze(marketData);
      allSignals.push(...personalSignals);
    }
    
    // Then analyze other strategies in priority order
    const sortedStrategies = Array.from(this.strategies.entries())
      .filter(([key]) => key !== 'almog-personal-method') // Skip personal method (already done)
      .sort(([,a], [,b]) => a.priority - b.priority);
    
    for (const [strategyId, strategy] of sortedStrategies) {
      try {
        const signals = strategy.analyze(marketData);
        allSignals.push(...signals);
      } catch (error) {
        console.error(`Strategy ${strategyId} analysis error:`, error);
      }
    }
    
    return allSignals;
  }

  public getActiveStrategies(): string[] {
    return Array.from(this.strategies.keys());
  }

  public getStrategyWeight(strategyId: string): number {
    const strategy = this.strategies.get(strategyId);
    return strategy?.weight || 0;
  }

  public updateStrategyWeight(strategyId: string, newWeight: number): void {
    const strategy = this.strategies.get(strategyId);
    if (strategy && !strategy.immune) {
      strategy.weight = newWeight;
      this.weights.set(strategyId, newWeight);
      console.log(`Strategy ${strategyId} weight updated to ${newWeight}`);
    } else if (strategy?.immune) {
      console.log(`Strategy ${strategyId} is immune to weight changes`);
    }
  }
}

export const strategyEngine = new StrategyEngine();
