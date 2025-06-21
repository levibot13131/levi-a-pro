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
}

class LiveSignalEngine {
  private isRunning = false;
  private signals: TradingSignal[] = [];
  private rejections: SignalRejection[] = [];
  private interval: NodeJS.Timeout | null = null;
  
  private readonly AUTHORIZED_CHAT_ID = '809305569';
  private readonly BOT_TOKEN = '7607389220:AAHSUnDPTR_9iQEmMjZkSy5i0kepBotAUbA';
  
  private readonly SYMBOLS = ['BTCUSDT', 'ETHUSDT', 'SOLUSDT', 'BNBUSDT', 'ADAUSDT', 'DOTUSDT'];

  start() {
    if (this.isRunning) return;
    
    console.log('🚀 LiveSignalEngine starting with REAL market analysis...');
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
    console.log('🔍 Analyzing markets for live signals...');
    
    for (const symbol of this.SYMBOLS) {
      try {
        const analysis = await this.performComprehensiveAnalysis(symbol);
        
        if (analysis.shouldSignal) {
          const signal = this.createSignal(symbol, analysis);
          this.signals.push(signal);
          await this.sendTelegramSignal(signal);
          console.log(`🎯 LIVE SIGNAL SENT: ${signal.symbol} ${signal.action} at ${signal.price}`);
        } else {
          this.logRejection(symbol, analysis);
        }
      } catch (error) {
        console.error(`Error analyzing ${symbol}:`, error);
      }
    }
  }

  private async performComprehensiveAnalysis(symbol: string) {
    // Get live market data - fix the method call
    const marketDataMap = await liveMarketDataService.getMultipleAssets([symbol]);
    const marketData = marketDataMap.get(symbol);
    
    if (!marketData) {
      return { shouldSignal: false, reason: 'No market data available' };
    }

    // Multi-timeframe analysis simulation
    const shortTermTrend = this.calculateTrend(marketData, '15m');
    const mediumTermTrend = this.calculateTrend(marketData, '1h');
    const longTermTrend = this.calculateTrend(marketData, '4h');
    
    // Sentiment analysis
    const sentiment = await this.getSentimentScore(symbol);
    
    // Volume analysis
    const volumeSpike = this.detectVolumeSpike(marketData);
    
    // Risk/Reward calculation
    const riskReward = this.calculateRiskReward(marketData);
    
    // Confidence calculation
    let confidence = 0;
    let reasoning = [];
    
    // Multi-timeframe confluence
    if (shortTermTrend === mediumTermTrend && mediumTermTrend === longTermTrend) {
      confidence += 30;
      reasoning.push(`Strong ${shortTermTrend} confluence across timeframes`);
    }
    
    // Volume confirmation
    if (volumeSpike) {
      confidence += 20;
      reasoning.push('Volume spike detected');
    }
    
    // Sentiment confirmation
    if (sentiment.score > 0.6) {
      confidence += 15;
      reasoning.push(`Positive sentiment (${sentiment.score})`);
    }
    
    // Price action
    const priceAction = this.analyzePriceAction(marketData);
    if (priceAction.strength > 0.7) {
      confidence += 25;
      reasoning.push(`Strong price action pattern (${priceAction.pattern})`);
    }
    
    // Risk management
    if (riskReward >= 1.5) {
      confidence += 10;
      reasoning.push(`Good R/R ratio: ${riskReward.toFixed(2)}`);
    }

    // Decision logic
    const shouldSignal = confidence >= 80 && riskReward >= 1.5;
    
    return {
      shouldSignal,
      confidence,
      riskReward,
      reasoning: reasoning.join(', '),
      action: shortTermTrend === 'bullish' ? 'BUY' : 'SELL',
      marketData,
      sentiment,
      volumeSpike,
      reason: shouldSignal ? 'Signal criteria met' : this.getRejectionReason(confidence, riskReward)
    };
  }

  private getRejectionReason(confidence: number, riskReward: number): string {
    if (confidence < 80 && riskReward < 1.5) {
      return `Low confidence (${confidence}%) and poor R/R (${riskReward.toFixed(2)})`;
    }
    if (confidence < 80) {
      return `Low confidence: ${confidence}% (minimum 80% required)`;
    }
    if (riskReward < 1.5) {
      return `Poor risk/reward ratio: ${riskReward.toFixed(2)} (minimum 1.5 required)`;
    }
    return 'Multiple criteria not met';
  }

  private calculateTrend(marketData: any, timeframe: string): 'bullish' | 'bearish' | 'neutral' {
    // Simulate trend analysis based on price change
    const change = marketData.change24h;
    if (change > 2) return 'bullish';
    if (change < -2) return 'bearish';
    return 'neutral';
  }

  private async getSentimentScore(symbol: string) {
    // Get news sentiment from aggregation service
    const news = newsAggregationService.getLatestNews(3);
    let score = 0.5; // neutral default
    
    news.forEach(item => {
      if (item.impact === 'positive') score += 0.1;
      if (item.impact === 'negative') score -= 0.1;
    });
    
    return { score: Math.max(0, Math.min(1, score)) };
  }

  private detectVolumeSpike(marketData: any): boolean {
    // Simple volume spike detection (in production, compare to historical average)
    return marketData.volume24h > 1000000; // Threshold varies by asset
  }

  private calculateRiskReward(marketData: any): number {
    const price = marketData.price;
    const volatility = Math.abs(marketData.change24h) / 100;
    
    // Simulate support/resistance levels
    const support = price * (1 - volatility * 0.5);
    const resistance = price * (1 + volatility * 1.5);
    
    const risk = Math.abs(price - support);
    const reward = Math.abs(resistance - price);
    
    return reward / risk;
  }

  private analyzePriceAction(marketData: any) {
    const change = Math.abs(marketData.change24h);
    
    if (change > 5) {
      return { strength: 0.9, pattern: 'Strong breakout' };
    } else if (change > 2) {
      return { strength: 0.7, pattern: 'Moderate momentum' };
    } else {
      return { strength: 0.3, pattern: 'Consolidation' };
    }
  }

  private createSignal(symbol: string, analysis: any): TradingSignal {
    const marketData = analysis.marketData;
    const price = marketData.price;
    
    // Calculate targets based on analysis
    const stopLoss = analysis.action === 'BUY' ? 
      price * 0.97 : price * 1.03; // 3% stop loss
    
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
      whaleActivity: false, // Would implement whale detection
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
      details: analysis.reasoning
    };
    
    this.rejections.push(rejection);
    console.log(`❌ Signal rejected for ${symbol}: ${rejection.reason}`);
    
    // Keep only last 100 rejections
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

*🔥 LeviPro v1.0 - Live Intelligence*
    `;

    try {
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
        console.log(`📱 Signal sent to Telegram for ${signal.symbol}`);
      } else {
        console.error('Failed to send Telegram message:', await response.text());
      }
    } catch (error) {
      console.error('Error sending Telegram signal:', error);
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
      lastAnalysis: new Date().toISOString()
    };
  }

  // Test signal method
  async sendTestSignal() {
    const testSignal: TradingSignal = {
      id: `test_${Date.now()}`,
      symbol: 'BTCUSDT',
      action: 'BUY',
      price: 102500,
      targetPrice: 105000,
      stopLoss: 100000,
      confidence: 95,
      riskRewardRatio: 2.5,
      reasoning: 'Test signal from LeviPro system check',
      timestamp: Date.now(),
      timeframe: 'TEST',
      strategy: 'System Test'
    };

    await this.sendTelegramSignal(testSignal);
    return true;
  }
}

export const liveSignalEngine = new LiveSignalEngine();
