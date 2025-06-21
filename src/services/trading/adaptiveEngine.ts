import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface StrategyPerformance {
  strategy_id: string;
  strategy_name: string;
  total_signals: number;
  successful_signals: number;
  failed_signals: number;
  success_rate: number;
  avg_profit_loss: number;
  current_weight: number;
  confidence_score: number;
  last_updated: Date;
  time_of_day_performance: Record<string, number>;
}

export interface SignalFeedback {
  signal_id: string;
  strategy_used: string;
  outcome: 'win' | 'loss' | 'break_even';
  profit_loss_percentage: number;
  execution_time: Date;
  market_conditions: string;
}

export interface AdaptiveLearningStats {
  overallWinRate: number;
  avgRiskReward: number;
  bestStrategy: string;
  worstStrategy: string;
  improvementTrend: 'improving' | 'declining' | 'stable';
  totalSignalsProcessed: number;
  learningConfidence: number;
}

// Type definitions for RPC responses
interface PerformanceDataRow {
  outcome: string;
  profit_loss_percentage: number;
  execution_time: string;
}

interface StrategyWeightRow {
  current_weight: number;
}

interface StrategyPerformanceRow {
  success_rate: number;
  avg_profit_loss: number;
  total_signals: number;
}

class AdaptiveEngine {
  private learningRate = 0.1;
  private minSignalsForAdjustment = 10;
  private maxWeight = 1.0;
  private minWeight = 0.1;

  async recordSignalFeedback(feedback: SignalFeedback): Promise<void> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Store feedback directly in signal_feedback table
      const { error } = await supabase
        .from('signal_feedback')
        .insert([{
          user_id: user.id,
          signal_id: feedback.signal_id,
          strategy_used: feedback.strategy_used,
          outcome: feedback.outcome,
          profit_loss_percentage: feedback.profit_loss_percentage,
          execution_time: feedback.execution_time.toISOString(),
          market_conditions: feedback.market_conditions
        }]);

      if (error) {
        console.error('Error recording signal feedback:', error);
        return;
      }

      // Trigger strategy weight adjustment
      await this.adjustStrategyWeights(feedback.strategy_used);
      
      console.log(`📊 Signal feedback recorded: ${feedback.outcome} for ${feedback.strategy_used}`);
      
    } catch (error) {
      console.error('Error in recordSignalFeedback:', error);
    }
  }

  async adjustStrategyWeights(strategyName: string): Promise<void> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get strategy performance data directly from signal_feedback table
      const { data: performanceData, error } = await supabase
        .from('signal_feedback')
        .select('outcome, profit_loss_percentage, execution_time')
        .eq('user_id', user.id)
        .eq('strategy_used', strategyName)
        .order('execution_time', { ascending: false })
        .limit(50);

      if (error || !performanceData || performanceData.length < this.minSignalsForAdjustment) {
        console.log(`Not enough data for ${strategyName} adjustment (${performanceData?.length || 0} signals)`);
        return;
      }

      // Calculate performance metrics
      const totalSignals = performanceData.length;
      const successfulSignals = performanceData.filter(f => f.outcome === 'win').length;
      const successRate = successfulSignals / totalSignals;
      const avgProfitLoss = performanceData.reduce((sum, f) => sum + (f.profit_loss_percentage || 0), 0) / totalSignals;

      // Calculate time-of-day performance
      const timePerformance = this.calculateTimeOfDayPerformance(performanceData);

      // Adjust weight based on performance
      let newWeight = await this.calculateNewWeight(strategyName, successRate, avgProfitLoss);
      
      // SPECIAL RULE: Almog's personal strategy ALWAYS maintains priority
      if (strategyName === 'almog-personal-method') {
        newWeight = Math.max(newWeight, 0.8); // Minimum 80% weight for personal strategy
        console.log(`🧠 Almog's personal strategy weight maintained at ${newWeight} (priority protection)`);
      }

      // Update strategy performance
      const { error: updateError } = await supabase
        .from('strategy_performance')
        .upsert({
          user_id: user.id,
          strategy_id: strategyName,
          strategy_name: strategyName,
          total_signals: totalSignals,
          successful_signals: successfulSignals,
          failed_signals: totalSignals - successfulSignals,
          success_rate: successRate,
          avg_profit_loss: avgProfitLoss,
          current_weight: newWeight,
          confidence_score: this.calculateConfidenceScore(successRate, avgProfitLoss),
          time_of_day_performance: timePerformance,
          last_updated: new Date().toISOString()
        });

      if (updateError) {
        console.error('Error updating strategy performance:', updateError);
      } else {
        console.log(`📈 Strategy weight adjusted: ${strategyName} → ${newWeight.toFixed(2)} (${(successRate * 100).toFixed(1)}% success)`);
        
        // Notify user if significant change
        if (Math.abs(newWeight - 0.5) > 0.2) {
          toast.success(`🎯 אסטרטגיה מותאמת: ${strategyName}`, {
            description: `שיעור הצלחה: ${(successRate * 100).toFixed(1)}% | משקל חדש: ${(newWeight * 100).toFixed(0)}%`,
            duration: 8000,
          });
        }
      }

    } catch (error) {
      console.error('Error in adjustStrategyWeights:', error);
    }
  }

  private calculateTimeOfDayPerformance(feedbackData: any[]): Record<string, number> {
    const hourlyPerformance: Record<string, { wins: number; total: number }> = {};
    
    feedbackData.forEach(feedback => {
      const hour = new Date(feedback.execution_time).getHours();
      const hourKey = `${hour}:00`;
      
      if (!hourlyPerformance[hourKey]) {
        hourlyPerformance[hourKey] = { wins: 0, total: 0 };
      }
      
      hourlyPerformance[hourKey].total++;
      if (feedback.outcome === 'win') {
        hourlyPerformance[hourKey].wins++;
      }
    });

    const result: Record<string, number> = {};
    Object.entries(hourlyPerformance).forEach(([hour, stats]) => {
      result[hour] = stats.total > 0 ? stats.wins / stats.total : 0;
    });

    return result;
  }

  private async calculateNewWeight(strategyName: string, successRate: number, avgProfitLoss: number): Promise<number> {
    try {
      // Get current weight from strategy_performance table
      const { data: currentPerf } = await supabase
        .from('strategy_performance')
        .select('current_weight')
        .eq('strategy_id', strategyName)
        .single();

      const currentWeight = currentPerf?.current_weight || 0.5;

      // Calculate adjustment based on performance
      let adjustment = 0;
      
      // Success rate adjustment
      if (successRate > 0.7) {
        adjustment += this.learningRate * 0.2; // Increase weight for high success
      } else if (successRate < 0.4) {
        adjustment -= this.learningRate * 0.3; // Decrease weight for low success
      }

      // Profit/Loss adjustment
      if (avgProfitLoss > 2.0) {
        adjustment += this.learningRate * 0.15; // Reward high profit
      } else if (avgProfitLoss < -1.0) {
        adjustment -= this.learningRate * 0.25; // Penalize high loss
      }

      // Apply adjustment
      const newWeight = Math.max(this.minWeight, Math.min(this.maxWeight, currentWeight + adjustment));
      
      return newWeight;
    } catch (error) {
      console.error('Error calculating new weight:', error);
      return 0.5; // Default weight
    }
  }

  private calculateConfidenceScore(successRate: number, avgProfitLoss: number): number {
    // Confidence score based on success rate and profit/loss ratio
    const successWeight = successRate * 0.7;
    const profitWeight = Math.max(0, Math.min(1, (avgProfitLoss + 5) / 10)) * 0.3;
    
    return Math.min(0.95, successWeight + profitWeight); // Max 95% as per Almog's rule
  }

  async getStrategyPerformance(): Promise<StrategyPerformance[]> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data: rawData, error } = await supabase
        .from('strategy_performance')
        .select('*')
        .eq('user_id', user.id);

      if (error) {
        console.error('Error fetching strategy performance:', error);
        return [];
      }

      // Fixed: Properly parse time_of_day_performance JSON and convert last_updated to Date
      return (rawData || []).map(d => ({
        strategy_id: d.strategy_id,
        strategy_name: d.strategy_name,
        total_signals: d.total_signals,
        successful_signals: d.successful_signals,
        failed_signals: d.failed_signals,
        success_rate: d.success_rate,
        avg_profit_loss: d.avg_profit_loss,
        current_weight: d.current_weight,
        confidence_score: d.confidence_score,
        last_updated: new Date(d.last_updated),
        time_of_day_performance: typeof d.time_of_day_performance === 'string' 
          ? JSON.parse(d.time_of_day_performance) 
          : (d.time_of_day_performance as Record<string, number> || {})
      }));
    } catch (error) {
      console.error('Error in getStrategyPerformance:', error);
      return [];
    }
  }

  async shouldDisableStrategy(strategyName: string): Promise<boolean> {
    // Never disable Almog's personal strategy
    if (strategyName === 'almog-personal-method') {
      return false;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      const { data: performance } = await supabase
        .from('strategy_performance')
        .select('success_rate, avg_profit_loss, total_signals')
        .eq('user_id', user.id)
        .eq('strategy_id', strategyName)
        .single();

      if (!performance) return false;

      // Disable if success rate < 25% and avg loss > -3%
      const shouldDisable = performance.success_rate < 0.25 && 
                           performance.avg_profit_loss < -3.0 && 
                           performance.total_signals >= 20;

      if (shouldDisable) {
        console.log(`⚠️ Strategy ${strategyName} marked for disabling due to poor performance`);
        toast.warning(`אסטרטגיה הושבתה: ${strategyName}`, {
          description: `ביצועים נמוכים: ${(performance.success_rate * 100).toFixed(1)}% הצלחה`,
          duration: 10000,
        });
      }

      return shouldDisable;
    } catch (error) {
      console.error('Error checking strategy disable status:', error);
      return false;
    }
  }

  async getOptimalTradingHours(): Promise<string[]> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data: feedbackData } = await supabase
        .from('signal_feedback')
        .select('execution_time')
        .eq('user_id', user.id)
        .eq('outcome', 'win');

      if (!feedbackData) return [];

      const hourlyWins: Record<number, number> = {};
      feedbackData.forEach(feedback => {
        const hour = new Date(feedback.execution_time).getHours();
        hourlyWins[hour] = (hourlyWins[hour] || 0) + 1;
      });

      // Return top 3 performing hours
      const topHours = Object.entries(hourlyWins)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 3)
        .map(([hour]) =>  `${hour}:00-${(parseInt(hour) + 1) % 24}:00`);

      return topHours;
    } catch (error) {
      console.error('Error getting optimal trading hours:', error);
      return [];
    }
  }

  async getAdaptiveLearningStats(): Promise<AdaptiveLearningStats> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return this.getDefaultStats();
      }

      // Get all strategy performance data
      const strategies = await this.getStrategyPerformance();
      
      if (strategies.length === 0) {
        return this.getDefaultStats();
      }

      // Calculate overall statistics
      const totalSignals = strategies.reduce((sum, s) => sum + s.total_signals, 0);
      const totalWins = strategies.reduce((sum, s) => sum + s.successful_signals, 0);
      const overallWinRate = totalSignals > 0 ? totalWins / totalSignals : 0;

      // Calculate average risk/reward
      const avgRiskReward = strategies.reduce((sum, s) => sum + s.avg_profit_loss, 0) / strategies.length;

      // Find best and worst performing strategies
      const sortedByWinRate = strategies.sort((a, b) => b.success_rate - a.success_rate);
      const bestStrategy = sortedByWinRate[0]?.strategy_name || 'Unknown';
      const worstStrategy = sortedByWinRate[sortedByWinRate.length - 1]?.strategy_name || 'Unknown';

      // Determine improvement trend (simplified logic)
      const improvementTrend = overallWinRate >= 0.6 ? 'improving' : 
                             overallWinRate >= 0.4 ? 'stable' : 'declining';

      return {
        overallWinRate,
        avgRiskReward,
        bestStrategy,
        worstStrategy,
        improvementTrend,
        totalSignalsProcessed: totalSignals,
        learningConfidence: Math.min(0.95, overallWinRate * 1.2) // Cap at 95%
      };

    } catch (error) {
      console.error('Error getting adaptive learning stats:', error);
      return this.getDefaultStats();
    }
  }

  private getDefaultStats(): AdaptiveLearningStats {
    return {
      overallWinRate: 0.0,
      avgRiskReward: 0.0,
      bestStrategy: 'No data',
      worstStrategy: 'No data',
      improvementTrend: 'stable',
      totalSignalsProcessed: 0,
      learningConfidence: 0.0
    };
  }
}

export const adaptiveEngine = new AdaptiveEngine();
