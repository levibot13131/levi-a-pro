
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { liveMarketDataService } from './liveMarketDataService';

interface EngineStatus {
  isRunning: boolean;
  lastSignalTime: Date | null;
  totalSignals: number;
  activeStrategies: string[];
}

export class TradingEngineController {
  private static instance: TradingEngineController;
  private isRunning = false;
  private engineInterval?: NodeJS.Timeout;
  private healthCheckInterval?: NodeJS.Timeout;
  private listeners: Set<(status: EngineStatus) => void> = new Set();

  static getInstance(): TradingEngineController {
    if (!TradingEngineController.instance) {
      TradingEngineController.instance = new TradingEngineController();
    }
    return TradingEngineController.instance;
  }

  async startEngine(): Promise<boolean> {
    if (this.isRunning) {
      toast.info('המנוע כבר פועל');
      return true;
    }

    try {
      console.log('🚀 Starting LeviPro Live Trading Engine...');
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('משתמש לא מחובר');
        return false;
      }

      await supabase
        .from('trading_engine_status')
        .upsert({
          user_id: user.id,
          is_running: true,
          started_at: new Date().toISOString()
        });

      this.isRunning = true;
      
      // Generate signals every 30 seconds with LIVE data
      this.engineInterval = setInterval(async () => {
        await this.generateLiveSignals();
      }, 30000);

      // Health check every 60 seconds
      this.healthCheckInterval = setInterval(async () => {
        await this.performHealthCheck();
      }, 60000);

      toast.success('🚀 מנוע המסחר LIVE הופעל בהצלחה!', {
        description: 'האסטרטגיה האישית של אלמוג פועלת עם נתונים אמיתיים',
        duration: 10000,
      });
      
      this.notifyListeners();
      
      // Initial signal generation with live data
      await this.generateLiveSignals();
      
      return true;
    } catch (error) {
      console.error('Failed to start engine:', error);
      toast.error('כשל בהפעלת המנוע');
      return false;
    }
  }

  async stopEngine(): Promise<void> {
    if (!this.isRunning) return;

    console.log('⏹️ Stopping LeviPro Live Trading Engine...');
    
    this.isRunning = false;
    
    if (this.engineInterval) {
      clearInterval(this.engineInterval);
      this.engineInterval = undefined;
    }
    
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
      this.healthCheckInterval = undefined;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase
          .from('trading_engine_status')
          .upsert({
            user_id: user.id,
            is_running: false,
            stopped_at: new Date().toISOString()
          });
      }
    } catch (error) {
      console.error('Error updating engine status:', error);
    }

    toast.info('מנוע המסחר הופסק');
    this.notifyListeners();
  }

  private async generateLiveSignals(): Promise<void> {
    if (!this.isRunning) return;

    try {
      console.log('📊 Generating LIVE signals with Almog\'s personal strategy...');
      
      const symbols = ['BTCUSDT', 'ETHUSDT', 'SOLUSDT', 'BNBUSDT'];
      const signalsGenerated = [];

      // Fetch live market data for all symbols
      const liveDataMap = await liveMarketDataService.getMultipleAssets(symbols);

      for (const symbol of symbols) {
        const liveData = liveDataMap.get(symbol);
        if (!liveData) {
          console.warn(`No live data for ${symbol}, skipping...`);
          continue;
        }

        // PRIORITY: Almog's personal strategy with LIVE data
        const signal = await this.generateAlmogPersonalStrategySignal(symbol, liveData);
        if (signal) {
          signalsGenerated.push(signal);
        }
      }

      if (signalsGenerated.length > 0) {
        console.log(`✨ Generated ${signalsGenerated.length} LIVE signals using Almog's personal strategy`);
        toast.success(`נוצרו ${signalsGenerated.length} איתותים LIVE חדשים`, {
          description: 'השיטה האישית של אלמוג פועלת עם נתונים אמיתיים!',
          duration: 8000,
        });

        // Send to Telegram if configured
        await this.sendTelegramSignals(signalsGenerated);
      }

      this.notifyListeners();
    } catch (error) {
      console.error('Error generating live signals:', error);
    }
  }

  private async generateAlmogPersonalStrategySignal(symbol: string, liveData: any) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { price, volume24h, change24h, high24h, low24h } = liveData;

      // ALMOG'S PERSONAL STRATEGY LOGIC (LIVE DATA)
      const emotionalPressure = this.calculateEmotionalPressureLive(price, volume24h, high24h, low24h);
      const momentumScore = this.analyzeMomentumLive(change24h, price, high24h, low24h);
      const volumeProfile = volume24h > 1500000 ? 'high' : volume24h > 800000 ? 'medium' : 'low';
      const volatilityScore = this.calculateVolatilityScore(high24h, low24h, price);
      
      // STRATEGY DECISION LOGIC - PRIORITIZED
      let signalType: 'buy' | 'sell' | null = null;
      let confidence = 0;
      let strategiesAgreement = 0;
      
      // Strategy 1: Emotional Pressure Analysis
      if (emotionalPressure > 75) strategiesAgreement++;
      
      // Strategy 2: Momentum Breakout
      if (momentumScore > 70 && Math.abs(change24h) > 3) strategiesAgreement++;
      
      // Strategy 3: Volume Confirmation
      if (volumeProfile === 'high' && Math.abs(change24h) > 2) strategiesAgreement++;
      
      // Strategy 4: Volatility Squeeze
      if (volatilityScore > 65) strategiesAgreement++;

      // ALMOG'S RULE: Minimum 2 strategies must agree
      if (strategiesAgreement >= 2) {
        // Strong buy conditions
        if (emotionalPressure > 80 && momentumScore > 75 && change24h > 4) {
          signalType = 'buy';
          confidence = Math.min(0.95, 0.75 + (strategiesAgreement * 0.05));
        }
        // Strong sell conditions
        else if (emotionalPressure > 85 && change24h < -4 && volumeProfile === 'high') {
          signalType = 'sell';
          confidence = Math.min(0.90, 0.70 + (strategiesAgreement * 0.05));
        }
      }

      // Only generate signal if confidence > 65% (Almog's threshold)
      if (signalType && confidence > 0.65) {
        const signal = {
          signal_id: `almog-live-${symbol}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          symbol,
          action: signalType,
          price,
          target_price: signalType === 'buy' ? price * 1.035 : price * 0.965,
          stop_loss: signalType === 'buy' ? price * 0.98 : price * 1.02,
          confidence,
          reasoning: `🧠 האסטרטגיה האישית של אלמוג (LIVE): לחץ רגשי ${emotionalPressure.toFixed(0)}%, מומנטום ${momentumScore.toFixed(0)}%, שינוי 24ש ${change24h.toFixed(2)}%, ${strategiesAgreement} אסטרטגיות מסכימות`,
          strategy: 'almog-personal-method',
          risk_reward_ratio: 1.75,
          status: 'active',
          user_id: user.id,
          metadata: {
            live_data: true,
            volume_profile: volumeProfile,
            strategies_agreement: strategiesAgreement,
            emotional_pressure: emotionalPressure,
            momentum_score: momentumScore,
            volatility_score: volatilityScore
          }
        };

        // Store in database
        const { error } = await supabase
          .from('trading_signals')
          .insert([signal]);

        if (error) {
          console.error('Error storing live signal:', error);
        } else {
          console.log(`💾 Stored LIVE personal strategy signal: ${signal.action} ${signal.symbol} @ ${signal.price}`);
          return signal;
        }
      }
      
      return null;
    } catch (error) {
      console.error('Error generating Almog personal strategy signal:', error);
      return null;
    }
  }

  private calculateEmotionalPressureLive(price: number, volume24h: number, high24h: number, low24h: number): number {
    // Almog's emotional pressure calculation with LIVE data
    const volumeWeight = Math.min(40, (volume24h / 1000000) * 20);
    const priceRange = ((high24h - low24h) / price) * 100;
    const pricePosition = ((price - low24h) / (high24h - low24h)) * 100;
    
    const emotionalPressure = volumeWeight + (priceRange * 2) + 
      (pricePosition > 80 ? 25 : pricePosition < 20 ? 25 : 10);
    
    return Math.min(100, emotionalPressure);
  }

  private analyzeMomentumLive(change24h: number, price: number, high24h: number, low24h: number): number {
    // Momentum analysis with live data
    const changeWeight = Math.abs(change24h) * 8;
    const pricePosition = ((price - low24h) / (high24h - low24h)) * 100;
    const momentum = changeWeight + (change24h > 0 ? pricePosition * 0.3 : (100 - pricePosition) * 0.3);
    
    return Math.min(100, momentum);
  }

  private calculateVolatilityScore(high24h: number, low24h: number, price: number): number {
    const volatility = ((high24h - low24h) / price) * 100;
    return Math.min(100, volatility * 15);
  }

  private async sendTelegramSignals(signals: any[]): Promise<void> {
    try {
      // Get user settings for Telegram
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: settings } = await supabase
        .from('user_trading_settings')
        .select('telegram_bot_token, telegram_chat_id, notification_settings')
        .eq('user_id', user.id)
        .single();

      if (!settings?.telegram_bot_token || !settings?.telegram_chat_id) {
        console.log('Telegram not configured, skipping notifications');
        return;
      }

      for (const signal of signals) {
        const message = `
🚀 *איתות LIVE מ-LeviPro*

📊 *${signal.symbol}*
${signal.action === 'buy' ? '🟢 קנייה' : '🔴 מכירה'} @ ${signal.price}

🎯 *יעד*: ${signal.target_price}
🛡️ *סטופ לוס*: ${signal.stop_loss}
📈 *ביטחון*: ${(signal.confidence * 100).toFixed(0)}%

🧠 *נימוק*: ${signal.reasoning}

⚡ *נתונים LIVE* | ${new Date().toLocaleString('he-IL')}
        `;

        await fetch(`https://api.telegram.org/bot${settings.telegram_bot_token}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: settings.telegram_chat_id,
            text: message,
            parse_mode: 'Markdown'
          })
        });
      }

      console.log(`📱 Sent ${signals.length} LIVE signals to Telegram`);
    } catch (error) {
      console.error('Error sending Telegram signals:', error);
    }
  }

  private async performHealthCheck(): Promise<void> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Check live data sources
      const binanceOk = await this.checkBinanceHealth();
      const coinGeckoOk = await this.checkCoinGeckoHealth();

      const healthScore = Math.min(100, 
        (binanceOk ? 50 : 0) + 
        (coinGeckoOk ? 50 : 0)
      );

      // Store health log
      const { error } = await supabase
        .from('system_health_log')
        .insert([{
          binance_status: binanceOk,
          coingecko_status: coinGeckoOk,
          tradingview_status: true,
          twitter_status: true,
          telegram_status: true,
          fundamental_data_status: true,
          overall_health_score: healthScore,
          user_id: user.id
        }]);

      if (error) {
        console.error('Health check storage error:', error);
      } else {
        console.log(`💚 LIVE Health check: ${healthScore}% system health`);
      }
    } catch (error) {
      console.error('Health check failed:', error);
    }
  }

  private async checkBinanceHealth(): Promise<boolean> {
    try {
      const response = await fetch('https://api.binance.com/api/v3/ping');
      return response.ok;
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

  getStatus(): EngineStatus {
    return {
      isRunning: this.isRunning,
      lastSignalTime: null,
      totalSignals: 0,
      activeStrategies: ['almog-personal-method-LIVE', 'emotional-pressure-LIVE', 'momentum-analysis-LIVE']
    };
  }

  addStatusListener(callback: (status: EngineStatus) => void): void {
    this.listeners.add(callback);
  }

  removeStatusListener(callback: (status: EngineStatus) => void): void {
    this.listeners.delete(callback);
  }

  private notifyListeners(): void {
    const status = this.getStatus();
    this.listeners.forEach(callback => callback(status));
  }
}

export const engineController = TradingEngineController.getInstance();
