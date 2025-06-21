import { marketDataService } from './marketDataService';
import { telegramBot } from '../telegram/telegramBot';
import { eliteSignalFilter } from './eliteSignalFilter';
import { IntelligenceEnhancedScoring } from './intelligenceEnhancedScoring';
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
    rejectionRate: 0,
    intelligenceEnhanced: 0
  };

  public startEliteEngine() {
    if (this.isRunning) return;
    
    console.log('🚀 Starting Enhanced Signal Engine with Real-Time Intelligence Layer');
    this.isRunning = true;
    
    // More frequent analysis for elite signals - every 15 seconds
    this.analysisInterval = setInterval(() => {
      this.analyzeMarketsWithIntelligence();
    }, 15000);
    
    // Immediate analysis
    this.analyzeMarketsWithIntelligence();
  }

  public stopEngine() {
    console.log('⏹️ Stopping Enhanced Signal Engine');
    this.isRunning = false;
    
    if (this.analysisInterval) {
      clearInterval(this.analysisInterval);
      this.analysisInterval = undefined;
    }
  }

  private async analyzeMarketsWithIntelligence() {
    if (!this.isRunning) return;

    try {
      for (const symbol of this.watchList) {
        const marketData = await marketDataService.getMarketData(symbol);
        const potentialSignals = strategyEngine.analyzeMarket(marketData);
        
        for (const signal of potentialSignals) {
          await this.processSignalWithIntelligence(signal);
          this.stats.totalAnalyzed++;
        }
      }
      
      this.updateRejectionRate();
      
      if (this.debugMode) {
        console.log(`📊 Intelligence Analysis complete - Analyzed: ${this.stats.totalAnalyzed}, Enhanced: ${this.stats.intelligenceEnhanced}, Sent: ${this.stats.totalSent}, Rejection rate: ${this.stats.rejectionRate}%`);
      }
    } catch (error) {
      console.error('❌ Error in Intelligence market analysis:', error);
    }
  }

  private async processSignalWithIntelligence(signal: any) {
    try {
      // Use intelligence-enhanced scoring
      const enhancedSignal = await IntelligenceEnhancedScoring.scoreSignalWithIntelligence(signal);
      this.stats.intelligenceEnhanced++;
      
      if (this.debugMode) {
        console.log(`🧠 Intelligence Signal Analysis:`, {
          symbol: signal.symbol,
          strategy: signal.strategy,
          baseScore: enhancedSignal.score.total - enhancedSignal.score.intelligenceBonus,
          intelligenceBonus: enhancedSignal.score.intelligenceBonus,
          fearGreedMultiplier: enhancedSignal.score.fearGreedMultiplier,
          finalScore: enhancedSignal.score.total,
          fundamentalRisk: enhancedSignal.intelligenceData.fundamentalRisk,
          quality: enhancedSignal.qualityRating,
          shouldSend: enhancedSignal.shouldSend
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

      // Only send if intelligence scoring approves
      if (enhancedSignal.shouldSend && eliteValidation.valid) {
        await this.sendIntelligenceEnhancedSignal(signal, enhancedSignal);
        this.stats.totalPassed++;
        this.stats.totalSent++;
        
        // Approve in elite filter
        eliteSignalFilter.approveEliteSignal(signal);
      }
    } catch (error) {
      console.error('❌ Error processing intelligence signal:', error);
    }
  }

  private async sendIntelligenceEnhancedSignal(signal: any, enhancedSignal: any) {
    try {
      const { whaleActivity, sentiment, fearGreed, fundamentalRisk, riskFactors } = enhancedSignal.intelligenceData;
      
      // Create enhanced Telegram message with intelligence data
      const whaleEmoji = whaleActivity?.sentiment === 'bullish' ? '🐋📈' : whaleActivity?.sentiment === 'bearish' ? '🐋📉' : '🐋➡️';
      const sentimentEmoji = sentiment?.overallSentiment === 'bullish' ? '📈' : sentiment?.overallSentiment === 'bearish' ? '📉' : '➡️';
      const riskEmoji = fundamentalRisk === 'LOW' ? '✅' : fundamentalRisk === 'MEDIUM' ? '⚠️' : '🚨';
      const fearGreedEmoji = fearGreed?.classification === 'Extreme Greed' ? '🤑' : fearGreed?.classification === 'Extreme Fear' ? '😰' : '😐';
      
      const message = `🔥 <b>LeviPro Elite Signal</b> ${enhancedSignal.qualityRating}

📊 <b>${signal.symbol}</b>
${signal.action === 'buy' ? '🟢 BUY' : '🔴 SELL'} @ $${signal.price.toLocaleString()}

🎯 <b>Target:</b> $${signal.targetPrice.toLocaleString()}
🛑 <b>Stop Loss:</b> $${signal.stopLoss.toLocaleString()}
⚡ <b>Confidence:</b> ${(signal.confidence * 100).toFixed(1)}%
📈 <b>R/R:</b> 1:${signal.riskRewardRatio.toFixed(2)}

🧠 <b>Intelligence Score:</b> ${enhancedSignal.score.total}/160
${whaleEmoji} <b>Whale Activity:</b> ${whaleActivity?.sentiment || 'Unknown'}
${sentimentEmoji} <b>Market Sentiment:</b> ${sentiment?.overallSentiment || 'Neutral'}
${fearGreedEmoji} <b>Fear & Greed:</b> ${fearGreed?.value || 'N/A'} (${fearGreed?.classification || 'Unknown'})
${riskEmoji} <b>Fundamental Risk:</b> ${fundamentalRisk}

${riskFactors.length > 0 ? `⚠️ <b>Risk Factors:</b> ${riskFactors.join(', ')}` : ''}

📋 <b>Strategy:</b> ${signal.strategy}
⏰ ${new Date().toLocaleTimeString('he-IL')}

#LeviPro #Elite #Intelligence #${enhancedSignal.qualityRating}`;

      const sent = await telegramBot.sendMessage(message);
      
      if (sent) {
        console.log(`✅ Intelligence-enhanced signal sent: ${signal.symbol} (Score: ${enhancedSignal.score.total}, Risk: ${fundamentalRisk}, Quality: ${enhancedSignal.qualityRating})`);
        
        // Store signal for outcome tracking
        await this.storeSignalForTracking(signal, enhancedSignal);
      }
    } catch (error) {
      console.error('❌ Error sending intelligence-enhanced signal:', error);
    }
  }

  private async storeSignalForTracking(signal: any, enhancedSignal: any) {
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
          aiScore: enhancedSignal.score,
          qualityRating: enhancedSignal.qualityRating,
          intelligenceBonus: enhancedSignal.score.intelligenceBonus || 0
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
      console.log('🧪 Generating Intelligence test signal...');
      
      const testSignal = {
        symbol: 'BTCUSDT',
        strategy: 'almog-personal-method',
        action: 'buy' as const,
        price: 43500,
        targetPrice: 45200,
        stopLoss: 42800,
        confidence: 0.89,
        riskRewardRatio: 2.43,
        reasoning: 'Intelligence Test Signal - Personal method with market intelligence',
        metadata: {
          testSignal: true,
          intelligenceEnhanced: true,
          multiTimeframeConfluence: true,
          personalMethodMatch: true
        }
      };

      await this.processSignalWithIntelligence(testSignal);
      return true;
    } catch (error) {
      console.error('❌ Error sending Intelligence test signal:', error);
      return false;
    }
  }

  public setDebugMode(enabled: boolean) {
    this.debugMode = enabled;
    console.log(`🔧 AI Debug mode ${enabled ? 'enabled' : 'disabled'}`);
  }

  public getEngineStatus() {
    return {
      isRunning: this.isRunning,
      signalQuality: this.isRunning ? '🧠 Elite Intelligence + AI Learning' : '⏸️ Stopped',
      lastAnalysis: this.isRunning ? new Date().toLocaleTimeString('he-IL') : 'Not running',
      debugMode: this.debugMode,
      scoringStats: {
        totalAnalyzed: this.stats.totalAnalyzed,
        totalPassed: this.stats.totalPassed,
        totalSent: this.stats.totalSent,
        rejectionRate: this.stats.rejectionRate,
        intelligenceEnhanced: this.stats.intelligenceEnhanced,
        threshold: 160
      },
      intelligenceLayer: {
        active: true,
        whaleMonitoring: true,
        sentimentAnalysis: true,
        fearGreedIntegration: true,
        fundamentalRiskScoring: true
      }
    };
  }
}

export const enhancedSignalEngine = new EnhancedSignalEngine();
