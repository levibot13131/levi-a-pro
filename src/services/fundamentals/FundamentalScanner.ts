/**
 * Advanced Fundamental Analysis Scanner
 * Integrates news, economic calendar, social sentiment
 */

export interface NewsEvent {
  id: string;
  title: string;
  content: string;
  source: string;
  timestamp: number;
  sentiment: 'bullish' | 'bearish' | 'neutral';
  impact: 'low' | 'medium' | 'high';
  symbols: string[];
  url?: string;
}

export interface EconomicEvent {
  id: string;
  title: string;
  country: string;
  impact: 'low' | 'medium' | 'high';
  actual?: number;
  forecast?: number;
  previous?: number;
  timestamp: number;
  currency: string;
}

export interface SocialSentiment {
  symbol: string;
  platform: 'twitter' | 'reddit' | 'telegram';
  sentiment: number; // -1 to 1
  volume: number;
  influence_score: number;
  timestamp: number;
}

export interface FundamentalAnalysis {
  symbol: string;
  overall_sentiment: number; // -1 to 1
  news_impact: number; // 0 to 1
  social_volume: number;
  economic_impact: number;
  recommendation: 'strong_buy' | 'buy' | 'hold' | 'sell' | 'strong_sell';
  confidence: number;
  key_factors: string[];
}

export class FundamentalScanner {
  private static instance: FundamentalScanner;
  private newsEvents: NewsEvent[] = [];
  private economicEvents: EconomicEvent[] = [];
  private socialSentiments: Map<string, SocialSentiment[]> = new Map();

  public static getInstance(): FundamentalScanner {
    if (!FundamentalScanner.instance) {
      FundamentalScanner.instance = new FundamentalScanner();
    }
    return FundamentalScanner.instance;
  }

  /**
   * Scan for fundamental events affecting a symbol
   */
  public async scanSymbol(symbol: string): Promise<FundamentalAnalysis> {
    console.log(`🔍 Scanning fundamental data for ${symbol}`);

    try {
      // Analyze recent news
      const newsAnalysis = this.analyzeNewsForSymbol(symbol);
      
      // Analyze economic events
      const economicAnalysis = this.analyzeEconomicEvents(symbol);
      
      // Analyze social sentiment
      const socialAnalysis = this.analyzeSocialSentiment(symbol);
      
      // Calculate overall score
      const socialResult = await this.analyzeSocialSentiment(symbol);
      const overallSentiment = (newsAnalysis.sentiment + socialResult.sentiment + economicAnalysis.sentiment) / 3;
      const newsImpact = newsAnalysis.impact;
      const socialVolume = socialResult.volume;
      const economicImpact = economicAnalysis.impact;
      
      // Generate recommendation
      const recommendation = this.generateRecommendation(overallSentiment, newsImpact, socialVolume, economicImpact);
      
      // Calculate confidence based on data availability
      const confidence = this.calculateConfidence(newsAnalysis, socialAnalysis, economicAnalysis);
      
      // Extract key factors
      const keyFactors = [
        ...newsAnalysis.factors,
        ...socialResult.factors,
        ...economicAnalysis.factors
      ];

      const result: FundamentalAnalysis = {
        symbol,
        overall_sentiment: overallSentiment,
        news_impact: newsImpact,
        social_volume: socialVolume,
        economic_impact: economicImpact,
        recommendation,
        confidence,
        key_factors: keyFactors
      };

      console.log(`✅ Fundamental analysis for ${symbol}:`, result);
      return result;

    } catch (error) {
      console.error(`❌ Error scanning fundamentals for ${symbol}:`, error);
      return this.getFallbackAnalysis(symbol);
    }
  }

  /**
   * Ingest news from various sources
   */
  public async ingestNews(): Promise<void> {
    console.log('📰 Ingesting crypto news...');
    
    try {
      // Mock news data - replace with real API integration
      const mockNews: NewsEvent[] = [
        {
          id: '1',
          title: 'Bitcoin ETF Approval Expected This Week',
          content: 'Major financial institutions are bullish on Bitcoin ETF approval...',
          source: 'CryptoNews',
          timestamp: Date.now(),
          sentiment: 'bullish',
          impact: 'high',
          symbols: ['BTCUSDT'],
          url: 'https://example.com/news/1'
        },
        {
          id: '2',
          title: 'Ethereum Merge Upgrade Successful',
          content: 'The Ethereum merge has been completed successfully...',
          source: 'CoinDesk',
          timestamp: Date.now() - 3600000,
          sentiment: 'bullish',
          impact: 'medium',
          symbols: ['ETHUSDT'],
          url: 'https://example.com/news/2'
        },
        {
          id: '3',
          title: 'Regulatory Concerns Mount for Crypto',
          content: 'New regulations may impact crypto trading...',
          source: 'Reuters',
          timestamp: Date.now() - 7200000,
          sentiment: 'bearish',
          impact: 'medium',
          symbols: ['BTCUSDT', 'ETHUSDT', 'ADAUSDT'],
          url: 'https://example.com/news/3'
        }
      ];

      // Filter recent news (last 24 hours)
      const recentNews = mockNews.filter(news => 
        Date.now() - news.timestamp < 24 * 60 * 60 * 1000
      );

      this.newsEvents = recentNews;
      console.log(`✅ Ingested ${recentNews.length} news items`);

    } catch (error) {
      console.error('❌ Failed to ingest news:', error);
    }
  }

  /**
   * Ingest economic calendar events
   */
  public async ingestEconomicEvents(): Promise<void> {
    console.log('📅 Ingesting economic events...');
    
    try {
      // Mock economic data - replace with real API
      const mockEvents: EconomicEvent[] = [
        {
          id: '1',
          title: 'US CPI Data Release',
          country: 'US',
          impact: 'high',
          actual: 3.2,
          forecast: 3.1,
          previous: 3.0,
          timestamp: Date.now() + 3600000,
          currency: 'USD'
        },
        {
          id: '2',
          title: 'Federal Reserve Interest Rate Decision',
          country: 'US',
          impact: 'high',
          forecast: 5.25,
          previous: 5.0,
          timestamp: Date.now() + 86400000,
          currency: 'USD'
        }
      ];

      this.economicEvents = mockEvents;
      console.log(`✅ Ingested ${mockEvents.length} economic events`);

    } catch (error) {
      console.error('❌ Failed to ingest economic events:', error);
    }
  }

  /**
   * Analyze social sentiment
   */
  public async analyzeSocialSentiment(symbol: string): Promise<any> {
    // Mock social sentiment data
    const mockSentiments: SocialSentiment[] = [
      {
        symbol,
        platform: 'twitter',
        sentiment: Math.random() * 2 - 1, // -1 to 1
        volume: Math.floor(Math.random() * 1000),
        influence_score: Math.random(),
        timestamp: Date.now()
      },
      {
        symbol,
        platform: 'reddit',
        sentiment: Math.random() * 2 - 1,
        volume: Math.floor(Math.random() * 500),
        influence_score: Math.random(),
        timestamp: Date.now()
      }
    ];

    this.socialSentiments.set(symbol, mockSentiments);

    const avgSentiment = mockSentiments.reduce((acc, s) => acc + s.sentiment, 0) / mockSentiments.length;
    const totalVolume = mockSentiments.reduce((acc, s) => acc + s.volume, 0);

    return {
      sentiment: avgSentiment,
      volume: totalVolume / 1000, // Normalize
      factors: [`Social sentiment: ${avgSentiment > 0 ? 'Positive' : 'Negative'}`, `Volume: ${totalVolume} mentions`]
    };
  }

  private analyzeNewsForSymbol(symbol: string): any {
    const relevantNews = this.newsEvents.filter(news => 
      news.symbols.includes(symbol) || news.title.toLowerCase().includes(symbol.replace('USDT', '').toLowerCase())
    );

    if (relevantNews.length === 0) {
      return { sentiment: 0, impact: 0, factors: ['No recent news'] };
    }

    const sentimentScore = relevantNews.reduce((acc, news) => {
      const score = news.sentiment === 'bullish' ? 0.5 : news.sentiment === 'bearish' ? -0.5 : 0;
      const weight = news.impact === 'high' ? 1 : news.impact === 'medium' ? 0.7 : 0.4;
      return acc + (score * weight);
    }, 0) / relevantNews.length;

    const maxImpact = Math.max(...relevantNews.map(news => 
      news.impact === 'high' ? 1 : news.impact === 'medium' ? 0.7 : 0.4
    ));

    const factors = relevantNews.slice(0, 3).map(news => 
      `${news.sentiment.toUpperCase()}: ${news.title.substring(0, 50)}...`
    );

    return {
      sentiment: sentimentScore,
      impact: maxImpact,
      factors
    };
  }

  private analyzeEconomicEvents(symbol: string): any {
    const relevantEvents = this.economicEvents.filter(event => {
      // USD events affect USDT pairs
      if (symbol.includes('USDT') && event.currency === 'USD') return true;
      return false;
    });

    if (relevantEvents.length === 0) {
      return { sentiment: 0, impact: 0, factors: ['No relevant economic events'] };
    }

    const impactScore = relevantEvents.reduce((acc, event) => {
      const impact = event.impact === 'high' ? 0.8 : event.impact === 'medium' ? 0.5 : 0.2;
      // If actual vs forecast available, adjust sentiment
      let sentiment = 0;
      if (event.actual !== undefined && event.forecast !== undefined) {
        sentiment = event.actual > event.forecast ? 0.3 : -0.3;
      }
      return acc + (impact * sentiment);
    }, 0) / relevantEvents.length;

    const maxImpact = Math.max(...relevantEvents.map(event => 
      event.impact === 'high' ? 0.8 : event.impact === 'medium' ? 0.5 : 0.2
    ));

    const factors = relevantEvents.slice(0, 2).map(event => 
      `${event.title} (${event.impact.toUpperCase()})`
    );

    return {
      sentiment: impactScore,
      impact: maxImpact,
      factors
    };
  }

  private generateRecommendation(sentiment: number, newsImpact: number, socialVolume: number, economicImpact: number): 'strong_buy' | 'buy' | 'hold' | 'sell' | 'strong_sell' {
    const overallScore = sentiment + (newsImpact * 0.3) + (socialVolume * 0.1) + (economicImpact * 0.2);
    
    if (overallScore > 0.6) return 'strong_buy';
    if (overallScore > 0.2) return 'buy';
    if (overallScore > -0.2) return 'hold';
    if (overallScore > -0.6) return 'sell';
    return 'strong_sell';
  }

  private calculateConfidence(newsAnalysis: any, socialAnalysis: any, economicAnalysis: any): number {
    let confidence = 0.3; // Base confidence

    // Add confidence based on data availability
    if (newsAnalysis.factors.length > 1) confidence += 0.3;
    if (socialAnalysis.volume > 0.5) confidence += 0.2;
    if (economicAnalysis.impact > 0.5) confidence += 0.2;

    return Math.min(1.0, confidence);
  }

  private getFallbackAnalysis(symbol: string): FundamentalAnalysis {
    return {
      symbol,
      overall_sentiment: 0,
      news_impact: 0,
      social_volume: 0,
      economic_impact: 0,
      recommendation: 'hold',
      confidence: 0.1,
      key_factors: ['Insufficient fundamental data available']
    };
  }

  /**
   * Get current fundamental overview
   */
  public getFundamentalOverview(): any {
    return {
      newsCount: this.newsEvents.length,
      economicEventCount: this.economicEvents.length,
      socialSymbolsTracked: this.socialSentiments.size,
      lastUpdate: new Date().toISOString()
    };
  }
}

export const fundamentalScanner = FundamentalScanner.getInstance();