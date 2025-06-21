
import { TradingSignal } from '@/types/trading';

export interface EliteSignalCriteria {
  minConfidence: number;
  minRiskReward: number;
  maxDailySignals: number;
  maxSessionSignals: number;
  conflictWindowMinutes: number;
  profitMultiplier: number;
  requiredTimeframes: string[];
  tradeType: 'swing' | 'scalp' | 'position' | 'any';
  minDurationHours: number;
  maxDurationHours: number;
}

export const ELITE_CRITERIA: EliteSignalCriteria = {
  minConfidence: 0.80, // >= 80%
  minRiskReward: 2.0,  // >= 2:1 R/R ratio
  maxDailySignals: 3,  // Max 2-3 signals per day
  maxSessionSignals: 2, // Max 2 per session
  conflictWindowMinutes: 30, // 30 minutes between signals
  profitMultiplier: 4.0,
  requiredTimeframes: ['4H', '1D', 'Weekly'], // Multi-timeframe confirmation
  tradeType: 'swing', // Swing trades only
  minDurationHours: 24, // Min 1 day
  maxDurationHours: 336 // Max 2 weeks (14 days)
};

export interface SignalScore {
  total: number;
  breakdown: {
    confidence: number;
    riskReward: number;
    timeframeConfluence: number;
    technicalStrength: number;
    momentum: number;
  };
}

export class EliteSignalFilter {
  private recentSignals: Map<string, TradingSignal[]> = new Map();
  private sessionSignalCount = 0;
  private dailySignalCount = 0;
  private lastResetDate = new Date().toDateString();
  private sessionStartTime = Date.now();
  private pendingSignals: Array<{ signal: TradingSignal; score: SignalScore }> = [];

  constructor() {
    this.resetCountersIfNeeded();
  }

  private resetCountersIfNeeded() {
    const today = new Date().toDateString();
    if (this.lastResetDate !== today) {
      this.dailySignalCount = 0;
      this.lastResetDate = today;
      this.pendingSignals = []; // Clear pending signals on new day
      console.log('🔄 Daily elite signal counters and pending signals reset');
    }

    // Reset session every 8 hours
    if (Date.now() - this.sessionStartTime > 8 * 60 * 60 * 1000) {
      this.sessionSignalCount = 0;
      this.sessionStartTime = Date.now();
      console.log('🔄 Session elite signal counters reset');
    }
  }

  public validateEliteSignal(signal: TradingSignal): { valid: boolean; reason?: string; score?: SignalScore } {
    this.resetCountersIfNeeded();

    // 1. Basic confidence check
    if (signal.confidence < ELITE_CRITERIA.minConfidence) {
      return {
        valid: false,
        reason: `Confidence too low: ${(signal.confidence * 100).toFixed(1)}% (required ${ELITE_CRITERIA.minConfidence * 100}%+)`
      };
    }

    // 2. Risk/Reward ratio check
    if (signal.riskRewardRatio < ELITE_CRITERIA.minRiskReward) {
      return {
        valid: false,
        reason: `R/R ratio too low: 1:${signal.riskRewardRatio.toFixed(2)} (required 1:${ELITE_CRITERIA.minRiskReward}+)`
      };
    }

    // 3. Multi-timeframe confirmation check
    const timeframeValidation = this.validateTimeframeConfluence(signal);
    if (!timeframeValidation.valid) {
      return timeframeValidation;
    }

    // 4. Swing trade duration check
    const durationValidation = this.validateTradeDuration(signal);
    if (!durationValidation.valid) {
      return durationValidation;
    }

    // 5. Daily and session limits check
    if (this.dailySignalCount >= ELITE_CRITERIA.maxDailySignals) {
      return {
        valid: false,
        reason: `Daily signal limit reached: ${ELITE_CRITERIA.maxDailySignals}`
      };
    }

    if (this.sessionSignalCount >= ELITE_CRITERIA.maxSessionSignals) {
      return {
        valid: false,
        reason: `Session signal limit reached: ${ELITE_CRITERIA.maxSessionSignals}`
      };
    }

    // 6. Conflict check
    const conflictCheck = this.checkForConflicts(signal);
    if (!conflictCheck.valid) {
      return conflictCheck;
    }

    // 7. Calculate signal score for ranking
    const score = this.calculateSignalScore(signal);

    // 8. Personal method gets priority
    if (signal.strategy === 'almog-personal-method') {
      const personalValidation = this.validatePersonalMethod(signal);
      if (!personalValidation.valid) {
        return personalValidation;
      }
      // Personal method gets bonus score
      score.total += 15;
    }

    return { valid: true, score };
  }

  private validateTimeframeConfluence(signal: TradingSignal): { valid: boolean; reason?: string } {
    const metadata = signal.metadata || {};
    const confirmedTimeframes = metadata.confirmedTimeframes || [];

    // Check if signal has required timeframe confirmations
    const hasRequiredTimeframes = ELITE_CRITERIA.requiredTimeframes.every(tf => 
      confirmedTimeframes.includes(tf)
    );

    if (!hasRequiredTimeframes) {
      const missing = ELITE_CRITERIA.requiredTimeframes.filter(tf => 
        !confirmedTimeframes.includes(tf)
      );
      return {
        valid: false,
        reason: `Missing timeframe confirmation: ${missing.join(', ')} (required: ${ELITE_CRITERIA.requiredTimeframes.join(', ')})`
      };
    }

    return { valid: true };
  }

  private validateTradeDuration(signal: TradingSignal): { valid: boolean; reason?: string } {
    const metadata = signal.metadata || {};
    const expectedDurationHours = metadata.expectedDurationHours || 0;

    if (expectedDurationHours < ELITE_CRITERIA.minDurationHours) {
      return {
        valid: false,
        reason: `Trade duration too short: ${expectedDurationHours}h (min ${ELITE_CRITERIA.minDurationHours}h for swing trades)`
      };
    }

    if (expectedDurationHours > ELITE_CRITERIA.maxDurationHours) {
      return {
        valid: false,
        reason: `Trade duration too long: ${expectedDurationHours}h (max ${ELITE_CRITERIA.maxDurationHours}h)`
      };
    }

    return { valid: true };
  }

  private calculateSignalScore(signal: TradingSignal): SignalScore {
    const metadata = signal.metadata || {};
    
    // Confidence score (0-25 points)
    const confidenceScore = Math.min(25, (signal.confidence - 0.7) * 50);
    
    // Risk/Reward score (0-25 points) 
    const rrScore = Math.min(25, (signal.riskRewardRatio - 1.5) * 10);
    
    // Timeframe confluence score (0-20 points)
    const confirmedTimeframes = metadata.confirmedTimeframes || [];
    const timeframeScore = Math.min(20, confirmedTimeframes.length * 5);
    
    // Technical strength score (0-20 points)
    const technicalScore = Math.min(20, (metadata.technicalStrength || 0.5) * 40);
    
    // Momentum score (0-10 points)
    const momentumScore = Math.min(10, (metadata.momentum || 50) / 10);
    
    const total = confidenceScore + rrScore + timeframeScore + technicalScore + momentumScore;
    
    return {
      total,
      breakdown: {
        confidence: confidenceScore,
        riskReward: rrScore,
        timeframeConfluence: timeframeScore,
        technicalStrength: technicalScore,
        momentum: momentumScore
      }
    };
  }

  private validatePersonalMethod(signal: TradingSignal): { valid: boolean; reason?: string } {
    const metadata = signal.metadata || {};
    
    // Personal method requirements
    const hasEmotionalPressure = metadata.emotionalPressure && metadata.emotionalPressure > 50;
    const hasMomentum = metadata.momentum && metadata.momentum > 60;
    const hasBreakout = metadata.breakout === true;
    const hasVolumeConfirmation = metadata.volumeConfirmation === true;

    if (!hasEmotionalPressure || !hasMomentum || !hasBreakout) {
      return {
        valid: false,
        reason: `Personal Method incomplete: emotional pressure (${metadata.emotionalPressure}%), momentum (${metadata.momentum}%), breakout (${hasBreakout})`
      };
    }

    // Higher confidence requirement for personal method
    if (signal.confidence < 0.85) {
      return {
        valid: false,
        reason: `Personal Method requires ≥85% confidence (current: ${(signal.confidence * 100).toFixed(1)}%)`
      };
    }

    return { valid: true };
  }

  private checkForConflicts(signal: TradingSignal): { valid: boolean; reason?: string } {
    const symbolSignals = this.recentSignals.get(signal.symbol) || [];
    const conflictWindow = ELITE_CRITERIA.conflictWindowMinutes * 60 * 1000;
    const now = Date.now();

    // Clean old signals
    const recentSignals = symbolSignals.filter(s => now - s.timestamp < conflictWindow);
    this.recentSignals.set(signal.symbol, recentSignals);

    // Check for conflicting signals
    const conflictingSignal = recentSignals.find(s => s.action !== signal.action);
    if (conflictingSignal) {
      return {
        valid: false,
        reason: `Conflict: ${conflictingSignal.action} signal for ${signal.symbol} sent ${Math.floor((now - conflictingSignal.timestamp) / (60 * 1000))}min ago`
      };
    }

    return { valid: true };
  }

  public addToPendingQueue(signal: TradingSignal, score: SignalScore): void {
    // Add to pending queue for ranking
    this.pendingSignals.push({ signal, score });
    
    // Sort by score (descending) and personal method priority
    this.pendingSignals.sort((a, b) => {
      // Personal method always gets priority
      if (a.signal.strategy === 'almog-personal-method' && b.signal.strategy !== 'almog-personal-method') return -1;
      if (b.signal.strategy === 'almog-personal-method' && a.signal.strategy !== 'almog-personal-method') return 1;
      
      // Then by score
      return b.score.total - a.score.total;
    });
    
    console.log(`📊 Signal added to pending queue. Queue size: ${this.pendingSignals.length}`);
  }

  public processPendingSignals(): TradingSignal[] {
    const availableSlots = Math.min(
      ELITE_CRITERIA.maxDailySignals - this.dailySignalCount,
      ELITE_CRITERIA.maxSessionSignals - this.sessionSignalCount
    );

    if (availableSlots <= 0) {
      console.log('🚫 No available slots for new signals');
      return [];
    }

    // Take top signals up to available slots
    const selectedSignals = this.pendingSignals
      .slice(0, availableSlots)
      .map(item => item.signal);

    // Clear processed signals from queue
    this.pendingSignals = [];

    return selectedSignals;
  }

  public approveEliteSignal(signal: TradingSignal): void {
    // Update counters
    this.dailySignalCount++;
    this.sessionSignalCount++;

    // Store for conflict detection
    const symbolSignals = this.recentSignals.get(signal.symbol) || [];
    symbolSignals.push(signal);
    this.recentSignals.set(signal.symbol, symbolSignals);

    console.log(`🔥 ELITE SIGNAL APPROVED: ${signal.symbol} ${signal.action}`);
    console.log(`📊 Daily: ${this.dailySignalCount}/${ELITE_CRITERIA.maxDailySignals}, Session: ${this.sessionSignalCount}/${ELITE_CRITERIA.maxSessionSignals}`);
  }

  public getEliteStats() {
    return {
      dailySignalCount: this.dailySignalCount,
      sessionSignalCount: this.sessionSignalCount,
      maxDailySignals: ELITE_CRITERIA.maxDailySignals,
      maxSessionSignals: ELITE_CRITERIA.maxSessionSignals,
      remainingDailySlots: ELITE_CRITERIA.maxDailySignals - this.dailySignalCount,
      remainingSessionSlots: ELITE_CRITERIA.maxSessionSignals - this.sessionSignalCount,
      pendingSignalsCount: this.pendingSignals.length
    };
  }
}

export const eliteSignalFilter = new EliteSignalFilter();
