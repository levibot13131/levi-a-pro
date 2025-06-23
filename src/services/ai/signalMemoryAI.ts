
import { supabase } from '@/integrations/supabase/client';

interface SignalPerformanceData {
  symbol: string;
  strategy: string;
  timeframe: string;
  totalSignals: number;
  successfulSignals: number;
  hitRate: number;
  avgTimeToTarget: number;
  avgRiskEfficiency: number;
  lastUpdated: number;
}

interface ConditionPattern {
  marketCondition: string;
  sentimentScore: number;
  volumeRatio: number;
  successRate: number;
  sampleSize: number;
}

export class SignalMemoryAI {
  private static performanceCache = new Map<string, SignalPerformanceData>();
  private static conditionPatterns = new Map<string, ConditionPattern>();
  
  static async getHistoricalPerformance(symbol: string, strategy: string, timeframe: string): Promise<SignalPerformanceData> {
    const key = `${symbol}-${strategy}-${timeframe}`;
    
    if (this.performanceCache.has(key)) {
      return this.performanceCache.get(key)!;
    }

    try {
      const { data: signals, error } = await supabase
        .from('signal_history')
        .select('*')
        .eq('symbol', symbol)
        .eq('strategy', strategy)
        .not('outcome', 'is', null)
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;

      const totalSignals = signals?.length || 0;
      const successfulSignals = signals?.filter(s => s.outcome === 'profit').length || 0;
      const hitRate = totalSignals > 0 ? (successfulSignals / totalSignals) * 100 : 50;
      
      // Calculate average time to target (in hours)
      const completedSignals = signals?.filter(s => s.closed_at) || [];
      const avgTimeToTarget = completedSignals.length > 0 
        ? completedSignals.reduce((sum, s) => {
            const timeToClose = new Date(s.closed_at).getTime() - new Date(s.created_at).getTime();
            return sum + (timeToClose / (1000 * 60 * 60)); // Convert to hours
          }, 0) / completedSignals.length
        : 12; // Default 12 hours

      // Calculate risk efficiency (profit per unit risk)
      const profitableSignals = signals?.filter(s => s.actual_profit_loss && s.actual_profit_loss > 0) || [];
      const avgRiskEfficiency = profitableSignals.length > 0
        ? profitableSignals.reduce((sum, s) => sum + (s.actual_profit_loss || 0), 0) / profitableSignals.length
        : 2.5; // Default 2.5% efficiency

      const performance: SignalPerformanceData = {
        symbol,
        strategy,
        timeframe,
        totalSignals,
        successfulSignals,
        hitRate,
        avgTimeToTarget,
        avgRiskEfficiency,
        lastUpdated: Date.now()
      };

      this.performanceCache.set(key, performance);
      return performance;
    } catch (error) {
      console.error('Error fetching historical performance:', error);
      return {
        symbol,
        strategy,
        timeframe,
        totalSignals: 0,
        successfulSignals: 0,
        hitRate: 50,
        avgTimeToTarget: 12,
        avgRiskEfficiency: 2.5,
        lastUpdated: Date.now()
      };
    }
  }

  static calculateConfidenceBoost(performance: SignalPerformanceData): number {
    let boost = 0;
    
    // Hit rate boost/penalty
    if (performance.hitRate > 70) boost += 10;
    else if (performance.hitRate > 60) boost += 5;
    else if (performance.hitRate < 40) boost -= 10;
    else if (performance.hitRate < 50) boost -= 5;
    
    // Sample size confidence
    if (performance.totalSignals > 20) boost += 5;
    else if (performance.totalSignals < 5) boost -= 5;
    
    // Risk efficiency boost
    if (performance.avgRiskEfficiency > 3) boost += 5;
    else if (performance.avgRiskEfficiency < 2) boost -= 5;
    
    return Math.max(-20, Math.min(20, boost)); // Cap between -20 and +20
  }

  static async learnFromSignalOutcome(signalId: string, outcome: 'profit' | 'loss', exitPrice: number, marketConditions: any) {
    try {
      // Update signal outcome in database
      const { error } = await supabase
        .rpc('update_signal_outcome', {
          p_signal_id: signalId,
          p_outcome: outcome,
          p_exit_price: exitPrice
        });

      if (error) throw error;

      // Clear cache to force refresh on next lookup
      this.performanceCache.clear();
      
      // Store learning iteration
      await this.recordLearningIteration(signalId, outcome, marketConditions);
      
      console.log(`📚 Signal Memory AI learned from ${signalId}: ${outcome}`);
    } catch (error) {
      console.error('Error learning from signal outcome:', error);
    }
  }

  private static async recordLearningIteration(signalId: string, outcome: string, conditions: any) {
    try {
      const { error } = await supabase
        .from('learning_iterations')
        .insert({
          iteration_number: Math.floor(Date.now() / 1000),
          data_points_processed: 1,
          successful_predictions: outcome === 'profit' ? 1 : 0,
          total_predictions: 1,
          accuracy_rate: outcome === 'profit' ? 1 : 0,
          confidence_adjustments: {
            signal_id: signalId,
            outcome: outcome,
            learning_applied: true
          },
          strategy_weights: { adaptive_learning: 1.0 },
          market_conditions_learned: conditions
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error recording learning iteration:', error);
    }
  }

  static async getLeviScore(symbol: string, strategy: string, confidence: number, marketConditions: any): Promise<number> {
    const performance = await this.getHistoricalPerformance(symbol, strategy, '15m');
    const confidenceBoost = this.calculateConfidenceBoost(performance);
    
    // Base score from original confidence
    let leviScore = confidence;
    
    // Apply historical performance boost
    leviScore += confidenceBoost;
    
    // Market condition modifiers
    if (marketConditions.volumeSpike) leviScore += 3;
    if (marketConditions.sentimentScore > 0.7) leviScore += 2;
    if (marketConditions.sentimentScore < 0.3) leviScore -= 2;
    
    // Ensure score is between 0-100
    return Math.max(0, Math.min(100, Math.round(leviScore)));
  }
}
