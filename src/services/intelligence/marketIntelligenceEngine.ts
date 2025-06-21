
import { fundamentalDataService } from '../fundamentalDataService';
import { liveMarketDataService } from '../trading/liveMarketDataService';
import { fetchCoinGeckoData, getRealTimePrices } from '../marketInformation/externalSourcesService';
import { toast } from 'sonner';

export interface MarketIntelligence {
  sentiment: {
    overall: 'bullish' | 'bearish' | 'neutral';
    confidence: number;
    sources: string[];
  };
  newsFlow: {
    highImpact: any[];
    recent: any[];
    sentiment: string;
  };
  whaleActivity: {
    recentMoves: any[];
    netFlow: number;
    sentiment: string;
  };
  technicalSignals: {
    strongBuy: number;
    buy: number;
    neutral: number;
    sell: number;
    strongSell: number;
  };
  riskLevel: 'low' | 'medium' | 'high' | 'extreme';
  lastUpdated: number;
}

class MarketIntelligenceEngine {
  private static instance: MarketIntelligenceEngine;
  private intelligenceData: MarketIntelligence | null = null;
  private isRunning = false;
  private updateInterval: NodeJS.Timeout | null = null;

  public static getInstance(): MarketIntelligenceEngine {
    if (!MarketIntelligenceEngine.instance) {
      MarketIntelligenceEngine.instance = new MarketIntelligenceEngine();
    }
    return MarketIntelligenceEngine.instance;
  }

  public async start(): Promise<void> {
    if (this.isRunning) return;
    
    console.log('🧠 Starting Market Intelligence Engine...');
    this.isRunning = true;
    
    // Initial intelligence gathering
    await this.gatherIntelligence();
    
    // Set up continuous monitoring every 2 minutes
    this.updateInterval = setInterval(async () => {
      await this.gatherIntelligence();
    }, 120000);
    
    toast.success('🧠 Market Intelligence Engine activated');
  }

  public stop(): void {
    if (!this.isRunning) return;
    
    console.log('🧠 Stopping Market Intelligence Engine...');
    this.isRunning = false;
    
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
    
    toast.info('Market Intelligence Engine stopped');
  }

  private async gatherIntelligence(): Promise<void> {
    try {
      console.log('🔍 Gathering market intelligence...');
      
      const symbols = ['BTCUSDT', 'ETHUSDT', 'SOLUSDT', 'BNBUSDT'];
      
      // Get fundamental data (news, social, whales)
      const fundamentalData = await fundamentalDataService.getFundamentalData(symbols);
      
      // Get real-time price data
      const liveData = await liveMarketDataService.getMultipleAssets(symbols);
      
      // Get additional market data from CoinGecko
      const coinGeckoData = await getRealTimePrices(['bitcoin', 'ethereum', 'solana', 'binancecoin']);
      
      // Analyze and compile intelligence
      this.intelligenceData = {
        sentiment: fundamentalData.marketSentiment,
        newsFlow: {
          highImpact: fundamentalData.news.filter(n => n.impact === 'high'),
          recent: fundamentalData.news.slice(0, 10),
          sentiment: this.calculateNewsSentiment(fundamentalData.news)
        },
        whaleActivity: {
          recentMoves: fundamentalData.whaleActivity.slice(0, 5),
          netFlow: this.calculateWhaleNetFlow(fundamentalData.whaleActivity),
          sentiment: this.calculateWhaleSentiment(fundamentalData.whaleActivity)
        },
        technicalSignals: this.analyzeTechnicalSignals(liveData),
        riskLevel: this.assessOverallRisk(fundamentalData, liveData),
        lastUpdated: Date.now()
      };
      
      console.log('✅ Market intelligence updated');
      
      // Dispatch intelligence update event
      window.dispatchEvent(new CustomEvent('market-intelligence-update', {
        detail: this.intelligenceData
      }));
      
    } catch (error) {
      console.error('❌ Error gathering market intelligence:', error);
    }
  }

  private calculateNewsSentiment(news: any[]): string {
    if (news.length === 0) return 'neutral';
    
    const positive = news.filter(n => n.sentiment === 'positive').length;
    const negative = news.filter(n => n.sentiment === 'negative').length;
    
    if (positive > negative * 1.5) return 'bullish';
    if (negative > positive * 1.5) return 'bearish';
    return 'neutral';
  }

  private calculateWhaleNetFlow(whaleActivity: any[]): number {
    return whaleActivity.reduce((sum, activity) => {
      return sum + (activity.transactionType === 'buy' ? activity.value : -activity.value);
    }, 0);
  }

  private calculateWhaleSentiment(whaleActivity: any[]): string {
    const netFlow = this.calculateWhaleNetFlow(whaleActivity);
    if (netFlow > 10000000) return 'bullish';
    if (netFlow < -10000000) return 'bearish';
    return 'neutral';
  }

  private analyzeTechnicalSignals(liveData: Map<string, any>): any {
    // Mock technical analysis - in production would use real TA indicators
    return {
      strongBuy: 2,
      buy: 3,
      neutral: 2,
      sell: 1,
      strongSell: 0
    };
  }

  private assessOverallRisk(fundamentalData: any, liveData: Map<string, any>): 'low' | 'medium' | 'high' | 'extreme' {
    let riskScore = 0;
    
    // High impact news increases risk
    if (fundamentalData.news.filter((n: any) => n.impact === 'high').length > 2) {
      riskScore += 2;
    }
    
    // Negative sentiment increases risk
    if (fundamentalData.marketSentiment.overall === 'bearish') {
      riskScore += 1;
    }
    
    // Large whale outflows increase risk
    const netFlow = this.calculateWhaleNetFlow(fundamentalData.whaleActivity);
    if (netFlow < -50000000) {
      riskScore += 2;
    }
    
    if (riskScore >= 4) return 'extreme';
    if (riskScore >= 3) return 'high';
    if (riskScore >= 1) return 'medium';
    return 'low';
  }

  public getIntelligence(): MarketIntelligence | null {
    return this.intelligenceData;
  }

  public isEngineRunning(): boolean {
    return this.isRunning;
  }
}

export const marketIntelligenceEngine = MarketIntelligenceEngine.getInstance();
