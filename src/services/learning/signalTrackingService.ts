import { supabase } from '@/integrations/supabase/client';
import { sendTelegramMessage } from '@/services/telegram/telegramService';
import { signalOutcomeTracker } from '@/services/ai/signalOutcomeTracker';
import { FeedbackLearningEngine } from '@/services/ai/feedbackLearningEngine';

interface TrackedSignal {
  signal_id: string;
  symbol: string;
  strategy: string;
  action: 'BUY' | 'SELL';
  entry_price: number;
  target_price: number;
  stop_loss: number;
  confidence: number;
  risk_reward_ratio: number;
  sent_at: number;
  status: 'active' | 'profit' | 'loss' | 'cancelled';
  exit_price?: number;
  profit_percent?: number;
  exit_time?: number;
  duration_hours?: number;
}

interface LearningInsight {
  strategy: string;
  success_rate: number;
  avg_profit: number;
  avg_loss: number;
  total_signals: number;
  last_improvement: string;
}

export class SignalTrackingService {
  private static trackedSignals = new Map<string, TrackedSignal>();
  private static readonly CHECK_INTERVAL = 60000; // 1 minute
  private static isRunning = false;

  public static startTracking() {
    if (this.isRunning) return;
    
    this.isRunning = true;
    console.log('🎯 התחלת מעקב אחר איתותים...');
    
    // Check signals every minute
    setInterval(() => {
      this.checkActiveSignals();
    }, this.CHECK_INTERVAL);
  }

  public static stopTracking() {
    this.isRunning = false;
    console.log('⏹️ עצירת מעקב אחר איתותים');
  }

  public static addSignalToTracking(signal: any) {
    const trackedSignal: TrackedSignal = {
      signal_id: signal.signal_id || signal.id,
      symbol: signal.symbol,
      strategy: signal.strategy,
      action: signal.action,
      entry_price: signal.entry_price || signal.price,
      target_price: signal.target_price,
      stop_loss: signal.stop_loss,
      confidence: signal.confidence,
      risk_reward_ratio: signal.risk_reward_ratio,
      sent_at: Date.now(),
      status: 'active'
    };

    this.trackedSignals.set(trackedSignal.signal_id, trackedSignal);
    console.log(`🎯 איתות נוסף למעקב: ${signal.symbol} (${signal.strategy})`);
    
    // Store in database
    this.storeSignalInDB(trackedSignal);
  }

  private static async storeSignalInDB(signal: TrackedSignal) {
    try {
      const { error } = await supabase
        .from('signal_history')
        .insert({
          signal_id: signal.signal_id,
          user_id: (await supabase.auth.getUser()).data.user?.id,
          symbol: signal.symbol,
          strategy: signal.strategy,
          action: signal.action,
          entry_price: signal.entry_price,
          target_price: signal.target_price,
          stop_loss: signal.stop_loss,
          confidence: signal.confidence,
          risk_reward_ratio: signal.risk_reward_ratio,
          reasoning: `Auto-tracked signal from ${signal.strategy}`
        });

      if (error) {
        console.error('❌ שגיאה בשמירת איתות למסד נתונים:', error);
      }
    } catch (error) {
      console.error('❌ שגיאה בחיבור למסד נתונים:', error);
    }
  }

  private static async checkActiveSignals() {
    const activeSignals = Array.from(this.trackedSignals.values())
      .filter(signal => signal.status === 'active');

    if (activeSignals.length === 0) return;

    console.log(`🔍 בדיקת ${activeSignals.length} איתותים פעילים...`);

    for (const signal of activeSignals) {
      await this.checkSignalOutcome(signal);
    }
  }

  private static async checkSignalOutcome(signal: TrackedSignal) {
    try {
      // Get current price from CoinGecko
      const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${this.getCoinGeckoId(signal.symbol)}&vs_currencies=usd`);
      const data = await response.json();
      
      const coinId = this.getCoinGeckoId(signal.symbol);
      const currentPrice = data[coinId]?.usd;
      
      if (!currentPrice) return;

      const now = Date.now();
      const durationHours = (now - signal.sent_at) / (1000 * 60 * 60);

      // Check if signal hit target or stop loss
      let outcome: 'profit' | 'loss' | null = null;
      let exitPrice = currentPrice;

      if (signal.action === 'BUY') {
        if (currentPrice >= signal.target_price) {
          outcome = 'profit';
        } else if (currentPrice <= signal.stop_loss) {
          outcome = 'loss';
        }
      } else { // SELL
        if (currentPrice <= signal.target_price) {
          outcome = 'profit';
        } else if (currentPrice >= signal.stop_loss) {
          outcome = 'loss';
        }
      }

      // Auto-close after 24 hours if no outcome
      if (!outcome && durationHours > 24) {
        outcome = currentPrice > signal.entry_price ? 'profit' : 'loss';
        exitPrice = currentPrice;
      }

      if (outcome) {
        await this.processSignalOutcome(signal, outcome, exitPrice, durationHours);
      }

    } catch (error) {
      console.error(`❌ שגיאה בבדיקת איתות ${signal.symbol}:`, error);
    }
  }

  private static async processSignalOutcome(
    signal: TrackedSignal, 
    outcome: 'profit' | 'loss', 
    exitPrice: number, 
    durationHours: number
  ) {
    const profitPercent = signal.action === 'BUY' 
      ? ((exitPrice - signal.entry_price) / signal.entry_price) * 100
      : ((signal.entry_price - exitPrice) / signal.entry_price) * 100;

    // Update tracked signal
    signal.status = outcome;
    signal.exit_price = exitPrice;
    signal.profit_percent = profitPercent;
    signal.exit_time = Date.now();
    signal.duration_hours = durationHours;

    console.log(`📊 תוצאת איתות ${signal.symbol}: ${outcome} (${profitPercent.toFixed(2)}%)`);

    // Update database
    await this.updateSignalInDB(signal);

    // Send result to Telegram
    await this.sendResultToTelegram(signal);

    // Record learning data
    await this.recordLearningData(signal);

    // Remove from active tracking
    this.trackedSignals.delete(signal.signal_id);
  }

  private static async updateSignalInDB(signal: TrackedSignal) {
    try {
      const { error } = await supabase
        .from('signal_history')
        .update({
          outcome: signal.status,
          exit_price: signal.exit_price,
          actual_profit_loss: signal.profit_percent,
          closed_at: new Date(signal.exit_time!).toISOString(),
          was_correct: signal.status === 'profit',
          performance_score: signal.status === 'profit' 
            ? signal.confidence * (signal.profit_percent! / 10)
            : signal.confidence * (signal.profit_percent! / 10)
        })
        .eq('signal_id', signal.signal_id);

      if (error) {
        console.error('❌ שגיאה בעדכון איתות במסד נתונים:', error);
      }
    } catch (error) {
      console.error('❌ שגיאה בחיבור למסד נתונים:', error);
    }
  }

  private static async sendResultToTelegram(signal: TrackedSignal) {
    const isSuccess = signal.status === 'profit';
    const emoji = isSuccess ? '✅' : '❌';
    const resultText = isSuccess ? 'רווח' : 'הפסד';
    const profitText = signal.profit_percent! > 0 ? `+${signal.profit_percent!.toFixed(2)}%` : `${signal.profit_percent!.toFixed(2)}%`;

    const message = `
${emoji} <b>תוצאת איתות - ${resultText.toUpperCase()}</b>

💰 <b>${signal.symbol}</b>
📈 פעולה: ${signal.action}
💵 מחיר כניסה: $${signal.entry_price.toFixed(4)}
🎯 מחיר יציאה: $${signal.exit_price!.toFixed(4)}
📊 תוצאה: <b>${profitText}</b>
⏱️ משך זמן: ${signal.duration_hours!.toFixed(1)} שעות
🤖 אסטרטגיה: ${signal.strategy}
🎯 ביטחון: ${signal.confidence}%

${isSuccess ? '🎉' : '📚'} <i>${isSuccess ? 'כל הכבוד! האסטרטגיה עבדה מצוין' : 'למידה - נשפר באיתות הבא'}</i>
`;

    try {
      await sendTelegramMessage(message, true);
      console.log(`📱 תוצאה נשלחה לטלגרם: ${signal.symbol} (${resultText})`);
    } catch (error) {
      console.error('❌ שגיאה בשליחה לטלגרם:', error);
    }
  }

  private static async recordLearningData(signal: TrackedSignal) {
    try {
      // Track outcome in SignalOutcomeTracker
      signalOutcomeTracker.trackOutcome(signal.signal_id, {
        strategy: signal.strategy,
        success: signal.status === 'profit',
        profitPercent: signal.profit_percent,
        duration: signal.duration_hours! * 60 // convert to minutes
      });

      // Record in FeedbackLearningEngine
      await FeedbackLearningEngine.recordSignalOutcome({
        signalId: signal.signal_id,
        symbol: signal.symbol,
        strategy: signal.strategy,
        marketConditions: {},
        outcome: signal.status as 'profit' | 'loss',
        profitPercent: signal.profit_percent!,
        timeToTarget: signal.duration_hours!,
        confidence: signal.confidence,
        actualConfidence: signal.status === 'profit' ? signal.confidence + 10 : signal.confidence - 10
      });

      console.log(`🧠 נתוני למידה נרשמו לאיתות ${signal.symbol}`);
    } catch (error) {
      console.error('❌ שגיאה ברישום נתוני למידה:', error);
    }
  }

  private static getCoinGeckoId(symbol: string): string {
    const symbolMap: Record<string, string> = {
      'BTCUSDT': 'bitcoin',
      'ETHUSDT': 'ethereum',
      'BNBUSDT': 'binancecoin',
      'SOLUSDT': 'solana',
      'ADAUSDT': 'cardano',
      'DOTUSDT': 'polkadot',
      'LINKUSDT': 'chainlink',
      'MATICUSDT': 'matic-network',
      'AVAXUSDT': 'avalanche-2',
      'ATOMUSDT': 'cosmos'
    };
    
    return symbolMap[symbol] || symbol.replace('USDT', '').toLowerCase();
  }

  public static getTrackingStats() {
    const signals = Array.from(this.trackedSignals.values());
    const activeCount = signals.filter(s => s.status === 'active').length;
    const completedSignals = signals.filter(s => s.status !== 'active');
    const profitableSignals = completedSignals.filter(s => s.status === 'profit');
    
    return {
      activeSignals: activeCount,
      totalTracked: signals.length,
      successRate: completedSignals.length > 0 ? (profitableSignals.length / completedSignals.length) * 100 : 0,
      avgProfit: profitableSignals.length > 0 
        ? profitableSignals.reduce((acc, s) => acc + (s.profit_percent || 0), 0) / profitableSignals.length 
        : 0,
      isRunning: this.isRunning
    };
  }

  public static async generateLearningReport(): Promise<string> {
    const adaptiveStats = signalOutcomeTracker.getLearningInsights();
    const strategyPerformance = signalOutcomeTracker.getStrategyPerformance();
    
    let report = `
📚 <b>דוח למידה אוטומטי</b>

🎯 <b>סטטיסטיקות כלליות:</b>
• אסטרטגיות במעקב: ${adaptiveStats.totalStrategiesTracked}
• איתותים שנותחו: ${adaptiveStats.totalOutcomesRecorded}
• עדכון אחרון: ${new Date(adaptiveStats.lastUpdate).toLocaleString('he-IL')}

📊 <b>ביצועי אסטרטגיות:</b>
`;

    for (const [strategy, perf] of Object.entries(strategyPerformance)) {
      report += `
• <b>${strategy}</b>:
  ✅ הצלחה: ${(perf.successRate * 100).toFixed(1)}% (${perf.successfulSignals}/${perf.totalSignals})
  📈 רווח ממוצע: ${perf.avgProfitPercent?.toFixed(2)}%
  📉 הפסד ממוצע: ${perf.avgLossPercent?.toFixed(2)}%
  ⚖️ משקל נוכחי: ${perf.weight.toFixed(2)}
`;
    }

    report += `
🧠 <b>לקחים שנלמדו:</b>
• המערכת מתאמצת אוטומטית בהתאם לביצועים
• אסטרטגיות מצליחות מקבלות משקל גבוה יותר
• למידה מתמשכת ושיפור איכות האיתותים
`;

    return report;
  }

  public static async sendLearningReport() {
    try {
      const report = await this.generateLearningReport();
      await sendTelegramMessage(report, true);
      console.log('📊 דוח למידה נשלח לטלגרם');
    } catch (error) {
      console.error('❌ שגיאה בשליחת דוח למידה:', error);
    }
  }
}

// Auto-start tracking in development
if (typeof window !== 'undefined') {
  SignalTrackingService.startTracking();
  
  // Send learning report every 6 hours
  setInterval(() => {
    SignalTrackingService.sendLearningReport();
  }, 6 * 60 * 60 * 1000);
}

export const signalTracker = SignalTrackingService;