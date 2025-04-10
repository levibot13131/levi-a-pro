
import { PricePoint, TradeSignal } from "@/types/asset";
import { generatePatternSignals } from "./patternSignalGenerator";
import { generateMomentumSignals } from "./momentumSignalGenerator";

// Generate trading signals from historical price data
export const generateSignalsFromHistory = (
  priceData: PricePoint[],
  strategy: string
): TradeSignal[] => {
  // In a real implementation, this would apply your trading strategy rules
  // to historical data and generate entry/exit signals
  
  // Generate pattern-based signals
  const patternSignals = generatePatternSignals(priceData, strategy);
  
  // Generate momentum-based signals
  const momentumSignals = generateMomentumSignals(priceData, strategy);
  
  // Combine all signals
  return [...patternSignals, ...momentumSignals];
};
