
import { TradingSignal } from '@/types/trading';
import { toast } from 'sonner';

export class SignalManager {
  private activeSignals: Map<string, TradingSignal> = new Map();
  private dailySignalCount = 0;
  private dailyLoss = 0;
  private lastResetDate = new Date().toDateString();
  private sessionSignalsCount = 0;
  private sessionStartTime = Date.now();

  // Daily limits for LeviPro Method
  private readonly MAX_DAILY_LOSS_PERCENT = 5;
  private readonly MAX_SESSION_SIGNALS = 3;
  private readonly SESSION_DURATION = 8 * 60 * 60 * 1000; // 8 hours
  private readonly CONFLICT_PREVENTION_WINDOW = 5 * 60 * 1000; // 5 minutes

  constructor() {
    this.resetDailyCountersIfNeeded();
  }

  private resetDailyCountersIfNeeded() {
    const today = new Date().toDateString();
    if (this.lastResetDate !== today) {
      this.dailySignalCount = 0;
      this.dailyLoss = 0;
      this.lastResetDate = today;
      console.log('🔄 Daily signal counters reset');
    }

    // Reset session if expired
    if (Date.now() - this.sessionStartTime > this.SESSION_DURATION) {
      this.sessionSignalsCount = 0;
      this.sessionStartTime = Date.now();
      console.log('🔄 Session signal counters reset');
    }
  }

  public canCreateSignal(symbol: string, action: 'buy' | 'sell', strategy: string): { allowed: boolean; reason?: string } {
    this.resetDailyCountersIfNeeded();

    // Check for conflicting signals
    const conflictingSignal = this.findConflictingSignal(symbol, action);
    if (conflictingSignal) {
      return {
        allowed: false,
        reason: `איתות מתנגש עם ${conflictingSignal.action} פעיל על ${symbol}`
      };
    }

    // Special checks for LeviPro Method (Personal Strategy)
    if (strategy === 'almog-personal-method') {
      if (this.sessionSignalsCount >= this.MAX_SESSION_SIGNALS) {
        return {
          allowed: false,
          reason: `הגעת למגבלת ${this.MAX_SESSION_SIGNALS} איתותים לסשן (LeviPro Method)`
        };
      }

      if (this.dailyLoss >= this.MAX_DAILY_LOSS_PERCENT) {
        return {
          allowed: false,
          reason: `הגעת למגבלת הפסד יומי של ${this.MAX_DAILY_LOSS_PERCENT}%`
        };
      }
    }

    return { allowed: true };
  }

  private findConflictingSignal(symbol: string, action: 'buy' | 'sell'): TradingSignal | null {
    const activeSymbolSignals = Array.from(this.activeSignals.values())
      .filter(signal => signal.symbol === symbol && signal.status === 'active');

    // Check for direct conflicts (buy vs sell on same symbol within time window)
    const recentConflict = activeSymbolSignals.find(signal => {
      const timeDiff = Date.now() - signal.timestamp;
      const isRecentSignal = timeDiff < this.CONFLICT_PREVENTION_WINDOW;
      const isOppositeAction = signal.action !== action;
      
      return isRecentSignal && isOppositeAction;
    });

    return recentConflict || null;
  }

  public addSignal(signal: TradingSignal): boolean {
    // Validate signal data before processing
    if (!this.validateSignalData(signal)) {
      console.log(`🚫 Signal validation failed: ${signal.symbol}`);
      toast.error(`איתות נכשל - נתונים לא תקינים: ${signal.symbol}`);
      return false;
    }

    const validation = this.canCreateSignal(signal.symbol, signal.action, signal.strategy);
    
    if (!validation.allowed) {
      console.log(`🚫 Signal blocked: ${validation.reason}`);
      toast.warning(`איתות נחסם: ${validation.reason}`);
      return false;
    }

    // Add to active signals
    this.activeSignals.set(signal.id, signal);
    this.dailySignalCount++;
    
    if (signal.strategy === 'almog-personal-method') {
      this.sessionSignalsCount++;
    }

    // Add signal context and timeframe
    signal.metadata = {
      ...signal.metadata,
      dailySignalNumber: this.dailySignalCount,
      sessionSignalNumber: this.sessionSignalsCount,
      signalType: this.determineSignalType(signal),
      timeframe: this.determineTimeframe(signal),
      signalCategory: this.determineSignalCategory(signal)
    };

    console.log(`✅ Signal added: ${signal.symbol} ${signal.action} (${signal.strategy})`);
    console.log(`📊 Daily: ${this.dailySignalCount}, Session: ${this.sessionSignalsCount}`);
    
    return true;
  }

  private validateSignalData(signal: TradingSignal): boolean {
    // Check for NaN values
    if (isNaN(signal.price) || signal.price <= 0) {
      console.error(`Invalid price: ${signal.price} for ${signal.symbol}`);
      return false;
    }

    if (isNaN(signal.targetPrice) || signal.targetPrice <= 0) {
      console.error(`Invalid target price: ${signal.targetPrice} for ${signal.symbol}`);
      return false;
    }

    if (isNaN(signal.stopLoss) || signal.stopLoss <= 0) {
      console.error(`Invalid stop loss: ${signal.stopLoss} for ${signal.symbol}`);
      return false;
    }

    if (isNaN(signal.confidence) || signal.confidence < 0 || signal.confidence > 1) {
      console.error(`Invalid confidence: ${signal.confidence} for ${signal.symbol}`);
      return false;
    }

    if (isNaN(signal.riskRewardRatio) || signal.riskRewardRatio <= 0) {
      console.error(`Invalid R/R ratio: ${signal.riskRewardRatio} for ${signal.symbol}`);
      return false;
    }

    // Validate that prices make sense for buy/sell actions
    if (signal.action === 'buy') {
      if (signal.targetPrice <= signal.price || signal.stopLoss >= signal.price) {
        console.error(`Invalid buy signal prices for ${signal.symbol}: Entry: ${signal.price}, TP: ${signal.targetPrice}, SL: ${signal.stopLoss}`);
        return false;
      }
    } else if (signal.action === 'sell') {
      if (signal.targetPrice >= signal.price || signal.stopLoss <= signal.price) {
        console.error(`Invalid sell signal prices for ${signal.symbol}: Entry: ${signal.price}, TP: ${signal.targetPrice}, SL: ${signal.stopLoss}`);
        return false;
      }
    }

    return true;
  }

  private determineTimeframe(signal: TradingSignal): string {
    const metadata = signal.metadata || {};
    
    if (metadata.timeframe) {
      return metadata.timeframe;
    }

    // Determine based on strategy
    if (signal.strategy === 'almog-personal-method') {
      return '15M'; // Personal method uses 15M primarily
    }

    if (signal.strategy.includes('scalp')) {
      return '5M';
    }

    if (signal.strategy.includes('swing')) {
      return '4H';
    }

    return '1H'; // Default
  }

  private determineSignalCategory(signal: TradingSignal): string {
    const metadata = signal.metadata || {};
    
    if (signal.strategy === 'almog-personal-method') {
      return '🧠 שיטה אישית';
    }

    if (metadata.triangleBreakout) {
      return '📈 פריצת משולש';
    }
    
    if (metadata.reversalPattern) {
      return '🔄 היפוך טרנד';
    }
    
    if (metadata.highVolatility || signal.confidence < 0.7) {
      return '⚠️ סקאלפ סיכון גבוה';
    }

    if (signal.action === 'buy') {
      return '📈 המשך עלייה';
    } else {
      return '📉 המשך ירידה';
    }
  }

  private determineSignalType(signal: TradingSignal): string {
    if (signal.strategy === 'almog-personal-method') {
      return '🧠 Personal method recommendation';
    }

    // Check metadata for pattern types
    const metadata = signal.metadata || {};
    
    if (metadata.triangleBreakout) {
      return '✅ Trend continuation';
    }
    
    if (metadata.reversalPattern) {
      return '🔄 Reversal attempt';
    }
    
    if (metadata.highVolatility || signal.confidence < 0.7) {
      return '⚠️ High-risk scalp';
    }

    return '✅ Trend continuation';
  }

  public updateSignalResult(signalId: string, result: 'win' | 'loss', profitPercent: number) {
    const signal = this.activeSignals.get(signalId);
    if (!signal) return;

    signal.status = 'completed';
    signal.profitPercent = profitPercent;

    if (result === 'loss' && signal.strategy === 'almog-personal-method') {
      this.dailyLoss += Math.abs(profitPercent);
    }

    console.log(`📊 Signal result: ${signal.symbol} ${result} (${profitPercent.toFixed(2)}%)`);
  }

  public getActiveSignals(): TradingSignal[] {
    return Array.from(this.activeSignals.values()).filter(s => s.status === 'active');
  }

  public getDailyStats() {
    return {
      dailySignalCount: this.dailySignalCount,
      dailyLoss: this.dailyLoss,
      sessionSignalsCount: this.sessionSignalsCount,
      canTrade: this.dailyLoss < this.MAX_DAILY_LOSS_PERCENT,
      sessionSlotsRemaining: Math.max(0, this.MAX_SESSION_SIGNALS - this.sessionSignalsCount)
    };
  }
}

export const signalManager = new SignalManager();
