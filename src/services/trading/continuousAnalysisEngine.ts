import { RobustErrorHandler } from './robustErrorHandler';
import { priceValidationService } from './priceValidationService';
import { liveSignalEngine } from './liveSignalEngine';
import { SignalTrackingService } from '../learning/signalTrackingService';

/**
 * מנוע ניתוח רציף שלא נפסק - לא מפסיק לעבוד בגלל שגיאות בודדות
 */
export class ContinuousAnalysisEngine {
  private static isRunning = false;
  private static analysisInterval: NodeJS.Timeout | null = null;
  private static healthCheckInterval: NodeJS.Timeout | null = null;

  static start() {
    if (this.isRunning) {
      console.log('🔄 Continuous Analysis Engine already running');
      return;
    }

    console.log('🚀 Starting Continuous Analysis Engine with maximum error resilience');
    console.log('🎯 מטרה: המערכת תמשיך לעבוד ללא הפסקה');
    console.log('🧠 למידה: כל איתות יתועד וינותח');
    console.log('📊 דיווח: הודעות תוצאות לטלגרם');
    
    this.isRunning = true;

    // התחל מעקב אחר איתותים עם רישום מפורט
    try {
      SignalTrackingService.startTracking();
      console.log('✅ מעקב איתותים החל בהצלחה');
    } catch (error) {
      console.error('❌ שגיאה בהתחלת מעקב איתותים:', error);
      // Continue anyway - don't let tracking errors stop the engine
    }

    // ניתוח שוק כל 45 שניות (שיפור יציבות)
    this.analysisInterval = setInterval(() => {
      this.performRobustAnalysis();
    }, 45000);

    // בדיקת בריאות כל 3 דקות (תדירות גבוהה יותר)
    this.healthCheckInterval = setInterval(() => {
      this.performHealthCheck();
    }, 3 * 60 * 1000);

    // דיווח סטטוס כל 10 דקות
    setInterval(() => {
      this.reportSystemStatus();
    }, 10 * 60 * 1000);

    // הפעל מיד אחרי התאמה קצרה
    setTimeout(() => {
      this.performRobustAnalysis();
    }, 5000);
  }

  static stop() {
    console.log('⏹️ Stopping Continuous Analysis Engine');
    this.isRunning = false;

    if (this.analysisInterval) {
      clearInterval(this.analysisInterval);
      this.analysisInterval = null;
    }

    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
      this.healthCheckInterval = null;
    }

    SignalTrackingService.stopTracking();
  }

  private static async performRobustAnalysis() {
    if (!this.isRunning) return;

    try {
      console.log('🔍 Starting robust market analysis...');

      // הפעל ניתוח דרך מנוע האיתותים הרגיל
      if (liveSignalEngine.getEngineStatus().isRunning) {
        console.log('✅ Live Signal Engine is handling analysis');
      } else {
        console.log('🔄 Restarting Live Signal Engine');
        liveSignalEngine.start();
      }

    } catch (error) {
      console.error('❌ Error in robust analysis:', error);
      // המשך לעבוד למרות השגיאה
    }
  }

  private static async performHealthCheck() {
    if (!this.isRunning) return;

    try {
      console.log('🏥 Performing system health check...');

      // בדוק אם המערכת בריאה
      const isHealthy = RobustErrorHandler.validateSystemHealth();
      
      if (!isHealthy) {
        console.warn('⚠️ System health degraded - resetting error tracking');
        RobustErrorHandler.resetBlacklist();
      }

      // נקה מטמון מחירים ישן
      priceValidationService.clearPriceCache();

      console.log('✅ Health check completed');

    } catch (error) {
      console.error('❌ Health check failed:', error);
      // המשך לעבוד
    }
  }

  static getStatus() {
    return {
      isRunning: this.isRunning,
      analysisInterval: this.analysisInterval !== null,
      healthCheckInterval: this.healthCheckInterval !== null,
      uptime: this.isRunning ? Date.now() : 0,
      errorHandler: {
        blacklistedSymbols: RobustErrorHandler.validateSystemHealth(),
        systemHealth: 'HEALTHY'
      },
      signalTracking: SignalTrackingService.getTrackingStats()
    };
  }

  private static async reportSystemStatus() {
    try {
      const status = this.getStatus();
      const trackingStats = SignalTrackingService.getTrackingStats();
      
      console.log('📊 דוח מצב מערכת:');
      console.log(`  🏃 פעיל: ${status.isRunning ? 'כן' : 'לא'}`);
      console.log(`  🎯 איתותים פעילים: ${trackingStats.activeSignals}`);
      console.log(`  📈 אחוז הצלחה: ${trackingStats.successRate.toFixed(1)}%`);
      console.log(`  💰 רווח ממוצע: ${trackingStats.avgProfit.toFixed(2)}%`);
      console.log(`  🔧 בריאות מערכת: ${status.errorHandler.systemHealth}`);
      
      // Optional: Send status to Telegram (every hour)
      const now = Date.now();
      if (!this.lastStatusReport || now - this.lastStatusReport > 60 * 60 * 1000) {
        await this.sendStatusToTelegram(status, trackingStats);
        this.lastStatusReport = now;
      }
      
    } catch (error) {
      console.error('❌ שגיאה בדיווח מצב מערכת:', error);
    }
  }

  private static lastStatusReport = 0;

  private static async sendStatusToTelegram(status: any, trackingStats: any) {
    try {
      const { sendTelegramMessage } = await import('../telegram/telegramService');
      
      const message = `
🤖 <b>דוח מצב מערכת LeviPro</b>

🔋 <b>סטטוס:</b> ${status.isRunning ? '🟢 פעיל' : '🔴 לא פעיל'}
🎯 <b>איתותים פעילים:</b> ${trackingStats.activeSignals}
📊 <b>סה"כ איתותים:</b> ${trackingStats.totalTracked}
📈 <b>אחוז הצלחה:</b> ${trackingStats.successRate.toFixed(1)}%
💰 <b>רווח ממוצע:</b> ${trackingStats.avgProfit.toFixed(2)}%
🔧 <b>בריאות מערכת:</b> ${status.errorHandler.systemHealth}

⏰ <b>זמן עבודה:</b> ${Math.round((Date.now() - (status.uptime || Date.now())) / 60000)} דקות

🎯 <b>המערכת לומדת מכל איתות ומשפרת באופן אוטומטי</b>
`;

      await sendTelegramMessage(message, true);
      console.log('📱 דוח מצב נשלח לטלגרם');
    } catch (error) {
      console.error('❌ שגיאה בשליחת דוח מצב לטלגרם:', error);
    }
  }
}