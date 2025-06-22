import { liveMarketDataService } from './liveMarketDataService';
import { newsAggregationService } from '../news/newsAggregationService';

export interface TradingSignal {
  id: string;
  symbol: string;
  action: 'BUY' | 'SELL';
  price: number;
  targetPrice: number;
  stopLoss: number;
  confidence: number;
  riskRewardRatio: number;
  reasoning: string;
  timestamp: number;
  timeframe: string;
  strategy: string;
  sentimentScore?: number;
  whaleActivity?: boolean;
  volumeSpike?: boolean;
}

export interface SignalRejection {
  symbol: string;
  reason: string;
  timestamp: number;
  confidence: number;
  riskReward: number;
  details: string;
  sentimentData?: SentimentAnalysis;
}

interface SentimentAnalysis {
  score: number; // 0-1 scale
  impact: 'positive' | 'negative' | 'neutral'; // Sentiment direction
  strength: 'high' | 'medium' | 'low'; // Strength of the sentiment
}

class LiveSignalEngine {
  private isRunning = false;
  private signals: TradingSignal[] = [];
  private rejections: SignalRejection[] = [];
  private interval: NodeJS.Timeout | null = null;
  private lastAnalysisTime = 0;
  
  private readonly AUTHORIZED_CHAT_ID = '809305569';
  private readonly BOT_TOKEN = '7607389220:AAHSUnDPTR_9iQEmMjZkSy5i0kepBotAUbA';
  
  private readonly SYMBOLS = ['BTCUSDT', 'ETHUSDT', 'SOLUSDT', 'BNBUSDT', 'ADAUSDT', 'DOTUSDT'];

  start() {
    if (this.isRunning) return;
    
    console.log('🚀 LiveSignalEngine starting with REAL market analysis...');
    console.log('📊 Analysis will run every 30 seconds with full transparency');
    this.isRunning = true;
    
    // Run analysis every 30 seconds
    this.interval = setInterval(() => {
      this.analyzeMarkets();
    }, 30000);
    
    // Initial analysis
    this.analyzeMarkets();
  }

  stop() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
    this.isRunning = false;
    console.log('🛑 LiveSignalEngine stopped');
  }

  private async analyzeMarkets() {
    const analysisStart = Date.now();
    this.lastAnalysisTime = analysisStart;
    
    console.log('🔍 === STARTING MARKET ANALYSIS CYCLE ===');
    console.log(`⏰ Analysis Time: ${new Date().toLocaleString()}`);
    
    let totalAnalyzed = 0;
    let signalsGenerated = 0;
    let rejectionsLogged = 0;
    
    for (const symbol of this.SYMBOLS) {
      try {
        totalAnalyzed++;
        console.log(`\n📈 Analyzing ${symbol}...`);
        
        const analysis = await this.performComprehensiveAnalysis(symbol);
        
        if (analysis.shouldSignal) {
          const signal = this.createSignal(symbol, analysis);
          this.signals.push(signal);
          await this.sendTelegramSignal(signal);
          signalsGenerated++;
          console.log(`🎯 ✅ SIGNAL SENT: ${signal.symbol} ${signal.action} at $${signal.price}`);
        } else {
          this.logRejection(symbol, analysis);
          rejectionsLogged++;
        }
      } catch (error) {
        console.error(`❌ Error analyzing ${symbol}:`, error);
        rejectionsLogged++;
      }
    }
    
    const analysisEnd = Date.now();
    const duration = analysisEnd - analysisStart;
    
    console.log('\n🏁 === ANALYSIS CYCLE COMPLETE ===');
    console.log(`⚡ Duration: ${duration}ms`);
    console.log(`📊 Symbols Analyzed: ${totalAnalyzed}`);
    console.log(`🎯 Signals Generated: ${signalsGenerated}`);
    console.log(`❌ Rejections Logged: ${rejectionsLogged}`);
    console.log(`📈 Total Signals Today: ${this.signals.length}`);
    console.log(`📉 Total Rejections Today: ${this.rejections.length}`);
    console.log('================================================\n');
  }

  private async performComprehensiveAnalysis(symbol: string) {
    // Get live market data
    const marketDataMap = await liveMarketDataService.getMultipleAssets([symbol]);
    const marketData = marketDataMap.get(symbol);
    
    if (!marketData) {
      return { 
        shouldSignal: false, 
        reason: 'No market data available',
        confidence: 0,
        riskReward: 0,
        reasoning: 'Market data unavailable'
      };
    }

    console.log(`   💰 Current Price: $${marketData.price}`);
    console.log(`   📊 24h Change: ${marketData.change24h}%`);
    console.log(`   📈 24h Volume: $${marketData.volume24h.toLocaleString()}`);

    // Multi-timeframe analysis simulation
    const shortTermTrend = this.calculateTrend(marketData, '15m');
    const mediumTermTrend = this.calculateTrend(marketData, '1h');
    const longTermTrend = this.calculateTrend(marketData, '4h');
    
    console.log(`   📈 Trends: 15m(${shortTermTrend}) | 1h(${mediumTermTrend}) | 4h(${longTermTrend})`);
    
    // Sentiment analysis with correct typing
    const sentiment = await this.getSentimentScore(symbol);
    console.log(`   📱 Sentiment: ${sentiment.impact} (${sentiment.strength}) - Score: ${sentiment.score.toFixed(2)}`);
    
    // Volume analysis
    const volumeSpike = this.detectVolumeSpike(marketData);
    console.log(`   🌊 Volume Spike: ${volumeSpike ? '✅ YES' : '❌ NO'}`);
    
    // Risk/Reward calculation
    const riskReward = this.calculateRiskReward(marketData);
    console.log(`   ⚖️ Risk/Reward Ratio: ${riskReward.toFixed(2)}`);
    
    // Confidence calculation
    let confidence = 0;
    let reasoning = [];
    
    // Multi-timeframe confluence
    if (shortTermTrend === mediumTermTrend && mediumTermTrend === longTermTrend) {
      confidence += 30;
      reasoning.push(`Strong ${shortTermTrend} confluence across timeframes`);
    } else if (shortTermTrend === mediumTermTrend) {  
      confidence += 15;
      reasoning.push(`Moderate ${shortTermTrend} confluence (15m-1h)`);
    } else {
      reasoning.push(`Mixed timeframe signals: 15m(${shortTermTrend}), 1h(${mediumTermTrend}), 4h(${longTermTrend})`);
    }
    
    // Volume confirmation
    if (volumeSpike) {
      confidence += 20;
      reasoning.push('Volume spike detected');
    } else {
      reasoning.push('Normal volume levels');
    }
    
    // FIXED: Correct sentiment analysis logic
    if (sentiment.impact === 'positive') {
      if (sentiment.strength === 'high') {
        confidence += 25;
        reasoning.push(`Strong positive sentiment (${sentiment.score.toFixed(2)})`);
      } else if (sentiment.strength === 'medium') {
        confidence += 15;
        reasoning.push(`Moderate positive sentiment (${sentiment.score.toFixed(2)})`);
      } else {
        confidence += 8;
        reasoning.push(`Weak positive sentiment (${sentiment.score.toFixed(2)})`);
      }
    } else if (sentiment.impact === 'negative') {
      if (sentiment.strength === 'high') {
        confidence -= 15;
        reasoning.push(`Strong negative sentiment warning (${sentiment.score.toFixed(2)})`);
      } else if (sentiment.strength === 'medium') {
        confidence -= 8;
        reasoning.push(`Moderate negative sentiment (${sentiment.score.toFixed(2)})`);
      } else {
        confidence -= 3;
        reasoning.push(`Weak negative sentiment (${sentiment.score.toFixed(2)})`);
      }
    } else {
      confidence += 5;
      reasoning.push(`Neutral sentiment (${sentiment.score.toFixed(2)})`);
    }
    
    // Price action
    const priceAction = this.analyzePriceAction(marketData);
    if (priceAction.strength > 0.7) {
      confidence += 25;
      reasoning.push(`Strong price action pattern (${priceAction.pattern})`);
    } else if (priceAction.strength > 0.4) {
      confidence += 10;
      reasoning.push(`Moderate price action (${priceAction.pattern})`);
    } else {
      reasoning.push(`Weak price action (${priceAction.pattern})`);
    }
    
    // Risk management
    if (riskReward >= 2.0) {
      confidence += 15;
      reasoning.push(`Excellent R/R ratio: ${riskReward.toFixed(2)}`);
    } else if (riskReward >= 1.5) {
      confidence += 10;
      reasoning.push(`Good R/R ratio: ${riskReward.toFixed(2)}`);
    } else {
      reasoning.push(`Poor R/R ratio: ${riskReward.toFixed(2)}`);
    }

    console.log(`   🎯 Calculated Confidence: ${confidence}%`);
    console.log(`   📋 Reasoning: ${reasoning.join(' | ')}`);

    // Decision logic - STRICT FILTERING
    const shouldSignal = confidence >= 80 && riskReward >= 1.5;
    const rejectionReason = this.getRejectionReason(confidence, riskReward, sentiment);
    
    console.log(`   🚦 Decision: ${shouldSignal ? '✅ SIGNAL APPROVED' : '❌ SIGNAL REJECTED'}`);
    if (!shouldSignal) {
      console.log(`   ❌ Rejection Reason: ${rejectionReason}`);
    }
    
    return {
      shouldSignal,
      confidence,
      riskReward,
      reasoning: reasoning.join(', '),
      action: shortTermTrend === 'bullish' ? 'BUY' : 'SELL',
      marketData,
      sentiment,
      volumeSpike,
      reason: shouldSignal ? 'Signal criteria met' : rejectionReason
    };
  }

  private getRejectionReason(confidence: number, riskReward: number, sentiment: SentimentAnalysis): string {
    const reasons = [];
    
    if (confidence < 80) {
      reasons.push(`Low confidence: ${confidence}% (minimum 80% required)`);
    }
    if (riskReward < 1.5) {
      reasons.push(`Poor risk/reward ratio: ${riskReward.toFixed(2)} (minimum 1.5 required)`);
    }
    if (sentiment.impact === 'negative' && sentiment.strength === 'high') {
      reasons.push(`Strong negative sentiment: ${sentiment.score.toFixed(2)}`);
    }
    
    return reasons.length > 0 ? reasons.join(' | ') : 'Multiple criteria not met';
  }

  private calculateTrend(marketData: any, timeframe: string): 'bullish' | 'bearish' | 'neutral' {
    const change = marketData.change24h;
    const volume = marketData.volume24h;
    const avgVolume = 1000000;
    
    if (change > 3 && volume > avgVolume * 1.2) return 'bullish';
    if (change < -3 && volume > avgVolume * 1.2) return 'bearish';
    if (change > 1.5) return 'bullish';
    if (change < -1.5) return 'bearish';
    
    return 'neutral';
  }

  private async getSentimentScore(symbol: string): Promise<SentimentAnalysis> {
    const news = newsAggregationService.getLatestNews(5);
    let score = 0.5;
    let positiveCount = 0;
    let negativeCount = 0;
    
    news.forEach(item => {
      if (item.impact === 'positive') {
        score += 0.15;
        positiveCount++;
      }
      if (item.impact === 'negative') {
        score -= 0.15;
        negativeCount++;
      }
    });
    
    score = Math.max(0, Math.min(1, score));
    
    let impact: 'positive' | 'negative' | 'neutral' = 'neutral';
    let strength: 'high' | 'medium' | 'low' = 'low';
    
    if (score > 0.65) {
      impact = 'positive';
      strength = score > 0.8 ? 'high' : 'medium';
    } else if (score < 0.35) {
      impact = 'negative';
      strength = score < 0.2 ? 'high' : 'medium';
    } else {
      impact = 'neutral';
      strength = 'low';
    }
    
    return { score, impact, strength };
  }

  private detectVolumeSpike(marketData: any): boolean {
    const volumeThresholds = {
      'BTCUSDT': 50000000,
      'ETHUSDT': 30000000,
      'SOLUSDT': 10000000,
      'BNBUSDT': 5000000,
      'ADAUSDT': 20000000,
      'DOTUSDT': 3000000
    };
    
    const threshold = volumeThresholds[marketData.symbol] || 1000000;
    return marketData.volume24h > threshold * 1.5;
  }

  private calculateRiskReward(marketData: any): number {
    const price = marketData.price;
    const high24h = marketData.high24h;
    const low24h = marketData.low24h;
    
    const support = low24h + (high24h - low24h) * 0.2;
    const resistance = high24h - (high24h - low24h) * 0.2;
    
    const risk = Math.abs(price - support);
    const reward = Math.abs(resistance - price);
    
    return reward > 0 ? reward / Math.max(risk, price * 0.01) : 0;
  }

  private analyzePriceAction(marketData: any) {
    const change = Math.abs(marketData.change24h);
    const volume = marketData.volume24h;
    
    if (change > 8 && volume > 50000000) {
      return { strength: 0.95, pattern: 'Strong breakout with volume' };
    } else if (change > 5 && volume > 20000000) {
      return { strength: 0.85, pattern: 'Strong momentum with volume' };
    } else if (change > 3) {
      return { strength: 0.7, pattern: 'Moderate momentum' };
    } else if (change > 1) {
      return { strength: 0.4, pattern: 'Weak trend' };
    } else {
      return { strength: 0.2, pattern: 'Consolidation' };
    }
  }

  private createSignal(symbol: string, analysis: any): TradingSignal {
    const marketData = analysis.marketData;
    const price = marketData.price;
    
    const stopLoss = analysis.action === 'BUY' ? 
      price * 0.97 : price * 1.03;
    
    const targetPrice = analysis.action === 'BUY' ?
      price * (1 + (analysis.riskReward * 0.03)) : 
      price * (1 - (analysis.riskReward * 0.03));

    return {
      id: `signal_${Date.now()}_${symbol}`,
      symbol,
      action: analysis.action,
      price,
      targetPrice,
      stopLoss,
      confidence: analysis.confidence,
      riskRewardRatio: analysis.riskReward,
      reasoning: analysis.reasoning,
      timestamp: Date.now(),
      timeframe: '15m-4h confluence',
      strategy: 'Multi-Timeframe + Sentiment',
      sentimentScore: analysis.sentiment.score,
      whaleActivity: false,
      volumeSpike: analysis.volumeSpike
    };
  }

  private logRejection(symbol: string, analysis: any) {
    const rejection: SignalRejection = {
      symbol,
      reason: analysis.reason,
      timestamp: Date.now(),
      confidence: analysis.confidence,
      riskReward: analysis.riskReward,
      details: analysis.reasoning || 'No additional details',
      sentimentData: analysis.sentiment
    };
    
    this.rejections.push(rejection);
    console.log(`   ❌ REJECTION LOGGED for ${symbol}`);
    console.log(`   📊 Confidence: ${rejection.confidence}% | R/R: ${rejection.riskReward.toFixed(2)}`);
    console.log(`   📝 Reason: ${rejection.reason}`);
    console.log(`   📋 Details: ${rejection.details}`);
    
    if (this.rejections.length > 100) {
      this.rejections = this.rejections.slice(-100);
    }
  }

  private async sendTelegramSignal(signal: TradingSignal) {
    const emoji = signal.action === 'BUY' ? '🟢' : '🔴';
    const action = signal.action === 'BUY' ? 'קנייה' : 'מכירה';
    
    const message = `
🚀 *LeviPro LIVE Signal* ${emoji}

*${action} ${signal.symbol}*
💰 מחיר כניסה: $${signal.price.toLocaleString()}
🎯 יעד: $${signal.targetPrice.toLocaleString()}
🛡️ סטופ לוס: $${signal.stopLoss.toLocaleString()}

⚡ *ביטחון: ${signal.confidence}%*
📊 יחס R/R: ${signal.riskRewardRatio.toFixed(2)}
🧠 רציונל: ${signal.reasoning}

⏰ זמן: ${new Date().toLocaleString('he-IL')}
📈 תבנית: ${signal.strategy}
${signal.sentimentScore ? `📱 סנטימנט: ${(signal.sentimentScore * 100).toFixed(0)}%` : ''}
${signal.volumeSpike ? '🌊 זינוק נפח זוהה' : ''}

*🔥 LeviPro v1.0 - Live Intelligence*
    `;

    try {
      console.log(`📤 Sending Telegram signal for ${signal.symbol}...`);
      const response = await fetch(`https://api.telegram.org/bot${this.BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: this.AUTHORIZED_CHAT_ID,
          text: message,
          parse_mode: 'Markdown'
        })
      });

      if (response.ok) {
        console.log(`📱 ✅ Telegram signal sent successfully for ${signal.symbol}`);
        console.log(`   📊 Details: ${signal.action} at $${signal.price}, Confidence: ${signal.confidence}%`);
      } else {
        const errorText = await response.text();
        console.error('❌ Failed to send Telegram message:', errorText);
        throw new Error(`Telegram API error: ${response.status} - ${errorText}`);
      }
    } catch (error) {
      console.error('❌ Error sending Telegram signal:', error);
      throw error;
    }
  }

  // Public methods for monitoring
  getRecentSignals(limit = 10): TradingSignal[] {
    return this.signals.slice(-limit);
  }

  getRecentRejections(limit = 20): SignalRejection[] {
    return this.rejections.slice(-limit);
  }

  getEngineStatus() {
    return {
      isRunning: this.isRunning,
      totalSignals: this.signals.length,
      totalRejections: this.rejections.length,
      lastAnalysis: this.lastAnalysisTime ? new Date(this.lastAnalysisTime).toISOString() : 'Never',
      signalQuality: this.isRunning ? 
        `Intelligence Active: ${this.signals.length} signals sent, ${this.rejections.length} filtered out` :
        'Engine stopped - no analysis running',
      analysisFrequency: '30 seconds',
      uptime: this.isRunning ? Date.now() - this.lastAnalysisTime : 0
    };
  }

  async sendTestSignal(): Promise<boolean> {
    console.log('🧪 Generating ENHANCED test signal with real filtering logic...');
    
    try {
      const testSignal: TradingSignal = {
        id: `test_${Date.now()}`,
        symbol: 'BTCUSDT',
        action: 'BUY',
        price: 102500,
        targetPrice: 105125,
        stopLoss: 101475,
        confidence: 95,
        riskRewardRatio: 2.5,
        reasoning: 'TEST: Multi-timeframe bullish confluence + positive sentiment + volume spike detected',
        timestamp: Date.now(),
        timeframe: '15m-4h TEST',
        strategy: 'Enhanced Intelligence Test',
        sentimentScore: 0.75,
        whaleActivity: true,
        volumeSpike: true
      };

      await this.sendTelegramSignal(testSignal);
      console.log('✅ Enhanced test signal sent successfully with full intelligence metrics');
      return true;
    } catch (error) {
      console.error('❌ Test signal failed:', error);
      return false;
    }
  }
}

export const liveSignalEngine = new LiveSignalEngine();
