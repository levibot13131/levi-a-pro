
import { toast } from 'sonner';
import { isTradingViewConnected } from './tradingView/tradingViewAuthService';
import { isBinanceConnected } from './binance/binanceService';
import { startPriceSimulator } from './priceSimulator';
import { startAssetTracking } from './assetTracking/realTimeSync';
import { initializeTradingViewServices } from './tradingView/startup';
import { liveSignalEngine } from './trading/liveSignalEngine';
import { testTelegramBot } from './telegram/telegramService';

// מצב האתחול
let isInitialized = false;

/**
 * אתחול כל שירותי המערכת
 */
export const initializeAllServices = async (): Promise<boolean> => {
  if (isInitialized) {
    console.log('Services already initialized');
    return true;
  }
  
  console.log('Starting system initialization');
  try {
    // בדיקת חיבורים חיצוניים
    const hasTradingView = isTradingViewConnected();
    const hasBinance = isBinanceConnected();
    
    console.log(`External connections: TradingView=${hasTradingView}, Binance=${hasBinance}`);
    
    // בדיקת חיבור טלגרם
    const telegramConnected = await testTelegramBot();
    console.log(`Telegram connection: ${telegramConnected}`);
    
    // אתחול שירות מעקב נכסים
    const trackingStarted = startAssetTracking();
    console.log(`Asset tracking initialized: ${trackingStarted}`);
    
    // אתחול שירותי TradingView
    if (hasTradingView) {
      const tvInitialized = initializeTradingViewServices();
      console.log(`TradingView services initialized: ${tvInitialized}`);
    }
    
    // הפעלת מנוע האיתותים הלייב
    await liveSignalEngine.start();
    console.log('Live signal engine started');
    
    // אם אין חיבורים חיצוניים, הפעל את הסימולטור
    if (!hasTradingView && !hasBinance) {
      console.log('No external connections, starting price simulator');
      startPriceSimulator('medium');
    }
    
    // הודעה על מעבר למצב לייב
    if (telegramConnected) {
      toast.success('המערכת עברה למצב לייב! 🚀', {
        description: 'כל השירותים פעילים ומוכנים למסחר'
      });
    }
    
    // סימון שהמערכת אותחלה
    isInitialized = true;
    console.log('System initialization completed successfully');
    
    return true;
  } catch (error) {
    console.error('Error initializing services:', error);
    toast.error('שגיאה באתחול המערכת', {
      description: 'אירעה שגיאה בלתי צפויה באתחול שירותי המערכת'
    });
    return false;
  }
};

/**
 * בדיקה אם המערכת אותחלה
 */
export const isServicesInitialized = (): boolean => {
  return isInitialized;
};

// ניסיון אתחול בטעינת המודול
initializeAllServices().then(success => {
  if (success) {
    console.log('Auto-initialization completed successfully');
  } else {
    console.error('Auto-initialization failed');
  }
});
