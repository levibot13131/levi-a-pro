
import { TradingSignal, RiskData } from '@/types/trading';

interface RiskLimits {
  maxDailyRisk: number;
  maxPositionSize: number;
  maxConcurrentPositions: number;
  maxDrawdown: number;
  minRiskReward: number;
}

interface RiskMetrics {
  currentDailyRisk: number;
  activePositions: number;
  currentDrawdown: number;
  portfolioValue: number;
}

interface DailyStats {
  dailyLoss: number;
  activePositions: number;
  isWithinLimits: boolean;
  emergencyPause: boolean;
  totalSignalsToday: number;
  rejectedSignalsToday: number;
  exposureLevel: number;
}

export class RiskManagementEngine {
  private static instance: RiskManagementEngine;
  
  private riskLimits: RiskLimits = {
    maxDailyRisk: 5.0, // 5% max daily risk
    maxPositionSize: 2.0, // 2% max per position
    maxConcurrentPositions: 5,
    maxDrawdown: 10.0, // 10% max drawdown
    minRiskReward: 1.5 // Minimum 1.5:1 R/R
  };

  private currentMetrics: RiskMetrics = {
    currentDailyRisk: 0,
    activePositions: 0,
    currentDrawdown: 0,
    portfolioValue: 100000 // Default portfolio value
  };

  private dailySignalCount = 0;
  private dailyRejectedCount = 0;
  private emergencyPauseActive = false;

  public static getInstance(): RiskManagementEngine {
    if (!RiskManagementEngine.instance) {
      RiskManagementEngine.instance = new RiskManagementEngine();
    }
    return RiskManagementEngine.instance;
  }

  public shouldAllowSignal(signal: TradingSignal): { allowed: boolean; reason?: string; riskInfo?: RiskData } {
    // Critical fix: Check minimum R/R ratio of 1.8:1
    const MIN_RR_RATIO = 1.8;
    if (signal.riskRewardRatio < MIN_RR_RATIO) {
      this.dailyRejectedCount++;
      console.log(`🚫 Signal rejected: R/R ${signal.riskRewardRatio.toFixed(2)} below minimum ${MIN_RR_RATIO}`);
      return {
        allowed: false,
        reason: `Risk/Reward ratio ${signal.riskRewardRatio.toFixed(2)} below minimum ${MIN_RR_RATIO} (LeviPro requirement)`
      };
    }

    // Validate SL/TP direction logic
    if (signal.action === 'buy' && signal.stopLoss >= signal.price) {
      this.dailyRejectedCount++;
      return {
        allowed: false,
        reason: `Invalid BUY signal: Stop Loss ($${signal.stopLoss.toFixed(2)}) must be below Entry ($${signal.price.toFixed(2)})`
      };
    }

    if (signal.action === 'sell' && signal.stopLoss <= signal.price) {
      this.dailyRejectedCount++;
      return {
        allowed: false,
        reason: `Invalid SELL signal: Stop Loss ($${signal.stopLoss.toFixed(2)}) must be above Entry ($${signal.price.toFixed(2)})`
      };
    }

    // Validate target direction
    if (signal.action === 'buy' && signal.targetPrice <= signal.price) {
      this.dailyRejectedCount++;
      return {
        allowed: false,
        reason: `Invalid BUY signal: Target ($${signal.targetPrice.toFixed(2)}) must be above Entry ($${signal.price.toFixed(2)})`
      };
    }

    if (signal.action === 'sell' && signal.targetPrice >= signal.price) {
      this.dailyRejectedCount++;
      return {
        allowed: false,
        reason: `Invalid SELL signal: Target ($${signal.targetPrice.toFixed(2)}) must be below Entry ($${signal.price.toFixed(2)})`
      };
    }

    // Check concurrent positions
    if (this.currentMetrics.activePositions >= this.riskLimits.maxConcurrentPositions) {
      this.dailyRejectedCount++;
      return {
        allowed: false,
        reason: `Maximum concurrent positions (${this.riskLimits.maxConcurrentPositions}) reached`
      };
    }

    // Calculate position size
    const riskAmount = Math.abs(signal.price - signal.stopLoss);
    const riskPercent = (riskAmount / signal.price) * 100;
    const recommendedPositionSize = Math.min(
      this.riskLimits.maxPositionSize,
      (this.riskLimits.maxPositionSize / riskPercent) * 100
    );

    // Check if this position would exceed daily risk
    const positionRisk = (recommendedPositionSize / 100) * this.currentMetrics.portfolioValue * (riskPercent / 100);
    if (this.currentMetrics.currentDailyRisk + positionRisk > (this.riskLimits.maxDailyRisk / 100) * this.currentMetrics.portfolioValue) {
      this.dailyRejectedCount++;
      return {
        allowed: false,
        reason: 'Daily risk limit would be exceeded'
      };
    }

    const riskInfo: RiskData = {
      recommendedPositionSize,
      maxPositionValue: (recommendedPositionSize / 100) * this.currentMetrics.portfolioValue,
      riskAmount: positionRisk,
      exposurePercent: recommendedPositionSize,
      allowed: true
    };

    this.dailySignalCount++;
    return {
      allowed: true,
      riskInfo
    };
  }

  public generateRiskSummaryForSignal(signal: TradingSignal): string {
    const riskCheck = this.shouldAllowSignal(signal);
    
    if (!riskCheck.allowed) {
      return `🚫 <b>Risk Management:</b> Signal blocked - ${riskCheck.reason}`;
    }

    const riskInfo = riskCheck.riskInfo!;
    
    return `
🔒 <b>Risk Management:</b>
💰 Recommended Size: ${riskInfo.recommendedPositionSize.toFixed(1)}%
💵 Max Position Value: $${riskInfo.maxPositionValue.toFixed(0)}
🚨 Risk Amount: $${riskInfo.riskAmount.toFixed(0)}
📊 Portfolio Exposure: ${riskInfo.exposurePercent.toFixed(1)}%`;
  }

  public getDailyStats(): DailyStats {
    const dailyLossPercent = (this.currentMetrics.currentDailyRisk / this.currentMetrics.portfolioValue) * 100;
    const isWithinLimits = dailyLossPercent <= this.riskLimits.maxDailyRisk && 
                          this.currentMetrics.activePositions <= this.riskLimits.maxConcurrentPositions;
    
    return {
      dailyLoss: dailyLossPercent,
      activePositions: this.currentMetrics.activePositions,
      isWithinLimits,
      emergencyPause: this.emergencyPauseActive,
      totalSignalsToday: this.dailySignalCount,
      rejectedSignalsToday: this.dailyRejectedCount,
      exposureLevel: (this.currentMetrics.currentDailyRisk / this.currentMetrics.portfolioValue) * 100
    };
  }

  public updatePortfolioValue(newValue: number) {
    this.currentMetrics.portfolioValue = newValue;
  }

  public recordPositionOpened(riskAmount: number) {
    this.currentMetrics.activePositions++;
    this.currentMetrics.currentDailyRisk += riskAmount;
  }

  public recordPositionClosed(result: number) {
    this.currentMetrics.activePositions = Math.max(0, this.currentMetrics.activePositions - 1);
    
    if (result < 0) {
      this.currentMetrics.currentDrawdown += Math.abs(result);
    } else {
      this.currentMetrics.currentDrawdown = Math.max(0, this.currentMetrics.currentDrawdown - result);
    }
  }

  public getRiskMetrics(): RiskMetrics {
    return { ...this.currentMetrics };
  }

  public getRiskLimits(): RiskLimits {
    return { ...this.riskLimits };
  }

  public updateRiskLimits(newLimits: Partial<RiskLimits>) {
    this.riskLimits = { ...this.riskLimits, ...newLimits };
  }

  public resetDailyRisk() {
    this.currentMetrics.currentDailyRisk = 0;
    this.dailySignalCount = 0;
    this.dailyRejectedCount = 0;
  }

  public enableEmergencyPause() {
    this.emergencyPauseActive = true;
  }

  public disableEmergencyPause() {
    this.emergencyPauseActive = false;
  }
}

export const riskManagementEngine = RiskManagementEngine.getInstance();
