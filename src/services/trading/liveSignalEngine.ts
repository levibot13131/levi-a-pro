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
  private analysisCount = 0;
  private sessionSignalCount = 0;
  
  private readonly AUTHORIZED_CHAT_ID = '809305569';
  private readonly BOT_TOKEN = '7607389220:AAHSUnDPTR_9iQEmMjZkSy5i0kepBotAUbA';
  
  private readonly SYMBOLS = ['BTCUSDT', 'ETHUSDT', 'SOLUSDT', 'BNBUSDT', 'ADAUSDT', 'DOTUSDT'];

  start() {
    if (this.isRunning) return;
    
    console.log('🚀 LeviPro v1.0 Starting - LIVE SIGNAL ENGINE WITH DEBUGGING');
    console.log('📊 Enhanced real-time analysis every 30 seconds');
    console.log('🎯 STRICT criteria: 80% confidence + 1.5 R/R + proper sentiment');
    console.log('🔍 DEBUGGING MODE: Full cycle logging enabled');
    
    this.isRunning = true;
    this.sessionSignalCount = 0;
    this.analysisCount = 0;
    
    // Reset daily counters if needed
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    if (this.lastAnalysisTime < startOfDay.getTime()) {
      console.log('🌅 New day detected - resetting daily counters');
      this.signals = this.signals.filter(s => s.timestamp > startOfDay.getTime());
      this.rejections = this.rejections.filter(r => r.timestamp > startOfDay.getTime());
    }
    
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
    this.analysisCount++;
    
    console.log('\n🔥 === LEVIPRO ENHANCED ANALYSIS CYCLE START ===');
    console.log(`⏰ Time: ${new Date().toLocaleString('he-IL')}`);
    console.log(`🔢 Analysis #${this.analysisCount} | Session Signals: ${this.sessionSignalCount}/3`);
    console.log(`📈 Daily Signals: ${this.signals.length}/10`);
    
    let totalAnalyzed = 0;
    let signalsGenerated = 0;
    let rejectionsLogged = 0;
    let analysisReport = [];
    
    // Check session and daily limits first
    if (this.sessionSignalCount >= 3) {
      console.log('⚠️ SESSION LIMIT REACHED: 3/3 signals sent this session');
      analysisReport.push('🚫 SESSION LIMIT: 3/3 signals sent - skipping analysis');
      this.lastAnalysisReport = analysisReport.join('\n');
      return;
    }
    
    if (this.signals.length >= 10) {
      console.log('⚠️ DAILY LIMIT REACHED: 10/10 signals sent today');
      analysisReport.push('🚫 DAILY LIMIT: 10/10 signals sent - skipping analysis');
      this.lastAnalysisReport = analysisReport.join('\n');
      return;
    }
    
    console.log('✅ LIMITS CHECK PASSED - Proceeding with market analysis');
    
    for (const symbol of this.SYMBOLS) {
      try {
        totalAnalyzed++;
        console.log(`\n📊 ANALYZING ${symbol}...`);
        
        const analysis = await this.performComprehensiveAnalysis(symbol);
        
        if (analysis.shouldSignal) {
          const signal = this.createSignal(symbol, analysis);
          this.signals.push(signal);
          this.sessionSignalCount++;
          await this.sendTelegramSignal(signal);
          signalsGenerated++;
          console.log(`🎯 ✅ SIGNAL SENT: ${signal.symbol} ${signal.action} at $${signal.price}`);
          console.log(`📊 Signal Details: Conf=${signal.confidence}% | R/R=${signal.riskRewardRatio} | Strategy=${signal.strategy}`);
          analysisReport.push(`✅ ${symbol}: SIGNAL SENT (${analysis.confidence}% conf, ${analysis.riskReward.toFixed(2)} R/R)`);
        } else {
          this.logRejection(symbol, analysis);
          rejectionsLogged++;
          analysisReport.push(`❌ ${symbol}: REJECTED - ${analysis.reason} (${analysis.confidence}%)`);
        }
      } catch (error) {
        console.error(`❌ CRITICAL ERROR analyzing ${symbol}:`, error);
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
    console.log(`📈 Session Signals: ${this.sessionSignalCount}/3`);
    console.log(`📉 Daily Signals: ${this.signals.length}/10`);
    console.log(`🔄 Next Analysis: ${new Date(Date.now() + 30000).toLocaleTimeString('he-IL')}`);
    console.log('='.repeat(60));
    
    // Log data connection status
    const connectionStatus = liveMarketDataService.getConnectionStatus();
    console.log(`📡 Data Connection: ${connectionStatus.status} | Cache: ${connectionStatus.cacheSize} symbols`);
  }

  private async performComprehensiveAnalysis(symbol: string) {
    console.log(`   🔍 Starting comprehensive analysis for ${symbol}...`);
    
    // Get live market data with error handling
    let marketDataMap;
    try {
      marketDataMap = await liveMarketDataService.getMultipleAssets([symbol]);
    } catch (error) {
      console.error(`   ❌ Failed to fetch market data for ${symbol}:`, error);
      return { 
        shouldSignal: false, 
        reason: 'Market data unavailable - API connection issue',
        confidence: 0,
        riskReward: 0,
        reasoning: 'Cannot connect to market data source'
      };
    }
    
    const marketData = marketDataMap.get(symbol);
    
    if (!marketData) {
      console.log(`   ❌ No market data available for ${symbol}`);
      return { 
        shouldSignal: false, 
        reason: 'No market data returned from API',
        confidence: 0,
        riskReward: 0,
        reasoning: 'Market data not found'
      };
    }

    console.log(`   💰 Live Price: $${marketData.price.toFixed(2)}`);
    console.log(`   📊 24h Change: ${marketData.change24h.toFixed(2)}%`);
    console.log(`   📈 24h Volume: $${(marketData.volume24h / 1000000).toFixed(1)}M`);

    // Multi-timeframe analysis using new modular approach
    const shortTermTrend = StrategyMatcher.calculateTrend(marketData, '15m');
    const mediumTermTrend = StrategyMatcher.calculateTrend(marketData, '1h');
    const longTermTrend = StrategyMatcher.calculateTrend(marketData, '4h');
    
    console.log(`   📈 Trend Analysis: 15m(${shortTermTrend}) | 1h(${mediumTermTrend}) | 4h(${longTermTrend})`);
    
    // Sentiment analysis using new modular approach
    let sentiment;
    try {
      sentiment = await SentimentAnalyzer.getSentimentScore(symbol);
      console.log(`   📱 Sentiment: ${sentiment.impact} (${sentiment.strength}) - Score: ${sentiment.score.toFixed(2)}`);
    } catch (error) {
      console.error(`   ⚠️ Sentiment analysis failed for ${symbol}:`, error);
      sentiment = { score: 0.5, impact: 'neutral' as const, strength: 'low' as const };
    }
    
    // Volume and risk analysis using new modular approach
    const volumeSpike = RiskFilters.detectVolumeSpike(marketData);
    console.log(`   🌊 Volume Spike: ${volumeSpike ? '✅ DETECTED' : '❌ NONE'}`);
    
    const riskReward = RiskFilters.calculateRiskReward(marketData);
    console.log(`   ⚖️ Risk/Reward: ${riskReward.toFixed(2)}`);
    
    const priceAction = RiskFilters.analyzePriceAction(marketData);
    console.log(`   🎯 Price Action: ${priceAction.pattern} (${priceAction.strength.toFixed(2)} strength)`);
    
    // Personal method signals
    const personalMethodSignal = StrategyMatcher.getPersonalMethodSignals(marketData);
    console.log(`   🧠 Personal Method: ${personalMethodSignal ? '✅ TRIGGERED' : '❌ NO SIGNAL'}`);
    
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

    console.log(`   🎯 Final Confidence: ${scoring.confidence}% (min: 80%)`);
    console.log(`   📋 Scoring Breakdown:`);
    scoring.reasoning.forEach((reason, index) => {
      console.log(`      ${index + 1}. ${reason}`);
    });
    console.log(`   🚦 DECISION: ${scoring.shouldSignal ? '✅ APPROVED FOR SIGNAL' : '❌ REJECTED'}`);
    
    if (!scoring.shouldSignal) {
      console.log(`   ❌ Rejection Details: ${scoring.rejectionReason}`);
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
      personalMethodSignal,
      reason: scoring.shouldSignal ? 'All criteria met - signal approved' : scoring.rejectionReason
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
    const now = Date.now();
    const connectionStatus = liveMarketDataService.getConnectionStatus();
    
    return {
      isRunning: this.isRunning,
      totalSignals: this.signals.length,
      totalRejections: this.rejections.length,
      sessionSignals: this.sessionSignalCount,
      analysisCount: this.analysisCount,
      lastAnalysis: this.lastAnalysisTime ? new Date(this.lastAnalysisTime).toISOString() : 'Never',
      signalQuality: this.isRunning ? 
        `LIVE ENGINE: ${this.signals.length}/10 daily, ${this.sessionSignalCount}/3 session, ${this.rejections.length} filtered` :
        'Engine offline - no real-time analysis',
      analysisFrequency: '30 seconds',
      uptime: this.isRunning ? now - this.lastAnalysisTime : 0,
      lastAnalysisReport: this.lastAnalysisReport,
      dataConnection: connectionStatus,
      limits: {
        daily: { current: this.signals.length, max: 10 },
        session: { current: this.sessionSignalCount, max: 3 }
      }
    };
  }

  async sendTestSignal(): Promise<boolean> {
    console.log('🧪 Generating ENHANCED test signal with full debugging...');
    
    try {
      const testSignal: TradingSignal = {
        id: `test_${Date.now()}`,
        symbol: 'BTCUSDT',
        action: 'BUY',
        price: 67500,
        targetPrice: 69125,
        stopLoss: 66487,
        confidence: 95,
        riskRewardRatio: 2.5,
        reasoning: 'TEST: Enhanced debugging signal with full analysis simulation',
        timestamp: Date.now(),
        timeframe: '15m-4h TEST',
        strategy: 'Enhanced Debug Test',
        sentimentScore: 0.78,
        whaleActivity: true,
        volumeSpike: true
      };

      const message = TelegramFormatter.formatTestSignal();
      
      console.log('📤 Sending enhanced test signal to Telegram...');
      console.log(`📊 Test Signal Details: ${JSON.stringify(testSignal, null, 2)}`);
      
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
        console.log('✅ Enhanced test signal sent successfully');
        console.log(`📱 Telegram response: ${response.status} ${response.statusText}`);
        return true;
      } else {
        const errorText = await response.text();
        console.error('❌ Test signal failed:', errorText);
        return false;
      }
    } catch (error) {
      console.error('❌ Test signal exception:', error);
      return false;
    }
  }

  // New debugging methods
  async performManualAnalysis(symbol: string = 'BTCUSDT') {
    console.log(`🔧 MANUAL ANALYSIS REQUEST for ${symbol}`);
    const analysis = await this.performComprehensiveAnalysis(symbol);
    console.log(`🔧 Manual Analysis Result:`, JSON.stringify(analysis, null, 2));
    return analysis;
  }

  getDebugInfo() {
    return {
      isRunning: this.isRunning,
      analysisCount: this.analysisCount,
      sessionSignals: this.sessionSignalCount,
      dailySignals: this.signals.length,
      rejectionCount: this.rejections.length,
      lastAnalysis: this.lastAnalysisTime,
      symbols: this.SYMBOLS,
      limits: {
        sessionMax: 3,
        dailyMax: 10,
        confidenceMin: 80,
        riskRewardMin: 1.5
      }
    };
  }
}

export const liveSignalEngine = new LiveSignalEngine();
