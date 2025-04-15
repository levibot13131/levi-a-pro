
import { useQuery } from '@tanstack/react-query';

export interface TradeSignal {
  id: string;
  asset: string;
  type: 'buy' | 'sell' | 'alert';
  message: string;
  timestamp: number;
  price?: number;
  source?: string;
}

const STORAGE_KEY = 'levi_bot_trade_signals';

// שמירת אות מסחר
export const saveSignal = (signal: Omit<TradeSignal, 'id'>): TradeSignal => {
  const existingSignals = getSignals();
  
  // יצירת מזהה ייחודי
  const newSignal: TradeSignal = {
    ...signal,
    id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  };
  
  // הוספת האות לתחילת המערך
  existingSignals.unshift(newSignal);
  
  // הגבלת מספר האותות שנשמרים
  const limitedSignals = existingSignals.slice(0, 100);
  
  // שמירה באחסון מקומי
  localStorage.setItem(STORAGE_KEY, JSON.stringify(limitedSignals));
  
  return newSignal;
};

// קבלת כל האותות השמורים
export const getSignals = (): TradeSignal[] => {
  try {
    const storedSignals = localStorage.getItem(STORAGE_KEY);
    if (storedSignals) {
      return JSON.parse(storedSignals);
    }
  } catch (error) {
    console.error('Error parsing trade signals:', error);
  }
  
  return [];
};

// ניקוי כל האותות
export const clearSignals = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};

// הוק לשליפת אותות שמורים (עם React Query)
export const useStoredSignals = () => {
  return useQuery({
    queryKey: ['tradeSignals'],
    queryFn: getSignals,
    refetchInterval: 30000, // רענון כל 30 שניות
  });
};
