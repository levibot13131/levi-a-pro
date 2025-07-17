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

    console.log('🚀 Starting Continuous Analysis Engine with error resilience');
    this.isRunning = true;

    // התחל מעקב אחר איתותים
    SignalTrackingService.startTracking();

    // ניתוח שוק כל 30 שניות
    this.analysisInterval = setInterval(() => {
      this.performRobustAnalysis();
    }, 30000);

    // בדיקת בריאות כל 5 דקות
    this.healthCheckInterval = setInterval(() => {
      this.performHealthCheck();
    }, 5 * 60 * 1000);

    // הפעל מיד
    this.performRobustAnalysis();
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
      uptime: this.isRunning ? Date.now() : 0
    };
  }
}