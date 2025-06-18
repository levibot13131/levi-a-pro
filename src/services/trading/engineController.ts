
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
      
      // Call the edge function to start the engine
      const { data, error } = await supabase.functions.invoke('trading-signals-engine', {
        body: { action: 'start' }
      });

      if (error) {
        console.error('Engine start error:', error);
        toast.error('שגיאה בהפעלת המנוע');
        return false;
      }

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

    toast.info('מנוע המסחר הופסק');
    this.notifyListeners();
  }

  private async generateSignals(): Promise<void> {
    if (!this.isRunning) return;

    try {
      console.log('📊 Generating new signals...');
      
      const { data, error } = await supabase.functions.invoke('trading-signals-engine', {
        body: { action: 'analyze' }
      });

      if (error) {
        console.error('Signal generation error:', error);
        return;
      }

      if (data?.signals && data.signals.length > 0) {
        console.log(`✨ Generated ${data.signals.length} new signals`);
        
        // Store signals in database
        for (const signal of data.signals) {
          await this.storeSignal(signal);
        }
        
        this.notifyListeners();
      }
    } catch (error) {
      console.error('Error generating signals:', error);
    }
  }

  private async storeSignal(signalData: any): Promise<void> {
    try {
      const signal = {
        symbol: signalData.symbol,
        action: signalData.signal_type.toLowerCase(),
        price: signalData.price,
        target_price: signalData.price * (signalData.signal_type === 'BUY' ? 1.03 : 0.97),
        stop_loss: signalData.price * (signalData.signal_type === 'BUY' ? 0.98 : 1.02),
        confidence: signalData.strength / 100,
        reasoning: `Signal generated based on ${signalData.change24h > 0 ? 'positive' : 'negative'} momentum: ${signalData.change24h.toFixed(2)}%`,
        strategy: 'momentum-analysis',
        risk_reward_ratio: 1.5,
        status: 'active',
        user_id: '00000000-0000-0000-0000-000000000000' // Default for system signals
      };

      const { error } = await supabase
        .from('trading_signals')
        .insert([signal]);

      if (error) {
        console.error('Error storing signal:', error);
      } else {
        console.log(`💾 Stored signal: ${signal.action} ${signal.symbol}`);
      }
    } catch (error) {
      console.error('Failed to store signal:', error);
    }
  }

  private async performHealthCheck(): Promise<void> {
    try {
      // Check Binance API
      const binanceResponse = await fetch('https://api.binance.com/api/v3/ping');
      const binanceOk = binanceResponse.ok;

      // Check CoinGecko API
      const coinGeckoResponse = await fetch('https://api.coingecko.com/api/v3/ping');
      const coinGeckoOk = coinGeckoResponse.ok;

      // Store health status
      const { error } = await supabase
        .from('system_health_log')
        .insert([{
          binance_status: binanceOk,
          coingecko_status: coinGeckoOk,
          tradingview_status: true, // Placeholder
          twitter_status: true, // Placeholder
          telegram_status: true, // Placeholder
          fundamental_data_status: true, // Placeholder
          overall_health_score: (binanceOk ? 20 : 0) + (coinGeckoOk ? 20 : 0) + 60,
          user_id: '00000000-0000-0000-0000-000000000000'
        }]);

      if (error) {
        console.error('Health check storage error:', error);
      }
    } catch (error) {
      console.error('Health check failed:', error);
    }
  }

  getStatus(): EngineStatus {
    return {
      isRunning: this.isRunning,
      lastSignalTime: null, // TODO: Track from database
      totalSignals: 0, // TODO: Get from database
      activeStrategies: ['momentum-analysis', 'volume-spike', 'rsi-divergence']
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
