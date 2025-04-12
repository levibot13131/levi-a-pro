
import { TradeSignal } from '@/types/asset';
import { PositionSizingCalculation } from '@/services/customTradingStrategyService';

interface PositionSizeOptions {
  accountSize: number;
  riskPercentage: number;
  customStopLoss?: number;
  useFixedAmount?: boolean;
  fixedAmount?: number;
}

// Default options for position sizing
const defaultOptions: PositionSizeOptions = {
  accountSize: 10000,
  riskPercentage: 1,
  useFixedAmount: false
};

// Calculate position size based on signal and options
export const calculatePositionSize = (
  signal: TradeSignal,
  options: Partial<PositionSizeOptions> = {}
): PositionSizingCalculation => {
  // Merge options with defaults
  const mergedOptions = { ...defaultOptions, ...options };
  
  // Get values
  const { accountSize, riskPercentage, useFixedAmount, fixedAmount } = mergedOptions;
  const entryPrice = signal.price;
  const stopLoss = mergedOptions.customStopLoss || signal.stopLoss || (signal.type === 'buy' 
    ? entryPrice * 0.95 
    : entryPrice * 1.05);
  
  // Calculate risk per unit
  const direction = signal.type === 'buy' ? 'long' : 'short';
  const riskPerUnit = Math.abs(entryPrice - stopLoss);
  
  // Calculate risk amount
  const riskAmount = useFixedAmount && fixedAmount 
    ? fixedAmount 
    : (accountSize * (riskPercentage / 100));
  
  // Calculate position size
  const units = riskAmount / riskPerUnit;
  const positionSize = units * entryPrice;
  
  // Calculate potential profit based on target price
  const targetPrice = signal.targetPrice || (signal.type === 'buy' 
    ? entryPrice + (riskPerUnit * 2) 
    : entryPrice - (riskPerUnit * 2));
  
  const potentialProfit = units * Math.abs(targetPrice - entryPrice);
  
  return {
    positionSize,
    riskAmount,
    potentialProfit,
    riskRewardRatio: potentialProfit / riskAmount,
    maxLossAmount: riskAmount,
    takeProfitPrice: targetPrice
  };
};
