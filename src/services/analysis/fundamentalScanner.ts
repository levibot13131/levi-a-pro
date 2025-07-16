/**
 * Fundamental Scanner
 * Scans and analyzes fundamental data for crypto markets
 */

import { supabase } from '@/integrations/supabase/client';

export interface FundamentalData {
  symbol: string;
  marketCap: number;
  volume24h: number;
  supply: {
    circulating: number;
    total: number;
    max?: number;
  };
  priceMetrics: {
    ath: number;
    athPercent: number;
    atl: number;
    atlPercent: number;
  };
  fundamentalScore: number;
  sentiment: 'bullish' | 'bearish' | 'neutral';
  riskLevel: 'low' | 'medium' | 'high';
}

export interface NewsItem {
  title: string;
  content: string;
  source: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  impact: 'high' | 'medium' | 'low';
  symbols: string[];
  publishedAt: string;
}

export interface WhaleActivity {
  symbol: string;
  amount: number;
  type: 'buy' | 'sell' | 'transfer';
  sentiment: 'bullish' | 'bearish' | 'neutral';
  impact: number;
  timestamp: number;
}

export class FundamentalScanner {
  private static instance: FundamentalScanner;
  private newsCache: NewsItem[] = [];
  private whaleActivityCache: WhaleActivity[] = [];
  private fundamentalCache: Map<string, FundamentalData> = new Map();

  public static getInstance(): FundamentalScanner {
    if (!FundamentalScanner.instance) {
      FundamentalScanner.instance = new FundamentalScanner();
    }
    return FundamentalScanner.instance;
  }

  /**
   * Scan fundamentals for a symbol
   */
  public async scanFundamentals(symbol: string): Promise<FundamentalData> {
    console.log(`🔍 Scanning fundamentals for ${symbol}`);
    
    // Check cache first
    const cached = this.fundamentalCache.get(symbol);
    if (cached && Date.now() - 300000 < 0) { // 5 minute cache
      return cached;
    }

    try {
      // Get market intelligence data
      const intelligence = await this.getMarketIntelligence(symbol);
      
      // Calculate fundamental score
      const fundamentalData: FundamentalData = {
        symbol,
        marketCap: intelligence.marketCap || 0,
        volume24h: intelligence.volume24h || 0,
        supply: {
          circulating: intelligence.circulatingSupply || 0,
          total: intelligence.totalSupply || 0,
          max: intelligence.maxSupply
        },
        priceMetrics: {
          ath: intelligence.ath || 0,
          athPercent: intelligence.athPercent || 0,
          atl: intelligence.atl || 0,
          atlPercent: intelligence.atlPercent || 0
        },
        fundamentalScore: this.calculateFundamentalScore(intelligence),
        sentiment: this.analyzeFundamentalSentiment(intelligence),
        riskLevel: this.assessRiskLevel(intelligence)
      };

      this.fundamentalCache.set(symbol, fundamentalData);
      return fundamentalData;
    } catch (error) {
      console.error(`❌ Error scanning fundamentals for ${symbol}:`, error);
      
      // Return default data on error
      return {
        symbol,
        marketCap: 0,
        volume24h: 0,
        supply: { circulating: 0, total: 0 },
        priceMetrics: { ath: 0, athPercent: 0, atl: 0, atlPercent: 0 },
        fundamentalScore: 50, // Neutral score
        sentiment: 'neutral',
        riskLevel: 'medium'
      };
    }
  }

  /**
   * Get market intelligence from Supabase
   */
  private async getMarketIntelligence(symbol: string): Promise<any> {
    try {
      const { data, error } = await supabase
        .from('market_intelligence')
        .select('*')
        .contains('symbols', [symbol])
        .order('processed_at', { ascending: false })
        .limit(10);

      if (error) {
        console.error('❌ Error fetching market intelligence:', error);
        return {};
      }

      // Aggregate intelligence data
      const aggregated = this.aggregateIntelligence(data || []);
      return aggregated;
    } catch (error) {
      console.error('❌ Error in getMarketIntelligence:', error);
      return {};
    }
  }

  /**
   * Aggregate intelligence data
   */
  private aggregateIntelligence(data: any[]): any {
    let sentiment = 'neutral';
    let impact = 'medium';
    let newsCount = 0;
    let positiveNews = 0;
    let negativeNews = 0;

    data.forEach(item => {
      newsCount++;
      if (item.sentiment === 'positive') positiveNews++;
      if (item.sentiment === 'negative') negativeNews++;
    });

    // Determine overall sentiment
    if (positiveNews > negativeNews * 1.5) sentiment = 'bullish';
    else if (negativeNews > positiveNews * 1.5) sentiment = 'bearish';

    return {
      newsCount,
      sentiment,
      impact,
      marketCap: 1000000000, // Placeholder
      volume24h: 100000000, // Placeholder
      circulatingSupply: 21000000, // Placeholder
      totalSupply: 21000000, // Placeholder
      ath: 100000, // Placeholder
      athPercent: -50, // Placeholder
      atl: 1000, // Placeholder
      atlPercent: 5000 // Placeholder
    };
  }

  /**
   * Calculate fundamental score
   */
  private calculateFundamentalScore(data: any): number {
    let score = 50; // Base score

    // Market cap factor
    if (data.marketCap > 10000000000) score += 15; // $10B+
    else if (data.marketCap > 1000000000) score += 10; // $1B+
    else if (data.marketCap > 100000000) score += 5; // $100M+

    // Volume factor
    if (data.volume24h > data.marketCap * 0.1) score += 10; // High volume
    else if (data.volume24h < data.marketCap * 0.01) score -= 5; // Low volume

    // News sentiment factor
    if (data.sentiment === 'bullish') score += 15;
    else if (data.sentiment === 'bearish') score -= 15;

    // ATH distance factor
    if (data.athPercent > -20) score += 10; // Near ATH
    else if (data.athPercent < -80) score -= 10; // Far from ATH

    return Math.max(0, Math.min(100, score));
  }

  /**
   * Analyze fundamental sentiment
   */
  private analyzeFundamentalSentiment(data: any): 'bullish' | 'bearish' | 'neutral' {
    let bullishFactors = 0;
    let bearishFactors = 0;

    // High volume
    if (data.volume24h > data.marketCap * 0.05) bullishFactors++;
    
    // News sentiment
    if (data.sentiment === 'bullish') bullishFactors += 2;
    else if (data.sentiment === 'bearish') bearishFactors += 2;

    // Price performance
    if (data.athPercent > -30) bullishFactors++;
    else if (data.athPercent < -70) bearishFactors++;

    if (bullishFactors > bearishFactors + 1) return 'bullish';
    if (bearishFactors > bullishFactors + 1) return 'bearish';
    return 'neutral';
  }

  /**
   * Assess risk level
   */
  private assessRiskLevel(data: any): 'low' | 'medium' | 'high' {
    let riskScore = 0;

    // Market cap risk
    if (data.marketCap < 100000000) riskScore += 2; // <$100M
    else if (data.marketCap < 1000000000) riskScore += 1; // <$1B

    // Volume risk
    if (data.volume24h < data.marketCap * 0.01) riskScore += 2; // Low volume

    // Volatility risk (simplified)
    if (Math.abs(data.athPercent) > 80) riskScore += 1;

    if (riskScore >= 4) return 'high';
    if (riskScore >= 2) return 'medium';
    return 'low';
  }

  /**
   * Get latest news for symbol
   */
  public async getLatestNews(symbol: string, limit = 5): Promise<NewsItem[]> {
    try {
      const { data, error } = await supabase
        .from('market_intelligence')
        .select('*')
        .eq('content_type', 'news')
        .contains('symbols', [symbol])
        .order('published_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('❌ Error fetching news:', error);
        return [];
      }

      return data?.map(item => ({
        title: item.title,
        content: item.content || '',
        source: item.source,
        sentiment: (item.sentiment === 'positive' || item.sentiment === 'negative') ? 
                  item.sentiment as 'positive' | 'negative' : 'neutral',
        impact: (item.impact_level === 'high' || item.impact_level === 'low') ? 
               item.impact_level as 'high' | 'low' : 'medium',
        symbols: item.symbols || [],
        publishedAt: item.published_at || item.processed_at
      })) || [];
    } catch (error) {
      console.error('❌ Error in getLatestNews:', error);
      return [];
    }
  }

  /**
   * Get whale activity for symbol
   */
  public async getWhaleActivity(symbol: string, limit = 10): Promise<WhaleActivity[]> {
    try {
      const { data, error } = await supabase
        .from('market_intelligence')
        .select('*')
        .eq('content_type', 'whale_alert')
        .contains('symbols', [symbol])
        .order('processed_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('❌ Error fetching whale activity:', error);
        return [];
      }

      return data?.map(item => {
        const metadata = typeof item.metadata === 'object' && item.metadata !== null ? 
                        item.metadata as Record<string, any> : {};
        return {
          symbol,
          amount: Number(metadata.amount) || 0,
          type: (metadata.type === 'buy' || metadata.type === 'sell') ? 
                metadata.type as 'buy' | 'sell' : 'transfer',
          sentiment: this.determineWhaleSentiment(metadata),
          impact: this.calculateWhaleImpact(metadata),
          timestamp: new Date(item.processed_at).getTime()
        };
      }) || [];
    } catch (error) {
      console.error('❌ Error in getWhaleActivity:', error);
      return [];
    }
  }

  /**
   * Determine whale sentiment
   */
  private determineWhaleSentiment(metadata: any): 'bullish' | 'bearish' | 'neutral' {
    if (metadata.type === 'buy' || metadata.transaction_type === 'buy') return 'bullish';
    if (metadata.type === 'sell' || metadata.transaction_type === 'sell') return 'bearish';
    return 'neutral';
  }

  /**
   * Calculate whale impact
   */
  private calculateWhaleImpact(metadata: any): number {
    const amount = metadata.amount || 0;
    
    // Simple impact calculation based on amount
    if (amount > 1000000) return 0.9; // High impact
    if (amount > 100000) return 0.6; // Medium impact
    return 0.3; // Low impact
  }

  /**
   * Generate fundamental summary
   */
  public async generateFundamentalSummary(symbol: string): Promise<string> {
    console.log(`📊 Generating fundamental summary for ${symbol}`);
    
    const fundamentals = await this.scanFundamentals(symbol);
    const news = await this.getLatestNews(symbol, 3);
    const whales = await this.getWhaleActivity(symbol, 3);

    let summary = `📊 FUNDAMENTAL ANALYSIS - ${symbol}\n\n`;
    
    // Score and sentiment
    summary += `🎯 Fundamental Score: ${fundamentals.fundamentalScore}/100\n`;
    summary += `📈 Sentiment: ${fundamentals.sentiment.toUpperCase()}\n`;
    summary += `⚠️ Risk Level: ${fundamentals.riskLevel.toUpperCase()}\n\n`;

    // Market metrics
    if (fundamentals.marketCap > 0) {
      summary += `💰 Market Cap: $${(fundamentals.marketCap / 1000000).toFixed(0)}M\n`;
    }
    if (fundamentals.volume24h > 0) {
      summary += `📊 24h Volume: $${(fundamentals.volume24h / 1000000).toFixed(0)}M\n`;
    }

    // Recent news
    if (news.length > 0) {
      summary += `\n📰 Recent News (${news.length}):\n`;
      news.forEach((item, i) => {
        const sentiment = item.sentiment === 'positive' ? '🟢' : 
                         item.sentiment === 'negative' ? '🔴' : '🟡';
        summary += `${sentiment} ${item.title.substring(0, 60)}...\n`;
      });
    }

    // Whale activity
    if (whales.length > 0) {
      summary += `\n🐋 Whale Activity (${whales.length} recent):\n`;
      whales.forEach(whale => {
        const emoji = whale.sentiment === 'bullish' ? '📈' : 
                     whale.sentiment === 'bearish' ? '📉' : '↔️';
        summary += `${emoji} ${whale.type.toUpperCase()} - Impact: ${(whale.impact * 100).toFixed(0)}%\n`;
      });
    }

    return summary;
  }

  /**
   * Check for fundamental alerts
   */
  public async checkFundamentalAlerts(symbol: string): Promise<string[]> {
    const alerts: string[] = [];
    
    try {
      const fundamentals = await this.scanFundamentals(symbol);
      const news = await this.getLatestNews(symbol, 5);
      const whales = await this.getWhaleActivity(symbol, 5);

      // High impact news
      const highImpactNews = news.filter(n => n.impact === 'high');
      if (highImpactNews.length > 0) {
        alerts.push(`🚨 ${highImpactNews.length} high-impact news items detected`);
      }

      // Significant whale activity
      const significantWhales = whales.filter(w => w.impact > 0.7);
      if (significantWhales.length > 0) {
        alerts.push(`🐋 ${significantWhales.length} significant whale transactions detected`);
      }

      // Risk level changes
      if (fundamentals.riskLevel === 'high') {
        alerts.push(`⚠️ High risk level detected for ${symbol}`);
      }

      // Fundamental score extremes
      if (fundamentals.fundamentalScore > 80) {
        alerts.push(`🎯 Strong fundamentals detected (Score: ${fundamentals.fundamentalScore})`);
      } else if (fundamentals.fundamentalScore < 30) {
        alerts.push(`📉 Weak fundamentals detected (Score: ${fundamentals.fundamentalScore})`);
      }

    } catch (error) {
      console.error('❌ Error checking fundamental alerts:', error);
    }

    return alerts;
  }

  /**
   * Reset cache
   */
  public resetCache(): void {
    this.newsCache = [];
    this.whaleActivityCache = [];
    this.fundamentalCache.clear();
    console.log('🔄 Fundamental scanner cache reset');
  }
}

export const fundamentalScanner = FundamentalScanner.getInstance();