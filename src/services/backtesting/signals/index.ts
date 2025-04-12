
import { PricePoint, TradeSignal, TimeframeType } from '@/types/asset';
import { generateMomentumSignals } from './momentumSignalGenerator';
import { generatePatternSignals } from './patternSignalGenerator';
import { generateWhaleSignals } from './whaleSignalGenerator';

// Function to generate all types of signals for a given asset
export const generateSignals = (
  priceData: PricePoint[],
  volumeData: {time: string, value: number}[],
  assetId: string,
  timeframe: TimeframeType
): TradeSignal[] => {
  if (!priceData || priceData.length < 20) {
    return [];
  }
  
  // Generate signals from different strategies
  const momentumSignals = generateMomentumSignals(priceData, assetId, timeframe);
  const patternSignals = generatePatternSignals(priceData, assetId, timeframe);
  const whaleSignals = generateWhaleSignals(priceData, volumeData, assetId, timeframe);
  
  // Combine all signals
  const allSignals = [
    ...momentumSignals,
    ...patternSignals,
    ...whaleSignals
  ];
  
  // Sort signals by timestamp (newest first)
  return allSignals.sort((a, b) => b.timestamp - a.timestamp);
};
