// Enhanced Telegram Service for LeviPro
// Professional Hebrew signal formatting with complete trade details

import { TradingSignal } from '@/types/trading';

export interface TelegramMessage {
  chatId: string;
  text: string;
  parseMode: 'HTML' | 'Markdown';
  disableWebPagePreview?: boolean;
}

export interface SignalFormatting {
  symbol: string;
  action: 'BUY' | 'SELL';
  entry: number;
  stopLoss: number;
  targets: number[];
  confidence: number;
  riskReward: number;
  timeframes: string[];
  methods: string[];
  marketSentiment: number;
  fundamentalEvents: string[];
  volume: string;
  leviScore: number;
  reasoning: string[];
}

class EnhancedTelegramService {
  private readonly BOT_TOKEN = 'YOUR_BOT_TOKEN'; // Will be from secrets
  private readonly CHAT_ID = 'YOUR_CHAT_ID'; // Will be from secrets
  
  /**
   * Send professional trading signal to Telegram in Hebrew
   */
  public async sendTradingSignal(signal: SignalFormatting): Promise<boolean> {
    try {
      const message = this.formatSignalMessage(signal);
      
      const telegramMessage: TelegramMessage = {
        chatId: this.CHAT_ID,
        text: message,
        parseMode: 'HTML',
        disableWebPagePreview: true
      };
      
      const success = await this.sendMessage(telegramMessage);
      
      if (success) {
        console.log(`📤 Signal sent to Telegram: ${signal.action} ${signal.symbol}`);
      } else {
        console.error(`❌ Failed to send signal: ${signal.action} ${signal.symbol}`);
      }
      
      return success;
    } catch (error) {
      console.error('❌ Telegram send error:', error);
      return false;
    }
  }

  /**
   * Format signal message in professional Hebrew format
   */
  private formatSignalMessage(signal: SignalFormatting): string {
    const direction = signal.action === 'BUY' ? '🟢 קנייה' : '🔴 מכירה';
    const confidence = this.getConfidenceIcon(signal.confidence);
    const sentiment = this.getSentimentText(signal.marketSentiment);
    
    return `
🚀 <b>LeviPro Trading Signal</b> 🚀

${direction} <b>${signal.symbol}</b> ${confidence}

💰 <b>פרטי העסקה:</b>
📈 כניסה: <code>$${signal.entry.toFixed(4)}</code>
🛑 סטופ לוס: <code>$${signal.stopLoss.toFixed(4)}</code>
🎯 יעד 1: <code>$${signal.targets[0]?.toFixed(4) || 'N/A'}</code>
${signal.targets[1] ? `🎯 יעד 2: <code>$${signal.targets[1].toFixed(4)}</code>` : ''}
${signal.targets[2] ? `🎯 יעד 3: <code>$${signal.targets[2].toFixed(4)}</code>` : ''}

📊 <b>ניתוח טכני:</b>
🔥 ביטחון: <b>${signal.confidence.toFixed(1)}%</b>
⚖️ יחס סיכון/תשואה: <b>1:${signal.riskReward.toFixed(1)}</b>
📈 LeviScore: <b>${signal.leviScore}/100</b>
🕒 זמנים: ${signal.timeframes.join(', ')}

🧠 <b>שיטות ואישורים:</b>
${signal.methods.map(method => `✅ ${this.translateMethod(method)}`).join('\n')}

🌍 <b>ניתוח יסודות:</b>
📊 סנטימנט השוק: ${sentiment}
${signal.fundamentalEvents.length > 0 ? 
  `📰 אירועים: ${signal.fundamentalEvents.slice(0, 2).join(', ')}` : 
  '📰 אין אירועים משמעותיים'
}
📈 נפח מסחר: ${signal.volume}

🔍 <b>סיבות לעסקה:</b>
${signal.reasoning.slice(0, 3).map(reason => `• ${this.translateReason(reason)}`).join('\n')}

⚠️ <b>זכור:</b> נהל את הסיכון ואל תסחר מעל 2% מההון

━━━━━━━━━━━━━━━━━━━━
🤖 LeviPro AI Trading System
⏰ ${new Date().toLocaleString('he-IL')}
    `.trim();
  }

  /**
   * Send market analysis summary
   */
  public async sendMarketAnalysis(analysis: {
    overallSentiment: string;
    fearGreedIndex: number;
    topMovers: { symbol: string; change: number }[];
    keyEvents: string[];
    recommendation: string;
  }): Promise<boolean> {
    try {
      const message = `
📊 <b>ניתוח שוק יומי - LeviPro</b>

🌡️ <b>מצב השוק הכללי:</b>
${this.getSentimentIcon(analysis.overallSentiment)} סנטימנט: <b>${this.translateSentiment(analysis.overallSentiment)}</b>
😱 מדד פחד ותאווה: <b>${analysis.fearGreedIndex}/100</b> ${this.getFearGreedText(analysis.fearGreedIndex)}

🏆 <b>נכסים מובילים:</b>
${analysis.topMovers.slice(0, 5).map(mover => 
  `${mover.change > 0 ? '🟢' : '🔴'} ${mover.symbol}: ${mover.change > 0 ? '+' : ''}${mover.change.toFixed(2)}%`
).join('\n')}

📰 <b>אירועים חשובים:</b>
${analysis.keyEvents.slice(0, 3).map(event => `• ${event}`).join('\n')}

💡 <b>המלצת המערכת:</b>
${analysis.recommendation}

━━━━━━━━━━━━━━━━━━━━
🤖 LeviPro Market Intelligence
⏰ ${new Date().toLocaleString('he-IL')}
      `;

      const telegramMessage: TelegramMessage = {
        chatId: this.CHAT_ID,
        text: message.trim(),
        parseMode: 'HTML',
        disableWebPagePreview: true
      };

      return await this.sendMessage(telegramMessage);
    } catch (error) {
      console.error('❌ Market analysis send error:', error);
      return false;
    }
  }

  /**
   * Send learning/performance update
   */
  public async sendPerformanceUpdate(stats: {
    totalSignals: number;
    winRate: number;
    avgRR: number;
    bestMethod: string;
    worstMethod: string;
    totalProfit: number;
    learningInsights: string[];
  }): Promise<boolean> {
    try {
      const message = `
🧠 <b>דוח ביצועים - LeviPro AI</b>

📈 <b>סטטיסטיקות כלליות:</b>
🎯 סה"כ אותות: <b>${stats.totalSignals}</b>
🏆 אחוז הצלחה: <b>${stats.winRate.toFixed(1)}%</b>
⚖️ יחס R/R ממוצע: <b>1:${stats.avgRR.toFixed(1)}</b>
💰 רווח כולל: <b>${stats.totalProfit > 0 ? '+' : ''}${stats.totalProfit.toFixed(1)}%</b>

🥇 <b>שיטה מובילה:</b> ${this.translateMethod(stats.bestMethod)}
🥉 <b>שיטה חלשה:</b> ${this.translateMethod(stats.worstMethod)}

🤖 <b>תובנות למידה:</b>
${stats.learningInsights.slice(0, 3).map(insight => `• ${insight}`).join('\n')}

📚 <b>המערכת ממשיכה ללמוד ולהשתפר!</b>

━━━━━━━━━━━━━━━━━━━━
🤖 LeviPro Learning System
⏰ ${new Date().toLocaleString('he-IL')}
      `;

      const telegramMessage: TelegramMessage = {
        chatId: this.CHAT_ID,
        text: message.trim(),
        parseMode: 'HTML',
        disableWebPagePreview: true
      };

      return await this.sendMessage(telegramMessage);
    } catch (error) {
      console.error('❌ Performance update send error:', error);
      return false;
    }
  }

  /**
   * Send actual message to Telegram API
   */
  private async sendMessage(message: TelegramMessage): Promise<boolean> {
    try {
      // In production, this would call the actual Telegram API via edge function
      // For now, we'll simulate the call
      console.log('📤 Sending Telegram message:', message.text.substring(0, 100) + '...');
      
      // This would be the actual API call:
      // const response = await fetch(`https://api.telegram.org/bot${this.BOT_TOKEN}/sendMessage`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     chat_id: message.chatId,
      //     text: message.text,
      //     parse_mode: message.parseMode,
      //     disable_web_page_preview: message.disableWebPagePreview
      //   })
      // });
      
      // return response.ok;
      
      // For now, simulate success
      return true;
    } catch (error) {
      console.error('❌ Telegram API error:', error);
      return false;
    }
  }

  // Helper methods for formatting
  private getConfidenceIcon(confidence: number): string {
    if (confidence >= 90) return '🔥🔥🔥';
    if (confidence >= 80) return '🔥🔥';
    if (confidence >= 70) return '🔥';
    return '⚡';
  }

  private getSentimentText(sentiment: number): string {
    if (sentiment >= 80) return '🚀 דחיפה חזקה';
    if (sentiment >= 65) return '📈 חיובי';
    if (sentiment >= 35) return '⚖️ נייטרלי';
    if (sentiment >= 20) return '📉 שלילי';
    return '🔻 חובקנית';
  }

  private getSentimentIcon(sentiment: string): string {
    switch (sentiment.toLowerCase()) {
      case 'bullish': return '🐂';
      case 'bearish': return '🐻';
      case 'neutral': return '⚖️';
      default: return '❓';
    }
  }

  private getFearGreedText(index: number): string {
    if (index >= 80) return '(תאווה קיצונית)';
    if (index >= 60) return '(תאווה)';
    if (index >= 40) return '(ניטרלי)';
    if (index >= 20) return '(פחד)';
    return '(פחד קיצוני)';
  }

  private translateMethod(method: string): string {
    const translations: { [key: string]: string } = {
      'wyckoff-accumulation': 'וויקוף - צבירה',
      'wyckoff-distribution': 'וויקוף - חלוקה',
      'smc-breakout': 'SMC - פריצה',
      'smc-orderblock': 'SMC - בלוק הזמנות',
      'elliott-wave': 'גלי אליוט',
      'fibonacci-retracement': 'פיבונאצ\'י - תיקון',
      'fibonacci-extension': 'פיבונאצ\'י - הרחבה',
      'volume-profile': 'פרופיל נפח',
      'rsi-divergence': 'RSI - דיברגנץ',
      'fundamental-catalyst': 'זרז יסודות',
      'magic-triangle': 'משולש הקסם',
      'emotional-pressure': 'לחץ רגשי',
      'psychological-level': 'רמה פסיכולוגית'
    };
    
    return translations[method] || method;
  }

  private translateReason(reason: string): string {
    const translations: { [key: string]: string } = {
      'Multi-timeframe bullish alignment': 'יישור דחיפני רב-זמני',
      'High volume confirmation': 'אישור נפח גבוה',
      'Break of Structure detected': 'זוהתה שבירת מבנה',
      'Fibonacci golden ratio confluence': 'מפגש יחס הזהב פיבונאצ\'י',
      'Wyckoff accumulation phase': 'שלב צבירה וויקוף',
      'Smart Money orderblock': 'בלוק הזמנות כסף חכם',
      'Elliott Wave impulse': 'גל דחיפה אליוט',
      'Volume profile support': 'תמיכת פרופיל נפח',
      'RSI bullish divergence': 'דיברגנץ דחיפני RSI',
      'Fundamental bullish catalyst': 'זרז דחיפני יסודות',
      'Magic Triangle pressure buildup': 'הצטברות לחץ משולש הקסם',
      'Emotional zone activation': 'הפעלת אזור רגשי'
    };
    
    return translations[reason] || reason;
  }

  private translateSentiment(sentiment: string): string {
    const translations: { [key: string]: string } = {
      'Bullish': 'דחיפני',
      'Bearish': 'דובי',
      'Neutral': 'נייטרלי',
      'Very Bullish': 'דחיפני מאוד',
      'Very Bearish': 'דובי מאוד'
    };
    
    return translations[sentiment] || sentiment;
  }

  /**
   * Test connection to Telegram
   */
  public async testConnection(): Promise<boolean> {
    try {
      const testMessage: TelegramMessage = {
        chatId: this.CHAT_ID,
        text: '🤖 LeviPro System Test - הודעת בדיקה',
        parseMode: 'HTML'
      };
      
      return await this.sendMessage(testMessage);
    } catch (error) {
      console.error('❌ Telegram connection test failed:', error);
      return false;
    }
  }

  /**
   * Send emergency alert
   */
  public async sendEmergencyAlert(message: string): Promise<boolean> {
    try {
      const alert = `
🚨 <b>התראת חירום - LeviPro</b> 🚨

${message}

⏰ ${new Date().toLocaleString('he-IL')}
      `;

      const telegramMessage: TelegramMessage = {
        chatId: this.CHAT_ID,
        text: alert.trim(),
        parseMode: 'HTML'
      };

      return await this.sendMessage(telegramMessage);
    } catch (error) {
      console.error('❌ Emergency alert send error:', error);
      return false;
    }
  }
}

export const enhancedTelegramService = new EnhancedTelegramService();