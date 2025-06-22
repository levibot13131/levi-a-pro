
export class StrategyMatcher {
  static calculateTrend(marketData: any, timeframe: string): 'bullish' | 'bearish' | 'neutral' {
    const change = marketData.change24h;
    const volume = marketData.volume24h;
    const avgVolume = 1000000;
    
    if (change > 3 && volume > avgVolume * 1.2) return 'bullish';
    if (change < -3 && volume > avgVolume * 1.2) return 'bearish';
    if (change > 1.5) return 'bullish';
    if (change < -1.5) return 'bearish';
    
    return 'neutral';
  }

  static getPersonalMethodSignals(marketData: any): boolean {
    // LeviPro Personal Method - emotional pressure + momentum + breakout
    const change = Math.abs(marketData.change24h);
    const volume = marketData.volume24h;
    
    // Look for emotional pressure points (high volatility + volume)
    const emotionalPressure = change > 5 && volume > 20000000;
    
    return emotionalPressure;
  }
}
