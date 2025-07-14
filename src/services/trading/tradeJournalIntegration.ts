// Trade Journal Integration
// Based on uploaded Excel structure - comprehensive trade tracking and analysis

import { supabase } from '@/integrations/supabase/client';
import { TradeJournalEntry } from '@/types/journal';

export interface TradeAnalysis {
  entryQuality: 'excellent' | 'good' | 'average' | 'poor';
  exitQuality: 'excellent' | 'good' | 'average' | 'poor';
  riskManagement: 'excellent' | 'good' | 'average' | 'poor';
  emotionalControl: 'excellent' | 'good' | 'average' | 'poor';
  overallGrade: 'A' | 'B' | 'C' | 'D' | 'F';
  lessonsLearned: string[];
  improvementAreas: string[];
}

export interface PerformanceMetrics {
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  winRate: number;
  avgWin: number;
  avgLoss: number;
  profitFactor: number;
  sharpeRatio: number;
  maxDrawdown: number;
  consecutiveWins: number;
  consecutiveLosses: number;
  bestTrade: number;
  worstTrade: number;
  avgHoldingTime: number;
  riskRewardRatio: number;
}

export interface StrategyBreakdown {
  strategy: string;
  trades: number;
  winRate: number;
  avgProfit: number;
  profitFactor: number;
  totalPnL: number;
}

export interface TimeframeAnalysis {
  timeframe: string;
  trades: number;
  winRate: number;
  avgProfit: number;
  bestHours: number[];
  worstHours: number[];
}

export interface RiskMetrics {
  riskPerTrade: number;
  maxRisk: number;
  avgRisk: number;
  riskVsReturn: number;
  positionSizing: 'conservative' | 'moderate' | 'aggressive';
  adherenceToRules: number; // Percentage
}

export class TradeJournalIntegration {
  
  /**
   * Create comprehensive trade journal entry
   */
  public async createJournalEntry(
    signal: any,
    outcome: 'win' | 'loss' | 'breakeven' | 'open',
    exitPrice?: number,
    exitReason?: string
  ): Promise<TradeJournalEntry> {
    
    const entry: TradeJournalEntry = {
      id: `TRADE_${Date.now()}`,
      assetId: signal.symbol,
      assetName: this.getAssetName(signal.symbol),
      type: signal.action.toLowerCase() as 'buy' | 'sell',
      entryPrice: signal.entry_price,
      entryDate: new Date().toISOString(),
      exitPrice: exitPrice,
      exitDate: exitPrice ? Date.now() : undefined,
      quantity: this.calculateQuantity(signal),
      leverage: 1, // Default leverage
      fees: this.calculateFees(signal),
      profit: exitPrice ? this.calculateProfit(signal, exitPrice) : undefined,
      profitPercentage: exitPrice ? this.calculateProfitPercentage(signal, exitPrice) : undefined,
      outcome,
      notes: this.generateTradeNotes(signal, exitReason),
      tags: this.generateTradeTags(signal),
      strategy: signal.strategy,
      date: new Date().toISOString().split('T')[0],
      symbol: signal.symbol,
      direction: signal.action === 'BUY' ? 'long' : 'short',
      stopLoss: signal.stop_loss,
      targetPrice: signal.target_price,
      positionSize: this.calculatePositionSize(signal),
      risk: this.calculateRiskAmount(signal)
    };

    // Save to database
    try {
      await supabase.from('signal_history').insert({
        signal_id: entry.id,
        symbol: entry.symbol,
        strategy: entry.strategy || '',
        action: entry.type?.toUpperCase() || 'BUY',
        entry_price: entry.entryPrice,
        target_price: entry.targetPrice || 0,
        stop_loss: entry.stopLoss,
        confidence: signal.confidence || 0,
        risk_reward_ratio: signal.risk_reward_ratio || 0,
        reasoning: entry.notes || '',
        outcome: entry.outcome,
        exit_price: entry.exitPrice,
        actual_profit_loss: entry.profitPercentage,
        exit_reason: exitReason,
        market_conditions: {
          timeframe: signal.timeframe,
          confluences: signal.confluences,
          methods: signal.methods
        }
      });

      console.log(`📊 Trade journal entry created: ${entry.id}`);
    } catch (error) {
      console.error('❌ Failed to save journal entry:', error);
    }

    return entry;
  }

  /**
   * Analyze trade performance (based on Excel structure)
   */
  public analyzeTradePerformance(entry: TradeJournalEntry): TradeAnalysis {
    // Entry Quality Analysis
    const entryQuality = this.assessEntryQuality(entry);
    
    // Exit Quality Analysis  
    const exitQuality = this.assessExitQuality(entry);
    
    // Risk Management Analysis
    const riskManagement = this.assessRiskManagement(entry);
    
    // Emotional Control Analysis
    const emotionalControl = this.assessEmotionalControl(entry);
    
    // Overall Grade
    const grades = [entryQuality, exitQuality, riskManagement, emotionalControl];
    const overallGrade = this.calculateOverallGrade(grades);
    
    // Generate lessons and improvement areas
    const lessonsLearned = this.generateLessonsLearned(entry, {
      entryQuality, exitQuality, riskManagement, emotionalControl
    });
    
    const improvementAreas = this.generateImprovementAreas(entry, {
      entryQuality, exitQuality, riskManagement, emotionalControl
    });

    return {
      entryQuality,
      exitQuality,
      riskManagement,
      emotionalControl,
      overallGrade,
      lessonsLearned,
      improvementAreas
    };
  }

  /**
   * Calculate comprehensive performance metrics
   */
  public async calculatePerformanceMetrics(): Promise<PerformanceMetrics> {
    try {
      const { data: trades } = await supabase
        .from('signal_history')
        .select('*')
        .not('outcome', 'eq', 'pending')
        .order('created_at', { ascending: false });

      if (!trades || trades.length === 0) {
        return this.getEmptyMetrics();
      }

      const winningTrades = trades.filter(t => t.outcome === 'win' || t.was_correct);
      const losingTrades = trades.filter(t => t.outcome === 'loss' || (!t.was_correct && t.outcome !== 'win'));
      
      const profits = winningTrades.map(t => t.actual_profit_loss || 0);
      const losses = losingTrades.map(t => Math.abs(t.actual_profit_loss || 0));
      
      const avgWin = profits.length > 0 ? profits.reduce((sum, p) => sum + p, 0) / profits.length : 0;
      const avgLoss = losses.length > 0 ? losses.reduce((sum, l) => sum + l, 0) / losses.length : 0;
      
      const totalProfit = profits.reduce((sum, p) => sum + p, 0);
      const totalLoss = losses.reduce((sum, l) => sum + l, 0);
      
      const profitFactor = totalLoss > 0 ? totalProfit / totalLoss : totalProfit > 0 ? 10 : 1;
      
      // Calculate Sharpe ratio (simplified)
      const allReturns = trades.map(t => t.actual_profit_loss || 0);
      const avgReturn = allReturns.reduce((sum, r) => sum + r, 0) / allReturns.length;
      const returnStdDev = this.calculateStandardDeviation(allReturns);
      const sharpeRatio = returnStdDev > 0 ? avgReturn / returnStdDev : 0;
      
      // Calculate max drawdown
      const maxDrawdown = this.calculateMaxDrawdown(trades);
      
      // Calculate consecutive wins/losses
      const { consecutiveWins, consecutiveLosses } = this.calculateConsecutiveStreaks(trades);
      
      // Best and worst trades
      const bestTrade = Math.max(...allReturns);
      const worstTrade = Math.min(...allReturns);
      
      // Average holding time (simplified - based on available data)
      const avgHoldingTime = this.calculateAvgHoldingTime(trades);
      
      // Average risk-reward ratio
      const riskRewardRatio = trades.reduce((sum, t) => sum + (t.risk_reward_ratio || 0), 0) / trades.length;

      return {
        totalTrades: trades.length,
        winningTrades: winningTrades.length,
        losingTrades: losingTrades.length,
        winRate: trades.length > 0 ? winningTrades.length / trades.length : 0,
        avgWin,
        avgLoss,
        profitFactor,
        sharpeRatio,
        maxDrawdown,
        consecutiveWins,
        consecutiveLosses,
        bestTrade,
        worstTrade,
        avgHoldingTime,
        riskRewardRatio
      };

    } catch (error) {
      console.error('❌ Failed to calculate performance metrics:', error);
      return this.getEmptyMetrics();
    }
  }

  /**
   * Generate strategy breakdown analysis
   */
  public async getStrategyBreakdown(): Promise<StrategyBreakdown[]> {
    try {
      const { data: trades } = await supabase
        .from('signal_history')
        .select('*')
        .not('outcome', 'eq', 'pending');

      if (!trades) return [];

      const strategyGroups = new Map<string, any[]>();
      
      trades.forEach(trade => {
        const strategy = trade.strategy || 'Unknown';
        if (!strategyGroups.has(strategy)) {
          strategyGroups.set(strategy, []);
        }
        strategyGroups.get(strategy)!.push(trade);
      });

      return Array.from(strategyGroups.entries()).map(([strategy, strategyTrades]) => {
        const winningTrades = strategyTrades.filter(t => t.outcome === 'win' || t.was_correct);
        const profits = winningTrades.map(t => t.actual_profit_loss || 0);
        const losses = strategyTrades.filter(t => t.outcome === 'loss' || (!t.was_correct && t.outcome !== 'win'))
          .map(t => Math.abs(t.actual_profit_loss || 0));
        
        const totalProfit = profits.reduce((sum, p) => sum + p, 0);
        const totalLoss = losses.reduce((sum, l) => sum + l, 0);
        const totalPnL = strategyTrades.reduce((sum, t) => sum + (t.actual_profit_loss || 0), 0);
        
        return {
          strategy,
          trades: strategyTrades.length,
          winRate: strategyTrades.length > 0 ? winningTrades.length / strategyTrades.length : 0,
          avgProfit: profits.length > 0 ? totalProfit / profits.length : 0,
          profitFactor: totalLoss > 0 ? totalProfit / totalLoss : totalProfit > 0 ? 10 : 1,
          totalPnL
        };
      }).sort((a, b) => b.totalPnL - a.totalPnL);

    } catch (error) {
      console.error('❌ Failed to get strategy breakdown:', error);
      return [];
    }
  }

  /**
   * Analyze timeframe performance
   */
  public async getTimeframeAnalysis(): Promise<TimeframeAnalysis[]> {
    try {
      const { data: trades } = await supabase
        .from('signal_history')
        .select('*')
        .not('outcome', 'eq', 'pending');

      if (!trades) return [];

      // Group by timeframe (from market_conditions if available)
      const timeframeGroups = new Map<string, any[]>();
      
      trades.forEach(trade => {
        const marketConditions = trade.market_conditions as any;
        const timeframe = marketConditions?.timeframe || '1h';
        if (!timeframeGroups.has(timeframe)) {
          timeframeGroups.set(timeframe, []);
        }
        timeframeGroups.get(timeframe)!.push(trade);
      });

      return Array.from(timeframeGroups.entries()).map(([timeframe, timeframeTrades]) => {
        const winningTrades = timeframeTrades.filter(t => t.outcome === 'win' || t.was_correct);
        const avgProfit = timeframeTrades.reduce((sum, t) => sum + (t.actual_profit_loss || 0), 0) / timeframeTrades.length;
        
        // Analyze best/worst trading hours (simplified)
        const tradingHours = timeframeTrades.map(t => new Date(t.created_at).getUTCHours());
        const hourPerformance = this.analyzeHourlyPerformance(timeframeTrades);
        
        return {
          timeframe,
          trades: timeframeTrades.length,
          winRate: timeframeTrades.length > 0 ? winningTrades.length / timeframeTrades.length : 0,
          avgProfit,
          bestHours: Object.entries(hourPerformance)
            .filter(([_, winRate]) => winRate > 0.6)
            .map(([hour]) => parseInt(hour))
            .slice(0, 3),
          worstHours: Object.entries(hourPerformance)
            .filter(([_, winRate]) => winRate < 0.4)
            .map(([hour]) => parseInt(hour))
            .slice(0, 3)
        };
      });

    } catch (error) {
      console.error('❌ Failed to get timeframe analysis:', error);
      return [];
    }
  }

  /**
   * Calculate risk metrics
   */
  public async getRiskMetrics(): Promise<RiskMetrics> {
    try {
      const { data: trades } = await supabase
        .from('signal_history')
        .select('*')
        .not('outcome', 'eq', 'pending');

      if (!trades || trades.length === 0) {
        return {
          riskPerTrade: 0,
          maxRisk: 0,
          avgRisk: 0,
          riskVsReturn: 0,
          positionSizing: 'conservative',
          adherenceToRules: 0
        };
      }

      // Calculate risk metrics from available data
      const riskAmounts = trades.map(t => {
        if (t.stop_loss && t.entry_price) {
          return Math.abs(t.entry_price - t.stop_loss) / t.entry_price;
        }
        return 0.02; // Default 2% risk
      });

      const avgRisk = riskAmounts.reduce((sum, r) => sum + r, 0) / riskAmounts.length;
      const maxRisk = Math.max(...riskAmounts);
      
      // Risk vs Return
      const avgReturn = trades.reduce((sum, t) => sum + Math.abs(t.actual_profit_loss || 0), 0) / trades.length;
      const riskVsReturn = avgRisk > 0 ? avgReturn / (avgRisk * 100) : 0;
      
      // Position sizing assessment
      let positionSizing: 'conservative' | 'moderate' | 'aggressive';
      if (avgRisk < 0.015) positionSizing = 'conservative';
      else if (avgRisk < 0.03) positionSizing = 'moderate';
      else positionSizing = 'aggressive';
      
      // Adherence to rules (simplified - based on risk consistency)
      const riskStdDev = this.calculateStandardDeviation(riskAmounts);
      const adherenceToRules = Math.max(0, 100 - (riskStdDev * 1000)); // Lower deviation = better adherence

      return {
        riskPerTrade: avgRisk * 100,
        maxRisk: maxRisk * 100,
        avgRisk: avgRisk * 100,
        riskVsReturn,
        positionSizing,
        adherenceToRules
      };

    } catch (error) {
      console.error('❌ Failed to calculate risk metrics:', error);
      return {
        riskPerTrade: 0,
        maxRisk: 0,
        avgRisk: 0,
        riskVsReturn: 0,
        positionSizing: 'conservative',
        adherenceToRules: 0
      };
    }
  }

  /**
   * Generate comprehensive trading report
   */
  public async generateTradingReport(): Promise<{
    performance: PerformanceMetrics;
    strategies: StrategyBreakdown[];
    timeframes: TimeframeAnalysis[];
    risk: RiskMetrics;
    insights: string[];
    recommendations: string[];
  }> {
    const [performance, strategies, timeframes, risk] = await Promise.all([
      this.calculatePerformanceMetrics(),
      this.getStrategyBreakdown(),
      this.getTimeframeAnalysis(),
      this.getRiskMetrics()
    ]);

    const insights = this.generateInsights(performance, strategies, risk);
    const recommendations = this.generateRecommendations(performance, strategies, risk);

    return {
      performance,
      strategies,
      timeframes,
      risk,
      insights,
      recommendations
    };
  }

  // Helper methods
  private getAssetName(symbol: string): string {
    const assetNames: Record<string, string> = {
      'BTCUSDT': 'Bitcoin',
      'ETHUSDT': 'Ethereum',
      'BNBUSDT': 'Binance Coin',
      'SOLUSDT': 'Solana',
      'XRPUSDT': 'XRP',
      'ADAUSDT': 'Cardano',
      'AVAXUSDT': 'Avalanche',
      'DOTUSDT': 'Polkadot',
      'LINKUSDT': 'Chainlink',
      'MATICUSDT': 'Polygon'
    };
    return assetNames[symbol] || symbol;
  }

  private calculateQuantity(signal: any): number {
    // Simplified quantity calculation based on risk management
    const accountSize = 10000; // Default account size
    const riskPercent = 0.02; // 2% risk per trade
    const riskAmount = accountSize * riskPercent;
    const stopDistance = Math.abs(signal.entry_price - signal.stop_loss);
    return stopDistance > 0 ? riskAmount / stopDistance : 1;
  }

  private calculateFees(signal: any): number {
    // Simplified fee calculation (0.1% trading fee)
    return signal.entry_price * 0.001;
  }

  private calculateProfit(signal: any, exitPrice: number): number {
    const quantity = this.calculateQuantity(signal);
    if (signal.action === 'BUY') {
      return quantity * (exitPrice - signal.entry_price);
    } else {
      return quantity * (signal.entry_price - exitPrice);
    }
  }

  private calculateProfitPercentage(signal: any, exitPrice: number): number {
    if (signal.action === 'BUY') {
      return ((exitPrice - signal.entry_price) / signal.entry_price) * 100;
    } else {
      return ((signal.entry_price - exitPrice) / signal.entry_price) * 100;
    }
  }

  private generateTradeNotes(signal: any, exitReason?: string): string {
    const notes = [];
    
    if (signal.reasoning && Array.isArray(signal.reasoning)) {
      notes.push(`Entry reasoning: ${signal.reasoning.join('; ')}`);
    }
    
    if (signal.confluences && Array.isArray(signal.confluences)) {
      notes.push(`Confluences: ${signal.confluences.join('; ')}`);
    }
    
    if (exitReason) {
      notes.push(`Exit reason: ${exitReason}`);
    }
    
    return notes.join('\n');
  }

  private generateTradeTags(signal: any): string[] {
    const tags = [signal.strategy];
    
    if (signal.timeframe) tags.push(signal.timeframe);
    if (signal.confidence > 80) tags.push('high-confidence');
    if (signal.risk_reward_ratio > 2) tags.push('good-rr');
    
    return tags.filter(Boolean);
  }

  private calculatePositionSize(signal: any): number {
    // Calculate position size based on risk management
    const accountSize = 10000; // Default
    const riskPercent = 0.02; // 2%
    const stopDistance = Math.abs(signal.entry_price - signal.stop_loss) / signal.entry_price;
    
    return stopDistance > 0 ? (accountSize * riskPercent) / stopDistance : 1000;
  }

  private calculateRiskAmount(signal: any): number {
    const positionSize = this.calculatePositionSize(signal);
    const stopDistance = Math.abs(signal.entry_price - signal.stop_loss) / signal.entry_price;
    return positionSize * stopDistance;
  }

  private assessEntryQuality(entry: TradeJournalEntry): 'excellent' | 'good' | 'average' | 'poor' {
    // Assess entry quality based on available data
    let score = 0;
    
    if (entry.notes?.includes('high-confidence')) score += 25;
    if (entry.notes?.includes('confluence')) score += 25;
    if (entry.risk < 500) score += 25; // Good risk management
    if (entry.targetPrice && entry.stopLoss) score += 25; // Proper planning
    
    if (score >= 75) return 'excellent';
    if (score >= 50) return 'good';
    if (score >= 25) return 'average';
    return 'poor';
  }

  private assessExitQuality(entry: TradeJournalEntry): 'excellent' | 'good' | 'average' | 'poor' {
    if (!entry.exitPrice) return 'average'; // Open trade
    
    let score = 0;
    
    // Check if exit was near target
    if (entry.targetPrice && entry.exitPrice) {
      const targetDistance = Math.abs(entry.exitPrice - entry.targetPrice) / entry.targetPrice;
      if (targetDistance < 0.02) score += 50; // Within 2% of target
    }
    
    // Check if stop loss was respected
    if (entry.outcome === 'loss' && entry.stopLoss) {
      const stopDistance = Math.abs(entry.exitPrice! - entry.stopLoss) / entry.stopLoss;
      if (stopDistance < 0.02) score += 50; // Respected stop loss
    }
    
    if (score >= 75) return 'excellent';
    if (score >= 50) return 'good';
    if (score >= 25) return 'average';
    return 'poor';
  }

  private assessRiskManagement(entry: TradeJournalEntry): 'excellent' | 'good' | 'average' | 'poor' {
    let score = 0;
    
    if (entry.stopLoss) score += 25; // Has stop loss
    if (entry.risk < 500) score += 25; // Reasonable risk amount
    if (entry.positionSize < 5000) score += 25; // Reasonable position size
    
    // Check R:R ratio if available
    if (entry.targetPrice && entry.stopLoss) {
      const rrRatio = Math.abs(entry.targetPrice - entry.entryPrice) / Math.abs(entry.entryPrice - entry.stopLoss);
      if (rrRatio >= 2) score += 25; // Good R:R ratio
    }
    
    if (score >= 75) return 'excellent';
    if (score >= 50) return 'good';
    if (score >= 25) return 'average';
    return 'poor';
  }

  private assessEmotionalControl(entry: TradeJournalEntry): 'excellent' | 'good' | 'average' | 'poor' {
    // Simplified emotional control assessment based on available data
    let score = 50; // Default average
    
    if (entry.notes?.includes('disciplined')) score += 25;
    if (entry.notes?.includes('panic')) score -= 25;
    if (entry.notes?.includes('fomo')) score -= 25;
    
    if (score >= 75) return 'excellent';
    if (score >= 50) return 'good';
    if (score >= 25) return 'average';
    return 'poor';
  }

  private calculateOverallGrade(grades: string[]): 'A' | 'B' | 'C' | 'D' | 'F' {
    const gradeValues = { excellent: 4, good: 3, average: 2, poor: 1 };
    const totalValue = grades.reduce((sum, grade) => sum + gradeValues[grade as keyof typeof gradeValues], 0);
    const avgValue = totalValue / grades.length;
    
    if (avgValue >= 3.5) return 'A';
    if (avgValue >= 2.5) return 'B';
    if (avgValue >= 1.5) return 'C';
    if (avgValue >= 1) return 'D';
    return 'F';
  }

  private generateLessonsLearned(entry: TradeJournalEntry, analysis: any): string[] {
    const lessons = [];
    
    if (analysis.entryQuality === 'excellent') {
      lessons.push('Strong entry with good confluence');
    }
    
    if (analysis.riskManagement === 'excellent') {
      lessons.push('Excellent risk management discipline');
    }
    
    if (entry.outcome === 'win' && entry.profitPercentage && entry.profitPercentage > 5) {
      lessons.push('Patience paid off with strong profit');
    }
    
    return lessons;
  }

  private generateImprovementAreas(entry: TradeJournalEntry, analysis: any): string[] {
    const areas = [];
    
    if (analysis.entryQuality === 'poor') {
      areas.push('Improve entry timing and confluence analysis');
    }
    
    if (analysis.riskManagement === 'poor') {
      areas.push('Better risk management and position sizing');
    }
    
    if (analysis.exitQuality === 'poor') {
      areas.push('Work on exit strategy and profit taking');
    }
    
    return areas;
  }

  private getEmptyMetrics(): PerformanceMetrics {
    return {
      totalTrades: 0,
      winningTrades: 0,
      losingTrades: 0,
      winRate: 0,
      avgWin: 0,
      avgLoss: 0,
      profitFactor: 0,
      sharpeRatio: 0,
      maxDrawdown: 0,
      consecutiveWins: 0,
      consecutiveLosses: 0,
      bestTrade: 0,
      worstTrade: 0,
      avgHoldingTime: 0,
      riskRewardRatio: 0
    };
  }

  private calculateStandardDeviation(values: number[]): number {
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
    return Math.sqrt(variance);
  }

  private calculateMaxDrawdown(trades: any[]): number {
    let peak = 0;
    let maxDrawdown = 0;
    let cumulativePnL = 0;
    
    trades.forEach(trade => {
      cumulativePnL += trade.actual_profit_loss || 0;
      if (cumulativePnL > peak) {
        peak = cumulativePnL;
      }
      const drawdown = peak - cumulativePnL;
      if (drawdown > maxDrawdown) {
        maxDrawdown = drawdown;
      }
    });
    
    return maxDrawdown;
  }

  private calculateConsecutiveStreaks(trades: any[]): { consecutiveWins: number; consecutiveLosses: number } {
    let maxWins = 0;
    let maxLosses = 0;
    let currentWins = 0;
    let currentLosses = 0;
    
    trades.forEach(trade => {
      if (trade.outcome === 'win' || trade.was_correct) {
        currentWins++;
        currentLosses = 0;
        maxWins = Math.max(maxWins, currentWins);
      } else {
        currentLosses++;
        currentWins = 0;
        maxLosses = Math.max(maxLosses, currentLosses);
      }
    });
    
    return { consecutiveWins: maxWins, consecutiveLosses: maxLosses };
  }

  private calculateAvgHoldingTime(trades: any[]): number {
    const completedTrades = trades.filter(t => t.closed_at);
    if (completedTrades.length === 0) return 0;
    
    const holdingTimes = completedTrades.map(t => {
      const entry = new Date(t.created_at).getTime();
      const exit = new Date(t.closed_at).getTime();
      return (exit - entry) / (1000 * 60 * 60); // Hours
    });
    
    return holdingTimes.reduce((sum, time) => sum + time, 0) / holdingTimes.length;
  }

  private analyzeHourlyPerformance(trades: any[]): Record<number, number> {
    const hourStats: Record<number, { wins: number; total: number }> = {};
    
    trades.forEach(trade => {
      const hour = new Date(trade.created_at).getUTCHours();
      if (!hourStats[hour]) {
        hourStats[hour] = { wins: 0, total: 0 };
      }
      hourStats[hour].total++;
      if (trade.outcome === 'win' || trade.was_correct) {
        hourStats[hour].wins++;
      }
    });
    
    const result: Record<number, number> = {};
    Object.entries(hourStats).forEach(([hour, stats]) => {
      result[parseInt(hour)] = stats.total > 0 ? stats.wins / stats.total : 0;
    });
    
    return result;
  }

  private generateInsights(performance: PerformanceMetrics, strategies: StrategyBreakdown[], risk: RiskMetrics): string[] {
    const insights = [];
    
    if (performance.winRate > 0.6) {
      insights.push(`Strong win rate of ${(performance.winRate * 100).toFixed(1)}%`);
    }
    
    if (performance.profitFactor > 1.5) {
      insights.push(`Healthy profit factor of ${performance.profitFactor.toFixed(2)}`);
    }
    
    if (strategies.length > 0) {
      const bestStrategy = strategies[0];
      insights.push(`Best performing strategy: ${bestStrategy.strategy} (${(bestStrategy.winRate * 100).toFixed(1)}%)`);
    }
    
    if (risk.positionSizing === 'conservative') {
      insights.push('Conservative risk management approach');
    }
    
    return insights;
  }

  private generateRecommendations(performance: PerformanceMetrics, strategies: StrategyBreakdown[], risk: RiskMetrics): string[] {
    const recommendations = [];
    
    if (performance.winRate < 0.5) {
      recommendations.push('Focus on improving entry signals and confluence analysis');
    }
    
    if (performance.profitFactor < 1.2) {
      recommendations.push('Improve risk-reward ratios and exit strategies');
    }
    
    if (risk.adherenceToRules < 80) {
      recommendations.push('Better adherence to risk management rules needed');
    }
    
    if (strategies.length > 0) {
      const worstStrategy = strategies[strategies.length - 1];
      if (worstStrategy.winRate < 0.4) {
        recommendations.push(`Consider reducing or eliminating ${worstStrategy.strategy} strategy`);
      }
    }
    
    return recommendations;
  }
}

export const tradeJournalIntegration = new TradeJournalIntegration();