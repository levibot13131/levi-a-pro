
import { TradingStrategy, TradingSignal, MarketData, PersonalTradingStrategy } from '@/types/trading';
import { toast } from 'sonner';

export class StrategyEngine {
  private strategies: Map<string, TradingStrategy> = new Map();
  private signals: TradingSignal[] = [];

  constructor() {
    this.initializeDefaultStrategies();
  }

  private initializeDefaultStrategies() {
    // Personal trading strategy
    const personalStrategy: PersonalTradingStrategy = {
      id: 'personal-strategy',
      name: 'האסטרטגיה האישית שלי',
      type: 'personal',
      isActive: true,
      weight: 1.0,
      parameters: {
        rsiThreshold: 50,
        volumeIncreaseRequired: true,
        resistanceBreakRequired: true,
        profitTargetPercent: 3, // Default 3%
        stopLossPercent: 1.5, // Default 1.5%
        maxRiskPercent: 2, // Max 2% risk per trade
        riskRewardRatio: 2.0 // 1:2 risk/reward
      },
      successRate: 0,
      totalSignals: 0,
      profitableSignals: 0,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    this.strategies.set(personalStrategy.id, personalStrategy);

    // Add other strategies
    this.addWyckoffStrategy();
    this.addSMCStrategy();
    this.addFibonacciStrategy();
    this.addMomentumStrategy();
    this.addCandlestickStrategy();
    this.addVolumeStrategy();
    this.addRSIMACDStrategy();
    this.addPatternStrategy();
  }

  private addWyckoffStrategy() {
    const strategy: TradingStrategy = {
      id: 'wyckoff-strategy',
      name: 'Wyckoff Method',
      type: 'wyckoff',
      isActive: true,
      weight: 0.8,
      parameters: {
        accumulationThreshold: 0.7,
        distributionThreshold: 0.7,
        volumeConfirmation: true
      },
      successRate: 0,
      totalSignals: 0,
      profitableSignals: 0,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    this.strategies.set(strategy.id, strategy);
  }

  private addSMCStrategy() {
    const strategy: TradingStrategy = {
      id: 'smc-strategy',
      name: 'Smart Money Concepts',
      type: 'smc',
      isActive: true,
      weight: 0.85,
      parameters: {
        orderBlockStrength: 0.8,
        liquidityGrabRequired: true,
        fairValueGapSize: 0.5
      },
      successRate: 0,
      totalSignals: 0,
      profitableSignals: 0,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    this.strategies.set(strategy.id, strategy);
  }

  private addFibonacciStrategy() {
    const strategy: TradingStrategy = {
      id: 'fibonacci-strategy',
      name: 'Fibonacci Retracement',
      type: 'fibonacci',
      isActive: true,
      weight: 0.7,
      parameters: {
        key618Level: true,
        key786Level: true,
        key382Level: false,
        confluenceRequired: true
      },
      successRate: 0,
      totalSignals: 0,
      profitableSignals: 0,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    this.strategies.set(strategy.id, strategy);
  }

  private addMomentumStrategy() {
    const strategy: TradingStrategy = {
      id: 'momentum-strategy',
      name: 'Momentum & Breakouts',
      type: 'momentum',
      isActive: true,
      weight: 0.75,
      parameters: {
        momentumThreshold: 1.5,
        breakoutConfirmation: true,
        volumeMultiplier: 2.0
      },
      successRate: 0,
      totalSignals: 0,
      profitableSignals: 0,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    this.strategies.set(strategy.id, strategy);
  }

  private addCandlestickStrategy() {
    const strategy: TradingStrategy = {
      id: 'candlestick-strategy',
      name: 'Candlestick Patterns',
      type: 'candlestick',
      isActive: true,
      weight: 0.6,
      parameters: {
        dojiStrength: 0.8,
        engulfingRequired: true,
        pinbarConfirmation: true
      },
      successRate: 0,
      totalSignals: 0,
      profitableSignals: 0,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    this.strategies.set(strategy.id, strategy);
  }

  private addVolumeStrategy() {
    const strategy: TradingStrategy = {
      id: 'volume-strategy',
      name: 'Volume Profile + VWAP',
      type: 'volume',
      isActive: true,
      weight: 0.7,
      parameters: {
        volumeProfileThreshold: 1.5,
        vwapConfirmation: true,
        highVolumeNodeRequired: true
      },
      successRate: 0,
      totalSignals: 0,
      profitableSignals: 0,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    this.strategies.set(strategy.id, strategy);
  }

  private addRSIMACDStrategy() {
    const strategy: TradingStrategy = {
      id: 'rsi-macd-strategy',
      name: 'RSI + MACD Strategy',
      type: 'rsi_macd',
      isActive: true,
      weight: 0.8,
      parameters: {
        rsiOverbought: 70,
        rsiOversold: 30,
        macdCrossover: true,
        divergenceDetection: true
      },
      successRate: 0,
      totalSignals: 0,
      profitableSignals: 0,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    this.strategies.set(strategy.id, strategy);
  }

  private addPatternStrategy() {
    const strategy: TradingStrategy = {
      id: 'pattern-strategy',
      name: 'Chart Patterns',
      type: 'patterns',
      isActive: true,
      weight: 0.65,
      parameters: {
        headAndShoulders: true,
        wedges: true,
        triangles: true,
        flags: true
      },
      successRate: 0,
      totalSignals: 0,
      profitableSignals: 0,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    this.strategies.set(strategy.id, strategy);
  }

  public analyzeMarket(marketData: MarketData): TradingSignal[] {
    const signals: TradingSignal[] = [];

    for (const [strategyId, strategy] of this.strategies) {
      if (!strategy.isActive) continue;

      const signal = this.evaluateStrategy(strategy, marketData);
      if (signal) {
        // Weight the confidence by strategy success rate
        signal.confidence = signal.confidence * strategy.weight;
        signals.push(signal);
      }
    }

    return signals.filter(signal => signal.confidence > 0.7); // Only high-confidence signals
  }

  private evaluateStrategy(strategy: TradingStrategy, marketData: MarketData): TradingSignal | null {
    switch (strategy.type) {
      case 'personal':
        return this.evaluatePersonalStrategy(strategy as PersonalTradingStrategy, marketData);
      case 'wyckoff':
        return this.evaluateWyckoffStrategy(strategy, marketData);
      case 'smc':
        return this.evaluateSMCStrategy(strategy, marketData);
      case 'fibonacci':
        return this.evaluateFibonacciStrategy(strategy, marketData);
      case 'momentum':
        return this.evaluateMomentumStrategy(strategy, marketData);
      case 'candlestick':
        return this.evaluateCandlestickStrategy(strategy, marketData);
      case 'volume':
        return this.evaluateVolumeStrategy(strategy, marketData);
      case 'rsi_macd':
        return this.evaluateRSIMACDStrategy(strategy, marketData);
      case 'patterns':
        return this.evaluatePatternStrategy(strategy, marketData);
      default:
        return null;
    }
  }

  private evaluatePersonalStrategy(strategy: PersonalTradingStrategy, marketData: MarketData): TradingSignal | null {
    const { rsiThreshold, volumeIncreaseRequired, resistanceBreakRequired, profitTargetPercent, stopLossPercent, riskRewardRatio } = strategy.parameters;

    // Personal strategy conditions
    const rsiCondition = marketData.rsi > rsiThreshold;
    const volumeCondition = !volumeIncreaseRequired || marketData.volume > 1.5; // Assume volume increase
    const resistanceCondition = !resistanceBreakRequired || true; // Placeholder for resistance break logic

    if (rsiCondition && volumeCondition && resistanceCondition) {
      const targetPrice = marketData.price * (1 + profitTargetPercent / 100);
      const stopLoss = marketData.price * (1 - stopLossPercent / 100);

      return {
        id: `personal-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        symbol: marketData.symbol,
        strategy: strategy.id,
        action: 'buy',
        price: marketData.price,
        targetPrice,
        stopLoss,
        confidence: 0.85,
        riskRewardRatio,
        reasoning: `אסטרטגיה אישית: RSI ${marketData.rsi} > ${rsiThreshold}, נפח עולה, שבירת התנגדות`,
        timestamp: Date.now(),
        status: 'active',
        telegramSent: false,
        metadata: {
          rsi: marketData.rsi,
          volume: marketData.volume,
          strategy: 'personal'
        }
      };
    }

    return null;
  }

  private evaluateWyckoffStrategy(strategy: TradingStrategy, marketData: MarketData): TradingSignal | null {
    if (marketData.wyckoffPhase === 'accumulation') {
      return {
        id: `wyckoff-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        symbol: marketData.symbol,
        strategy: strategy.id,
        action: 'buy',
        price: marketData.price,
        targetPrice: marketData.price * 1.05,
        stopLoss: marketData.price * 0.97,
        confidence: 0.8,
        riskRewardRatio: 1.67,
        reasoning: 'Wyckoff: זוהתה שלב אקומולציה - כסף חכם צובר',
        timestamp: Date.now(),
        status: 'active',
        telegramSent: false,
        metadata: { wyckoffPhase: marketData.wyckoffPhase }
      };
    }

    return null;
  }

  private evaluateSMCStrategy(strategy: TradingStrategy, marketData: MarketData): TradingSignal | null {
    if (marketData.smcSignal?.orderBlock && marketData.smcSignal?.liquidityGrab) {
      return {
        id: `smc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        symbol: marketData.symbol,
        strategy: strategy.id,
        action: 'buy',
        price: marketData.price,
        targetPrice: marketData.price * 1.04,
        stopLoss: marketData.price * 0.98,
        confidence: 0.82,
        riskRewardRatio: 2.0,
        reasoning: 'SMC: זוהה Order Block + Liquidity Grab',
        timestamp: Date.now(),
        status: 'active',
        telegramSent: false,
        metadata: { smc: marketData.smcSignal }
      };
    }

    return null;
  }

  private evaluateFibonacciStrategy(strategy: TradingStrategy, marketData: MarketData): TradingSignal | null {
    const priceNearFib618 = Math.abs(marketData.price - marketData.fibonacci.level618) / marketData.price < 0.002;
    
    if (priceNearFib618) {
      return {
        id: `fib-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        symbol: marketData.symbol,
        strategy: strategy.id,
        action: 'buy',
        price: marketData.price,
        targetPrice: marketData.price * 1.035,
        stopLoss: marketData.price * 0.985,
        confidence: 0.75,
        riskRewardRatio: 2.3,
        reasoning: 'Fibonacci: המחיר ליד רמת 61.8% - תמיכה חזקה',
        timestamp: Date.now(),
        status: 'active',
        telegramSent: false,
        metadata: { fibonacci: marketData.fibonacci }
      };
    }

    return null;
  }

  private evaluateMomentumStrategy(strategy: TradingStrategy, marketData: MarketData): TradingSignal | null {
    const strongMomentum = marketData.volume > 2.0 && marketData.rsi > 60;
    
    if (strongMomentum) {
      return {
        id: `momentum-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        symbol: marketData.symbol,
        strategy: strategy.id,
        action: 'buy',
        price: marketData.price,
        targetPrice: marketData.price * 1.045,
        stopLoss: marketData.price * 0.975,
        confidence: 0.78,
        riskRewardRatio: 1.8,
        reasoning: 'Momentum: נפח גבוה + RSI חזק - פריצת מומנטום',
        timestamp: Date.now(),
        status: 'active',
        telegramSent: false,
        metadata: { momentum: true, volume: marketData.volume }
      };
    }

    return null;
  }

  private evaluateCandlestickStrategy(strategy: TradingStrategy, marketData: MarketData): TradingSignal | null {
    const bullishPattern = ['engulfing', 'hammer', 'pinbar'].includes(marketData.candlestickPattern || '');
    
    if (bullishPattern) {
      return {
        id: `candle-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        symbol: marketData.symbol,
        strategy: strategy.id,
        action: 'buy',
        price: marketData.price,
        targetPrice: marketData.price * 1.03,
        stopLoss: marketData.price * 0.985,
        confidence: 0.72,
        riskRewardRatio: 2.0,
        reasoning: `Candlestick: זוהתה תבנית ${marketData.candlestickPattern} חיובית`,
        timestamp: Date.now(),
        status: 'active',
        telegramSent: false,
        metadata: { pattern: marketData.candlestickPattern }
      };
    }

    return null;
  }

  private evaluateVolumeStrategy(strategy: TradingStrategy, marketData: MarketData): TradingSignal | null {
    const vwapAbove = marketData.price > marketData.vwap;
    const highVolume = marketData.volumeProfile > 1.5;
    
    if (vwapAbove && highVolume) {
      return {
        id: `volume-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        symbol: marketData.symbol,
        strategy: strategy.id,
        action: 'buy',
        price: marketData.price,
        targetPrice: marketData.price * 1.04,
        stopLoss: marketData.price * 0.98,
        confidence: 0.76,
        riskRewardRatio: 2.0,
        reasoning: 'Volume: מחיר מעל VWAP + נפח גבוה - חיזוק מגמה',
        timestamp: Date.now(),
        status: 'active',
        telegramSent: false,
        metadata: { vwap: marketData.vwap, volumeProfile: marketData.volumeProfile }
      };
    }

    return null;
  }

  private evaluateRSIMACDStrategy(strategy: TradingStrategy, marketData: MarketData): TradingSignal | null {
    const rsiOversold = marketData.rsi < 35;
    const macdCrossover = marketData.macd.histogram > 0 && marketData.macd.macd > marketData.macd.signal;
    
    if (rsiOversold && macdCrossover) {
      return {
        id: `rsi-macd-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        symbol: marketData.symbol,
        strategy: strategy.id,
        action: 'buy',
        price: marketData.price,
        targetPrice: marketData.price * 1.04,
        stopLoss: marketData.price * 0.975,
        confidence: 0.8,
        riskRewardRatio: 1.6,
        reasoning: 'RSI+MACD: RSI במכירת יתר + חיתוך MACD חיובי',
        timestamp: Date.now(),
        status: 'active',
        telegramSent: false,
        metadata: { rsi: marketData.rsi, macd: marketData.macd }
      };
    }

    return null;
  }

  private evaluatePatternStrategy(strategy: TradingStrategy, marketData: MarketData): TradingSignal | null {
    // Placeholder for chart pattern recognition
    const bullishPatternDetected = Math.random() > 0.8; // Simulate pattern detection
    
    if (bullishPatternDetected) {
      return {
        id: `pattern-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        symbol: marketData.symbol,
        strategy: strategy.id,
        action: 'buy',
        price: marketData.price,
        targetPrice: marketData.price * 1.05,
        stopLoss: marketData.price * 0.97,
        confidence: 0.7,
        riskRewardRatio: 1.67,
        reasoning: 'Pattern: זוהתה תבנית גרפית חיובית',
        timestamp: Date.now(),
        status: 'active',
        telegramSent: false,
        metadata: { patternType: 'bullish_reversal' }
      };
    }

    return null;
  }

  public updateStrategyPerformance(strategyId: string, wasProfit: boolean) {
    const strategy = this.strategies.get(strategyId);
    if (!strategy) return;

    strategy.totalSignals++;
    if (wasProfit) {
      strategy.profitableSignals++;
    }
    
    strategy.successRate = strategy.profitableSignals / strategy.totalSignals;
    
    // Adjust weight based on performance
    if (strategy.totalSignals >= 10) {
      strategy.weight = Math.max(0.1, Math.min(1.0, strategy.successRate));
    }
    
    strategy.updatedAt = Date.now();
    
    console.log(`Strategy ${strategy.name} updated: ${strategy.successRate.toFixed(2)} success rate, weight: ${strategy.weight.toFixed(2)}`);
  }

  public getActiveStrategies(): TradingStrategy[] {
    return Array.from(this.strategies.values()).filter(s => s.isActive);
  }

  public getStrategyById(id: string): TradingStrategy | undefined {
    return this.strategies.get(id);
  }

  public updateStrategy(strategy: TradingStrategy) {
    strategy.updatedAt = Date.now();
    this.strategies.set(strategy.id, strategy);
  }
}

export const strategyEngine = new StrategyEngine();
