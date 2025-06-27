
export interface MarketHeatData {
  heatIndex: number;
  volatility: number;
  volume: number;
  sentiment: number;
  factors: {
    priceVolatility: number;
    volumeSpike: number;
    sentimentExtreme: number;
    marketCap: number;
  };
}

export class MarketHeatIndex {
  private static readonly NORMAL_THRESHOLD = 50; // Raised from 40 for SEV-1
  private static readonly AGGRESSIVE_THRESHOLD = 70;

  static calculateHeatIndex(marketData: any): MarketHeatData {
    const factors = {
      priceVolatility: Math.min(40, Math.abs(marketData.change24h || 0) * 2),
      volumeSpike: Math.min(30, ((marketData.volume24h || 0) / 1000000000) * 15),
      sentimentExtreme: Math.min(20, Math.abs((marketData.sentiment || 0.5) - 0.5) * 40),
      marketCap: Math.min(10, (marketData.marketCap || 1000000000) / 100000000)
    };

    const heatIndex = factors.priceVolatility + factors.volumeSpike + factors.sentimentExtreme + factors.marketCap;

    return {
      heatIndex: Math.min(100, heatIndex),
      volatility: factors.priceVolatility,
      volume: factors.volumeSpike,
      sentiment: factors.sentimentExtreme,
      factors
    };
  }

  static async getCurrentHeatLevel(): Promise<number> {
    // Mock implementation for now - in production this would fetch real market data
    const mockMarketData = {
      change24h: (Math.random() * 10) - 5, // -5% to +5%
      volume24h: Math.random() * 2000000000, // 0 to 2B
      sentiment: Math.random(), // 0 to 1
      marketCap: 1000000000000 // 1T market cap
    };

    const heatData = this.calculateHeatIndex(mockMarketData);
    return heatData.heatIndex;
  }

  static isMarketSafe(marketData: any, aggressiveMode: boolean = true): boolean {
    const heatData = this.calculateHeatIndex(marketData);
    const threshold = aggressiveMode ? this.AGGRESSIVE_THRESHOLD : this.NORMAL_THRESHOLD;
    
    console.log(`🌡️ Market Heat: ${heatData.heatIndex.toFixed(1)}% vs ${threshold}% threshold (${aggressiveMode ? 'AGGRESSIVE' : 'NORMAL'} mode)`);
    
    return heatData.heatIndex <= threshold;
  }

  static getHeatStatus(heatIndex: number): 'COLD' | 'WARM' | 'HOT' | 'EXTREME' {
    if (heatIndex <= 30) return 'COLD';
    if (heatIndex <= 50) return 'WARM'; 
    if (heatIndex <= 70) return 'HOT';
    return 'EXTREME';
  }
}
