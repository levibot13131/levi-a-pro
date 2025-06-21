
interface WhaleTransaction {
  id: string;
  blockchain: string;
  symbol: string;
  amount: number;
  amountUsd: number;
  transactionType: 'transfer' | 'exchange_deposit' | 'exchange_withdrawal';
  from: string;
  to: string;
  timestamp: number;
  hash: string;
}

interface WhaleActivitySummary {
  symbol: string;
  netFlow: number; // Positive = inflow, Negative = outflow
  largeTransactions: number;
  sentiment: 'bullish' | 'bearish' | 'neutral';
  confidence: number;
  lastUpdate: number;
}

class WhaleAlertService {
  private cache: Map<string, WhaleActivitySummary> = new Map();
  private lastUpdate = 0;
  private updateInterval = 300000; // 5 minutes

  async getWhaleActivity(symbols: string[]): Promise<Map<string, WhaleActivitySummary>> {
    const now = Date.now();
    
    if (now - this.lastUpdate > this.updateInterval) {
      await this.updateWhaleData(symbols);
      this.lastUpdate = now;
    }

    const result = new Map<string, WhaleActivitySummary>();
    symbols.forEach(symbol => {
      const activity = this.cache.get(symbol);
      if (activity) {
        result.set(symbol, activity);
      }
    });

    return result;
  }

  private async updateWhaleData(symbols: string[]): Promise<void> {
    console.log('🐋 Updating whale activity data for:', symbols.join(', '));
    
    try {
      // Mock implementation - in production would use WhaleAlert API
      const mockData = this.generateMockWhaleData(symbols);
      
      mockData.forEach((activity, symbol) => {
        this.cache.set(symbol, activity);
      });
      
      console.log('✅ Whale activity data updated successfully');
    } catch (error) {
      console.error('❌ Error updating whale data:', error);
    }
  }

  private generateMockWhaleData(symbols: string[]): Map<string, WhaleActivitySummary> {
    const data = new Map<string, WhaleActivitySummary>();
    
    symbols.forEach(symbol => {
      const netFlow = (Math.random() - 0.5) * 1000000; // Random between -500k and +500k
      const largeTransactions = Math.floor(Math.random() * 10);
      
      let sentiment: 'bullish' | 'bearish' | 'neutral';
      if (netFlow > 200000) sentiment = 'bullish';
      else if (netFlow < -200000) sentiment = 'bearish';
      else sentiment = 'neutral';
      
      data.set(symbol, {
        symbol,
        netFlow,
        largeTransactions,
        sentiment,
        confidence: 0.7 + Math.random() * 0.3,
        lastUpdate: Date.now()
      });
    });
    
    return data;
  }
}

export const whaleAlertService = new WhaleAlertService();
