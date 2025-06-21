
import { toast } from 'sonner';

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  url: string;
  source: string;
  publishedAt: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  relatedAssets: string[];
  impact: 'low' | 'medium' | 'high';
}

export interface InfluencerPost {
  id: string;
  author: string;
  content: string;
  platform: 'twitter' | 'reddit' | 'telegram';
  followers: number;
  engagement: number;
  sentiment: 'bullish' | 'bearish' | 'neutral';
  relatedAssets: string[];
  publishedAt: string;
}

export interface WhaleActivity {
  id: string;
  walletAddress: string;
  transactionType: 'buy' | 'sell' | 'transfer';
  amount: number;
  asset: string;
  value: number;
  timestamp: string;
  exchange?: string;
}

export interface FundamentalData {
  news: NewsItem[];
  socialPosts: InfluencerPost[];
  whaleActivity: WhaleActivity[];
  marketSentiment: {
    overall: 'bullish' | 'bearish' | 'neutral';
    confidence: number;
    sources: string[];
  };
  lastUpdated: number;
}

class FundamentalDataService {
  private newsCache: NewsItem[] = [];
  private socialCache: InfluencerPost[] = [];
  private whaleCache: WhaleActivity[] = [];
  private lastUpdate = 0;
  private updateInterval = 300000; // 5 minutes

  async getFundamentalData(symbols: string[]): Promise<FundamentalData> {
    const now = Date.now();
    
    if (now - this.lastUpdate > this.updateInterval) {
      await this.updateAllData(symbols);
      this.lastUpdate = now;
    }

    const marketSentiment = this.calculateOverallSentiment();

    return {
      news: this.newsCache,
      socialPosts: this.socialCache,
      whaleActivity: this.whaleCache,
      marketSentiment,
      lastUpdated: this.lastUpdate
    };
  }

  private async updateAllData(symbols: string[]): Promise<void> {
    console.log('🔍 Updating fundamental data for:', symbols.join(', '));
    
    try {
      // Fetch news data (mock implementation - would integrate with CoinTelegraph, CoinDesk APIs)
      this.newsCache = await this.fetchCryptoNews(symbols);
      
      // Fetch social sentiment (mock implementation - would integrate with Twitter API)
      this.socialCache = await this.fetchSocialSentiment(symbols);
      
      // Fetch whale activity (mock implementation - would integrate with Whale Alert API)
      this.whaleCache = await this.fetchWhaleActivity(symbols);
      
      console.log('✅ Fundamental data updated');
    } catch (error) {
      console.error('❌ Error updating fundamental data:', error);
    }
  }

  private async fetchCryptoNews(symbols: string[]): Promise<NewsItem[]> {
    // Mock implementation - in production would use CoinTelegraph, CoinDesk, CryptoPanic APIs
    const mockNews: NewsItem[] = [
      {
        id: 'news-1',
        title: 'Bitcoin Institutional Adoption Accelerates',
        summary: 'Major corporations continue to add Bitcoin to their treasury reserves, signaling strong institutional confidence.',
        url: 'https://cointelegraph.com/news/bitcoin-institutional-adoption',
        source: 'Cointelegraph',
        publishedAt: new Date(Date.now() - 1800000).toISOString(),
        sentiment: 'positive',
        relatedAssets: ['BTCUSDT'],
        impact: 'high'
      },
      {
        id: 'news-2',
        title: 'Ethereum Layer 2 Solutions See Record Usage',
        summary: 'Polygon and Arbitrum report significant transaction volume increases as users seek lower fees.',
        url: 'https://coindesk.com/ethereum-layer2-growth',
        source: 'CoinDesk',
        publishedAt: new Date(Date.now() - 3600000).toISOString(),
        sentiment: 'positive',
        relatedAssets: ['ETHUSDT'],
        impact: 'medium'
      },
      {
        id: 'news-3',
        title: 'Regulatory Clarity Expected for Crypto Markets',
        summary: 'Government officials hint at comprehensive crypto regulation framework coming this quarter.',
        url: 'https://cryptonews.com/regulatory-update',
        source: 'CryptoNews',
        publishedAt: new Date(Date.now() - 7200000).toISOString(),
        sentiment: 'neutral',
        relatedAssets: ['BTCUSDT', 'ETHUSDT'],
        impact: 'high'
      }
    ];

    return mockNews.filter(news => 
      symbols.some(symbol => news.relatedAssets.includes(symbol))
    );
  }

  private async fetchSocialSentiment(symbols: string[]): Promise<InfluencerPost[]> {
    // Mock implementation - in production would use Twitter API, Reddit API
    const mockPosts: InfluencerPost[] = [
      {
        id: 'post-1',
        author: 'CryptoWhale',
        content: 'BTC showing strong support at $42k. Looking for a bounce to $45k with good volume.',
        platform: 'twitter',
        followers: 500000,
        engagement: 1250,
        sentiment: 'bullish',
        relatedAssets: ['BTCUSDT'],
        publishedAt: new Date(Date.now() - 900000).toISOString()
      },
      {
        id: 'post-2',
        author: 'EthereumExpert',
        content: 'ETH/BTC ratio looking oversold. Could see rotation back into ETH soon.',
        platform: 'twitter',
        followers: 250000,
        engagement: 800,
        sentiment: 'bullish',
        relatedAssets: ['ETHUSDT'],
        publishedAt: new Date(Date.now() - 1800000).toISOString()
      },
      {
        id: 'post-3',
        author: 'r/CryptoCurrency',
        content: 'Market sentiment seems mixed with upcoming economic data releases.',
        platform: 'reddit',
        followers: 1000000,
        engagement: 2500,
        sentiment: 'neutral',
        relatedAssets: ['BTCUSDT', 'ETHUSDT'],
        publishedAt: new Date(Date.now() - 3600000).toISOString()
      }
    ];

    return mockPosts.filter(post => 
      symbols.some(symbol => post.relatedAssets.includes(symbol))
    );
  }

  private async fetchWhaleActivity(symbols: string[]): Promise<WhaleActivity[]> {
    // Mock implementation - in production would use Whale Alert API
    const mockWhaleActivity: WhaleActivity[] = [
      {
        id: 'whale-1',
        walletAddress: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
        transactionType: 'buy',
        amount: 500,
        asset: 'BTC',
        value: 21500000,
        timestamp: new Date(Date.now() - 1200000).toISOString(),
        exchange: 'Binance'
      },
      {
        id: 'whale-2',
        walletAddress: '0x742d35cc6634C0532925a3b8D0b4E0D8B3c8D4a5',
        transactionType: 'sell',
        amount: 2500,
        asset: 'ETH',
        value: 6250000,
        timestamp: new Date(Date.now() - 2400000).toISOString(),
        exchange: 'Coinbase'
      }
    ];

    return mockWhaleActivity.filter(activity => 
      symbols.some(symbol => symbol.includes(activity.asset))
    );
  }

  private calculateOverallSentiment(): { overall: 'bullish' | 'bearish' | 'neutral'; confidence: number; sources: string[] } {
    const allSentiments = [
      ...this.newsCache.map(n => n.sentiment),
      ...this.socialCache.map(s => s.sentiment === 'bullish' ? 'positive' : s.sentiment === 'bearish' ? 'negative' : 'neutral')
    ];

    if (allSentiments.length === 0) {
      return { overall: 'neutral', confidence: 0, sources: [] };
    }

    const positive = allSentiments.filter(s => s === 'positive').length;
    const negative = allSentiments.filter(s => s === 'negative').length;
    const neutral = allSentiments.filter(s => s === 'neutral').length;

    const total = allSentiments.length;
    const positivePct = positive / total;
    const negativePct = negative / total;

    let overall: 'bullish' | 'bearish' | 'neutral';
    if (positivePct > 0.4) overall = 'bullish';
    else if (negativePct > 0.4) overall = 'bearish';
    else overall = 'neutral';

    const confidence = Math.max(positivePct, negativePct) * 100;
    const sources = Array.from(new Set([
      ...this.newsCache.map(n => n.source),
      ...this.socialCache.map(s => s.platform)
    ]));

    return { overall, confidence, sources };
  }
}

export const fundamentalDataService = new FundamentalDataService();
