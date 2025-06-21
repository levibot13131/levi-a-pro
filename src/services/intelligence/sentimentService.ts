
interface SentimentData {
  symbol: string;
  overallSentiment: 'bullish' | 'bearish' | 'neutral' | 'extreme_greed' | 'extreme_fear';
  score: number; // -1 to 1
  sources: {
    twitter: number;
    news: number;
    reddit: number;
  };
  keywords: string[];
  influencerMentions: number;
  lastUpdate: number;
}

class SentimentService {
  private cache: Map<string, SentimentData> = new Map();
  private lastUpdate = 0;
  private updateInterval = 180000; // 3 minutes

  async getSentimentData(symbols: string[]): Promise<Map<string, SentimentData>> {
    const now = Date.now();
    
    if (now - this.lastUpdate > this.updateInterval) {
      await this.updateSentimentData(symbols);
      this.lastUpdate = now;
    }

    const result = new Map<string, SentimentData>();
    symbols.forEach(symbol => {
      const sentiment = this.cache.get(symbol);
      if (sentiment) {
        result.set(symbol, sentiment);
      }
    });

    return result;
  }

  private async updateSentimentData(symbols: string[]): Promise<void> {
    console.log('📱 Updating sentiment data for:', symbols.join(', '));
    
    try {
      // Mock implementation - in production would use Twitter API, Reddit API, etc.
      const mockData = this.generateMockSentimentData(symbols);
      
      mockData.forEach((sentiment, symbol) => {
        this.cache.set(symbol, sentiment);
      });
      
      console.log('✅ Sentiment data updated successfully');
    } catch (error) {
      console.error('❌ Error updating sentiment data:', error);
    }
  }

  private generateMockSentimentData(symbols: string[]): Map<string, SentimentData> {
    const data = new Map<string, SentimentData>();
    
    symbols.forEach(symbol => {
      const score = (Math.random() - 0.5) * 2; // -1 to 1
      
      let overallSentiment: 'bullish' | 'bearish' | 'neutral' | 'extreme_greed' | 'extreme_fear';
      if (score > 0.7) overallSentiment = 'extreme_greed';
      else if (score < -0.7) overallSentiment = 'extreme_fear';
      else if (score > 0.2) overallSentiment = 'bullish';
      else if (score < -0.2) overallSentiment = 'bearish';
      else overallSentiment = 'neutral';
      
      data.set(symbol, {
        symbol,
        overallSentiment,
        score,
        sources: {
          twitter: Math.random() * 2 - 1,
          news: Math.random() * 2 - 1,
          reddit: Math.random() * 2 - 1
        },
        keywords: ['bullish', 'breakout', 'support', 'resistance'],
        influencerMentions: Math.floor(Math.random() * 20),
        lastUpdate: Date.now()
      });
    });
    
    return data;
  }
}

export const sentimentService = new SentimentService();
