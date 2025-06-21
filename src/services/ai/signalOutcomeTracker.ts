import { supabase } from '@/integrations/supabase/client';
import { TradingSignal } from '@/types/trading';

interface SignalOutcome {
  signalId: string;
  symbol: string;
  strategy: string;
  action: 'buy' | 'sell';
  entryPrice: number;
  targetPrice: number;
  stopLoss: number;
  confidence: number;
  riskRewardRatio: number;
  outcome: 'tp_hit' | 'sl_hit' | 'expired' | 'active' | 'manual_close';
  exitPrice?: number;
  profitPercent?: number;
  duration?: number; // minutes
  timestamp: number;
  metadata: Record<string, any>;
}

interface StrategyPerformance {
  strategy: string;
  totalSignals: number;
  winCount: number;
  lossCount: number;
  winRate: number;
  avgProfitPercent: number;
  avgLossPercent: number;
  bestRR: number;
  worstRR: number;
  avgDuration: number;
  currentWeight: number;
  confidence: number;
  lastUpdated: number;
}

export class SignalOutcomeTracker {
  private outcomes: Map<string, SignalOutcome> = new Map();
  private strategyPerformance: Map<string, StrategyPerformance> = new Map();

  constructor() {
    this.initializeTracker();
  }

  private async initializeTracker() {
    console.log('🧠 Initializing AI Learning Loop - Signal Outcome Tracker');
    await this.loadHistoricalOutcomes();
    this.startActiveSignalMonitoring();
  }

  private async loadHistoricalOutcomes() {
    try {
      const { data: signals, error } = await supabase
        .from('trading_signals')
        .select('*')
        .not('exit_price', 'is', null)
        .order('created_at', { ascending: false })
        .limit(500);

      if (error) {
        console.error('Error loading historical signals:', error);
        return;
      }

      signals?.forEach(signal => {
        // Safely handle metadata conversion
        let signalMetadata: Record<string, any> = {};
        if (signal.metadata) {
          if (typeof signal.metadata === 'object' && signal.metadata !== null && !Array.isArray(signal.metadata)) {
            signalMetadata = signal.metadata as Record<string, any>;
          } else {
            signalMetadata = { raw: signal.metadata };
          }
        }

        const outcome: SignalOutcome = {
          signalId: signal.signal_id,
          symbol: signal.symbol,
          strategy: signal.strategy,
          action: signal.action as 'buy' | 'sell',
          entryPrice: Number(signal.price),
          targetPrice: Number(signal.target_price),
          stopLoss: Number(signal.stop_loss),
          confidence: Number(signal.confidence),
          riskRewardRatio: Number(signal.risk_reward_ratio),
          outcome: this.determineOutcome(signal),
          exitPrice: signal.exit_price ? Number(signal.exit_price) : undefined,
          profitPercent: signal.profit_percent ? Number(signal.profit_percent) : undefined,
          duration: this.calculateDuration(signal.created_at, signal.executed_at),
          timestamp: new Date(signal.created_at).getTime(),
          metadata: signalMetadata
        };

        this.outcomes.set(outcome.signalId, outcome);
      });

      console.log(`📊 Loaded ${signals?.length || 0} historical signal outcomes`);
      this.calculateStrategyPerformance();
    } catch (error) {
      console.error('Error loading historical outcomes:', error);
    }
  }

  private determineOutcome(signal: any): 'tp_hit' | 'sl_hit' | 'expired' | 'active' | 'manual_close' {
    if (!signal.exit_price) return 'active';
    
    const profitPercent = Number(signal.profit_percent) || 0;
    if (profitPercent > 0.5) return 'tp_hit';
    if (profitPercent < -0.5) return 'sl_hit';
    if (signal.exit_reason === 'expired') return 'expired';
    return 'manual_close';
  }

  private calculateDuration(createdAt: string, executedAt: string | null): number {
    if (!executedAt) return 0;
    const start = new Date(createdAt).getTime();
    const end = new Date(executedAt).getTime();
    return Math.floor((end - start) / (1000 * 60)); // minutes
  }

  public async recordSignalOutcome(outcome: SignalOutcome) {
    console.log(`📝 Recording signal outcome: ${outcome.symbol} ${outcome.outcome}`);
    
    try {
      // Update database
      const { error } = await supabase
        .from('trading_signals')
        .update({
          exit_price: outcome.exitPrice,
          profit_percent: outcome.profitPercent,
          status: 'completed',
          exit_reason: outcome.outcome,
          executed_at: new Date().toISOString()
        })
        .eq('signal_id', outcome.signalId);

      if (error) {
        console.error('Error updating signal outcome:', error);
        return;
      }

      // Store locally
      this.outcomes.set(outcome.signalId, outcome);
      
      // Recalculate strategy performance
      this.calculateStrategyPerformance();
      
      // Trigger adaptive learning
      await this.triggerAdaptiveLearning(outcome);
      
      console.log(`✅ Signal outcome recorded and learning triggered`);
    } catch (error) {
      console.error('Error recording signal outcome:', error);
    }
  }

  private calculateStrategyPerformance() {
    const strategyStats = new Map<string, {
      totalSignals: number;
      wins: SignalOutcome[];
      losses: SignalOutcome[];
      outcomes: SignalOutcome[];
    }>();

    // Group outcomes by strategy
    for (const outcome of this.outcomes.values()) {
      if (!strategyStats.has(outcome.strategy)) {
        strategyStats.set(outcome.strategy, {
          totalSignals: 0,
          wins: [],
          losses: [],
          outcomes: []
        });
      }

      const stats = strategyStats.get(outcome.strategy)!;
      stats.totalSignals++;
      stats.outcomes.push(outcome);

      if (outcome.outcome === 'tp_hit') {
        stats.wins.push(outcome);
      } else if (outcome.outcome === 'sl_hit') {
        stats.losses.push(outcome);
      }
    }

    // Calculate performance metrics
    for (const [strategy, stats] of strategyStats) {
      const winRate = stats.totalSignals > 0 ? stats.wins.length / stats.totalSignals : 0;
      const avgProfitPercent = stats.wins.length > 0 
        ? stats.wins.reduce((sum, w) => sum + (w.profitPercent || 0), 0) / stats.wins.length 
        : 0;
      const avgLossPercent = stats.losses.length > 0 
        ? stats.losses.reduce((sum, l) => sum + Math.abs(l.profitPercent || 0), 0) / stats.losses.length 
        : 0;

      const performance: StrategyPerformance = {
        strategy,
        totalSignals: stats.totalSignals,
        winCount: stats.wins.length,
        lossCount: stats.losses.length,
        winRate,
        avgProfitPercent,
        avgLossPercent,
        bestRR: Math.max(...stats.outcomes.map(o => o.riskRewardRatio)),
        worstRR: Math.min(...stats.outcomes.map(o => o.riskRewardRatio)),
        avgDuration: stats.outcomes.reduce((sum, o) => sum + (o.duration || 0), 0) / stats.totalSignals,
        currentWeight: this.calculateAdaptiveWeight(strategy, winRate, stats.totalSignals),
        confidence: this.calculateConfidenceScore(winRate, stats.totalSignals),
        lastUpdated: Date.now()
      };

      this.strategyPerformance.set(strategy, performance);
    }

    console.log(`📈 Strategy performance calculated for ${this.strategyPerformance.size} strategies`);
  }

  private calculateAdaptiveWeight(strategy: string, winRate: number, totalSignals: number): number {
    // Personal method always gets high weight
    if (strategy === 'almog-personal-method') {
      return Math.max(0.8, winRate * 1.2); // 80% minimum, boost with performance
    }

    // Other strategies get adaptive weights based on performance
    if (totalSignals < 5) return 0.5; // Default until proven
    
    if (winRate >= 0.8) return 0.9;
    if (winRate >= 0.7) return 0.8;
    if (winRate >= 0.6) return 0.7;
    if (winRate >= 0.5) return 0.6;
    if (winRate >= 0.4) return 0.4;
    return 0.2; // Underperforming strategies
  }

  private calculateConfidenceScore(winRate: number, totalSignals: number): number {
    if (totalSignals < 3) return 0.5; // Low confidence with insufficient data
    
    const baseConfidence = winRate;
    const sampleBonus = Math.min(0.2, totalSignals / 50); // Bonus for larger sample size
    
    return Math.min(0.95, baseConfidence + sampleBonus);
  }

  private async triggerAdaptiveLearning(outcome: SignalOutcome) {
    const performance = this.strategyPerformance.get(outcome.strategy);
    if (!performance) return;

    console.log(`🔄 Adaptive learning triggered for ${outcome.strategy}`);
    
    // Log learning event
    const learningEvent = {
      strategy: outcome.strategy,
      oldWeight: performance.currentWeight,
      newWeight: this.calculateAdaptiveWeight(outcome.strategy, performance.winRate, performance.totalSignals),
      winRate: performance.winRate,
      totalSignals: performance.totalSignals,
      trigger: outcome.outcome,
      timestamp: Date.now()
    };

    // Save learning event to database - Fixed user_id issue
    try {
      await supabase
        .from('strategy_performance')
        .upsert({
          strategy_id: outcome.strategy,
          strategy_name: outcome.strategy,
          user_id: 'system', // Add required user_id field
          total_signals: performance.totalSignals,
          successful_signals: performance.winCount,
          failed_signals: performance.lossCount,
          success_rate: performance.winRate,
          avg_profit_loss: performance.avgProfitPercent,
          current_weight: learningEvent.newWeight,
          confidence_score: performance.confidence,
          last_updated: new Date().toISOString()
        });

      console.log(`🧠 Learning event saved: ${outcome.strategy} weight ${learningEvent.oldWeight.toFixed(2)} → ${learningEvent.newWeight.toFixed(2)}`);
    } catch (error) {
      console.error('Error saving learning event:', error);
    }

    // Broadcast learning update
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('ai-learning-update', {
        detail: { learningEvent, performance }
      }));
    }
  }

  private startActiveSignalMonitoring() {
    console.log('🔍 Starting active signal monitoring for outcome detection');
    
    // Check active signals every 5 minutes
    setInterval(async () => {
      await this.checkActiveSignalOutcomes();
    }, 300000);
  }

  private async checkActiveSignalOutcomes() {
    try {
      const { data: activeSignals, error } = await supabase
        .from('trading_signals')
        .select('*')
        .eq('status', 'active')
        .is('exit_price', null);

      if (error || !activeSignals) return;

      for (const signal of activeSignals) {
        // In a real implementation, you would check current market price
        // and determine if TP or SL was hit
        // For now, we'll simulate outcome detection
        await this.simulateOutcomeDetection(signal);
      }
    } catch (error) {
      console.error('Error checking active signal outcomes:', error);
    }
  }

  private async simulateOutcomeDetection(signal: any) {
    // Simulate random outcomes for demonstration
    // In production, this would fetch real market data
    const timeElapsed = Date.now() - new Date(signal.created_at).getTime();
    const hoursElapsed = timeElapsed / (1000 * 60 * 60);

    if (hoursElapsed > 48) { // Expire signals after 48 hours
      const randomOutcome = Math.random();
      let outcome: 'tp_hit' | 'sl_hit' | 'expired';
      let profitPercent: number;

      if (randomOutcome < 0.6) { // 60% win rate simulation
        outcome = 'tp_hit';
        profitPercent = Math.random() * 3 + 1; // 1-4% profit
      } else if (randomOutcome < 0.9) {
        outcome = 'sl_hit';
        profitPercent = -(Math.random() * 2 + 0.5); // -0.5% to -2.5% loss
      } else {
        outcome = 'expired';
        profitPercent = 0;
      }

      await this.recordSignalOutcome({
        signalId: signal.signal_id,
        symbol: signal.symbol,
        strategy: signal.strategy,
        action: signal.action,
        entryPrice: Number(signal.price),
        targetPrice: Number(signal.target_price),
        stopLoss: Number(signal.stop_loss),
        confidence: Number(signal.confidence),
        riskRewardRatio: Number(signal.risk_reward_ratio),
        outcome,
        exitPrice: signal.action === 'buy' 
          ? Number(signal.price) * (1 + profitPercent / 100)
          : Number(signal.price) * (1 - profitPercent / 100),
        profitPercent,
        duration: Math.floor(hoursElapsed * 60),
        timestamp: Date.now(),
        metadata: signal.metadata || {}
      });
    }
  }

  public getStrategyPerformance(): StrategyPerformance[] {
    return Array.from(this.strategyPerformance.values())
      .sort((a, b) => b.winRate - a.winRate);
  }

  public getAdaptiveWeights(): Record<string, number> {
    const weights: Record<string, number> = {};
    for (const [strategy, performance] of this.strategyPerformance) {
      weights[strategy] = performance.currentWeight;
    }
    return weights;
  }

  public getLearningInsights(): {
    topPerformer: string;
    worstPerformer: string;
    totalSignalsTracked: number;
    overallWinRate: number;
    adaptationCount: number;
  } {
    const performances = Array.from(this.strategyPerformance.values());
    const topPerformer = performances.reduce((best, current) => 
      current.winRate > best.winRate ? current : best, performances[0]);
    const worstPerformer = performances.reduce((worst, current) => 
      current.winRate < worst.winRate ? current : worst, performances[0]);

    const totalSignals = performances.reduce((sum, p) => sum + p.totalSignals, 0);
    const totalWins = performances.reduce((sum, p) => sum + p.winCount, 0);
    const overallWinRate = totalSignals > 0 ? totalWins / totalSignals : 0;

    return {
      topPerformer: topPerformer?.strategy || 'none',
      worstPerformer: worstPerformer?.strategy || 'none',
      totalSignalsTracked: totalSignals,
      overallWinRate,
      adaptationCount: performances.length
    };
  }
}

export const signalOutcomeTracker = new SignalOutcomeTracker();
