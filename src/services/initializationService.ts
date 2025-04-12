
import { toast } from 'sonner';
import { isTradingViewConnected } from './tradingView/tradingViewAuthService';
import { isBinanceConnected } from './binance/binanceService';
import { startPriceSimulator } from './priceSimulator';
import { startAssetTracking } from './assetTracking/realTimeSync';
import { initializeTradingViewServices } from './tradingView/startup';

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
    
    // אתחול שירות מעקב נכסים
    const trackingStarted = startAssetTracking();
    console.log(`Asset tracking initialized: ${trackingStarted}`);
    
    // אתחול שירותי TradingView
    if (hasTradingView) {
      const tvInitialized = initializeTradingViewServices();
      console.log(`TradingView services initialized: ${tvInitialized}`);
    }
    
    // אם אין חיבורים חיצוניים, הפעל את הסימולטור
    if (!hasTradingView && !hasBinance) {
      console.log('No external connections, starting price simulator');
      startPriceSimulator('medium');
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
