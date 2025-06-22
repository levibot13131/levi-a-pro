
export class RiskFilters {
  static calculateRiskReward(marketData: any): number {
    const price = marketData.price;
    const high24h = marketData.high24h;
    const low24h = marketData.low24h;
    
    const support = low24h + (high24h - low24h) * 0.2;
    const resistance = high24h - (high24h - low24h) * 0.2;
    
    const risk = Math.abs(price - support);
    const reward = Math.abs(resistance - price);
    
    return reward > 0 ? reward / Math.max(risk, price * 0.01) : 0;
  }

  static detectVolumeSpike(marketData: any): boolean {
    const volumeThresholds = {
      'BTCUSDT': 50000000,
      'ETHUSDT': 30000000,
      'SOLUSDT': 10000000,
      'BNBUSDT': 5000000,
      'ADAUSDT': 20000000,
      'DOTUSDT': 3000000
    };
    
    const threshold = volumeThresholds[marketData.symbol] || 1000000;
    return marketData.volume24h > threshold * 1.5;
  }

  static analyzePriceAction(marketData: any) {
    const change = Math.abs(marketData.change24h);
    const volume = marketData.volume24h;
    
    if (change > 8 && volume > 50000000) {
      return { strength: 0.95, pattern: 'Strong breakout with volume' };
    } else if (change > 5 && volume > 20000000) {
      return { strength: 0.85, pattern: 'Strong momentum with volume' };
    } else if (change > 3) {
      return { strength: 0.7, pattern: 'Moderate momentum' };
    } else if (change > 1) {
      return { strength: 0.4, pattern: 'Weak trend' };
    } else {
      return { strength: 0.2, pattern: 'Consolidation' };
    }
  }
}
