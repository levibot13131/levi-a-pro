
interface TimeframeAnalysis {
  m15: 'bullish' | 'bearish' | 'neutral';
  h1: 'bullish' | 'bearish' | 'neutral';
  h4: 'bullish' | 'bearish' | 'neutral';
  d1: 'bullish' | 'bearish' | 'neutral';
  alignment: number; // 0-100%
  confidence: number;
  recommendation: 'strong_buy' | 'buy' | 'hold' | 'sell' | 'strong_sell';
}

export class TimeframeConfirmationAI {
  static analyzeMultiTimeframes(marketData: any): TimeframeAnalysis {
    const m15 = this.analyzeSingleTimeframe(marketData, '15m');
    const h1 = this.analyzeSingleTimeframe(marketData, '1h');
    const h4 = this.analyzeSingleTimeframe(marketData, '4h');
    const d1 = this.analyzeSingleTimeframe(marketData, '1d');
    
    const trends = [m15, h1, h4, d1];
    const bullishCount = trends.filter(t => t === 'bullish').length;
    const bearishCount = trends.filter(t => t === 'bearish').length;
    
    let alignment = 0;
    let recommendation: TimeframeAnalysis['recommendation'] = 'hold';
    
    if (bullishCount >= 3) {
      alignment = (bullishCount / 4) * 100;
      recommendation = bullishCount === 4 ? 'strong_buy' : 'buy';
    } else if (bearishCount >= 3) {
      alignment = (bearishCount / 4) * 100;
      recommendation = bearishCount === 4 ? 'strong_sell' : 'sell';
    } else {
      alignment = 50; // Mixed signals
      recommendation = 'hold';
    }
    
    const confidence = alignment > 75 ? 90 : alignment > 50 ? 70 : 50;
    
    return {
      m15,
      h1,
      h4,
      d1,
      alignment,
      confidence,
      recommendation
    };
  }

  private static analyzeSingleTimeframe(marketData: any, timeframe: string): 'bullish' | 'bearish' | 'neutral' {
    // Simplified trend analysis based on price change and volume
    const priceChange = marketData.change24h;
    const volumeRatio = marketData.volume24h / 100000000;
    
    // Weight different timeframes differently
    let sensitivity = 1;
    switch (timeframe) {
      case '15m': sensitivity = 0.5; break;
      case '1h': sensitivity = 1; break;
      case '4h': sensitivity = 1.5; break;
      case '1d': sensitivity = 2; break;
    }
    
    const adjustedChange = priceChange * sensitivity;
    const volumeSupport = volumeRatio > 1;
    
    if (adjustedChange > 1.5 && volumeSupport) return 'bullish';
    if (adjustedChange < -1.5 && volumeSupport) return 'bearish';
    if (Math.abs(adjustedChange) > 2.5) return adjustedChange > 0 ? 'bullish' : 'bearish';
    
    return 'neutral';
  }

  static requiresTimeframeAlignment(analysis: TimeframeAnalysis): boolean {
    // Require at least 75% alignment for high-confidence signals
    return analysis.alignment >= 75;
  }

  static generateTimeframeReport(analysis: TimeframeAnalysis): string {
    const getTrendEmoji = (trend: string) => {
      switch (trend) {
        case 'bullish': return '🟢';
        case 'bearish': return '🔴';
        default: return '⚪';
      }
    };

    return `יישור זמנים: 15m${getTrendEmoji(analysis.m15)} 1h${getTrendEmoji(analysis.h1)} 4h${getTrendEmoji(analysis.h4)} 1d${getTrendEmoji(analysis.d1)} (${analysis.alignment.toFixed(0)}%)`;
  }
}
