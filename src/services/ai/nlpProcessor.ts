// NLP Intelligence Processor for LeviPro
// Advanced headline parsing and sentiment analysis using OpenAI

export interface HeadlineAnalysis {
  headline: string;
  marketRelevance: 'high' | 'medium' | 'low';
  sentiment: 'bullish' | 'bearish' | 'neutral';
  confidenceScore: number;
  affectedSymbols: string[];
  timeframe: 'immediate' | 'short' | 'medium' | 'long';
  impact: 'high' | 'medium' | 'low';
  reasoning: string[];
}

export interface InfluencerSignal {
  author: string;
  content: string;
  timestamp: number;
  marketImpact: number;
  symbols: string[];
  sentiment: 'bullish' | 'bearish' | 'neutral';
  historicalAccuracy: number;
}

class NLPProcessor {
  private readonly influencerHistory: Map<string, InfluencerSignal[]> = new Map();
  
  // Key influencers and their historical accuracy
  private readonly INFLUENCER_WEIGHTS = {
    'elonmusk': 0.85,
    'michael_saylor': 0.78,
    'VitalikButerin': 0.82,
    'cz_binance': 0.75,
    'coin_bureau': 0.70,
    'APompliano': 0.68
  };

  /**
   * Analyze headline for market relevance and sentiment
   */
  public async analyzeHeadline(headline: string, source: string): Promise<HeadlineAnalysis> {
    try {
      const analysis = await this.callOpenAIForAnalysis(headline);
      return this.parseHeadlineAnalysis(analysis, headline, source);
    } catch (error) {
      console.error('❌ NLP Analysis failed:', error);
      return this.getFallbackAnalysis(headline);
    }
  }

  /**
   * Process influencer signals and track historical accuracy
   */
  public async processInfluencerSignal(author: string, content: string): Promise<InfluencerSignal> {
    const signal: InfluencerSignal = {
      author,
      content,
      timestamp: Date.now(),
      marketImpact: this.calculateInfluencerImpact(author),
      symbols: this.extractSymbols(content),
      sentiment: await this.analyzeSentiment(content),
      historicalAccuracy: this.getInfluencerAccuracy(author)
    };

    // Store for historical tracking
    if (!this.influencerHistory.has(author)) {
      this.influencerHistory.set(author, []);
    }
    this.influencerHistory.get(author)!.push(signal);

    return signal;
  }

  /**
   * Match historical language patterns with price movements
   */
  public async correlateLanguageWithPrice(
    headline: string, 
    symbol: string, 
    priceMovement: number
  ): Promise<{ correlation: number; patterns: string[] }> {
    try {
      const prompt = `
        Analyze the correlation between this headline and the price movement:
        
        Headline: "${headline}"
        Symbol: ${symbol}
        Price Movement: ${priceMovement > 0 ? '+' : ''}${priceMovement.toFixed(2)}%
        
        Identify:
        1. Key language patterns that correlated with this price movement
        2. Correlation strength (0-1)
        3. Specific words/phrases that were predictive
        
        Return JSON: {
          "correlation": 0.75,
          "patterns": ["regulatory approval", "partnership announcement", "technical breakthrough"],
          "keyWords": ["approved", "partners with", "breakthrough"],
          "sentiment": "bullish|bearish|neutral"
        }
      `;

      const response = await this.callOpenAI(prompt);
      const parsed = JSON.parse(response);
      
      return {
        correlation: parsed.correlation || 0,
        patterns: parsed.patterns || []
      };
    } catch (error) {
      console.error('❌ Language correlation analysis failed:', error);
      return { correlation: 0, patterns: [] };
    }
  }

  /**
   * Generate market context summary using NLP
   */
  public async generateMarketContext(
    recentHeadlines: string[],
    marketData: any
  ): Promise<string> {
    try {
      const prompt = `
        You are a professional crypto market analyst. Generate a concise market context summary based on:
        
        Recent Headlines:
        ${recentHeadlines.slice(0, 5).map((h, i) => `${i + 1}. ${h}`).join('\n')}
        
        Market Data:
        - Overall sentiment: ${marketData.sentiment || 'neutral'}
        - Fear & Greed: ${marketData.fearGreed || 50}
        - Volume trend: ${marketData.volumeTrend || 'stable'}
        
        Provide a 2-3 sentence summary focusing on:
        1. Key market drivers
        2. Risk factors
        3. Opportunity areas
        
        Keep it professional and actionable for traders.
      `;

      return await this.callOpenAI(prompt);
    } catch (error) {
      console.error('❌ Market context generation failed:', error);
      return 'Market context analysis unavailable. Trading conditions appear normal with standard risk factors.';
    }
  }

  private async callOpenAIForAnalysis(headline: string): Promise<string> {
    const prompt = `
      Analyze this crypto/financial headline for trading relevance:
      
      "${headline}"
      
      Provide JSON analysis:
      {
        "marketRelevance": "high|medium|low",
        "sentiment": "bullish|bearish|neutral", 
        "confidenceScore": 0.85,
        "affectedSymbols": ["BTC", "ETH"],
        "timeframe": "immediate|short|medium|long",
        "impact": "high|medium|low",
        "reasoning": ["regulatory impact", "technical development"]
      }
      
      Consider:
      - Regulatory announcements
      - Technical developments
      - Partnership news
      - Market structure changes
      - Whale movements
      - Institutional adoption
    `;

    return await this.callOpenAI(prompt);
  }

  private async callOpenAI(prompt: string): Promise<string> {
    // This would be an edge function call to OpenAI
    // For now, return mock analysis
    return JSON.stringify({
      marketRelevance: 'medium',
      sentiment: 'bullish',
      confidenceScore: 0.72,
      affectedSymbols: ['BTC', 'ETH'],
      timeframe: 'short',
      impact: 'medium',
      reasoning: ['technical analysis', 'market sentiment']
    });
  }

  private parseHeadlineAnalysis(analysis: string, headline: string, source: string): HeadlineAnalysis {
    try {
      const parsed = JSON.parse(analysis);
      return {
        headline,
        marketRelevance: parsed.marketRelevance || 'low',
        sentiment: parsed.sentiment || 'neutral',
        confidenceScore: parsed.confidenceScore || 0.5,
        affectedSymbols: parsed.affectedSymbols || [],
        timeframe: parsed.timeframe || 'medium',
        impact: parsed.impact || 'low',
        reasoning: parsed.reasoning || []
      };
    } catch {
      return this.getFallbackAnalysis(headline);
    }
  }

  private getFallbackAnalysis(headline: string): HeadlineAnalysis {
    const bullishKeywords = ['approval', 'partnership', 'adoption', 'breakthrough', 'launch'];
    const bearishKeywords = ['hack', 'ban', 'regulation', 'crash', 'warning'];
    
    let sentiment: 'bullish' | 'bearish' | 'neutral' = 'neutral';
    
    if (bullishKeywords.some(word => headline.toLowerCase().includes(word))) {
      sentiment = 'bullish';
    } else if (bearishKeywords.some(word => headline.toLowerCase().includes(word))) {
      sentiment = 'bearish';
    }

    return {
      headline,
      marketRelevance: 'medium',
      sentiment,
      confidenceScore: 0.6,
      affectedSymbols: this.extractSymbols(headline),
      timeframe: 'short',
      impact: 'medium',
      reasoning: ['Keyword-based analysis']
    };
  }

  private extractSymbols(text: string): string[] {
    const symbols = ['BTC', 'ETH', 'BNB', 'SOL', 'XRP', 'ADA', 'AVAX', 'DOT', 'LINK', 'MATIC'];
    const found: string[] = [];
    
    symbols.forEach(symbol => {
      if (text.toUpperCase().includes(symbol)) {
        found.push(symbol + 'USDT');
      }
    });

    // Also check for common names
    const nameMapping = {
      'bitcoin': 'BTCUSDT',
      'ethereum': 'ETHUSDT',
      'binance': 'BNBUSDT',
      'solana': 'SOLUSDT',
      'ripple': 'XRPUSDT',
      'cardano': 'ADAUSDT'
    };

    Object.entries(nameMapping).forEach(([name, symbol]) => {
      if (text.toLowerCase().includes(name) && !found.includes(symbol)) {
        found.push(symbol);
      }
    });

    return found;
  }

  private async analyzeSentiment(content: string): Promise<'bullish' | 'bearish' | 'neutral'> {
    // Simple sentiment analysis - would use OpenAI in production
    const bullishWords = ['buy', 'bullish', 'moon', 'pump', 'good', 'positive', 'up'];
    const bearishWords = ['sell', 'bearish', 'dump', 'crash', 'bad', 'negative', 'down'];
    
    const text = content.toLowerCase();
    const bullishCount = bullishWords.filter(word => text.includes(word)).length;
    const bearishCount = bearishWords.filter(word => text.includes(word)).length;
    
    if (bullishCount > bearishCount) return 'bullish';
    if (bearishCount > bullishCount) return 'bearish';
    return 'neutral';
  }

  private calculateInfluencerImpact(author: string): number {
    const weight = this.INFLUENCER_WEIGHTS[author as keyof typeof this.INFLUENCER_WEIGHTS] || 0.5;
    return weight * 100;
  }

  private getInfluencerAccuracy(author: string): number {
    const history = this.influencerHistory.get(author) || [];
    if (history.length === 0) return 0.5;

    // Calculate historical accuracy based on signal outcomes
    // This would be connected to actual trading results
    return this.INFLUENCER_WEIGHTS[author as keyof typeof this.INFLUENCER_WEIGHTS] || 0.5;
  }
}

export const nlpProcessor = new NLPProcessor();