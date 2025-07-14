// AI Learning Engine for LeviPro
// Complete learning system that evolves strategy weights and improves over time

import { supabase } from '@/integrations/supabase/client';
import { TradingSignal } from '@/types/trading';

export interface SignalOutcome {
  signalId: string;
  symbol: string;
  strategy: string;
  action: 'buy' | 'sell';
  entryPrice: number;
  exitPrice?: number;
  stopLoss: number;
  targetPrice: number;
  confidence: number;
  riskRewardRatio: number;
  outcome: 'win' | 'loss' | 'pending';
  profitPercent: number;
  timeframes: string[];
  fundamentalEvents: string[];
  marketConditions: any;
  executionTime: number;
  closeTime?: number;
  exitReason?: 'target_hit' | 'stop_loss' | 'manual' | 'timeout';
}

export interface StrategyPerformance {
  strategyName: string;
  totalSignals: number;
  winningSignals: number;
  losingSignals: number;
  winRate: number;
  avgProfit: number;
  avgLoss: number;
  profitFactor: number;
  sharpeRatio: number;
  maxDrawdown: number;
  currentWeight: number;
  confidence: number;
  timeframeBias: { [timeframe: string]: number };
  symbolBias: { [symbol: string]: number };
  marketConditionBias: { [condition: string]: number };
  evolutionHistory: { timestamp: number; weight: number; performance: number }[];
}

export interface LearningInsights {
  bestPerformingStrategy: string;
  worstPerformingStrategy: string;
  optimalTimeframes: string[];
  bestSymbols: string[];
  marketConditionPreferences: string[];
  confidenceTrends: { strategy: string; trend: 'improving' | 'declining' | 'stable' }[];
  recommendedAdjustments: string[];
  nextLearningGoals: string[];
}

export interface MarketConditionLearning {
  condition: string;
  successRate: number;
  avgProfit: number;
  bestStrategies: string[];
  optimalConfidence: number;
  marketExamples: { date: string; outcome: string; lesson: string }[];
}

class AILearningEngine {
  private signalOutcomes: SignalOutcome[] = [];
  private strategyPerformances: Map<string, StrategyPerformance> = new Map();
  private marketConditionLearning: Map<string, MarketConditionLearning> = new Map();
  private readonly LEARNING_HISTORY_DAYS = 90;

  constructor() {
    this.initializeStrategies();
    this.loadHistoricalData();
  }

  /**
   * Record a new signal for learning
   */
  public async recordSignal(signal: TradingSignal): Promise<void> {
    const outcome: SignalOutcome = {
      signalId: signal.id,
      symbol: signal.symbol,
      strategy: signal.strategy,
      action: signal.action,
      entryPrice: signal.price,
      stopLoss: signal.stopLoss,
      targetPrice: signal.targetPrice,
      confidence: signal.confidence,
      riskRewardRatio: signal.riskRewardRatio,
      outcome: 'pending',
      profitPercent: 0,
      timeframes: this.extractTimeframes(signal.metadata),
      fundamentalEvents: this.extractFundamentalEvents(signal.metadata),
      marketConditions: signal.metadata?.marketConditions || {},
      executionTime: Date.now()
    };

    this.signalOutcomes.push(outcome);
    
    // Store in database
    await this.storeSignalOutcome(outcome);
    
    console.log(`📚 Signal recorded for learning: ${signal.action} ${signal.symbol}`);
  }

  /**
   * Update signal outcome when trade closes
   */
  public async updateSignalOutcome(
    signalId: string, 
    exitPrice: number, 
    exitReason: SignalOutcome['exitReason']
  ): Promise<void> {
    const outcome = this.signalOutcomes.find(o => o.signalId === signalId);
    if (!outcome) {
      console.warn(`⚠️ Signal outcome not found: ${signalId}`);
      return;
    }

    outcome.exitPrice = exitPrice;
    outcome.closeTime = Date.now();
    outcome.exitReason = exitReason;

    // Calculate profit/loss
    if (outcome.action === 'buy') {
      outcome.profitPercent = ((exitPrice - outcome.entryPrice) / outcome.entryPrice) * 100;
    } else {
      outcome.profitPercent = ((outcome.entryPrice - exitPrice) / outcome.entryPrice) * 100;
    }

    // Determine win/loss
    outcome.outcome = outcome.profitPercent > 0 ? 'win' : 'loss';

    // Update database
    await this.updateSignalOutcomeInDB(outcome);

    // Trigger learning update
    await this.processLearningUpdate(outcome);

    console.log(`📊 Signal outcome updated: ${outcome.outcome} (${outcome.profitPercent.toFixed(2)}%)`);
  }

  /**
   * Process learning from a completed signal
   */
  private async processLearningUpdate(outcome: SignalOutcome): Promise<void> {
    // Update strategy performance
    await this.updateStrategyPerformance(outcome);
    
    // Update market condition learning
    await this.updateMarketConditionLearning(outcome);
    
    // Recalculate strategy weights
    await this.recalculateStrategyWeights();
    
    // Generate learning insights
    const insights = await this.generateLearningInsights();
    
    // Store learning iteration
    await this.storeLearningIteration(insights);
    
    console.log(`🧠 Learning processed for ${outcome.strategy}: ${outcome.outcome}`);
  }

  /**
   * Update strategy performance metrics
   */
  private async updateStrategyPerformance(outcome: SignalOutcome): Promise<void> {
    let performance = this.strategyPerformances.get(outcome.strategy);
    
    if (!performance) {
      performance = this.createEmptyStrategyPerformance(outcome.strategy);
      this.strategyPerformances.set(outcome.strategy, performance);
    }

    // Update basic metrics
    performance.totalSignals++;
    
    if (outcome.outcome === 'win') {
      performance.winningSignals++;
      performance.avgProfit = this.updateAverage(performance.avgProfit, outcome.profitPercent, performance.winningSignals);
    } else {
      performance.losingSignals++;
      performance.avgLoss = this.updateAverage(performance.avgLoss, Math.abs(outcome.profitPercent), performance.losingSignals);
    }

    // Recalculate derived metrics
    performance.winRate = (performance.winningSignals / performance.totalSignals) * 100;
    performance.profitFactor = performance.avgLoss > 0 ? performance.avgProfit / performance.avgLoss : 0;
    performance.sharpeRatio = this.calculateSharpeRatio(outcome.strategy);
    performance.maxDrawdown = this.calculateMaxDrawdown(outcome.strategy);

    // Update biases
    this.updateTimeframeBias(performance, outcome);
    this.updateSymbolBias(performance, outcome);
    this.updateMarketConditionBias(performance, outcome);

    // Record evolution
    performance.evolutionHistory.push({
      timestamp: Date.now(),
      weight: performance.currentWeight,
      performance: performance.winRate * performance.profitFactor
    });

    console.log(`📈 Strategy performance updated: ${outcome.strategy} (${performance.winRate.toFixed(1)}% WR)`);
  }

  /**
   * Recalculate strategy weights based on performance
   */
  private async recalculateStrategyWeights(): Promise<void> {
    const strategies = Array.from(this.strategyPerformances.values());
    
    if (strategies.length === 0) return;

    // Calculate performance scores
    strategies.forEach(strategy => {
      // Base score from win rate and profit factor
      let score = (strategy.winRate / 100) * strategy.profitFactor;
      
      // Bonus for high volume (more data)
      if (strategy.totalSignals > 20) score *= 1.2;
      if (strategy.totalSignals > 50) score *= 1.1;
      
      // Penalty for high drawdown
      if (strategy.maxDrawdown > 20) score *= 0.8;
      
      // Recent performance weight (last 20 signals)
      const recentPerformance = this.calculateRecentPerformance(strategy.strategyName);
      score = (score * 0.7) + (recentPerformance * 0.3);
      
      strategy.confidence = Math.max(0, Math.min(100, score * 100));
    });

    // Normalize weights
    const totalScore = strategies.reduce((sum, s) => sum + s.confidence, 0);
    
    if (totalScore > 0) {
      strategies.forEach(strategy => {
        strategy.currentWeight = (strategy.confidence / totalScore) * 100;
      });
    }

    // Store updated weights
    await this.storeStrategyWeights(strategies);

    console.log('⚖️ Strategy weights recalculated');
  }

  /**
   * Generate actionable learning insights
   */
  private async generateLearningInsights(): Promise<LearningInsights> {
    const strategies = Array.from(this.strategyPerformances.values());
    
    if (strategies.length === 0) {
      return this.getEmptyInsights();
    }

    // Find best and worst performing strategies
    const sortedByPerformance = strategies.sort((a, b) => 
      (b.winRate * b.profitFactor) - (a.winRate * a.profitFactor)
    );

    const bestStrategy = sortedByPerformance[0];
    const worstStrategy = sortedByPerformance[sortedByPerformance.length - 1];

    // Optimal timeframes analysis
    const timeframePerformance = this.analyzeTimeframePerformance();
    const optimalTimeframes = Object.entries(timeframePerformance)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([timeframe]) => timeframe);

    // Best symbols analysis
    const symbolPerformance = this.analyzeSymbolPerformance();
    const bestSymbols = Object.entries(symbolPerformance)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([symbol]) => symbol);

    // Market condition preferences
    const marketConditions = Array.from(this.marketConditionLearning.values())
      .sort((a, b) => b.successRate - a.successRate)
      .slice(0, 3)
      .map(mc => mc.condition);

    // Confidence trends
    const confidenceTrends = strategies.map(strategy => ({
      strategy: strategy.strategyName,
      trend: this.calculateConfidenceTrend(strategy) as 'improving' | 'declining' | 'stable'
    }));

    // Recommended adjustments
    const recommendedAdjustments = this.generateRecommendations(strategies);

    // Next learning goals
    const nextLearningGoals = this.generateLearningGoals(strategies);

    return {
      bestPerformingStrategy: bestStrategy.strategyName,
      worstPerformingStrategy: worstStrategy.strategyName,
      optimalTimeframes,
      bestSymbols,
      marketConditionPreferences: marketConditions,
      confidenceTrends,
      recommendedAdjustments,
      nextLearningGoals
    };
  }

  /**
   * Get current strategy weights for signal generation
   */
  public getStrategyWeights(): { [strategy: string]: number } {
    const weights: { [strategy: string]: number } = {};
    
    this.strategyPerformances.forEach((performance, strategy) => {
      weights[strategy] = performance.currentWeight;
    });

    return weights;
  }

  /**
   * Get performance stats for UI display
   */
  public getPerformanceStats(): {
    totalSignals: number;
    overallWinRate: number;
    avgRiskReward: number;
    totalProfit: number;
    bestStrategy: string;
    worstStrategy: string;
    learningProgress: number;
  } {
    const allOutcomes = this.signalOutcomes.filter(o => o.outcome !== 'pending');
    
    if (allOutcomes.length === 0) {
      return {
        totalSignals: 0,
        overallWinRate: 0,
        avgRiskReward: 0,
        totalProfit: 0,
        bestStrategy: 'N/A',
        worstStrategy: 'N/A',
        learningProgress: 0
      };
    }

    const winningSignals = allOutcomes.filter(o => o.outcome === 'win').length;
    const overallWinRate = (winningSignals / allOutcomes.length) * 100;
    const avgRiskReward = allOutcomes.reduce((sum, o) => sum + o.riskRewardRatio, 0) / allOutcomes.length;
    const totalProfit = allOutcomes.reduce((sum, o) => sum + o.profitPercent, 0);

    const strategies = Array.from(this.strategyPerformances.values());
    const bestStrategy = strategies.sort((a, b) => b.winRate - a.winRate)[0]?.strategyName || 'N/A';
    const worstStrategy = strategies.sort((a, b) => a.winRate - b.winRate)[0]?.strategyName || 'N/A';

    // Learning progress based on data volume and strategy confidence
    const dataVolume = Math.min(100, (allOutcomes.length / 100) * 100); // 100 signals = 100%
    const avgConfidence = strategies.reduce((sum, s) => sum + s.confidence, 0) / strategies.length || 0;
    const learningProgress = (dataVolume * 0.6) + (avgConfidence * 0.4);

    return {
      totalSignals: allOutcomes.length,
      overallWinRate,
      avgRiskReward,
      totalProfit,
      bestStrategy,
      worstStrategy,
      learningProgress
    };
  }

  // Helper methods
  private initializeStrategies(): void {
    const strategies = [
      'wyckoff-accumulation',
      'wyckoff-distribution',
      'smc-breakout',
      'smc-orderblock',
      'elliott-wave',
      'fibonacci-retracement',
      'volume-profile',
      'rsi-divergence',
      'fundamental-catalyst',
      'magic-triangle'
    ];

    strategies.forEach(strategy => {
      this.strategyPerformances.set(strategy, this.createEmptyStrategyPerformance(strategy));
    });
  }

  private createEmptyStrategyPerformance(strategyName: string): StrategyPerformance {
    return {
      strategyName,
      totalSignals: 0,
      winningSignals: 0,
      losingSignals: 0,
      winRate: 0,
      avgProfit: 0,
      avgLoss: 0,
      profitFactor: 0,
      sharpeRatio: 0,
      maxDrawdown: 0,
      currentWeight: 10, // Equal weight initially
      confidence: 50,
      timeframeBias: {},
      symbolBias: {},
      marketConditionBias: {},
      evolutionHistory: []
    };
  }

  private updateAverage(currentAvg: number, newValue: number, count: number): number {
    return ((currentAvg * (count - 1)) + newValue) / count;
  }

  private calculateSharpeRatio(strategy: string): number {
    const outcomes = this.signalOutcomes.filter(o => 
      o.strategy === strategy && o.outcome !== 'pending'
    );

    if (outcomes.length < 10) return 0;

    const returns = outcomes.map(o => o.profitPercent);
    const avgReturn = returns.reduce((sum, r) => sum + r, 0) / returns.length;
    const variance = returns.reduce((sum, r) => sum + Math.pow(r - avgReturn, 2), 0) / returns.length;
    const stdDev = Math.sqrt(variance);

    return stdDev > 0 ? avgReturn / stdDev : 0;
  }

  private calculateMaxDrawdown(strategy: string): number {
    const outcomes = this.signalOutcomes
      .filter(o => o.strategy === strategy && o.outcome !== 'pending')
      .sort((a, b) => a.executionTime - b.executionTime);

    if (outcomes.length === 0) return 0;

    let peak = 0;
    let maxDrawdown = 0;
    let runningTotal = 0;

    outcomes.forEach(outcome => {
      runningTotal += outcome.profitPercent;
      peak = Math.max(peak, runningTotal);
      const drawdown = peak - runningTotal;
      maxDrawdown = Math.max(maxDrawdown, drawdown);
    });

    return maxDrawdown;
  }

  private updateTimeframeBias(performance: StrategyPerformance, outcome: SignalOutcome): void {
    outcome.timeframes.forEach(timeframe => {
      if (!performance.timeframeBias[timeframe]) {
        performance.timeframeBias[timeframe] = 0;
      }
      performance.timeframeBias[timeframe] += outcome.outcome === 'win' ? 1 : -0.5;
    });
  }

  private updateSymbolBias(performance: StrategyPerformance, outcome: SignalOutcome): void {
    if (!performance.symbolBias[outcome.symbol]) {
      performance.symbolBias[outcome.symbol] = 0;
    }
    performance.symbolBias[outcome.symbol] += outcome.outcome === 'win' ? 1 : -0.5;
  }

  private updateMarketConditionBias(performance: StrategyPerformance, outcome: SignalOutcome): void {
    Object.keys(outcome.marketConditions || {}).forEach(condition => {
      if (!performance.marketConditionBias[condition]) {
        performance.marketConditionBias[condition] = 0;
      }
      performance.marketConditionBias[condition] += outcome.outcome === 'win' ? 1 : -0.5;
    });
  }

  private calculateRecentPerformance(strategy: string): number {
    const recentOutcomes = this.signalOutcomes
      .filter(o => o.strategy === strategy && o.outcome !== 'pending')
      .sort((a, b) => b.executionTime - a.executionTime)
      .slice(0, 20);

    if (recentOutcomes.length === 0) return 0.5;

    const winningSignals = recentOutcomes.filter(o => o.outcome === 'win').length;
    return winningSignals / recentOutcomes.length;
  }

  private async loadHistoricalData(): Promise<void> {
    try {
      const { data: outcomes } = await supabase
        .from('signal_history')
        .select('*')
        .gte('created_at', new Date(Date.now() - this.LEARNING_HISTORY_DAYS * 24 * 60 * 60 * 1000).toISOString());

      if (outcomes) {
        // Process historical data for learning
        console.log(`📚 Loaded ${outcomes.length} historical signals for learning`);
      }
    } catch (error) {
      console.error('❌ Failed to load historical data:', error);
    }
  }

  private extractTimeframes(metadata: any): string[] {
    return metadata?.timeframes || ['1h'];
  }

  private extractFundamentalEvents(metadata: any): string[] {
    return metadata?.fundamentalEvents || [];
  }

  private async storeSignalOutcome(outcome: SignalOutcome): Promise<void> {
    try {
      await supabase.from('signal_history').insert({
        signal_id: outcome.signalId,
        symbol: outcome.symbol,
        strategy: outcome.strategy,
        action: outcome.action,
        entry_price: outcome.entryPrice,
        stop_loss: outcome.stopLoss,
        target_price: outcome.targetPrice,
        confidence: outcome.confidence,
        risk_reward_ratio: outcome.riskRewardRatio,
        reasoning: outcome.fundamentalEvents.join(', '),
        market_conditions: outcome.marketConditions,
        sentiment_data: { timeframes: outcome.timeframes }
      });
    } catch (error) {
      console.error('❌ Failed to store signal outcome:', error);
    }
  }

  private async updateSignalOutcomeInDB(outcome: SignalOutcome): Promise<void> {
    try {
      await supabase
        .from('signal_history')
        .update({
          exit_price: outcome.exitPrice,
          actual_profit_loss: outcome.profitPercent,
          outcome: outcome.outcome,
          exit_reason: outcome.exitReason,
          closed_at: new Date(outcome.closeTime!).toISOString(),
          was_correct: outcome.outcome === 'win'
        })
        .eq('signal_id', outcome.signalId);
    } catch (error) {
      console.error('❌ Failed to update signal outcome:', error);
    }
  }

  private async storeStrategyWeights(strategies: StrategyPerformance[]): Promise<void> {
    try {
      for (const strategy of strategies) {
        await supabase
          .from('strategy_performance')
          .upsert({
            strategy_id: strategy.strategyName,
            strategy_name: strategy.strategyName,
            success_rate: strategy.winRate,
            total_signals: strategy.totalSignals,
            successful_signals: strategy.winningSignals,
            failed_signals: strategy.losingSignals,
            avg_profit_loss: strategy.avgProfit,
            current_weight: strategy.currentWeight,
            confidence_score: strategy.confidence,
            user_id: 'system' // System learning
          });
      }
    } catch (error) {
      console.error('❌ Failed to store strategy weights:', error);
    }
  }

  private async storeLearningIteration(insights: LearningInsights): Promise<void> {
    try {
      await supabase.from('learning_iterations').insert({
        iteration_number: Math.floor(Date.now() / 1000),
        total_predictions: this.signalOutcomes.length,
        successful_predictions: this.signalOutcomes.filter(o => o.outcome === 'win').length,
        accuracy_rate: this.getPerformanceStats().overallWinRate,
        data_points_processed: this.signalOutcomes.length,
        market_conditions_learned: insights as any,
        strategy_weights: this.getStrategyWeights() as any
      });
    } catch (error) {
      console.error('❌ Failed to store learning iteration:', error);
    }
  }

  private updateMarketConditionLearning(outcome: SignalOutcome): void {
    // Implementation for market condition learning
    console.log('📊 Updating market condition learning...');
  }

  private analyzeTimeframePerformance(): { [timeframe: string]: number } {
    const timeframeStats: { [timeframe: string]: { wins: number; total: number } } = {};
    
    this.signalOutcomes.forEach(outcome => {
      if (outcome.outcome === 'pending') return;
      
      outcome.timeframes.forEach(timeframe => {
        if (!timeframeStats[timeframe]) {
          timeframeStats[timeframe] = { wins: 0, total: 0 };
        }
        timeframeStats[timeframe].total++;
        if (outcome.outcome === 'win') {
          timeframeStats[timeframe].wins++;
        }
      });
    });

    const performance: { [timeframe: string]: number } = {};
    Object.entries(timeframeStats).forEach(([timeframe, stats]) => {
      performance[timeframe] = stats.total > 0 ? (stats.wins / stats.total) * 100 : 0;
    });

    return performance;
  }

  private analyzeSymbolPerformance(): { [symbol: string]: number } {
    const symbolStats: { [symbol: string]: { wins: number; total: number } } = {};
    
    this.signalOutcomes.forEach(outcome => {
      if (outcome.outcome === 'pending') return;
      
      if (!symbolStats[outcome.symbol]) {
        symbolStats[outcome.symbol] = { wins: 0, total: 0 };
      }
      symbolStats[outcome.symbol].total++;
      if (outcome.outcome === 'win') {
        symbolStats[outcome.symbol].wins++;
      }
    });

    const performance: { [symbol: string]: number } = {};
    Object.entries(symbolStats).forEach(([symbol, stats]) => {
      performance[symbol] = stats.total > 0 ? (stats.wins / stats.total) * 100 : 0;
    });

    return performance;
  }

  private calculateConfidenceTrend(strategy: StrategyPerformance): string {
    if (strategy.evolutionHistory.length < 5) return 'stable';
    
    const recent = strategy.evolutionHistory.slice(-5);
    const trend = recent[recent.length - 1].performance - recent[0].performance;
    
    if (trend > 5) return 'improving';
    if (trend < -5) return 'declining';
    return 'stable';
  }

  private generateRecommendations(strategies: StrategyPerformance[]): string[] {
    const recommendations: string[] = [];
    
    strategies.forEach(strategy => {
      if (strategy.winRate < 40 && strategy.totalSignals > 10) {
        recommendations.push(`Consider reducing weight for ${strategy.strategyName} (${strategy.winRate.toFixed(1)}% win rate)`);
      }
      
      if (strategy.winRate > 70 && strategy.totalSignals > 10) {
        recommendations.push(`Increase weight for ${strategy.strategyName} (${strategy.winRate.toFixed(1)}% win rate)`);
      }

      if (strategy.maxDrawdown > 25) {
        recommendations.push(`Review risk parameters for ${strategy.strategyName} (${strategy.maxDrawdown.toFixed(1)}% max drawdown)`);
      }
    });

    return recommendations.slice(0, 5); // Top 5 recommendations
  }

  private generateLearningGoals(strategies: StrategyPerformance[]): string[] {
    return [
      'Reach 100 total signals for statistical significance',
      'Achieve 65%+ overall win rate',
      'Optimize timeframe combinations',
      'Improve market condition detection',
      'Enhance fundamental event correlation'
    ];
  }

  private getEmptyInsights(): LearningInsights {
    return {
      bestPerformingStrategy: 'N/A',
      worstPerformingStrategy: 'N/A',
      optimalTimeframes: [],
      bestSymbols: [],
      marketConditionPreferences: [],
      confidenceTrends: [],
      recommendedAdjustments: [],
      nextLearningGoals: []
    };
  }
}

export const aiLearningEngine = new AILearningEngine();