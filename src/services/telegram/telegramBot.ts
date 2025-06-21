
import { unifiedTelegramService } from './unifiedTelegramService';

export class TelegramBot {
  private static instance: TelegramBot;
  
  public static getInstance(): TelegramBot {
    if (!TelegramBot.instance) {
      TelegramBot.instance = new TelegramBot();
    }
    return TelegramBot.instance;
  }

  constructor() {
    // Auto-initialize with hardcoded credentials for production
    this.initializeProduction();
  }

  private async initializeProduction() {
    const PRODUCTION_TOKEN = '7607389220:AAHSUnDPTR_9iQEmMjZkSy5i0kepBotAUbA';
    const PRODUCTION_CHAT_ID = '809305569';
    
    console.log('🚀 Initializing production Telegram bot...');
    
    // Check if already configured
    const status = unifiedTelegramService.getConnectionStatus();
    if (!status.connected || status.botToken !== PRODUCTION_TOKEN) {
      await unifiedTelegramService.initializeWithCredentials(PRODUCTION_TOKEN, PRODUCTION_CHAT_ID);
    }
  }

  public getConnectionStatus() {
    const status = unifiedTelegramService.getConnectionStatus();
    return {
      connected: status.connected,
      status: status.connected ? 'Connected' : 'Disconnected',
      tokenLength: status.botToken.length,
      chatId: status.chatId,
      hasCredentials: status.hasCredentials
    };
  }

  public async configureTelegram(token: string, chatId: string): Promise<boolean> {
    return await unifiedTelegramService.configureTelegram(token, chatId);
  }

  public disconnect(): void {
    unifiedTelegramService.disconnect();
  }

  public async testEliteConnection(): Promise<boolean> {
    try {
      console.log('🧪 Testing Telegram Elite connection...');
      return await unifiedTelegramService.sendTestMessage();
    } catch (error) {
      console.error('Telegram test failed:', error);
      return false;
    }
  }

  public async sendMessage(message: string): Promise<boolean> {
    return await unifiedTelegramService.sendMessage(message);
  }

  public async sendTestMessage(): Promise<boolean> {
    return await unifiedTelegramService.sendTestMessage();
  }

  public async sendSignal(signal: any): Promise<boolean> {
    return await unifiedTelegramService.sendTradingSignal(signal);
  }
}

export const telegramBot = TelegramBot.getInstance();
