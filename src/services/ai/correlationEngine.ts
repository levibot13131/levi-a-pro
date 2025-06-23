
interface CorrelationSignal {
  newsConfirmed: boolean;
  onchainConfirmed: boolean;
  priceActionConfirmed: boolean;
  correlationScore: number;
  confidence: number;
}

export class CorrelationEngine {
  static async analyzeTriangulation(symbol: string, marketData: any, sentimentData: any): Promise<CorrelationSignal> {
    const newsConfirmed = await this.checkNewsConfirmation(symbol, sentimentData);
    const onchainConfirmed = await this.checkOnchainConfirmation(symbol, marketData);
    const priceActionConfirmed = this.checkPriceActionConfirmation(marketData);
    
    const confirmedFactors = [newsConfirmed, onchainConfirmed, priceActionConfirmed].filter(Boolean).length;
    const correlationScore = (confirmedFactors / 3) * 100;
    
    // Require at least 2 of 3 confirmations for high confidence
    const confidence = confirmedFactors >= 2 ? 85 + (confirmedFactors * 5) : 40 + (confirmedFactors * 10);
    
    return {
      newsConfirmed,
      onchainConfirmed,
      priceActionConfirmed,
      correlationScore,
      confidence: Math.min(100, confidence)
    };
  }

  private static async checkNewsConfirmation(symbol: string, sentimentData: any): Promise<boolean> {
    // Check if sentiment is strong enough (>0.7 positive or <0.3 negative)
    if (!sentimentData?.score) return false;
    
    return sentimentData.score > 0.7 || sentimentData.score < 0.3;
  }

  private static async checkOnchainConfirmation(symbol: string, marketData: any): Promise<boolean> {
    // Check for volume spike (proxy for onchain activity)
    const volumeRatio = marketData.volume24h / 100000000; // Normalize
    const hasVolumeSpike = volumeRatio > 1.5;
    
    // Check for significant price movement
    const hasSignificantMove = Math.abs(marketData.change24h) > 2.5;
    
    return hasVolumeSpike || hasSignificantMove;
  }

  private static checkPriceActionConfirmation(marketData: any): boolean {
    // Price action is confirmed if there's sustained movement
    const priceMovement = Math.abs(marketData.change24h);
    const hasMovement = priceMovement > 1.5;
    
    // Additional check for volume supporting the move
    const volumeSupport = marketData.volume24h > 50000000; // Basic threshold
    
    return hasMovement && volumeSupport;
  }

  static shouldTriggerSignal(correlation: CorrelationSignal): boolean {
    // Require at least 2 confirmations and correlation score > 60%
    const confirmedCount = [
      correlation.newsConfirmed,
      correlation.onchainConfirmed,
      correlation.priceActionConfirmed
    ].filter(Boolean).length;
    
    return confirmedCount >= 2 && correlation.correlationScore >= 60;
  }

  static generateCorrelationReport(correlation: CorrelationSignal): string {
    const confirmations = [];
    if (correlation.newsConfirmed) confirmations.push('📰 חדשות');
    if (correlation.onchainConfirmed) confirmations.push('⛓️ אונצ\'יין');
    if (correlation.priceActionConfirmed) confirmations.push('📊 מחיר');
    
    return `אישור משולש: ${confirmations.join(' + ')} (${correlation.correlationScore.toFixed(0)}%)`;
  }
}
