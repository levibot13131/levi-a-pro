
import { tradingEngine } from './tradingEngine';
import { telegramBot } from '../telegram/telegramBot';
import { toast } from 'sonner';

class EngineController {
  private statusListeners: ((status: any) => void)[] = [];

  constructor() {
    this.setupEventListeners();
  }

  private setupEventListeners() {
    // Listen to trading engine status changes
    tradingEngine.addStatusListener((status) => {
      this.statusListeners.forEach(listener => listener(status));
    });
  }

  public async startEngine(): Promise<boolean> {
    try {
      console.log('🎯 Starting LeviPro Engine with Personal Method Priority...');
      
      // Check Telegram connection first
      const telegramStatus = telegramBot.getConnectionStatus();
      if (!telegramStatus.connected) {
        console.warn('⚠️ Telegram not connected, but starting engine anyway');
        toast.warning('טלגרם לא מחובר - איתותים לא יישלחו');
      }

      // Start the trading engine
      await tradingEngine.start();
      
      console.log('✅ LeviPro Engine started successfully');
      console.log('🧠 Personal Method: 80% weight, immune to disable');
      
      return true;
    } catch (error) {
      console.error('❌ Failed to start engine:', error);
      toast.error('שגיאה בהפעלת המנוע');
      return false;
    }
  }

  public stopEngine(): void {
    try {
      console.log('⏹️ Stopping LeviPro Engine...');
      tradingEngine.stop();
      console.log('✅ LeviPro Engine stopped');
    } catch (error) {
      console.error('❌ Failed to stop engine:', error);
      toast.error('שגיאה בעצירת המנוע');
    }
  }

  public getStatus() {
    return tradingEngine.getStatus();
  }

  public addStatusListener(listener: (status: any) => void) {
    this.statusListeners.push(listener);
  }

  public removeStatusListener(listener: (status: any) => void) {
    this.statusListeners = this.statusListeners.filter(l => l !== listener);
  }

  public async sendTestSignal(): Promise<boolean> {
    try {
      return await telegramBot.sendTestMessage();
    } catch (error) {
      console.error('Error sending test signal:', error);
      return false;
    }
  }

  public getSystemHealth() {
    return tradingEngine.getSystemHealth();
  }
}

export const engineController = new EngineController();
