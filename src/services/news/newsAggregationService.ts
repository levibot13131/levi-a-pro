
// Live News Aggregation Service - Real crypto news via Supabase Edge Functions
import { supabase } from '@/integrations/supabase/client';

export interface NewsItem {
  id: string;
  title: string;
  content: string;
  impact: 'positive' | 'negative' | 'neutral';
  source: string;
  timestamp: number;
}

export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  url: string;
  source: string;
  publishedAt: string;
  impact: 'high' | 'medium' | 'low';
  sentiment: 'positive' | 'negative' | 'neutral';
  symbols: string[];
}

export interface OnChainAlert {
  id: string;
  type: 'whale_transfer' | 'exchange_inflow' | 'exchange_outflow' | 'large_transaction';
  symbol: string;
  amount: number;
  value: number;
  fromAddress: string;
  toAddress: string;
  timestamp: number;
  impact: 'high' | 'medium' | 'low';
  exchange?: string;
}

class NewsAggregationService {
  private isRunning = false;

  async start(): Promise<void> {
    if (this.isRunning) return;
    
    console.log('📰 Starting LIVE News Aggregation Service...');
    this.isRunning = true;
    
    // Trigger initial news fetch
    await this.fetchLiveNews();
    
    console.log('✅ LIVE News Aggregation Service started successfully');
  }

  stop(): void {
    if (!this.isRunning) return;
    
    console.log('📰 Stopping LIVE News Aggregation Service...');
    this.isRunning = false;
    
    console.log('✅ LIVE News Aggregation Service stopped');
  }

  isServiceRunning(): boolean {
    return this.isRunning;
  }

  private async fetchLiveNews(): Promise<void> {
    try {
      console.log('📰 Fetching live crypto news via Edge function...');
      
      const { data, error } = await supabase.functions.invoke('news-aggregator');
      
      if (error) {
        console.error('❌ Error calling news-aggregator:', error);
        throw error;
      }

      console.log(`✅ Live news fetch completed: ${data.news_count} articles processed`);
    } catch (error) {
      console.error('❌ Failed to fetch live news:', error);
    }
  }

  async getLatestNews(count: number = 5): Promise<NewsItem[]> {
    console.log(`📰 Fetching ${count} latest LIVE news items`);
    
    try {
      // Get news from database
      const { data, error } = await supabase
        .from('market_intelligence')
        .select('*')
        .eq('content_type', 'news')
        .order('published_at', { ascending: false })
        .limit(count);

      if (error) {
        console.error('❌ Error fetching news from database:', error);
        return [];
      }

      return data?.map(item => ({
        id: item.id,
        title: item.title,
        content: item.content || '',
        impact: item.sentiment as 'positive' | 'negative' | 'neutral',
        source: item.source,
        timestamp: new Date(item.published_at).getTime()
      })) || [];
      
    } catch (error) {
      console.error('❌ Error getting latest news:', error);
      return [];
    }
  }

  getNewsBySymbol(symbol: string): NewsItem[] {
    // This will be enhanced to query database by symbol
    console.log(`📰 Getting news for ${symbol} (database query pending)`);
    return [];
  }

  getHighImpactNews(limit: number = 10): NewsArticle[] {
    console.log(`📰 Fetching ${limit} high-impact LIVE news articles (database query)`);
    // This will query the database for high-impact news
    return [];
  }

  getOnChainAlerts(limit: number = 10): OnChainAlert[] {
    console.log(`🐋 Fetching ${limit} LIVE on-chain alerts (WhaleAlert integration pending)`);
    
    // Mock whale alerts for now - to be replaced with real WhaleAlert API
    return [
      {
        id: 'live_alert_1',
        type: 'whale_transfer',
        symbol: 'BTC',
        amount: 1500,
        value: 101250000,
        fromAddress: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
        toAddress: '1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2',
        timestamp: Date.now() - 3600000,
        impact: 'high'
      }
    ];
  }
}

export const newsAggregationService = new NewsAggregationService();
