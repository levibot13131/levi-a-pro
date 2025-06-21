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
  swingTradesOnly: boolean;
  timeframeConfluenceRequired: number;
}

export const ELITE_CRITERIA: EliteSignalCriteria = {
  minConfidence: 0.80, // >= 80% (strict requirement)
  minRiskReward: 2.0,  // >= 2:1 R/R ratio (strict requirement)
  maxDailySignals: 3,  // Max 2-3 signals per day (strict limit)
  maxSessionSignals: 2, // Max 2 per session
  conflictWindowMinutes: 60, // 1 hour between signals (increased)
  profitMultiplier: 4.0,
  requiredTimeframes: ['4H', '1D', 'Weekly'], // Multi-timeframe confluence (strict)
  tradeType: 'swing', // Swing trades only (strict requirement)
  minDurationHours: 24, // Min 1 day (swing requirement)
  maxDurationHours: 336, // Max 14 days (2 weeks)
  swingTradesOnly: true, // Enforce swing trades only
  timeframeConfluenceRequired: 3 // Must have at least 3 timeframe confirmations
};

export interface SignalScore {
  total: number;
  breakdown: {
    confidence: number;
    riskReward: number;
    timeframeConfluence: number;
    technicalStrength: number;
    momentum: number;
    swingSuitability: number;
  };
}

export class EliteSignalFilter {
  private recentSignals: Map<string, TradingSignal[]> = new Map();
  private sessionSignalCount = 0;
  private dailySignalCount = 0;
  private lastResetDate = new Date().toDateString();
  private sessionStartTime = Date.now();
  private pendingSignals: Array<{ signal: TradingSignal; score: SignalScore }> = [];
  private rejectedSignalsToday = 0;

  constructor() {
    this.resetCountersIfNeeded();
  }

  private resetCountersIfNeeded() {
    const today = new Date().toDateString();
    if (this.lastResetDate !== today) {
      this.dailySignalCount = 0;
      this.rejectedSignalsToday = 0;
      this.lastResetDate = today;
      this.pendingSignals = [];
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

    // 1. STRICT: Swing trades only
    if (ELITE_CRITERIA.swingTradesOnly && !this.isSwingTrade(signal)) {
      this.rejectedSignalsToday++;
      return {
        valid: false,
        reason: `❌ Swing trades only - rejected scalp/intraday signal`
      };
    }

    // 2. STRICT: Confidence threshold (≥80%)
    if (signal.confidence < ELITE_CRITERIA.minConfidence) {
      this.rejectedSignalsToday++;
      return {
        valid: false,
        reason: `❌ Confidence too low: ${(signal.confidence * 100).toFixed(1)}% (required ≥${ELITE_CRITERIA.minConfidence * 100}%)`
      };
    }

    // 3. STRICT: Risk/Reward ratio (≥2:1)
    if (signal.riskRewardRatio < ELITE_CRITERIA.minRiskReward) {
      this.rejectedSignalsToday++;
      return {
        valid: false,
        reason: `❌ R/R ratio too low: 1:${signal.riskRewardRatio.toFixed(2)} (required ≥1:${ELITE_CRITERIA.minRiskReward})`
      };
    }

    // 4. STRICT: Multi-timeframe confluence (at least 3 timeframes)
    const timeframeValidation = this.validateStrictTimeframeConfluence(signal);
    if (!timeframeValidation.valid) {
      this.rejectedSignalsToday++;
      return timeframeValidation;
    }

    // 5. STRICT: Trade duration for swing trades
    const durationValidation = this.validateSwingDuration(signal);
    if (!durationValidation.valid) {
      this.rejectedSignalsToday++;
      return durationValidation;
    }

    // 6. STRICT: Daily limit enforcement (max 2-3 per day)
    if (this.dailySignalCount >= ELITE_CRITERIA.maxDailySignals) {
      this.rejectedSignalsToday++;
      return {
        valid: false,
        reason: `❌ Daily signal limit reached: ${ELITE_CRITERIA.maxDailySignals}/day (Quality over quantity)`
      };
    }

    // 7. STRICT: Session limits
    if (this.sessionSignalCount >= ELITE_CRITERIA.maxSessionSignals) {
      this.rejectedSignalsToday++;
      return {
        valid: false,
        reason: `❌ Session signal limit reached: ${ELITE_CRITERIA.maxSessionSignals}/session`
      };
    }

    // 8. STRICT: Conflict detection (prevent spam)
    const conflictCheck = this.checkForStrictConflicts(signal);
    if (!conflictCheck.valid) {
      this.rejectedSignalsToday++;
      return conflictCheck;
    }

    // 9. Calculate comprehensive signal score
    const score = this.calculateEliteSignalScore(signal);

    // 10. Special handling for personal method (always gets priority if it meets criteria)
    if (signal.strategy === 'almog-personal-method') {
      const personalValidation = this.validatePersonalMethodStrict(signal);
      if (!personalValidation.valid) {
        this.rejectedSignalsToday++;
        return personalValidation;
      }
      // Personal method gets significant bonus score
      score.total += 25;
      console.log('🧠 Personal Method signal passed all strict validations - PRIORITY GRANTED');
    }

    console.log(`✅ ELITE SIGNAL VALIDATED: ${signal.symbol} ${signal.action} (Score: ${score.total.toFixed(1)}, Confidence: ${(signal.confidence * 100).toFixed(1)}%, R/R: 1:${signal.riskRewardRatio.toFixed(1)})`);
    
    return { valid: true, score };
  }

  private isSwingTrade(signal: TradingSignal): boolean {
    const metadata = signal.metadata || {};
    const expectedDurationHours = metadata.expectedDurationHours || 0;
    
    // Swing trades: 1 day to 2 weeks (24-336 hours)
    return expectedDurationHours >= ELITE_CRITERIA.minDurationHours && 
           expectedDurationHours <= ELITE_CRITERIA.maxDurationHours;
  }

  private validateStrictTimeframeConfluence(signal: TradingSignal): { valid: boolean; reason?: string } {
    const metadata = signal.metadata || {};
    const confirmedTimeframes = metadata.confirmedTimeframes || [];

    // Must have confirmation from at least 3 timeframes including the required ones
    if (confirmedTimeframes.length < ELITE_CRITERIA.timeframeConfluenceRequired) {
      return {
        valid: false,
        reason: `❌ Insufficient timeframe confluence: ${confirmedTimeframes.length}/3 required (must analyze 4H + 1D + Weekly minimum)`
      };
    }

    // Check for required critical timeframes
    const hasRequired = ELITE_CRITERIA.requiredTimeframes.every(tf => 
      confirmedTimeframes.includes(tf)
    );

    if (!hasRequired) {
      const missing = ELITE_CRITERIA.requiredTimeframes.filter(tf => 
        !confirmedTimeframes.includes(tf)
      );
      return {
        valid: false,
        reason: `❌ Missing critical timeframes: ${missing.join(', ')} (Required: ${ELITE_CRITERIA.requiredTimeframes.join(', ')})`
      };
    }

    return { valid: true };
  }

  private validateSwingDuration(signal: TradingSignal): { valid: boolean; reason?: string } {
    const metadata = signal.metadata || {};
    const expectedDurationHours = metadata.expectedDurationHours || 0;

    if (expectedDurationHours < ELITE_CRITERIA.minDurationHours) {
      return {
        valid: false,
        reason: `❌ Trade too short for swing: ${expectedDurationHours}h (minimum ${ELITE_CRITERIA.minDurationHours}h for quality swings)`
      };
    }

    if (expectedDurationHours > ELITE_CRITERIA.maxDurationHours) {
      return {
        valid: false,
        reason: `❌ Trade too long: ${expectedDurationHours}h (maximum ${ELITE_CRITERIA.maxDurationHours}h)`
      };
    }

    return { valid: true };
  }

  private checkForStrictConflicts(signal: TradingSignal): { valid: boolean; reason?: string } {
    const symbolSignals = this.recentSignals.get(signal.symbol) || [];
    const conflictWindow = ELITE_CRITERIA.conflictWindowMinutes * 60 * 1000;
    const now = Date.now();

    // Clean old signals
    const recentSignals = symbolSignals.filter(s => now - s.timestamp < conflictWindow);
    this.recentSignals.set(signal.symbol, recentSignals);

    // Check for any conflicting signals (stricter than before)
    if (recentSignals.length > 0) {
      const lastSignal = recentSignals[recentSignals.length - 1];
      const minutesAgo = Math.floor((now - lastSignal.timestamp) / (60 * 1000));
      
      return {
        valid: false,
        reason: `❌ Too soon after last signal: ${signal.symbol} had ${lastSignal.action} ${minutesAgo}min ago (wait ${ELITE_CRITERIA.conflictWindowMinutes}min)`
      };
    }

    return { valid: true };
  }

  private calculateEliteSignalScore(signal: TradingSignal): SignalScore {
    const metadata = signal.metadata || {};
    
    // Enhanced scoring for elite signals
    const confidenceScore = Math.min(30, (signal.confidence - 0.75) * 120); // 0-30 points
    const rrScore = Math.min(25, (signal.riskRewardRatio - 1.8) * 25); // 0-25 points
    const timeframeScore = Math.min(20, (metadata.confirmedTimeframes?.length || 0) * 5); // 0-20 points
    const technicalScore = Math.min(15, (metadata.technicalStrength || 0.5) * 30); // 0-15 points
    const momentumScore = Math.min(10, (metadata.momentum || 50) / 10); // 0-10 points
    
    // New: Swing suitability score
    const swingSuitabilityScore = this.calculateSwingSuitability(signal); // 0-15 points
    
    const total = confidenceScore + rrScore + timeframeScore + technicalScore + momentumScore + swingSuitabilityScore;
    
    return {
      total,
      breakdown: {
        confidence: confidenceScore,
        riskReward: rrScore,
        timeframeConfluence: timeframeScore,
        technicalStrength: technicalScore,
        momentum: momentumScore,
        swingSuitability: swingSuitabilityScore
      }
    };
  }

  private calculateSwingSuitability(signal: TradingSignal): number {
    const metadata = signal.metadata || {};
    let score = 0;
    
    // Bonus for swing-friendly patterns
    if (metadata.triangleBreakout) score += 5;
    if (metadata.wyckoffPhase === 'spring' || metadata.wyckoffPhase === 'utad') score += 5;
    if (metadata.expectedDurationHours >= 48) score += 3; // 2+ day trades get bonus
    if (metadata.volumeConfirmation) score += 2;
    
    return Math.min(15, score);
  }

  private validatePersonalMethodStrict(signal: TradingSignal): { valid: boolean; reason?: string } {
    const metadata = signal.metadata || {};
    
    // Even stricter requirements for personal method
    const hasEmotionalPressure = metadata.emotionalPressure && metadata.emotionalPressure > 60; // Increased from 50
    const hasMomentum = metadata.momentum && metadata.momentum > 70; // Increased from 60
    const hasBreakout = metadata.breakout === true;
    const hasVolumeConfirmation = metadata.volumeConfirmation === true;

    if (!hasEmotionalPressure || !hasMomentum || !hasBreakout) {
      return {
        valid: false,
        reason: `❌ Personal Method STRICT validation failed: emotional pressure (${metadata.emotionalPressure}% need >60%), momentum (${metadata.momentum}% need >70%), breakout (${hasBreakout})`
      };
    }

    // Ultra-high confidence requirement for personal method
    if (signal.confidence < 0.85) {
      return {
        valid: false,
        reason: `❌ Personal Method requires ≥85% confidence for ELITE status (current: ${(signal.confidence * 100).toFixed(1)}%)`
      };
    }

    console.log('🧠 Personal Method passed STRICT elite validation - this is a premium signal');
    return { valid: true };
  }

  public addToPendingQueue(signal: TradingSignal, score: SignalScore): void {
    this.pendingSignals.push({ signal, score });
    
    // Enhanced sorting: Personal method always first, then by score
    this.pendingSignals.sort((a, b) => {
      if (a.signal.strategy === 'almog-personal-method' && b.signal.strategy !== 'almog-personal-method') return -1;
      if (b.signal.strategy === 'almog-personal-method' && a.signal.strategy !== 'almog-personal-method') return 1;
      return b.score.total - a.score.total;
    });
    
    console.log(`📊 Signal queued for elite processing. Queue: ${this.pendingSignals.length}, Top score: ${this.pendingSignals[0]?.score.total.toFixed(1) || 'N/A'}`);
  }

  public processPendingSignals(): TradingSignal[] {
    const availableSlots = Math.min(
      ELITE_CRITERIA.maxDailySignals - this.dailySignalCount,
      ELITE_CRITERIA.maxSessionSignals - this.sessionSignalCount
    );

    if (availableSlots <= 0) {
      console.log('🚫 No available slots for new elite signals - quality limit enforced');
      return [];
    }

    // Take only the highest quality signals
    const selectedSignals = this.pendingSignals
      .slice(0, availableSlots)
      .map(item => item.signal);

    // Clear processed signals from queue
    this.pendingSignals = [];

    console.log(`✅ Processing ${selectedSignals.length} elite signals (Available slots: ${availableSlots})`);
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

    const qualityBadge = signal.strategy === 'almog-personal-method' ? '🧠 PERSONAL METHOD' : '🔥 ELITE';
    console.log(`${qualityBadge} SIGNAL APPROVED: ${signal.symbol} ${signal.action} (${(signal.confidence * 100).toFixed(1)}%, 1:${signal.riskRewardRatio.toFixed(1)})`);
    console.log(`📊 Daily: ${this.dailySignalCount}/${ELITE_CRITERIA.maxDailySignals}, Session: ${this.sessionSignalCount}/${ELITE_CRITERIA.maxSessionSignals}, Quality Filter Working`);
  }

  public getEliteStats() {
    return {
      dailySignalCount: this.dailySignalCount,
      sessionSignalCount: this.sessionSignalCount,
      maxDailySignals: ELITE_CRITERIA.maxDailySignals,
      maxSessionSignals: ELITE_CRITERIA.maxSessionSignals,
      remainingDailySlots: Math.max(0, ELITE_CRITERIA.maxDailySignals - this.dailySignalCount),
      remainingSessionSlots: Math.max(0, ELITE_CRITERIA.maxSessionSignals - this.sessionSignalCount),
      pendingSignalsCount: this.pendingSignals.length,
      rejectedSignalsToday: this.rejectedSignalsToday,
      qualityFilterActive: true,
      strictModeEnabled: true
    };
  }
}

export const eliteSignalFilter = new EliteSignalFilter();
