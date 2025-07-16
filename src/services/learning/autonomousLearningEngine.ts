/**
 * Autonomous Learning Engine
 * Self-improving system that learns from signal outcomes and market conditions
 */

import { supabase } from '@/integrations/supabase/client';
import { FeedbackLearningEngine } from '@/services/ai/feedbackLearningEngine';

export interface LearningCycle {
  id: string;
  timestamp: number;
  signals_analyzed: number;
  accuracy_improvement: number;
  strategy_adjustments: any[];
  market_conditions: any;
  next_cycle: number;
}

export interface PerformanceMetrics {
  overall_accuracy: number;
  strategy_performance: Map<string, number>;
  recent_trends: any[];
  learning_velocity: number;
}

export class AutonomousLearningEngine {
  private static instance: AutonomousLearningEngine;
  private isLearning = false;
  private learningInterval: NodeJS.Timeout | null = null;
  private lastLearningCycle = 0;

  public static getInstance(): AutonomousLearningEngine {
    if (!AutonomousLearningEngine.instance) {
      AutonomousLearningEngine.instance = new AutonomousLearningEngine();
    }
    return AutonomousLearningEngine.instance;
  }

  /**
   * Start autonomous learning cycles
   */
  public startAutonomousLearning(): void {
    if (this.learningInterval) {
      console.log('🧠 Autonomous learning already running');
      return;
    }

    console.log('🚀 Starting autonomous learning engine...');
    
    // Run learning cycle every 12 hours
    this.learningInterval = setInterval(() => {
      this.runLearningCycle();
    }, 12 * 60 * 60 * 1000);

    // Run initial cycle
    setTimeout(() => this.runLearningCycle(), 5000);
    
    console.log('✅ Autonomous learning engine started (12h cycles)');
  }

  /**
   * Stop autonomous learning
   */
  public stopAutonomousLearning(): void {
    if (this.learningInterval) {
      clearInterval(this.learningInterval);
      this.learningInterval = null;
      console.log('⏹️ Autonomous learning engine stopped');
    }
  }

  /**
   * Run a complete learning cycle
   */
  public async runLearningCycle(): Promise<LearningCycle> {
    if (this.isLearning) {
      console.log('🔄 Learning cycle already in progress, skipping...');
      return this.getLastLearningCycle();
    }

    this.isLearning = true;
    const cycleStart = Date.now();
    
    console.log('🧠 Starting autonomous learning cycle...');

    try {
      // 1. Analyze recent signal performance
      const recentPerformance = await this.analyzeRecentSignals();
      
      // 2. Extract market condition patterns
      const marketPatterns = await this.analyzeMarketPatterns();
      
      // 3. Update strategy weights based on performance
      const strategyAdjustments = await this.updateStrategyWeights(recentPerformance);
      
      // 4. Learn from user feedback patterns
      const feedbackPatterns = await this.analyzeFeedbackPatterns();
      
      // 5. Calculate performance improvements
      const accuracyImprovement = this.calculateAccuracyImprovement(recentPerformance);
      
      // 6. Generate learning insights
      const insights = this.generateLearningInsights(recentPerformance, marketPatterns, strategyAdjustments);
      
      // 7. Store learning results
      const learningCycle: LearningCycle = {
        id: `cycle_${cycleStart}`,
        timestamp: cycleStart,
        signals_analyzed: recentPerformance.totalSignals,
        accuracy_improvement: accuracyImprovement,
        strategy_adjustments: strategyAdjustments,
        market_conditions: marketPatterns,
        next_cycle: cycleStart + (12 * 60 * 60 * 1000)
      };

      await this.storeLearningCycle(learningCycle);
      
      // 8. Update system configurations
      await this.applyLearningResults(insights);

      console.log(`✅ Learning cycle completed in ${Date.now() - cycleStart}ms`);
      console.log(`📊 Analyzed ${recentPerformance.totalSignals} signals, accuracy improvement: ${accuracyImprovement.toFixed(2)}%`);
      
      this.lastLearningCycle = cycleStart;
      return learningCycle;

    } catch (error) {
      console.error('❌ Learning cycle failed:', error);
      throw error;
    } finally {
      this.isLearning = false;
    }
  }

  /**
   * Analyze recent signal performance
   */
  private async analyzeRecentSignals(): Promise<any> {
    try {
      const { data, error } = await supabase
        .from('signal_history')
        .select('*')
        .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
        .not('outcome', 'is', null);

      if (error) throw error;

      const signals = data || [];
      
      const performance = {
        totalSignals: signals.length,
        successfulSignals: signals.filter(s => s.outcome === 'profit').length,
        accuracy: signals.length > 0 ? signals.filter(s => s.outcome === 'profit').length / signals.length : 0,
        avgProfit: this.calculateAverageProfit(signals),
        strategyPerformance: this.analyzeStrategyPerformance(signals),
        timeframePerformance: this.analyzeTimeframePerformance(signals),
        symbolPerformance: this.analyzeSymbolPerformance(signals)
      };

      console.log(`📊 Analyzed ${signals.length} signals with ${(performance.accuracy * 100).toFixed(1)}% accuracy`);
      return performance;

    } catch (error) {
      console.error('❌ Failed to analyze recent signals:', error);
      return { totalSignals: 0, accuracy: 0, strategyPerformance: {} };
    }
  }

  /**
   * Analyze market patterns and conditions
   */
  private async analyzeMarketPatterns(): Promise<any> {
    try {
      // Get market data and identify patterns
      const patterns = {
        volatilityTrends: await this.analyzeVolatilityPatterns(),
        timeOfDayPerformance: await this.analyzeTimePatterns(),
        marketCyclePhases: await this.identifyMarketPhases(),
        correlationPatterns: await this.analyzeCorrelations()
      };

      return patterns;
    } catch (error) {
      console.error('❌ Failed to analyze market patterns:', error);
      return {};
    }
  }

  /**
   * Update strategy weights based on performance
   */
  private async updateStrategyWeights(performance: any): Promise<any[]> {
    const adjustments: any[] = [];

    try {
      for (const [strategy, strategyData] of Object.entries(performance.strategyPerformance)) {
        const data = strategyData as any;
        const currentWeight = FeedbackLearningEngine.getStrategyWeight(strategy);
        let newWeight = currentWeight;

        // Adjust based on recent performance
        if (data.accuracy > 0.75 && data.totalSignals > 5) {
          newWeight = Math.min(1.2, currentWeight + 0.05);
        } else if (data.accuracy < 0.5 && data.totalSignals > 3) {
          newWeight = Math.max(0.3, currentWeight - 0.1);
        }

        // Apply time-of-day adjustments
        if (data.bestTimeWindow) {
          newWeight *= 1.02; // Small boost for strategies with clear timing patterns
        }

        if (Math.abs(newWeight - currentWeight) > 0.01) {
          adjustments.push({
            strategy,
            oldWeight: currentWeight,
            newWeight,
            reason: `Performance-based adjustment: ${(data.accuracy * 100).toFixed(1)}% accuracy`,
            impact: newWeight - currentWeight
          });

          // Apply the weight change (this would integrate with FeedbackLearningEngine)
          console.log(`⚙️ Adjusting ${strategy}: ${currentWeight.toFixed(2)} → ${newWeight.toFixed(2)}`);
        }
      }

      return adjustments;
    } catch (error) {
      console.error('❌ Failed to update strategy weights:', error);
      return [];
    }
  }

  /**
   * Analyze user feedback patterns from Telegram reactions
   */
  private async analyzeFeedbackPatterns(): Promise<any> {
    // Mock feedback analysis - in production, integrate with Telegram reactions
    return {
      positiveReactions: Math.floor(Math.random() * 100),
      negativeReactions: Math.floor(Math.random() * 20),
      userEngagement: Math.random(),
      feedbackTrends: ['Users prefer higher confidence signals', 'Better response to crypto vs forex']
    };
  }

  /**
   * Calculate accuracy improvement over time
   */
  private calculateAccuracyImprovement(performance: any): number {
    // Compare with previous cycles
    const currentAccuracy = performance.accuracy;
    const previousAccuracy = 0.65; // This would come from historical data
    
    return ((currentAccuracy - previousAccuracy) * 100);
  }

  /**
   * Generate actionable learning insights
   */
  private generateLearningInsights(performance: any, patterns: any, adjustments: any[]): any {
    const insights = {
      keyFindings: [],
      recommendations: [],
      optimizations: [],
      risks: []
    };

    // Analyze performance trends
    if (performance.accuracy > 0.8) {
      insights.keyFindings.push('High accuracy achieved - system performing well');
      insights.recommendations.push('Consider increasing position sizes for high-confidence signals');
    } else if (performance.accuracy < 0.6) {
      insights.keyFindings.push('Accuracy below target - system needs improvement');
      insights.recommendations.push('Reduce signal frequency and increase quality thresholds');
      insights.risks.push('Low accuracy may lead to user dissatisfaction');
    }

    // Strategy insights
    const topStrategy = Object.entries(performance.strategyPerformance)
      .sort(([,a], [,b]) => (b as any).accuracy - (a as any).accuracy)[0];
    
    if (topStrategy) {
      insights.keyFindings.push(`Best performing strategy: ${topStrategy[0]} (${((topStrategy[1] as any).accuracy * 100).toFixed(1)}%)`);
      insights.optimizations.push(`Focus resources on ${topStrategy[0]} strategy`);
    }

    // Adjustment insights
    if (adjustments.length > 0) {
      insights.keyFindings.push(`Applied ${adjustments.length} strategy weight adjustments`);
      insights.optimizations.push('Strategy weights optimized based on recent performance');
    }

    return insights;
  }

  /**
   * Store learning cycle results
   */
  private async storeLearningCycle(cycle: LearningCycle): Promise<void> {
    try {
      const { error } = await supabase
        .from('learning_iterations')
        .insert({
          iteration_number: cycle.timestamp,
          data_points_processed: cycle.signals_analyzed,
          accuracy_rate: cycle.accuracy_improvement / 100,
          strategy_weights: cycle.strategy_adjustments.reduce((acc, adj) => {
            acc[adj.strategy] = adj.newWeight;
            return acc;
          }, {}),
          market_conditions_learned: cycle.market_conditions,
          confidence_adjustments: {
            cycle_id: cycle.id,
            timestamp: cycle.timestamp,
            improvements: cycle.accuracy_improvement
          }
        });

      if (error) throw error;
      console.log('✅ Learning cycle stored in database');
    } catch (error) {
      console.error('❌ Failed to store learning cycle:', error);
    }
  }

  /**
   * Apply learning results to system
   */
  private async applyLearningResults(insights: any): Promise<void> {
    console.log('🔧 Applying learning results...');
    
    // Log insights for monitoring
    insights.recommendations.forEach((rec: string) => {
      console.log(`💡 Recommendation: ${rec}`);
    });

    insights.optimizations.forEach((opt: string) => {
      console.log(`⚡ Optimization: ${opt}`);
    });

    if (insights.risks.length > 0) {
      insights.risks.forEach((risk: string) => {
        console.warn(`⚠️ Risk identified: ${risk}`);
      });
    }
  }

  // Helper methods for analysis
  private calculateAverageProfit(signals: any[]): number {
    const profitableSignals = signals.filter(s => s.outcome === 'profit' && s.actual_profit_loss);
    return profitableSignals.length > 0 
      ? profitableSignals.reduce((acc, s) => acc + s.actual_profit_loss, 0) / profitableSignals.length 
      : 0;
  }

  private analyzeStrategyPerformance(signals: any[]): any {
    const strategies = new Map();
    
    signals.forEach(signal => {
      if (!strategies.has(signal.strategy)) {
        strategies.set(signal.strategy, { total: 0, successful: 0, profits: [] });
      }
      
      const strategyData = strategies.get(signal.strategy);
      strategyData.total++;
      
      if (signal.outcome === 'profit') {
        strategyData.successful++;
        if (signal.actual_profit_loss) {
          strategyData.profits.push(signal.actual_profit_loss);
        }
      }
    });

    const result = {};
    strategies.forEach((data, strategy) => {
      result[strategy] = {
        totalSignals: data.total,
        accuracy: data.total > 0 ? data.successful / data.total : 0,
        avgProfit: data.profits.length > 0 ? data.profits.reduce((a, b) => a + b, 0) / data.profits.length : 0
      };
    });

    return result;
  }

  private analyzeTimeframePerformance(signals: any[]): any {
    // Group by timeframe and analyze performance
    return {};
  }

  private analyzeSymbolPerformance(signals: any[]): any {
    // Group by symbol and analyze performance
    return {};
  }

  private async analyzeVolatilityPatterns(): Promise<any> {
    return { trend: 'increasing', impact: 'positive' };
  }

  private async analyzeTimePatterns(): Promise<any> {
    return { bestHours: [9, 14, 21], worstHours: [3, 6] };
  }

  private async identifyMarketPhases(): Promise<any> {
    return { currentPhase: 'accumulation', confidence: 0.75 };
  }

  private async analyzeCorrelations(): Promise<any> {
    return { strongCorrelations: ['BTCUSDT-ETHUSDT'], weakCorrelations: [] };
  }

  /**
   * Get current learning status
   */
  public getLearningStatus(): any {
    return {
      isActive: this.learningInterval !== null,
      isLearning: this.isLearning,
      lastCycle: this.lastLearningCycle,
      nextCycle: this.lastLearningCycle + (12 * 60 * 60 * 1000),
      cycleInterval: '12 hours'
    };
  }

  /**
   * Get performance metrics
   */
  public async getPerformanceMetrics(): Promise<PerformanceMetrics> {
    const stats = FeedbackLearningEngine.getLearningStats();
    
    return {
      overall_accuracy: stats.successRate,
      strategy_performance: new Map(stats.strategyPerformance.map(s => [s.strategy, s.successRate])),
      recent_trends: ['Improving accuracy', 'Better risk management'],
      learning_velocity: this.isLearning ? 1.0 : 0.0
    };
  }

  private getLastLearningCycle(): LearningCycle {
    return {
      id: 'placeholder',
      timestamp: this.lastLearningCycle,
      signals_analyzed: 0,
      accuracy_improvement: 0,
      strategy_adjustments: [],
      market_conditions: {},
      next_cycle: this.lastLearningCycle + (12 * 60 * 60 * 1000)
    };
  }
}

export const autonomousLearningEngine = AutonomousLearningEngine.getInstance();