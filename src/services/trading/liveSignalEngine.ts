import { liveMarketDataService } from './liveMarketDataService';
import { telegramBot } from '../telegram/telegramBot';
import { supabase } from '@/integrations/supabase/client';
import { EnhancedSignalProcessor } from '../ai/enhancedSignalProcessor';
import { MarketHeatIndex } from '../ai/marketHeatIndex';

interface SignalRejection {
  symbol: string;
  reason: string;
  confidence: number;
  riskReward: number;
  timestamp: number;
}

class LiveSignalEngine {
  private isRunning = false;
  private analysisInterval?: NodeJS.Timeout;
  private lastAnalysis = 0;
  private analysisCount = 0;
  private totalSignals = 0;
  private lastAnalysisReport = '';
  private recentRejections: SignalRejection[] = [];
  
  // Relaxed settings for production testing
  private readonly RELAXED_FILTERS = {
    minConfidence: 70,      // Reduced from 80
    minRiskReward: 1.2,     // Reduced from 1.5  
    minPriceMovement: 1.5,  // Reduced from 2.5
    requireVolumeSpike: false,
    requireSentiment: false
  };

  private readonly SYMBOLS = ['BTCUSDT', 'ETHUSDT', 'SOLUSDT', 'BNBUSDT', 'ADAUSDT', 'DOTUSDT'];

  constructor() {
    console.log('🚀 Live Signal Engine initialized with RELAXED filters for production testing');
  }

  start(): void {
    if (this.isRunning) {
      console.log('⚠️ Signal engine already running');
      return;
    }

    console.log('▶️ Starting Live Signal Engine with Enhanced AI');
    this.isRunning = true;
    this.analysisCount = 0;
    
    // Start analysis cycle every 30 seconds
    this.analysisInterval = setInterval(async () => {
      await this.performAnalysis();
    }, 30000);

    // Perform initial analysis
    this.performAnalysis();
  }

  stop(): void {
    if (!this.isRunning) {
      console.log('⚠️ Signal engine already stopped');
      return;
    }

    console.log('⏹️ Stopping Live Signal Engine');
    this.isRunning = false;
    
    if (this.analysisInterval) {
      clearInterval(this.analysisInterval);
      this.analysisInterval = undefined;
    }
  }

  private async performAnalysis(): Promise<void> {
    if (!this.isRunning) return;

    const startTime = Date.now();
    this.analysisCount++;
    this.lastAnalysis = startTime;

    console.log(`\n🔥 === LEVIPRO ENHANCED ANALYSIS CYCLE #${this.analysisCount} ===`);
    console.log(`⏰ Time: ${new Date(startTime).toLocaleString('he-IL')}`);

    try {
      // Get live market data
      const marketDataMap = await liveMarketDataService.getMultipleAssets(this.SYMBOLS);
      
      if (marketDataMap.size === 0 || !marketDataMap.has('BTCUSDT')) {
        console.log('❌ No live market data available - using Edge Function fallback');
        await this.tryEdgeFunctionAnalysis();
        return;
      }

      console.log(`📊 Processing ${marketDataMap.size} symbols with live data`);
      
      let symbolsAnalyzed = 0;
      let bestCandidate: any = null;
      let bestScore = 0;

      // Analyze each symbol with Enhanced AI
      for (const [symbol, marketData] of marketDataMap) {
        symbolsAnalyzed++;
        
        const result = await this.analyzeSymbolWithEnhancedAI(symbol, marketData);
        
        if (result.shouldSignal) {
          console.log(`🚀 ✅ SIGNAL APPROVED: ${symbol} - Sending to Telegram!`);
          await this.sendEnhancedSignal(symbol, result);
          this.totalSignals++;
          
          // Log successful signal
          await this.logSignalToDatabase(symbol, result);
        } else {
          // Track rejection
          this.recentRejections.push({
            symbol,
            reason: result.rejection || 'Unknown reason',
            confidence: result.confidence || 0,
            riskReward: result.riskReward || 0,
            timestamp: Date.now()
          });
          
          // Keep only last 50 rejections
          if (this.recentRejections.length > 50) {
            this.recentRejections = this.recentRejections.slice(-50);
          }
          
          // Track best candidate
          if (result.confidence > bestScore) {
            bestScore = result.confidence;
            bestCandidate = { symbol, ...result };
          }
        }
      }

      const analysisTime = Date.now() - startTime;
      this.lastAnalysisReport = `Analyzed ${symbolsAnalyzed} symbols in ${analysisTime}ms. Best candidate: ${bestCandidate?.symbol || 'None'} (${bestScore.toFixed(0)}%)`;
      
      console.log(`✅ Analysis complete: ${this.lastAnalysisReport}`);

    } catch (error) {
      console.error('❌ Analysis failed:', error);
      this.lastAnalysisReport = `Analysis failed: ${error}`;
    }
  }

  private async analyzeSymbolWithEnhancedAI(symbol: string, marketData: any): Promise<any> {
    console.log(`\n🧠 Enhanced AI Analysis: ${symbol}`);
    console.log(`💰 Price: $${marketData.price.toFixed(2)} | Change: ${marketData.change24h.toFixed(2)}%`);

    try {
      // Market Heat Index Check
      const heatData = MarketHeatIndex.calculateHeatIndex(marketData);
      const isMarketSafe = MarketHeatIndex.shouldAllowSignaling(heatData);
      const isSymbolSafe = MarketHeatIndex.filterDangerousSymbols(symbol, marketData);
      
      console.log(`🌡️ ${MarketHeatIndex.getHeatIndexDescription(heatData)}`);
      
      if (!isMarketSafe) {
        return {
          shouldSignal: false,
          confidence: 0,
          rejection: `Market too cold (${heatData.heatIndex.toFixed(0)}% heat)`,
          riskReward: 0
        };
      }
      
      if (!isSymbolSafe) {
        return {
          shouldSignal: false,
          confidence: 0,
          rejection: 'Symbol flagged as dangerous',
          riskReward: 0
        };
      }

      // Enhanced Signal Processing
      const action = marketData.change24h > 0 ? 'BUY' : 'SELL';
      const sentimentData = { score: 0.5 + (marketData.change24h / 100) }; // Mock sentiment
      
      const enhancedResult = await EnhancedSignalProcessor.processSignal(
        symbol,
        action,
        marketData.price,
        marketData,
        sentimentData,
        'enhanced-ai'
      );

      console.log(`🎯 Enhanced Result: Confidence=${enhancedResult.confidence}% | LeviScore=${enhancedResult.leviScore}%`);
      console.log(`🔗 ${enhancedResult.correlationReport}`);
      console.log(`⏰ ${enhancedResult.timeframeReport}`);

      if (enhancedResult.shouldSignal) {
        return {
          shouldSignal: true,
          confidence: enhancedResult.confidence,
          leviScore: enhancedResult.leviScore,
          explanation: enhancedResult.explanation,
          correlationReport: enhancedResult.correlationReport,
          timeframeReport: enhancedResult.timeframeReport,
          reasoning: enhancedResult.reasoning,
          action,
          riskReward: 1.75 // Fixed for LeviPro method
        };
      } else {
        return {
          shouldSignal: false,
          confidence: enhancedResult.confidence,
          rejection: enhancedResult.reasoning.join('; '),
          riskReward: 1.75
        };
      }

    } catch (error) {
      console.error(`❌ Enhanced AI analysis failed for ${symbol}:`, error);
      return {
        shouldSignal: false,
        confidence: 0,
        rejection: `Analysis error: ${error}`,
        riskReward: 0
      };
    }
  }

  private async sendEnhancedSignal(symbol: string, result: any): Promise<void> {
    const message = `🚀 *איתות חדש - LeviPro Enhanced AI*

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

_LeviPro Enhanced AI v3.0 - מבוסס למידה_`;

    try {
      await telegramBot.sendMessage(message);
      console.log(`📱 ✅ Enhanced signal sent to Telegram: ${symbol}`);
    } catch (error) {
      console.error(`❌ Failed to send Telegram message:`, error);
    }
  }

  private async tryEdgeFunctionAnalysis(): Promise<void> {
    try {
      console.log('🔄 Attempting Edge Function analysis...');
      const { data, error } = await supabase.functions.invoke('trading-signals-engine');
      
      if (error) {
        console.error('❌ Edge function failed:', error);
        return;
      }
      
      console.log('✅ Edge function completed:', data);
    } catch (error) {
      console.error('❌ Edge function invocation failed:', error);
    }
  }

  private async logSignalToDatabase(symbol: string, result: any): Promise<void> {
    try {
      const { error } = await supabase
        .from('signal_history')
        .insert({
          signal_id: `enhanced_${Date.now()}_${symbol}`,
          symbol,
          action: result.action,
          entry_price: result.explanation?.price || 0,
          target_price: result.explanation?.targetPrice || 0,
          stop_loss: result.explanation?.stopLoss || 0,
          confidence: result.confidence,
          risk_reward_ratio: result.riskReward,
          strategy: 'enhanced-ai',
          reasoning: result.reasoning.join('; '),
          market_conditions: {
            leviScore: result.leviScore,
            correlationReport: result.correlationReport,
            timeframeReport: result.timeframeReport
          }
        });

      if (error) {
        console.error('❌ Failed to log signal to database:', error);
      } else {
        console.log('✅ Signal logged to database');
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
        await this.analyzeSymbolWithEnhancedAI(symbol, data);
      } else {
        console.log(`❌ No data available for ${symbol}`);
      }
    } catch (error) {
      console.error(`❌ Manual analysis failed for ${symbol}:`, error);
    }
  }

  getEngineStatus() {
    return {
      isRunning: this.isRunning,
      lastAnalysis: this.lastAnalysis,
      analysisCount: this.analysisCount,
      totalSignals: this.totalSignals,
      lastAnalysisReport: this.lastAnalysisReport
    };
  }

  getRecentRejections(limit: number = 10): SignalRejection[] {
    return this.recentRejections.slice(-limit);
  }

  getDebugInfo(): any {
    return {
      recentRejections: this.recentRejections.slice(-20),
      filters: this.RELAXED_FILTERS,
      symbols: this.SYMBOLS,
      status: this.getEngineStatus()
    };
  }
}

export const liveSignalEngine = new LiveSignalEngine();
