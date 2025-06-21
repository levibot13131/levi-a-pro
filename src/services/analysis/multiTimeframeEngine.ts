import { liveMarketDataService } from '../trading/liveMarketDataService';
import { toast } from 'sonner';

export interface TimeframeAnalysis {
  timeframe: string;
  trend: 'bullish' | 'bearish' | 'neutral';
  strength: number; // 0-100
  signals: {
    rsi: { value: number; signal: string };
    macd: { signal: string; strength: number };
    volume: { signal: string; strength: number };
    support: number;
    resistance: number;
  };
  confidence: number;
}

export interface MultiTimeframeSignal {
  symbol: string;
  confluence: number; // 0-100 (how many timeframes agree)
  overallDirection: 'bullish' | 'bearish' | 'neutral';
  timeframes: TimeframeAnalysis[];
  highProbabilitySetup: boolean;
  entryPrice: number;
  stopLoss: number;
  targets: number[];
  riskReward: number;
  timestamp: number;
}

class MultiTimeframeEngine {
  private static instance: MultiTimeframeEngine;
  private isAnalyzing = false;
  private signals: MultiTimeframeSignal[] = [];
  private timeframes = ['1m', '5m', '15m', '1h', '4h', '1d'];
  private symbols = ['BTCUSDT', 'ETHUSDT', 'SOLUSDT', 'BNBUSDT'];

  public static getInstance(): MultiTimeframeEngine {
    if (!MultiTimeframeEngine.instance) {
      MultiTimeframeEngine.instance = new MultiTimeframeEngine();
    }
    return MultiTimeframeEngine.instance;
  }

  public async startAnalysis(): Promise<void> {
    if (this.isAnalyzing) return;
    
    console.log('📊 Starting Multi-Timeframe Analysis Engine...');
    this.isAnalyzing = true;
    
    // Continuous analysis every 30 seconds
    const analysisLoop = async () => {
      if (!this.isAnalyzing) return;
      
      await this.performMultiTimeframeAnalysis();
      setTimeout(analysisLoop, 30000);
    };
    
    await analysisLoop();
    toast.success('📊 Multi-Timeframe Analysis activated');
  }

  public stopAnalysis(): void {
    console.log('📊 Stopping Multi-Timeframe Analysis...');
    this.isAnalyzing = false;
    toast.info('Multi-Timeframe Analysis stopped');
  }

  private async performMultiTimeframeAnalysis(): Promise<void> {
    try {
      console.log('🔍 Performing multi-timeframe analysis...');
      
      for (const symbol of this.symbols) {
        const timeframeAnalyses: TimeframeAnalysis[] = [];
        
        // Analyze each timeframe
        for (const timeframe of this.timeframes) {
          const analysis = await this.analyzeTimeframe(symbol, timeframe);
          timeframeAnalyses.push(analysis);
        }
        
        // Calculate confluence and generate signal if strong enough
        const signal = this.calculateConfluence(symbol, timeframeAnalyses);
        
        if (signal.highProbabilitySetup) {
          this.signals.unshift(signal);
          
          // Keep only last 20 signals
          this.signals = this.signals.slice(0, 20);
          
          // Dispatch high-probability signal event
          window.dispatchEvent(new CustomEvent('high-probability-setup', {
            detail: signal
          }));
          
          console.log(`🎯 High-probability setup found: ${symbol} (${signal.confluence}% confluence)`);
        }
      }
      
    } catch (error) {
      console.error('❌ Error in multi-timeframe analysis:', error);
    }
  }

  private async analyzeTimeframe(symbol: string, timeframe: string): Promise<TimeframeAnalysis> {
    // Mock technical analysis - in production would use real TA libraries
    const mockData = await liveMarketDataService.getMultipleAssets([symbol]);
    const symbolData = mockData.get(symbol);
    
    // Simulate RSI calculation
    const rsi = 30 + Math.random() * 40; // Mock RSI between 30-70
    
    // Simulate MACD
    const macdSignal = Math.random() > 0.5 ? 'bullish' : 'bearish';
    
    // Simulate volume analysis
    const volumeSignal = Math.random() > 0.6 ? 'high' : 'normal';
    
    // Determine trend
    let trend: 'bullish' | 'bearish' | 'neutral' = 'neutral';
    let strength = 50;
    
    if (rsi > 60 && macdSignal === 'bullish') {
      trend = 'bullish';
      strength = 70 + Math.random() * 30;
    } else if (rsi < 40 && macdSignal === 'bearish') {
      trend = 'bearish';
      strength = 70 + Math.random() * 30;
    } else {
      strength = 30 + Math.random() * 40;
    }
    
    const currentPrice = symbolData?.price || 45000;
    
    return {
      timeframe,
      trend,
      strength,
      signals: {
        rsi: {
          value: rsi,
          signal: rsi > 70 ? 'overbought' : rsi < 30 ? 'oversold' : 'neutral'
        },
        macd: {
          signal: macdSignal,
          strength: Math.random() * 100
        },
        volume: {
          signal: volumeSignal,
          strength: Math.random() * 100
        },
        support: currentPrice * (0.95 + Math.random() * 0.03),
        resistance: currentPrice * (1.02 + Math.random() * 0.03)
      },
      confidence: strength
    };
  }

  private calculateConfluence(symbol: string, timeframes: TimeframeAnalysis[]): MultiTimeframeSignal {
    // Count bullish vs bearish signals
    const bullishCount = timeframes.filter(tf => tf.trend === 'bullish').length;
    const bearishCount = timeframes.filter(tf => tf.trend === 'bearish').length;
    
    // Calculate confluence percentage
    const confluence = Math.max(bullishCount, bearishCount) / timeframes.length * 100;
    
    // Determine overall direction
    let overallDirection: 'bullish' | 'bearish' | 'neutral' = 'neutral';
    if (bullishCount > bearishCount) overallDirection = 'bullish';
    else if (bearishCount > bullishCount) overallDirection = 'bearish';
    
    // Calculate average confidence
    const avgConfidence = timeframes.reduce((sum, tf) => sum + tf.confidence, 0) / timeframes.length;
    
    // High probability setup criteria
    const highProbabilitySetup = confluence >= 70 && avgConfidence >= 75;
    
    // Generate entry, stop loss, and targets
    const currentPrice = 45000 + (Math.random() - 0.5) * 2000; // Mock current price
    const entryPrice = currentPrice;
    const stopLoss = overallDirection === 'bullish' 
      ? entryPrice * 0.98 
      : entryPrice * 1.02;
    
    const targets = overallDirection === 'bullish'
      ? [entryPrice * 1.02, entryPrice * 1.04, entryPrice * 1.06]
      : [entryPrice * 0.98, entryPrice * 0.96, entryPrice * 0.94];
    
    const riskReward = Math.abs(targets[0] - entryPrice) / Math.abs(entryPrice - stopLoss);
    
    return {
      symbol,
      confluence,
      overallDirection,
      timeframes,
      highProbabilitySetup,
      entryPrice,
      stopLoss,
      targets,
      riskReward,
      timestamp: Date.now()
    };
  }

  public getRecentSignals(): MultiTimeframeSignal[] {
    return this.signals;
  }

  public getHighProbabilitySetups(): MultiTimeframeSignal[] {
    return this.signals.filter(s => s.highProbabilitySetup);
  }

  public isEngineRunning(): boolean {
    return this.isAnalyzing;
  }
}

export const multiTimeframeEngine = MultiTimeframeEngine.getInstance();
