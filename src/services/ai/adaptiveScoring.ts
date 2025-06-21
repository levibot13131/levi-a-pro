
import { signalOutcomeTracker } from './signalOutcomeTracker';
import { SignalScoringEngine } from '../trading/signalScoringEngine';

export class AdaptiveSignalScoring extends SignalScoringEngine {
  private static adaptiveWeights: Record<string, number> = {};
  private static lastWeightUpdate = 0;
  private static readonly WEIGHT_UPDATE_INTERVAL = 3600000; // 1 hour

  public static scoreSignalWithAdaptiveLearning(signal: any) {
    // Update adaptive weights if needed
    this.updateAdaptiveWeights();
    
    // Get base score
    const baseScore = super.scoreSignal(signal);
    
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
    updatedScore.qualityRating = this.determineQualityRating(updatedScore.score.total);
    updatedScore.shouldSend = updatedScore.score.total >= this.getScoreThreshold();

    console.log(`🧠 Adaptive scoring applied: ${signal.symbol} - Base: ${baseScore.score.total}, Adaptive bonus: ${adaptiveBonus}, Final: ${updatedScore.score.total}`);
    
    return updatedScore;
  }

  private static updateAdaptiveWeights() {
    const now = Date.now();
    if (now - this.lastWeightUpdate < this.WEIGHT_UPDATE_INTERVAL) {
      return; // Don't update too frequently
    }

    this.adaptiveWeights = signalOutcomeTracker.getAdaptiveWeights();
    this.lastWeightUpdate = now;
    
    console.log('🔄 Adaptive weights updated:', this.adaptiveWeights);
  }

  private static calculateAdaptiveBonus(signal: any): number {
    const strategyWeight = this.adaptiveWeights[signal.strategy] || 0.5;
    
    // Convert weight to bonus points
    let adaptiveBonus = 0;
    
    // High-performing strategies get bonus points
    if (strategyWeight >= 0.8) {
      adaptiveBonus = 20; // High performer bonus
    } else if (strategyWeight >= 0.7) {
      adaptiveBonus = 15; // Good performer bonus
    } else if (strategyWeight >= 0.6) {
      adaptiveBonus = 10; // Average performer bonus
    } else if (strategyWeight >= 0.4) {
      adaptiveBonus = 0; // Neutral
    } else {
      adaptiveBonus = -10; // Underperformer penalty
    }

    // Personal method always gets priority regardless of recent performance
    if (signal.strategy === 'almog-personal-method') {
      adaptiveBonus = Math.max(adaptiveBonus, 15); // Ensure minimum bonus
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
