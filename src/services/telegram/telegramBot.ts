
import { TradingSignal } from '@/types/trading';
import { toast } from 'sonner';

// Your specific bot credentials - LIVE PRODUCTION VALUES
const TELEGRAM_BOT_TOKEN = '7607389220:AAHSUnDPTR_9iQEmMjZkSy5i0kepBotAUbA';
const TELEGRAM_CHAT_ID = '809305569';
const TELEGRAM_API_URL = 'https://api.telegram.org/bot';

interface TelegramConfig {
  botToken: string;
  chatId: string;
}

export class TelegramBot {
  private config: TelegramConfig;

  constructor() {
    this.config = {
      botToken: TELEGRAM_BOT_TOKEN,
      chatId: TELEGRAM_CHAT_ID
    };
    
    console.log('📱 Telegram Bot initialized for LIVE signals');
    console.log('🎯 Chat ID:', TELEGRAM_CHAT_ID);
  }

  public async sendSignal(signal: TradingSignal): Promise<boolean> {
    try {
      console.log('📱 Sending LIVE signal to Telegram:', signal.symbol, signal.action, `Price: $${signal.price?.toFixed(2) || 'N/A'}`);
      
      const message = this.formatLiveSignalMessage(signal);
      const response = await this.sendMessage(message);
      
      if (response) {
        console.log('✅ LIVE signal sent to Telegram successfully');
        toast.success('🎯 איתות LIVE נשלח לטלגרם בהצלחה');
        return true;
      } else {
        console.error('❌ Failed to send LIVE signal to Telegram');
        toast.error('❌ שגיאה בשליחת איתות לטלגרם');
        return false;
      }
    } catch (error) {
      console.error('❌ Error sending LIVE signal to Telegram:', error);
      toast.error('❌ שגיאה בשליחת איתות לטלגרם');
      return false;
    }
  }

  private formatLiveSignalMessage(signal: TradingSignal): string {
    const actionEmoji = signal.action === 'buy' ? '🟢 LONG' : '🔴 SHORT';
    const confidenceStars = '⭐'.repeat(Math.ceil(signal.confidence * 5));
    const signalId = `${Date.now().toString().slice(-6)}${Math.random().toString(36).substr(2, 3).toUpperCase()}`;
    
    // Validate and format prices with proper error handling
    const entryPrice = this.validateAndFormatPrice(signal.price, 'Entry');
    const targetPrice = this.validateAndFormatPrice(signal.targetPrice, 'Target');
    const stopLoss = this.validateAndFormatPrice(signal.stopLoss, 'StopLoss');
    
    // Calculate R/R ratio safely
    const riskAmount = Math.abs(signal.price - signal.stopLoss);
    const rewardAmount = Math.abs(signal.targetPrice - signal.price);
    const riskRewardRatio = riskAmount > 0 && !isNaN(riskAmount) ? rewardAmount / riskAmount : signal.riskRewardRatio || 1.5;
    
    // Get timeframe from metadata
    const timeframe = signal.metadata?.timeframe || '15M';
    const signalCategory = signal.metadata?.signalCategory || 'טכני';
    
    // Special formatting for Almog's personal method
    const isPersonalMethod = signal.strategy === 'almog-personal-method';
    const strategyName = isPersonalMethod ? '🧠 LeviPro Method - Triangle Magic' : this.getStrategyName(signal.strategy);
    
    // Format current time in Israel timezone
    const israelTime = new Date().toLocaleString('he-IL', {
      timeZone: 'Asia/Jerusalem',
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit'
    });
    
    const message = `
🔥 <b>LeviPro - איתות LIVE ${isPersonalMethod ? '🧠 אישי' : ''}</b> 🔥

${actionEmoji} <b>${signal.symbol.replace('USDT', '/USDT')}</b>

${isPersonalMethod ? '🧠 <b>LeviPro Method מופעל!</b>' : ''}
🎯 <b>אסטרטגיה:</b> ${strategyName}
📊 <b>גרף:</b> ${timeframe}
🏷️ <b>סוג:</b> ${signalCategory}
💡 <b>נימוק:</b> ${signal.reasoning}

📊 <b>פרטי עסקה:</b>
💰 מחיר כניסה: ${entryPrice}
🎯 יעד רווח: ${targetPrice}
🛑 סטופ לוס: ${stopLoss}
⚖️ יחס R/R: 1:${riskRewardRatio.toFixed(1)}

${confidenceStars} <b>ביטחון:</b> ${(signal.confidence * 100).toFixed(0)}%
🕐 <b>זמן (ישראל):</b> ${israelTime}
🆔 <b>מזהה:</b> ${signalId}

${isPersonalMethod ? '🔥 <b>עדיפות גבוהה - LeviPro Method!</b>' : ''}
🤖 <b>LeviPro LIVE Engine</b>
#TradingSignal #${signal.symbol} #LeviPro ${isPersonalMethod ? '#LeviProMethod' : ''}
`;

    return message;
  }

  private validateAndFormatPrice(price: number, type: string): string {
    if (isNaN(price) || price <= 0) {
      console.error(`❌ Invalid ${type} price: ${price}`);
      return '$0.00 (שגיאה)';
    }
    
    // Format with proper currency formatting
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 6
    }).format(price);
  }

  private getStrategyName(strategyId: string): string {
    const strategyNames: Record<string, string> = {
      'almog-personal-method': '🧠 אסטרטגיה אישית - משולש הקסם',
      'rsi-macd-strategy': 'RSI + MACD',
      'vwap-strategy': 'VWAP + Volume Profile',
      'smc-strategy': 'Smart Money Concepts',
      'wyckoff-strategy': 'Wyckoff Method',
      'elliott-wave-strategy': 'Elliott Wave Theory',
      'fibonacci-strategy': 'Fibonacci Retracement',
      'candlestick-strategy': 'Candlestick Patterns',
      'triangle-breakout': 'Triangle Breakout',
      'volume-analysis': 'Volume Analysis'
    };
    
    return strategyNames[strategyId] || strategyId;
  }

  public async sendMessage(message: string): Promise<boolean> {
    try {
      console.log('📱 Sending message to Telegram LIVE API...');
      
      const response = await fetch(`${TELEGRAM_API_URL}${this.config.botToken}/sendMessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: this.config.chatId,
          text: message,
          parse_mode: 'HTML',
          disable_web_page_preview: true
        })
      });

      const result = await response.json();
      
      if (result.ok) {
        console.log('✅ LIVE message sent successfully to Telegram');
        return true;
      } else {
        console.error('❌ Telegram API error:', result);
        return false;
      }
    } catch (error) {
      console.error('❌ Error sending LIVE Telegram message:', error);
      return false;
    }
  }

  public async sendDailyReport(stats: any): Promise<boolean> {
    const israelTime = new Date().toLocaleString('he-IL', {
      timeZone: 'Asia/Jerusalem',
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const message = `
🌅 <b>דו"ח יומי LeviPro</b> 🌅
📅 ${israelTime}

📊 <b>סטטיסטיקות היום:</b>
• איתותים נשלחו: ${stats.dailySignalCount || 0}
• סשן נוכחי: ${stats.sessionSignalsCount || 0}/3
• הפסד יומי: ${(stats.dailyLoss || 0).toFixed(1)}%/5%

🧠 <b>LeviPro Method:</b> פעיל ומופעל
🎯 <b>עדיפות:</b> 80% קבועה
⚖️ <b>ניהול סיכונים:</b> פעיל

🤖 המערכת ממשיכה לנטר את השווקים...

#LeviPro #DailyReport #TradingBot
`;

    return await this.sendMessage(message);
  }

  public getConnectionStatus() {
    return {
      connected: true,
      botToken: this.config.botToken ? 'configured' : 'missing',
      chatId: this.config.chatId ? 'configured' : 'missing'
    };
  }
}

export const telegramBot = new TelegramBot();
