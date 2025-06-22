
// Mock news aggregation service for testing
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
  private mockNews: NewsItem[] = [
    {
      id: '1',
      title: 'Bitcoin ETF Approval Boosts Market Confidence',
      content: 'Major institutional adoption continues...',
      impact: 'positive',
      source: 'CoinTelegraph',
      timestamp: Date.now() - 3600000
    },
    {
      id: '2',
      title: 'Ethereum 2.0 Staking Rewards Increase',
      content: 'Network upgrades show positive results...',
      impact: 'positive',
      source: 'CoinDesk',
      timestamp: Date.now() - 7200000
    },
    {
      id: '3',
      title: 'Regulatory Concerns in Southeast Asia',
      content: 'New restrictions may impact trading...',
      impact: 'negative',
      source: 'CryptoNews',
      timestamp: Date.now() - 14400000
    },
    {
      id: '4',
      title: 'DeFi Protocol Shows Strong Growth',
      content: 'Total value locked reaches new highs...',
      impact: 'positive',
      source: 'DeFiPulse',
      timestamp: Date.now() - 21600000
    },
    {
      id: '5',
      title: 'Market Consolidation Expected',
      content: 'Technical analysis suggests sideways movement...',
      impact: 'neutral',
      source: 'TradingView',
      timestamp: Date.now() - 28800000
    }
  ];

  private mockArticles: NewsArticle[] = [
    {
      id: 'art_1',
      title: 'Bitcoin Reaches New All-Time High Above $70,000',
      summary: 'Bitcoin surged to unprecedented levels amid institutional adoption and favorable regulatory developments.',
      url: 'https://example.com/bitcoin-ath',
      source: 'CoinTelegraph',
      publishedAt: new Date().toISOString(),
      impact: 'high',
      sentiment: 'positive',
      symbols: ['BTCUSDT']
    },
    {
      id: 'art_2',
      title: 'Ethereum Layer 2 Solutions See Massive Growth',
      summary: 'Transaction volume on Ethereum L2 networks increased by 300% this quarter.',
      url: 'https://example.com/eth-l2-growth',
      source: 'CoinDesk',
      publishedAt: new Date(Date.now() - 3600000).toISOString(),
      impact: 'medium',
      sentiment: 'positive',
      symbols: ['ETHUSDT']
    }
  ];

  private mockOnChainAlerts: OnChainAlert[] = [
    {
      id: 'alert_1',
      type: 'whale_transfer',
      symbol: 'BTC',
      amount: 1000,
      value: 67500000,
      fromAddress: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
      toAddress: '1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2',
      timestamp: Date.now() - 1800000,
      impact: 'high'
    },
    {
      id: 'alert_2',
      type: 'exchange_inflow',
      symbol: 'ETH',
      amount: 5000,
      value: 17600000,
      fromAddress: '0x742d35Cc6aB8C87B99cF4A8E2b5e5B4C8B5B5B5B',
      toAddress: '0xdFd5293D8e347dFe59E90eFd55b2956a1343963d',
      timestamp: Date.now() - 3600000,
      impact: 'medium',
      exchange: 'Binance'
    }
  ];

  async start(): Promise<void> {
    if (this.isRunning) return;
    
    console.log('📰 Starting News Aggregation Service...');
    this.isRunning = true;
    
    // Simulate service startup
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log('✅ News Aggregation Service started successfully');
  }

  stop(): void {
    if (!this.isRunning) return;
    
    console.log('📰 Stopping News Aggregation Service...');
    this.isRunning = false;
    
    console.log('✅ News Aggregation Service stopped');
  }

  isServiceRunning(): boolean {
    return this.isRunning;
  }

  getLatestNews(count: number = 5): NewsItem[] {
    console.log(`📰 Fetching ${count} latest news items for sentiment analysis`);
    return this.mockNews.slice(0, count);
  }

  getNewsBySymbol(symbol: string): NewsItem[] {
    // Filter news relevant to specific symbol
    return this.mockNews.filter(news => 
      news.title.toLowerCase().includes(symbol.toLowerCase().replace('USDT', ''))
    );
  }

  getHighImpactNews(limit: number = 10): NewsArticle[] {
    console.log(`📰 Fetching ${limit} high-impact news articles`);
    return this.mockArticles
      .filter(article => article.impact === 'high')
      .slice(0, limit);
  }

  getOnChainAlerts(limit: number = 10): OnChainAlert[] {
    console.log(`🐋 Fetching ${limit} on-chain alerts`);
    return this.mockOnChainAlerts.slice(0, limit);
  }
}

export const newsAggregationService = new NewsAggregationService();
