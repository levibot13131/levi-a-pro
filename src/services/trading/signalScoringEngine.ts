
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
}
