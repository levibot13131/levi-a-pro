
import { PricePoint } from '@/types/asset';
import { generateSignalsFromHistory } from '@/services/backtesting/signals';
import { sendAlert } from '@/services/tradingView/tradingViewAlertService';
import { getAlertDestinations } from '@/services/tradingView/tradingViewAlertService';
import { toast } from 'sonner';
import { BacktestSettings } from '../types';

// מאגר האיתותים
let storedSignals: any[] = [];

// סטטוס ריצה
let isRunning = false;
let analysisIntervalId: number | null = null;
let checkingAssets: string[] = [];

/**
 * התחלת ניתוח בזמן אמת
 */
export const startRealTimeAnalysis = (
  assetIds: string[],
  settings: Partial<BacktestSettings>
): { stop: () => void } => {
  if (isRunning) {
    console.log('Real-time analysis already running');
    return { stop: stopRealTimeAnalysis };
  }

  if (!assetIds || assetIds.length === 0) {
    console.error('No assets specified for real-time analysis');
    return { stop: () => {} };
  }

  checkingAssets = [...assetIds];
  isRunning = true;
  console.log('Starting real-time analysis for assets:', checkingAssets);

  // הגדרות ברירת מחדל
  const defaultSettings = {
    strategy: settings.strategy || 'A.A',
    timeframe: settings.timeframe || '1d'
  };

  // פונקציה לקבלת נתוני מחיר (מדמה API חיצוני)
  const fetchPriceData = async (assetId: string): Promise<PricePoint[]> => {
    // בפרויקט אמיתי, כאן היינו מתחברים ל-API אמיתי לקבלת נתונים
    // כרגע נייצר נתונים אקראיים לצורך הדגמה
    const now = Date.now();
    const priceData: PricePoint[] = [];
    
    let basePrice = 0;
    switch (assetId.toLowerCase()) {
      case 'bitcoin':
        basePrice = 68000 + (Math.random() * 2000);
        break;
      case 'ethereum':
        basePrice = 3300 + (Math.random() * 200);
        break;
      default:
        basePrice = 100 + (Math.random() * 20);
    }
    
    // ייצור נתוני מחיר אחרונים
    for (let i = 30; i >= 0; i--) {
      const timestamp = now - (i * 60 * 60 * 1000); // שעה אחת לכל נקודה
      const random = Math.random() * 0.05 - 0.025; // תנודה של ±2.5%
      const price = basePrice * (1 + random);
      
      priceData.push({
        timestamp,
        price
      });
    }
    
    return priceData;
  };

  // הגדרת אינטרוול לבדיקה
  analysisIntervalId = window.setInterval(async () => {
    for (const assetId of checkingAssets) {
      try {
        // קבלת נתוני מחיר עדכניים
        const priceData = await fetchPriceData(assetId);
        
        // ייצור איתותים מהנתונים
        const signals = await generateSignalsFromHistory(
          priceData,
          defaultSettings.strategy,
          assetId
        );
        
        // בדיקה אם יש איתותים חדשים
        if (signals.length > 0) {
          const latestSignals = signals.filter(s => {
            // בדיקה אם האיתות כבר נשמר
            const isNew = !storedSignals.some(
              existing => existing.id === s.id
            );
            return isNew;
          });
          
          if (latestSignals.length > 0) {
            // הוספת איתותים חדשים למאגר
            storedSignals = [...latestSignals, ...storedSignals].slice(0, 100);
            
            // שליחת התראות על איתותים חזקים בלבד
            for (const signal of latestSignals) {
              if (signal.strength === 'strong') {
                await sendAlert({
                  symbol: signal.assetId,
                  message: signal.notes || 'איתות חדש זוהה',
                  indicators: [signal.strategy],
                  timeframe: signal.timeframe,
                  timestamp: signal.timestamp,
                  price: signal.price,
                  action: signal.type === 'buy' ? 'buy' : 'sell',
                  strength: signal.type === 'buy' ? 8 : 7
                });
              }
            }
            
            console.log(`Found ${latestSignals.length} new signals for ${assetId}`);
          }
        }
      } catch (error) {
        console.error(`Error analyzing ${assetId}:`, error);
      }
    }
  }, 30000); // בדיקה כל 30 שניות
  
  toast.success("ניתוח בזמן אמת הופעל", {
    description: `מנטר ${checkingAssets.length} נכסים. התראות ישלחו לערוצים המוגדרים.`
  });
  
  return {
    stop: stopRealTimeAnalysis
  };
};

/**
 * עצירת ניתוח בזמן אמת
 */
export const stopRealTimeAnalysis = () => {
  if (analysisIntervalId !== null) {
    clearInterval(analysisIntervalId);
    analysisIntervalId = null;
  }
  isRunning = false;
  checkingAssets = [];
  console.log('Real-time analysis stopped');
  return true;
};

/**
 * קבלת האיתותים השמורים
 */
export const useStoredSignals = () => {
  return {
    data: storedSignals,
    refetch: () => storedSignals,
    isRunning
  };
};

/**
 * ניקוי כל האיתותים השמורים
 */
export const clearStoredSignals = () => {
  storedSignals = [];
};

export * from './comprehensiveAnalysis';
export * from './analysisGenerator';
