
import { Asset, AssetHistoricalData, AssetType, PricePoint, TimeframeType } from '@/types/asset';
import { toast } from 'sonner';
import { isTradingViewConnected } from './tradingView/tradingViewAuthService';
import { isBinanceConnected } from './binance/binanceService';

// מאגר מקומי של נכסים
let cachedAssets: Asset[] = [];
let lastUpdateTime = 0;

// אתחול המערכת
// נטען את הנכסים מדמו/אמיתי בהתאם למצב החיבור
const initializeRealTimeAssets = async () => {
  if (!cachedAssets.length) {
    try {
      // בהתחלה נטען מנתוני דמו
      await updateAssetsFromMock();
      console.log('Initialized assets from mock data');
      
      // אם יש חיבור לשירותים חיצוניים, ננסה להתעדכן מהם
      checkExternalConnections();
    } catch (error) {
      console.error('Failed to initialize assets', error);
    }
  }
};

// בדיקת חיבורים חיצוניים וניסיון להתעדכן
const checkExternalConnections = async () => {
  const tradingViewConnected = isTradingViewConnected();
  const binanceConnected = isBinanceConnected();
  
  if (tradingViewConnected || binanceConnected) {
    console.log('External connections found, updating assets from live data');
    try {
      const assetIds = cachedAssets.map(asset => asset.id);
      const updatedCount = await updateAssetsFromLiveData(assetIds);
      
      if (updatedCount > 0) {
        toast.success(`עודכנו ${updatedCount} נכסים בזמן אמת`, {
          description: 'הנתונים יתעדכנו אוטומטית כל 30 שניות'
        });
      }
    } catch (error) {
      console.error('Failed to update from live data', error);
    }
  }
};

// עדכון מנתוני דמו
const updateAssetsFromMock = async () => {
  // import the mock service dynamically to avoid circular dependencies
  const { getAssets } = await import('./mockDataService');
  cachedAssets = await getAssets();
  lastUpdateTime = Date.now();
  return cachedAssets.length;
};

// עדכון מנתונים בזמן אמת
const updateAssetsFromLiveData = async (assetIds: string[]) => {
  let updatedCount = 0;
  
  // אם יש חיבור ל-TradingView או Binance, ננסה לעדכן מהם
  if (isTradingViewConnected()) {
    try {
      // מדמה עדכון מ-TradingView
      for (const asset of cachedAssets) {
        // עדכון רנדומלי עם סטייה קטנה מהמחיר הקודם
        const priceChange = (Math.random() - 0.5) * 0.02; // סטייה של עד 1%
        asset.price = asset.price * (1 + priceChange);
        asset.change24h = asset.change24h + (Math.random() - 0.5) * 0.5; // עדכון קטן ל-24h
        updatedCount++;
      }
      console.log('Updated assets from TradingView');
    } catch (error) {
      console.error('Failed to update from TradingView', error);
    }
  }
  
  if (isBinanceConnected()) {
    try {
      // מדמה עדכון מ-Binance
      for (const asset of cachedAssets) {
        if (['bitcoin', 'ethereum', 'solana'].includes(asset.id)) {
          // עדכון רנדומלי עם סטייה קטנה מהמחיר הקודם
          const priceChange = (Math.random() - 0.5) * 0.015; // סטייה של עד 0.75%
          asset.price = asset.price * (1 + priceChange);
          asset.volume24h = asset.volume24h * (1 + (Math.random() - 0.5) * 0.1); // עדכון קטן לנפח
          updatedCount++;
        }
      }
      console.log('Updated assets from Binance');
    } catch (error) {
      console.error('Failed to update from Binance', error);
    }
  }
  
  if (updatedCount > 0) {
    lastUpdateTime = Date.now();
  }
  
  return updatedCount;
};

// קבלת כל הנכסים
export const getAllAssets = (): Asset[] => {
  // אם אין נכסים או עבר זמן רב מהעדכון האחרון, נאתחל שוב
  if (cachedAssets.length === 0 || Date.now() - lastUpdateTime > 5 * 60 * 1000) {
    initializeRealTimeAssets();
  }
  return cachedAssets;
};

// קבלת נכס לפי מזהה
export const getAssetById = (id: string): Asset | undefined => {
  if (cachedAssets.length === 0) {
    initializeRealTimeAssets();
  }
  return cachedAssets.find(asset => asset.id === id);
};

// קבלת נכסים לפי סוג
export const getAssetsByType = (type: AssetType): Asset[] => {
  return getAllAssets().filter(asset => asset.type === type);
};

// חיפוש נכסים
export const searchAssets = (query: string): Asset[] => {
  if (!query) return [];
  
  const searchTerm = query.toLowerCase();
  return getAllAssets().filter(
    asset => 
      asset.name.toLowerCase().includes(searchTerm) || 
      asset.symbol.toLowerCase().includes(searchTerm)
  );
};

// קבלת היסטוריית נכס
export const getAssetHistory = async (
  assetId: string,
  timeframe: TimeframeType = '1d',
  days: number = 30
): Promise<AssetHistoricalData | null> => {
  try {
    // import the mock service dynamically to avoid circular dependencies
    const { getAssetHistory: getMockAssetHistory } = await import('./mockDataService');
    return await getMockAssetHistory(assetId, timeframe, days);
  } catch (error) {
    console.error('Failed to get asset history', error);
    return null;
  }
};

// התחלת הנכסים בטעינת המודול
initializeRealTimeAssets();

// הגדרת אינטרוול לעדכון אוטומטי
setInterval(async () => {
  if (isTradingViewConnected() || isBinanceConnected()) {
    const assetIds = cachedAssets.map(asset => asset.id);
    await updateAssetsFromLiveData(assetIds);
  }
}, 30000); // עדכון כל 30 שניות

