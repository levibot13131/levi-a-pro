
import { supabase } from '@/integrations/supabase/client';

export interface NewsItem {
  title: string;
  content: string;
  url: string;
  published_at: string;
  source: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  symbols: string[];
}

export interface WhaleAlert {
  amount: number;
  symbol: string;
  type: 'buy' | 'sell';
  tx_hash: string;
  timestamp: string;
  blockchain: string;
}

export interface MacroEvent {
  title: string;
  date: string;
  impact: 'low' | 'medium' | 'high';
  actual?: string;
  forecast?: string;
  previous?: string;
}

export interface FearGreedData {
  value: number;
  classification: string;
  timestamp: string;
}

class FundamentalsIngestionService {
  private isRunning = false;
  private ingestionInterval?: NodeJS.Timeout;

  start() {
    if (this.isRunning) return;
    
    console.log('🔄 Starting fundamentals ingestion service');
    this.isRunning = true;
    
    // Run immediately
    this.performIngestion();
    
    // Then every 5 minutes
    this.ingestionInterval = setInterval(() => {
      this.performIngestion();
    }, 5 * 60 * 1000);
  }

  stop() {
    if (!this.isRunning) return;
    
    console.log('⏹️ Stopping fundamentals ingestion service');
    this.isRunning = false;
    
    if (this.ingestionInterval) {
      clearInterval(this.ingestionInterval);
      this.ingestionInterval = undefined;
    }
  }

  private async performIngestion() {
    console.log('📰 Performing fundamentals ingestion cycle');
    
    try {
      await Promise.all([
        this.ingestNews(),
        this.ingestWhaleAlerts(),
        this.ingestMacroEvents(),
        this.ingestFearGreedIndex()
      ]);
      
      console.log('✅ Fundamentals ingestion completed');
    } catch (error) {
      console.error('❌ Fundamentals ingestion failed:', error);
    }
  }

  private async ingestNews() {
    console.log('📰 Ingesting crypto news...');
    
    // Mock news data for now - replace with real API calls
    const mockNews: NewsItem[] = [
      {
        title: 'Bitcoin Tests Key Resistance Level at $67,000',
        content: 'Bitcoin is approaching a critical resistance level that could determine the next major price movement...',
        url: 'https://example.com/news/1',
        published_at: new Date().toISOString(),
        source: 'CoinDesk',
        sentiment: 'positive',
        symbols: ['BTCUSDT']
      },
      {
        title: 'Ethereum Layer 2 Adoption Surges 300%',
        content: 'Layer 2 solutions are seeing unprecedented adoption as gas fees on mainnet remain elevated...',
        url: 'https://example.com/news/2',
        published_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        source: 'CoinTelegraph',
        sentiment: 'positive',
        symbols: ['ETHUSDT']
      },
      {
        title: 'Major Exchange Reports Security Breach',
        content: 'A significant cryptocurrency exchange has reported unauthorized access to user accounts...',
        url: 'https://example.com/news/3',
        published_at: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
        source: 'CryptoNews',
        sentiment: 'negative',
        symbols: ['BTCUSDT', 'ETHUSDT']
      }
    ];

    for (const news of mockNews) {
      await supabase
        .from('market_intelligence')
        .upsert({
          source: news.source,
          content_type: 'news',
          title: news.title,
          content: news.content,
          symbols: news.symbols,
          sentiment: news.sentiment,
          impact_level: 'medium',
          published_at: news.published_at,
          processed_at: new Date().toISOString(),
          is_processed: true,
          metadata: {
            url: news.url
          }
        });
    }

    console.log(`✅ Ingested ${mockNews.length} news items`);
  }

  private async ingestWhaleAlerts() {
    console.log('🐋 Ingesting whale alerts...');
    
    // Mock whale alerts - replace with WhaleAlert API
    const mockAlerts: WhaleAlert[] = [
      {
        amount: 15000000,
        symbol: 'BTC',
        type: 'buy',
        tx_hash: '0x1234567890abcdef...',
        timestamp: new Date().toISOString(),
        blockchain: 'bitcoin'
      },
      {
        amount: 25000000,
        symbol: 'ETH',
        type: 'sell',
        tx_hash: '0xabcdef1234567890...',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        blockchain: 'ethereum'
      }
    ];

    for (const alert of mockAlerts) {
      await supabase
        .from('market_intelligence')
        .upsert({
          source: 'WhaleAlert',
          content_type: 'whale_alert',
          title: `Large ${alert.type.toUpperCase()}: $${(alert.amount / 1000000).toFixed(1)}M ${alert.symbol}`,
          content: `Whale transaction detected: ${alert.amount.toLocaleString()} USD worth of ${alert.symbol}`,
          symbols: [`${alert.symbol}USDT`],
          sentiment: alert.type === 'buy' ? 'positive' : 'negative',
          impact_level: alert.amount > 50000000 ? 'high' : 'medium',
          published_at: alert.timestamp,
          processed_at: new Date().toISOString(),
          is_processed: true,
          metadata: {
            tx_hash: alert.tx_hash,
            blockchain: alert.blockchain,
            amount: alert.amount,
            type: alert.type
          }
        });
    }

    console.log(`✅ Ingested ${mockAlerts.length} whale alerts`);
  }

  private async ingestMacroEvents() {
    console.log('📅 Ingesting macro events...');
    
    // Mock macro events - replace with Economic Calendar API
    const mockEvents: MacroEvent[] = [
      {
        title: 'FOMC Interest Rate Decision',
        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        impact: 'high',
        forecast: '5.25-5.50%',
        previous: '5.25-5.50%'
      },
      {
        title: 'US CPI Data Release',
        date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        impact: 'high',
        forecast: '3.2%',
        previous: '3.4%'
      }
    ];

    for (const event of mockEvents) {
      await supabase
        .from('market_intelligence')
        .upsert({
          source: 'Economic Calendar',
          content_type: 'macro_event',
          title: event.title,
          content: `Scheduled for ${new Date(event.date).toLocaleDateString()}`,
          symbols: ['BTCUSDT', 'ETHUSDT'], // Macro events affect all assets
          sentiment: 'neutral',
          impact_level: event.impact,
          published_at: event.date,
          processed_at: new Date().toISOString(),
          is_processed: true,
          metadata: {
            forecast: event.forecast,
            previous: event.previous,
            event_type: 'macro'
          }
        });
    }

    console.log(`✅ Ingested ${mockEvents.length} macro events`);
  }

  private async ingestFearGreedIndex() {
    console.log('😱 Ingesting Fear & Greed Index...');
    
    // Mock fear & greed data - replace with alternative.me API
    const fearGreedValue = Math.floor(Math.random() * 100);
    let classification = 'Neutral';
    
    if (fearGreedValue <= 25) classification = 'Extreme Fear';
    else if (fearGreedValue <= 45) classification = 'Fear';
    else if (fearGreedValue <= 55) classification = 'Neutral';
    else if (fearGreedValue <= 75) classification = 'Greed';
    else classification = 'Extreme Greed';

    await supabase
      .from('market_intelligence')
      .upsert({
        source: 'Alternative.me',
        content_type: 'fear_greed_index',
        title: `Fear & Greed Index: ${fearGreedValue}`,
        content: `Current market sentiment: ${classification}`,
        symbols: ['BTCUSDT'],
        sentiment: fearGreedValue > 50 ? 'positive' : 'negative',
        impact_level: 'medium',
        published_at: new Date().toISOString(),
        processed_at: new Date().toISOString(),
        is_processed: true,
        metadata: {
          value: fearGreedValue,
          classification
        }
      });

    console.log(`✅ Ingested Fear & Greed Index: ${fearGreedValue} (${classification})`);
  }

  async getLatestData() {
    const { data: latestData } = await supabase
      .from('market_intelligence')
      .select('*')
      .order('processed_at', { ascending: false })
      .limit(50);

    return {
      news: latestData?.filter(item => item.content_type === 'news') || [],
      whaleAlerts: latestData?.filter(item => item.content_type === 'whale_alert') || [],
      macroEvents: latestData?.filter(item => item.content_type === 'macro_event') || [],
      fearGreedIndex: latestData?.find(item => item.content_type === 'fear_greed_index')
    };
  }

  getIngestionStatus() {
    return {
      isRunning: this.isRunning,
      lastRun: new Date().toISOString(),
      status: this.isRunning ? 'Active' : 'Stopped'
    };
  }
}

export const fundamentalsIngestion = new FundamentalsIngestionService();
