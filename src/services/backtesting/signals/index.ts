
import { PricePoint, TradeSignal } from "@/types/asset";
import { generatePatternSignals } from "./patternSignalGenerator";
import { generateMomentumSignals } from "./momentumSignalGenerator";
import { generateWhaleSignals } from "./whaleSignalGenerator";

// Generate trading signals from historical price data
export const generateSignalsFromHistory = async (
  priceData: PricePoint[],
  strategy: string,
  assetId?: string
): Promise<TradeSignal[]> => {
  // Generate pattern-based signals
  const patternSignals = generatePatternSignals(priceData, strategy);
  
  // Generate momentum-based signals
  const momentumSignals = generateMomentumSignals(priceData, strategy);
  
  // Generate whale activity signals if we have an assetId
  const whaleSignals = assetId 
    ? await generateWhaleSignals(priceData, assetId, strategy)
    : [];
  
  // Combine all signals
  return [...patternSignals, ...momentumSignals, ...whaleSignals];
};
