
import { SignalScoringEngine, ScoredSignal, SignalScoreBreakdown } from './signalScoringEngine';
import { whaleAlertService } from '../intelligence/whaleAlertService';
import { sentimentService } from '../intelligence/sentimentService';
import { fearGreedService } from '../intelligence/fearGreedService';
import { fundamentalDataService } from '../fundamentalDataService';

interface EnhancedScoreBreakdown extends SignalScoreBreakdown {
  whaleActivityScore: number;
  sentimentScore: number;
  fearGreedMultiplier: number;
  fundamentalRiskScore: number;
  intelligenceBonus: number;
}

interface EnhancedScoredSignal extends ScoredSignal {
  score: EnhancedScoreBreakdown;
  intelligenceData: {
    whaleActivity?: any;
    sentiment?: any;
    fearGreed?: any;
    fundamentalRisk: 'LOW' | 'MEDIUM' | 'HIGH';
    riskFactors: string[];
  };
}

export class IntelligenceEnhancedScoring extends SignalScoringEngine {
  public static async scoreSignalWithIntelligence(signal: any): Promise<EnhancedScoredSignal> {
    // Get base score first
    const baseScore = super.scoreSignal(signal);
    
    // Fetch intelligence data
    const [whaleData, sentimentData, fearGreedData, fundamentalData] = await Promise.all([
      whaleAlertService.getWhaleActivity([signal.symbol]),
      sentimentService.getSentimentData([signal.symbol]),
      fearGreedService.getFearGreedIndex(),
      fundamentalDataService.getFundamentalData([signal.symbol])
    ]);

    // Calculate intelligence scores
    const whaleActivityScore = this.calculateWhaleScore(whaleData.get(signal.symbol));
    const sentimentScore = this.calculateSentimentScore(sentimentData.get(signal.symbol));
    const fearGreedMultiplier = fearGreedService.getScoreMultiplier();
    const fundamentalRiskScore = this.calculateFundamentalRisk(fundamentalData, signal.symbol);
    
    // Calculate intelligence bonus
    const intelligenceBonus = Math.round(whaleActivityScore + sentimentScore + fundamentalRiskScore);
    
    // Apply fear & greed multiplier to total score
    const baseTotal = baseScore.score.total;
    const enhancedTotal = Math.round((baseTotal + intelligenceBonus) * fearGreedMultiplier);
    
    const enhancedScore: EnhancedScoreBreakdown = {
      ...baseScore.score,
      whaleActivityScore,
      sentimentScore,
      fearGreedMultiplier,
      fundamentalRiskScore,
      intelligenceBonus,
      total: enhancedTotal
    };

    // Determine fundamental risk level
    const riskFactors = this.assessRiskFactors(whaleData.get(signal.symbol), sentimentData.get(signal.symbol), fearGreedData);
    const fundamentalRisk = this.categorizeFundamentalRisk(riskFactors);

    const enhancedSignal: EnhancedScoredSignal = {
      ...baseScore,
      score: enhancedScore,
      qualityRating: this.determineQualityRating(enhancedTotal),
      shouldSend: enhancedTotal >= this.getScoreThreshold() && fundamentalRisk !== 'HIGH',
      intelligenceData: {
        whaleActivity: whaleData.get(signal.symbol),
        sentiment: sentimentData.get(signal.symbol),
        fearGreed: fearGreedData,
        fundamentalRisk,
        riskFactors
      }
    };

    console.log(`🧠 Intelligence-Enhanced Signal: ${signal.symbol} - Base: ${baseTotal}, Intelligence: +${intelligenceBonus}, F&G: ×${fearGreedMultiplier}, Final: ${enhancedTotal} (Risk: ${fundamentalRisk})`);

    return enhancedSignal;
  }

  private static calculateWhaleScore(whaleActivity?: any): number {
    if (!whaleActivity) return 0;
    
    let score = 0;
    
    // Whale sentiment alignment
    if (whaleActivity.sentiment === 'bullish') score += 15;
    else if (whaleActivity.sentiment === 'bearish') score -= 10;
    
    // Large transaction volume
    if (whaleActivity.largeTransactions > 5) score += 10;
    else if (whaleActivity.largeTransactions > 2) score += 5;
    
    // Net flow direction
    if (Math.abs(whaleActivity.netFlow) > 500000) {
      score += whaleActivity.netFlow > 0 ? 8 : -8;
    }
    
    return Math.round(score);
  }

  private static calculateSentimentScore(sentiment?: any): number {
    if (!sentiment) return 0;
    
    let score = 0;
    
    // Overall sentiment impact
    switch (sentiment.overallSentiment) {
      case 'extreme_greed':
        score -= 15; // Contrarian signal
        break;
      case 'extreme_fear':
        score += 10; // Opportunity in fear
        break;
      case 'bullish':
        score += 8;
        break;
      case 'bearish':
        score -= 5;
        break;
      default:
        score += 0;
    }
    
    // Influencer mentions boost
    if (sentiment.influencerMentions > 10) score += 5;
    
    return Math.round(score);
  }

  private static calculateFundamentalRisk(fundamentalData: any, symbol: string): number {
    // Analyze news sentiment and events
    const newsItems = fundamentalData.news || [];
    const negativeNews = newsItems.filter((item: any) => item.sentiment === 'negative' && item.relatedAssets.includes(symbol));
    
    let riskScore = 0;
    
    if (negativeNews.length > 2) riskScore -= 20;
    else if (negativeNews.length > 0) riskScore -= 10;
    
    // Market sentiment
    if (fundamentalData.marketSentiment?.overall === 'bearish') riskScore -= 10;
    else if (fundamentalData.marketSentiment?.overall === 'bullish') riskScore += 5;
    
    return Math.round(riskScore);
  }

  private static assessRiskFactors(whaleActivity?: any, sentiment?: any, fearGreed?: any): string[] {
    const factors: string[] = [];
    
    if (whaleActivity?.sentiment === 'bearish') factors.push('Whale selling pressure');
    if (sentiment?.overallSentiment === 'extreme_greed') factors.push('Market euphoria risk');
    if (sentiment?.overallSentiment === 'extreme_fear') factors.push('Panic selling conditions');
    if (fearGreed?.classification === 'Extreme Greed') factors.push('Extreme greed levels');
    if (fearGreed?.classification === 'Extreme Fear') factors.push('Extreme fear levels');
    
    return factors;
  }

  private static categorizeFundamentalRisk(riskFactors: string[]): 'LOW' | 'MEDIUM' | 'HIGH' {
    if (riskFactors.length >= 3) return 'HIGH';
    if (riskFactors.length >= 1) return 'MEDIUM';
    return 'LOW';
  }
}
