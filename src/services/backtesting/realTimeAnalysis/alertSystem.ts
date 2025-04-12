
import { TradeSignal } from '@/types/asset';
import { toast } from 'sonner';
import { BacktestSettings } from '../types';
import { generateMockSignal } from './signalGenerator';
import { processSignal } from './signalStorage';

/**
 * Starts real-time analysis for the specified assets
 * @param assets List of asset IDs to analyze
 * @param settings Analysis settings
 * @returns Functions to control the analysis process
 */
export const startRealTimeAnalysis = (
  assets: string[],
  settings: Partial<BacktestSettings>
) => {
  console.log("Starting real-time analysis for assets:", assets);
  
  // Set up the analysis interval (in a real implementation this would connect to websockets)
  const interval = setInterval(() => {
    assets.forEach(assetId => {
      // Generate mock signals occasionally (increased probability for demo purposes)
      if (Math.random() > 0.5) { // Changed from 0.7 to 0.5 to generate more signals
        const signal = generateMockSignal(assetId, settings.strategy);
        console.log("Generated new signal:", signal);
        processSignal(signal);
      }
    });
  }, 10000); // Changed from 30000 to 10000 to generate signals more frequently (every 10 seconds)

  return {
    stop: () => clearInterval(interval),
    pause: () => clearInterval(interval),
    resume: () => startRealTimeAnalysis(assets, settings),
  };
};
