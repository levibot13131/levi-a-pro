
export class SignalOutcomeTracker {
  private outcomes: Map<string, any[]> = new Map();
  private strategyPerformance: Map<string, any> = new Map();

  public trackOutcome(signalId: string, outcome: any) {
    const strategy = outcome.strategy || 'unknown';
    
    if (!this.outcomes.has(strategy)) {
      this.outcomes.set(strategy, []);
    }
    
    this.outcomes.get(strategy)?.push({
      signalId,
      timestamp: Date.now(),
      ...outcome
    });
    
    this.updateStrategyPerformance(strategy);
  }

  private updateStrategyPerformance(strategy: string) {
    const outcomes = this.outcomes.get(strategy) || [];
    const successfulOutcomes = outcomes.filter(o => o.success);
    const successRate = outcomes.length > 0 ? successfulOutcomes.length / outcomes.length : 0;
    
    this.strategyPerformance.set(strategy, {
      totalSignals: outcomes.length,
      successfulSignals: successfulOutcomes.length,
      successRate,
      weight: Math.max(0.1, Math.min(1.0, successRate))
    });
  }

  public getAdaptiveWeights(): Record<string, number> {
    const weights: Record<string, number> = {};
    
    for (const [strategy, performance] of this.strategyPerformance) {
      weights[strategy] = performance.weight;
    }
    
    return weights;
  }

  public getLearningInsights() {
    return {
      totalStrategiesTracked: this.strategyPerformance.size,
      totalOutcomesRecorded: Array.from(this.outcomes.values()).flat().length,
      lastUpdate: Date.now()
    };
  }

  public getStrategyPerformance() {
    return Object.fromEntries(this.strategyPerformance);
  }
}

export const signalOutcomeTracker = new SignalOutcomeTracker();
