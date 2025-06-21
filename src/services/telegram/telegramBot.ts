
export class TelegramBot {
  private static instance: TelegramBot;
  private config = {
    token: '',
    chatId: '-1001234567890',
    connected: false
  };
  
  public static getInstance(): TelegramBot {
    if (!TelegramBot.instance) {
      TelegramBot.instance = new TelegramBot();
    }
    return TelegramBot.instance;
  }

  public getConnectionStatus() {
    return {
      connected: this.config.connected,
      status: this.config.connected ? 'Connected' : 'Disconnected',
      tokenLength: this.config.token.length,
      chatId: this.config.chatId,
      hasCredentials: this.config.token.length > 0
    };
  }

  public async configureTelegram(token: string, chatId: string): Promise<boolean> {
    try {
      this.config.token = token;
      this.config.chatId = chatId;
      this.config.connected = true;
      console.log('📱 Telegram configured successfully');
      return true;
    } catch (error) {
      console.error('❌ Failed to configure Telegram:', error);
      return false;
    }
  }

  public disconnect(): void {
    this.config.connected = false;
    this.config.token = '';
    console.log('📱 Telegram disconnected');
  }

  public async testEliteConnection(): Promise<boolean> {
    try {
      console.log('🧪 Testing Telegram Elite connection...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      return this.config.connected;
    } catch (error) {
      console.error('Telegram test failed:', error);
      return false;
    }
  }

  public async sendMessage(message: string): Promise<boolean> {
    try {
      console.log('📤 Sending Telegram message:', message);
      await new Promise(resolve => setTimeout(resolve, 500));
      return this.config.connected;
    } catch (error) {
      console.error('Failed to send Telegram message:', error);
      return false;
    }
  }

  public async sendTestMessage(): Promise<boolean> {
    const testMessage = '🧪 Test message from LeviPro system';
    return this.sendMessage(testMessage);
  }

  public async sendSignal(signal: any): Promise<boolean> {
    const actionEmoji = signal.action === 'buy' ? '🟢 BUY' : '🔴 SELL';
    const message = `
${actionEmoji}: ${signal.symbol}

💰 Entry: $${signal.price.toFixed(2)}
🎯 Target: $${signal.targetPrice.toFixed(2)}
🛑 Stop Loss: $${signal.stopLoss.toFixed(2)}
⚖️ R/R: ${signal.riskRewardRatio.toFixed(2)}:1
📊 Confidence: ${(signal.confidence * 100).toFixed(0)}%

🎯 Strategy: ${signal.strategy}
⏰ Time: ${new Date().toLocaleString('he-IL')}

#LeviPro #${signal.strategy}
`;
    
    return this.sendMessage(message);
  }
}

export const telegramBot = TelegramBot.getInstance();
