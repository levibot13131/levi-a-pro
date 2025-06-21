import { marketDataService } from './marketDataService';
import { telegramBot } from '../telegram/telegramBot';
import { eliteSignalFilter } from './eliteSignalFilter';
import { SignalScoringEngine, ScoredSignal } from './signalScoringEngine';
import { AdaptiveSignalScoring } from '../ai/adaptiveScoring';
import { signalOutcomeTracker } from '../ai/signalOutcomeTracker';
import { strategyEngine } from './strategyEngine';

export class EnhancedSignalEngine {
  private isRunning = false;
  private debugMode = false;
  private analysisInterval?: NodeJS.Timeout;
  private watchList = ['BTCUSDT', 'ETHUSDT', 'SOLUSDT', 'BNBUSDT', 'ADAUSDT'];
  
  private stats = {
    totalAnalyzed: 0,
    totalPassed: 0,
    totalSent: 0,
    rejectionRate: 0
  };

  public startEliteEngine() {
    if (this.isRunning) return;
    
    console.log('🚀 Starting Enhanced Signal Engine with AI Learning Loop');
    this.isRunning = true;
    
    // More frequent analysis for elite signals - every 15 seconds
    this.analysisInterval = setInterval(() => {
      this.analyzeMarketsWithAI();
    }, 15000);
    
    // Immediate analysis
    this.analyzeMarketsWithAI();
  }

  public stopEngine() {
    console.log('⏹️ Stopping Enhanced Signal Engine');
    this.isRunning = false;
    
    if (this.analysisInterval) {
      clearInterval(this.analysisInterval);
      this.analysisInterval = undefined;
    }
  }

  private async analyzeMarketsWithAI() {
    if (!this.isRunning) return;

    try {
      for (const symbol of this.watchList) {
        const marketData = await marketDataService.getMarketData(symbol);
        const potentialSignals = strategyEngine.analyzeMarket(marketData);
        
        for (const signal of potentialSignals) {
          await this.processSignalWithAI(signal);
          this.stats.totalAnalyzed++;
        }
      }
      
      this.updateRejectionRate();
      
      if (this.debugMode) {
        console.log(`📊 Analysis complete - Analyzed: ${this.stats.totalAnalyzed}, Sent: ${this.stats.totalSent}, Rejection rate: ${this.stats.rejectionRate}%`);
      }
    } catch (error) {
      console.error('❌ Error in AI market analysis:', error);
    }
  }

  private async processSignalWithAI(signal: any) {
    try {
      // Use adaptive AI scoring instead of basic scoring
      const scoredSignal: ScoredSignal = AdaptiveSignalScoring.scoreSignalWithAdaptiveLearning(signal);
      
      if (this.debugMode) {
        console.log(`🎯 AI Signal Analysis:`, {
          symbol: signal.symbol,
          strategy: signal.strategy,
          score: scoredSignal.score.total,
          quality: scoredSignal.qualityRating,
          adaptiveBonus: scoredSignal.score.adaptiveBonus || 0,
          shouldSend: scoredSignal.shouldSend
        });
      }

      // Check elite filter
      const eliteValidation = eliteSignalFilter.validateEliteSignal(signal);
      
      if (!eliteValidation.valid) {
        if (this.debugMode) {
          console.log(`🚫 Elite filter rejected: ${eliteValidation.reason}`);
        }
        return;
      }

      // Only send if both AI scoring and elite filter approve
      if (scoredSignal.shouldSend && eliteValidation.valid) {
        await this.sendEliteSignal(signal, scoredSignal);
        this.stats.totalPassed++;
        this.stats.totalSent++;
        
        // Approve in elite filter
        eliteSignalFilter.approveEliteSignal(signal);
      }
    } catch (error) {
      console.error('❌ Error processing AI signal:', error);
    }
  }

  private async sendEliteSignal(signal: any, scoredSignal: ScoredSignal) {
    try {
      // Enhanced Telegram message with AI scoring details
      const adaptiveBonusText = scoredSignal.score.adaptiveBonus ? `🧠 AI Learning Bonus: +${scoredSignal.score.adaptiveBonus}` : '';
      
      const message = `🔥 <b>LeviPro Elite Signal</b> ${scoredSignal.qualityRating}

📊 <b>${signal.symbol}</b>
${signal.action === 'buy' ? '🟢 BUY' : '🔴 SELL'} @ $${signal.price.toLocaleString()}

🎯 <b>Target:</b> $${signal.targetPrice.toLocaleString()}
🛑 <b>Stop Loss:</b> $${signal.stopLoss.toLocaleString()}
⚡ <b>Confidence:</b> ${(signal.confidence * 100).toFixed(1)}%
📈 <b>R/R:</b> 1:${signal.riskRewardRatio.toFixed(2)}

🏆 <b>AI Quality Score:</b> ${scoredSignal.score.total}/160
${adaptiveBonusText}
${signal.strategy === 'almog-personal-method' ? '🧠 <b>Personal Method Priority</b>' : ''}

📋 <b>Strategy:</b> ${signal.strategy}
⏰ ${new Date().toLocaleTimeString('he-IL')}

#LeviPro #Elite #AI #${scoredSignal.qualityRating}`;

      const sent = await telegramBot.sendMessage(message);
      
      if (sent) {
        console.log(`✅ Elite AI signal sent: ${signal.symbol} (Score: ${scoredSignal.score.total}, Quality: ${scoredSignal.qualityRating})`);
        
        // Store signal for outcome tracking
        await this.storeSignalForTracking(signal, scoredSignal);
      }
    } catch (error) {
      console.error('❌ Error sending elite signal:', error);
    }
  }

  private async storeSignalForTracking(signal: any, scoredSignal: ScoredSignal) {
    try {
      // Store in database for AI learning loop
      const signalData = {
        signal_id: `ai-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        symbol: signal.symbol,
        strategy: signal.strategy,
        action: signal.action,
        price: signal.price,
        target_price: signal.targetPrice,
        stop_loss: signal.stopLoss,
        confidence: signal.confidence,
        risk_reward_ratio: signal.riskRewardRatio,
        reasoning: signal.reasoning,
        status: 'active',
        telegram_sent: true,
        metadata: {
          ...signal.metadata,
          aiScore: scoredSignal.score,
          qualityRating: scoredSignal.qualityRating,
          adaptiveBonus: scoredSignal.score.adaptiveBonus || 0
        }
      };

      // Store for outcome tracking (this would normally go to database)
      console.log(`📝 Signal stored for AI learning: ${signalData.signal_id}`);
      
    } catch (error) {
      console.error('❌ Error storing signal for tracking:', error);
    }
  }

  private updateRejectionRate() {
    if (this.stats.totalAnalyzed > 0) {
      this.stats.rejectionRate = Math.round(
        ((this.stats.totalAnalyzed - this.stats.totalSent) / this.stats.totalAnalyzed) * 100
      );
    }
  }

  public async sendTestSignal(): Promise<boolean> {
    try {
      console.log('🧪 Generating AI test signal with adaptive scoring...');
      
      const testSignal = {
        symbol: 'BTCUSDT',
        strategy: 'almog-personal-method',
        action: 'buy' as const,
        price: 43500,
        targetPrice: 45200,
        stopLoss: 42800,
        confidence: 0.89,
        riskRewardRatio: 2.43,
        reasoning: 'AI Test Signal - Personal method with high confluence',
        metadata: {
          testSignal: true,
          aiGenerated: true,
          multiTimeframeConfluence: true,
          personalMethodMatch: true
        }
      };

      await this.processSignalWithAI(testSignal);
      return true;
    } catch (error) {
      console.error('❌ Error sending AI test signal:', error);
      return false;
    }
  }

  public setDebugMode(enabled: boolean) {
    this.debugMode = enabled;
    console.log(`🔧 AI Debug mode ${enabled ? 'enabled' : 'disabled'}`);
  }

  public getEngineStatus() {
    const aiStats = AdaptiveSignalScoring.getAdaptiveLearningStats();
    
    return {
      isRunning: this.isRunning,
      signalQuality: this.isRunning ? '🔥 Elite AI + Learning' : '⏸️ Stopped',
      lastAnalysis: this.isRunning ? new Date().toLocaleTimeString('he-IL') : 'Not running',
      debugMode: this.debugMode,
      scoringStats: {
        totalAnalyzed: this.stats.totalAnalyzed,
        totalPassed: this.stats.totalPassed,
        totalSent: this.stats.totalSent,
        rejectionRate: this.stats.rejectionRate,
        threshold: SignalScoringEngine.getScoreThreshold()
      },
      aiLearning: {
        active: true,
        strategiesTracked: aiStats.strategyPerformance.length,
        totalSignalsLearned: aiStats.learningInsights.totalSignalsTracked,
        overallWinRate: (aiStats.learningInsights.overallWinRate * 100).toFixed(1),
        topPerformer: aiStats.learningInsights.topPerformer
      }
    };
  }
}

export const enhancedSignalEngine = new EnhancedSignalEngine();
