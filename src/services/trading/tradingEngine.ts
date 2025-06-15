
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

    console.log('▶️ Starting LeviPro Trading Engine');
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
    
    toast.success('מנוע המסחר הופעל בהצלחה');
    
    // Send startup notification to Telegram
    await this.sendStartupNotification();
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
  }

  private async analyzeMarkets() {
    if (!this.isRunning) return;

    console.log('📊 Analyzing markets...');
    
    try {
      const marketDataMap = await marketDataService.getMultipleMarketData(this.watchList);
      
      for (const [symbol, marketData] of marketDataMap) {
        const newSignals = strategyEngine.analyzeMarket(marketData);
        
        for (const signal of newSignals) {
          await this.processSignal(signal);
        }
      }
      
      console.log(`✅ Market analysis complete. Active signals: ${this.getActiveSignals().length}`);
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
    
    console.log(`📢 New trading signal: ${signal.action.toUpperCase()} ${signal.symbol} at ${signal.price}`);
    
    // Send to Telegram
    try {
      const sent = await telegramBot.sendSignal(signal);
      if (sent) {
        signal.telegramSent = true;
        console.log(`📱 Signal sent to Telegram: ${signal.symbol}`);
      }
    } catch (error) {
      console.error(`❌ Failed to send signal to Telegram: ${error}`);
    }

    // Save to database (implement with Supabase)
    await this.saveSignalToDatabase(signal);
    
    // Trigger UI update
    this.notifySignalListeners(signal);
  }

  private async saveSignalToDatabase(signal: TradingSignal) {
    // TODO: Implement Supabase save
    console.log(`💾 Saving signal to database: ${signal.id}`);
  }

  private notifySignalListeners(signal: TradingSignal) {
    window.dispatchEvent(new CustomEvent('trading-signal', {
      detail: signal
    }));
  }

  private async performHealthCheck(): Promise<SystemHealth> {
    console.log('🔍 Performing system health check...');
    
    const health: SystemHealth = {
      binance: await this.checkBinanceHealth(),
      tradingView: await this.checkTradingViewHealth(),
      twitter: await this.checkTwitterHealth(),
      coinGecko: await this.checkCoinGeckoHealth(),
      telegram: await this.checkTelegramHealth(),
      fundamentalData: await this.checkFundamentalDataHealth(),
      lastCheck: Date.now()
    };

    this.systemHealth = health;
    
    const healthyServices = Object.values(health).filter(Boolean).length - 1; // Subtract lastCheck
    const totalServices = Object.keys(health).length - 1;
    
    console.log(`💚 System health: ${healthyServices}/${totalServices} services healthy`);
    
    // Dispatch health update event
    window.dispatchEvent(new CustomEvent('system-health-update', {
      detail: health
    }));
    
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

  private async checkTradingViewHealth(): Promise<boolean> {
    // TODO: Implement TradingView health check
    return true; // Placeholder
  }

  private async checkTwitterHealth(): Promise<boolean> {
    // TODO: Implement Twitter API health check
    return true; // Placeholder
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
    // TODO: Implement Telegram bot health check
    return true; // Placeholder
  }

  private async checkFundamentalDataHealth(): Promise<boolean> {
    // TODO: Implement fundamental data sources health check
    return true; // Placeholder
  }

  private async sendStartupNotification() {
    const message = `
🚀 <b>LeviPro מנוע מסחר הופעל</b>

✅ המערכת פועלת ומנטרת את השווקים
📊 רשימת מעקב: ${this.watchList.join(', ')}
🧠 אסטרטגיות פעילות: ${strategyEngine.getActiveStrategies().length}

המערכת תשלח איתותים אוטומטיים כאשר תזהה הזדמנויות מסחר.

#LeviPro #TradingEngine #Active
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

    // Listen for strategy updates
    window.addEventListener('strategy-updated', ((event: CustomEvent) => {
      console.log('Strategy updated:', event.detail);
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

  public addToWatchList(symbol: string) {
    if (!this.watchList.includes(symbol)) {
      this.watchList.push(symbol);
      console.log(`➕ Added ${symbol} to watch list`);
    }
  }

  public removeFromWatchList(symbol: string) {
    const index = this.watchList.indexOf(symbol);
    if (index > -1) {
      this.watchList.splice(index, 1);
      console.log(`➖ Removed ${symbol} from watch list`);
    }
  }

  public async executeManualSignal(symbol: string, action: 'buy' | 'sell', reasoning: string) {
    const marketData = await marketDataService.getMarketData(symbol);
    if (!marketData) {
      toast.error(`לא ניתן לקבל נתוני שוק עבור ${symbol}`);
      return;
    }

    const signal: TradingSignal = {
      id: `manual-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      symbol,
      strategy: 'manual',
      action,
      price: marketData.price,
      targetPrice: action === 'buy' ? marketData.price * 1.03 : marketData.price * 0.97,
      stopLoss: action === 'buy' ? marketData.price * 0.98 : marketData.price * 1.02,
      confidence: 1.0,
      riskRewardRatio: 1.5,
      reasoning: `איתות ידני: ${reasoning}`,
      timestamp: Date.now(),
      status: 'active',
      telegramSent: false,
      metadata: { manual: true, userGenerated: true }
    };

    await this.processSignal(signal);
    toast.success('איתות ידני נוצר ונשלח');
  }
}

export const tradingEngine = new TradingEngine();
