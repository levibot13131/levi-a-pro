
import { TradingSignal } from '@/types/trading';
import { professionalTelegramFormatter } from './professionalTelegramFormatter';
import { toast } from 'sonner';

// Your specific bot credentials - LIVE PRODUCTION VALUES
const TELEGRAM_BOT_TOKEN = '7607389220:AAHSUnDPTR_9iQEmMjZkSy5i0kepBotAUbA';
const TELEGRAM_CHAT_ID = '809305569';
const TELEGRAM_API_URL = 'https://api.telegram.org/bot';

interface TelegramConfig {
  botToken: string;
  chatId: string;
}

interface ConnectionStatus {
  connected: boolean;
  lastMessageTime?: number;
  error?: string;
}

export class TelegramBot {
  private config: TelegramConfig;
  private connectionStatus: ConnectionStatus = { connected: false };

  constructor() {
    this.config = {
      botToken: TELEGRAM_BOT_TOKEN,
      chatId: TELEGRAM_CHAT_ID
    };
    
    console.log('📱 Professional Telegram Bot initialized for Elite signals');
    console.log('🎯 Chat ID:', TELEGRAM_CHAT_ID);
  }

  public async sendSignal(signal: TradingSignal): Promise<boolean> {
    try {
      console.log('📱 Sending ELITE signal to Telegram:', signal.symbol, signal.action, `Confidence: ${(signal.confidence * 100).toFixed(1)}%`);
      
      const formattedMessage = professionalTelegramFormatter.formatEliteSignal(signal);
      const response = await this.sendMessage(formattedMessage.text, formattedMessage.parseMode);
      
      if (response) {
        console.log('✅ ELITE signal sent to Telegram successfully');
        return true;
      } else {
        console.error('❌ Failed to send ELITE signal to Telegram');
        return false;
      }
    } catch (error) {
      console.error('❌ Error sending ELITE signal to Telegram:', error);
      return false;
    }
  }

  public async sendDailyReport(stats: any): Promise<boolean> {
    try {
      console.log('📊 Sending daily report to Telegram...');
      
      const reportMessage = professionalTelegramFormatter.formatDailyReport(stats);
      const response = await this.sendMessage(reportMessage.text, reportMessage.parseMode);
      
      if (response) {
        console.log('✅ Daily report sent successfully');
        return true;
      } else {
        console.error('❌ Failed to send daily report');
        return false;
      }
    } catch (error) {
      console.error('❌ Error sending daily report:', error);
      return false;
    }
  }

  public async sendMessage(message: string, parseMode: 'Markdown' | 'HTML' = 'Markdown'): Promise<boolean> {
    try {
      const url = `${TELEGRAM_API_URL}${this.config.botToken}/sendMessage`;
      
      console.log('📱 Sending message to Telegram LIVE API...');
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: this.config.chatId,
          text: message,
          parse_mode: parseMode,
          disable_web_page_preview: true
        })
      });

      if (response.ok) {
        const result = await response.json();
        console.log('✅ LIVE message sent successfully to Telegram');
        this.connectionStatus = { connected: true, lastMessageTime: Date.now() };
        return true;
      } else {
        const errorData = await response.json();
        console.error('❌ Telegram API error:', errorData);
        this.connectionStatus = { connected: false, error: errorData.description };
        return false;
      }
    } catch (error) {
      console.error('❌ Network error sending to Telegram:', error);
      this.connectionStatus = { connected: false, error: String(error) };
      return false;
    }
  }

  public async sendTestMessage(): Promise<boolean> {
    try {
      console.log('🧪 Sending test message to Telegram...');
      
      const testMessage = `🧪 *Test Message*

✅ LeviPro Elite Signal Engine Connected
🎯 Only high-quality signals (R/R ≥ 2:1, Confidence > 80%)
🔥 Swing Trade Focus Active

_Test completed at ${new Date().toLocaleString('he-IL', { timeZone: 'Asia/Jerusalem' })} 🇮🇱_`;
      
      return await this.sendMessage(testMessage);
    } catch (error) {
      console.error('❌ Error sending test message:', error);
      return false;
    }
  }

  public async sendSignalDemo(): Promise<boolean> {
    try {
      console.log('📱 Sending demo signal to Telegram...');
      
      const demoMessage = `🔥 *LeviPro Demo Signal* 🔥
🟢 *Buy BTC/USDT*
*Timeframe:* 4H + 1D | *Strategy:* Wyckoff Spring
*Entry:* $43,250 | *SL:* $41,800 | *TP:* $46,150
*R/R:* 1:2.1 | *Confidence:* 85%
*Sent:* ${new Date().toLocaleString('he-IL', { timeZone: 'Asia/Jerusalem' })} 🇮🇱

🧠 *Reasoning:*
• Wyckoff spring pattern completed
• 4H + Daily confluence
• Volume confirmation on breakout
• RSI oversold recovery

_This is a demo signal - Powered by LeviPro AI Engine_`;
      
      return await this.sendMessage(demoMessage);
    } catch (error) {
      console.error('❌ Error sending demo signal:', error);
      return false;
    }
  }

  public getConnectionStatus(): ConnectionStatus {
    return { ...this.connectionStatus };
  }

  public async testEliteConnection(): Promise<boolean> {
    try {
      console.log('🧪 Testing Elite Telegram connection...');
      
      const testMessage = `🧪 *Elite Connection Test*

✅ LeviPro Elite Signal Engine Connected
🎯 Only high-quality swing signals (R/R ≥ 2:1, Confidence > 80%)
🔥 Personal Method Priority Active

_Test completed at ${new Date().toLocaleString('he-IL', { timeZone: 'Asia/Jerusalem' })} 🇮🇱_`;
      
      return await this.sendMessage(testMessage);
    } catch (error) {
      console.error('❌ Error testing elite connection:', error);
      return false;
    }
  }
}

export const telegramBot = new TelegramBot();
