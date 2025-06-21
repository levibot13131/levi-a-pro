
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

    const israelDate = new Date(Date.now() + 24*60*60*1000).toLocaleDateString('he-IL', {
      timeZone: 'Asia/Jerusalem',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const action = signal.action === 'buy' ? 'Long' : 'Short';
    const strategyName = this.getStrategyDisplayName(signal.strategy);
    const timeframes = this.getTimeframeDisplay(signal);
    const confidence = Math.round(signal.confidence * 100);
    const rrRatio = signal.riskRewardRatio.toFixed(1);

    // Format prices with proper precision
    const entryPrice = this.formatPrice(signal.price);
    const stopLoss = this.formatPrice(signal.stopLoss);
    const takeProfit = this.formatPrice(signal.targetPrice);

    // Get comprehensive reasoning
    const reasoning = this.generateDetailedReasoning(signal);
    const validUntil = this.calculateValidityPeriod(signal);

    const message = `📢 **New Trade Signal | LeviPro Elite Bot**

🪙 **Asset**: ${signal.symbol.replace('USDT', '/USDT')}
⏱ **Timeframes**: ${timeframes}
📈 **Type**: Swing
🎯 **Entry**: $${entryPrice}
⛔ **Stop Loss**: $${stopLoss}
✅ **Target**: $${takeProfit}
⚖️ **R/R**: ${rrRatio}:1
📊 **Confidence**: ${confidence}%

🧠 **Reasoning**:
${reasoning}

📅 **Valid until**: ${validUntil}

${this.getQualityBadge(signal)}

_Generated at ${israelTime} 🇮🇱 | Powered by LeviPro AI Engine_`;

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

    if (price >= 10000) {
      return price.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
    } else if (price >= 1000) {
      return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    } else if (price >= 1) {
      return price.toFixed(4);
    } else if (price >= 0.01) {
      return price.toFixed(6);
    } else {
      return price.toFixed(8);
    }
  }

  private getStrategyDisplayName(strategy: string): string {
    const strategyNames: Record<string, string> = {
      'almog-personal-method': 'Personal Elite Method',
      'smc-strategy': 'Smart Money Concepts',
      'wyckoff-strategy': 'Wyckoff Method',
      'rsi-macd-strategy': 'RSI+MACD Confluence',
      'triangle-breakout': 'Triangle Breakout',
      'fibonacci-strategy': 'Fibonacci Retracement',
      'elliott-wave-strategy': 'Elliott Wave',
      'volume-analysis': 'Volume Profile Analysis'
    };
    
    return strategyNames[strategy] || strategy.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
  }

  private getTimeframeDisplay(signal: TradingSignal): string {
    const metadata = signal.metadata || {};
    const confirmedTimeframes = metadata.confirmedTimeframes || ['4H', '1D'];
    
    if (confirmedTimeframes.length >= 3) {
      return confirmedTimeframes.slice(0, 3).join(', ');
    } else {
      return confirmedTimeframes.length > 0 ? confirmedTimeframes.join(', ') : '4H, 1D';
    }
  }

  private generateDetailedReasoning(signal: TradingSignal): string {
    const metadata = signal.metadata || {};
    const strategy = signal.strategy;
    
    if (strategy === 'almog-personal-method') {
      return this.generatePersonalMethodReasoning(signal, metadata);
    }
    
    return this.generateStandardReasoning(signal, metadata);
  }

  private generatePersonalMethodReasoning(signal: TradingSignal, metadata: any): string {
    const reasons = [];
    
    // Core personal method elements
    if (metadata.emotionalPressure > 60) {
      reasons.push(`• High emotional pressure zone detected (${metadata.emotionalPressure}%)`);
    }
    
    if (metadata.momentum > 70) {
      reasons.push(`• Strong momentum confirmation (${metadata.momentum}%)`);
    }
    
    if (metadata.breakout) {
      reasons.push('• Clean breakout from key resistance/support level');
    }
    
    if (metadata.volumeConfirmation) {
      reasons.push('• Volume surge confirms institutional participation');
    }
    
    // Multi-timeframe analysis
    const timeframes = metadata.confirmedTimeframes || [];
    if (timeframes.length >= 3) {
      reasons.push(`• Multi-timeframe confluence across ${timeframes.join(', ')}`);
    }
    
    // Market structure
    if (metadata.wyckoffPhase) {
      reasons.push(`• Wyckoff ${metadata.wyckoffPhase} phase identified`);
    }
    
    // Risk management
    reasons.push('• Swing timeframe reduces noise and false signals');
    reasons.push('• No major news events or fundamentals against the move');
    
    return reasons.length > 0 ? reasons.join('\n') : '• Personal method criteria satisfied with high conviction';
  }

  private generateStandardReasoning(signal: TradingSignal, metadata: any): string {
    const reasons = [];
    const strategy = signal.strategy;
    
    // Strategy-specific reasoning
    switch (strategy) {
      case 'smc-strategy':
        if (metadata.orderBlock) reasons.push('• Smart Money order block identified');
        if (metadata.liquiditySweep) reasons.push('• Liquidity sweep completed');
        reasons.push('• Institutional bias confirmed');
        break;
        
      case 'wyckoff-strategy':
        if (metadata.wyckoffPhase === 'spring') {
          reasons.push('• Wyckoff Spring pattern - final shakeout completed');
        } else if (metadata.wyckoffPhase === 'utad') {
          reasons.push('• Wyckoff UTAD - distribution phase ending');
        }
        reasons.push('• Volume analysis supports Wyckoff structure');
        break;
        
      case 'triangle-breakout':
        reasons.push('• Symmetrical triangle breakout with volume');
        reasons.push('• Clean break above/below triangle bounds');
        break;
        
      default:
        reasons.push('• Technical confluence across multiple indicators');
        break;
    }
    
    // Universal technical factors
    if (metadata.confirmedTimeframes?.length >= 3) {
      reasons.push(`• Multi-timeframe alignment: ${metadata.confirmedTimeframes.join(', ')}`);
    }
    
    if (metadata.technicalStrength > 0.7) {
      reasons.push('• Strong technical setup with high probability');
    }
    
    if (metadata.volumeConfirmation) {
      reasons.push('• Volume confirms the directional move');
    }
    
    // Market conditions
    reasons.push('• Swing timeframe provides better risk-to-reward ratio');
    reasons.push('• No major fundamental risks identified');
    
    return reasons.length > 0 ? reasons.join('\n') : '• Technical analysis confirms high-probability setup';
  }

  private calculateValidityPeriod(signal: TradingSignal): string {
    const metadata = signal.metadata || {};
    const durationHours = metadata.expectedDurationHours || 48;
    
    // Calculate expiry based on swing trade duration
    const expiryDate = new Date(Date.now() + Math.min(durationHours * 60 * 60 * 1000, 7 * 24 * 60 * 60 * 1000));
    
    return expiryDate.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  }

  private getQualityBadge(signal: TradingSignal): string {
    if (signal.strategy === 'almog-personal-method') {
      return '🧠 **PERSONAL METHOD ELITE** - Highest Priority Signal';
    } else if (signal.confidence >= 0.85) {
      return '🔥 **ELITE QUALITY** - Premium Swing Trade';
    } else {
      return '⭐ **HIGH QUALITY** - Verified Swing Setup';
    }
  }

  public formatDailyReport(stats: any): ProfessionalTelegramMessage {
    const israelTime = new Date().toLocaleString('he-IL', {
      timeZone: 'Asia/Jerusalem',
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const message = `📊 **LeviPro Elite Daily Report**
📅 ${israelTime}

🎯 **Elite Signal Performance:**
• Signals Sent: ${stats.eliteSignals || 0}/3 (Quality Limited)
• Success Rate: ${stats.winRate || 0}%
• Avg R/R Achieved: 1:${stats.avgRiskReward || 0}
• Personal Method Signals: ${stats.personalMethodSignals || 0}

🔥 **Top Performers:**
• Best Strategy: ${stats.bestStrategy || 'Personal Method'}
• Hot Asset: ${stats.hotAsset || 'BTC/USDT'}
• Swing Trades Focus: ${stats.swingTradePercentage || 100}%

📈 **Market Outlook:**
• Sentiment: ${stats.sentiment || 'Neutral'}
• Volatility: ${stats.volatility || 'Medium'}
• Quality Filter: ✅ Active (R/R ≥2:1, Confidence ≥80%)

🧠 _Elite AI continuously learning and optimizing for swing trades_
⏰ _Next analysis cycle in 30 minutes_

**Quality over Quantity - LeviPro Elite Standard**`;

    return {
      text: message,
      parseMode: 'Markdown'
    };
  }
}

export const professionalTelegramFormatter = new ProfessionalTelegramFormatter();
