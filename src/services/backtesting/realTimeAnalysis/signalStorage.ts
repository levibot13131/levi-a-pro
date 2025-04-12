
import { useState } from 'react';
import { TradeSignal } from '@/types/asset';

// In-memory storage for signals
let storedSignals: TradeSignal[] = [];

export const addSignal = (signal: TradeSignal) => {
  storedSignals = [signal, ...storedSignals];
  return signal;
};

export const getSignals = () => {
  return [...storedSignals];
};

export const clearStoredSignals = () => {
  storedSignals = [];
};

// React hook for signal data
export const useStoredSignals = () => {
  const [signals, setSignals] = useState<TradeSignal[]>(storedSignals);
  
  const refetch = () => {
    setSignals([...storedSignals]);
    return storedSignals;
  };
  
  return {
    data: signals,
    refetch
  };
};
