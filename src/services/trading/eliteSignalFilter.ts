
import { TradingSignal } from '@/types/trading';

export interface EliteSignalCriteria {
  minConfidence: number;
  minRiskReward: number;
  maxDailySignals: number;
  maxSessionSignals: number;
  conflictWindowMinutes: number;
  profitMultiplier: number; // מינימום פי כמה על ההון
}

export const ELITE_CRITERIA: EliteSignalCriteria = {
  minConfidence: 0.80, // מעל 80%
  minRiskReward: 1.5,  // יחס R/R מינימום 1.5:1
  maxDailySignals: 10,
  maxSessionSignals: 3,
  conflictWindowMinutes: 5,
  profitMultiplier: 4.0 // פי 4 על ההון מינימום
};

export class EliteSignalFilter {
  private recentSignals: Map<string, TradingSignal[]> = new Map();
  private sessionSignalCount = 0;
  private dailySignalCount = 0;
  private lastResetDate = new Date().toDateString();
  private sessionStartTime = Date.now();

  constructor() {
    this.resetCountersIfNeeded();
  }

  private resetCountersIfNeeded() {
    const today = new Date().toDateString();
    if (this.lastResetDate !== today) {
      this.dailySignalCount = 0;
      this.lastResetDate = today;
      console.log('🔄 Daily elite signal counters reset');
    }

    // Reset session every 8 hours
    if (Date.now() - this.sessionStartTime > 8 * 60 * 60 * 1000) {
      this.sessionSignalCount = 0;
      this.sessionStartTime = Date.now();
      console.log('🔄 Session elite signal counters reset');
    }
  }

  public validateEliteSignal(signal: TradingSignal): { valid: boolean; reason?: string } {
    this.resetCountersIfNeeded();

    // 1. בדיקת confidence מינימלי
    if (signal.confidence < ELITE_CRITERIA.minConfidence) {
      return {
        valid: false,
        reason: `Confidence נמוך: ${(signal.confidence * 100).toFixed(1)}% (נדרש ${ELITE_CRITERIA.minConfidence * 100}%+)`
      };
    }

    // 2. בדיקת יחס R/R
    if (signal.riskRewardRatio < ELITE_CRITERIA.minRiskReward) {
      return {
        valid: false,
        reason: `יחס R/R נמוך: 1:${signal.riskRewardRatio.toFixed(2)} (נדרש 1:${ELITE_CRITERIA.minRiskReward}+)`
      };
    }

    // 3. בדיקת פוטנציאל רווח (פי 4 על ההון)
    const profitPotential = this.calculateProfitMultiplier(signal);
    if (profitPotential < ELITE_CRITERIA.profitMultiplier) {
      return {
        valid: false,
        reason: `פוטנציאל רווח נמוך: פי ${profitPotential.toFixed(1)} (נדרש פי ${ELITE_CRITERIA.profitMultiplier}+)`
      };
    }

    // 4. בדיקת מגבלות יומיות וסשן
    if (this.dailySignalCount >= ELITE_CRITERIA.maxDailySignals) {
      return {
        valid: false,
        reason: `הגעת למגבלת איתותים יומית: ${ELITE_CRITERIA.maxDailySignals}`
      };
    }

    if (this.sessionSignalCount >= ELITE_CRITERIA.maxSessionSignals) {
      return {
        valid: false,
        reason: `הגעת למגבלת איתותים לסשן: ${ELITE_CRITERIA.maxSessionSignals}`
      };
    }

    // 5. בדיקת קונפליקטים
    const conflictCheck = this.checkForConflicts(signal);
    if (!conflictCheck.valid) {
      return conflictCheck;
    }

    // 6. בדיקה מיוחדת לשיטה האישית
    if (signal.strategy === 'almog-personal-method') {
      const personalValidation = this.validatePersonalMethod(signal);
      if (!personalValidation.valid) {
        return personalValidation;
      }
    }

    return { valid: true };
  }

  private calculateProfitMultiplier(signal: TradingSignal): number {
    const riskPercent = Math.abs((signal.stopLoss - signal.price) / signal.price) * 100;
    const rewardPercent = Math.abs((signal.targetPrice - signal.price) / signal.price) * 100;
    
    // בהנחה של 2% סיכון לעסקה, כמה פעמים נוכל להכפיל את ההון
    const riskPerTrade = 2; // 2% מההון לעסקה
    const potentialReturn = (rewardPercent / riskPerTrade);
    
    return potentialReturn;
  }

  private validatePersonalMethod(signal: TradingSignal): { valid: boolean; reason?: string } {
    const metadata = signal.metadata || {};
    
    // בדיקת לחץ רגשי + מומנטום + פריצה
    const hasEmotionalPressure = metadata.emotionalPressure && metadata.emotionalPressure > 50;
    const hasMomentum = metadata.momentum && metadata.momentum > 60;
    const hasBreakout = metadata.breakout === true;

    if (!hasEmotionalPressure || !hasMomentum || !hasBreakout) {
      return {
        valid: false,
        reason: `Personal Method: חסר לחץ רגשי (${metadata.emotionalPressure}%), מומנטום (${metadata.momentum}%), או פריצה (${hasBreakout})`
      };
    }

    // בדיקת תנאים נוספים לשיטה האישית
    if (signal.confidence < 0.75) {
      return {
        valid: false,
        reason: `Personal Method דורש confidence מעל 75% (נוכחי: ${(signal.confidence * 100).toFixed(1)}%)`
      };
    }

    return { valid: true };
  }

  private checkForConflicts(signal: TradingSignal): { valid: boolean; reason?: string } {
    const symbolSignals = this.recentSignals.get(signal.symbol) || [];
    const conflictWindow = ELITE_CRITERIA.conflictWindowMinutes * 60 * 1000; // מילישניות
    const now = Date.now();

    // מחיקת איתותים ישנים
    const recentSignals = symbolSignals.filter(s => now - s.timestamp < conflictWindow);
    this.recentSignals.set(signal.symbol, recentSignals);

    // בדיקת קונפליקטים
    const conflictingSignal = recentSignals.find(s => s.action !== signal.action);
    if (conflictingSignal) {
      return {
        valid: false,
        reason: `קונפליקט: יש כבר איתות ${conflictingSignal.action} על ${signal.symbol} מלפני ${Math.floor((now - conflictingSignal.timestamp) / (60 * 1000))} דקות`
      };
    }

    return { valid: true };
  }

  public approveEliteSignal(signal: TradingSignal): void {
    // עדכון מונים
    this.dailySignalCount++;
    this.sessionSignalCount++;

    // שמירת האיתות לזיכרון לבדיקת קונפליקטים עתידיים
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
      remainingSessionSlots: ELITE_CRITERIA.maxSessionSignals - this.sessionSignalCount
    };
  }
}

export const eliteSignalFilter = new EliteSignalFilter();
