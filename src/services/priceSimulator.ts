
// סימולטור של עדכוני מחירים
import { toast } from 'sonner';
import { isTradingViewConnected } from './tradingView/tradingViewAuthService';
import { isBinanceConnected } from './binance/binanceService';

// מצב הסימולטור
let isRunning = false;
let updateInterval: number | null = null;
let volatility = 'medium'; // 'low', 'medium', 'high'
let subscribers: Array<(type: string, data: any) => void> = [];

// תדירות עדכון לפי רמת התנודתיות
const updateFrequencies = {
  low: 10000,     // 10 seconds
  medium: 5000,   // 5 seconds
  high: 2000      // 2 seconds
};

/**
 * התחלת סימולטור המחירים
 */
export const startPriceSimulator = (volatilityLevel: 'low' | 'medium' | 'high' = 'medium'): boolean => {
  // אם יש חיבור אמיתי, לא נפעיל את הסימולטור
  if (isTradingViewConnected() || isBinanceConnected()) {
    toast.info('סימולטור מחירים לא זמין', {
      description: 'המערכת מחוברת ל-API חיצוני ומקבלת נתונים אמיתיים'
    });
    return false;
  }
  
  if (isRunning) {
    stopPriceSimulator();
  }
  
  volatility = volatilityLevel;
  isRunning = true;
  
  updateInterval = window.setInterval(() => {
    generatePriceUpdates();
  }, updateFrequencies[volatility]);
  
  console.log(`Price simulator started with ${volatility} volatility`);
  return true;
};

/**
 * עצירת סימולטור המחירים
 */
export const stopPriceSimulator = (): boolean => {
  if (!isRunning || updateInterval === null) {
    return false;
  }
  
  clearInterval(updateInterval);
  updateInterval = null;
  isRunning = false;
  
  console.log('Price simulator stopped');
  return true;
};

/**
 * קבלת הסטטוס הנוכחי של הסימולטור
 */
export const getPriceSimulatorStatus = () => {
  return {
    isRunning,
    volatility,
    updateFrequencyMs: isRunning ? updateFrequencies[volatility] : 0
  };
};

/**
 * הרשמה לעדכוני מחירים
 */
export const subscribeToUpdates = (callback: (type: string, data: any) => void): () => void => {
  subscribers.push(callback);
  
  // אם הסימולטור לא רץ, הפעל אותו
  if (!isRunning) {
    startPriceSimulator();
  }
  
  return () => {
    subscribers = subscribers.filter(sub => sub !== callback);
    
    // אם אין יותר מאזינים, עצור את הסימולטור
    if (subscribers.length === 0 && isRunning) {
      stopPriceSimulator();
    }
  };
};

/**
 * יצירת עדכוני מחירים אקראיים
 */
const generatePriceUpdates = () => {
  if (subscribers.length === 0) {
    return;
  }
  
  // Assets we'll update
  const assets = ['bitcoin', 'ethereum', 'solana', 'aapl', 'amzn'];
  
  // Maximum percentage change based on volatility
  const maxPercentChange = {
    low: 0.3,     // 0.3%
    medium: 1.0,  // 1.0%
    high: 2.5     // 2.5%
  }[volatility];
  
  // Generate updates for each asset
  assets.forEach(assetId => {
    // Random price change within the volatility range
    const percentChange = (Math.random() * 2 - 1) * maxPercentChange;
    
    // Generate mock data
    const updateData = {
      assetId,
      timestamp: Date.now(),
      percentChange,
      isSignificant: Math.abs(percentChange) > maxPercentChange * 0.7,
      source: Math.random() > 0.5 ? 'tradingview' : 'binance'
    };
    
    // Notify all subscribers
    subscribers.forEach(callback => {
      callback('price-update', updateData);
    });
  });
};

// Initialize simulator when the module loads
if (!isTradingViewConnected() && !isBinanceConnected()) {
  startPriceSimulator();
}
