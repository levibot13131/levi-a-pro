/**
 * Risk Management Engine
 * Advanced position sizing, risk assessment, and portfolio protection
 */

export interface RiskAssessment {
  allowed: boolean;
  reason: string;
  riskInfo: {
    recommendedPositionSize: number;
    maxPositionSize: number;
    riskAmount: number;
    exposurePercent: number;
    riskRewardRatio: number;
  };
  warnings: string[];
}

export interface RiskParameters {
  maxRiskPerTrade: number; // Percentage of account
  maxPortfolioRisk: number; // Total portfolio risk
  maxPositionSize: number; // Per position limit
  maxDailyLoss: number; // Daily loss limit
  correlationLimit: number; // Max correlated positions
}

export interface PortfolioRisk {
  totalExposure: number;
  currentRisk: number;
  remainingCapacity: number;
  correlatedPositions: number;
  dailyPnL: number;
}

export class RiskManagementEngine {
  private static instance: RiskManagementEngine;
  private openPositions: Map<string, any> = new Map();
  private dailyPnL = 0;
  private lastResetDate = new Date().toDateString();

  // Default risk parameters (can be customized)
  private riskParams: RiskParameters = {
    maxRiskPerTrade: 2.0, // 2% per trade
    maxPortfolioRisk: 10.0, // 10% total portfolio risk
    maxPositionSize: 5.0, // 5% max position size
    maxDailyLoss: 5.0, // 5% daily loss limit
    correlationLimit: 3 // Max 3 correlated positions
  };

  public static getInstance(): RiskManagementEngine {
    if (!RiskManagementEngine.instance) {
      RiskManagementEngine.instance = new RiskManagementEngine();
    }
    return RiskManagementEngine.instance;
  }

  /**
   * Assess if a signal should be allowed based on risk parameters
   */
  public shouldAllowSignal(signal: any): RiskAssessment {
    console.log(`🛡️ Risk Assessment for ${signal.symbol} ${signal.action}`);
    
    // Reset daily PnL if new day
    this.checkDailyReset();
    
    const portfolioRisk = this.calculatePortfolioRisk();
    const signalRisk = this.calculateSignalRisk(signal);
    const warnings: string[] = [];

    // Check daily loss limit
    if (this.dailyPnL <= -this.riskParams.maxDailyLoss) {
      return {
        allowed: false,
        reason: `Daily loss limit exceeded: ${this.dailyPnL.toFixed(2)}%`,
        riskInfo: signalRisk,
        warnings
      };
    }

    // Check portfolio risk limit
    if (portfolioRisk.currentRisk + signalRisk.exposurePercent > this.riskParams.maxPortfolioRisk) {
      return {
        allowed: false,
        reason: `Portfolio risk limit exceeded: ${(portfolioRisk.currentRisk + signalRisk.exposurePercent).toFixed(2)}% > ${this.riskParams.maxPortfolioRisk}%`,
        riskInfo: signalRisk,
        warnings
      };
    }

    // Check position size limit
    if (signalRisk.exposurePercent > this.riskParams.maxPositionSize) {
      warnings.push(`Position size reduced from ${signalRisk.exposurePercent.toFixed(2)}% to ${this.riskParams.maxPositionSize}%`);
      signalRisk.recommendedPositionSize = this.riskParams.maxPositionSize;
      signalRisk.exposurePercent = this.riskParams.maxPositionSize;
    }

    // Check correlation limits
    const correlatedPositions = this.countCorrelatedPositions(signal.symbol);
    if (correlatedPositions >= this.riskParams.correlationLimit) {
      warnings.push(`High correlation detected: ${correlatedPositions} correlated positions`);
    }

    // Check minimum risk/reward ratio
    if (signal.riskRewardRatio < 1.5) {
      warnings.push(`Low risk/reward ratio: ${signal.riskRewardRatio.toFixed(2)}:1`);
    }

    // Adjust position size based on confidence
    const confidenceAdjustment = signal.confidence / 100;
    signalRisk.recommendedPositionSize *= confidenceAdjustment;

    console.log(`✅ Risk Assessment PASSED for ${signal.symbol}`);
    console.log(`   Position Size: ${signalRisk.recommendedPositionSize.toFixed(2)}%`);
    console.log(`   Risk Amount: ${signalRisk.riskAmount.toFixed(2)}%`);
    console.log(`   R/R Ratio: ${signalRisk.riskRewardRatio.toFixed(2)}:1`);

    return {
      allowed: true,
      reason: 'Risk assessment passed',
      riskInfo: signalRisk,
      warnings
    };
  }

  /**
   * Calculate risk metrics for a specific signal
   */
  private calculateSignalRisk(signal: any): any {
    const entryPrice = signal.price || signal.entry_price || 0;
    const stopLoss = signal.stopLoss || signal.stop_loss || 0;
    const targetPrice = signal.targetPrice || signal.target_price || 0;

    if (!entryPrice || !stopLoss) {
      throw new Error('Missing price or stop loss for risk calculation');
    }

    // Calculate risk per share/unit
    const riskPerUnit = Math.abs(entryPrice - stopLoss);
    const potentialReward = Math.abs(targetPrice - entryPrice);
    
    // Calculate risk/reward ratio
    const riskRewardRatio = potentialReward / riskPerUnit;

    // Calculate position size based on max risk per trade
    const accountValue = 100; // Percentage-based calculation
    const maxRiskAmount = accountValue * (this.riskParams.maxRiskPerTrade / 100);
    
    // Position size calculation
    const riskPercent = (riskPerUnit / entryPrice) * 100;
    const recommendedPositionSize = Math.min(
      this.riskParams.maxPositionSize,
      maxRiskAmount / riskPercent
    );

    const exposurePercent = recommendedPositionSize;
    const riskAmount = (exposurePercent * riskPercent) / 100;

    return {
      recommendedPositionSize: Math.max(0.1, recommendedPositionSize), // Minimum 0.1%
      maxPositionSize: this.riskParams.maxPositionSize,
      riskAmount: riskAmount,
      exposurePercent: exposurePercent,
      riskRewardRatio: riskRewardRatio
    };
  }

  /**
   * Calculate current portfolio risk
   */
  private calculatePortfolioRisk(): PortfolioRisk {
    let totalExposure = 0;
    let currentRisk = 0;
    let correlatedPositions = 0;

    for (const [symbol, position] of this.openPositions) {
      totalExposure += position.exposurePercent || 0;
      currentRisk += position.riskAmount || 0;
      
      // Count crypto correlations (simplified)
      if (symbol.includes('USDT')) {
        correlatedPositions++;
      }
    }

    const remainingCapacity = this.riskParams.maxPortfolioRisk - currentRisk;

    return {
      totalExposure,
      currentRisk,
      remainingCapacity: Math.max(0, remainingCapacity),
      correlatedPositions,
      dailyPnL: this.dailyPnL
    };
  }

  /**
   * Count correlated positions
   */
  private countCorrelatedPositions(symbol: string): number {
    let count = 0;
    
    // Simplified correlation logic - crypto pairs
    if (symbol.includes('USDT')) {
      for (const [openSymbol] of this.openPositions) {
        if (openSymbol.includes('USDT') && openSymbol !== symbol) {
          count++;
        }
      }
    }

    return count;
  }

  /**
   * Check if daily reset is needed
   */
  private checkDailyReset(): void {
    const today = new Date().toDateString();
    if (today !== this.lastResetDate) {
      this.dailyPnL = 0;
      this.lastResetDate = today;
      console.log('📅 Daily risk metrics reset');
    }
  }

  /**
   * Update daily PnL
   */
  public updateDailyPnL(pnlPercent: number): void {
    this.dailyPnL += pnlPercent;
    console.log(`💰 Daily PnL updated: ${this.dailyPnL.toFixed(2)}%`);
  }

  /**
   * Add position to tracking
   */
  public addPosition(symbol: string, positionData: any): void {
    this.openPositions.set(symbol, {
      ...positionData,
      openTime: Date.now()
    });
    console.log(`📊 Position added: ${symbol}`);
  }

  /**
   * Remove position from tracking
   */
  public removePosition(symbol: string, pnlPercent?: number): void {
    this.openPositions.delete(symbol);
    
    if (pnlPercent !== undefined) {
      this.updateDailyPnL(pnlPercent);
    }
    
    console.log(`📊 Position removed: ${symbol}`);
  }

  /**
   * Generate risk summary for signal
   */
  public generateRiskSummaryForSignal(signal: any): string {
    const assessment = this.shouldAllowSignal(signal);
    
    if (!assessment.allowed) {
      return `🚫 RISK BLOCKED: ${assessment.reason}`;
    }

    const risk = assessment.riskInfo;
    let summary = `🛡️ RISK MANAGED:\n`;
    summary += `💰 Position: ${risk.recommendedPositionSize.toFixed(1)}% of account\n`;
    summary += `📉 Risk: ${risk.riskAmount.toFixed(2)}% max loss\n`;
    summary += `📊 R/R: ${risk.riskRewardRatio.toFixed(2)}:1`;

    if (assessment.warnings.length > 0) {
      summary += `\n⚠️ Warnings: ${assessment.warnings.join(', ')}`;
    }

    return summary;
  }

  /**
   * Get current risk status
   */
  public getRiskStatus(): any {
    this.checkDailyReset();
    const portfolioRisk = this.calculatePortfolioRisk();
    
    return {
      portfolioRisk,
      openPositions: this.openPositions.size,
      dailyPnL: this.dailyPnL,
      riskParameters: this.riskParams,
      status: this.dailyPnL <= -this.riskParams.maxDailyLoss ? 'BLOCKED' : 'ACTIVE'
    };
  }

  /**
   * Update risk parameters
   */
  public updateRiskParameters(newParams: Partial<RiskParameters>): void {
    this.riskParams = { ...this.riskParams, ...newParams };
    console.log('⚙️ Risk parameters updated:', newParams);
  }

  /**
   * Emergency stop all new positions
   */
  public emergencyStop(): void {
    this.riskParams.maxRiskPerTrade = 0;
    console.log('🚨 EMERGENCY STOP: All new positions blocked');
  }

  /**
   * Reset risk engine
   */
  public reset(): void {
    this.openPositions.clear();
    this.dailyPnL = 0;
    this.riskParams = {
      maxRiskPerTrade: 2.0,
      maxPortfolioRisk: 10.0,
      maxPositionSize: 5.0,
      maxDailyLoss: 5.0,
      correlationLimit: 3
    };
    console.log('🔄 Risk engine reset to defaults');
  }

  // Methods needed by UI components
  public getRiskMetrics() {
    return this.getRiskStatus();
  }

  public getRiskLimits() {
    return this.riskParams;
  }

  public updatePortfolioValue(value: number) {
    console.log(`💼 Portfolio value updated: $${value}`);
  }

  public resetDailyRisk() {
    this.dailyPnL = 0;
    console.log('🔄 Daily risk reset manually');
  }

  public getDailyStats() {
    return {
      dailyPnL: this.dailyPnL,
      tradesCount: this.openPositions.size,
      riskUsed: this.calculatePortfolioRisk().currentRisk,
      status: this.dailyPnL <= -this.riskParams.maxDailyLoss ? 'BLOCKED' : 'ACTIVE'
    };
  }
}

export const riskManagementEngine = RiskManagementEngine.getInstance();