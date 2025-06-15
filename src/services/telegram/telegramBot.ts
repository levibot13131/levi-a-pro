
import { TradingSignal } from '@/types/trading';
import { toast } from 'sonner';

// Your specific bot credentials
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
  }

  public async sendSignal(signal: TradingSignal): Promise<boolean> {
    try {
      const message = this.formatAdvancedSignalMessage(signal);
      const response = await this.sendMessage(message);
      
      if (response) {
        toast.success('🎯 איתות נשלח לטלגרם בהצלחה');
        return true;
      } else {
        toast.error('❌ שגיאה בשליחת איתות לטלגרם');
        return false;
      }
    } catch (error) {
      console.error('Error sending signal to Telegram:', error);
      toast.error('❌ שגיאה בשליחת איתות לטלגרם');
      return false;
    }
  }

  private formatAdvancedSignalMessage(signal: TradingSignal): string {
    const actionEmoji = signal.action === 'buy' ? '🟢 קנייה' : '🔴 מכירה';
    const confidenceStars = '⭐'.repeat(Math.ceil(signal.confidence * 5));
    const signalId = `${Date.now().toString().slice(-6)}${Math.random().toString(36).substr(2, 3).toUpperCase()}`;
    
    // Enhanced message format according to your requirements
    return `
🔥 <b>LeviPro - משולש הקסם</b> 🔥

${actionEmoji} <b>${signal.symbol}</b>

🧠 <b>שיטות מופעלות:</b> ${this.getStrategyName(signal.strategy)} + Momentum + RSI
💡 <b>סיבת כניסה:</b> ${signal.reasoning}

📊 <b>נתוני עסקה:</b>
💰 מחיר כניסה: $${signal.price.toFixed(2)}
🎯 יעד רווח: $${signal.targetPrice.toFixed(2)}
🛑 סטופ לוס: $${signal.stopLoss.toFixed(2)}
⚖️ יחס R/R: 1:${signal.riskRewardRatio.toFixed(1)}

${confidenceStars} <b>ביטחון איתות:</b> ${(signal.confidence * 100).toFixed(0)}%
🕐 <b>שעת איתות:</b> ${new Date().toLocaleTimeString('he-IL')}
🆔 <b>מזהה איתות:</b> ${signalId}

🤖 <b>מערכת אוטומטית - LeviPro</b>
#TradingSignal #${signal.symbol} #LeviPro
`;
  }

  private getStrategyName(strategyId: string): string {
    const strategyNames: Record<string, string> = {
      'personal-strategy': 'משולש הקסם האישי',
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

  public async sendMessage(message: string): Promise<boolean> {
    try {
      console.log('🚀 Sending message to Telegram via cloud API...');
      
      // Direct API call without proxy - works in cloud deployment
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
        console.log('✅ Message sent successfully to Telegram');
        return true;
      } else {
        console.error('❌ Telegram API error:', result);
        return false;
      }
    } catch (error) {
      console.error('❌ Error sending Telegram message:', error);
      return false;
    }
  }

  public async sendTestMessage(): Promise<boolean> {
    const testMessage = `
🧪 <b>בדיקת חיבור LeviPro</b>

✅ הבוט מחובר ופועל תקין בענן
🤖 מערכת אוטומטית פעילה
🕐 זמן: ${new Date().toLocaleString('he-IL')}
🆔 מזהה בדיקה: TEST${Date.now().toString().slice(-4)}

🎯 מערכת המסחר האוטומטי מוכנה לפעולה!

#LeviPro #Test #CloudReady
`;

    try {
      const success = await this.sendMessage(testMessage);
      if (success) {
        toast.success('✅ הודעת בדיקה נשלחה בהצלחה לטלגרם');
      } else {
        toast.error('❌ שגיאה בשליחת הודעת בדיקה');
      }
      return success;
    } catch (error) {
      console.error('Error sending test message:', error);
      toast.error('❌ שגיאה בשליחת הודעת בדיקה');
      return false;
    }
  }

  public async sendSignalDemo(): Promise<boolean> {
    const demoSignal: TradingSignal = {
      id: `demo-${Date.now()}`,
      symbol: 'BTCUSDT',
      strategy: 'personal-strategy',
      action: 'buy',
      price: 63240,
      targetPrice: 65100,
      stopLoss: 62450,
      confidence: 0.87,
      riskRewardRatio: 2.3,
      reasoning: 'פריצה מעל אזור התנגדות + RSI מעל 55 + נר engulfing + נפח גבוה',
      timestamp: Date.now(),
      status: 'active',
      telegramSent: false,
      metadata: {
        strategies: ['Wyckoff', 'Momentum', 'RSI'],
        volume_spike: true,
        resistance_break: true,
        demo: true
      }
    };

    return await this.sendSignal(demoSignal);
  }

  public getConnectionStatus(): { connected: boolean; chatId: string } {
    return {
      connected: !!this.config.botToken && !!this.config.chatId,
      chatId: this.config.chatId
    };
  }
}

export const telegramBot = new TelegramBot();
