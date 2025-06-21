
import { toast } from 'sonner';

interface TelegramCredentials {
  botToken: string;
  chatId: string;
  connected: boolean;
  lastConnected: number;
}

export class UnifiedTelegramService {
  private static instance: UnifiedTelegramService;
  private credentials: TelegramCredentials | null = null;
  private readonly STORAGE_KEY = 'levipro_telegram_credentials';
  private readonly API_BASE = 'https://api.telegram.org/bot';
  private connectionTestInterval: NodeJS.Timeout | null = null;

  public static getInstance(): UnifiedTelegramService {
    if (!UnifiedTelegramService.instance) {
      UnifiedTelegramService.instance = new UnifiedTelegramService();
    }
    return UnifiedTelegramService.instance;
  }

  constructor() {
    this.loadStoredCredentials();
    this.startConnectionMonitoring();
  }

  private loadStoredCredentials(): void {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        this.credentials = JSON.parse(stored);
        console.log('📱 Loaded stored Telegram credentials');
        
        // Auto-verify connection on load
        if (this.credentials?.connected) {
          this.verifyConnection();
        }
      }
    } catch (error) {
      console.error('Error loading Telegram credentials:', error);
    }
  }

  private saveCredentials(): void {
    if (this.credentials) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.credentials));
    }
  }

  private startConnectionMonitoring(): void {
    // Monitor connection every 30 seconds
    this.connectionTestInterval = setInterval(() => {
      if (this.credentials?.connected) {
        this.verifyConnection();
      }
    }, 30000);
  }

  public async configureTelegram(botToken: string, chatId: string): Promise<boolean> {
    console.log('🔧 Configuring Telegram with new credentials');
    
    try {
      // Test connection first
      const testResult = await this.testConnection(botToken, chatId);
      
      if (testResult) {
        this.credentials = {
          botToken,
          chatId,
          connected: true,
          lastConnected: Date.now()
        };
        
        this.saveCredentials();
        console.log('✅ Telegram configured and connected successfully');
        toast.success('Telegram connected successfully!', {
          description: 'Bot is ready to send messages'
        });
        
        // Send confirmation message
        await this.sendMessage('🤖 LeviPro bot connected successfully! Ready to receive trading signals.');
        
        return true;
      } else {
        console.error('❌ Telegram connection test failed');
        toast.error('Failed to connect to Telegram', {
          description: 'Please check your bot token and chat ID'
        });
        return false;
      }
    } catch (error) {
      console.error('Error configuring Telegram:', error);
      toast.error('Configuration error', {
        description: 'Failed to configure Telegram bot'
      });
      return false;
    }
  }

  public async initializeWithCredentials(botToken: string, chatId: string): Promise<boolean> {
    console.log('🚀 Initializing Telegram with provided credentials');
    return await this.configureTelegram(botToken, chatId);
  }

  private async testConnection(botToken: string, chatId: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.API_BASE}${botToken}/getMe`);
      
      if (!response.ok) {
        console.error('Bot token validation failed:', response.status);
        return false;
      }

      const botInfo = await response.json();
      
      if (!botInfo.ok) {
        console.error('Bot API returned error:', botInfo);
        return false;
      }

      console.log('✅ Bot validated:', botInfo.result.username);
      return true;
    } catch (error) {
      console.error('Connection test failed:', error);
      return false;
    }
  }

  private async verifyConnection(): Promise<void> {
    if (!this.credentials?.connected) return;

    try {
      const isValid = await this.testConnection(this.credentials.botToken, this.credentials.chatId);
      
      if (!isValid && this.credentials.connected) {
        console.warn('⚠️ Telegram connection lost, attempting reconnection');
        this.credentials.connected = false;
        this.saveCredentials();
        
        // Try to reconnect
        setTimeout(() => {
          if (this.credentials) {
            this.configureTelegram(this.credentials.botToken, this.credentials.chatId);
          }
        }, 5000);
      }
    } catch (error) {
      console.error('Connection verification failed:', error);
    }
  }

  public async sendMessage(message: string): Promise<boolean> {
    if (!this.credentials?.connected) {
      console.warn('❌ Telegram not connected - cannot send message');
      toast.warning('Telegram not connected', {
        description: 'Please configure Telegram first'
      });
      return false;
    }

    try {
      console.log(`📤 Sending Telegram message to ${this.credentials.chatId}`);
      
      const response = await fetch(`${this.API_BASE}${this.credentials.botToken}/sendMessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: this.credentials.chatId,
          text: message,
          parse_mode: 'HTML'
        }),
      });

      const result = await response.json();

      if (result.ok) {
        console.log('✅ Message sent successfully');
        return true;
      } else {
        console.error('❌ Telegram API error:', result);
        
        // Handle specific errors
        if (result.error_code === 403) {
          toast.error('Bot blocked by user', {
            description: 'Please unblock the bot and try again'
          });
        } else if (result.error_code === 400) {
          toast.error('Invalid chat ID', {
            description: 'Please check your chat ID configuration'
          });
        } else {
          toast.error('Message send failed', {
            description: result.description || 'Unknown error'
          });
        }
        
        return false;
      }
    } catch (error) {
      console.error('❌ Error sending Telegram message:', error);
      toast.error('Network error', {
        description: 'Failed to send message to Telegram'
      });
      return false;
    }
  }

  public async sendTestMessage(): Promise<boolean> {
    const testMessage = `
🧪 <b>LeviPro Test Message</b>

✅ Connection Status: Active
🤖 Bot: Operational  
⏰ Time: ${new Date().toLocaleString('en-US')}
📊 System: Ready for trading signals

<i>This is a test message to verify Telegram integration.</i>
    `;
    
    return await this.sendMessage(testMessage);
  }

  public async sendTradingSignal(signal: any): Promise<boolean> {
    const actionEmoji = signal.action === 'buy' ? '🟢 BUY' : '🔴 SELL';
    const qualityEmoji = signal.qualityRating === 'ELITE' ? '💎' : 
                        signal.qualityRating === 'HIGH' ? '🔥' : '🎯';
    
    const message = `
${qualityEmoji} <b>${actionEmoji}: ${signal.symbol}</b>

💰 <b>Entry:</b> $${signal.price.toFixed(2)}
🎯 <b>Target:</b> $${signal.targetPrice.toFixed(2)}
🛑 <b>Stop Loss:</b> $${signal.stopLoss.toFixed(2)}
⚖️ <b>R/R:</b> ${signal.riskRewardRatio.toFixed(2)}:1
📊 <b>Confidence:</b> ${(signal.confidence * 100).toFixed(0)}%

${signal.riskSummary || ''}

🎯 <b>Strategy:</b> ${signal.strategy}
⏰ <b>Time:</b> ${new Date().toLocaleString('en-US')}

#LeviPro #${signal.qualityRating || 'SIGNAL'}
    `;
    
    return await this.sendMessage(message);
  }

  public getConnectionStatus() {
    return {
      connected: this.credentials?.connected || false,
      botToken: this.credentials?.botToken || '',
      chatId: this.credentials?.chatId || '',
      lastConnected: this.credentials?.lastConnected || 0,
      hasCredentials: !!(this.credentials?.botToken && this.credentials?.chatId)
    };
  }

  public disconnect(): void {
    if (this.connectionTestInterval) {
      clearInterval(this.connectionTestInterval);
    }
    
    this.credentials = null;
    localStorage.removeItem(this.STORAGE_KEY);
    
    console.log('📱 Telegram disconnected');
    toast.info('Telegram disconnected');
  }

  public destroy(): void {
    if (this.connectionTestInterval) {
      clearInterval(this.connectionTestInterval);
    }
  }
}

export const unifiedTelegramService = UnifiedTelegramService.getInstance();
