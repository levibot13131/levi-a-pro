
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

    // Check for direct conflicts (buy vs sell on same symbol within 5 minutes)
    const recentConflict = activeSymbolSignals.find(signal => {
      const timeDiff = Date.now() - signal.timestamp;
      const isRecentSignal = timeDiff < 5 * 60 * 1000; // 5 minutes
      const isOppositeAction = signal.action !== action;
      
      return isRecentSignal && isOppositeAction;
    });

    return recentConflict || null;
  }

  public addSignal(signal: TradingSignal): boolean {
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

    // Add signal context
    signal.metadata = {
      ...signal.metadata,
      dailySignalNumber: this.dailySignalCount,
      sessionSignalNumber: this.sessionSignalsCount,
      signalType: this.determineSignalType(signal)
    };

    console.log(`✅ Signal added: ${signal.symbol} ${signal.action} (${signal.strategy})`);
    console.log(`📊 Daily: ${this.dailySignalCount}, Session: ${this.sessionSignalsCount}`);
    
    return true;
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
