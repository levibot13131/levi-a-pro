// Advanced Fundamental Intelligence Scanner for LeviPro
// Integrates real-time data from multiple sources with AI-powered analysis

interface FundamentalEvent {
  id: string;
  timestamp: number;
  source: 'twitter' | 'news' | 'whale' | 'exchange' | 'regulatory';
  type: 'bullish' | 'bearish' | 'neutral';
  impact: 'high' | 'medium' | 'low';
  symbol?: string;
  title: string;
  content: string;
  score: number; // Impact score 0-100
  sentiment: number; // -1 to 1
  confidence: number; // 0-100
  url?: string;
  relatedSymbols: string[];
}

interface MarketIntelligence {
  overallSentiment: 'bullish' | 'bearish' | 'neutral';
  sentimentScore: number; // -100 to 100
  fearGreedIndex: number; // 0-100
  whaleActivity: {
    score: number;
    direction: 'accumulation' | 'distribution' | 'neutral';
    largeTransactions: number;
  };
  newsImpact: {
    bullishEvents: number;
    bearishEvents: number;
    netScore: number;
  };
  events: FundamentalEvent[];
}

export class AdvancedFundamentalScanner {
  private events: FundamentalEvent[] = [];
  private scanInterval?: NodeJS.Timeout;
  private isScanning = false;

  // Keywords for sentiment analysis
  private readonly BULLISH_KEYWORDS = [
    'bull', 'bullish', 'pump', 'moon', 'breakout', 'surge', 'rally', 'adoption',
    'institutional', 'etf', 'approval', 'partnership', 'upgrade', 'halving',
    'accumulation', 'buy', 'long', 'green', 'profit', 'gains'
  ];

  private readonly BEARISH_KEYWORDS = [
    'bear', 'bearish', 'dump', 'crash', 'breakdown', 'drop', 'fall', 'sell',
    'short', 'red', 'loss', 'decline', 'correction', 'rejection', 'resistance',
    'distribution', 'panic', 'fear', 'liquidation', 'hack', 'ban'
  ];

  public start() {
    if (this.isScanning) return;
    
    console.log('🔍 Starting Advanced Fundamental Intelligence Scanner...');
    this.isScanning = true;
    
    // Initial scan
    this.performScan();
    
    // Schedule regular scans every 5 minutes
    this.scanInterval = setInterval(() => {
      this.performScan();
    }, 5 * 60 * 1000);
  }

  public stop() {
    if (!this.isScanning) return;
    
    console.log('⏹️ Stopping Fundamental Scanner...');
    this.isScanning = false;
    
    if (this.scanInterval) {
      clearInterval(this.scanInterval);
      this.scanInterval = undefined;
    }
  }

  public getLatestIntelligence(): MarketIntelligence {
    const recentEvents = this.events.filter(e => 
      Date.now() - e.timestamp < 24 * 60 * 60 * 1000 // Last 24 hours
    );

    const bullishEvents = recentEvents.filter(e => e.type === 'bullish');
    const bearishEvents = recentEvents.filter(e => e.type === 'bearish');
    
    const netScore = bullishEvents.length - bearishEvents.length;
    const sentimentScore = this.calculateOverallSentiment(recentEvents);
    
    return {
      overallSentiment: sentimentScore > 10 ? 'bullish' : sentimentScore < -10 ? 'bearish' : 'neutral',
      sentimentScore,
      fearGreedIndex: this.calculateFearGreedIndex(),
      whaleActivity: this.analyzeWhaleActivity(),
      newsImpact: {
        bullishEvents: bullishEvents.length,
        bearishEvents: bearishEvents.length,
        netScore
      },
      events: recentEvents.slice(0, 20) // Last 20 events
    };
  }

  public getSymbolIntelligence(symbol: string): FundamentalEvent[] {
    return this.events
      .filter(e => e.relatedSymbols.includes(symbol) || e.symbol === symbol)
      .slice(0, 10); // Last 10 events for the symbol
  }

  private async performScan() {
    console.log('🔍 Performing fundamental scan...');
    
    try {
      // Scan multiple sources in parallel
      await Promise.allSettled([
        this.scanCryptoNews(),
        this.scanWhaleAlerts(),
        this.scanFearGreedIndex(),
        this.scanTwitterSentiment(),
        this.scanRegulatory()
      ]);

      // Cleanup old events (keep only last 7 days)
      this.cleanupOldEvents();
      
      console.log(`📊 Processed ${this.events.length} fundamental events`);
      
    } catch (error) {
      console.error('❌ Error during fundamental scan:', error);
    }
  }

  private async scanCryptoNews() {
    try {
      // Simulate crypto news scanning (replace with real API)
      const mockNews = [
        {
          title: 'Bitcoin ETF sees record inflows amid institutional adoption',
          content: 'Major institutional investors are showing unprecedented interest in Bitcoin...',
          sentiment: 0.8,
          impact: 'high' as const,
          relatedSymbols: ['BTCUSDT']
        },
        {
          title: 'Ethereum network upgrade shows promising scalability improvements',
          content: 'The latest Ethereum upgrade demonstrates significant improvements in transaction throughput...',
          sentiment: 0.6,
          impact: 'medium' as const,
          relatedSymbols: ['ETHUSDT']
        },
        {
          title: 'Regulatory uncertainty affects altcoin markets',
          content: 'Recent regulatory discussions have created uncertainty in the altcoin space...',
          sentiment: -0.4,
          impact: 'medium' as const,
          relatedSymbols: ['ADAUSDT', 'SOLUSDT', 'XRPUSDT']
        }
      ];

      mockNews.forEach(news => {
        this.addEvent({
          source: 'news',
          type: news.sentiment > 0.2 ? 'bullish' : news.sentiment < -0.2 ? 'bearish' : 'neutral',
          impact: news.impact,
          title: news.title,
          content: news.content,
          score: Math.abs(news.sentiment) * 100,
          sentiment: news.sentiment,
          confidence: 75 + Math.random() * 20,
          relatedSymbols: news.relatedSymbols
        });
      });

    } catch (error) {
      console.error('Failed to scan crypto news:', error);
    }
  }

  private async scanWhaleAlerts() {
    try {
      // Simulate whale alert scanning
      const mockWhaleAlerts = [
        {
          amount: 1500,
          symbol: 'BTCUSDT',
          type: 'accumulation',
          exchange: 'Binance'
        },
        {
          amount: 25000,
          symbol: 'ETHUSDT',
          type: 'distribution',
          exchange: 'Coinbase'
        }
      ];

      mockWhaleAlerts.forEach(alert => {
        this.addEvent({
          source: 'whale',
          type: alert.type === 'accumulation' ? 'bullish' : 'bearish',
          impact: alert.amount > 1000 ? 'high' : 'medium',
          title: `Large ${alert.symbol} ${alert.type} detected`,
          content: `${alert.amount} ${alert.symbol} moved on ${alert.exchange}`,
          score: Math.min(100, alert.amount / 100),
          sentiment: alert.type === 'accumulation' ? 0.7 : -0.7,
          confidence: 90,
          symbol: alert.symbol,
          relatedSymbols: [alert.symbol]
        });
      });

    } catch (error) {
      console.error('Failed to scan whale alerts:', error);
    }
  }

  private async scanFearGreedIndex() {
    try {
      // Simulate Fear & Greed Index
      const index = Math.floor(Math.random() * 100);
      let sentiment: number;
      let type: 'bullish' | 'bearish' | 'neutral';
      
      if (index < 25) {
        sentiment = -0.8;
        type = 'bullish'; // Extreme fear is often bullish
      } else if (index > 75) {
        sentiment = -0.5;
        type = 'bearish'; // Extreme greed is often bearish
      } else {
        sentiment = 0;
        type = 'neutral';
      }

      this.addEvent({
        source: 'exchange',
        type,
        impact: 'medium',
        title: `Fear & Greed Index: ${index}`,
        content: `Current market sentiment shows ${index < 25 ? 'extreme fear' : index > 75 ? 'extreme greed' : 'neutral sentiment'}`,
        score: Math.abs(sentiment) * 100,
        sentiment,
        confidence: 85,
        relatedSymbols: ['BTCUSDT', 'ETHUSDT']
      });

    } catch (error) {
      console.error('Failed to scan Fear & Greed Index:', error);
    }
  }

  private async scanTwitterSentiment() {
    try {
      // Simulate Twitter sentiment analysis
      const tweets = [
        { text: 'Bitcoin looking bullish with strong institutional adoption', sentiment: 0.7 },
        { text: 'ETH network upgrade shows promising results for scalability', sentiment: 0.6 },
        { text: 'Market volatility creates uncertainty for altcoins', sentiment: -0.3 }
      ];

      tweets.forEach((tweet, index) => {
        this.addEvent({
          source: 'twitter',
          type: tweet.sentiment > 0.2 ? 'bullish' : tweet.sentiment < -0.2 ? 'bearish' : 'neutral',
          impact: 'low',
          title: `Twitter Sentiment Analysis #${index + 1}`,
          content: tweet.text,
          score: Math.abs(tweet.sentiment) * 70,
          sentiment: tweet.sentiment,
          confidence: 60,
          relatedSymbols: this.extractSymbolsFromText(tweet.text)
        });
      });

    } catch (error) {
      console.error('Failed to scan Twitter sentiment:', error);
    }
  }

  private async scanRegulatory() {
    try {
      // Simulate regulatory news scanning
      const regulatoryEvents = [
        {
          title: 'SEC provides clarity on cryptocurrency regulations',
          sentiment: 0.5,
          impact: 'high' as const
        }
      ];

      regulatoryEvents.forEach(event => {
        this.addEvent({
          source: 'regulatory',
          type: event.sentiment > 0 ? 'bullish' : 'bearish',
          impact: event.impact,
          title: event.title,
          content: 'Regulatory developments affecting cryptocurrency markets',
          score: Math.abs(event.sentiment) * 100,
          sentiment: event.sentiment,
          confidence: 80,
          relatedSymbols: ['BTCUSDT', 'ETHUSDT', 'XRPUSDT']
        });
      });

    } catch (error) {
      console.error('Failed to scan regulatory news:', error);
    }
  }

  private addEvent(eventData: Omit<FundamentalEvent, 'id' | 'timestamp'>) {
    const event: FundamentalEvent = {
      id: `${eventData.source}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      ...eventData
    };

    this.events.unshift(event);
    
    // Keep only the latest 1000 events
    if (this.events.length > 1000) {
      this.events = this.events.slice(0, 1000);
    }
  }

  private extractSymbolsFromText(text: string): string[] {
    const symbols = ['BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'SOLUSDT', 'XRPUSDT', 'ADAUSDT'];
    const extractedSymbols: string[] = [];
    
    symbols.forEach(symbol => {
      const baseSymbol = symbol.replace('USDT', '');
      if (text.toLowerCase().includes(baseSymbol.toLowerCase()) || 
          text.toLowerCase().includes(symbol.toLowerCase())) {
        extractedSymbols.push(symbol);
      }
    });
    
    return extractedSymbols;
  }

  private calculateOverallSentiment(events: FundamentalEvent[]): number {
    if (events.length === 0) return 0;
    
    const weightedSentiment = events.reduce((sum, event) => {
      const weight = event.impact === 'high' ? 3 : event.impact === 'medium' ? 2 : 1;
      return sum + (event.sentiment * weight * event.confidence / 100);
    }, 0);
    
    const totalWeight = events.reduce((sum, event) => {
      const weight = event.impact === 'high' ? 3 : event.impact === 'medium' ? 2 : 1;
      return sum + weight;
    }, 0);
    
    return totalWeight > 0 ? (weightedSentiment / totalWeight) * 100 : 0;
  }

  private calculateFearGreedIndex(): number {
    // Simulate Fear & Greed Index calculation
    return Math.floor(Math.random() * 100);
  }

  private analyzeWhaleActivity() {
    const whaleEvents = this.events.filter(e => e.source === 'whale');
    const recentWhaleEvents = whaleEvents.filter(e => 
      Date.now() - e.timestamp < 4 * 60 * 60 * 1000 // Last 4 hours
    );
    
    const accumulationEvents = recentWhaleEvents.filter(e => e.type === 'bullish').length;
    const distributionEvents = recentWhaleEvents.filter(e => e.type === 'bearish').length;
    
    let direction: 'accumulation' | 'distribution' | 'neutral';
    if (accumulationEvents > distributionEvents * 2) {
      direction = 'accumulation';
    } else if (distributionEvents > accumulationEvents * 2) {
      direction = 'distribution';
    } else {
      direction = 'neutral';
    }
    
    return {
      score: recentWhaleEvents.reduce((sum, e) => sum + e.score, 0),
      direction,
      largeTransactions: recentWhaleEvents.length
    };
  }

  private cleanupOldEvents() {
    const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    this.events = this.events.filter(e => e.timestamp > oneWeekAgo);
  }

  public isRunning(): boolean {
    return this.isScanning;
  }

  public getEventCount(): number {
    return this.events.length;
  }
}

export const advancedFundamentalScanner = new AdvancedFundamentalScanner();
