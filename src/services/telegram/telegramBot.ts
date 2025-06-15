
import { TradingSignal } from '@/types/trading';
import { toast } from 'sonner';

const TELEGRAM_BOT_TOKEN = '@mytrsdingbot'; // Your bot username
const TELEGRAM_CHAT_ID = '809305569'; // Your chat ID
const TELEGRAM_API_URL = 'https://api.telegram.org/bot';

interface TelegramConfig {
  botToken: string;
  chatId: string;
}

export class TelegramBot {
  private config: TelegramConfig | null = null;

  constructor() {
    this.loadConfig();
  }

  private loadConfig() {
    // In production, these should come from Supabase secrets
    // For now, using the provided values
    this.config = {
      botToken: '', // This should be set from Supabase secrets
      chatId: TELEGRAM_CHAT_ID
    };
  }

  public async sendSignal(signal: TradingSignal): Promise<boolean> {
    if (!this.config?.botToken) {
      console.error('Telegram bot token not configured');
      toast.error('בוט טלגרם לא מוגדר - הגדר API key');
      return false;
    }

    try {
      const message = this.formatSignalMessage(signal);
      const response = await this.sendMessage(message);
      
      if (response) {
        toast.success('איתות נשלח לטלגרם בהצלחה');
        return true;
      } else {
        toast.error('שגיאה בשליחת איתות לטלגרם');
        return false;
      }
    } catch (error) {
      console.error('Error sending signal to Telegram:', error);
      toast.error('שגיאה בשליחת איתות לטלגרם');
      return false;
    }
  }

  private formatSignalMessage(signal: TradingSignal): string {
    const actionEmoji = signal.action === 'buy' ? '🟢 קנייה' : '🔴 מכירה';
    const confidenceStars = '⭐'.repeat(Math.ceil(signal.confidence * 5));
    
    return `
🤖 <b>LeviPro - איתות מסחר</b>

${actionEmoji}: <b>${signal.symbol}</b>

💰 <b>מחיר כניסה:</b> $${signal.price.toFixed(4)}
🎯 <b>יעד רווח:</b> $${signal.targetPrice.toFixed(4)}
🛑 <b>סטופ לוס:</b> $${signal.stopLoss.toFixed(4)}
⚖️ <b>יחס R/R:</b> 1:${signal.riskRewardRatio.toFixed(1)}
${confidenceStars} <b>ביטחון:</b> ${(signal.confidence * 100).toFixed(0)}%

📊 <b>אסטרטגיה:</b> ${this.getStrategyName(signal.strategy)}
💡 <b>נימוק:</b> ${signal.reasoning}

⏰ <b>זמן:</b> ${new Date(signal.timestamp).toLocaleString('he-IL')}

#LeviPro #TradingSignal #${signal.symbol}
`;
  }

  private getStrategyName(strategyId: string): string {
    const strategyNames: Record<string, string> = {
      'personal-strategy': 'האסטרטגיה האישית',
      'wyckoff-strategy': 'Wyckoff Method',
      'smc-strategy': 'Smart Money Concepts',
      'fibonacci-strategy': 'Fibonacci Retracement',
      'momentum-strategy': 'Momentum & Breakouts',
      'candlestick-strategy': 'Candlestick Patterns',
      'volume-strategy': 'Volume Profile + VWAP',
      'rsi-macd-strategy': 'RSI + MACD',
      'pattern-strategy': 'Chart Patterns'
    };
    
    return strategyNames[strategyId] || strategyId;
  }

  private async sendMessage(message: string): Promise<boolean> {
    if (!this.config?.botToken) return false;

    try {
      const response = await fetch(`${TELEGRAM_API_URL}${this.config.botToken}/sendMessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: this.config.chatId,
          text: message,
          parse_mode: 'HTML'
        })
      });

      const result = await response.json();
      return result.ok === true;
    } catch (error) {
      console.error('Error sending Telegram message:', error);
      return false;
    }
  }

  public async sendTestMessage(): Promise<boolean> {
    const testMessage = `
🧪 <b>בדיקת חיבור LeviPro</b>

✅ הבוט מחובר ופועל תקין
🕐 זמן: ${new Date().toLocaleString('he-IL')}

מערכת המסחר האוטומטי מוכנה לפעולה!

#LeviPro #Test
`;

    try {
      const success = await this.sendMessage(testMessage);
      if (success) {
        toast.success('הודעת בדיקה נשלחה בהצלחה');
      } else {
        toast.error('שגיאה בשליחת הודעת בדיקה');
      }
      return success;
    } catch (error) {
      console.error('Error sending test message:', error);
      toast.error('שגיאה בשליחת הודעת בדיקה');
      return false;
    }
  }

  public updateConfig(botToken: string, chatId?: string) {
    this.config = {
      botToken,
      chatId: chatId || this.config?.chatId || TELEGRAM_CHAT_ID
    };
  }
}

export const telegramBot = new TelegramBot();
