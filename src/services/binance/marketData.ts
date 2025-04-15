
import { getProxyConfig } from '@/services/proxy/proxyConfig';
import { toast } from 'sonner';

export interface CurrencyData {
  symbol: string;
  price: number;
  change24h: number;
  high24h: number;
  low24h: number;
  volume24h: number;
  marketCap: number;
  lastUpdated: number;
}

let realTimeMode = false;

export const isRealTimeMode = (): boolean => {
  return realTimeMode;
};

export const setRealTimeMode = (enabled: boolean): boolean => {
  // שמירת המצב הקודם
  const previousMode = realTimeMode;
  
  // עדכון המצב החדש
  realTimeMode = enabled;
  
  // בדיקה שהמצב השתנה
  if (previousMode !== realTimeMode) {
    // שליחת אירוע שינוי מצב זמן אמת
    window.dispatchEvent(new CustomEvent('realtime-mode-changed', {
      detail: { enabled: realTimeMode }
    }));
    
    console.log(`Real-time mode ${realTimeMode ? 'enabled' : 'disabled'}`);
  }
  
  return realTimeMode;
};

/**
 * התחלת עדכוני נתוני שוק בזמן אמת
 */
export const startRealTimeMarketData = (symbol: string): boolean => {
  try {
    // בדיקה האם יש פרוקסי מוגדר וזמין
    const proxyConfig = getProxyConfig();
    
    // סימולציה של התחלת מעקב זמן אמת
    console.log(`Starting real-time market data for ${symbol}`);
    
    // בהצלחה, יש להחזיר true
    return true;
  } catch (error) {
    console.error('Error starting real-time market data:', error);
    
    // נכשל, יש להחזיר false
    return false;
  }
};

/**
 * האזנה לעדכוני בינאנס
 */
export const listenToBinanceUpdates = (callback: (data: any) => void): () => void => {
  // יצירת אובייקט WebSocket או סימולציה של עדכונים תקופתיים
  const interval = setInterval(() => {
    if (realTimeMode) {
      // סימולציה של עדכון נתונים
      const mockData = {
        symbol: 'BTCUSDT',
        price: 42000 + (Math.random() * 2000),
        change: (Math.random() * 10) - 5 // -5% to +5%
      };
      
      callback(mockData);
    }
  }, 5000);
  
  // החזרת פונקציית ניקוי
  return () => {
    clearInterval(interval);
  };
};

/**
 * קבלת נתונים בסיסיים על מטבע
 */
export const getFundamentalData = async (symbol: string): Promise<CurrencyData> => {
  try {
    // בדיקה האם יש פרוקסי מוגדר
    const proxyConfig = getProxyConfig();
    
    // סימולציה של קבלת נתונים
    const mockData: CurrencyData = {
      symbol,
      price: symbol.includes('BTC') ? 42000 + (Math.random() * 2000) : 
             symbol.includes('ETH') ? 2000 + (Math.random() * 500) :
             500 + (Math.random() * 100),
      change24h: (Math.random() * 10) - 5, // -5% to +5%
      high24h: 45000,
      low24h: 41000,
      volume24h: 15000000000,
      marketCap: 800000000000,
      lastUpdated: Date.now()
    };
    
    return mockData;
  } catch (error) {
    console.error('Error fetching fundamental data:', error);
    toast.error('שגיאה בטעינת נתוני מטבע');
    
    // במקרה של שגיאה, החזר נתונים ריקים
    return {
      symbol,
      price: 0,
      change24h: 0,
      high24h: 0,
      low24h: 0,
      volume24h: 0,
      marketCap: 0,
      lastUpdated: Date.now()
    };
  }
};
