
export interface StrategyOutcome {
  signalId: string;
  timestamp: number;
  strategy: string;
  success: boolean;
  profitPercent?: number;
  duration?: number;
}

export interface StrategyPerformanceMetrics {
  totalSignals: number;
  successfulSignals: number;
  successRate: number;
  weight: number;
  avgProfitPercent?: number;
  avgLossPercent?: number;
  avgDuration?: number;
}

export interface LearningInsights {
  totalStrategiesTracked: number;
  totalOutcomesRecorded: number;
  lastUpdate: number;
}

export class SignalOutcomeTracker {
  private outcomes: Map<string, StrategyOutcome[]> = new Map();
  private strategyPerformance: Map<string, StrategyPerformanceMetrics> = new Map();

  public trackOutcome(signalId: string, outcome: Partial<StrategyOutcome> & { strategy: string; success: boolean }) {
    const strategy = outcome.strategy || 'unknown';
    
    if (!this.outcomes.has(strategy)) {
      this.outcomes.set(strategy, []);
    }
    
    const fullOutcome: StrategyOutcome = {
      signalId,
      timestamp: Date.now(),
      strategy,
      success: outcome.success,
      profitPercent: outcome.profitPercent,
      duration: outcome.duration,
      ...outcome
    };
    
    this.outcomes.get(strategy)?.push(fullOutcome);
    this.updateStrategyPerformance(strategy);
    
    // Dispatch learning update event
    window.dispatchEvent(new CustomEvent('ai-learning-update'));
  }

  private updateStrategyPerformance(strategy: string) {
    const outcomes = this.outcomes.get(strategy) || [];
    const successfulOutcomes = outcomes.filter(o => o.success);
    const successRate = outcomes.length > 0 ? successfulOutcomes.length / outcomes.length : 0;
    
    // Calculate additional metrics
    const profitOutcomes = successfulOutcomes.filter(o => o.profitPercent !== undefined);
    const lossOutcomes = outcomes.filter(o => !o.success && o.profitPercent !== undefined);
    
    const avgProfitPercent = profitOutcomes.length > 0 
      ? profitOutcomes.reduce((sum, o) => sum + (o.profitPercent || 0), 0) / profitOutcomes.length 
      : undefined;
      
    const avgLossPercent = lossOutcomes.length > 0 
      ? Math.abs(lossOutcomes.reduce((sum, o) => sum + (o.profitPercent || 0), 0) / lossOutcomes.length)
      : undefined;
      
    const avgDuration = outcomes.filter(o => o.duration).length > 0
      ? outcomes.filter(o => o.duration).reduce((sum, o) => sum + (o.duration || 0), 0) / outcomes.filter(o => o.duration).length
      : undefined;
    
    this.strategyPerformance.set(strategy, {
      totalSignals: outcomes.length,
      successfulSignals: successfulOutcomes.length,
      successRate,
      weight: Math.max(0.1, Math.min(1.0, successRate)),
      avgProfitPercent,
      avgLossPercent,
      avgDuration
    });
  }

  public getAdaptiveWeights(): Record<string, number> {
    const weights: Record<string, number> = {};
    
    for (const [strategy, performance] of this.strategyPerformance) {
      weights[strategy] = performance.weight;
    }
    
    // Ensure personal method always has minimum weight
    if (!weights['almog-personal-method']) {
      weights['almog-personal-method'] = 0.8;
    }
    
    return weights;
  }

  public getLearningInsights(): LearningInsights {
    return {
      totalStrategiesTracked: this.strategyPerformance.size,
      totalOutcomesRecorded: Array.from(this.outcomes.values()).flat().length,
      lastUpdate: Date.now()
    };
  }

  public getStrategyPerformance(): Record<string, StrategyPerformanceMetrics> {
    return Object.fromEntries(this.strategyPerformance);
  }

  // Method to simulate some initial data for demonstration
  public initializeDemoData() {
    // Add some demo outcomes for the personal method
    this.trackOutcome('demo-1', {
      strategy: 'almog-personal-method',
      success: true,
      profitPercent: 2.5,
      duration: 120
    });
    
    this.trackOutcome('demo-2', {
      strategy: 'almog-personal-method',
      success: true,
      profitPercent: 1.8,
      duration: 90
    });
    
    this.trackOutcome('demo-3', {
      strategy: 'technical-analysis',
      success: false,
      profitPercent: -1.2,
      duration: 45
    });
  }
}

export const signalOutcomeTracker = new SignalOutcomeTracker();

// Initialize with some demo data for development
if (process.env.NODE_ENV === 'development') {
  signalOutcomeTracker.initializeDemoData();
}
