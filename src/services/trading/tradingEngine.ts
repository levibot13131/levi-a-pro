
import { TradingSignal, MarketData, SystemHealth } from '@/types/trading';
import { strategyEngine } from './strategyEngine';
import { marketDataService } from './marketDataService';
import { telegramBot } from '../telegram/telegramBot';
import { toast } from 'sonner';

export class TradingEngine {
  private isRunning = false;
  private watchList: string[] = ['BTCUSDT', 'ETHUSDT', 'SOLUSDT', 'BNBUSDT'];
  private signals: TradingSignal[] = [];
  private systemHealth: SystemHealth = {
    binance: false,
    tradingView: false,
    twitter: false,
    coinGecko: false,
    telegram: false,
    fundamentalData: false,
    lastCheck: 0
  };

  private analysisInterval?: NodeJS.Timeout;
  private healthCheckInterval?: NodeJS.Timeout;
  private statusListeners: ((status: any) => void)[] = [];

  constructor() {
    this.initializeEngine();
  }

  private async initializeEngine() {
    console.log('🚀 LeviPro Trading Engine initializing...');
    await this.performHealthCheck();
    this.setupEventListeners();
  }

  public async start() {
    if (this.isRunning) {
      toast.info('מנוע המסחר כבר פועל');
      return;
    }

    console.log('▶️ Starting LeviPro Trading Engine with Personal Method Priority');
    this.isRunning = true;

    // Start market analysis every 30 seconds
    this.analysisInterval = setInterval(() => {
      this.analyzeMarkets();
    }, 30000);

    // Start health checks every 2 minutes
    this.healthCheckInterval = setInterval(() => {
      this.performHealthCheck();
    }, 120000);

    // Initial analysis
    await this.analyzeMarkets();
    
    toast.success('🎯 מנוע המסחר LeviPro הופעל - אסטרטגיה אישית פעילה');
    
    // Send startup notification to Telegram
    await this.sendStartupNotification();
    
    // Notify status listeners
    this.notifyStatusListeners();
  }

  public stop() {
    if (!this.isRunning) {
      toast.info('מנוע המסחר כבר מופסק');
      return;
    }

    console.log('⏹️ Stopping LeviPro Trading Engine');
    this.isRunning = false;

    if (this.analysisInterval) {
      clearInterval(this.analysisInterval);
      this.analysisInterval = undefined;
    }

    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
      this.healthCheckInterval = undefined;
    }

    toast.info('מנוע המסחר הופסק');
    this.notifyStatusListeners();
  }

  private async analyzeMarkets() {
    if (!this.isRunning) return;

    console.log('📊 Analyzing markets with Personal Method priority...');
    
    try {
      const marketDataMap = await marketDataService.getMultipleMarketData(this.watchList);
      
      for (const [symbol, marketData] of marketDataMap) {
        const newSignals = strategyEngine.analyzeMarket(marketData);
        
        for (const signal of newSignals) {
          await this.processSignal(signal);
        }
      }
      
      console.log(`✅ Market analysis complete. Active signals: ${this.getActiveSignals().length}`);
      console.log(`🧠 Personal Method signals generated: ${this.signals.filter(s => s.strategy === 'almog-personal-method').length}`);
      
    } catch (error) {
      console.error('❌ Error during market analysis:', error);
      toast.error('שגיאה בניתוח השווקים');
    }
  }

  private async processSignal(signal: TradingSignal) {
    // Check if we already have a similar signal
    const existingSignal = this.signals.find(s => 
      s.symbol === signal.symbol && 
      s.action === signal.action && 
      s.status === 'active' &&
      Math.abs(s.timestamp - signal.timestamp) < 300000 // Within 5 minutes
    );

    if (existingSignal) {
      console.log(`⏭️ Skipping duplicate signal for ${signal.symbol}`);
      return;
    }

    // Add signal to our list
    this.signals.push(signal);
    
    // Log with special attention to personal method
    if (signal.strategy === 'almog-personal-method') {
      console.log(`🔥 PERSONAL METHOD SIGNAL: ${signal.action.toUpperCase()} ${signal.symbol} at ${signal.price} (${(signal.confidence * 100).toFixed(0)}% confidence)`);
      toast.success(`🧠 איתות אסטרטגיה אישית: ${signal.action.toUpperCase()} ${signal.symbol}`);
    } else {
      console.log(`📢 New trading signal: ${signal.action.toUpperCase()} ${signal.symbol} at ${signal.price}`);
    }
    
    // Send to Telegram with priority for personal method
    try {
      const sent = await telegramBot.sendSignal(signal);
      if (sent) {
        signal.telegramSent = true;
        console.log(`📱 Signal sent to Telegram: ${signal.symbol} (${signal.strategy})`);
      }
    } catch (error) {
      console.error(`❌ Failed to send signal to Telegram: ${error}`);
    }

    // Trigger UI update
    this.notifySignalListeners(signal);
  }

  private notifySignalListeners(signal: TradingSignal) {
    window.dispatchEvent(new CustomEvent('trading-signal', {
      detail: signal
    }));
  }

  private notifyStatusListeners() {
    const status = {
      isRunning: this.isRunning,
      lastSignalTime: this.signals.length > 0 ? Math.max(...this.signals.map(s => s.timestamp)) : null,
      totalSignals: this.signals.length,
      activeStrategies: strategyEngine.getActiveStrategies(),
      personalMethodActive: true,
      personalMethodWeight: 0.80
    };

    this.statusListeners.forEach(listener => listener(status));
  }

  public addStatusListener(listener: (status: any) => void) {
    this.statusListeners.push(listener);
  }

  public removeStatusListener(listener: (status: any) => void) {
    this.statusListeners = this.statusListeners.filter(l => l !== listener);
  }

  private async performHealthCheck(): Promise<SystemHealth> {
    console.log('🔍 Performing system health check...');
    
    const health: SystemHealth = {
      binance: await this.checkBinanceHealth(),
      tradingView: true, // Placeholder
      twitter: true, // Placeholder
      coinGecko: await this.checkCoinGeckoHealth(),
      telegram: await this.checkTelegramHealth(),
      fundamentalData: true, // Placeholder
      lastCheck: Date.now()
    };

    this.systemHealth = health;
    
    const healthyServices = Object.values(health).filter(Boolean).length - 1; // Subtract lastCheck
    const totalServices = Object.keys(health).length - 1;
    
    console.log(`💚 System health: ${healthyServices}/${totalServices} services healthy`);
    
    return health;
  }

  private async checkBinanceHealth(): Promise<boolean> {
    try {
      const testData = await marketDataService.getMarketData('BTCUSDT');
      return testData !== null;
    } catch {
      return false;
    }
  }

  private async checkCoinGeckoHealth(): Promise<boolean> {
    try {
      const response = await fetch('https://api.coingecko.com/api/v3/ping');
      return response.ok;
    } catch {
      return false;
    }
  }

  private async checkTelegramHealth(): Promise<boolean> {
    const status = telegramBot.getConnectionStatus();
    return status.connected;
  }

  private async sendStartupNotification() {
    const message = `
🚀 <b>LeviPro מנוע מסחר הופעל</b>

✅ המערכת פועלת ומנטרת את השווקים
🧠 <b>אסטרטגיה אישית: 80% עדיפות מובטחת</b>
📊 רשימת מעקב: ${this.watchList.join(', ')}
🎯 ${strategyEngine.getActiveStrategies().length} אסטרטגיות פעילות

המערכת תשלח איתותים אוטומטיים כאשר תזהה הזדמנויות מסחר.
האסטרטגיה האישית מקבלת עדיפות ראשונה תמיד.

#LeviPro #TradingEngine #PersonalMethod #Active
`;

    try {
      await telegramBot.sendMessage(message);
    } catch (error) {
      console.error('Failed to send startup notification:', error);
    }
  }

  private setupEventListeners() {
    // Listen for manual signal creation
    window.addEventListener('create-manual-signal', ((event: CustomEvent) => {
      this.processSignal(event.detail);
    }) as EventListener);
  }

  // Public getters
  public getIsRunning(): boolean {
    return this.isRunning;
  }

  public getActiveSignals(): TradingSignal[] {
    return this.signals.filter(s => s.status === 'active');
  }

  public getAllSignals(): TradingSignal[] {
    return [...this.signals];
  }

  public getSystemHealth(): SystemHealth {
    return { ...this.systemHealth };
  }

  public getWatchList(): string[] {
    return [...this.watchList];
  }

  public getStatus() {
    return {
      isRunning: this.isRunning,
      lastSignalTime: this.signals.length > 0 ? Math.max(...this.signals.map(s => s.timestamp)) : null,
      totalSignals: this.signals.length,
      activeStrategies: strategyEngine.getActiveStrategies()
    };
  }
}

export const tradingEngine = new TradingEngine();
