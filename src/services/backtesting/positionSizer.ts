
import { PositionSizingCalculation } from "@/services/customTradingStrategyService";

// Calculate optimal position size based on risk parameters
export const calculateOptimalPosition = (
  capital: number,
  riskPercent: number,
  entryPrice: number,
  stopLossPrice: number,
  takeProfitPrice?: number
): PositionSizingCalculation => {
  // Basic risk calculation
  const riskAmount = capital * (riskPercent / 100);
  const priceDiff = Math.abs(entryPrice - stopLossPrice);
  
  if (priceDiff === 0) {
    throw new Error("סטופ לוס חייב להיות שונה ממחיר הכניסה");
  }
  
  const positionSize = riskAmount / priceDiff;
  
  // Calculate risk-reward ratio if takeProfit is provided
  let riskRewardRatio = 0;
  let potentialProfit = 0;
  
  if (takeProfitPrice) {
    potentialProfit = Math.abs(takeProfitPrice - entryPrice) * positionSize;
    riskRewardRatio = potentialProfit / riskAmount;
  }
  
  return {
    accountSize: capital,
    riskPercentage: riskPercent,
    entryPrice,
    stopLossPrice,
    takeProfitPrice,
    positionSize,
    maxLossAmount: riskAmount,
    potentialProfit,
    riskRewardRatio,
  };
};

// Advanced position size calculator that incorporates volatility via ATR
export const calculatePositionWithVolatility = (
  capital: number,
  riskPercent: number,
  entryPrice: number,
  atrValue: number,
  atrMultiplier: number = 2,
  takeProfitAtrMultiplier: number = 3
): PositionSizingCalculation => {
  // Calculate stop loss based on ATR
  const direction = 'long'; // Default to long, could be passed as parameter
  const stopLossPrice = direction === 'long' 
    ? entryPrice - (atrValue * atrMultiplier)
    : entryPrice + (atrValue * atrMultiplier);
  
  // Calculate take profit based on ATR and risk-reward
  const takeProfitPrice = direction === 'long'
    ? entryPrice + (atrValue * takeProfitAtrMultiplier)
    : entryPrice - (atrValue * takeProfitAtrMultiplier);
  
  // Use the standard position sizer with the calculated levels
  return calculateOptimalPosition(
    capital,
    riskPercent,
    entryPrice,
    stopLossPrice,
    takeProfitPrice
  );
};

// Kelly Criterion for optimal position sizing based on edge
export const calculateKellyPosition = (
  capital: number,
  winRate: number, // As decimal (0.6 for 60%)
  averageWin: number, // Average profit on winning trades
  averageLoss: number  // Average loss on losing trades (as positive number)
): number => {
  // Kelly formula: f* = (p*b - q) / b
  // where f* is the optimal fraction, p is win probability, 
  // q is loss probability (1-p), and b is the ratio of average win to average loss
  
  if (winRate <= 0 || winRate >= 1) {
    throw new Error("שיעור הניצחון חייב להיות בין 0 ל-1");
  }
  
  if (averageLoss <= 0) {
    throw new Error("ההפסד הממוצע חייב להיות מספר חיובי");
  }
  
  const winLossRatio = averageWin / averageLoss;
  const lossRate = 1 - winRate;
  
  // Calculate Kelly percentage
  const kellyPercentage = (winRate * winLossRatio - lossRate) / winLossRatio;
  
  // Often traders use half-Kelly for more conservative approach
  const halfKelly = Math.max(0, kellyPercentage) / 2;
  
  // Return optimal position size based on capital
  return capital * halfKelly;
};

// Create a dynamic trailing stop loss strategy
export const calculateTrailingStopLoss = (
  entryPrice: number,
  currentPrice: number,
  initialStopLoss: number,
  trailingPercent: number = 2
): number => {
  // Direction of the trade
  const isLong = entryPrice < currentPrice;
  
  // Check if the price moved in the favorable direction
  if ((isLong && currentPrice > entryPrice) || (!isLong && currentPrice < entryPrice)) {
    // Calculate the distance for the trailing stop
    const trailingDistance = (currentPrice * trailingPercent) / 100;
    
    // Calculate the new stop loss level
    const newStopLoss = isLong 
      ? Math.max(initialStopLoss, currentPrice - trailingDistance)
      : Math.min(initialStopLoss, currentPrice + trailingDistance);
    
    return newStopLoss;
  }
  
  // If price hasn't moved favorably, return the initial stop loss
  return initialStopLoss;
};
