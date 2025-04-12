
import { PositionSizingCalculation } from '@/services/customTradingStrategyService';

export const calculatePositionSizeForBacktest = (
  accountSize: number,
  riskPercentage: number,
  entryPrice: number,
  stopLossPrice: number,
  targetPrice?: number
): PositionSizingCalculation => {
  // Validate inputs
  if (entryPrice <= 0) {
    throw new Error('Entry price must be greater than zero');
  }
  
  if (entryPrice === stopLossPrice) {
    throw new Error('Entry price and stop loss cannot be the same');
  }

  // Calculate risk amount
  const maxRiskAmount = accountSize * (riskPercentage / 100);
  
  // Calculate risk per unit
  const isLong = entryPrice > stopLossPrice;
  const riskPerUnit = Math.abs(entryPrice - stopLossPrice);
  
  // Calculate position size
  const positionSize = maxRiskAmount / riskPerUnit;
  
  // Calculate risk-reward ratio if target price is provided
  let riskRewardRatio = 1.0;
  if (targetPrice !== undefined && targetPrice > 0) {
    const rewardPerUnit = isLong 
      ? targetPrice - entryPrice 
      : entryPrice - targetPrice;
    
    if (rewardPerUnit > 0 && riskPerUnit > 0) {
      riskRewardRatio = rewardPerUnit / riskPerUnit;
    }
  }
  
  return {
    positionSize,
    maxLossAmount: maxRiskAmount,
    riskRewardRatio,
    takeProfitPrice: targetPrice
  };
};

export default calculatePositionSizeForBacktest;
