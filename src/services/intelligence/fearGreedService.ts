
interface FearGreedData {
  value: number; // 0-100
  classification: 'Extreme Fear' | 'Fear' | 'Neutral' | 'Greed' | 'Extreme Greed';
  timestamp: number;
  previousValue?: number;
  trend: 'increasing' | 'decreasing' | 'stable';
}

class FearGreedService {
  private currentData: FearGreedData | null = null;
  private lastUpdate = 0;
  private updateInterval = 3600000; // 1 hour

  async getFearGreedIndex(): Promise<FearGreedData> {
    const now = Date.now();
    
    if (!this.currentData || now - this.lastUpdate > this.updateInterval) {
      await this.updateFearGreedData();
      this.lastUpdate = now;
    }

    return this.currentData!;
  }

  private async updateFearGreedData(): Promise<void> {
    console.log('😰 Updating Fear & Greed Index...');
    
    try {
      // Mock implementation - in production would use Alternative.me API
      const value = Math.floor(Math.random() * 100);
      const previousValue = this.currentData?.value;
      
      let classification: FearGreedData['classification'];
      if (value <= 20) classification = 'Extreme Fear';
      else if (value <= 40) classification = 'Fear';
      else if (value <= 60) classification = 'Neutral';
      else if (value <= 80) classification = 'Greed';
      else classification = 'Extreme Greed';
      
      let trend: FearGreedData['trend'] = 'stable';
      if (previousValue) {
        if (value > previousValue + 5) trend = 'increasing';
        else if (value < previousValue - 5) trend = 'decreasing';
      }
      
      this.currentData = {
        value,
        classification,
        timestamp: Date.now(),
        previousValue,
        trend
      };
      
      console.log(`✅ Fear & Greed Index updated: ${value} (${classification})`);
    } catch (error) {
      console.error('❌ Error updating Fear & Greed Index:', error);
    }
  }

  getScoreMultiplier(): number {
    if (!this.currentData) return 1.0;
    
    const { value, classification } = this.currentData;
    
    // Adjust signal confidence based on market sentiment
    switch (classification) {
      case 'Extreme Fear':
        return 0.8; // Reduce confidence during extreme fear
      case 'Fear':
        return 0.9;
      case 'Neutral':
        return 1.0;
      case 'Greed':
        return 0.95;
      case 'Extreme Greed':
        return 0.75; // Reduce confidence during extreme greed
      default:
        return 1.0;
    }
  }
}

export const fearGreedService = new FearGreedService();
