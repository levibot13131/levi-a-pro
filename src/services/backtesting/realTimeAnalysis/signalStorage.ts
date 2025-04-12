
import { useState } from 'react';
import { TradeSignal } from '@/types/asset';
import { useQuery } from '@tanstack/react-query';

// Storage key for signals
const SIGNAL_STORAGE_KEY = 'realtime_signals';

// Get signals from storage
export const getStoredSignals = (): TradeSignal[] => {
  try {
    const signals = localStorage.getItem(SIGNAL_STORAGE_KEY);
    return signals ? JSON.parse(signals) : [];
  } catch (error) {
    console.error('Error getting stored signals:', error);
    return [];
  }
};

// Add signal to storage
export const addSignal = (signal: TradeSignal): boolean => {
  try {
    const signals = getStoredSignals();
    signals.unshift(signal); // Add to beginning of array
    localStorage.setItem(SIGNAL_STORAGE_KEY, JSON.stringify(signals));
    return true;
  } catch (error) {
    console.error('Error storing signal:', error);
    return false;
  }
};

// Clear all stored signals
export const clearStoredSignals = (): boolean => {
  try {
    localStorage.removeItem(SIGNAL_STORAGE_KEY);
    return true;
  } catch (error) {
    console.error('Error clearing signals:', error);
    return false;
  }
};

// Hook to use signals with React Query
export const useStoredSignals = () => {
  return useQuery({
    queryKey: ['realTimeSignals'],
    queryFn: getStoredSignals,
    refetchOnWindowFocus: true,
    staleTime: 5000, // 5 seconds
  });
};
