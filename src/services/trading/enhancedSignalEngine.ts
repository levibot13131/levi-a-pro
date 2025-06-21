import { TradingSignal } from '@/types/trading';
import { marketDataService } from './marketDataService';
import { strategyEngine } from './strategyEngine';
import { IntelligenceEnhancedScoring } from './intelligenceEnhancedScoring';
import { telegramBot } from '../telegram/telegramBot';
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
      }
    };
  }

  public setDebugMode(enabled: boolean) {
    this.debugMode = enabled;
    console.log(`🔧 Debug mode ${enabled ? 'enabled' : 'disabled'}`);
  }

  private generateBaseSignal(marketData: any): TradingSignal | null {
    // Placeholder - replace with actual signal generation logic
    const newSignals = strategyEngine.analyzeMarket(marketData);
    if (newSignals.length === 0) return null;
    return newSignals[0]; // Just take the first one for simplicity
  }

  public async sendTestSignal(): Promise<boolean> {
    try {
      // Mock signal data
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

      // Apply intelligence scoring
      const intelligenceSignal = await IntelligenceEnhancedScoring.scoreSignalWithIntelligence(mockSignal);
      
      // ✅ NEW: Apply risk management filtering
      const riskCheck = riskManagementEngine.shouldAllowSignal(intelligenceSignal.signal);
      
      if (!riskCheck.allowed) {
        console.log(`🚫 Test signal blocked by risk management: ${riskCheck.reason}`);
        return false;
      }

      // Enhanced signal with risk data
      const enhancedSignal = {
        ...intelligenceSignal.signal,
        riskData: riskCheck.riskInfo,
        riskSummary: riskManagementEngine.generateRiskSummaryForSignal(intelligenceSignal.signal)
      };

      // Send enhanced signal
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
    // Placeholder - store signal in database or local tracking
    console.log('📝 Storing signal record:', { signal, scoredSignal });
  }

  private updateStats(quality: string) {
    // Placeholder - update signal statistics
    console.log(`📊 Updating stats for quality: ${quality}`);
  }

  public async analyzeAndSendSignal(marketData: any): Promise<boolean> {
    try {
      // Generate base signal
      const baseSignal = this.generateBaseSignal(marketData);
      if (!baseSignal) return false;

      // Apply intelligence scoring
      const intelligenceSignal = await IntelligenceEnhancedScoring.scoreSignalWithIntelligence(baseSignal);
      
      // ✅ NEW: Apply risk management filtering
      const riskCheck = riskManagementEngine.shouldAllowSignal(intelligenceSignal.signal);
      
      if (!riskCheck.allowed) {
        console.log(`🚫 Signal blocked by risk management: ${riskCheck.reason}`);
        
        // Log rejection for analytics
        this.logRejectedSignal(intelligenceSignal.signal, 'RISK_EXCEEDED', riskCheck.reason);
        
        // Optionally send risk warning to Telegram
        if (this.debugMode) {
          const riskWarning = `⚠️ RISK ALERT: Signal for ${intelligenceSignal.signal.symbol} blocked\n${riskCheck.reason}`;
          await telegramBot.sendMessage(riskWarning);
        }
        
        return false;
      }

      // Enhanced signal with risk data
      const enhancedSignal = {
        ...intelligenceSignal.signal,
        riskData: riskCheck.riskInfo,
        riskSummary: riskManagementEngine.generateRiskSummaryForSignal(intelligenceSignal.signal)
      };

      // Check if should send based on quality and risk
      if (intelligenceSignal.shouldSend && riskCheck.allowed) {
        const sent = await this.sendEnhancedSignal(enhancedSignal, intelligenceSignal);
        
        if (sent) {
          // Update risk tracking
          this.updateRiskTracking(enhancedSignal);
          
          // Update statistics
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
      // Enhanced Telegram message with risk data
      const telegramMessage = this.formatEnhancedTelegramMessage(signal, scoredSignal);
      
      // Send to Telegram
      const sent = await telegramBot.sendMessage(telegramMessage);
      
      if (sent) {
        // Store in database or local tracking
        this.storeSignalRecord(signal, scoredSignal);
        
        // Emit for UI updates
        window.dispatchEvent(new CustomEvent('enhanced-signal-sent', {
          detail: { signal, scoredSignal, riskData: signal.riskData }
        }));
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
    // This would be called when position is opened
    // For now, just log the risk exposure
    console.log(`📊 Risk tracking updated for ${signal.symbol}:`, {
      positionSize: signal.riskData?.recommendedPositionSize,
      riskAmount: signal.riskData?.riskAmount,
      exposurePercent: signal.riskData?.exposurePercent
    });
  }

  private logRejectedSignal(signal: any, reason: string, details?: string) {
    // Store rejected signals for analysis
    const rejection = {
      timestamp: Date.now(),
      symbol: signal.symbol,
      action: signal.action,
      price: signal.price,
      reason,
      details,
      strategy: signal.strategy
    };
    
    // Add to rejection log (could be stored in database)
    console.log('📝 Signal rejected:', rejection);
    
    // Update rejection statistics
    this.rejectionStats.total++;
    this.rejectionStats.byReason[reason] = (this.rejectionStats.byReason[reason] || 0) + 1;
  }

  public getRejectionStats() {
    return { ...this.rejectionStats };
  }
}
