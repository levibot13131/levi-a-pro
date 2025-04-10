
import { PositionSizingCalculation } from "@/services/customTradingStrategyService";

// Calculate optimal position size based on risk parameters
export const calculateOptimalPosition = (
  capital: number,
  riskPercent: number,
  entryPrice: number,
  stopLossPrice: number
): PositionSizingCalculation => {
  const riskAmount = capital * (riskPercent / 100);
  const priceDiff = Math.abs(entryPrice - stopLossPrice);
  const positionSize = riskAmount / priceDiff;
  
  return {
    accountSize: capital,
    riskPercentage: riskPercent,
    entryPrice,
    stopLossPrice,
    positionSize,
    maxLossAmount: riskAmount,
    riskRewardRatio: 0, // This would be calculated based on target price
  };
};
