
import { tradingEngine } from './tradingEngine';
import { liveSignalEngine } from './liveSignalEngine';
import { ContinuousAnalysisEngine } from './continuousAnalysisEngine';
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
      console.log('🎯 Starting LeviPro Engine with Continuous Analysis...');
      
      // Check Telegram connection first
      const telegramStatus = telegramBot.getConnectionStatus();
      if (!telegramStatus.connected) {
        console.warn('⚠️ Telegram not connected, but starting engine anyway');
        toast.warning('טלגרם לא מחובר - איתותים לא יישלחו');
      }

      // Start the continuous analysis engine (resilient to errors)
      ContinuousAnalysisEngine.start();
      
      // Start the live signal engine
      liveSignalEngine.start();
      
      // Start the trading engine
      await tradingEngine.start();
      
      console.log('✅ LeviPro Engine started successfully with error resilience');
      console.log('🔄 Continuous analysis running - will not stop on errors');
      
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
      
      // Stop all engines
      ContinuousAnalysisEngine.stop();
      liveSignalEngine.stop();
      tradingEngine.stop();
      
      console.log('✅ LeviPro Engine stopped');
    } catch (error) {
      console.error('❌ Failed to stop engine:', error);
      toast.error('שגיאה בעצירת המנוע');
    }
  }

  public getStatus() {
    const mainStatus = tradingEngine.getStatus();
    const liveStatus = liveSignalEngine.getEngineStatus();
    const continuousStatus = ContinuousAnalysisEngine.getStatus();
    
    return {
      ...mainStatus,
      liveEngine: liveStatus,
      continuousEngine: continuousStatus,
      overallHealth: liveStatus.isRunning && continuousStatus.isRunning ? 'HEALTHY' : 'DEGRADED'
    };
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
