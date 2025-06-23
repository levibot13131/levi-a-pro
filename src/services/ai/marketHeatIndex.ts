
interface MarketHeatData {
  volatility: number;
  volume: number;
  liquidityScore: number;
  spreadScore: number;
  heatIndex: number; // 0-100
  recommendation: 'COLD' | 'WARM' | 'HOT' | 'EXTREME';
}

export class MarketHeatIndex {
  static calculateHeatIndex(marketData: any): MarketHeatData {
    // Calculate volatility based on 24h price movement
    const volatility = Math.abs(marketData.change24h || 0);
    
    // Volume score (normalized)
    const volumeScore = Math.min(100, (marketData.volume24h / 100000000) * 10);
    
    // Liquidity score (proxy based on market cap or volume)
    const liquidityScore = Math.min(100, volumeScore * 0.8);
    
    // Spread score (assume tighter spreads for higher volume)
    const spreadScore = Math.min(100, volumeScore * 0.6);
    
    // Calculate composite heat index
    let heatIndex = 0;
    heatIndex += volatility * 0.4; // 40% weight on volatility
    heatIndex += volumeScore * 0.3; // 30% weight on volume
    heatIndex += liquidityScore * 0.2; // 20% weight on liquidity
    heatIndex += spreadScore * 0.1; // 10% weight on spread
    
    // Cap at 100
    heatIndex = Math.min(100, heatIndex);
    
    // Determine recommendation
    let recommendation: MarketHeatData['recommendation'];
    if (heatIndex >= 80) recommendation = 'EXTREME';
    else if (heatIndex >= 60) recommendation = 'HOT';
    else if (heatIndex >= 40) recommendation = 'WARM';
    else recommendation = 'COLD';
    
    return {
      volatility,
      volume: volumeScore,
      liquidityScore,
      spreadScore,
      heatIndex,
      recommendation
    };
  }

  static shouldAllowSignaling(heatData: MarketHeatData): boolean {
    // Only allow signals when market has sufficient heat
    return heatData.heatIndex >= 30; // Minimum heat threshold
  }

  static getHeatIndexDescription(heatData: MarketHeatData): string {
    switch (heatData.recommendation) {
      case 'EXTREME':
        return `🔥 שוק לוהט מאוד (${heatData.heatIndex.toFixed(0)}%) - תנועות גדולות צפויות`;
      case 'HOT':
        return `🌡️ שוק חם (${heatData.heatIndex.toFixed(0)}%) - תנאים מעולים למסחר`;
      case 'WARM':
        return `☀️ שוק פעיל (${heatData.heatIndex.toFixed(0)}%) - תנאים טובים`;
      case 'COLD':
        return `❄️ שוק רגוע (${heatData.heatIndex.toFixed(0)}%) - פעילות מוגבלת`;
      default:
        return `📊 מדד חום שוק: ${heatData.heatIndex.toFixed(0)}%`;
    }
  }

  static filterDangerousSymbols(symbol: string, marketData: any): boolean {
    // Check for dangerous conditions
    const recentSpike = Math.abs(marketData.change24h) > 20; // >20% move might be manipulation
    const lowVolume = marketData.volume24h < 10000000; // <$10M volume
    const extremeVolatility = Math.abs(marketData.change1h || 0) > 10; // >10% in 1 hour
    
    if (recentSpike && lowVolume) {
      console.log(`⚠️ ${symbol} flagged: High volatility + Low volume (possible manipulation)`);
      return false;
    }
    
    if (extremeVolatility) {
      console.log(`⚠️ ${symbol} flagged: Extreme short-term volatility`);
      return false;
    }
    
    return true;
  }
}
