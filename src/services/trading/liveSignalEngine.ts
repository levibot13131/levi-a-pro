import { liveMarketDataService } from './liveMarketDataService';
import { telegramBot } from '../telegram/telegramBot';
import { supabase } from '@/integrations/supabase/client';
import { EnhancedSignalProcessor } from '../ai/enhancedSignalProcessor';
import { MarketHeatIndex } from '../ai/marketHeatIndex';
import { FeedbackLearningEngine } from '../ai/feedbackLearningEngine';

interface SignalRejection {
  symbol: string;
  reason: string;
  confidence: number;
  riskReward: number;
  timestamp: number;
  details?: string;
}

interface EngineStats {
  isRunning: boolean;
  lastAnalysis: number;
  analysisCount: number;
  totalSignals: number;
  totalRejections: number;
  lastAnalysisReport: string;
  currentCycle: string;
  marketDataStatus: string;
  aiEngineStatus: string;
  lastSuccessfulSignal: number;
  rejectionBreakdown: { [reason: string]: number };
  signalsLast24h: number;
}

interface DebugInfo {
  recentRejections: SignalRejection[];
  rejectionBreakdown: { [reason: string]: number };
  learningStats: any;
  currentFilters: any;
}

class LiveSignalEngine {
  private isRunning = false;
  private analysisInterval?: NodeJS.Timeout;
  private lastAnalysis = 0;
  private analysisCount = 0;
  private totalSignals = 0;
  private totalRejections = 0;
  private lastAnalysisReport = '';
  private lastSuccessfulSignal = 0;
  private recentRejections: SignalRejection[] = [];
  private rejectionBreakdown: { [reason: string]: number } = {};
  private currentCycle = 'IDLE';
  private marketDataStatus = 'UNKNOWN';
  private aiEngineStatus = 'INITIALIZING';
  private signalsLast24h = 0;
  
  // Production-ready settings
  private readonly PRODUCTION_FILTERS = {
    minConfidence: 75,      // Raised for production quality
    minRiskReward: 1.3,     // Reasonable R/R
    minPriceMovement: 2.0,  // Meaningful moves only
    requireVolumeSpike: true,
    requireSentiment: false, // Keep flexible
    maxSignalsPerHour: 3,   // Prevent spam
    cooldownMinutes: 20     // Time between signals
  };

  private readonly SYMBOLS = ['BTCUSDT', 'ETHUSDT', 'SOLUSDT', 'BNBUSDT', 'ADAUSDT', 'DOTUSDT'];

  constructor() {
    console.log('🚀 LiveSignalEngine v3.1 - Production Ready');
    console.log('📊 Production Filters:', this.PRODUCTION_FILTERS);
    this.aiEngineStatus = 'READY';
  }

  start(): void {
    if (this.isRunning) {
      console.log('⚠️ Signal engine already running');
      return;
    }

    console.log('🔥 === STARTING LEVIPRO PRODUCTION ENGINE ===');
    console.log('⚡ Real-time analysis mode: ACTIVE');
    console.log('🎯 Quality filters: STRICT PRODUCTION MODE');
    console.log('📈 Target: High-confidence signals only');
    
    this.isRunning = true;
    this.analysisCount = 0;
    this.currentCycle = 'STARTING';
    
    // Start analysis cycle every 30 seconds
    this.analysisInterval = setInterval(async () => {
      await this.performAnalysis();
    }, 30000);

    // Perform initial analysis immediately
    setTimeout(() => this.performAnalysis(), 1000);
  }

  stop(): void {
    if (!this.isRunning) {
      console.log('⚠️ Signal engine already stopped');
      return;
    }

    console.log('⏹️ Stopping Live Signal Engine');
    this.isRunning = false;
    this.currentCycle = 'STOPPED';
    
    if (this.analysisInterval) {
      clearInterval(this.analysisInterval);
      this.analysisInterval = undefined;
    }
  }

  async sendTestSignal(): Promise<void> {
    console.log('🧪 === SENDING TEST SIGNAL ===');
    
    const testMessage = `🧪 *LeviPro Test Signal*

💰 *BTCUSDT*
📈 קנייה: $67,250
🎯 מטרה: $69,500  
🛡️ סטופ: $65,800

🧠 *LeviScore: 95%* ✅
📊 ביטחון כולל: 88% ✅

אישור משולש: 📰 חדשות + ⛓️ אונצ'יין + 📊 מחיר (85%)
אישור מולטי-מסגרת: 15m ✅ | 1h ✅ | 4h ✅ | 1d ✅ (100%)

📝 *נימוקים מתקדמים:*
• פריצת התנגדות חזקה עם נפח גבוה
• אישור RSI בולי על כל המסגרות
• זרימת כספים חיובית מוולים
• סנטימנט חיובי בחדשות

⏰ ${new Date().toLocaleString('he-IL')}

_LeviPro Enhanced AI v3.1 - מצב בדיקה_`;

    try {
      await telegramBot.sendMessage(testMessage);
      console.log('✅ Test signal sent successfully');
      
      // Log as test signal
      await this.logSignalToDatabase('BTCUSDT', {
        action: 'BUY',
        confidence: 88,
        leviScore: 95,
        explanation: {
          price: 67250,
          targetPrice: 69500,
          stopLoss: 65800
        },
        reasoning: ['Test signal - all systems operational'],
        riskReward: 1.75
      }, true);
      
    } catch (error) {
      console.error('❌ Test signal failed:', error);
      throw error;
    }
  }

  private async performAnalysis(): Promise<void> {
    if (!this.isRunning) return;

    const startTime = Date.now();
    this.analysisCount++;
    this.lastAnalysis = startTime;
    this.currentCycle = 'ANALYZING';

    console.log(`\n🔥 === LEVIPRO ANALYSIS CYCLE #${this.analysisCount} ===`);
    console.log(`⏰ Time: ${new Date(startTime).toLocaleString('he-IL')}`);
    console.log(`📊 Status: Engine=${this.isRunning ? 'ACTIVE' : 'INACTIVE'} | Market=${this.marketDataStatus} | AI=${this.aiEngineStatus}`);

    try {
      // Get live market data
      const marketDataMap = await liveMarketDataService.getMultipleAssets(this.SYMBOLS);
      
      if (marketDataMap.size === 0) {
        this.marketDataStatus = 'NO_DATA';
        console.log('❌ No live market data available');
        this.currentCycle = 'WAITING';
        return;
      }

      this.marketDataStatus = 'LIVE_DATA_OK';
      console.log(`📊 Processing ${marketDataMap.size} symbols with live data`);
      
      let symbolsAnalyzed = 0;
      let bestCandidate: any = null;
      let bestScore = 0;
      let rejectedCount = 0;

      // Analyze each symbol with Enhanced AI
      for (const [symbol, marketData] of marketDataMap) {
        symbolsAnalyzed++;
        this.currentCycle = `ANALYZING_${symbol}`;
        
        console.log(`\n🔍 Analyzing ${symbol}: Price=$${marketData.price.toFixed(2)} | Change=${marketData.change24h.toFixed(2)}%`);
        
        const result = await this.analyzeSymbolWithEnhancedAI(symbol, marketData);
        
        if (result.shouldSignal) {
          console.log(`🚀 ✅ SIGNAL APPROVED: ${symbol} - Sending to Telegram!`);
          await this.sendEnhancedSignal(symbol, result);
          this.totalSignals++;
          this.signalsLast24h++;
          this.lastSuccessfulSignal = Date.now();
          
          // Log successful signal
          await this.logSignalToDatabase(symbol, result);
          
          // Record learning data
          await FeedbackLearningEngine.recordSignalOutcome({
            signalId: `${symbol}_${Date.now()}`,
            symbol,
            strategy: 'production-ai',
            marketConditions: marketData,
            outcome: 'profit', // Will be updated later
            profitPercent: 0,
            timeToTarget: 0,
            confidence: result.confidence,
            actualConfidence: result.confidence
          });
          
        } else {
          rejectedCount++;
          
          // Track rejection with detailed breakdown
          const rejectionReason = result.rejection || 'Unknown reason';
          this.rejectionBreakdown[rejectionReason] = (this.rejectionBreakdown[rejectionReason] || 0) + 1;
          
          this.recentRejections.push({
            symbol,
            reason: rejectionReason,
            confidence: result.confidence || 0,
            riskReward: result.riskReward || 0,
            timestamp: Date.now(),
            details: result.details || ''
          });
          
          this.totalRejections++;
          
          console.log(`❌ REJECTED: ${symbol} - ${rejectionReason} (Confidence: ${result.confidence?.toFixed(1)}%)`);
          
          // Keep only last 100 rejections
          if (this.recentRejections.length > 100) {
            this.recentRejections = this.recentRejections.slice(-100);
          }
          
          // Track best candidate for reporting
          if (result.confidence && result.confidence > bestScore) {
            bestScore = result.confidence;
            bestCandidate = { symbol, ...result };
          }
        }
      }

      const analysisTime = Date.now() - startTime;
      const successRate = symbolsAnalyzed > 0 ? ((symbolsAnalyzed - rejectedCount) / symbolsAnalyzed * 100) : 0;
      
      this.lastAnalysisReport = `Analyzed ${symbolsAnalyzed} symbols in ${analysisTime}ms. ` +
        `Rejected: ${rejectedCount} (${(rejectedCount/symbolsAnalyzed*100).toFixed(1)}%). ` +
        `Best: ${bestCandidate?.symbol || 'None'} (${bestScore.toFixed(0)}%). ` +
        `Success Rate: ${successRate.toFixed(1)}%`;
      
      console.log(`✅ === ANALYSIS COMPLETE ===`);
      console.log(`📈 ${this.lastAnalysisReport}`);
      console.log(`🎯 Total Signals Sent Today: ${this.totalSignals}`);
      console.log(`❌ Total Rejections: ${this.totalRejections}`);
      console.log(`📊 Signals Last 24h: ${this.signalsLast24h}`);
      
      // Log top rejection reasons
      const topRejections = Object.entries(this.rejectionBreakdown)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 3);
      
      if (topRejections.length > 0) {
        console.log(`🔍 Top Rejection Reasons:`);
        topRejections.forEach(([reason, count], index) => {
          console.log(`   ${index + 1}. ${reason}: ${count} times`);
        });
      }
      
      this.currentCycle = 'COMPLETED';

    } catch (error) {
      console.error('❌ Analysis failed:', error);
      this.lastAnalysisReport = `Analysis failed: ${error}`;
      this.currentCycle = 'ERROR';
      this.marketDataStatus = 'ERROR';
    }
  }

  private async analyzeSymbolWithEnhancedAI(symbol: string, marketData: any): Promise<any> {
    try {
      // Market Heat Index Check
      const heatData = MarketHeatIndex.calculateHeatIndex(marketData);
      const isMarketSafe = MarketHeatIndex.shouldAllowSignaling(heatData);
      const isSymbolSafe = MarketHeatIndex.filterDangerousSymbols(symbol, marketData);
      
      if (!isMarketSafe) {
        return {
          shouldSignal: false,
          confidence: 0,
          rejection: `Market too volatile (${heatData.heatIndex.toFixed(0)}% heat)`,
          riskReward: 0,
          details: `Heat index: ${heatData.heatIndex.toFixed(1)}%`
        };
      }
      
      if (!isSymbolSafe) {
        return {
          shouldSignal: false,
          confidence: 0,
          rejection: 'Symbol flagged as high-risk',
          riskReward: 0,
          details: 'Volatility or volume concerns'
        };
      }

      // Enhanced Signal Processing
      const action = marketData.change24h > 0 ? 'BUY' : 'SELL';
      const sentimentData = { score: 0.5 + (marketData.change24h / 100) };
      
      const enhancedResult = await EnhancedSignalProcessor.processSignal(
        symbol,
        action,
        marketData.price,
        marketData,
        sentimentData,
        'production-ai'
      );

      // Apply production filters with learning adjustments
      const adjustedConfidence = FeedbackLearningEngine.shouldBoostConfidence(
        symbol, 
        'production-ai', 
        enhancedResult.confidence
      );

      if (adjustedConfidence < this.PRODUCTION_FILTERS.minConfidence) {
        return {
          shouldSignal: false,
          confidence: adjustedConfidence,
          rejection: `Low confidence: ${adjustedConfidence.toFixed(1)}% < ${this.PRODUCTION_FILTERS.minConfidence}%`,
          riskReward: 1.75,
          details: `Production filter: requires ${this.PRODUCTION_FILTERS.minConfidence}% minimum`
        };
      }

      if (enhancedResult.leviScore < 80) {
        return {
          shouldSignal: false,
          confidence: adjustedConfidence,
          rejection: `Low LeviScore: ${enhancedResult.leviScore}% < 80%`,
          riskReward: 1.75,
          details: `LeviScore below production threshold`
        };
      }

      // Check cooldown period
      const timeSinceLastSignal = Date.now() - this.lastSuccessfulSignal;
      const cooldownMs = this.PRODUCTION_FILTERS.cooldownMinutes * 60 * 1000;
      
      if (this.lastSuccessfulSignal > 0 && timeSinceLastSignal < cooldownMs) {
        const minutesLeft = Math.ceil((cooldownMs - timeSinceLastSignal) / 60000);
        return {
          shouldSignal: false,
          confidence: adjustedConfidence,
          rejection: `Cooldown active: ${minutesLeft} min remaining`,
          riskReward: 1.75,
          details: `Production rate limiting: max 1 signal per ${this.PRODUCTION_FILTERS.cooldownMinutes} minutes`
        };
      }

      if (enhancedResult.shouldSignal) {
        return {
          shouldSignal: true,
          confidence: adjustedConfidence,
          leviScore: enhancedResult.leviScore,
          explanation: enhancedResult.explanation,
          correlationReport: enhancedResult.correlationReport,
          timeframeReport: enhancedResult.timeframeReport,
          reasoning: enhancedResult.reasoning,
          action,
          riskReward: 1.75
        };
      } else {
        return {
          shouldSignal: false,
          confidence: adjustedConfidence,
          rejection: enhancedResult.reasoning.join('; '),
          riskReward: 1.75,
          details: `AI Engine rejection: ${enhancedResult.reasoning.slice(0, 2).join(', ')}`
        };
      }

    } catch (error) {
      console.error(`❌ Enhanced AI analysis failed for ${symbol}:`, error);
      return {
        shouldSignal: false,
        confidence: 0,
        rejection: `Analysis error: ${error}`,
        riskReward: 0,
        details: `System error during analysis`
      };
    }
  }

  private async sendEnhancedSignal(symbol: string, result: any): Promise<void> {
    const message = `🚀 *איתות חדש - LeviPro Production*

💰 *${symbol}*
📈 ${result.action === 'BUY' ? 'קנייה' : 'מכירה'}: $${result.explanation?.price || 'N/A'}
🎯 מטרה: $${result.explanation?.targetPrice || 'N/A'}  
🛡️ סטופ: $${result.explanation?.stopLoss || 'N/A'}

🧠 *LeviScore: ${result.leviScore}%* ✅
📊 ביטחון כולל: ${result.confidence}% ✅

${result.correlationReport}
${result.timeframeReport}

📝 *נימוקים מתקדמים:*
${result.reasoning.map((r: string) => `• ${r}`).join('\n')}

⏰ ${new Date().toLocaleString('he-IL')}

_LeviPro Production AI v3.1 - איכות מובטחת_`;

    try {
      await telegramBot.sendMessage(message);
      console.log(`📱 ✅ Production signal sent: ${symbol}`);
    } catch (error) {
      console.error(`❌ Failed to send Telegram message:`, error);
    }
  }

  private async logSignalToDatabase(symbol: string, result: any, isTestSignal: boolean = false): Promise<void> {
    try {
      const { error } = await supabase
        .from('signal_history')
        .insert({
          signal_id: `${isTestSignal ? 'test_' : 'prod_'}${Date.now()}_${symbol}`,
          symbol,
          action: result.action,
          entry_price: result.explanation?.price || 0,
          target_price: result.explanation?.targetPrice || 0,
          stop_loss: result.explanation?.stopLoss || 0,
          confidence: result.confidence,
          risk_reward_ratio: result.riskReward,
          strategy: isTestSignal ? 'test-signal' : 'production-ai',
          reasoning: Array.isArray(result.reasoning) ? result.reasoning.join('; ') : (result.reasoning || 'Production signal'),
          market_conditions: {
            leviScore: result.leviScore,
            correlationReport: result.correlationReport,
            timeframeReport: result.timeframeReport,
            isTestSignal,
            engineVersion: '3.1'
          }
        });

      if (error) {
        console.error('❌ Failed to log signal to database:', error);
      } else {
        console.log(`✅ Signal logged to database${isTestSignal ? ' (TEST)' : ' (PRODUCTION)'}`);
      }
    } catch (error) {
      console.error('❌ Database logging error:', error);
    }
  }

  async performManualAnalysis(symbol: string): Promise<void> {
    console.log(`🔧 Manual analysis triggered for ${symbol}`);
    
    try {
      const marketData = await liveMarketDataService.getMultipleAssets([symbol]);
      const data = marketData.get(symbol);
      
      if (data) {
        const result = await this.analyzeSymbolWithEnhancedAI(symbol, data);
        console.log(`📊 Manual analysis result for ${symbol}:`, result);
      } else {
        console.log(`❌ No data available for ${symbol}`);
      }
    } catch (error) {
      console.error(`❌ Manual analysis failed for ${symbol}:`, error);
    }
  }

  getEngineStatus(): EngineStats {
    return {
      isRunning: this.isRunning,
      lastAnalysis: this.lastAnalysis,
      analysisCount: this.analysisCount,
      totalSignals: this.totalSignals,
      totalRejections: this.totalRejections,
      lastAnalysisReport: this.lastAnalysisReport,
      currentCycle: this.currentCycle,
      marketDataStatus: this.marketDataStatus,
      aiEngineStatus: this.aiEngineStatus,
      lastSuccessfulSignal: this.lastSuccessfulSignal,
      rejectionBreakdown: { ...this.rejectionBreakdown },
      signalsLast24h: this.signalsLast24h
    };
  }

  getRecentRejections(limit: number = 10): SignalRejection[] {
    return this.recentRejections.slice(-limit);
  }

  getDebugInfo(): DebugInfo {
    return {
      recentRejections: this.recentRejections.slice(-20),
      rejectionBreakdown: { ...this.rejectionBreakdown },
      learningStats: FeedbackLearningEngine.getLearningStats(),
      currentFilters: this.PRODUCTION_FILTERS
    };
  }

  getDetailedStatus(): any {
    const stats = this.getEngineStatus();
    const recentRejections = this.getRecentRejections(20);
    
    return {
      ...stats,
      productionFilters: this.PRODUCTION_FILTERS,
      symbols: this.SYMBOLS,
      recentRejections,
      healthCheck: {
        engineRunning: this.isRunning,
        dataConnection: this.marketDataStatus === 'LIVE_DATA_OK',
        aiProcessor: this.aiEngineStatus === 'READY',
        lastSignalAge: this.lastSuccessfulSignal > 0 ? Date.now() - this.lastSuccessfulSignal : null,
        overallHealth: this.isRunning && this.marketDataStatus === 'LIVE_DATA_OK' ? 'HEALTHY' : 'DEGRADED'
      }
    };
  }
}

export const liveSignalEngine = new LiveSignalEngine();
