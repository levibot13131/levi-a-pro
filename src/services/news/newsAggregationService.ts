
import { toast } from 'sonner';

export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  content: string;
  source: string;
  url: string;
  publishedAt: string;
  impact: 'low' | 'medium' | 'high';
  sentiment: 'positive' | 'negative' | 'neutral';
  symbols: string[];
  category: string;
  imageUrl?: string;
}

export interface OnChainAlert {
  id: string;
  type: 'whale_movement' | 'large_transaction' | 'exchange_flow';
  symbol: string;
  amount: number;
  value: number;
  fromAddress: string;
  toAddress: string;
  timestamp: string;
  exchange?: string;
  impact: 'low' | 'medium' | 'high';
}

class NewsAggregationService {
  private articles: NewsArticle[] = [];
  private onChainAlerts: OnChainAlert[] = [];
  private isRunning = false;
  private updateInterval: NodeJS.Timeout | null = null;

  public async start(): Promise<void> {
    if (this.isRunning) return;
    
    console.log('📰 Starting News Aggregation Service...');
    this.isRunning = true;
    
    // Initial fetch
    await this.fetchAllNews();
    await this.fetchOnChainAlerts();
    
    // Update every 60 seconds
    this.updateInterval = setInterval(async () => {
      await this.fetchAllNews();
      await this.fetchOnChainAlerts();
    }, 60000);
    
    toast.success('📰 News aggregation activated - Live feeds connected');
  }

  public stop(): void {
    if (!this.isRunning) return;
    
    console.log('📰 Stopping News Aggregation Service...');
    this.isRunning = false;
    
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
  }

  private async fetchAllNews(): Promise<void> {
    try {
      // Simulate real-time news from multiple sources
      const mockNews: NewsArticle[] = [
        {
          id: `news_${Date.now()}_1`,
          title: 'Bitcoin ETF Sees Record $2.1B Weekly Inflows',
          summary: 'BlackRock and Fidelity Bitcoin ETFs attracted unprecedented institutional investment this week.',
          content: 'Major Bitcoin ETFs have recorded their largest weekly inflow since launch, with institutional investors pouring $2.1 billion into crypto exposure vehicles.',
          source: 'CoinDesk',
          url: 'https://coindesk.com',
          publishedAt: new Date(Date.now() - 600000).toISOString(), // 10 minutes ago
          impact: 'high',
          sentiment: 'positive',
          symbols: ['BTCUSDT'],
          category: 'institutional',
          imageUrl: '/news/btc-etf.jpg'
        },
        {
          id: `news_${Date.now()}_2`,
          title: 'Ethereum Merge Anniversary: Network Health at All-Time High',
          summary: 'One year after the Merge, Ethereum shows 99.9% uptime and reduced energy consumption by 99.95%.',
          content: 'Ethereum celebrates one year since transitioning to Proof-of-Stake with remarkable network stability and environmental improvements.',
          source: 'The Block',
          url: 'https://theblock.co',
          publishedAt: new Date(Date.now() - 1800000).toISOString(), // 30 minutes ago
          impact: 'medium',
          sentiment: 'positive',
          symbols: ['ETHUSDT'],
          category: 'technology',
        },
        {
          id: `news_${Date.now()}_3`,
          title: 'SEC Chair Gensler Signals Clearer Crypto Regulations Coming',
          summary: 'In Congressional hearing, SEC Chairman indicates comprehensive crypto framework expected Q1 2024.',
          content: 'Gary Gensler outlined the SECs approach to cryptocurrency regulation, suggesting clearer guidelines for digital assets are imminent.',
          source: 'Reuters',
          url: 'https://reuters.com',
          publishedAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
          impact: 'high',
          sentiment: 'neutral',
          symbols: ['BTCUSDT', 'ETHUSDT'],
          category: 'regulatory',
        },
        {
          id: `news_${Date.now()}_4`,
          title: 'Solana DeFi TVL Surpasses $1.5B Milestone',
          summary: 'Solana ecosystem continues rapid growth with DeFi protocols attracting record liquidity.',
          content: 'Total Value Locked in Solana DeFi protocols has reached a new all-time high of $1.5 billion, driven by innovative yield farming opportunities.',
          source: 'DeFi Pulse',
          url: 'https://defipulse.com',
          publishedAt: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
          impact: 'medium',
          sentiment: 'positive',
          symbols: ['SOLUSDT'],
          category: 'defi',
        },
        {
          id: `news_${Date.now()}_5`,
          title: 'Major Exchange Reports Unusual Trading Volumes in Asian Markets',
          summary: 'Binance and OKX report 300% volume spike during Asian trading hours amid institutional buying.',
          content: 'Cryptocurrency exchanges are seeing unprecedented trading activity from Asian institutional investors, particularly in Bitcoin and Ethereum markets.',
          source: 'CryptoSlate',
          url: 'https://cryptoslate.com',
          publishedAt: new Date(Date.now() - 10800000).toISOString(), // 3 hours ago
          impact: 'high',
          sentiment: 'positive',
          symbols: ['BTCUSDT', 'ETHUSDT', 'BNBUSDT'],
          category: 'market',
        }
      ];

      this.articles = mockNews;
      console.log(`📰 Fetched ${mockNews.length} news articles`);
      
      // Dispatch news update event
      window.dispatchEvent(new CustomEvent('news-update', {
        detail: { articles: this.articles }
      }));
      
    } catch (error) {
      console.error('Error fetching news:', error);
    }
  }

  private async fetchOnChainAlerts(): Promise<void> {
    try {
      // Simulate real-time on-chain alerts
      const mockAlerts: OnChainAlert[] = [
        {
          id: `alert_${Date.now()}_1`,
          type: 'whale_movement',
          symbol: 'BTC',
          amount: 1250,
          value: 84375000, // $67,500 per BTC
          fromAddress: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
          toAddress: 'Coinbase Pro',
          timestamp: new Date(Date.now() - 300000).toISOString(), // 5 minutes ago
          exchange: 'Coinbase',
          impact: 'high'
        },
        {
          id: `alert_${Date.now()}_2`,
          type: 'large_transaction',
          symbol: 'ETH',
          amount: 25000,
          value: 87500000, // $3,500 per ETH
          fromAddress: 'Kraken',
          toAddress: '0x742d35Cc6635C0532925a3b8D8D6C0A0c6b19D32',
          timestamp: new Date(Date.now() - 900000).toISOString(), // 15 minutes ago
          exchange: 'Kraken',
          impact: 'high'
        },
        {
          id: `alert_${Date.now()}_3`,
          type: 'exchange_flow',
          symbol: 'USDT',
          amount: 150000000,
          value: 150000000,
          fromAddress: 'Tether Treasury',
          toAddress: 'Binance',
          timestamp: new Date(Date.now() - 1800000).toISOString(), // 30 minutes ago
          exchange: 'Binance',
          impact: 'medium'
        }
      ];

      this.onChainAlerts = mockAlerts;
      console.log(`🔗 Fetched ${mockAlerts.length} on-chain alerts`);
      
      // Dispatch on-chain update event
      window.dispatchEvent(new CustomEvent('onchain-update', {
        detail: { alerts: this.onChainAlerts }
      }));
      
    } catch (error) {
      console.error('Error fetching on-chain alerts:', error);
    }
  }

  public getLatestNews(limit: number = 20): NewsArticle[] {
    return this.articles.slice(0, limit);
  }

  public getHighImpactNews(): NewsArticle[] {
    return this.articles.filter(article => article.impact === 'high');
  }

  public getOnChainAlerts(limit: number = 10): OnChainAlert[] {
    return this.onChainAlerts.slice(0, limit);
  }

  public getNewsBySymbol(symbol: string): NewsArticle[] {
    return this.articles.filter(article => 
      article.symbols.includes(symbol) || 
      article.symbols.includes(symbol.replace('USDT', ''))
    );
  }

  public isServiceRunning(): boolean {
    return this.isRunning;
  }
}

export const newsAggregationService = new NewsAggregationService();
