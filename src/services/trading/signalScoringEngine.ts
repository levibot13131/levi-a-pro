export interface SignalScoreBreakdown {
  rrScore: number;
  confidenceScore: number;
  potentialScore: number;
  strategyScore: number;
  timeframeBonus: number;
  fundamentalBonus: number;
  conflictPenalty: number;
  personalMethodBonus: number;
  adaptiveBonus?: number;
  total: number;
}

export interface ScoredSignal {
  signal: any;
  score: SignalScoreBreakdown;
  qualityRating: 'ELITE' | 'HIGH' | 'MEDIUM' | 'LOW' | 'REJECTED';
  shouldSend: boolean;
}

export class SignalScoringEngine {
  private static readonly SCORE_THRESHOLD = 160;
  private static readonly PERSONAL_METHOD_BONUS = 25;
  
  // Scoring weights
  private static readonly WEIGHTS = {
    RR_RATIO: 2.0,
    CONFIDENCE: 1.5,
    PROFIT_POTENTIAL: 1.25,
    STRATEGY_SUCCESS: 1.25
  };

  // Strategy success rates (historical data)
  private static readonly STRATEGY_SUCCESS_RATES = {
    'almog-personal-method': 0.942,
    'rsi-macd-confluence': 0.821,
    'smart-money-concepts': 0.789,
    'wyckoff-method': 0.738,
    'triangle-breakout': 0.756,
    'elliott-wave': 0.753,
    'default': 0.65
  };

  public static scoreSignal(signal: any): ScoredSignal {
    const breakdown = this.calculateScoreBreakdown(signal);
    const qualityRating = this.determineQualityRating(breakdown.total);
    const shouldSend = breakdown.total >= this.SCORE_THRESHOLD;

    console.log(`🎯 Signal Scored: ${signal.symbol} ${signal.action} - Score: ${breakdown.total} (${qualityRating})`);
    
    return {
      signal,
      score: breakdown,
      qualityRating,
      shouldSend
    };
  }

  private static calculateScoreBreakdown(signal: any): SignalScoreBreakdown {
    const metadata = signal.metadata || {};
    
    // Base scores using weighted formula
    const rrScore = (signal.riskRewardRatio || 1) * this.WEIGHTS.RR_RATIO;
    const confidenceScore = (signal.confidence || 0.5) * 100 * this.WEIGHTS.CONFIDENCE;
    
    // Calculate profit potential percentage
    const profitPercent = Math.abs((signal.targetPrice - signal.price) / signal.price) * 100;
    const potentialScore = profitPercent * this.WEIGHTS.PROFIT_POTENTIAL;
    
    // Strategy success rate score
    const strategySuccessRate = this.STRATEGY_SUCCESS_RATES[signal.strategy as keyof typeof this.STRATEGY_SUCCESS_RATES] 
      || this.STRATEGY_SUCCESS_RATES.default;
    const strategyScore = strategySuccessRate * 100 * this.WEIGHTS.STRATEGY_SUCCESS;
    
    // Bonuses and penalties
    const timeframeBonus = (metadata.confirmedTimeframes?.length >= 3) ? 10 : 0;
    const fundamentalBonus = metadata.hasFundamentalSupport ? 15 : 0;
    const conflictPenalty = metadata.hasIndicatorConflict ? -15 : 0;
    
    // Special bonus for personal method
    const personalMethodBonus = (signal.strategy === 'almog-personal-method') 
      ? this.PERSONAL_METHOD_BONUS : 0;
    
    const total = Math.round(
      rrScore + confidenceScore + potentialScore + strategyScore + 
      timeframeBonus + fundamentalBonus + conflictPenalty + personalMethodBonus
    );

    return {
      rrScore: Math.round(rrScore),
      confidenceScore: Math.round(confidenceScore),
      potentialScore: Math.round(potentialScore),
      strategyScore: Math.round(strategyScore),
      timeframeBonus,
      fundamentalBonus,
      conflictPenalty,
      personalMethodBonus,
      total
    };
  }

  public static determineQualityRating(score: number): 'ELITE' | 'HIGH' | 'MEDIUM' | 'LOW' | 'REJECTED' {
    if (score >= 200) return 'ELITE';
    if (score >= this.SCORE_THRESHOLD) return 'HIGH';
    if (score >= 120) return 'MEDIUM';
    if (score >= 80) return 'LOW';
    return 'REJECTED';
  }

  public static getScoreThreshold(): number {
    return this.SCORE_THRESHOLD;
  }

  public static getDailyStats(): {
    totalSignalsAnalyzed: number;
    signalsPassedFilter: number;
    averageScore: number;
    topScore: number;
    rejectionRate: number;
  } {
    // This would be connected to actual tracking in production
    return {
      totalSignalsAnalyzed: 47,
      signalsPassedFilter: 3,
      averageScore: 142,
      topScore: 198,
      rejectionRate: 93.6
    };
  }
}
