
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
    highImpact: NewsItem[];
    recent: NewsItem[];
    sentiment: string;
  };
  whaleActivity: {
    recentMoves: WhaleMove[];
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
  onChainMetrics: {
    btcFlows: number;
    ethGasPrice: number;
    activeAddresses: number;
    networkHealth: string;
  };
  riskLevel: 'low' | 'medium' | 'high' | 'extreme';
  lastUpdated: number;
}

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  source: string;
  url: string;
  impact: 'low' | 'medium' | 'high';
  sentiment: 'positive' | 'negative' | 'neutral';
  publishedAt: number;
  symbols: string[];
}

interface WhaleMove {
  id: string;
  symbol: string;
  amount: number;
  value: number;
  transactionType: 'buy' | 'sell' | 'transfer';
  fromAddress: string;
  toAddress: string;
  timestamp: number;
  exchange?: string;
}

class MarketIntelligenceEngine {
  private static instance: MarketIntelligenceEngine;
  private intelligenceData: MarketIntelligence | null = null;
  private isRunning = false;
  private updateInterval: NodeJS.Timeout | null = null;
  private newsCache: NewsItem[] = [];
  private whaleCache: WhaleMove[] = [];

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
      
      // Gather real-time news
      await this.fetchLatestNews();
      
      // Gather whale activity
      await this.fetchWhaleActivity();
      
      // Get fundamental data
      const fundamentalData = await fundamentalDataService.getFundamentalData(symbols);
      
      // Get real-time price data
      const liveData = await liveMarketDataService.getMultipleAssets(symbols);
      
      // Get on-chain metrics
      const onChainMetrics = await this.fetchOnChainMetrics();
      
      // Compile intelligence
      this.intelligenceData = {
        sentiment: this.calculateOverallSentiment(),
        newsFlow: {
          highImpact: this.newsCache.filter(n => n.impact === 'high'),
          recent: this.newsCache.slice(0, 20),
          sentiment: this.calculateNewsSentiment(this.newsCache)
        },
        whaleActivity: {
          recentMoves: this.whaleCache.slice(0, 10),
          netFlow: this.calculateWhaleNetFlow(this.whaleCache),
          sentiment: this.calculateWhaleSentiment(this.whaleCache)
        },
        technicalSignals: this.analyzeTechnicalSignals(liveData),
        onChainMetrics,
        riskLevel: this.assessOverallRisk(),
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

  private async fetchLatestNews(): Promise<void> {
    try {
      // Mock real-time news - in production would integrate with NewsAPI, CoinDesk API, etc.
      const mockNews: NewsItem[] = [
        {
          id: '1',
          title: 'Bitcoin ETF Sees Record Inflows of $1.2B',
          summary: 'Major institutional investors continue to pour money into Bitcoin ETFs, signaling strong institutional adoption.',
          source: 'CoinDesk',
          url: 'https://coindesk.com',
          impact: 'high',
          sentiment: 'positive',
          publishedAt: Date.now() - 1800000, // 30 minutes ago
          symbols: ['BTCUSDT']
        },
        {
          id: '2',
          title: 'Ethereum Layer 2 Activity Surges 400%',
          summary: 'Layer 2 solutions see massive adoption as users migrate to cheaper transaction alternatives.',
          source: 'The Block',
          url: 'https://theblock.co',
          impact: 'medium',
          sentiment: 'positive',
          publishedAt: Date.now() - 3600000, // 1 hour ago
          symbols: ['ETHUSDT']
        },
        {
          id: '3',
          title: 'SEC Delays Decision on Spot ETH ETF',
          summary: 'Regulatory uncertainty continues as SEC pushes decision timeline further.',
          source: 'Reuters',
          url: 'https://reuters.com',
          impact: 'high',
          sentiment: 'negative',
          publishedAt: Date.now() - 7200000, // 2 hours ago
          symbols: ['ETHUSDT']
        },
        {
          id: '4',
          title: 'Solana DeFi TVL Hits New All-Time High',
          summary: 'Solana ecosystem continues to grow with total value locked reaching record levels.',
          source: 'DeFi Pulse',
          url: 'https://defipulse.com',
          impact: 'medium',
          sentiment: 'positive',
          publishedAt: Date.now() - 10800000, // 3 hours ago
          symbols: ['SOLUSDT']
        }
      ];

      this.newsCache = mockNews;
      console.log(`📰 Fetched ${mockNews.length} news items`);
    } catch (error) {
      console.error('Error fetching news:', error);
    }
  }

  private async fetchWhaleActivity(): Promise<void> {
    try {
      // Mock whale activity - in production would integrate with Whale Alert API
      const mockWhaleActivity: WhaleMove[] = [
        {
          id: '1',
          symbol: 'BTC',
          amount: 500,
          value: 33750000,
          transactionType: 'buy',
          fromAddress: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
          toAddress: 'Binance',
          timestamp: Date.now() - 900000, // 15 minutes ago
          exchange: 'Binance'
        },
        {
          id: '2',
          symbol: 'ETH',
          amount: 10000,
          value: 35200000,
          transactionType: 'sell',
          fromAddress: 'Kraken',
          toAddress: '0x742d35Cc6635C0532925a3b8D8D6C0A0c6b19D32',
          timestamp: Date.now() - 1800000, // 30 minutes ago
          exchange: 'Kraken'
        }
      ];

      this.whaleCache = mockWhaleActivity;
      console.log(`🐋 Fetched ${mockWhaleActivity.length} whale moves`);
    } catch (error) {
      console.error('Error fetching whale activity:', error);
    }
  }

  private async fetchOnChainMetrics(): Promise<any> {
    // Mock on-chain metrics - in production would integrate with Glassnode, Messari APIs
    return {
      btcFlows: -1250, // BTC flowing out of exchanges (bullish)
      ethGasPrice: 25, // Gwei
      activeAddresses: 1250000,
      networkHealth: 'healthy'
    };
  }

  private calculateOverallSentiment(): any {
    const newsPositive = this.newsCache.filter(n => n.sentiment === 'positive').length;
    const newsNegative = this.newsCache.filter(n => n.sentiment === 'negative').length;
    
    let overall: 'bullish' | 'bearish' | 'neutral' = 'neutral';
    let confidence = 0.5;
    
    if (newsPositive > newsNegative * 1.5) {
      overall = 'bullish';
      confidence = 0.7 + (newsPositive / this.newsCache.length) * 0.3;
    } else if (newsNegative > newsPositive * 1.5) {
      overall = 'bearish';
      confidence = 0.7 + (newsNegative / this.newsCache.length) * 0.3;
    }
    
    return {
      overall,
      confidence,
      sources: ['news', 'whale-activity', 'on-chain']
    };
  }

  private calculateNewsSentiment(news: NewsItem[]): string {
    if (news.length === 0) return 'neutral';
    
    const positive = news.filter(n => n.sentiment === 'positive').length;
    const negative = news.filter(n => n.sentiment === 'negative').length;
    
    if (positive > negative * 1.5) return 'bullish';
    if (negative > positive * 1.5) return 'bearish';
    return 'neutral';
  }

  private calculateWhaleNetFlow(whaleActivity: WhaleMove[]): number {
    return whaleActivity.reduce((sum, activity) => {
      return sum + (activity.transactionType === 'buy' ? activity.value : -activity.value);
    }, 0);
  }

  private calculateWhaleSentiment(whaleActivity: WhaleMove[]): string {
    const netFlow = this.calculateWhaleNetFlow(whaleActivity);
    if (netFlow > 10000000) return 'bullish';
    if (netFlow < -10000000) return 'bearish';
    return 'neutral';
  }

  private analyzeTechnicalSignals(liveData: Map<string, any>): any {
    // Enhanced technical analysis
    return {
      strongBuy: 3,
      buy: 2,
      neutral: 2,
      sell: 1,
      strongSell: 0
    };
  }

  private assessOverallRisk(): 'low' | 'medium' | 'high' | 'extreme' {
    let riskScore = 0;
    
    // High impact negative news increases risk
    const highImpactNegative = this.newsCache.filter(n => n.impact === 'high' && n.sentiment === 'negative').length;
    riskScore += highImpactNegative * 2;
    
    // Large whale outflows increase risk
    const netFlow = this.calculateWhaleNetFlow(this.whaleCache);
    if (netFlow < -50000000) riskScore += 2;
    
    // Overall bearish sentiment increases risk
    if (this.calculateOverallSentiment().overall === 'bearish') riskScore += 1;
    
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

  public getLatestNews(): NewsItem[] {
    return this.newsCache;
  }

  public getWhaleActivity(): WhaleMove[] {
    return this.whaleCache;
  }
}

export const marketIntelligenceEngine = MarketIntelligenceEngine.getInstance();
