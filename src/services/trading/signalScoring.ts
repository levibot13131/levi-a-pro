
export interface SignalScoringData {
  confidence: number;
  reasoning: string[];
  riskReward: number;
  shouldSignal: boolean;
  rejectionReason?: string;
}

export class SignalScoring {
  static calculateConfidence(
    shortTermTrend: string,
    mediumTermTrend: string,
    longTermTrend: string,
    volumeSpike: boolean,
    sentiment: any,
    priceAction: any,
    riskReward: number
  ): SignalScoringData {
    let confidence = 0;
    let reasoning: string[] = [];

    // Multi-timeframe confluence
    if (shortTermTrend === mediumTermTrend && mediumTermTrend === longTermTrend) {
      confidence += 30;
      reasoning.push(`Strong ${shortTermTrend} confluence across timeframes`);
    } else if (shortTermTrend === mediumTermTrend) {  
      confidence += 15;
      reasoning.push(`Moderate ${shortTermTrend} confluence (15m-1h)`);
    } else {
      reasoning.push(`Mixed timeframe signals: 15m(${shortTermTrend}), 1h(${mediumTermTrend}), 4h(${longTermTrend})`);
    }
    
    // Volume confirmation
    if (volumeSpike) {
      confidence += 20;
      reasoning.push('Volume spike detected');
    } else {
      reasoning.push('Normal volume levels');
    }
    
    // FIXED: Correct sentiment analysis logic - using impact AND strength properly
    if (sentiment.impact === 'positive') {
      if (sentiment.strength === 'high') {
        confidence += 25;
        reasoning.push(`Strong positive sentiment (${sentiment.score.toFixed(2)})`);
      } else if (sentiment.strength === 'medium') {
        confidence += 15;
        reasoning.push(`Moderate positive sentiment (${sentiment.score.toFixed(2)})`);
      } else {
        confidence += 8;
        reasoning.push(`Weak positive sentiment (${sentiment.score.toFixed(2)})`);
      }
    } else if (sentiment.impact === 'negative') {
      if (sentiment.strength === 'high') {
        confidence -= 15;
        reasoning.push(`Strong negative sentiment warning (${sentiment.score.toFixed(2)})`);
      } else if (sentiment.strength === 'medium') {
        confidence -= 8;
        reasoning.push(`Moderate negative sentiment (${sentiment.score.toFixed(2)})`);
      } else {
        confidence -= 3;
        reasoning.push(`Weak negative sentiment (${sentiment.score.toFixed(2)})`);
      }
    } else {
      confidence += 5;
      reasoning.push(`Neutral sentiment (${sentiment.score.toFixed(2)})`);
    }
    
    // Price action
    if (priceAction.strength > 0.7) {
      confidence += 25;
      reasoning.push(`Strong price action pattern (${priceAction.pattern})`);
    } else if (priceAction.strength > 0.4) {
      confidence += 10;
      reasoning.push(`Moderate price action (${priceAction.pattern})`);
    } else {
      reasoning.push(`Weak price action (${priceAction.pattern})`);
    }
    
    // Risk management
    if (riskReward >= 2.0) {
      confidence += 15;
      reasoning.push(`Excellent R/R ratio: ${riskReward.toFixed(2)}`);
    } else if (riskReward >= 1.5) {
      confidence += 10;
      reasoning.push(`Good R/R ratio: ${riskReward.toFixed(2)}`);
    } else {
      reasoning.push(`Poor R/R ratio: ${riskReward.toFixed(2)}`);
    }

    // Decision logic - STRICT FILTERING for production
    const shouldSignal = confidence >= 80 && riskReward >= 1.5;
    const rejectionReason = this.getRejectionReason(confidence, riskReward, sentiment);

    return {
      confidence,
      reasoning,
      riskReward,
      shouldSignal,
      rejectionReason: shouldSignal ? undefined : rejectionReason
    };
  }

  private static getRejectionReason(confidence: number, riskReward: number, sentiment: any): string {
    const reasons = [];
    
    if (confidence < 80) {
      reasons.push(`Low confidence: ${confidence}% (minimum 80% required)`);
    }
    if (riskReward < 1.5) {
      reasons.push(`Poor risk/reward ratio: ${riskReward.toFixed(2)} (minimum 1.5 required)`);
    }
    if (sentiment.impact === 'negative' && sentiment.strength === 'high') {
      reasons.push(`Strong negative sentiment: ${sentiment.score.toFixed(2)}`);
    }
    
    return reasons.length > 0 ? reasons.join(' | ') : 'Multiple criteria not met';
  }
}
