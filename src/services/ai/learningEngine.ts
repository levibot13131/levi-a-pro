import { TradingSignal } from '@/types/trading';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface StrategyPerformance {
  strategyId: string;
  strategyName: string;
  totalSignals: number;
  winningSignals: number;
  losingSignals: number;
  winRate: number;
  avgProfitPercent: number;
  avgLossPercent: number;
  avgRiskRewardRatio: number;
  profitFactor: number;
  maxDrawdown: number;
  consecutiveWins: number;
  consecutiveLosses: number;
  lastUpdated: number;
  confidence: number;
  weight: number;
  isActive: boolean;
}

interface SignalResult {
  signalId: string;
  strategy: string;
  symbol: string;
  action: 'buy' | 'sell';
  entryPrice: number;
  exitPrice: number;
  profitPercent: number;
  outcome: 'win' | 'loss' | 'breakeven';
  duration: number; // in minutes
  timestamp: number;
  confidence: number;
  riskRewardRatio: number;
}

interface AIInsights {
  bestPerformingStrategy: string;
  worstPerformingStrategy: string;
  recommendedStrategies: string[];
  blacklistedStrategies: string[];
  marketConditionOptimal: string;
  nextOptimization: string;
  confidenceLevel: number;
}

export class AILearningEngine {
  private strategyPerformance: Map<string, StrategyPerformance> = new Map();
  private signalResults: SignalResult[] = [];
  private insights: AIInsights | null = null;

  constructor() {
    this.initializeEngine();
  }

  private async initializeEngine() {
    console.log('🧠 AI Learning Engine initializing...');
    await this.loadHistoricalData();
    this.startPerformanceTracking();
  }

  private async loadHistoricalData() {
    try {
      // Load historical trading signals from database
      const { data: results, error } = await supabase
        .from('trading_signals')
        .select('*')
        .not('exit_price', 'is', null)
        .order('created_at', { ascending: false })
        .limit(1000);

      if (error) {
        console.error('Error loading historical data:', error);
        return;
      }

      // Convert trading signals to signal results format
      this.signalResults = (results || []).map(signal => ({
        signalId: signal.signal_id,
        strategy: signal.strategy,
        symbol: signal.symbol,
        action: signal.action as 'buy' | 'sell',
        entryPrice: Number(signal.price) || 0,
        exitPrice: Number(signal.exit_price) || 0,
        profitPercent: Number(signal.profit_percent) || 0,
        outcome: this.determineOutcome(Number(signal.profit_percent) || 0),
        duration: this.calculateDuration(signal.created_at, signal.executed_at),
        timestamp: new Date(signal.created_at).getTime(),
        confidence: Number(signal.confidence) || 0.5,
        riskRewardRatio: Number(signal.risk_reward_ratio) || 1.0
      }));

      console.log(`📊 Loaded ${this.signalResults.length} historical signal results`);
      
      this.calculateStrategyPerformance();
      this.generateInsights();
    } catch (error) {
      console.error('Error initializing AI learning engine:', error);
    }
  }

  private determineOutcome(profitPercent: number): 'win' | 'loss' | 'breakeven' {
    if (profitPercent > 0.1) return 'win';
    if (profitPercent < -0.1) return 'loss';
    return 'breakeven';
  }

  private calculateDuration(createdAt: string, executedAt: string | null): number {
    if (!executedAt) return 0;
    const start = new Date(createdAt).getTime();
    const end = new Date(executedAt).getTime();
    return Math.floor((end - start) / (1000 * 60)); // Duration in minutes
  }

  private startPerformanceTracking() {
    // Listen for new signal results
    window.addEventListener('signal-result', ((event: CustomEvent) => {
      this.recordSignalResult(event.detail);
    }) as EventListener);

    // Recalculate performance every hour
    setInterval(() => {
      this.calculateStrategyPerformance();
      this.generateInsights();
    }, 3600000); // 1 hour
  }

  public async recordSignalResult(result: SignalResult) {
    console.log('📝 Recording signal result:', result);
    
    try {
      // Save to trading_signals table with exit data
      const { error } = await supabase
        .from('trading_signals')
        .update({
          exit_price: result.exitPrice,
          profit_percent: result.profitPercent,
          status: 'completed',
          exit_reason: result.outcome
        })
        .eq('signal_id', result.signalId);

      if (error) {
        console.error('Error saving signal result:', error);
        return;
      }

      // Add to local array
      this.signalResults.unshift(result);
      
      // Keep only last 1000 results
      if (this.signalResults.length > 1000) {
        this.signalResults = this.signalResults.slice(0, 1000);
      }

      // Recalculate performance for this strategy
      this.calculateStrategyPerformance();
      this.generateInsights();
      
      console.log(`✅ Signal result recorded: ${result.outcome} for ${result.strategy}`);
    } catch (error) {
      console.error('Error recording signal result:', error);
    }
  }

  private calculateStrategyPerformance() {
    const strategies = new Set(this.signalResults.map(r => r.strategy));
    
    for (const strategy of strategies) {
      const strategyResults = this.signalResults.filter(r => r.strategy === strategy);
      
      if (strategyResults.length === 0) continue;

      const wins = strategyResults.filter(r => r.outcome === 'win');
      const losses = strategyResults.filter(r => r.outcome === 'loss');
      
      const totalProfit = wins.reduce((sum, r) => sum + r.profitPercent, 0);
      const totalLoss = Math.abs(losses.reduce((sum, r) => sum + r.profitPercent, 0));
      
      const winRate = wins.length / strategyResults.length;
      const avgProfit = wins.length > 0 ? totalProfit / wins.length : 0;
      const avgLoss = losses.length > 0 ? totalLoss / losses.length : 0;
      const profitFactor = totalLoss > 0 ? totalProfit / totalLoss : totalProfit;
      
      // Calculate consecutive wins/losses
      let consecutiveWins = 0;
      let consecutiveLosses = 0;
      let currentWinStreak = 0;
      let currentLossStreak = 0;
      
      for (const result of strategyResults) {
        if (result.outcome === 'win') {
          currentWinStreak++;
          currentLossStreak = 0;
          consecutiveWins = Math.max(consecutiveWins, currentWinStreak);
        } else if (result.outcome === 'loss') {
          currentLossStreak++;
          currentWinStreak = 0;
          consecutiveLosses = Math.max(consecutiveLosses, currentLossStreak);
        }
      }

      // Calculate dynamic weight based on performance
      let weight = 0.1; // Base weight
      
      if (winRate >= 0.7) weight = 0.8;
      else if (winRate >= 0.6) weight = 0.6;
      else if (winRate >= 0.5) weight = 0.4;
      else if (winRate >= 0.4) weight = 0.2;
      
      // Special handling for personal method
      if (strategy === 'almog-personal-method') {
        weight = Math.max(0.8, weight); // Always at least 80%
      }

      const performance: StrategyPerformance = {
        strategyId: strategy,
        strategyName: this.getStrategyDisplayName(strategy),
        totalSignals: strategyResults.length,
        winningSignals: wins.length,
        losingSignals: losses.length,
        winRate: winRate,
        avgProfitPercent: avgProfit,
        avgLossPercent: avgLoss,
        avgRiskRewardRatio: strategyResults.reduce((sum, r) => sum + r.riskRewardRatio, 0) / strategyResults.length,
        profitFactor: profitFactor,
        maxDrawdown: this.calculateMaxDrawdown(strategyResults),
        consecutiveWins,
        consecutiveLosses,
        lastUpdated: Date.now(),
        confidence: this.calculateConfidence(winRate, strategyResults.length),
        weight: weight,
        isActive: winRate >= 0.3 // Deactivate if win rate drops below 30%
      };

      this.strategyPerformance.set(strategy, performance);
    }

    console.log('📊 Strategy performance calculated for', strategies.size, 'strategies');
  }

  private calculateMaxDrawdown(results: SignalResult[]): number {
    let peak = 0;
    let maxDrawdown = 0;
    let runningPnL = 0;

    for (const result of results.reverse()) {
      runningPnL += result.profitPercent;
      peak = Math.max(peak, runningPnL);
      const drawdown = peak - runningPnL;
      maxDrawdown = Math.max(maxDrawdown, drawdown);
    }

    return maxDrawdown;
  }

  private calculateConfidence(winRate: number, sampleSize: number): number {
    // Statistical confidence based on sample size and win rate
    const baseConfidence = winRate;
    const sampleFactor = Math.min(1.0, sampleSize / 100); // Full confidence at 100+ samples
    
    return baseConfidence * sampleFactor;
  }

  private generateInsights() {
    const performances = Array.from(this.strategyPerformance.values());
    
    if (performances.length === 0) {
      this.insights = null;
      return;
    }

    // Sort by profitFactor
    const sorted = performances.sort((a, b) => b.profitFactor - a.profitFactor);
    
    const best = sorted[0];
    const worst = sorted[sorted.length - 1];
    
    const recommended = performances
      .filter(p => p.winRate >= 0.6 && p.totalSignals >= 10)
      .map(p => p.strategyId);
    
    const blacklisted = performances
      .filter(p => p.winRate < 0.3 && p.totalSignals >= 10)
      .map(p => p.strategyId);

    this.insights = {
      bestPerformingStrategy: best.strategyName,
      worstPerformingStrategy: worst.strategyName,
      recommendedStrategies: recommended,
      blacklistedStrategies: blacklisted,
      marketConditionOptimal: this.determineOptimalMarketCondition(),
      nextOptimization: this.suggestNextOptimization(),
      confidenceLevel: performances.reduce((sum, p) => sum + p.confidence, 0) / performances.length
    };

    console.log('🧠 AI Insights generated:', this.insights);
  }

  private determineOptimalMarketCondition(): string {
    const recentResults = this.signalResults.slice(0, 50);
    const winRate = recentResults.filter(r => r.outcome === 'win').length / recentResults.length;
    
    if (winRate >= 0.7) return 'Trending Market';
    if (winRate >= 0.5) return 'Mixed Market';
    return 'Choppy Market';
  }

  private suggestNextOptimization(): string {
    const performances = Array.from(this.strategyPerformance.values());
    const underperforming = performances.filter(p => p.winRate < 0.5);
    
    if (underperforming.length > 0) {
      return `Optimize ${underperforming[0].strategyName} parameters`;
    }
    
    return 'Consider adding new market condition filters';
  }

  private getStrategyDisplayName(strategyId: string): string {
    const names: Record<string, string> = {
      'almog-personal-method': 'LeviPro Personal Method',
      'rsi-macd-strategy': 'RSI + MACD Confluence',
      'wyckoff-strategy': 'Wyckoff Analysis',
      'smc-strategy': 'Smart Money Concepts',
      'triangle-breakout': 'Triangle Breakout',
      'volume-analysis': 'Volume Analysis',
      'candlestick-strategy': 'Candlestick Patterns'
    };
    
    return names[strategyId] || strategyId;
  }

  // Public methods for dashboard and reporting
  public getStrategyPerformance(strategyId?: string): StrategyPerformance[] {
    if (strategyId) {
      const performance = this.strategyPerformance.get(strategyId);
      return performance ? [performance] : [];
    }
    
    return Array.from(this.strategyPerformance.values())
      .sort((a, b) => b.profitFactor - a.profitFactor);
  }

  public getInsights(): AIInsights | null {
    return this.insights;
  }

  public getOptimalStrategyWeights(): Record<string, number> {
    const weights: Record<string, number> = {};
    
    for (const [strategyId, performance] of this.strategyPerformance) {
      weights[strategyId] = performance.weight;
    }
    
    return weights;
  }

  public async generateDailyReport(): Promise<string> {
    const performances = this.getStrategyPerformance();
    const insights = this.getInsights();
    
    if (!insights || performances.length === 0) {
      return 'לא זמינים מספיק נתונים ליצירת דו"ח יומי';
    }

    const totalSignals = performances.reduce((sum, p) => sum + p.totalSignals, 0);
    const avgWinRate = performances.reduce((sum, p) => sum + p.winRate, 0) / performances.length;
    
    const report = `
📊 <b>דו"ח יומי AI - LeviPro</b>
📅 ${new Date().toLocaleDateString('he-IL')}

🎯 <b>ביצועים כלליים:</b>
• סה"כ איתותים: ${totalSignals}
• אחוז הצלחה ממוצע: ${(avgWinRate * 100).toFixed(1)}%
• רמת ביטחון: ${(insights.confidenceLevel * 100).toFixed(1)}%

🏆 <b>אסטרטגיה מובילה:</b> ${insights.bestPerformingStrategy}
⚠️ <b>זקוקה לשיפור:</b> ${insights.worstPerformingStrategy}

🔄 <b>המלצות למחר:</b>
• תנאי שוק אופטימליים: ${insights.marketConditionOptimal}
• אופטימיזציה הבאה: ${insights.nextOptimization}

${insights.blacklistedStrategies.length > 0 ? `❌ <b>אסטרטגיות מושבתות זמנית:</b> ${insights.blacklistedStrategies.join(', ')}` : ''}

🧠 המערכת ממשיכה ללמוד ולהשתפר אוטומטית.
#LeviPro #AI #DailyReport #Trading
`;

    return report;
  }
}

export const aiLearningEngine = new AILearningEngine();
