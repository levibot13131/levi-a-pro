
export class TelegramBot {
  private botToken: string = '';
  private chatId: string = '809305569'; // Your chat ID
  private isConnected = false;

  constructor() {
    // Initialize with stored credentials or environment
    this.initializeCredentials();
  }

  private initializeCredentials() {
    // Try to get credentials from localStorage first
    const storedToken = localStorage.getItem('telegram_bot_token');
    const storedChatId = localStorage.getItem('telegram_chat_id');
    
    if (storedToken && storedChatId) {
      this.botToken = storedToken;
      this.chatId = storedChatId;
      this.isConnected = true;
      console.log('✅ Telegram bot initialized with stored credentials');
    } else {
      console.log('⚠️ No Telegram credentials found in storage');
    }
  }

  public async sendMessage(message: string): Promise<boolean> {
    if (!this.botToken || !this.chatId) {
      console.error('❌ Telegram credentials not configured');
      return false;
    }

    try {
      console.log('📱 Sending Telegram message to chat:', this.chatId);
      
      const url = `https://api.telegram.org/bot${this.botToken}/sendMessage`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: this.chatId,
          text: message,
          parse_mode: 'HTML',
          disable_web_page_preview: true
        })
      });

      const responseData = await response.json();
      
      if (response.ok && responseData.ok) {
        console.log('✅ Message sent to Telegram successfully:', responseData.result.message_id);
        return true;
      } else {
        console.error('❌ Telegram API error:', responseData);
        return false;
      }
    } catch (error) {
      console.error('❌ Failed to send Telegram message:', error);
      return false;
    }
  }

  public async sendTestMessage(): Promise<boolean> {
    const testMessage = `🧪 <b>LeviPro Test Message</b>

✅ Connection Test Successful
🔥 System Online  
📡 Signal Transmission Ready

Test sent at: ${new Date().toLocaleTimeString('he-IL')}
Chat ID: ${this.chatId}

#LeviPro #Test #ConnectionVerified`;

    return await this.sendMessage(testMessage);
  }

  public async sendSignal(signal: any): Promise<boolean> {
    try {
      const message = `🔥 <b>LeviPro Elite Signal</b>

📊 <b>${signal.symbol}</b>
${signal.action === 'buy' ? '🟢 BUY' : '🔴 SELL'} @ $${signal.price.toLocaleString()}

🎯 <b>Target:</b> $${signal.targetPrice.toLocaleString()}
🛑 <b>Stop Loss:</b> $${signal.stopLoss.toLocaleString()}
⚡ <b>Confidence:</b> ${(signal.confidence * 100).toFixed(1)}%
📈 <b>R/R:</b> 1:${signal.riskRewardRatio.toFixed(1)}

📋 <b>Strategy:</b> ${signal.strategy}
💡 <b>Reasoning:</b> ${signal.reasoning}

⏰ ${new Date().toLocaleTimeString('he-IL')}

#LeviPro #${signal.strategy} #Live`;

      const sent = await this.sendMessage(message);
      
      if (sent) {
        console.log(`✅ Elite signal sent to Telegram: ${signal.symbol} ${signal.action}`);
      } else {
        console.error(`❌ Failed to send signal to Telegram: ${signal.symbol}`);
      }
      
      return sent;
    } catch (error) {
      console.error('❌ Error sending signal to Telegram:', error);
      return false;
    }
  }

  public async testEliteConnection(): Promise<boolean> {
    const testMessage = `🧪 <b>LeviPro Elite Connection Test</b>

✅ System Online
🔥 Elite Engine Ready  
📡 Signal Transmission Active
🧠 AI Learning Loop: Operational

Bot: @mytrsdingbot
Chat ID: ${this.chatId}
Test Time: ${new Date().toLocaleTimeString('he-IL')}

#LeviPro #EliteTest #Connected`;

    const sent = await this.sendMessage(testMessage);
    
    if (sent) {
      console.log('✅ Elite connection test successful');
    } else {
      console.error('❌ Elite connection test failed');
    }
    
    return sent;
  }

  public configureTelegram(botToken: string, chatId: string): boolean {
    try {
      this.botToken = botToken.trim();
      this.chatId = chatId.trim();
      
      // Store in localStorage for persistence
      localStorage.setItem('telegram_bot_token', this.botToken);
      localStorage.setItem('telegram_chat_id', this.chatId);
      
      this.isConnected = true;
      console.log('✅ Telegram bot configured successfully');
      return true;
    } catch (error) {
      console.error('❌ Failed to configure Telegram bot:', error);
      return false;
    }
  }

  public getConnectionStatus() {
    return {
      connected: this.isConnected && !!this.botToken && !!this.chatId,
      botToken: this.botToken ? this.botToken.substring(0, 10) + '...' : 'Not set',
      chatId: this.chatId,
      lastPing: Date.now(),
      status: this.isConnected ? 'active' : 'disconnected'
    };
  }

  public disconnect() {
    this.botToken = '';
    this.chatId = '';
    this.isConnected = false;
    
    localStorage.removeItem('telegram_bot_token');
    localStorage.removeItem('telegram_chat_id');
    
    console.log('🔌 Telegram bot disconnected');
  }
}

export const telegramBot = new TelegramBot();
