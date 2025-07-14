// Advanced Rejection Logging and Analysis System
// This service tracks all signal rejections with detailed reasons for learning

import { supabase } from '@/integrations/supabase/client';

export interface RejectionReason {
  id: string;
  timestamp: number;
  symbol: string;
  strategy: string;
  reason: string;
  category: 'confidence' | 'heat' | 'riskReward' | 'timeframe' | 'cooldown' | 'volume' | 'fundamental';
  threshold: number;
  actual: number;
  severity: 'low' | 'medium' | 'high';
  marketConditions?: any;
  fundamentalEvents?: any[];
}

export interface RejectionAnalytics {
  totalRejections: number;
  rejectionsByCategory: Record<string, number>;
  rejectionsBySymbol: Record<string, number>;
  rejectionsByStrategy: Record<string, number>;
  topRejectionReasons: Array<{ reason: string; count: number; percentage: number }>;
  recentRejections: RejectionReason[];
  rejectionTrends: {
    hourly: number[];
    daily: number[];
  };
  suggestions: string[];
}

class RejectionLogger {
  private rejections: RejectionReason[] = [];
  private maxStoredRejections = 5000; // Keep last 5000 rejections in memory

  public async logRejection(rejection: Omit<RejectionReason, 'id' | 'timestamp'>): Promise<void> {
    const fullRejection: RejectionReason = {
      ...rejection,
      id: `rej_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now()
    };

    // Add to memory
    this.rejections.unshift(fullRejection);

    // Keep only recent rejections in memory
    if (this.rejections.length > this.maxStoredRejections) {
      this.rejections = this.rejections.slice(0, this.maxStoredRejections);
    }

    // Log to database for persistence
    await this.logToDatabase(fullRejection);

    // Console log for immediate debugging
    console.log(`❌ Signal Rejected [${fullRejection.category.toUpperCase()}]: ${fullRejection.symbol} - ${fullRejection.reason}`);
    console.log(`   Expected: ${fullRejection.threshold}, Actual: ${fullRejection.actual}`);

    // Dispatch event for real-time UI updates
    window.dispatchEvent(new CustomEvent('signal-rejected', { 
      detail: fullRejection 
    }));
  }

  private async logToDatabase(rejection: RejectionReason): Promise<void> {
    try {
      const { error } = await supabase
        .from('signal_feedback')
        .insert({
          signal_id: rejection.id,
          strategy_used: rejection.strategy,
          outcome: 'rejected',
          profit_loss_percentage: 0,
          execution_time: new Date(rejection.timestamp).toISOString(),
          market_conditions: JSON.stringify({
            symbol: rejection.symbol,
            category: rejection.category,
            reason: rejection.reason,
            threshold: rejection.threshold,
            actual: rejection.actual,
            severity: rejection.severity,
            marketConditions: rejection.marketConditions,
            fundamentalEvents: rejection.fundamentalEvents
          }),
          user_id: 'system' // System rejections
        });

      if (error) {
        console.warn('Failed to log rejection to database:', error);
      }
    } catch (error) {
      console.warn('Error logging rejection to database:', error);
    }
  }

  public getRecentRejections(limit: number = 50): RejectionReason[] {
    return this.rejections.slice(0, limit);
  }

  public getRejectionsBySymbol(symbol: string, limit: number = 20): RejectionReason[] {
    return this.rejections
      .filter(r => r.symbol === symbol)
      .slice(0, limit);
  }

  public getRejectionsByCategory(category: string): RejectionReason[] {
    return this.rejections.filter(r => r.category === category);
  }

  public getAnalytics(): RejectionAnalytics {
    const total = this.rejections.length;
    
    // Count by category
    const byCategory: Record<string, number> = {};
    const bySymbol: Record<string, number> = {};
    const byStrategy: Record<string, number> = {};
    const reasonCounts: Record<string, number> = {};

    this.rejections.forEach(r => {
      byCategory[r.category] = (byCategory[r.category] || 0) + 1;
      bySymbol[r.symbol] = (bySymbol[r.symbol] || 0) + 1;
      byStrategy[r.strategy] = (byStrategy[r.strategy] || 0) + 1;
      reasonCounts[r.reason] = (reasonCounts[r.reason] || 0) + 1;
    });

    // Top rejection reasons
    const topReasons = Object.entries(reasonCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([reason, count]) => ({
        reason,
        count,
        percentage: total > 0 ? (count / total) * 100 : 0
      }));

    // Generate hourly and daily trends
    const now = Date.now();
    const hourly = new Array(24).fill(0);
    const daily = new Array(7).fill(0);

    this.rejections.forEach(r => {
      const age = now - r.timestamp;
      const hoursAgo = Math.floor(age / (1000 * 60 * 60));
      const daysAgo = Math.floor(age / (1000 * 60 * 60 * 24));

      if (hoursAgo < 24) {
        hourly[23 - hoursAgo]++;
      }
      if (daysAgo < 7) {
        daily[6 - daysAgo]++;
      }
    });

    // Generate improvement suggestions
    const suggestions = this.generateSuggestions(byCategory, topReasons);

    return {
      totalRejections: total,
      rejectionsByCategory: byCategory,
      rejectionsBySymbol: bySymbol,
      rejectionsByStrategy: byStrategy,
      topRejectionReasons: topReasons,
      recentRejections: this.getRecentRejections(20),
      rejectionTrends: {
        hourly,
        daily
      },
      suggestions
    };
  }

  private generateSuggestions(byCategory: Record<string, number>, topReasons: Array<{ reason: string; count: number }>): string[] {
    const suggestions: string[] = [];
    const total = this.rejections.length;

    if (total === 0) {
      return ['No rejections recorded yet. System is operating optimally.'];
    }

    // Analyze top rejection categories
    const topCategory = Object.entries(byCategory)
      .sort(([,a], [,b]) => b - a)[0];

    if (topCategory) {
      const [category, count] = topCategory;
      const percentage = (count / total) * 100;

      if (percentage > 50) {
        switch (category) {
          case 'confidence':
            suggestions.push(`${percentage.toFixed(1)}% of rejections are due to low confidence. Consider lowering confidence threshold temporarily.`);
            break;
          case 'heat':
            suggestions.push(`${percentage.toFixed(1)}% of rejections are due to low heat. Market may be in low volatility period.`);
            break;
          case 'riskReward':
            suggestions.push(`${percentage.toFixed(1)}% of rejections are due to poor risk/reward ratio. Consider adjusting R/R threshold.`);
            break;
          case 'timeframe':
            suggestions.push(`${percentage.toFixed(1)}% of rejections are due to timeframe misalignment. Multi-timeframe analysis may need tuning.`);
            break;
          case 'volume':
            suggestions.push(`${percentage.toFixed(1)}% of rejections are due to low volume. Market liquidity may be insufficient.`);
            break;
        }
      }
    }

    // Analyze recent trends
    const recentRejections = this.rejections.slice(0, 100);
    const recentHour = recentRejections.filter(r => Date.now() - r.timestamp < 3600000);
    
    if (recentHour.length > 20) {
      suggestions.push(`High rejection rate in the last hour (${recentHour.length}). Consider pausing analysis temporarily.`);
    }

    // Symbol-specific suggestions
    const symbolCounts = Object.entries(this.rejections.reduce((acc, r) => {
      acc[r.symbol] = (acc[r.symbol] || 0) + 1;
      return acc;
    }, {} as Record<string, number>))
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3);

    if (symbolCounts.length > 0 && symbolCounts[0][1] > total * 0.2) {
      suggestions.push(`${symbolCounts[0][0]} has the highest rejection rate (${((symbolCounts[0][1] / total) * 100).toFixed(1)}%). Consider excluding temporarily.`);
    }

    // Strategy-specific suggestions
    const strategyCounts = Object.entries(byCategory);
    if (strategyCounts.some(([,count]) => count > total * 0.8)) {
      suggestions.push('Single rejection category dominates. Consider broadening analysis criteria.');
    }

    if (suggestions.length === 0) {
      suggestions.push('Rejection pattern appears normal. Continue monitoring for trends.');
    }

    return suggestions;
  }

  public clearOldRejections(olderThanHours: number = 24): void {
    const cutoff = Date.now() - (olderThanHours * 60 * 60 * 1000);
    const initialCount = this.rejections.length;
    
    this.rejections = this.rejections.filter(r => r.timestamp > cutoff);
    
    const removed = initialCount - this.rejections.length;
    if (removed > 0) {
      console.log(`🧹 Cleared ${removed} old rejection logs (older than ${olderThanHours}h)`);
    }
  }

  public exportRejections(): string {
    const headers = ['Timestamp', 'Symbol', 'Strategy', 'Category', 'Reason', 'Threshold', 'Actual', 'Severity'];
    const rows = this.rejections.map(r => [
      new Date(r.timestamp).toISOString(),
      r.symbol,
      r.strategy,
      r.category,
      r.reason,
      r.threshold.toString(),
      r.actual.toString(),
      r.severity
    ]);

    return [headers, ...rows].map(row => row.join(',')).join('\n');
  }
}

// Export singleton instance
export const rejectionLogger = new RejectionLogger();

// Auto-cleanup old rejections every hour
setInterval(() => {
  rejectionLogger.clearOldRejections(48); // Keep 48 hours of data
}, 3600000); // Every hour
