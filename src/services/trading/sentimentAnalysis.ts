
import { newsAggregationService } from '../news/newsAggregationService';

export interface SentimentAnalysis {
  score: number; // 0-1 scale
  impact: 'positive' | 'negative' | 'neutral'; // Sentiment direction
  strength: 'high' | 'medium' | 'low'; // Strength of the sentiment
}

export class SentimentAnalyzer {
  static async getSentimentScore(symbol: string): Promise<SentimentAnalysis> {
    const news = newsAggregationService.getLatestNews(5);
    let score = 0.5;
    let positiveCount = 0;
    let negativeCount = 0;
    
    news.forEach(item => {
      if (item.impact === 'positive') {
        score += 0.15;
        positiveCount++;
      }
      if (item.impact === 'negative') {
        score -= 0.15;
        negativeCount++;
      }
    });
    
    score = Math.max(0, Math.min(1, score));
    
    let impact: 'positive' | 'negative' | 'neutral' = 'neutral';
    let strength: 'high' | 'medium' | 'low' = 'low';
    
    if (score > 0.65) {
      impact = 'positive';
      strength = score > 0.8 ? 'high' : 'medium';
    } else if (score < 0.35) {
      impact = 'negative';
      strength = score < 0.2 ? 'high' : 'medium';
    } else {
      impact = 'neutral';
      strength = 'low';
    }
    
    return { score, impact, strength };
  }
}
