/**
 * Signal Cooldown Manager - Prevents signal bursts and ensures proper spacing
 */

export interface CooldownState {
  lastSignalTime: number;
  globalCooldownUntil: number;
  symbolCooldowns: Map<string, number>;
  startupCooldownUntil: number;
}

export class SignalCooldownManager {
  private state: CooldownState = {
    lastSignalTime: 0,
    globalCooldownUntil: 0,
    symbolCooldowns: new Map(),
    startupCooldownUntil: 0
  };

  // Configuration
  private readonly STARTUP_COOLDOWN_MS = 5 * 60 * 1000; // 5 minutes startup delay
  private readonly GLOBAL_COOLDOWN_MS = 3 * 60 * 1000; // 3 minutes between any signals
  private readonly SYMBOL_COOLDOWN_MS = 30 * 60 * 1000; // 30 minutes per symbol
  private readonly MIN_SIGNAL_SPACING_MS = 2 * 60 * 1000; // 2 minutes minimum between signals

  constructor() {
    console.log('🕒 Signal Cooldown Manager initialized');
    this.initializeStartupCooldown();
  }

  private initializeStartupCooldown() {
    this.state.startupCooldownUntil = Date.now() + this.STARTUP_COOLDOWN_MS;
    const startupEnd = new Date(this.state.startupCooldownUntil).toLocaleTimeString('he-IL');
    console.log(`⏳ STARTUP COOLDOWN: No signals until ${startupEnd} (${this.STARTUP_COOLDOWN_MS / 60000} minutes)`);
  }

  public canSendSignal(symbol: string): { allowed: boolean; reason?: string; nextAllowedTime?: number } {
    const now = Date.now();

    // Check startup cooldown
    if (now < this.state.startupCooldownUntil) {
      const remainingMs = this.state.startupCooldownUntil - now;
      const remainingMinutes = Math.ceil(remainingMs / 60000);
      return {
        allowed: false,
        reason: `STARTUP_COOLDOWN: System stabilizing for ${remainingMinutes} more minutes`,
        nextAllowedTime: this.state.startupCooldownUntil
      };
    }

    // Check global cooldown
    if (now < this.state.globalCooldownUntil) {
      const remainingMs = this.state.globalCooldownUntil - now;
      const remainingMinutes = Math.ceil(remainingMs / 60000);
      return {
        allowed: false,
        reason: `GLOBAL_COOLDOWN: ${remainingMinutes} minutes until next signal allowed`,
        nextAllowedTime: this.state.globalCooldownUntil
      };
    }

    // Check symbol-specific cooldown
    const symbolCooldownUntil = this.state.symbolCooldowns.get(symbol) || 0;
    if (now < symbolCooldownUntil) {
      const remainingMs = symbolCooldownUntil - now;
      const remainingMinutes = Math.ceil(remainingMs / 60000);
      return {
        allowed: false,
        reason: `SYMBOL_COOLDOWN: ${symbol} on cooldown for ${remainingMinutes} more minutes`,
        nextAllowedTime: symbolCooldownUntil
      };
    }

    // Check minimum spacing since last signal
    if (this.state.lastSignalTime > 0) {
      const timeSinceLastSignal = now - this.state.lastSignalTime;
      if (timeSinceLastSignal < this.MIN_SIGNAL_SPACING_MS) {
        const remainingMs = this.MIN_SIGNAL_SPACING_MS - timeSinceLastSignal;
        const remainingMinutes = Math.ceil(remainingMs / 60000);
        return {
          allowed: false,
          reason: `MIN_SPACING: ${remainingMinutes} minutes since last signal (minimum ${this.MIN_SIGNAL_SPACING_MS / 60000} minutes)`,
          nextAllowedTime: this.state.lastSignalTime + this.MIN_SIGNAL_SPACING_MS
        };
      }
    }

    return { allowed: true };
  }

  public recordSignalSent(symbol: string) {
    const now = Date.now();
    
    // Update timing records
    this.state.lastSignalTime = now;
    this.state.globalCooldownUntil = now + this.GLOBAL_COOLDOWN_MS;
    this.state.symbolCooldowns.set(symbol, now + this.SYMBOL_COOLDOWN_MS);

    // Log cooldown status
    const globalNext = new Date(this.state.globalCooldownUntil).toLocaleTimeString('he-IL');
    const symbolNext = new Date(now + this.SYMBOL_COOLDOWN_MS).toLocaleTimeString('he-IL');
    
    console.log(`🕒 COOLDOWNS ACTIVATED: ${symbol} signal sent`);
    console.log(`   📢 Global cooldown until: ${globalNext}`);
    console.log(`   🎯 ${symbol} cooldown until: ${symbolNext}`);
  }

  public getStatus(): {
    startupComplete: boolean;
    globalCooldownRemaining: number;
    symbolCooldowns: { symbol: string; remainingMs: number }[];
    nextSignalAllowed: number;
  } {
    const now = Date.now();
    
    const symbolCooldownsList = Array.from(this.state.symbolCooldowns.entries())
      .filter(([_, cooldownUntil]) => cooldownUntil > now)
      .map(([symbol, cooldownUntil]) => ({
        symbol,
        remainingMs: cooldownUntil - now
      }));

    const nextTimes = [
      this.state.startupCooldownUntil,
      this.state.globalCooldownUntil,
      this.state.lastSignalTime + this.MIN_SIGNAL_SPACING_MS,
      ...Array.from(this.state.symbolCooldowns.values())
    ].filter(time => time > now);

    const nextSignalAllowed = nextTimes.length > 0 ? Math.min(...nextTimes) : now;

    return {
      startupComplete: now >= this.state.startupCooldownUntil,
      globalCooldownRemaining: Math.max(0, this.state.globalCooldownUntil - now),
      symbolCooldowns: symbolCooldownsList,
      nextSignalAllowed
    };
  }

  public isStartupComplete(): boolean {
    return Date.now() >= this.state.startupCooldownUntil;
  }

  public resetStartupCooldown() {
    this.initializeStartupCooldown();
  }

  public clearAllCooldowns() {
    console.log('🔄 Clearing all cooldowns (ADMIN OVERRIDE)');
    this.state.globalCooldownUntil = 0;
    this.state.symbolCooldowns.clear();
    this.state.lastSignalTime = 0;
    // Keep startup cooldown unless explicitly cleared
  }

  public clearSymbolCooldown(symbol: string) {
    console.log(`🔄 Clearing cooldown for ${symbol} (ADMIN OVERRIDE)`);
    this.state.symbolCooldowns.delete(symbol);
  }
}

export const signalCooldownManager = new SignalCooldownManager();
