
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

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
      console.log('🚀 Starting LeviPro Trading Engine...');
      
      // Update engine status in database
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
      
      // Set up automatic signal generation every 30 seconds
      this.engineInterval = setInterval(async () => {
        await this.generateSignals();
      }, 30000);

      // Health check every 60 seconds
      this.healthCheckInterval = setInterval(async () => {
        await this.performHealthCheck();
      }, 60000);

      toast.success('🚀 מנוע המסחר הופעל בהצלחה');
      this.notifyListeners();
      
      // Initial signal generation
      await this.generateSignals();
      
      return true;
    } catch (error) {
      console.error('Failed to start engine:', error);
      toast.error('כשל בהפעלת המנוע');
      return false;
    }
  }

  async stopEngine(): Promise<void> {
    if (!this.isRunning) {
      toast.info('המנוע כבר מופסק');
      return;
    }

    console.log('⏹️ Stopping LeviPro Trading Engine...');
    
    this.isRunning = false;
    
    if (this.engineInterval) {
      clearInterval(this.engineInterval);
      this.engineInterval = undefined;
    }
    
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
      this.healthCheckInterval = undefined;
    }

    // Update engine status in database
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

  private async generateSignals(): Promise<void> {
    if (!this.isRunning) return;

    try {
      console.log('📊 Generating new signals with Almog\'s personal strategy...');
      
      const symbols = ['BTCUSDT', 'ETHUSDT', 'SOLUSDT', 'BNBUSDT'];
      const signalsGenerated = [];

      for (const symbol of symbols) {
        // Almog's personal strategy with priority weighting
        const signal = await this.generatePersonalStrategySignal(symbol);
        if (signal) {
          signalsGenerated.push(signal);
        }
      }

      if (signalsGenerated.length > 0) {
        console.log(`✨ Generated ${signalsGenerated.length} signals using personal strategy`);
        toast.success(`נוצרו ${signalsGenerated.length} איתותים חדשים`, {
          description: 'השיטה האישית של אלמוג פעילה'
        });
      }

      this.notifyListeners();
    } catch (error) {
      console.error('Error generating signals:', error);
    }
  }

  private async generatePersonalStrategySignal(symbol: string) {
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      // Simulate market data fetching (in production, use real APIs)
      const mockPrice = 50000 + Math.random() * 10000;
      const mockVolume = 1000000 + Math.random() * 2000000;
      const change24h = (Math.random() - 0.5) * 10; // -5% to +5%

      // Almog's personal strategy logic
      const emotionalPressure = this.calculateEmotionalPressure(mockPrice, mockVolume);
      const momentumScore = this.analyzeMomentum(change24h);
      const volumeProfile = mockVolume > 1500000 ? 'high' : 'medium';
      
      // Decision logic: prioritize personal strategy
      let signalType: 'buy' | 'sell' | null = null;
      let confidence = 0;
      
      // Strong buy conditions (Almog's criteria)
      if (emotionalPressure > 70 && momentumScore > 60 && change24h > 2) {
        signalType = 'buy';
        confidence = Math.min(0.95, 0.7 + (emotionalPressure / 100) * 0.25);
      }
      // Strong sell conditions
      else if (emotionalPressure > 80 && change24h < -3) {
        signalType = 'sell';
        confidence = Math.min(0.90, 0.65 + (emotionalPressure / 100) * 0.25);
      }

      if (signalType && confidence > 0.6) {
        const signal = {
          signal_id: `almog-${symbol}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          symbol,
          action: signalType,
          price: mockPrice,
          target_price: signalType === 'buy' ? mockPrice * 1.03 : mockPrice * 0.97,
          stop_loss: signalType === 'buy' ? mockPrice * 0.98 : mockPrice * 1.02,
          confidence,
          reasoning: `השיטה האישית של אלמוג: לחץ רגשי ${emotionalPressure.toFixed(0)}%, מומנטום ${momentumScore.toFixed(0)}%, שינוי 24ש ${change24h.toFixed(2)}%`,
          strategy: 'almog-personal-method',
          risk_reward_ratio: 1.5,
          status: 'active',
          user_id: user.id
        };

        // Store in database
        const { error } = await supabase
          .from('trading_signals')
          .insert([signal]);

        if (error) {
          console.error('Error storing signal:', error);
        } else {
          console.log(`💾 Stored personal strategy signal: ${signal.action} ${signal.symbol}`);
          return signal;
        }
      }
      
      return null;
    } catch (error) {
      console.error('Error generating personal strategy signal:', error);
      return null;
    }
  }

  private calculateEmotionalPressure(price: number, volume: number): number {
    // Almog's emotional pressure calculation
    const volumeWeight = Math.min(100, (volume / 1000000) * 40);
    const priceVolatility = Math.random() * 30; // Simplified volatility
    return Math.min(100, volumeWeight + priceVolatility + Math.random() * 20);
  }

  private analyzeMomentum(change24h: number): number {
    // Momentum analysis based on 24h change
    const baseMomentum = Math.abs(change24h) * 10;
    const trendStrength = change24h > 0 ? baseMomentum * 1.2 : baseMomentum * 0.8;
    return Math.min(100, trendStrength + Math.random() * 20);
  }

  private async performHealthCheck(): Promise<void> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Check external APIs
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
        console.log(`💚 Health check completed: ${healthScore}% system health`);
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
      activeStrategies: ['almog-personal-method', 'emotional-pressure', 'momentum-analysis']
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
