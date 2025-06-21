
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
      console.log('📱 Sending LIVE signal to Telegram:', signal.symbol, signal.action);
      
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
    const actionEmoji = signal.action === 'buy' ? '🟢 קנייה' : '🔴 מכירה';
    const confidenceStars = '⭐'.repeat(Math.ceil(signal.confidence * 5));
    const signalId = `${Date.now().toString().slice(-6)}${Math.random().toString(36).substr(2, 3).toUpperCase()}`;
    
    // Special formatting for Almog's personal method
    const isPersonalMethod = signal.strategy === 'almog-personal-method';
    const strategyName = isPersonalMethod ? '🧠 אסטרטגיה אישית - משולש הקסם' : this.getStrategyName(signal.strategy);
    
    const message = `
🔥 <b>LeviPro - איתות LIVE ${isPersonalMethod ? '🧠 אישי' : ''}</b> 🔥

${actionEmoji} <b>${signal.symbol}</b>

${isPersonalMethod ? '🧠 <b>אסטרטגיה אישית מופעלת!</b>' : ''}
🎯 <b>אסטרטגיה:</b> ${strategyName}
💡 <b>נימוק:</b> ${signal.reasoning}

📊 <b>פרטי עסקה:</b>
💰 מחיר כניסה: $${signal.price.toFixed(2)}
🎯 יעד רווח: $${signal.targetPrice.toFixed(2)}
🛑 סטופ לוס: $${signal.stopLoss.toFixed(2)}
⚖️ יחס R/R: 1:${signal.riskRewardRatio.toFixed(1)}

${confidenceStars} <b>ביטחון:</b> ${(signal.confidence * 100).toFixed(0)}%
🕐 <b>זמן:</b> ${new Date().toLocaleTimeString('he-IL')}
🆔 <b>מזהה:</b> ${signalId}

${isPersonalMethod ? '🔥 <b>עדיפות גבוהה - אסטרטגיה אישית!</b>' : ''}
🤖 <b>LeviPro LIVE Engine</b>
#TradingSignal #${signal.symbol} #LeviPro ${isPersonalMethod ? '#PersonalMethod' : ''}
`;

    return message;
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
      'candlestick-strategy': 'Candlestick Patterns'
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

  public async sendStartupMessage(): Promise<boolean> {
    const message = `
🚀 <b>LeviPro מערכת LIVE הופעלה!</b>

✅ מנוע איתותים: פועל בזמן אמת
🧠 אסטרטגיה אישית: 80% עדיפות קבועה
📊 8 אסטרטגיות מתקדמות: פעילות
🛡️ ניהול סיכונים: 2% מקסימום
📡 נתונים LIVE: Binance + CoinGecko

🎯 המערכת מוכנה לשליחת איתותים אמיתיים!

🕐 זמן: ${new Date().toLocaleString('he-IL')}
#LeviPro #LIVE #SystemReady
`;

    return await this.sendMessage(message);
  }

  public async sendTestMessage(): Promise<boolean> {
    const testMessage = `
🧪 <b>בדיקת חיבור LeviPro LIVE</b>

✅ הבוט מחובר ופועל תקין
🤖 מערכת LIVE פעילה
🧠 אסטרטגיה אישית: מוכנה
🕐 זמן: ${new Date().toLocaleString('he-IL')}

🎯 מערכת המסחר LIVE מוכנה לפעולה!

#LeviPro #Test #LIVE
`;

    try {
      const success = await this.sendMessage(testMessage);
      if (success) {
        toast.success('✅ הודעת בדיקה LIVE נשלחה בהצלחה לטלגרם');
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

  public getConnectionStatus(): { connected: boolean; chatId: string } {
    return {
      connected: !!this.config.botToken && !!this.config.chatId,
      chatId: this.config.chatId
    };
  }
}

export const telegramBot = new TelegramBot();
