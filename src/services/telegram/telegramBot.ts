
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
    try {
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
    } catch (error) {
      console.error('❌ Error accessing localStorage:', error);
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
      console.log('📦 Full payload being sent:', payload);

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      console.log(`📡 HTTP Response status: ${response.status} ${response.statusText}`);
      console.log(`📡 Response headers:`, Object.fromEntries(response.headers.entries()));
      
      let responseData;
      try {
        responseData = await response.json();
        console.log('📋 Full response data:', responseData);
      } catch (parseError) {
        console.error('❌ Failed to parse response JSON:', parseError);
        const responseText = await response.text();
        console.error('📋 Raw response text:', responseText);
        return false;
      }
      
      if (response.ok && responseData.ok) {
        console.log('🎉 ✅ MESSAGE SUCCESSFULLY SENT TO TELEGRAM!');
        console.log(`📨 Message ID: ${responseData.result.message_id}`);
        console.log(`👤 Chat details:`, responseData.result.chat);
        console.log(`⏰ Message timestamp:`, new Date(responseData.result.date * 1000));
        return true;
      } else {
        console.error('❌ ❌ TELEGRAM API ERROR RESPONSE:');
        console.error('❌ HTTP Status:', response.status);
        console.error('❌ Response OK:', response.ok);
        console.error('❌ Telegram OK:', responseData.ok);
        console.error('❌ Error code:', responseData.error_code);
        console.error('❌ Error description:', responseData.description);
        
        // Specific error handling with detailed explanations
        if (responseData.error_code === 400) {
          console.error('🚫 BAD REQUEST - Possible issues:');
          console.error('   - Invalid chat_id format');
          console.error('   - Message too long (over 4096 chars)');
          console.error('   - Invalid parse_mode');
          console.error('   - Malformed message text');
        } else if (responseData.error_code === 401) {
          console.error('🔑 UNAUTHORIZED - Bot token is invalid or expired');
          console.error('   - Check if token is correct from @BotFather');
          console.error('   - Verify no extra spaces or characters');
        } else if (responseData.error_code === 403) {
          console.error('🚨 FORBIDDEN - Possible issues:');
          console.error('   - Bot blocked by user');
          console.error('   - Chat not found or bot not in chat');
          console.error('   - Bot lacks permission to send messages');
        } else if (responseData.error_code === 429) {
          console.error('⏰ RATE LIMITED - Too many requests');
          console.error('   - Wait before sending more messages');
        }
        
        return false;
      }
    } catch (error) {
      console.error('❌ ❌ NETWORK/FETCH ERROR:');
      console.error('❌ Error type:', error.constructor.name);
      console.error('❌ Error message:', error.message);
      console.error('❌ Full error object:', error);
      
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        console.error('🌐 NETWORK ISSUE - Possible causes:');
        console.error('   - No internet connection');
        console.error('   - Blocked by CORS policy');
        console.error('   - Telegram servers unreachable');
      }
      
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
    console.log('🧪 Test message content:', testMessage);
    
    const result = await this.sendMessage(testMessage);
    
    if (result) {
      console.log('🎉 🎉 TEST MESSAGE SENT SUCCESSFULLY TO @mytrsdingbot!');
      console.log('🎉 Check your Telegram now - message should be visible');
    } else {
      console.error('💥 💥 TEST MESSAGE FAILED - CHECK ERRORS ABOVE');
      console.error('💥 Verify bot token and chat ID are correct');
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
        console.log(`✅ ✅ ELITE SIGNAL DELIVERED TO TELEGRAM: ${signal.symbol} ${signal.action}`);
      } else {
        console.error(`❌ ❌ FAILED TO DELIVER SIGNAL TO TELEGRAM: ${signal.symbol}`);
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
      console.log('🎊 🎊 ELITE CONNECTION TEST SUCCESSFUL - MESSAGE DELIVERED!');
    } else {
      console.error('🚨 🚨 ELITE CONNECTION TEST FAILED - MESSAGE NOT DELIVERED!');
    }
    
    return sent;
  }

  public configureTelegram(botToken: string, chatId: string): boolean {
    try {
      console.log('⚙️ Configuring Telegram bot...');
      console.log(`🔑 Token received - Length: ${botToken.length} characters`);
      console.log(`💬 Chat ID received: ${chatId}`);
      
      // Validate token format (should start with number followed by colon)
      if (!botToken.match(/^\d+:[A-Za-z0-9_-]+$/)) {
        console.error('❌ Invalid bot token format - should be like "123456789:ABCDEF..."');
        return false;
      }
      
      // Validate chat ID (should be numeric)
      if (!chatId.match(/^-?\d+$/)) {
        console.error('❌ Invalid chat ID format - should be numeric');
        return false;
      }
      
      this.botToken = botToken.trim();
      this.chatId = chatId.trim();
      
      // Store in localStorage for persistence
      try {
        localStorage.setItem('telegram_bot_token', this.botToken);
        localStorage.setItem('telegram_chat_id', this.chatId);
        console.log('💾 Credentials stored in localStorage');
      } catch (storageError) {
        console.error('⚠️ Failed to store in localStorage:', storageError);
      }
      
      this.isConnected = true;
      console.log('✅ Telegram bot configured successfully');
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
      hasCredentials: !!(this.botToken && this.chatId),
      tokenValid: this.botToken.match(/^\d+:[A-Za-z0-9_-]+$/) !== null,
      chatIdValid: this.chatId.match(/^-?\d+$/) !== null
    };
    
    console.log('📊 Connection status check:', status);
    return status;
  }

  public disconnect() {
    console.log('🔌 Disconnecting Telegram bot...');
    
    this.botToken = '';
    this.chatId = '';
    this.isConnected = false;
    
    try {
      localStorage.removeItem('telegram_bot_token');
      localStorage.removeItem('telegram_chat_id');
      console.log('🗑️ Credentials removed from localStorage');
    } catch (error) {
      console.error('⚠️ Error removing from localStorage:', error);
    }
    
    console.log('🔌 Telegram bot disconnected and credentials cleared');
  }
}

export const telegramBot = new TelegramBot();
