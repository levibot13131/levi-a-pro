
// Re-export all functions from the module files
export { startRealTimeAnalysis } from './alertSystem';
export { useStoredSignals, clearStoredSignals, getStoredSignals } from './signalStorage';
export { generateMockSignal } from './signalGenerator';

// Export the types directly from the types module
export type { TradeSignal } from '@/types/asset';
