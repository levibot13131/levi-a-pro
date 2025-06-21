
import { TradingSignal } from '@/types/trading';

export interface ProfessionalTelegramMessage {
  text: string;
  parseMode: 'Markdown' | 'HTML';
}

export class ProfessionalTelegramFormatter {
  
  public formatEliteSignal(signal: TradingSignal): ProfessionalTelegramMessage {
    const israelTime = new Date().toLocaleString('he-IL', {
      timeZone: 'Asia/Jerusalem',
      hour12: false,
      hour: '2-digit',
      minute: '2-digit'
    });

    const action = signal.action === 'buy' ? '🟢 Buy' : '🔴 Sell';
    const strategyName = this.getStrategyDisplayName(signal.strategy);
    const timeframe = this.getTimeframe(signal);
    const confidence = Math.round(signal.confidence * 100);
    const rrRatio = signal.riskRewardRatio.toFixed(1);

    // בדיקת תקינות מחירים
    const entryPrice = this.formatPrice(signal.price);
    const stopLoss = this.formatPrice(signal.stopLoss);
    const takeProfit = this.formatPrice(signal.targetPrice);

    const message = `🔥 *LeviPro Signal* 🔥
${action} *${signal.symbol}*
*Timeframe:* ${timeframe} | *Strategy:* ${strategyName}
*Entry:* $${entryPrice} | *SL:* $${stopLoss} | *TP:* $${takeProfit}
*R/R:* 1:${rrRatio} | *Confidence:* ${confidence}%
*Sent:* ${israelTime} 🇮🇱

${this.getSignalContext(signal)}

_Powered by LeviPro AI Engine_`;

    return {
      text: message,
      parseMode: 'Markdown'
    };
  }

  private formatPrice(price: number): string {
    if (isNaN(price) || price <= 0) {
      console.error('Invalid price detected:', price);
      return '0.00';
    }

    if (price >= 1000) {
      return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    } else if (price >= 1) {
      return price.toFixed(4);
    } else {
      return price.toFixed(6);
    }
  }

  private getStrategyDisplayName(strategy: string): string {
    const strategyNames: Record<string, string> = {
      'almog-personal-method': 'Personal Elite',
      'smc-strategy': 'Smart Money',
      'wyckoff-strategy': 'Wyckoff',
      'rsi-macd-strategy': 'RSI+MACD',
      'triangle-breakout': 'Triangle Break',
      'fibonacci-strategy': 'Fibonacci',
      'elliott-wave-strategy': 'Elliott Wave',
      'volume-analysis': 'Volume Flow'
    };
    
    return strategyNames[strategy] || strategy;
  }

  private getTimeframe(signal: TradingSignal): string {
    const metadata = signal.metadata || {};
    return metadata.timeframe || '15M';
  }

  private getSignalContext(signal: TradingSignal): string {
    const metadata = signal.metadata || {};
    
    if (signal.strategy === 'almog-personal-method') {
      return `🧠 *Personal Method Trigger:*
• לחץ רגשי: ${metadata.emotionalPressure || 0}%
• מומנטום: ${metadata.momentum || 0}%
• פריצה זוהתה: ${metadata.breakout ? '✅' : '❌'}`;
    }

    if (metadata.triangleBreakout) {
      return '📈 *Triangle Breakout detected with volume confirmation*';
    }

    if (metadata.reversalPattern) {
      return '🔄 *Reversal pattern - trend change expected*';
    }

    return `📊 *${this.getStrategyDisplayName(signal.strategy)} signal confirmation*`;
  }

  public formatDailyReport(stats: any): ProfessionalTelegramMessage {
    const israelTime = new Date().toLocaleString('he-IL', {
      timeZone: 'Asia/Jerusalem',
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const message = `📊 *LeviPro Daily Report*
📅 ${israelTime}

🎯 *Yesterday's Performance:*
• Total Signals: ${stats.totalSignals || 0}
• Elite Signals: ${stats.eliteSignals || 0}
• Win Rate: ${stats.winRate || 0}%
• P/L: ${stats.profitLoss || 0}%

🔥 *Top Performers:*
• Best Strategy: ${stats.bestStrategy || 'Personal Method'}
• Hot Asset: ${stats.hotAsset || 'BTC/USDT'}

📈 *Market Outlook:*
• Sentiment: ${stats.sentiment || 'Neutral'}
• Volatility: ${stats.volatility || 'Medium'}

🧠 _AI continuously learning and optimizing_
_Next analysis in 1 hour_`;

    return {
      text: message,
      parseMode: 'Markdown'
    };
  }
}

export const professionalTelegramFormatter = new ProfessionalTelegramFormatter();
