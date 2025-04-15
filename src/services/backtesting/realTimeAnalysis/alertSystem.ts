
import { saveSignal, TradeSignal } from './signalStorage';

interface AlertInstance {
  stop: () => void;
}

/**
 * התחלת ניתוח בזמן אמת ושליחת התראות
 */
export const startRealTimeAnalysis = (
  assets: string[],
  settings: any = {}
): AlertInstance => {
  console.log('Starting real-time analysis for assets:', assets);
  
  // מנגנון לסימולציה של התראות
  const intervalId = setInterval(() => {
    if (Math.random() > 0.7) { // 30% סיכוי להתראה
      const randomAsset = assets[Math.floor(Math.random() * assets.length)];
      const alertTypes = ['buy', 'sell', 'alert'] as const;
      const randomType = alertTypes[Math.floor(Math.random() * alertTypes.length)];
      
      let message = '';
      switch (randomType) {
        case 'buy':
          message = `נוצר איתות קנייה עבור ${randomAsset} - המחיר עבר ממוצע נע 50`;
          break;
        case 'sell':
          message = `נוצר איתות מכירה עבור ${randomAsset} - המחיר שובר את רמת התמיכה`;
          break;
        case 'alert':
          message = `תנועה חדה במחיר של ${randomAsset} - שינוי של 3.2% ב-15 דקות האחרונות`;
          break;
      }
      
      const signal: Omit<TradeSignal, 'id'> = {
        asset: randomAsset,
        type: randomType,
        message,
        timestamp: Date.now(),
        price: Math.floor(Math.random() * 20000) + 30000,
        source: 'real-time-analysis'
      };
      
      // שמירת האיתות
      saveSignal(signal);
      
      console.log('New signal generated:', signal);
    }
  }, 20000); // בדיקה כל 20 שניות
  
  return {
    stop: () => {
      console.log('Stopping real-time analysis');
      clearInterval(intervalId);
    }
  };
};
