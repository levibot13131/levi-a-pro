
export class EliteSignalFilter {
  private static instance: EliteSignalFilter;
  private config = {
    maxSignalsPerDay: 5,
    maxSignalsPerSession: 3,
    requiredConfidence: 0.85,
    requiredRiskReward: 2.5
  };
  
  private dailySignals = 0;
  private sessionSignals = 0;

  public static getInstance(): EliteSignalFilter {
    if (!EliteSignalFilter.instance) {
      EliteSignalFilter.instance = new EliteSignalFilter();
    }
    return EliteSignalFilter.instance;
  }

  public getEliteStats() {
    return {
      dailySignals: this.dailySignals,
      sessionSignals: this.sessionSignals,
      config: this.config
    };
  }

  public shouldAllowSignal(confidence: number, riskReward: number): boolean {
    return confidence >= this.config.requiredConfidence && 
           riskReward >= this.config.requiredRiskReward &&
           this.dailySignals < this.config.maxSignalsPerDay &&
           this.sessionSignals < this.config.maxSignalsPerSession;
  }

  public recordSignal() {
    this.dailySignals++;
    this.sessionSignals++;
  }
}

export const eliteSignalFilter = EliteSignalFilter.getInstance();
