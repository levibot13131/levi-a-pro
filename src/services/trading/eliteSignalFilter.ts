
export class EliteSignalFilter {
  private static instance: EliteSignalFilter;
  private config = {
    maxConcurrentSignals: 10, // Maximum concurrent elite signals
    requiredConfidence: 0.90, // Increased for elite quality
    requiredRiskReward: 3.0, // Higher R/R for premium signals
    minStrategyScore: 85, // Minimum combined strategy score
    requiredTimeframeAlignment: 3 // At least 3 timeframes must align
  };
  
  private activeSignals = 0;
  private totalAnalyzed = 0;
  private lastResetTime = Date.now();

  public static getInstance(): EliteSignalFilter {
    if (!EliteSignalFilter.instance) {
      EliteSignalFilter.instance = new EliteSignalFilter();
    }
    return EliteSignalFilter.instance;
  }

  public getEliteStats() {
    return {
      activeSignals: this.activeSignals,
      totalAnalyzed: this.totalAnalyzed,
      config: this.config,
      qualityRate: this.totalAnalyzed > 0 ? (this.activeSignals / this.totalAnalyzed) * 100 : 0
    };
  }

  public shouldAllowSignal(confidence: number, riskReward: number, strategyScore: number = 0, timeframeAlignment: number = 0): boolean {
    this.totalAnalyzed++;
    
    // Quality-first approach - no daily limits, focus on excellence
    return confidence >= this.config.requiredConfidence && 
           riskReward >= this.config.requiredRiskReward &&
           strategyScore >= this.config.minStrategyScore &&
           timeframeAlignment >= this.config.requiredTimeframeAlignment &&
           this.activeSignals < this.config.maxConcurrentSignals;
  }

  public recordSignal() {
    this.activeSignals++;
  }

  public signalClosed() {
    this.activeSignals = Math.max(0, this.activeSignals - 1);
  }

  // Continuous learning and analysis - never stops
  public getContinuousAnalysisMode(): boolean {
    return true; // Always analyze and learn
  }
}

export const eliteSignalFilter = EliteSignalFilter.getInstance();
