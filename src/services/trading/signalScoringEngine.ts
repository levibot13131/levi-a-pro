
export class SignalScoringEngine {
  private static dailyStats = {
    totalSignalsAnalyzed: 0,
    signalsPassedFilter: 0,
    averageScore: 0,
    topScore: 0,
    rejectionRate: 0
  };

  public static getDailyStats() {
    return {
      ...this.dailyStats,
      totalSent: this.dailyStats.signalsPassedFilter,
      intelligenceEnhanced: this.dailyStats.signalsPassedFilter
    };
  }

  public static updateStats(analyzed: number, passed: number, avgScore: number, topScore: number) {
    this.dailyStats.totalSignalsAnalyzed = analyzed;
    this.dailyStats.signalsPassedFilter = passed;
    this.dailyStats.averageScore = avgScore;
    this.dailyStats.topScore = topScore;
    this.dailyStats.rejectionRate = analyzed > 0 ? ((analyzed - passed) / analyzed) * 100 : 0;
  }

  public static getScoreThreshold(): number {
    return 70; // Minimum score threshold
  }

  public static scoreSignal(signal: any) {
    let score = 0;
    
    // Risk/Reward ratio scoring (×2.0 multiplier)
    score += signal.riskRewardRatio * 20;
    
    // Confidence scoring (×1.5 multiplier)
    score += signal.confidence * 75;
    
    // Strategy bonus
    if (signal.strategy === 'almog-personal-method') {
      score += 25;
    }
    
    // Timing bonus
    const hour = new Date().getHours();
    if (hour >= 8 && hour <= 16) { // Market hours
      score += 10;
    }

    const qualityRating = this.determineQualityRating(score);
    
    return {
      signal,
      score: {
        total: Math.round(score),
        riskReward: signal.riskRewardRatio * 20,
        confidence: signal.confidence * 75,
        strategyBonus: signal.strategy === 'almog-personal-method' ? 25 : 0,
        timingBonus: hour >= 8 && hour <= 16 ? 10 : 0
      },
      qualityRating,
      shouldSend: score >= this.getScoreThreshold()
    };
  }

  public static determineQualityRating(score: number): 'ELITE' | 'HIGH' | 'MEDIUM' | 'LOW' {
    if (score >= 90) return 'ELITE';
    if (score >= 75) return 'HIGH';
    if (score >= 60) return 'MEDIUM';
    return 'LOW';
  }
}
