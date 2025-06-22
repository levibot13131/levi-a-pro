
// Mock news aggregation service for testing
export interface NewsItem {
  id: string;
  title: string;
  content: string;
  impact: 'positive' | 'negative' | 'neutral';
  source: string;
  timestamp: number;
}

class NewsAggregationService {
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
}

export const newsAggregationService = new NewsAggregationService();
