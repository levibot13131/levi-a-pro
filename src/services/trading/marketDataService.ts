
export class MarketDataService {
  public static getInstance() {
    return new MarketDataService();
  }

  public async getCurrentMarketData() {
    // Mock market data
    return {
      timestamp: Date.now(),
      btcPrice: 67500,
      ethPrice: 3520,
      marketSentiment: 'bullish',
      volatility: 0.15
    };
  }

  public async getMarketData(symbol: string) {
    // Mock single market data
    const basePrice = symbol === 'BTCUSDT' ? 67500 : 
                     symbol === 'ETHUSDT' ? 3520 : 
                     symbol === 'SOLUSDT' ? 195 : 600;
    
    return {
      symbol,
      price: basePrice + (Math.random() - 0.5) * basePrice * 0.02,
      volume: Math.random() * 1000000,
      priceChange: (Math.random() - 0.5) * 0.05,
      timestamp: Date.now(),
      wyckoffPhase: 'Accumulation',
      rsi: 45 + Math.random() * 20,
      vwap: basePrice * (0.98 + Math.random() * 0.04)
    };
  }

  public async getMultipleMarketData(symbols: string[]) {
    const results = new Map();
    
    for (const symbol of symbols) {
      const data = await this.getMarketData(symbol);
      results.set(symbol, data);
    }
    
    return results;
  }
}

export const marketDataService = MarketDataService.getInstance();
