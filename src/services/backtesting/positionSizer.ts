
import { TimeframeType } from '@/types/asset';

// Types for position sizing
export interface PositionSizingInput {
  accountSize: number;
  riskPercentage: number;
  entryPrice: number;
  stopLossPrice: number;
  leverage?: number;
  direction: 'long' | 'short';
  takeProfitTargets?: {
    price: number;
    percentage: number;
  }[];
}

export interface PositionSizingCalculation {
  units: number;
  totalValue: number;
  riskAmount: number;
  riskPerUnit: number;
  maxLossAmount: number;
  positionSize: number;
  takeProfitPrice?: number;
  riskRewardRatio: number;
  potentialProfit?: number; // Added this property to fix the error
}

export interface BacktestResult {
  initialCapital: number;
  finalCapital: number;
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  winRate: number;
  profitFactor: number;
  maxDrawdown: number;
  averageWin: number;
  averageLoss: number;
  expectancy: number;
  trades: BacktestTrade[];
}

export interface BacktestTrade {
  entryTimestamp: number;
  exitTimestamp: number;
  entryPrice: number;
  exitPrice: number;
  direction: 'long' | 'short';
  profitLoss: number;
  profitLossPercentage: number;
  duration: number;
  result: 'win' | 'loss';
}

// Calculate position size based on risk parameters
export const calculatePositionSize = (input: PositionSizingInput): PositionSizingCalculation => {
  const { accountSize, riskPercentage, entryPrice, stopLossPrice, direction, leverage = 1 } = input;
  
  // Calculate the risk amount in absolute terms
  const riskAmount = (accountSize * riskPercentage) / 100;
  
  // Calculate the risk per unit based on entry and stop loss
  let riskPerUnit;
  if (direction === 'long') {
    riskPerUnit = entryPrice - stopLossPrice;
  } else {
    riskPerUnit = stopLossPrice - entryPrice;
  }
  
  if (riskPerUnit <= 0) {
    throw new Error('Invalid stop loss level. For long trades, stop loss must be below entry price. For short trades, it must be above entry price.');
  }
  
  // Calculate the position size (units)
  const positionSize = (riskAmount / riskPerUnit) * leverage;
  
  // Calculate the total position value
  const totalValue = positionSize * entryPrice;
  
  // Calculate take profit price for a 2:1 risk-reward ratio (default)
  const takeProfitPrice = direction === 'long' 
    ? entryPrice + (riskPerUnit * 2) 
    : entryPrice - (riskPerUnit * 2);
  
  // Calculate potential profit
  const potentialProfit = positionSize * Math.abs(takeProfitPrice - entryPrice);
  
  return {
    units: positionSize,
    totalValue,
    riskAmount,
    riskPerUnit,
    maxLossAmount: riskAmount,
    positionSize,
    takeProfitPrice,
    riskRewardRatio: 2,
    potentialProfit
  };
};

// Calculate position size for a specific timeframe
export const calculateTimeframeBasedPosition = (
  input: PositionSizingInput,
  timeframe: TimeframeType
): PositionSizingCalculation => {
  // Adjust risk percentage based on timeframe
  let adjustedRiskPercentage = input.riskPercentage;
  
  // Higher timeframes allow for higher risk, lower timeframes need reduced risk
  switch(timeframe) {
    case '1d':
    case '3d':
    case '1w':
    case '1M':
      // No adjustment for long term trades
      break;
    case '4h':
    case '6h':
    case '8h':
    case '12h':
      // Slightly reduce risk for medium timeframes
      adjustedRiskPercentage = input.riskPercentage * 0.9;
      break;
    default:
      // Significantly reduce risk for short timeframes
      adjustedRiskPercentage = input.riskPercentage * 0.75;
  }
  
  // Calculate position size with adjusted risk
  return calculatePositionSize({
    ...input,
    riskPercentage: adjustedRiskPercentage
  });
};
