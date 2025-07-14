// AI Learning Loop Implementation
// Tracks every signal outcome and continuously improves strategy weights
// Real-time learning and adaptation based on historical performance

import { supabase } from '@/integrations/supabase/client';

export interface SignalOutcome {
  signalId: string;
  symbol: string;
  strategy: string;
  action: 'BUY' | 'SELL';
  entryPrice: number;
  exitPrice?: number;
  stopLoss: number;
  targetPrice: number;
  confidence: number;
  riskRewardRatio: number;
  outcome: 'win' | 'loss' | 'pending' | 'breakeven';
  profitPercent: number;
  timeframe: string;
  methods: string[];
  confluences: string[];
  marketConditions: any;
  fundamentalEvents: any[];
  executionTime: number;
  exitReason?: string;
  timestamp: number;
}

export interface StrategyPerformance {
  strategyName: string;
  totalSignals: number;
  winningSignals: number;
  losingSignals: number;
  winRate: number;
  avgProfitPercent: number;
  avgLossPercent: number;
  profitFactor: number;
  currentWeight: number;
  confidence: number;
  bestTimeframes: string[];
  bestSymbols: string[];
  bestMarketConditions: string[];
  recentPerformance: SignalOutcome[];
  learningInsights: string[];
}

export interface LearningIteration {
  iterationNumber: number;
  dataPointsProcessed: number;
  successfulPredictions: number;
  totalPredictions: number;
  accuracyRate: number;
  confidenceAdjustments: Record<string, number>;
  strategyWeights: Record<string, number>;
  marketConditionsLearned: Record<string, any>;
  improvementAreas: string[];
  timestamp: number;
}

export class AILearningLoop {
  private signalHistory: SignalOutcome[] = [];
  private strategyPerformance: Map<string, StrategyPerformance> = new Map();
  private learningIterations: LearningIteration[] = [];
  private isLearning = false;
  
  // Learning parameters
  private readonly MIN_SIGNALS_FOR_LEARNING = 10;
  private readonly WEIGHT_ADJUSTMENT_FACTOR = 0.1;
  private readonly CONFIDENCE_DECAY_FACTOR = 0.95;
  private readonly PERFORMANCE_WINDOW = 50; // Last 50 signals for recent performance

  constructor() {
    this.initializeStrategies();
    this.loadHistoricalData();
  }

  /**
   * Initialize strategy performance tracking
   */
  private initializeStrategies() {
    const strategies = [
      'Magic Triangle (משולש הקסם)',
      'Wyckoff Method',
      'Smart Money Concepts',
      'Elliott Wave',
      'Fibonacci Analysis',
      'RSI Divergence',
      'Volume Profile',
      'Multi-Timeframe Analysis',
      'Fundamental Catalyst'
    ];

    strategies.forEach(strategy => {
      this.strategyPerformance.set(strategy, {
        strategyName: strategy,
        totalSignals: 0,
        winningSignals: 0,
        losingSignals: 0,
        winRate: 0.5, // Start with neutral assumption
        avgProfitPercent: 0,
        avgLossPercent: 0,
        profitFactor: 1.0,
        currentWeight: 1.0, // Equal weight initially
        confidence: 0.5,
        bestTimeframes: [],
        bestSymbols: [],
        bestMarketConditions: [],
        recentPerformance: [],
        learningInsights: []
      });
    });
  }

  /**
   * Load historical learning data from database
   */
  private async loadHistoricalData() {
    try {
      // Load signal history
      const { data: signalData } = await supabase
        .from('signal_history')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(500);

      if (signalData) {
        this.processHistoricalSignals(signalData);
      }

      // Load learning iterations
      const { data: learningData } = await supabase
        .from('learning_iterations')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (learningData) {
        this.processLearningIterations(learningData);
      }

      console.log('🧠 AI Learning Loop: Historical data loaded successfully');
    } catch (error) {
      console.error('❌ Failed to load historical learning data:', error);
    }
  }

  /**
   * Log a new signal for future learning
   */
  public async logSignal(signal: Partial<SignalOutcome>) {
    try {
      const signalOutcome: SignalOutcome = {
        signalId: signal.signalId || `SIG_${Date.now()}`,
        symbol: signal.symbol || '',
        strategy: signal.strategy || '',
        action: signal.action || 'BUY',
        entryPrice: signal.entryPrice || 0,
        stopLoss: signal.stopLoss || 0,
        targetPrice: signal.targetPrice || 0,
        confidence: signal.confidence || 0,
        riskRewardRatio: signal.riskRewardRatio || 0,
        outcome: 'pending',
        profitPercent: 0,
        timeframe: signal.timeframe || '1h',
        methods: signal.methods || [],
        confluences: signal.confluences || [],
        marketConditions: signal.marketConditions || {},
        fundamentalEvents: signal.fundamentalEvents || [],
        executionTime: Date.now(),
        timestamp: Date.now()
      };

      // Store in memory
      this.signalHistory.push(signalOutcome);

      // Store in database
      await supabase.from('signal_history').insert({
        signal_id: signalOutcome.signalId,
        symbol: signalOutcome.symbol,
        strategy: signalOutcome.strategy,
        action: signalOutcome.action,
        entry_price: signalOutcome.entryPrice,
        target_price: signalOutcome.targetPrice,
        stop_loss: signalOutcome.stopLoss,
        confidence: signalOutcome.confidence,
        risk_reward_ratio: signalOutcome.riskRewardRatio,
        reasoning: signalOutcome.methods.join('; '),
        market_conditions: signalOutcome.marketConditions,
        sentiment_data: { events: signalOutcome.fundamentalEvents }
      });

      console.log(`📝 Signal logged for learning: ${signalOutcome.signalId}`);
    } catch (error) {
      console.error('❌ Failed to log signal:', error);
    }
  }

  /**
   * Update signal outcome when trade is closed
   */
  public async updateSignalOutcome(
    signalId: string, 
    outcome: 'win' | 'loss' | 'breakeven',
    exitPrice: number,
    exitReason: string = 'manual'
  ) {
    try {
      // Find signal in memory
      const signalIndex = this.signalHistory.findIndex(s => s.signalId === signalId);
      if (signalIndex === -1) {
        console.warn(`⚠️ Signal ${signalId} not found in memory`);
        return;
      }

      const signal = this.signalHistory[signalIndex];
      
      // Calculate profit percentage
      const profitPercent = signal.action === 'BUY' 
        ? ((exitPrice - signal.entryPrice) / signal.entryPrice) * 100
        : ((signal.entryPrice - exitPrice) / signal.entryPrice) * 100;

      // Update signal outcome
      signal.outcome = outcome;
      signal.exitPrice = exitPrice;
      signal.profitPercent = profitPercent;
      signal.exitReason = exitReason;

      // Update in database
      await supabase
        .from('signal_history')
        .update({
          outcome: outcome,
          exit_price: exitPrice,
          actual_profit_loss: profitPercent,
          exit_reason: exitReason,
          closed_at: new Date().toISOString(),
          was_correct: outcome === 'win'
        })
        .eq('signal_id', signalId);

      console.log(`✅ Signal outcome updated: ${signalId} - ${outcome} (${profitPercent.toFixed(2)}%)`);

      // Trigger learning update
      await this.performLearningIteration();

    } catch (error) {
      console.error('❌ Failed to update signal outcome:', error);
    }
  }

  /**
   * Perform learning iteration to adjust strategy weights
   */
  public async performLearningIteration() {
    if (this.isLearning) return;
    this.isLearning = true;

    try {
      console.log('🧠 Performing AI learning iteration...');

      // Get completed signals only
      const completedSignals = this.signalHistory.filter(s => s.outcome !== 'pending');
      
      if (completedSignals.length < this.MIN_SIGNALS_FOR_LEARNING) {
        console.log(`⏳ Insufficient data for learning (${completedSignals.length}/${this.MIN_SIGNALS_FOR_LEARNING})`);
        this.isLearning = false;
        return;
      }

      // Update strategy performance
      this.updateStrategyPerformance(completedSignals);

      // Adjust strategy weights based on performance
      this.adjustStrategyWeights();

      // Analyze market conditions and patterns
      const marketInsights = this.analyzeMarketPatterns(completedSignals);

      // Create learning iteration record
      const iteration: LearningIteration = {
        iterationNumber: this.learningIterations.length + 1,
        dataPointsProcessed: completedSignals.length,
        successfulPredictions: completedSignals.filter(s => s.outcome === 'win').length,
        totalPredictions: completedSignals.length,
        accuracyRate: completedSignals.filter(s => s.outcome === 'win').length / completedSignals.length,
        confidenceAdjustments: this.getConfidenceAdjustments(),
        strategyWeights: this.getStrategyWeights(),
        marketConditionsLearned: marketInsights,
        improvementAreas: this.identifyImprovementAreas(completedSignals),
        timestamp: Date.now()
      };

      this.learningIterations.push(iteration);

      // Save to database
      await supabase.from('learning_iterations').insert({
        iteration_number: iteration.iterationNumber,
        data_points_processed: iteration.dataPointsProcessed,
        successful_predictions: iteration.successfulPredictions,
        total_predictions: iteration.totalPredictions,
        accuracy_rate: iteration.accuracyRate,
        confidence_adjustments: iteration.confidenceAdjustments,
        strategy_weights: iteration.strategyWeights,
        market_conditions_learned: iteration.marketConditionsLearned
      });

      console.log(`🎯 Learning iteration ${iteration.iterationNumber} completed:`);
      console.log(`   Accuracy: ${(iteration.accuracyRate * 100).toFixed(1)}%`);
      console.log(`   Signals processed: ${iteration.dataPointsProcessed}`);
      console.log(`   Winning signals: ${iteration.successfulPredictions}`);

    } catch (error) {
      console.error('❌ Learning iteration failed:', error);
    } finally {
      this.isLearning = false;
    }
  }

  /**
   * Update strategy performance metrics
   */
  private updateStrategyPerformance(signals: SignalOutcome[]) {
    // Group signals by strategy
    const strategyGroups = new Map<string, SignalOutcome[]>();
    
    signals.forEach(signal => {
      signal.methods.forEach(method => {
        if (!strategyGroups.has(method)) {
          strategyGroups.set(method, []);
        }
        strategyGroups.get(method)!.push(signal);
      });
    });

    // Update performance for each strategy
    strategyGroups.forEach((strategySignals, strategyName) => {
      const performance = this.strategyPerformance.get(strategyName);
      if (!performance) return;

      const winningSignals = strategySignals.filter(s => s.outcome === 'win');
      const losingSignals = strategySignals.filter(s => s.outcome === 'loss');

      performance.totalSignals = strategySignals.length;
      performance.winningSignals = winningSignals.length;
      performance.losingSignals = losingSignals.length;
      performance.winRate = performance.totalSignals > 0 ? performance.winningSignals / performance.totalSignals : 0.5;

      // Calculate average profit/loss
      if (winningSignals.length > 0) {
        performance.avgProfitPercent = winningSignals.reduce((sum, s) => sum + s.profitPercent, 0) / winningSignals.length;
      }
      
      if (losingSignals.length > 0) {
        performance.avgLossPercent = Math.abs(losingSignals.reduce((sum, s) => sum + s.profitPercent, 0) / losingSignals.length);
      }

      // Calculate profit factor
      const totalProfit = winningSignals.reduce((sum, s) => sum + Math.max(0, s.profitPercent), 0);
      const totalLoss = Math.abs(losingSignals.reduce((sum, s) => sum + Math.min(0, s.profitPercent), 0));
      performance.profitFactor = totalLoss > 0 ? totalProfit / totalLoss : totalProfit > 0 ? 10 : 1;

      // Analyze best performing conditions
      performance.bestTimeframes = this.findBestConditions(strategySignals, 'timeframe');
      performance.bestSymbols = this.findBestConditions(strategySignals, 'symbol');
      
      // Keep recent performance window
      performance.recentPerformance = strategySignals
        .sort((a, b) => b.timestamp - a.timestamp)
        .slice(0, this.PERFORMANCE_WINDOW);

      // Generate insights
      performance.learningInsights = this.generateStrategyInsights(performance, strategySignals);
    });
  }

  /**
   * Adjust strategy weights based on performance
   */
  private adjustStrategyWeights() {
    this.strategyPerformance.forEach(performance => {
      const { winRate, profitFactor, recentPerformance } = performance;
      
      // Base weight on overall performance
      let newWeight = performance.currentWeight;
      
      // Adjust based on win rate (target: 60%+)
      if (winRate > 0.6) {
        newWeight *= (1 + this.WEIGHT_ADJUSTMENT_FACTOR);
      } else if (winRate < 0.4) {
        newWeight *= (1 - this.WEIGHT_ADJUSTMENT_FACTOR);
      }
      
      // Adjust based on profit factor (target: 1.5+)
      if (profitFactor > 1.5) {
        newWeight *= (1 + this.WEIGHT_ADJUSTMENT_FACTOR * 0.5);
      } else if (profitFactor < 1.0) {
        newWeight *= (1 - this.WEIGHT_ADJUSTMENT_FACTOR * 0.5);
      }
      
      // Consider recent performance trend
      if (recentPerformance.length >= 10) {
        const recentWinRate = recentPerformance.filter(s => s.outcome === 'win').length / recentPerformance.length;
        if (recentWinRate > winRate + 0.1) {
          newWeight *= (1 + this.WEIGHT_ADJUSTMENT_FACTOR * 0.3); // Recent improvement
        } else if (recentWinRate < winRate - 0.1) {
          newWeight *= (1 - this.WEIGHT_ADJUSTMENT_FACTOR * 0.3); // Recent decline
        }
      }
      
      // Ensure weight stays within reasonable bounds
      performance.currentWeight = Math.max(0.1, Math.min(3.0, newWeight));
      
      // Update confidence based on consistency
      const consistency = this.calculateConsistency(recentPerformance);
      performance.confidence = Math.min(0.95, winRate * 0.7 + consistency * 0.3);
    });
  }

  /**
   * Analyze market patterns and conditions
   */
  private analyzeMarketPatterns(signals: SignalOutcome[]): Record<string, any> {
    const patterns: Record<string, any> = {};
    
    // Time-based patterns
    patterns.bestTradingHours = this.analyzeTradingHours(signals);
    patterns.bestDaysOfWeek = this.analyzeTradingDays(signals);
    
    // Market condition patterns
    patterns.volatilityPerformance = this.analyzeVolatilityPerformance(signals);
    patterns.trendPerformance = this.analyzeTrendPerformance(signals);
    
    // Symbol-specific patterns
    patterns.symbolPerformance = this.analyzeSymbolPerformance(signals);
    
    // Confluence patterns
    patterns.confluenceEffectiveness = this.analyzeConfluenceEffectiveness(signals);
    
    return patterns;
  }

  /**
   * Get current strategy weights
   */
  public getStrategyWeights(): Record<string, number> {
    const weights: Record<string, number> = {};
    this.strategyPerformance.forEach((performance, strategy) => {
      weights[strategy] = performance.currentWeight;
    });
    return weights;
  }

  /**
   * Get strategy performance summary
   */
  public getPerformanceSummary(): StrategyPerformance[] {
    return Array.from(this.strategyPerformance.values())
      .sort((a, b) => b.winRate - a.winRate);
  }

  /**
   * Get latest learning iteration
   */
  public getLatestLearningIteration(): LearningIteration | null {
    return this.learningIterations.length > 0 
      ? this.learningIterations[this.learningIterations.length - 1] 
      : null;
  }

  /**
   * Get learning progress report
   */
  public getLearningProgress(): {
    totalIterations: number;
    accuracyTrend: number[];
    improvementRate: number;
    keyInsights: string[];
  } {
    const accuracyTrend = this.learningIterations.map(i => i.accuracyRate);
    const improvementRate = accuracyTrend.length > 1 
      ? (accuracyTrend[accuracyTrend.length - 1] - accuracyTrend[0]) * 100
      : 0;

    const keyInsights = this.generateKeyInsights();

    return {
      totalIterations: this.learningIterations.length,
      accuracyTrend,
      improvementRate,
      keyInsights
    };
  }

  // Helper methods
  private processHistoricalSignals(data: any[]) {
    // Convert database format to SignalOutcome format
    this.signalHistory = data.map(record => ({
      signalId: record.signal_id,
      symbol: record.symbol,
      strategy: record.strategy,
      action: record.action.toUpperCase() as 'BUY' | 'SELL',
      entryPrice: record.entry_price,
      exitPrice: record.exit_price,
      stopLoss: record.stop_loss,
      targetPrice: record.target_price,
      confidence: record.confidence,
      riskRewardRatio: record.risk_reward_ratio,
      outcome: record.was_correct ? 'win' : record.outcome || 'pending',
      profitPercent: record.actual_profit_loss || 0,
      timeframe: '1h', // Default if not available
      methods: record.reasoning ? record.reasoning.split('; ') : [],
      confluences: [],
      marketConditions: record.market_conditions || {},
      fundamentalEvents: record.sentiment_data?.events || [],
      executionTime: new Date(record.created_at).getTime(),
      exitReason: record.exit_reason,
      timestamp: new Date(record.created_at).getTime()
    }));
  }

  private processLearningIterations(data: any[]) {
    this.learningIterations = data.map(record => ({
      iterationNumber: record.iteration_number,
      dataPointsProcessed: record.data_points_processed,
      successfulPredictions: record.successful_predictions,
      totalPredictions: record.total_predictions,
      accuracyRate: record.accuracy_rate,
      confidenceAdjustments: record.confidence_adjustments || {},
      strategyWeights: record.strategy_weights || {},
      marketConditionsLearned: record.market_conditions_learned || {},
      improvementAreas: [],
      timestamp: new Date(record.created_at).getTime()
    }));
  }

  private getConfidenceAdjustments(): Record<string, number> {
    const adjustments: Record<string, number> = {};
    this.strategyPerformance.forEach((performance, strategy) => {
      adjustments[strategy] = performance.confidence;
    });
    return adjustments;
  }

  private identifyImprovementAreas(signals: SignalOutcome[]): string[] {
    const areas: string[] = [];
    
    // Analyze common failure patterns
    const lossSignals = signals.filter(s => s.outcome === 'loss');
    
    if (lossSignals.length > 0) {
      // Check for confidence over-estimation
      const highConfidenceLosses = lossSignals.filter(s => s.confidence > 80).length;
      if (highConfidenceLosses / lossSignals.length > 0.3) {
        areas.push('Reduce confidence calibration for high-confidence signals');
      }
      
      // Check for poor risk management
      const bigLosses = lossSignals.filter(s => s.profitPercent < -5).length;
      if (bigLosses / lossSignals.length > 0.2) {
        areas.push('Improve stop-loss placement and risk management');
      }
    }
    
    return areas;
  }

  private findBestConditions(signals: SignalOutcome[], field: keyof SignalOutcome): string[] {
    const conditions = new Map<string, { wins: number; total: number }>();
    
    signals.forEach(signal => {
      const value = String(signal[field]);
      if (!conditions.has(value)) {
        conditions.set(value, { wins: 0, total: 0 });
      }
      const condition = conditions.get(value)!;
      condition.total++;
      if (signal.outcome === 'win') condition.wins++;
    });
    
    return Array.from(conditions.entries())
      .filter(([_, stats]) => stats.total >= 3) // Minimum 3 signals
      .sort((a, b) => (b[1].wins / b[1].total) - (a[1].wins / a[1].total))
      .slice(0, 3)
      .map(([condition]) => condition);
  }

  private generateStrategyInsights(performance: StrategyPerformance, signals: SignalOutcome[]): string[] {
    const insights: string[] = [];
    
    if (performance.winRate > 0.7) {
      insights.push(`Strong performance: ${(performance.winRate * 100).toFixed(1)}% win rate`);
    }
    
    if (performance.profitFactor > 2.0) {
      insights.push(`Excellent profit factor: ${performance.profitFactor.toFixed(2)}`);
    }
    
    if (performance.bestTimeframes.length > 0) {
      insights.push(`Best timeframes: ${performance.bestTimeframes.join(', ')}`);
    }
    
    if (performance.avgProfitPercent > 5) {
      insights.push(`Strong average profit: ${performance.avgProfitPercent.toFixed(1)}%`);
    }
    
    return insights;
  }

  private calculateConsistency(signals: SignalOutcome[]): number {
    if (signals.length < 5) return 0.5;
    
    const winRates = [];
    const windowSize = 5;
    
    for (let i = 0; i <= signals.length - windowSize; i++) {
      const window = signals.slice(i, i + windowSize);
      const wins = window.filter(s => s.outcome === 'win').length;
      winRates.push(wins / windowSize);
    }
    
    // Calculate standard deviation of win rates (lower = more consistent)
    const mean = winRates.reduce((sum, rate) => sum + rate, 0) / winRates.length;
    const variance = winRates.reduce((sum, rate) => sum + Math.pow(rate - mean, 2), 0) / winRates.length;
    const stdDev = Math.sqrt(variance);
    
    // Convert to consistency score (0-1, higher = more consistent)
    return Math.max(0, 1 - stdDev * 2);
  }

  private analyzeTradingHours(signals: SignalOutcome[]): Record<number, number> {
    const hourPerformance: Record<number, { wins: number; total: number }> = {};
    
    signals.forEach(signal => {
      const hour = new Date(signal.timestamp).getUTCHours();
      if (!hourPerformance[hour]) {
        hourPerformance[hour] = { wins: 0, total: 0 };
      }
      hourPerformance[hour].total++;
      if (signal.outcome === 'win') hourPerformance[hour].wins++;
    });
    
    const result: Record<number, number> = {};
    Object.entries(hourPerformance).forEach(([hour, stats]) => {
      if (stats.total >= 3) {
        result[parseInt(hour)] = stats.wins / stats.total;
      }
    });
    
    return result;
  }

  private analyzeTradingDays(signals: SignalOutcome[]): Record<number, number> {
    const dayPerformance: Record<number, { wins: number; total: number }> = {};
    
    signals.forEach(signal => {
      const day = new Date(signal.timestamp).getUTCDay();
      if (!dayPerformance[day]) {
        dayPerformance[day] = { wins: 0, total: 0 };
      }
      dayPerformance[day].total++;
      if (signal.outcome === 'win') dayPerformance[day].wins++;
    });
    
    const result: Record<number, number> = {};
    Object.entries(dayPerformance).forEach(([day, stats]) => {
      if (stats.total >= 3) {
        result[parseInt(day)] = stats.wins / stats.total;
      }
    });
    
    return result;
  }

  private analyzeVolatilityPerformance(signals: SignalOutcome[]): any {
    // Simplified volatility analysis
    return { analysis: 'Volatility patterns identified' };
  }

  private analyzeTrendPerformance(signals: SignalOutcome[]): any {
    // Simplified trend analysis
    return { analysis: 'Trend patterns identified' };
  }

  private analyzeSymbolPerformance(signals: SignalOutcome[]): Record<string, number> {
    const symbolStats: Record<string, { wins: number; total: number }> = {};
    
    signals.forEach(signal => {
      if (!symbolStats[signal.symbol]) {
        symbolStats[signal.symbol] = { wins: 0, total: 0 };
      }
      symbolStats[signal.symbol].total++;
      if (signal.outcome === 'win') symbolStats[signal.symbol].wins++;
    });
    
    const result: Record<string, number> = {};
    Object.entries(symbolStats).forEach(([symbol, stats]) => {
      if (stats.total >= 3) {
        result[symbol] = stats.wins / stats.total;
      }
    });
    
    return result;
  }

  private analyzeConfluenceEffectiveness(signals: SignalOutcome[]): Record<number, number> {
    const confluenceStats: Record<number, { wins: number; total: number }> = {};
    
    signals.forEach(signal => {
      const confluenceCount = signal.confluences.length;
      if (!confluenceStats[confluenceCount]) {
        confluenceStats[confluenceCount] = { wins: 0, total: 0 };
      }
      confluenceStats[confluenceCount].total++;
      if (signal.outcome === 'win') confluenceStats[confluenceCount].wins++;
    });
    
    const result: Record<number, number> = {};
    Object.entries(confluenceStats).forEach(([count, stats]) => {
      if (stats.total >= 3) {
        result[parseInt(count)] = stats.wins / stats.total;
      }
    });
    
    return result;
  }

  private generateKeyInsights(): string[] {
    const insights: string[] = [];
    const latest = this.getLatestLearningIteration();
    
    if (latest) {
      insights.push(`Current accuracy: ${(latest.accuracyRate * 100).toFixed(1)}%`);
      insights.push(`Processed ${latest.dataPointsProcessed} signals`);
      
      // Best performing strategies
      const topStrategies = this.getPerformanceSummary().slice(0, 3);
      if (topStrategies.length > 0) {
        insights.push(`Top strategy: ${topStrategies[0].strategyName} (${(topStrategies[0].winRate * 100).toFixed(1)}%)`);
      }
    }
    
    return insights;
  }
}

export const aiLearningLoop = new AILearningLoop();
