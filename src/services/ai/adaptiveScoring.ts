
import { signalOutcomeTracker } from './signalOutcomeTracker';
import { SignalScoringEngine } from '../trading/signalScoringEngine';

export class AdaptiveSignalScoring {
  private static adaptiveWeights: Record<string, number> = {};
  private static lastWeightUpdate = 0;
  private static readonly WEIGHT_UPDATE_INTERVAL = 3600000; // 1 hour

  public static scoreSignalWithAdaptiveLearning(signal: any) {
    // Update adaptive weights if needed
    this.updateAdaptiveWeights();
    
    // Get base score
    const baseScore = SignalScoringEngine.scoreSignal(signal);
    
    // Apply adaptive learning adjustments
    const adaptiveBonus = this.calculateAdaptiveBonus(signal);
    const updatedScore = {
      ...baseScore,
      score: {
        ...baseScore.score,
        adaptiveBonus,
        total: baseScore.score.total + adaptiveBonus
      }
    };

    // Update quality rating based on new total
    updatedScore.qualityRating = SignalScoringEngine.determineQualityRating(updatedScore.score.total);
    updatedScore.shouldSend = updatedScore.score.total >= SignalScoringEngine.getScoreThreshold();

    console.log(`🧠 Adaptive scoring applied: ${signal.symbol} - Base: ${baseScore.score.total}, Adaptive bonus: ${adaptiveBonus}, Final: ${updatedScore.score.total}`);
    
    return updatedScore;
  }

  private static updateAdaptiveWeights() {
    const now = Date.now();
    if (now - this.lastWeightUpdate < this.WEIGHT_UPDATE_INTERVAL) {
      return;
    }

    this.adaptiveWeights = signalOutcomeTracker.getAdaptiveWeights();
    this.lastWeightUpdate = now;
    
    console.log('🔄 Adaptive weights updated:', this.adaptiveWeights);
  }

  private static calculateAdaptiveBonus(signal: any): number {
    const strategyWeight = this.adaptiveWeights[signal.strategy] || 0.5;
    
    let adaptiveBonus = 0;
    
    if (strategyWeight >= 0.8) {
      adaptiveBonus = 20;
    } else if (strategyWeight >= 0.7) {
      adaptiveBonus = 15;
    } else if (strategyWeight >= 0.6) {
      adaptiveBonus = 10;
    } else if (strategyWeight >= 0.4) {
      adaptiveBonus = 0;
    } else {
      adaptiveBonus = -10;
    }

    if (signal.strategy === 'almog-personal-method') {
      adaptiveBonus = Math.max(adaptiveBonus, 15);
    }

    return adaptiveBonus;
  }

  public static getAdaptiveLearningStats() {
    return {
      adaptiveWeights: this.adaptiveWeights,
      lastUpdate: this.lastWeightUpdate,
      learningInsights: signalOutcomeTracker.getLearningInsights(),
      strategyPerformance: signalOutcomeTracker.getStrategyPerformance()
    };
  }
}
