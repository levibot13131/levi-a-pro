
import { TradingStrategy, PersonalTradingStrategy } from '@/types/trading';

export class StrategyEngine {
  private strategies: TradingStrategy[] = [
    {
      id: 'almog-personal-method',
      name: 'Almog Personal Method',
      type: 'personal',
      isActive: true,
      weight: 0.8,
      parameters: {
        rsiThreshold: 50,
        profitTargetPercent: 2.5,
        stopLossPercent: 1.5,
        maxRiskPercent: 2,
        riskRewardRatio: 1.75,
        volumeIncreaseRequired: true,
        resistanceBreakRequired: false
      },
      successRate: 0.73,
      totalSignals: 45,
      profitableSignals: 33,
      createdAt: Date.now(),
      updatedAt: Date.now()
    }
  ];

  public analyzeMarket(marketData: any) {
    // Mock signal generation
    return [{
      id: `signal-${Date.now()}`,
      symbol: 'BTCUSDT',
      action: 'buy' as 'buy' | 'sell',
      price: 67500,
      targetPrice: 69000,
      stopLoss: 66000,
      confidence: 0.85,
      strategy: 'almog-personal-method',
      riskRewardRatio: 2.5,
      reasoning: 'Strong technical setup with confirmation',
      timestamp: Date.now(),
      status: 'active' as 'active' | 'completed' | 'cancelled',
      telegramSent: false,
      metadata: {
        timeframe: '15M',
        pattern: 'breakout'
      }
    }];
  }

  public getActiveStrategies(): TradingStrategy[] {
    return this.strategies.filter(s => s.isActive);
  }

  public updateStrategy(strategyId: string, updates: Partial<TradingStrategy>) {
    const index = this.strategies.findIndex(s => s.id === strategyId);
    if (index !== -1) {
      this.strategies[index] = {
        ...this.strategies[index],
        ...updates,
        updatedAt: Date.now()
      };
    }
  }

  public getStrategy(strategyId: string): TradingStrategy | undefined {
    return this.strategies.find(s => s.id === strategyId);
  }
}

export const strategyEngine = new StrategyEngine();
