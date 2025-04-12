
import { getTrackedAssets, saveTrackedAssets } from './storage';
import { getAllAssets } from '@/services/realTimeAssetService';
import { toast } from 'sonner';
import { TrackedAsset } from './types';

/**
 * יוצר רשימת מעקב אוטומטית מבוססת על הנכסים המובילים
 * @param count מספר הנכסים שיתווספו לרשימת המעקב
 * @returns מספר הנכסים שנוספו בהצלחה
 */
export const createAutomaticWatchlist = (count: number = 5): number => {
  try {
    // קבלת כל הנכסים הזמינים
    const allAssets = getAllAssets();
    
    // קבלת הנכסים שכבר במעקב
    const trackedAssets = getTrackedAssets();
    const trackedIds = trackedAssets.map(asset => asset.id);
    
    // מיון הנכסים לפי נפח מסחר (או מדד אחר שמעניין)
    const sortedAssets = [...allAssets].sort((a, b) => {
      // לדוגמה, מיון לפי נפח מסחר יומי
      return b.volume24h - a.volume24h; // Changed from volume to volume24h which exists in Asset type
    });
    
    // בחירת הנכסים המובילים שעוד לא במעקב
    const topAssets = sortedAssets
      .filter(asset => !trackedIds.includes(asset.id))
      .slice(0, count);
    
    if (topAssets.length === 0) {
      return 0;
    }
    
    // יצירת נכסים למעקב
    const newTrackedAssets: TrackedAsset[] = topAssets.map(asset => ({
      id: asset.id,
      name: asset.name,
      symbol: asset.symbol,
      type: asset.type, // This is already constrained by the Asset type
      price: asset.price,
      change24h: asset.change24h,
      priority: 'medium',
      alertsEnabled: true, // הפעלת התראות כברירת מחדל
      lastUpdated: Date.now(),
      isPinned: false
    }));
    
    // הוספה לרשימת המעקב
    saveTrackedAssets([...trackedAssets, ...newTrackedAssets]);
    
    return newTrackedAssets.length;
  } catch (error) {
    console.error('Error creating automatic watchlist:', error);
    return 0;
  }
};

/**
 * מפעיל התראות אוטומטיות עבור כל הנכסים ברשימת המעקב
 * @returns מספר הנכסים שהופעלו עבורם התראות
 */
export const enableAlertsForAllWatchlist = (): number => {
  try {
    const trackedAssets = getTrackedAssets();
    
    if (trackedAssets.length === 0) {
      return 0;
    }
    
    // הפעלת התראות לכל הנכסים
    const updatedAssets = trackedAssets.map(asset => ({
      ...asset,
      alertsEnabled: true
    }));
    
    saveTrackedAssets(updatedAssets);
    
    return updatedAssets.length;
  } catch (error) {
    console.error('Error enabling alerts for watchlist:', error);
    return 0;
  }
};

/**
 * מייבא רשימת מעקב מקובץ חיצוני או API
 * @param source מקור הייבוא (לדוגמה: 'tradingview', 'csv', 'json')
 * @returns האם הייבוא הצליח
 */
export const importWatchlist = async (source: string, data?: any): Promise<boolean> => {
  // כאן ניתן להוסיף הגיון לייבוא מקובץ או API חיצוני
  // כרגע זו פונקציית דוגמה
  
  toast.info(`ייבוא רשימת מעקב מ-${source} בתהליך...`);
  
  // דוגמה לייבוא נכסים מוגדרים מראש
  const defaultAssets = [
    { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC', type: 'crypto' as const },
    { id: 'ethereum', name: 'Ethereum', symbol: 'ETH', type: 'crypto' as const },
    { id: 'solana', name: 'Solana', symbol: 'SOL', type: 'crypto' as const },
    { id: 'aapl', name: 'Apple Inc.', symbol: 'AAPL', type: 'stocks' as const },
    { id: 'msft', name: 'Microsoft', symbol: 'MSFT', type: 'stocks' as const }
  ];
  
  try {
    const trackedAssets = getTrackedAssets();
    const trackedIds = trackedAssets.map(asset => asset.id);
    
    // הוספת נכסים חדשים שעוד לא במעקב
    const newAssets: TrackedAsset[] = defaultAssets
      .filter(asset => !trackedIds.includes(asset.id))
      .map(asset => ({
        id: asset.id,
        name: asset.name,
        symbol: asset.symbol,
        type: asset.type, // Now constrained to the correct types
        price: 0, // יתעדכן בסנכרון הבא
        change24h: 0,
        priority: 'medium' as const,
        alertsEnabled: true,
        lastUpdated: Date.now(),
        isPinned: false
      }));
    
    if (newAssets.length === 0) {
      toast.info('כל הנכסים כבר נמצאים ברשימת המעקב');
      return true;
    }
    
    saveTrackedAssets([...trackedAssets, ...newAssets]);
    
    toast.success(`נוספו ${newAssets.length} נכסים לרשימת המעקב`);
    return true;
  } catch (error) {
    console.error('Error importing watchlist:', error);
    toast.error('שגיאה בייבוא רשימת המעקב');
    return false;
  }
};
