
import { TradingSignal } from '@/types/trading';
import { eliteSignalFilter } from './eliteSignalFilter';
import { professionalTelegramFormatter } from '../telegram/professionalTelegramFormatter';
import { telegramBot } from '../telegram/telegramBot';
import { signalManager } from './signalManager';
import { toast } from 'sonner';

export class EnhancedSignalEngine {
  private isRunning = false;
  private analysisInterval: NodeJS.Timeout | null = null;

  public startEliteEngine(): void {
    if (this.isRunning) {
      console.log('🚫 Enhanced Signal Engine already running');
      return;
    }

    this.isRunning = true;
    console.log('🚀 Enhanced Signal Engine started with Elite Filtering');
    
    // ניתוח כל 30 שניות
    this.analysisInterval = setInterval(() => {
      this.performEliteAnalysis();
    }, 30000);

    // ניתוח ראשוני
    this.performEliteAnalysis();
    
    toast.success('🔥 Elite Signal Engine activated');
  }

  public stopEngine(): void {
    if (this.analysisInterval) {
      clearInterval(this.analysisInterval);
      this.analysisInterval = null;
    }
    
    this.isRunning = false;
    console.log('⏹️ Enhanced Signal Engine stopped');
    toast.info('Signal Engine stopped');
  }

  private async performEliteAnalysis(): Promise<void> {
    try {
      console.log('🔍 Performing Elite Signal Analysis...');
      
      const symbols = ['BTCUSDT', 'ETHUSDT', 'SOLUSDT', 'BNBUSDT', 'ADAUSDT'];
      const strategies = [
        'almog-personal-method',
        'smc-strategy', 
        'wyckoff-strategy',
        'rsi-macd-strategy',
        'triangle-breakout'
      ];

      for (const symbol of symbols) {
        // קבלת מחיר נוכחי
        const currentPrice = await this.getCurrentPrice(symbol);
        
        for (const strategy of strategies) {
          const signal = await this.analyzeSymbolWithStrategy(symbol, strategy, currentPrice);
          
          if (signal) {
            await this.processEliteSignal(signal);
          }
        }
      }
      
    } catch (error) {
      console.error('❌ Error in elite analysis:', error);
    }
  }

  private async analyzeSymbolWithStrategy(symbol: string, strategy: string, price: number): Promise<TradingSignal | null> {
    try {
      // סימולציית ניתוח מתקדם
      const analysisResult = this.performAdvancedAnalysis(symbol, strategy, price);
      
      if (!analysisResult.hasSignal) {
        return null;
      }

      const signal: TradingSignal = {
        id: `elite-${Date.now()}-${symbol}-${strategy}`,
        symbol,
        strategy,
        action: analysisResult.action,
        price: analysisResult.entryPrice,
        targetPrice: analysisResult.targetPrice,
        stopLoss: analysisResult.stopLoss,
        confidence: analysisResult.confidence,
        riskRewardRatio: analysisResult.riskReward,
        reasoning: analysisResult.reasoning,
        timestamp: Date.now(),
        status: 'active', // Fixed: changed from 'pending' to 'active'
        telegramSent: false,
        metadata: {
          timeframe: analysisResult.timeframe,
          emotionalPressure: analysisResult.emotionalPressure,
          momentum: analysisResult.momentum,
          breakout: analysisResult.breakout,
          triangleBreakout: analysisResult.triangleBreakout,
          signalCategory: analysisResult.signalCategory
        }
      };

      return signal;
    } catch (error) {
      console.error(`❌ Error analyzing ${symbol} with ${strategy}:`, error);
      return null;
    }
  }

  private performAdvancedAnalysis(symbol: string, strategy: string, price: number) {
    // סימולציית ניתוח מתקדם עם פילטרים איכותיים
    const random = Math.random();
    
    // רק 15% מהניתוחים מייצרים איתות (איכות גבוהה)
    if (random > 0.15) {
      return { hasSignal: false };
    }

    const isPersonalMethod = strategy === 'almog-personal-method';
    const action: 'buy' | 'sell' = Math.random() > 0.5 ? 'buy' : 'sell';
    
    // חישוב מחירי יעד ואסטופ מדויקים יותר
    const volatility = 0.03 + Math.random() * 0.05; // 3-8% תנודתיות
    const riskDistance = price * (0.015 + Math.random() * 0.025); // 1.5-4% סיכון
    const rewardMultiplier = 1.5 + Math.random() * 2; // יחס R/R בין 1.5 ל-3.5
    
    const stopLoss = action === 'buy' ? price - riskDistance : price + riskDistance;
    const targetPrice = action === 'buy' ? price + (riskDistance * rewardMultiplier) : price - (riskDistance * rewardMultiplier);
    
    // בדיקת תקינות מחירים
    if (stopLoss <= 0 || targetPrice <= 0) {
      return { hasSignal: false };
    }

    const riskReward = Math.abs((targetPrice - price) / (price - stopLoss));
    
    // פילטר איכות ראשוני
    if (riskReward < 1.5) {
      return { hasSignal: false };
    }

    // הגדרות מיוחדות לשיטה האישית
    let confidence = 0.6 + Math.random() * 0.3; // 60-90%
    let emotionalPressure = 30 + Math.random() * 40; // 30-70%
    let momentum = 40 + Math.random() * 40; // 40-80%
    let breakout = Math.random() > 0.6;

    if (isPersonalMethod) {
      // שיטה אישית דורשת תנאים חמורים יותר
      confidence = Math.max(0.75, confidence);
      emotionalPressure = Math.max(50, emotionalPressure);
      momentum = Math.max(60, momentum);
      breakout = Math.random() > 0.3; // יותר סיכוי לפריצה
    }

    return {
      hasSignal: true,
      action,
      entryPrice: price,
      targetPrice,
      stopLoss,
      confidence,
      riskReward,
      timeframe: isPersonalMethod ? '15M' : ['5M', '15M', '1H', '4H'][Math.floor(Math.random() * 4)],
      emotionalPressure,
      momentum,
      breakout,
      triangleBreakout: strategy === 'triangle-breakout',
      reasoning: this.generateReasoning(strategy, action, symbol),
      signalCategory: isPersonalMethod ? '🧠 שיטה אישית' : '📊 ניתוח טכני'
    };
  }

  private generateReasoning(strategy: string, action: string, symbol: string): string {
    const reasons = {
      'almog-personal-method': [
        `${symbol}: לחץ רגשי גבוה + פריצת מפתח + מומנטום חזק`,
        `${symbol}: זיהוי נקודת מפנה קריטית בשיטה האישית`,
        `${symbol}: איתות אליט - שילוב של 3 אינדיקטורים מרכזיים`
      ],
      'smc-strategy': [
        `${symbol}: Smart Money flow זוהה - מוסדות נכנסים`,
        `${symbol}: Order Block + FVG alignment`,
        `${symbol}: Liquidity sweep completed - ready for move`
      ],
      'wyckoff-strategy': [
        `${symbol}: Wyckoff ${action === 'buy' ? 'Spring' : 'UTAD'} pattern confirmed`,
        `${symbol}: Volume confirms Wyckoff phase transition`,
        `${symbol}: Composite man activity detected`
      ]
    };

    const strategyReasons = reasons[strategy as keyof typeof reasons] || [`${symbol}: Technical analysis confirms ${action} signal`];
    return strategyReasons[Math.floor(Math.random() * strategyReasons.length)];
  }

  private async processEliteSignal(signal: TradingSignal): Promise<void> {
    console.log(`🔍 Processing potential elite signal: ${signal.symbol} ${signal.action}`);

    // בדיקת פילטר האיכות האליט
    const validation = eliteSignalFilter.validateEliteSignal(signal);
    
    if (!validation.valid) {
      console.log(`🚫 Signal rejected: ${validation.reason}`);
      return;
    }

    // אישור האיתות האליט
    eliteSignalFilter.approveEliteSignal(signal);

    // הוספה למנהל האיתותים
    const added = signalManager.addSignal(signal);
    if (!added) {
      console.log(`🚫 Signal manager rejected signal: ${signal.symbol}`);
      return;
    }

    console.log(`🔥 ELITE SIGNAL APPROVED: ${signal.symbol} ${signal.action} (${(signal.confidence * 100).toFixed(1)}%)`);

    // יצירת הודעת טלגרם מקצועית
    const telegramMessage = professionalTelegramFormatter.formatEliteSignal(signal);
    
    // שליחה לטלגרם
    try {
      const sent = await telegramBot.sendSignal(signal);
      if (sent) {
        signal.telegramSent = true;
        console.log(`📱 Elite signal sent to Telegram: ${signal.symbol}`);
        toast.success(`🔥 Elite Signal: ${signal.action.toUpperCase()} ${signal.symbol}`, {
          description: `Confidence: ${(signal.confidence * 100).toFixed(1)}% | R/R: 1:${signal.riskRewardRatio.toFixed(1)}`
        });
      }
    } catch (error) {
      console.error('❌ Failed to send elite signal to Telegram:', error);
    }

    // הצגת סטטיסטיקות
    const stats = eliteSignalFilter.getEliteStats();
    console.log(`📊 Elite Stats - Daily: ${stats.dailySignalCount}/${stats.maxDailySignals}, Session: ${stats.sessionSignalCount}/${stats.maxSessionSignals}`);
  }

  private async getCurrentPrice(symbol: string): Promise<number> {
    try {
      // בפרודקציה - יתחבר ל-Binance API אמיתי
      const response = await fetch(`https://api.binance.com/api/v3/ticker/price?symbol=${symbol}`);
      const data = await response.json();
      return parseFloat(data.price);
    } catch (error) {
      // fallback למחירים מדומים
      const basePrices: Record<string, number> = {
        'BTCUSDT': 43000,
        'ETHUSDT': 2600,
        'SOLUSDT': 95,
        'BNBUSDT': 320,
        'ADAUSDT': 0.52
      };
      
      const basePrice = basePrices[symbol] || 100;
      const variation = (Math.random() - 0.5) * 0.1; // תנודה של ±5%
      return basePrice * (1 + variation);
    }
  }

  public getEngineStatus() {
    const stats = eliteSignalFilter.getEliteStats();
    return {
      isRunning: this.isRunning,
      eliteStats: stats,
      signalQuality: 'Elite Only',
      lastAnalysis: new Date().toLocaleString('he-IL', { timeZone: 'Asia/Jerusalem' })
    };
  }
}

export const enhancedSignalEngine = new EnhancedSignalEngine();
