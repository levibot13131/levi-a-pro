
interface RiskConfiguration {
  maxDailyLossPercent: number;
  maxRiskPerTradePercent: number;
  maxExposurePerAsset: number;
  maxSimultaneousPositions: number;
  accountCapital: number;
  enableRiskFiltering: boolean;
  emergencyPause: boolean;
}

interface PositionSizeCalculation {
  recommendedPositionSize: number;
  maxPositionValue: number;
  riskAmount: number;
  exposurePercent: number;
  withinLimits: boolean;
  riskWarnings: string[];
}

interface RiskExposure {
  currentDailyLoss: number;
  activePositions: number;
  totalExposure: number;
  exposureByAsset: Map<string, number>;
  exposureByStrategy: Map<string, number>;
}

export class RiskManagementEngine {
  private static instance: RiskManagementEngine;
  private riskConfig: RiskConfiguration;
  private currentExposure: RiskExposure;
  private dailyTrades: Array<{ timestamp: number; pnl: number; symbol: string; strategy: string }> = [];

  private constructor() {
    this.riskConfig = this.loadDefaultConfig();
    this.currentExposure = this.initializeExposure();
    this.resetDailyCountersIfNeeded();
  }

  public static getInstance(): RiskManagementEngine {
    if (!RiskManagementEngine.instance) {
      RiskManagementEngine.instance = new RiskManagementEngine();
    }
    return RiskManagementEngine.instance;
  }

  private loadDefaultConfig(): RiskConfiguration {
    return {
      maxDailyLossPercent: 3.0,
      maxRiskPerTradePercent: 1.5,
      maxExposurePerAsset: 10.0,
      maxSimultaneousPositions: 5,
      accountCapital: 10000, // Default - should be configured by user
      enableRiskFiltering: true,
      emergencyPause: false
    };
  }

  private initializeExposure(): RiskExposure {
    return {
      currentDailyLoss: 0,
      activePositions: 0,
      totalExposure: 0,
      exposureByAsset: new Map(),
      exposureByStrategy: new Map()
    };
  }

  private resetDailyCountersIfNeeded() {
    const today = new Date().toDateString();
    const lastReset = localStorage.getItem('risk_last_reset');
    
    if (lastReset !== today) {
      this.currentExposure.currentDailyLoss = 0;
      this.dailyTrades = [];
      localStorage.setItem('risk_last_reset', today);
      console.log('🔄 Daily risk counters reset');
    }
  }

  public calculatePositionSize(signal: any): PositionSizeCalculation {
    const { price, stopLoss, symbol } = signal;
    const warnings: string[] = [];
    
    // Calculate risk per unit
    const riskPerUnit = Math.abs(price - stopLoss);
    const riskPercent = (riskPerUnit / price) * 100;
    
    // Calculate maximum risk amount
    const maxRiskAmount = (this.riskConfig.accountCapital * this.riskConfig.maxRiskPerTradePercent) / 100;
    
    // Calculate recommended position size
    const recommendedUnits = maxRiskAmount / riskPerUnit;
    const recommendedPositionSize = recommendedUnits * price;
    const exposurePercent = (recommendedPositionSize / this.riskConfig.accountCapital) * 100;
    
    // Check limits
    let withinLimits = true;
    
    // Check daily loss limit
    if (this.currentExposure.currentDailyLoss >= this.riskConfig.maxDailyLossPercent) {
      withinLimits = false;
      warnings.push(`Daily loss limit exceeded (${this.currentExposure.currentDailyLoss.toFixed(1)}%)`);
    }
    
    // Check simultaneous positions
    if (this.currentExposure.activePositions >= this.riskConfig.maxSimultaneousPositions) {
      withinLimits = false;
      warnings.push(`Max simultaneous positions reached (${this.currentExposure.activePositions})`);
    }
    
    // Check asset exposure
    const currentAssetExposure = this.currentExposure.exposureByAsset.get(symbol) || 0;
    if (currentAssetExposure + exposurePercent > this.riskConfig.maxExposurePerAsset) {
      withinLimits = false;
      warnings.push(`Asset exposure limit exceeded for ${symbol}`);
    }
    
    // Check emergency pause
    if (this.riskConfig.emergencyPause) {
      withinLimits = false;
      warnings.push('Emergency pause activated');
    }
    
    return {
      recommendedPositionSize,
      maxPositionValue: recommendedPositionSize,
      riskAmount: maxRiskAmount,
      exposurePercent,
      withinLimits,
      riskWarnings: warnings
    };
  }

  public shouldAllowSignal(signal: any): { allowed: boolean; reason?: string; riskInfo?: PositionSizeCalculation } {
    this.resetDailyCountersIfNeeded();
    
    if (!this.riskConfig.enableRiskFiltering) {
      return { allowed: true };
    }
    
    const positionCalc = this.calculatePositionSize(signal);
    
    if (!positionCalc.withinLimits) {
      return {
        allowed: false,
        reason: `Risk limits exceeded: ${positionCalc.riskWarnings.join(', ')}`,
        riskInfo: positionCalc
      };
    }
    
    return { allowed: true, riskInfo: positionCalc };
  }

  public updateTradeResult(symbol: string, strategy: string, pnlPercent: number) {
    this.dailyTrades.push({
      timestamp: Date.now(),
      pnl: pnlPercent,
      symbol,
      strategy
    });
    
    if (pnlPercent < 0) {
      this.currentExposure.currentDailyLoss += Math.abs(pnlPercent);
      
      // Auto-pause if daily loss limit exceeded
      if (this.currentExposure.currentDailyLoss >= this.riskConfig.maxDailyLossPercent) {
        this.riskConfig.emergencyPause = true;
        console.log('🚨 Emergency pause activated due to daily loss limit');
      }
    }
  }

  public getRiskConfiguration(): RiskConfiguration {
    return { ...this.riskConfig };
  }

  public updateRiskConfiguration(config: Partial<RiskConfiguration>) {
    this.riskConfig = { ...this.riskConfig, ...config };
    console.log('⚙️ Risk configuration updated:', config);
  }

  public getCurrentExposure(): RiskExposure {
    return { ...this.currentExposure };
  }

  public getDailyStats() {
    return {
      dailyLoss: this.currentExposure.currentDailyLoss,
      dailyTrades: this.dailyTrades.length,
      activePositions: this.currentExposure.activePositions,
      totalExposure: this.currentExposure.totalExposure,
      isWithinLimits: this.currentExposure.currentDailyLoss < this.riskConfig.maxDailyLossPercent,
      emergencyPause: this.riskConfig.emergencyPause
    };
  }

  public resetEmergencyPause() {
    this.riskConfig.emergencyPause = false;
    console.log('✅ Emergency pause lifted');
  }

  public generateRiskSummaryForSignal(signal: any): string {
    const positionCalc = this.calculatePositionSize(signal);
    const dailyStats = this.getDailyStats();
    
    return `
📊 Risk Summary:
• Max risk: ${this.riskConfig.maxRiskPerTradePercent}%
• Suggested position: ${positionCalc.exposurePercent.toFixed(2)}%
• Risk amount: $${positionCalc.riskAmount.toFixed(2)}
• Daily loss: ${dailyStats.dailyLoss.toFixed(1)}%/${this.riskConfig.maxDailyLossPercent}%
• Active positions: ${dailyStats.activePositions}/${this.riskConfig.maxSimultaneousPositions}
• Exposure level: ${positionCalc.withinLimits ? 'Acceptable ✅' : 'Risk Exceeded ⚠️'}
${positionCalc.riskWarnings.length > 0 ? `⚠️ Warnings: ${positionCalc.riskWarnings.join(', ')}` : ''}`;
  }
}

export const riskManagementEngine = RiskManagementEngine.getInstance();
