/**
 * Robust Error Handler - מוודא שהמערכת ממשיכה לעבוד גם עם שגיאות
 */
export class RobustErrorHandler {
  private static errorCounts = new Map<string, number>();
  private static readonly MAX_ERRORS_PER_SYMBOL = 5;
  private static blacklistedSymbols = new Set<string>();

  /**
   * מסנן סמלים בעייתיים
   */
  static filterValidSymbols(symbols: string[]): string[] {
    const knownGoodSymbols = [
      'BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'SOLUSDT', 'XRPUSDT', 
      'ADAUSDT', 'AVAXUSDT', 'DOTUSDT', 'LINKUSDT', 'MATICUSDT',
      'TRXUSDT', 'LTCUSDT', 'ATOMUSDT', 'VETUSDT', 'XLMUSDT'
    ];
    
    return symbols.filter(symbol => {
      // הסר סמלים שחורים
      if (this.blacklistedSymbols.has(symbol)) {
        return false;
      }
      
      // השתמש רק בסמלים מוכרים
      return knownGoodSymbols.includes(symbol);
    });
  }

  /**
   * מטפל בשגיאות מבלי לעצור את הסיסטם
   */
  static async safeExecute<T>(
    operation: () => Promise<T>, 
    symbol: string, 
    fallback?: T
  ): Promise<T | null> {
    try {
      return await operation();
    } catch (error) {
      console.error(`❌ Error in ${symbol}:`, error);
      
      // עדכן מונה שגיאות
      const currentErrors = this.errorCounts.get(symbol) || 0;
      this.errorCounts.set(symbol, currentErrors + 1);
      
      // אם יש יותר מדי שגיאות, הוסף לרשימה שחורה
      if (currentErrors >= this.MAX_ERRORS_PER_SYMBOL) {
        this.blacklistedSymbols.add(symbol);
        console.warn(`⚫ Blacklisted ${symbol} due to repeated errors`);
      }
      
      return fallback || null;
    }
  }

  /**
   * נקה רשימה שחורה (אחת ליום)
   */
  static resetBlacklist() {
    this.blacklistedSymbols.clear();
    this.errorCounts.clear();
    console.log('🔄 Reset error tracking and blacklist');
  }

  /**
   * בדוק אם המערכת עדיין פעילה
   */
  static validateSystemHealth(): boolean {
    const totalBlacklisted = this.blacklistedSymbols.size;
    
    if (totalBlacklisted > 10) {
      console.warn(`⚠️ Many symbols blacklisted: ${totalBlacklisted}`);
      return false;
    }
    
    return true;
  }
}

// איפוס יומי של הרשימה השחורה
setInterval(() => {
  RobustErrorHandler.resetBlacklist();
}, 24 * 60 * 60 * 1000); // כל 24 שעות