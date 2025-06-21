import { TradingSignal, MarketData, SystemHealth } from '@/types/trading';
import { strategyEngine } from './strategyEngine';
import { marketDataService } from './marketDataService';
import { telegramBot } from '../telegram/telegramBot';
import { signalManager } from './signalManager';
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
          // Validate and ensure accurate pricing
          const validatedSignal = await this.validateAndPriceSignal(signal, marketData);
          if (validatedSignal) {
            await this.processSignal(validatedSignal);
          }
        }
      }
      
      const stats = signalManager.getDailyStats();
      console.log(`✅ Market analysis complete. Daily: ${stats.dailySignalCount}, Session: ${stats.sessionSignalsCount}`);
      
    } catch (error) {
      console.error('❌ Error during market analysis:', error);
      toast.error('שגיאה בניתוח השווקים');
    }
  }

  private async validateAndPriceSignal(signal: TradingSignal, marketData: MarketData): Promise<TradingSignal | null> {
    try {
      // Ensure we have valid market data and pricing
      if (!marketData.price || isNaN(marketData.price) || marketData.price <= 0) {
        console.error(`❌ Invalid market data for ${signal.symbol}`);
        return null;
      }

      // Use live market price
      const currentPrice = marketData.price;
      
      // Calculate proper targets based on strategy
      let targetPrice: number;
      let stopLoss: number;
      
      if (signal.strategy === 'almog-personal-method') {
        // LeviPro Method: Fixed 1.75 R/R ratio
        if (signal.action === 'buy') {
          stopLoss = currentPrice * 0.985; // 1.5% stop loss
          const riskAmount = currentPrice - stopLoss;
          targetPrice = currentPrice + (riskAmount * 1.75); // 1.75 R/R
        } else {
          stopLoss = currentPrice * 1.015; // 1.5% stop loss
          const riskAmount = stopLoss - currentPrice;
          targetPrice = currentPrice - (riskAmount * 1.75); // 1.75 R/R
        }
      } else {
        // Standard calculation for other strategies
        if (signal.action === 'buy') {
          targetPrice = currentPrice * 1.025; // 2.5% profit target
          stopLoss = currentPrice * 0.98; // 2% stop loss
        } else {
          targetPrice = currentPrice * 0.975; // 2.5% profit target
          stopLoss = currentPrice * 1.02; // 2% stop loss
        }
      }

      // Calculate actual R/R ratio
      const riskAmount = Math.abs(currentPrice - stopLoss);
      const rewardAmount = Math.abs(targetPrice - currentPrice);
      const riskRewardRatio = riskAmount > 0 ? rewardAmount / riskAmount : 1.5;

      // Update signal with accurate pricing
      const pricedSignal: TradingSignal = {
        ...signal,
        price: currentPrice,
        targetPrice: Number(targetPrice.toFixed(2)),
        stopLoss: Number(stopLoss.toFixed(2)),
        riskRewardRatio: Number(riskRewardRatio.toFixed(2)),
        metadata: {
          ...signal.metadata,
          timeframe: marketData.wyckoffPhase ? '15M' : '5M', // Add timeframe context
          priceValidated: true,
          marketDataTimestamp: Date.now()
        }
      };

      return pricedSignal;
    } catch (error) {
      console.error(`❌ Error validating signal for ${signal.symbol}:`, error);
      return null;
    }
  }

  private async processSignal(signal: TradingSignal) {
    // Use signal manager to validate and prevent conflicts
    const added = signalManager.addSignal(signal);
    if (!added) {
      return; // Signal was blocked by validation
    }

    // Add to our list
    this.signals.push(signal);
    
    // Log with special attention to personal method
    if (signal.strategy === 'almog-personal-method') {
      console.log(`🔥 PERSONAL METHOD SIGNAL: ${signal.action.toUpperCase()} ${signal.symbol} at $${signal.price} (Target: $${signal.targetPrice}, SL: $${signal.stopLoss})`);
      toast.success(`🧠 איתות אסטרטגיה אישית: ${signal.action.toUpperCase()} ${signal.symbol}`);
    } else {
      console.log(`📢 New trading signal: ${signal.action.toUpperCase()} ${signal.symbol} at $${signal.price}`);
    }
    
    // Send to Telegram with proper formatting
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
      personalMethodWeight: 0.80,
      dailyStats: signalManager.getDailyStats()
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

  private async checkBinanceHealth(): Promise<boolean>  {
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
    const stats = signalManager.getDailyStats();
    const message = `
🚀 <b>LeviPro מנוע מסחר הופעל</b>

✅ המערכת פועלת ומנטרת את השווקים
🧠 <b>אסטרטגיה אישית: 80% עדיפות מובטחת</b>
📊 רשימת מעקב: ${this.watchList.join(', ')}
🎯 ${strategyEngine.getActiveStrategies().length} אסטרטגיות פעילות

📈 מגבלות יומיות:
• איתותים: ${stats.dailySignalCount}/50
• הפסד מקסימלי: ${stats.dailyLoss.toFixed(1)}%/5%
• סשן נוכחי: ${stats.sessionSignalsCount}/3

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

  public addToWatchList(symbol: string): void {
    if (!this.watchList.includes(symbol)) {
      this.watchList.push(symbol);
      console.log(`📈 Added ${symbol} to watchlist`);
    }
  }

  public removeFromWatchList(symbol: string): void {
    const index = this.watchList.indexOf(symbol);
    if (index > -1) {
      this.watchList.splice(index, 1);
      console.log(`📉 Removed ${symbol} from watchlist`);
    }
  }

  public async executeManualSignal(symbol: string, action: 'buy' | 'sell', reasoning: string): Promise<void> {
    try {
      const marketData = await marketDataService.getMarketData(symbol);
      
      const signal: TradingSignal = {
        id: `manual-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        symbol,
        strategy: 'manual-signal',
        action,
        price: marketData.price,
        targetPrice: action === 'buy' ? marketData.price * 1.025 : marketData.price * 0.975,
        stopLoss: action === 'buy' ? marketData.price * 0.98 : marketData.price * 1.02,
        confidence: 0.85,
        riskRewardRatio: 1.25,
        reasoning,
        timestamp: Date.now(),
        status: 'active',
        telegramSent: false,
        metadata: { manual: true }
      };

      await this.processSignal(signal);
      console.log('✅ Manual signal executed:', signal);
    } catch (error) {
      console.error('❌ Failed to execute manual signal:', error);
      throw error;
    }
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
      activeStrategies: strategyEngine.getActiveStrategies(),
      dailyStats: signalManager.getDailyStats()
    };
  }
}

export const tradingEngine = new TradingEngine();
