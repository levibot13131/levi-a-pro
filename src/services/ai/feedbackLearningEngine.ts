import { supabase } from '@/integrations/supabase/client';

interface LearningData {
  signalId: string;
  symbol: string;
  strategy: string;
  marketConditions: any;
  outcome: 'profit' | 'loss';
  profitPercent: number;
  timeToTarget: number; // hours
  confidence: number;
  actualConfidence: number; // calculated post-outcome
}

interface StrategyAdjustment {
  strategy: string;
  oldWeight: number;
  newWeight: number;
  reason: string;
}

export class FeedbackLearningEngine {
  private static learningHistory: LearningData[] = [];
  private static strategyWeights = new Map<string, number>([
    ['enhanced-ai', 1.0],
    ['personal-method', 0.9],
    ['smc-trading', 0.8],
    ['wyckoff-method', 0.7]
  ]);

  static async recordSignalOutcome(learningData: LearningData): Promise<void> {
    console.log(`📚 Learning from signal outcome: ${learningData.signalId} (${learningData.outcome})`);
    
    // Store in learning history
    this.learningHistory.push(learningData);
    
    // Keep only last 1000 learning entries
    if (this.learningHistory.length > 1000) {
      this.learningHistory = this.learningHistory.slice(-1000);
    }
    
    // Analyze and adjust strategy weights
    const adjustments = this.analyzeAndAdjust(learningData);
    
    // Log learning iteration to database
    await this.logLearningIteration(learningData, adjustments);
    
    console.log(`🧠 Strategy adjustments applied:`, adjustments);
  }

  private static analyzeAndAdjust(newData: LearningData): StrategyAdjustment[] {
    const adjustments: StrategyAdjustment[] = [];
    const strategy = newData.strategy;
    
    // Get recent performance for this strategy
    const recentSignals = this.learningHistory
      .filter(l => l.strategy === strategy)
      .slice(-20); // Last 20 signals
    
    if (recentSignals.length < 5) return adjustments; // Need minimum data
    
    const successRate = recentSignals.filter(s => s.outcome === 'profit').length / recentSignals.length;
    const avgProfit = recentSignals
      .filter(s => s.outcome === 'profit')
      .reduce((acc, s) => acc + s.profitPercent, 0) / recentSignals.filter(s => s.outcome === 'profit').length || 0;
    
    const currentWeight = this.strategyWeights.get(strategy) || 1.0;
    let newWeight = currentWeight;
    let reason = '';
    
    // Adjust based on success rate
    if (successRate > 0.8 && avgProfit > 3) {
      newWeight = Math.min(1.2, currentWeight + 0.1);
      reason = `High success rate (${(successRate * 100).toFixed(0)}%) + good profits`;
    } else if (successRate < 0.5) {
      newWeight = Math.max(0.5, currentWeight - 0.1);
      reason = `Low success rate (${(successRate * 100).toFixed(0)}%)`;
    } else if (avgProfit < 1 && successRate < 0.7) {
      newWeight = Math.max(0.6, currentWeight - 0.05);
      reason = `Poor risk/reward performance`;
    }
    
    // Apply weight change if significant
    if (Math.abs(newWeight - currentWeight) > 0.02) {
      this.strategyWeights.set(strategy, newWeight);
      adjustments.push({
        strategy,
        oldWeight: currentWeight,
        newWeight,
        reason
      });
    }
    
    return adjustments;
  }

  private static async logLearningIteration(data: LearningData, adjustments: StrategyAdjustment[]): Promise<void> {
    try {
      const { error } = await supabase
        .from('learning_iterations')
        .insert({
          iteration_number: Math.floor(Date.now() / 1000),
          data_points_processed: 1,
          successful_predictions: data.outcome === 'profit' ? 1 : 0,
          total_predictions: 1,
          accuracy_rate: data.outcome === 'profit' ? 1 : 0,
          confidence_adjustments: {
            signal_id: data.signalId,
            predicted_confidence: data.confidence,
            actual_confidence: data.actualConfidence,
            confidence_error: Math.abs(data.confidence - data.actualConfidence)
          },
          strategy_weights: Object.fromEntries(this.strategyWeights),
          market_conditions_learned: {
            symbol: data.symbol,
            outcome: data.outcome,
            profit_percent: data.profitPercent,
            time_to_target: data.timeToTarget,
            adjustments_made: adjustments
          }
        });

      if (error) throw error;
      
      console.log(`✅ Learning iteration logged successfully`);
    } catch (error) {
      console.error('❌ Failed to log learning iteration:', error);
    }
  }

  static getStrategyWeight(strategy: string): number {
    return this.strategyWeights.get(strategy) || 1.0;
  }

  static getLearningStats(): any {
    const totalSignals = this.learningHistory.length;
    const successfulSignals = this.learningHistory.filter(l => l.outcome === 'profit').length;
    const successRate = totalSignals > 0 ? (successfulSignals / totalSignals) : 0;
    
    const avgTimeToTarget = this.learningHistory
      .reduce((acc, l) => acc + l.timeToTarget, 0) / totalSignals || 0;
    
    const strategyPerformance = Array.from(this.strategyWeights.entries()).map(([strategy, weight]) => {
      const strategySignals = this.learningHistory.filter(l => l.strategy === strategy);
      const strategySuccessRate = strategySignals.length > 0 
        ? strategySignals.filter(s => s.outcome === 'profit').length / strategySignals.length 
        : 0;
      
      return {
        strategy,
        weight,
        successRate: strategySuccessRate,
        totalSignals: strategySignals.length
      };
    });
    
    return {
      totalSignals,
      successfulSignals,
      successRate,
      avgTimeToTarget,
      strategyPerformance
    };
  }

  static shouldBoostConfidence(symbol: string, strategy: string, baseConfidence: number): number {
    const recentPerformance = this.learningHistory
      .filter(l => l.symbol === symbol && l.strategy === strategy)
      .slice(-10); // Last 10 signals for this symbol+strategy
    
    if (recentPerformance.length < 3) return baseConfidence;
    
    const successRate = recentPerformance.filter(p => p.outcome === 'profit').length / recentPerformance.length;
    const strategyWeight = this.getStrategyWeight(strategy);
    
    // Boost confidence based on recent performance and strategy weight
    let boost = 0;
    if (successRate > 0.8) boost += 5;
    else if (successRate > 0.6) boost += 2;
    else if (successRate < 0.4) boost -= 5;
    
    boost += (strategyWeight - 1) * 10; // Weight adjustment
    
    return Math.max(0, Math.min(100, baseConfidence + boost));
  }
}
