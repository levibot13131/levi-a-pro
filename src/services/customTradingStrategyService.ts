export interface PositionSizingCalculation {
  accountSize: number;
  riskPercentage: number;
  entryPrice: number;
  stopLossPrice: number;
  takeProfitPrice?: number; // Added this property
  positionSize: number;
  maxLossAmount: number;
  potentialProfit: number;
  riskRewardRatio: number;
}
