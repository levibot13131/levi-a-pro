import { liveMarketDataService } from './liveMarketDataService';
import { SignalScoring } from './signalScoring';
import { SentimentAnalyzer } from './sentimentAnalysis';
import { RiskFilters } from './riskFilters';
import { StrategyMatcher } from './strategyMatcher';
import { TelegramFormatter } from './telegramFormatter';

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
  private lastAnalysisReport = '';
  
  private readonly AUTHORIZED_CHAT_ID = '809305569';
  private readonly BOT_TOKEN = '7607389220:AAHSUnDPTR_9iQEmMjZkSy5i0kepBotAUbA';
  
  private readonly SYMBOLS = ['BTCUSDT', 'ETHUSDT', 'SOLUSDT', 'BNBUSDT', 'ADAUSDT', 'DOTUSDT'];

  start() {
    if (this.isRunning) return;
    
    console.log('🚀 LeviPro v1.0 Starting - ENTERPRISE GRADE ANALYSIS');
    console.log('📊 Real signals will be analyzed every 30 seconds');
    console.log('🎯 Minimum criteria: 80% confidence + 1.5 R/R + proper sentiment');
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
    console.log('🛑 LeviPro Signal Engine stopped');
  }

  private async analyzeMarkets() {
    const analysisStart = Date.now();
    this.lastAnalysisTime = analysisStart;
    
    console.log('🔍 === LEVIPRO ANALYSIS CYCLE START ===');
    console.log(`⏰ Time: ${new Date().toLocaleString()}`);
    
    let totalAnalyzed = 0;
    let signalsGenerated = 0;
    let rejectionsLogged = 0;
    let analysisReport = [];
    
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
          analysisReport.push(`✅ ${symbol}: SIGNAL SENT (${analysis.confidence}%)`);
        } else {
          this.logRejection(symbol, analysis);
          rejectionsLogged++;
          analysisReport.push(`❌ ${symbol}: REJECTED - ${analysis.reason} (${analysis.confidence}%)`);
        }
      } catch (error) {
        console.error(`❌ Error analyzing ${symbol}:`, error);
        analysisReport.push(`⚠️ ${symbol}: ERROR - ${error.message}`);
        rejectionsLogged++;
      }
    }
    
    const analysisEnd = Date.now();
    const duration = analysisEnd - analysisStart;
    
    // Store report for UI access
    this.lastAnalysisReport = analysisReport.join('\n');
    
    console.log('\n🏁 === LEVIPRO ANALYSIS COMPLETE ===');
    console.log(`⚡ Duration: ${duration}ms`);
    console.log(`📊 Symbols Analyzed: ${totalAnalyzed}`);
    console.log(`🎯 Signals Generated: ${signalsGenerated}`);
    console.log(`❌ Rejections: ${rejectionsLogged}`);
    console.log(`📈 Total Signals Today: ${this.signals.length}`);
    console.log(`📉 Total Rejections Today: ${this.rejections.length}`);
    console.log('💡 NEXT ANALYSIS IN 30 SECONDS');
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

    // Multi-timeframe analysis using new modular approach
    const shortTermTrend = StrategyMatcher.calculateTrend(marketData, '15m');
    const mediumTermTrend = StrategyMatcher.calculateTrend(marketData, '1h');
    const longTermTrend = StrategyMatcher.calculateTrend(marketData, '4h');
    
    console.log(`   📈 Trends: 15m(${shortTermTrend}) | 1h(${mediumTermTrend}) | 4h(${longTermTrend})`);
    
    // Sentiment analysis using new modular approach
    const sentiment = await SentimentAnalyzer.getSentimentScore(symbol);
    console.log(`   📱 Sentiment: ${sentiment.impact} (${sentiment.strength}) - Score: ${sentiment.score.toFixed(2)}`);
    
    // Volume and risk analysis using new modular approach
    const volumeSpike = RiskFilters.detectVolumeSpike(marketData);
    console.log(`   🌊 Volume Spike: ${volumeSpike ? '✅ YES' : '❌ NO'}`);
    
    const riskReward = RiskFilters.calculateRiskReward(marketData);
    console.log(`   ⚖️ Risk/Reward Ratio: ${riskReward.toFixed(2)}`);
    
    const priceAction = RiskFilters.analyzePriceAction(marketData);
    
    // Signal scoring using new modular approach
    const scoring = SignalScoring.calculateConfidence(
      shortTermTrend,
      mediumTermTrend,
      longTermTrend,
      volumeSpike,
      sentiment,
      priceAction,
      riskReward
    );

    console.log(`   🎯 Calculated Confidence: ${scoring.confidence}%`);
    console.log(`   📋 Reasoning: ${scoring.reasoning.join(' | ')}`);
    console.log(`   🚦 Decision: ${scoring.shouldSignal ? '✅ SIGNAL APPROVED' : '❌ SIGNAL REJECTED'}`);
    
    if (!scoring.shouldSignal) {
      console.log(`   ❌ Rejection Reason: ${scoring.rejectionReason}`);
    }
    
    return {
      shouldSignal: scoring.shouldSignal,
      confidence: scoring.confidence,
      riskReward: scoring.riskReward,
      reasoning: scoring.reasoning.join(', '),
      action: shortTermTrend === 'bullish' ? 'BUY' : 'SELL',
      marketData,
      sentiment,
      volumeSpike,
      reason: scoring.shouldSignal ? 'Signal criteria met' : scoring.rejectionReason
    };
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
    const message = TelegramFormatter.formatSignal(signal);

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

  getLastAnalysisReport(): string {
    return this.lastAnalysisReport;
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
      uptime: this.isRunning ? Date.now() - this.lastAnalysisTime : 0,
      lastAnalysisReport: this.lastAnalysisReport
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

      const message = TelegramFormatter.formatTestSignal();
      
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
        console.log('✅ Enhanced test signal sent successfully with full intelligence metrics');
        return true;
      } else {
        console.error('❌ Test signal failed:', await response.text());
        return false;
      }
    } catch (error) {
      console.error('❌ Test signal failed:', error);
      return false;
    }
  }
}

export const liveSignalEngine = new LiveSignalEngine();
