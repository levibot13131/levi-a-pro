import { TradingSignal } from '@/types/trading';
import { marketDataService } from './marketDataService';
import { strategyEngine } from './strategyEngine';
import { IntelligenceEnhancedScoring } from './intelligenceEnhancedScoring';
import { unifiedTelegramService } from '../telegram/unifiedTelegramService';
import { SignalScoringEngine } from './signalScoringEngine';
import { riskManagementEngine } from '../risk/riskManagementEngine';

export class EnhancedSignalEngine {
  private isRunning = false;
  private debugMode = false;
  private rejectionStats = {
    total: 0,
    byReason: {} as { [key: string]: number }
  };

  constructor() {
    this.initializeEngine();
  }

  private async initializeEngine() {
    console.log('🚀 LeviPro Enhanced Signal Engine initializing...');
  }

  public async start() {
    if (this.isRunning) {
      console.log('Engine is already running');
      return;
    }

    console.log('▶️ Starting LeviPro Signal Engine with Enhanced Quality Scoring...');
    this.isRunning = true;
  }

  public stop() {
    if (!this.isRunning) {
      console.log('Engine is not running');
      return;
    }

    console.log('⏹️ Stopping LeviPro Signal Engine');
    this.isRunning = false;
  }

  public getEngineStatus() {
    return {
      isRunning: this.isRunning,
      signalQuality: 'Elite Intelligence Layer Active',
      scoringStats: SignalScoringEngine.getDailyStats(),
      intelligenceLayer: {
        whaleMonitoring: true,
        sentimentAnalysis: true,
        fearGreedIntegration: true,
        fundamentalRiskScoring: true
      },
      lastAnalysis: this.isRunning ? new Date().toLocaleTimeString('he-IL') : undefined
    };
  }

  public setDebugMode(enabled: boolean) {
    this.debugMode = enabled;
    console.log(`🔧 Debug mode ${enabled ? 'enabled' : 'disabled'}`);
  }

  private generateBaseSignal(marketData: any): TradingSignal | null {
    const newSignals = strategyEngine.analyzeMarket(marketData);
    if (newSignals.length === 0) return null;
    return newSignals[0];
  }

  public async sendTestSignal(): Promise<boolean> {
    try {
      const mockSignal: TradingSignal = {
        id: `test-${Date.now()}`,
        symbol: 'BTCUSDT',
        strategy: 'test-signal',
        action: 'buy',
        price: 45000,
        targetPrice: 46000,
        stopLoss: 44000,
        confidence: 0.9,
        riskRewardRatio: 2.5,
        reasoning: 'Test signal for demonstration',
        timestamp: Date.now(),
        status: 'active',
        telegramSent: false
      };

      const intelligenceSignal = await IntelligenceEnhancedScoring.scoreSignalWithIntelligence(mockSignal);
      
      const riskCheck = riskManagementEngine.shouldAllowSignal(intelligenceSignal.signal);
      
      if (!riskCheck.allowed) {
        console.log(`🚫 Test signal blocked by risk management: ${riskCheck.reason}`);
        return false;
      }

      const enhancedSignal = {
        ...intelligenceSignal.signal,
        riskData: riskCheck.riskInfo,
        riskSummary: riskManagementEngine.generateRiskSummaryForSignal(intelligenceSignal.signal)
      };

      const sent = await this.sendEnhancedSignal(enhancedSignal, intelligenceSignal);
      return sent;
    } catch (error) {
      console.error('❌ Error sending test signal:', error);
      return false;
    }
  }

  private getQualityEmoji(quality: string): string {
    switch (quality) {
      case 'ELITE': return '💎';
      case 'HIGH': return '🔥';
      case 'MEDIUM': return '🎯';
      case 'LOW': return '⚠️';
      default: return 'ℹ️';
    }
  }

  private storeSignalRecord(signal: any, scoredSignal: any) {
    console.log('📝 Storing signal record:', { signal, scoredSignal });
  }

  private updateStats(quality: string) {
    console.log(`📊 Updating stats for quality: ${quality}`);
  }

  public async analyzeAndSendSignal(marketData: any): Promise<boolean> {
    try {
      const baseSignal = this.generateBaseSignal(marketData);
      if (!baseSignal) return false;

      const intelligenceSignal = await IntelligenceEnhancedScoring.scoreSignalWithIntelligence(baseSignal);
      
      const riskCheck = riskManagementEngine.shouldAllowSignal(intelligenceSignal.signal);
      
      if (!riskCheck.allowed) {
        console.log(`🚫 Signal blocked by risk management: ${riskCheck.reason}`);
        this.logRejectedSignal(intelligenceSignal.signal, 'RISK_EXCEEDED', riskCheck.reason);
        
        if (this.debugMode) {
          const riskWarning = `⚠️ RISK ALERT: Signal for ${intelligenceSignal.signal.symbol} blocked\n${riskCheck.reason}`;
          await telegramBot.sendMessage(riskWarning);
        }
        
        return false;
      }

      const enhancedSignal = {
        ...intelligenceSignal.signal,
        riskData: riskCheck.riskInfo,
        riskSummary: riskManagementEngine.generateRiskSummaryForSignal(intelligenceSignal.signal)
      };

      if (intelligenceSignal.shouldSend && riskCheck.allowed) {
        const sent = await this.sendEnhancedSignal(enhancedSignal, intelligenceSignal);
        
        if (sent) {
          this.updateRiskTracking(enhancedSignal);
          this.updateStats(intelligenceSignal.qualityRating);
          console.log(`✅ Risk-verified signal sent: ${enhancedSignal.symbol} (${intelligenceSignal.qualityRating})`);
          return true;
        }
      }

      return false;
    } catch (error) {
      console.error('❌ Error in enhanced signal analysis:', error);
      return false;
    }
  }

  private async sendEnhancedSignal(signal: any, scoredSignal: any): Promise<boolean> {
    try {
      const telegramMessage = this.formatEnhancedTelegramMessage(signal, scoredSignal);
      const sent = await unifiedTelegramService.sendMessage(telegramMessage);
      
      if (sent) {
        this.storeSignalRecord(signal, scoredSignal);
        window.dispatchEvent(new CustomEvent('enhanced-signal-sent', {
          detail: { signal, scoredSignal, riskData: signal.riskData }
        }));
        console.log('✅ Enhanced signal sent successfully via unified service');
      } else {
        console.error('❌ Failed to send enhanced signal via unified service');
      }
      
      return sent;
    } catch (error) {
      console.error('❌ Error sending enhanced signal:', error);
      return false;
    }
  }

  private formatEnhancedTelegramMessage(signal: any, scoredSignal: any): string {
    const riskData = signal.riskData;
    const intelligenceData = scoredSignal.intelligenceData;
    
    const actionEmoji = signal.action === 'buy' ? '🟢 BUY' : '🔴 SELL';
    const qualityEmoji = this.getQualityEmoji(scoredSignal.qualityRating);
    
    return `
${qualityEmoji} <b>${actionEmoji}: ${signal.symbol}</b>

💰 <b>Entry:</b> $${signal.price.toFixed(2)}
🎯 <b>Target:</b> $${signal.targetPrice.toFixed(2)}
🛑 <b>Stop Loss:</b> $${signal.stopLoss.toFixed(2)}
⚖️ <b>R/R:</b> ${signal.riskRewardRatio.toFixed(2)}:1
📊 <b>Confidence:</b> ${(signal.confidence * 100).toFixed(0)}%

🧠 <b>Intelligence Analysis:</b>
🐋 Whale Activity: ${intelligenceData.whaleActivity?.sentiment || 'Neutral'}
📱 Sentiment: ${intelligenceData.sentiment?.overallSentiment || 'Neutral'}
😰 Fear & Greed: ${intelligenceData.fearGreed?.classification || 'Unknown'}
🚨 Risk Level: ${intelligenceData.fundamentalRisk}

${signal.riskSummary}

🎯 <b>Strategy:</b> ${signal.strategy}
⏰ <b>Time:</b> ${new Date().toLocaleString('he-IL')}

#LeviPro #${scoredSignal.qualityRating} #RiskManaged
`;
  }

  private updateRiskTracking(signal: any) {
    console.log(`📊 Risk tracking updated for ${signal.symbol}:`, {
      positionSize: signal.riskData?.recommendedPositionSize,
      riskAmount: signal.riskData?.riskAmount,
      exposurePercent: signal.riskData?.exposurePercent
    });
  }

  private logRejectedSignal(signal: any, reason: string, details?: string) {
    const rejection = {
      timestamp: Date.now(),
      symbol: signal.symbol,
      action: signal.action,
      price: signal.price,
      reason,
      details,
      strategy: signal.strategy
    };
    
    console.log('📝 Signal rejected:', rejection);
    this.rejectionStats.total++;
    this.rejectionStats.byReason[reason] = (this.rejectionStats.byReason[reason] || 0) + 1;
  }

  public getRejectionStats() {
    return { ...this.rejectionStats };
  }

  public async startEliteEngine() {
    return this.start();
  }

  public async stopEngine() {
    return this.stop();
  }
}

export const enhancedSignalEngine = new EnhancedSignalEngine();
