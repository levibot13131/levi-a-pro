
import { TradeSignal } from '@/types/asset';
import { addSignal } from './signalStorage';
import { generateSignal } from './signalGenerator';
import { toast } from 'sonner';
import { isTelegramConfigured, sendSignalToTelegram } from '@/services/messaging/telegramService';

interface AnalysisOptions {
  strategy: string;
  interval?: number;
  maxSignals?: number;
  sendToTelegram?: boolean;
}

// Default options
const defaultOptions: AnalysisOptions = {
  strategy: 'auto',
  interval: 60000, // 1 minute
  maxSignals: 5,
  sendToTelegram: true
};

export const startRealTimeAnalysis = (
  assetIds: string[],
  options: Partial<AnalysisOptions> = {}
) => {
  const mergedOptions = { ...defaultOptions, ...options };
  let isRunning = true;
  let signalCount = 0;
  let intervalId: number | null = null;
  
  const runAnalysis = async () => {
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
      toast.info(`איתות חדש: ${signal.type === 'buy' ? 'קנייה' : 'מכירה'} ${signal.symbolName || signal.assetId}`, {
        description: signal.description || `מחיר: ${signal.price}, אסטרטגיה: ${signal.strategy}`
      });
      
      // Send to Telegram if enabled and configured
      if (mergedOptions.sendToTelegram && isTelegramConfigured()) {
        const sent = await sendSignalToTelegram(signal);
        if (sent) {
          console.log('Signal sent to Telegram successfully');
        } else {
          console.error('Failed to send signal to Telegram');
        }
      }
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
