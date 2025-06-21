
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
}

export const marketDataService = MarketDataService.getInstance();
