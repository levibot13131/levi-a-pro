
import { useState, useEffect } from 'react';
import { TradeSignal } from '@/types/asset';

// Mock signal generation function
const generateMockSignals = (assetId: string): TradeSignal[] => {
  const now = Date.now();
  const day = 24 * 60 * 60 * 1000;
  
  return [
    {
      id: '1',
      assetId,
      type: 'buy',
      price: 50000,
      timestamp: now - 2 * day,
      strength: 'strong',
      strategy: 'Breakout',
      timeframe: '1d',
      targetPrice: 55000,
      stopLoss: 48000,
      riskRewardRatio: 2.5,
      createdAt: now - 2 * day,
      notes: 'אפשר לנצל את ההזדמנות הזו לעמדה לטווח ארוך.',
      symbolName: 'BTC',
      confidence: 85,
      indicator: 'פריצת התנגדות',
      description: 'פריצת התנגדות ארוכת טווח עם נפח גבוה'
    },
    {
      id: '2',
      assetId,
      type: 'sell',
      price: 52000,
      timestamp: now - day,
      strength: 'medium',
      strategy: 'RSI Divergence',
      timeframe: '4h',
      targetPrice: 49000,
      stopLoss: 53000,
      riskRewardRatio: 3.0,
      createdAt: now - day,
      notes: 'מומלץ לצמצם פוזיציות ולתת סטופ לוס מעל הרמה של 53,000.',
      symbolName: 'BTC',
      confidence: 70,
      indicator: 'דיברגנס RSI',
      description: 'דיברגנס שלילי ב-RSI וירידה בנפח המסחר'
    },
    {
      id: '3',
      assetId,
      type: 'buy',
      price: 49000,
      timestamp: now - 12 * 60 * 60 * 1000,
      strength: 'weak',
      strategy: 'Support Bounce',
      timeframe: '1h',
      targetPrice: 50500,
      stopLoss: 48500,
      riskRewardRatio: 1.5,
      createdAt: now - 12 * 60 * 60 * 1000,
      notes: 'אפשרות לעסקה קצרת טווח עם סטופ לוס מתחת לממוצע הנע.',
      symbolName: 'BTC',
      confidence: 65,
      indicator: 'התמיכה בממוצע נע',
      description: 'ניתור מרמת תמיכה של ממוצע נע 200'
    }
  ];
};

interface UseTradeSignalsProps {
  assetId: string;
}

interface UseTradeSignalsReturn {
  currentSignals: TradeSignal[];
  pastSignals: TradeSignal[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

/**
 * Hook to fetch and manage trade signals for an asset
 */
export const useTradeSignals = ({ assetId }: UseTradeSignalsProps): UseTradeSignalsReturn => {
  const [signals, setSignals] = useState<TradeSignal[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchSignals = () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // In a real app, this would be an API call
      setTimeout(() => {
        const mockSignals = generateMockSignals(assetId);
        setSignals(mockSignals);
        setIsLoading(false);
      }, 500); // Simulate network delay
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch signals'));
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSignals();
    
    // Set up interval for real-time updates
    const intervalId = setInterval(fetchSignals, 30000); // Update every 30 seconds
    
    return () => {
      clearInterval(intervalId);
    };
  }, [assetId]);

  // Filter signals into current and past
  const currentSignals = signals.filter(signal => 
    (signal.type === 'buy' && signal.price <= 51000) || 
    (signal.type === 'sell' && signal.price >= 51000)
  );
  
  const pastSignals = signals.filter(signal => 
    signal.timestamp < Date.now() - 24 * 60 * 60 * 1000
  );

  return {
    currentSignals,
    pastSignals,
    isLoading,
    error,
    refetch: fetchSignals
  };
};
