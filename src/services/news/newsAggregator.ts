/**
 * News Aggregation Service
 * Integrates multiple news sources for comprehensive market intelligence
 */

import { supabase } from '@/integrations/supabase/client';

export interface NewsSource {
  id: string;
  name: string;
  url: string;
  priority: number;
  reliability: number;
}

export interface AggregatedNews {
  id: string;
  title: string;
  content: string;
  source: string;
  url: string;
  published_at: string;
  sentiment: 'bullish' | 'bearish' | 'neutral';
  impact_level: 'low' | 'medium' | 'high';
  symbols: string[];
  tags: string[];
}

export class NewsAggregator {
  private static instance: NewsAggregator;
  
  private newsSources: NewsSource[] = [
    { id: 'coindesk', name: 'CoinDesk', url: 'https://api.coindesk.com', priority: 1, reliability: 0.9 },
    { id: 'cointelegraph', name: 'Cointelegraph', url: 'https://api.cointelegraph.com', priority: 2, reliability: 0.85 },
    { id: 'cryptopanic', name: 'CryptoPanic', url: 'https://cryptopanic.com/api/v1', priority: 3, reliability: 0.8 },
    { id: 'coingecko', name: 'CoinGecko News', url: 'https://api.coingecko.com/api/v3', priority: 4, reliability: 0.75 }
  ];

  public static getInstance(): NewsAggregator {
    if (!NewsAggregator.instance) {
      NewsAggregator.instance = new NewsAggregator();
    }
    return NewsAggregator.instance;
  }

  /**
   * Aggregate news from all sources
   */
  public async aggregateNews(): Promise<AggregatedNews[]> {
    console.log('📰 Starting news aggregation from multiple sources...');

    const allNews: AggregatedNews[] = [];

    try {
      // Aggregate from each source
      for (const source of this.newsSources) {
        try {
          const sourceNews = await this.fetchFromSource(source);
          allNews.push(...sourceNews);
        } catch (error) {
          console.error(`❌ Failed to fetch from ${source.name}:`, error);
        }
      }

      // Deduplicate and sort by relevance
      const uniqueNews = this.deduplicateNews(allNews);
      const sortedNews = this.sortByRelevance(uniqueNews);

      // Store in database
      await this.storeNewsInDatabase(sortedNews);

      console.log(`✅ Aggregated ${sortedNews.length} unique news items`);
      return sortedNews;

    } catch (error) {
      console.error('❌ News aggregation failed:', error);
      return [];
    }
  }

  /**
   * Fetch news from a specific source
   */
  private async fetchFromSource(source: NewsSource): Promise<AggregatedNews[]> {
    console.log(`🔍 Fetching news from ${source.name}...`);

    // Mock news data for demonstration
    // In production, replace with actual API calls
    const mockNews: AggregatedNews[] = [
      {
        id: `${source.id}_1`,
        title: 'Bitcoin Reaches New All-Time High Amid ETF Optimism',
        content: 'Bitcoin has surged to unprecedented levels as institutional investors show increased interest...',
        source: source.name,
        url: `${source.url}/news/bitcoin-ath`,
        published_at: new Date().toISOString(),
        sentiment: 'bullish',
        impact_level: 'high',
        symbols: ['BTCUSDT'],
        tags: ['bitcoin', 'etf', 'institutional']
      },
      {
        id: `${source.id}_2`,
        title: 'Ethereum Layer 2 Solutions Show Massive Growth',
        content: 'Layer 2 scaling solutions are experiencing unprecedented adoption rates...',
        source: source.name,
        url: `${source.url}/news/eth-l2-growth`,
        published_at: new Date(Date.now() - 3600000).toISOString(),
        sentiment: 'bullish',
        impact_level: 'medium',
        symbols: ['ETHUSDT', 'MATICUSDT', 'ARBUSDT'],
        tags: ['ethereum', 'layer2', 'scaling']
      },
      {
        id: `${source.id}_3`,
        title: 'Regulatory Uncertainty Clouds Crypto Market',
        content: 'New regulatory proposals may impact cryptocurrency trading and investment...',
        source: source.name,
        url: `${source.url}/news/regulatory-uncertainty`,
        published_at: new Date(Date.now() - 7200000).toISOString(),
        sentiment: 'bearish',
        impact_level: 'medium',
        symbols: ['BTCUSDT', 'ETHUSDT', 'BNBUSDT'],
        tags: ['regulation', 'government', 'policy']
      }
    ];

    return mockNews;
  }

  /**
   * Remove duplicate news articles
   */
  private deduplicateNews(news: AggregatedNews[]): AggregatedNews[] {
    const uniqueNews = new Map<string, AggregatedNews>();

    news.forEach(article => {
      const key = this.generateNewsKey(article);
      
      // Keep the article from the most reliable source
      if (!uniqueNews.has(key) || this.getSourceReliability(article.source) > this.getSourceReliability(uniqueNews.get(key)!.source)) {
        uniqueNews.set(key, article);
      }
    });

    return Array.from(uniqueNews.values());
  }

  /**
   * Generate a unique key for news deduplication
   */
  private generateNewsKey(article: AggregatedNews): string {
    // Use title similarity and symbols for deduplication
    const normalizedTitle = article.title.toLowerCase().replace(/[^a-z0-9]/g, '');
    const symbolsKey = article.symbols.sort().join('');
    return `${normalizedTitle.substring(0, 50)}_${symbolsKey}`;
  }

  /**
   * Get source reliability score
   */
  private getSourceReliability(sourceName: string): number {
    const source = this.newsSources.find(s => s.name === sourceName);
    return source ? source.reliability : 0.5;
  }

  /**
   * Sort news by relevance and impact
   */
  private sortByRelevance(news: AggregatedNews[]): AggregatedNews[] {
    return news.sort((a, b) => {
      // Sort by impact level first
      const impactScore = { high: 3, medium: 2, low: 1 };
      const impactDiff = impactScore[b.impact_level] - impactScore[a.impact_level];
      
      if (impactDiff !== 0) return impactDiff;
      
      // Then by source reliability
      const reliabilityDiff = this.getSourceReliability(b.source) - this.getSourceReliability(a.source);
      
      if (reliabilityDiff !== 0) return reliabilityDiff;
      
      // Finally by recency
      return new Date(b.published_at).getTime() - new Date(a.published_at).getTime();
    });
  }

  /**
   * Store aggregated news in database
   */
  private async storeNewsInDatabase(news: AggregatedNews[]): Promise<void> {
    try {
      const newsToInsert = news.map(article => ({
        title: article.title,
        content: article.content,
        content_type: 'news',
        source: article.source,
        published_at: article.published_at,
        sentiment: article.sentiment,
        impact_level: article.impact_level,
        symbols: article.symbols,
        metadata: {
          url: article.url,
          tags: article.tags,
          reliability: this.getSourceReliability(article.source)
        }
      }));

      const { error } = await supabase
        .from('market_intelligence')
        .upsert(newsToInsert, { 
          onConflict: 'title,source',
          ignoreDuplicates: true 
        });

      if (error) throw error;
      
      console.log(`✅ Stored ${news.length} news articles in database`);
    } catch (error) {
      console.error('❌ Failed to store news in database:', error);
    }
  }

  /**
   * Get latest news for a specific symbol
   */
  public async getNewsForSymbol(symbol: string, limit: number = 10): Promise<AggregatedNews[]> {
    try {
      const { data, error } = await supabase
        .from('market_intelligence')
        .select('*')
        .eq('content_type', 'news')
        .contains('symbols', [symbol])
        .order('published_at', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return data.map(item => ({
        id: item.id,
        title: item.title,
        content: item.content || '',
        source: item.source,
        url: (item.metadata as any)?.url || '',
        published_at: item.published_at || '',
        sentiment: item.sentiment as 'bullish' | 'bearish' | 'neutral',
        impact_level: item.impact_level as 'low' | 'medium' | 'high',
        symbols: item.symbols || [],
        tags: (item.metadata as any)?.tags || []
      }));

    } catch (error) {
      console.error(`❌ Failed to get news for ${symbol}:`, error);
      return [];
    }
  }

  /**
   * Get market sentiment based on recent news
   */
  public async getMarketSentiment(): Promise<any> {
    try {
      const { data, error } = await supabase
        .from('market_intelligence')
        .select('sentiment, impact_level')
        .eq('content_type', 'news')
        .gte('published_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

      if (error) throw error;

      const sentimentCounts = { bullish: 0, bearish: 0, neutral: 0 };
      let weightedSentiment = 0;

      data.forEach(item => {
        sentimentCounts[item.sentiment as keyof typeof sentimentCounts]++;
        
        const weight = item.impact_level === 'high' ? 3 : item.impact_level === 'medium' ? 2 : 1;
        const sentimentValue = item.sentiment === 'bullish' ? 1 : item.sentiment === 'bearish' ? -1 : 0;
        
        weightedSentiment += sentimentValue * weight;
      });

      const totalNews = data.length;
      const overallSentiment = totalNews > 0 ? weightedSentiment / (totalNews * 2) : 0; // Normalize to -1 to 1

      return {
        overall_sentiment: overallSentiment,
        sentiment_distribution: sentimentCounts,
        total_news: totalNews,
        classification: overallSentiment > 0.3 ? 'bullish' : overallSentiment < -0.3 ? 'bearish' : 'neutral'
      };

    } catch (error) {
      console.error('❌ Failed to calculate market sentiment:', error);
      return {
        overall_sentiment: 0,
        sentiment_distribution: { bullish: 0, bearish: 0, neutral: 0 },
        total_news: 0,
        classification: 'neutral'
      };
    }
  }

  /**
   * Schedule regular news aggregation
   */
  public async scheduleNewsAggregation(): Promise<void> {
    // Run every 30 minutes
    setInterval(async () => {
      try {
        await this.aggregateNews();
      } catch (error) {
        console.error('❌ Scheduled news aggregation failed:', error);
      }
    }, 30 * 60 * 1000);

    console.log('⏰ News aggregation scheduled every 30 minutes');
  }
}

export const newsAggregator = NewsAggregator.getInstance();
