
import { TradeSignal } from '@/types/asset';
import { addSignal } from './signalStorage';
import { generateSignal } from './signalGenerator';
import { toast } from 'sonner';

interface AnalysisOptions {
  strategy: string;
  interval?: number;
  maxSignals?: number;
}

// Default options
const defaultOptions: AnalysisOptions = {
  strategy: 'auto',
  interval: 60000, // 1 minute
  maxSignals: 5
};

export const startRealTimeAnalysis = (
  assetIds: string[],
  options: Partial<AnalysisOptions> = {}
) => {
  const mergedOptions = { ...defaultOptions, ...options };
  let isRunning = true;
  let signalCount = 0;
  let intervalId: number | null = null;
  
  const runAnalysis = () => {
    if (!isRunning || (mergedOptions.maxSignals && signalCount >= mergedOptions.maxSignals)) {
      if (intervalId) {
        clearInterval(intervalId);
      }
      return;
    }
    
    // Generate a signal for a random asset
    if (assetIds.length > 0) {
      const randomIndex = Math.floor(Math.random() * assetIds.length);
      const assetId = assetIds[randomIndex];
      
      const signal = generateSignal(assetId, mergedOptions.strategy);
      addSignal(signal);
      signalCount++;
      
      // Notify user of new signal
      toast.info(`איתות חדש: ${signal.type === 'buy' ? 'קנייה' : 'מכירה'} ${signal.symbolName}`, {
        description: signal.description || `מחיר: ${signal.price}, אסטרטגיה: ${signal.strategy}`
      });
    }
  };
  
  // Start interval
  intervalId = window.setInterval(runAnalysis, mergedOptions.interval);
  
  // Initial run
  runAnalysis();
  
  // Return control object
  return {
    stop: () => {
      isRunning = false;
      if (intervalId) {
        clearInterval(intervalId);
      }
    }
  };
};
