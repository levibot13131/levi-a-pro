
import { Asset, AssetHistoricalData } from '@/types/asset';

export const generateTradePlan = (
  assetPrice: number, // Changed from Asset to number
  technicalAnalysis: any,
  smcPatterns: any,
  assetHistory: AssetHistoricalData,
  userStrategy: {
    description: string;
    riskRules: string[];
    entryRules: string[];
    exitRules: string[];
  }
) => {
  // This is a mock implementation that would be expanded in a real app
  if (!technicalAnalysis || !smcPatterns || !assetHistory || !assetPrice) {
    return null;
  }
  
  // Calculate key levels
  const priceData = assetHistory.prices || [];
  const prices = priceData.map((p: any) => p[1]);
  const highestPrice = Math.max(...prices);
  const lowestPrice = Math.min(...prices);
  const range = highestPrice - lowestPrice;
  
  // Support and resistance levels (simplified calculation)
  const supportLevels = [
    Math.round((assetPrice - (range * 0.05)) * 100) / 100,
    Math.round((assetPrice - (range * 0.1)) * 100) / 100,
    Math.round(lowestPrice * 100) / 100
  ];
  
  const resistanceLevels = [
    Math.round((assetPrice + (range * 0.05)) * 100) / 100,
    Math.round((assetPrice + (range * 0.1)) * 100) / 100,
    Math.round(highestPrice * 100) / 100
  ];
  
  // Entry and exit points based on technical analysis
  const signal = technicalAnalysis.overallSignal || 'neutral';
  const direction = signal === 'buy' ? 'long' : signal === 'sell' ? 'short' : 'wait';
  
  let entryPoint = assetPrice;
  let stopLoss = direction === 'long' ? supportLevels[0] : resistanceLevels[0];
  let targets = direction === 'long' 
    ? [resistanceLevels[0], resistanceLevels[1], resistanceLevels[2]]
    : [supportLevels[0], supportLevels[1], supportLevels[2]];
  
  // Calculate risk-reward ratio
  const riskAmount = Math.abs(entryPoint - stopLoss);
  const rewardAmount1 = Math.abs(targets[0] - entryPoint);
  const rewardAmount2 = Math.abs(targets[1] - entryPoint);
  
  const riskRewardRatio1 = rewardAmount1 / riskAmount;
  const riskRewardRatio2 = rewardAmount2 / riskAmount;
  
  // Position sizing calculation (simplified)
  const accountSize = 10000; // Dummy account size of $10,000
  const riskPercentage = 1; // 1% risk per trade as per strategy
  const maxRiskAmount = accountSize * (riskPercentage / 100);
  const positionSize = Math.floor(maxRiskAmount / riskAmount);
  
  return {
    direction,
    action: direction === 'long' ? 'Buy' : direction === 'short' ? 'Sell' : 'Wait',
    entryPoint,
    stopLoss,
    targets,
    riskRewardRatio: [riskRewardRatio1.toFixed(2), riskRewardRatio2.toFixed(2)],
    supportLevels,
    resistanceLevels,
    positionSize,
    riskAmount: maxRiskAmount.toFixed(2),
    timeframe: assetHistory.timeframe || '1d',
    notes: direction === 'wait' 
      ? 'המתן לאיתות ברור יותר או התכנסות של יותר אינדיקטורים'
      : `איתות ${direction === 'long' ? 'קנייה' : 'מכירה'} בעוצמה ${technicalAnalysis.signalStrength || 5}/10`
  };
};
