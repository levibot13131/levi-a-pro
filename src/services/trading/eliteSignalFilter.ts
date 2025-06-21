
interface EliteFilterConfig {
  maxSignalsPerSession: number;
  maxSignalsPerHour: number;
  maxSignalsPerDay: number;
  sessionDurationHours: number;
  requiredConfidence: number;
  requiredRiskReward: number;
}

interface EliteStats {
  dailySignals: number;
  sessionSignals: number;
  hourlySignals: number;
  totalEliteSignals: number;
  sessionStart: number;
  lastSignalTime: number;
}

class EliteSignalFilter {
  private config: EliteFilterConfig = {
    maxSignalsPerSession: 8, // Increased from 2
    maxSignalsPerHour: 4, // Increased from 1
    maxSignalsPerDay: 20, // Increased from 5
    sessionDurationHours: 4,
    requiredConfidence: 0.75,
    requiredRiskReward: 1.8
  };

  private stats: EliteStats = {
    dailySignals: 0,
    sessionSignals: 0,
    hourlySignals: 0,
    totalEliteSignals: 0,
    sessionStart: Date.now(),
    lastSignalTime: 0
  };

  private sentSignals = new Set<string>();
  private dailyReset = Date.now();
  private sessionReset = Date.now();
  private hourlyReset = Date.now();

  public validateEliteSignal(signal: any): { valid: boolean; reason?: string } {
    const now = Date.now();
    
    // Reset counters based on time
    this.resetCountersIfNeeded(now);

    // Personal method gets priority and bypasses some limits
    const isPersonalMethod = signal.strategy === 'almog-personal-method';
    
    // Check for duplicate signals
    const signalKey = `${signal.symbol}-${signal.action}-${Math.floor(signal.price)}`;
    if (this.sentSignals.has(signalKey)) {
      return { valid: false, reason: '❌ Duplicate signal detected' };
    }

    // Basic quality checks
    if (signal.confidence < this.config.requiredConfidence) {
      return { valid: false, reason: `❌ Confidence too low: ${(signal.confidence * 100).toFixed(1)}% < ${(this.config.requiredConfidence * 100)}%` };
    }

    if (signal.riskRewardRatio < this.config.requiredRiskReward) {
      return { valid: false, reason: `❌ R/R too low: ${signal.riskRewardRatio.toFixed(2)} < ${this.config.requiredRiskReward}` };
    }

    // Personal method bypass - only check daily limit for personal method
    if (isPersonalMethod) {
      if (this.stats.dailySignals >= this.config.maxSignalsPerDay) {
        return { valid: false, reason: '❌ Daily signal limit reached (Personal Method)' };
      }
      return { valid: true };
    }

    // Regular limits for other strategies
    if (this.stats.dailySignals >= this.config.maxSignalsPerDay) {
      return { valid: false, reason: `❌ Daily signal limit reached: ${this.stats.dailySignals}/${this.config.maxSignalsPerDay}` };
    }

    if (this.stats.sessionSignals >= this.config.maxSignalsPerSession) {
      return { valid: false, reason: `❌ Session signal limit reached: ${this.stats.sessionSignals}/${this.config.maxSignalsPerSession}` };
    }

    if (this.stats.hourlySignals >= this.config.maxSignalsPerHour) {
      return { valid: false, reason: `❌ Hourly signal limit reached: ${this.stats.hourlySignals}/${this.config.maxSignalsPerHour}` };
    }

    return { valid: true };
  }

  public approveEliteSignal(signal: any): void {
    const now = Date.now();
    const signalKey = `${signal.symbol}-${signal.action}-${Math.floor(signal.price)}`;
    
    this.sentSignals.add(signalKey);
    this.stats.dailySignals++;
    this.stats.sessionSignals++;
    this.stats.hourlySignals++;
    this.stats.totalEliteSignals++;
    this.stats.lastSignalTime = now;

    console.log(`✅ Elite signal approved: ${signal.symbol} ${signal.action} (${this.stats.dailySignals}/${this.config.maxSignalsPerDay} daily)`);
  }

  private resetCountersIfNeeded(now: number): void {
    // Reset daily counters
    if (now - this.dailyReset > 24 * 60 * 60 * 1000) {
      this.stats.dailySignals = 0;
      this.sentSignals.clear();
      this.dailyReset = now;
      console.log('🔄 Daily signal counters reset');
    }

    // Reset session counters
    if (now - this.sessionReset > this.config.sessionDurationHours * 60 * 60 * 1000) {
      this.stats.sessionSignals = 0;
      this.sessionReset = now;
      this.stats.sessionStart = now;
      console.log('🔄 Session signal counters reset');
    }

    // Reset hourly counters
    if (now - this.hourlyReset > 60 * 60 * 1000) {
      this.stats.hourlySignals = 0;
      this.hourlyReset = now;
      console.log('🔄 Hourly signal counters reset');
    }
  }

  public getEliteStats(): EliteStats & { config: EliteFilterConfig } {
    return {
      ...this.stats,
      config: this.config
    };
  }

  public adjustLimits(newConfig: Partial<EliteFilterConfig>): void {
    this.config = { ...this.config, ...newConfig };
    console.log('⚙️ Elite filter config updated:', this.config);
  }
}

export const eliteSignalFilter = new EliteSignalFilter();
