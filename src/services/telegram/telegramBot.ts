
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
      console.log(`🔑 Bot token: ${this.botToken.substring(0, 10)}... (${this.botToken.length} chars)`);
      console.log(`💬 Chat ID: ${this.chatId}`);
    } else {
      console.log('⚠️ No Telegram credentials found in storage');
    }
  }

  public async sendMessage(message: string): Promise<boolean> {
    if (!this.botToken || !this.chatId) {
      console.error('❌ Telegram credentials not configured');
      console.error(`Bot token exists: ${!!this.botToken}, Chat ID exists: ${!!this.chatId}`);
      return false;
    }

    try {
      console.log('📱 Attempting to send Telegram message...');
      console.log(`🎯 Target chat: ${this.chatId}`);
      console.log(`📝 Message preview: ${message.substring(0, 100)}...`);
      
      const url = `https://api.telegram.org/bot${this.botToken}/sendMessage`;
      
      const payload = {
        chat_id: this.chatId,
        text: message,
        parse_mode: 'HTML',
        disable_web_page_preview: true
      };

      console.log('🔗 API URL:', url.replace(this.botToken, '[TOKEN_HIDDEN]'));
      console.log('📦 Payload:', { ...payload, text: payload.text.substring(0, 50) + '...' });

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      console.log(`📡 Response status: ${response.status} ${response.statusText}`);
      
      const responseData = await response.json();
      console.log('📋 Response data:', responseData);
      
      if (response.ok && responseData.ok) {
        console.log('✅ Message sent to Telegram successfully!');
        console.log(`📨 Message ID: ${responseData.result.message_id}`);
        console.log(`👤 Chat details:`, responseData.result.chat);
        return true;
      } else {
        console.error('❌ Telegram API error response:');
        console.error('Status:', response.status);
        console.error('Error code:', responseData.error_code);
        console.error('Error description:', responseData.description);
        
        // Specific error handling
        if (responseData.error_code === 400) {
          console.error('🚫 Bad Request - Check chat ID and message format');
        } else if (responseData.error_code === 401) {
          console.error('🔑 Unauthorized - Bot token is invalid');
        } else if (responseData.error_code === 403) {
          console.error('🚨 Forbidden - Bot blocked by user or chat not found');
        }
        
        return false;
      }
    } catch (error) {
      console.error('❌ Network error sending Telegram message:');
      console.error('Error type:', error.constructor.name);
      console.error('Error message:', error.message);
      console.error('Full error:', error);
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
Message ID: test-${Date.now()}

#LeviPro #Test #ConnectionVerified`;

    console.log('🧪 Sending test message to verify connection...');
    const result = await this.sendMessage(testMessage);
    
    if (result) {
      console.log('🎉 Test message sent successfully to @mytrsdingbot!');
    } else {
      console.error('💥 Test message failed - check credentials and connection');
    }
    
    return result;
  }

  public async sendSignal(signal: any): Promise<boolean> {
    try {
      console.log(`🚀 Preparing to send signal: ${signal.symbol} ${signal.action}`);
      
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

      console.log('📝 Signal message prepared, sending to Telegram...');
      const sent = await this.sendMessage(message);
      
      if (sent) {
        console.log(`✅ Elite signal delivered to Telegram: ${signal.symbol} ${signal.action}`);
      } else {
        console.error(`❌ Failed to deliver signal to Telegram: ${signal.symbol}`);
      }
      
      return sent;
    } catch (error) {
      console.error('❌ Error preparing/sending signal to Telegram:', error);
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
Connection ID: ${Date.now()}

If you receive this message, your bot is working perfectly!

#LeviPro #EliteTest #Connected`;

    console.log('🔍 Testing elite connection with detailed logging...');
    const sent = await this.sendMessage(testMessage);
    
    if (sent) {
      console.log('🎊 Elite connection test SUCCESSFUL - Message delivered!');
    } else {
      console.error('🚨 Elite connection test FAILED - Message not delivered!');
    }
    
    return sent;
  }

  public configureTelegram(botToken: string, chatId: string): boolean {
    try {
      console.log('⚙️ Configuring Telegram bot...');
      console.log(`🔑 Token length: ${botToken.length} characters`);
      console.log(`💬 Chat ID: ${chatId}`);
      
      this.botToken = botToken.trim();
      this.chatId = chatId.trim();
      
      // Store in localStorage for persistence
      localStorage.setItem('telegram_bot_token', this.botToken);
      localStorage.setItem('telegram_chat_id', this.chatId);
      
      this.isConnected = true;
      console.log('✅ Telegram bot configured and credentials stored');
      return true;
    } catch (error) {
      console.error('❌ Failed to configure Telegram bot:', error);
      return false;
    }
  }

  public getConnectionStatus() {
    const status = {
      connected: this.isConnected && !!this.botToken && !!this.chatId,
      botToken: this.botToken ? this.botToken.substring(0, 10) + '...' : 'Not set',
      chatId: this.chatId,
      lastPing: Date.now(),
      status: this.isConnected ? 'active' : 'disconnected',
      tokenLength: this.botToken.length,
      hasCredentials: !!(this.botToken && this.chatId)
    };
    
    console.log('📊 Connection status:', status);
    return status;
  }

  public disconnect() {
    console.log('🔌 Disconnecting Telegram bot...');
    
    this.botToken = '';
    this.chatId = '';
    this.isConnected = false;
    
    localStorage.removeItem('telegram_bot_token');
    localStorage.removeItem('telegram_chat_id');
    
    console.log('🔌 Telegram bot disconnected and credentials cleared');
  }
}

export const telegramBot = new TelegramBot();
