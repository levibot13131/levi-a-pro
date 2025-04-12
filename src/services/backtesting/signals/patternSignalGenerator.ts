
import { v4 as uuidv4 } from 'uuid';
import { PricePoint, TradeSignal } from '@/types/asset';
import { findHeadAndShoulders, findDoubleTop, findDoubleBottom } from '../patterns/reversalPatterns';
import { findBullishFlag, findBearishFlag } from '../patterns/continuationPatterns';
import { findAscendingTriangle, findDescendingTriangle } from '../patterns/trianglePatterns';

// Function to generate pattern-based signals
export const generatePatternSignals = (
  priceData: PricePoint[],
  assetId: string,
  timeframe: string
): TradeSignal[] => {
  const signals: TradeSignal[] = [];
  
  // Need at least 30 data points for pattern detection
  if (priceData.length < 30) {
    return signals;
  }
  
  // Detect patterns
  const headAndShouldersPattern = findHeadAndShoulders(priceData);
  const doubleTopPattern = findDoubleTop(priceData);
  const doubleBottomPattern = findDoubleBottom(priceData);
  const bullishFlagPattern = findBullishFlag(priceData);
  const bearishFlagPattern = findBearishFlag(priceData);
  const ascendingTrianglePattern = findAscendingTriangle(priceData);
  const descendingTrianglePattern = findDescendingTriangle(priceData);
  
  // Generate signals for head and shoulders (bearish reversal)
  if (headAndShouldersPattern) {
    signals.push({
      id: uuidv4(),
      assetId,
      type: 'sell',
      price: priceData[priceData.length - 1].value,
      timestamp: new Date(priceData[priceData.length - 1].time).getTime(),
      strength: 'strong',
      strategy: 'Pattern Recognition',
      timeframe,
      targetPrice: calculateTargetPrice(priceData, 'sell', 'head-and-shoulders'),
      stopLoss: calculateStopLoss(priceData, 'sell'),
      riskRewardRatio: 2.5,
      createdAt: Date.now(),
      notes: 'Head and Shoulders pattern detected, suggesting potential reversal',
      indicator: 'Chart Pattern',
    });
  }
  
  // Generate signals for double bottom (bullish reversal)
  if (doubleBottomPattern) {
    signals.push({
      id: uuidv4(),
      assetId,
      type: 'buy',
      price: priceData[priceData.length - 1].value,
      timestamp: new Date(priceData[priceData.length - 1].time).getTime(),
      strength: 'strong',
      strategy: 'Pattern Recognition',
      timeframe,
      targetPrice: calculateTargetPrice(priceData, 'buy', 'double-bottom'),
      stopLoss: calculateStopLoss(priceData, 'buy'),
      riskRewardRatio: 2.5,
      createdAt: Date.now(),
      notes: 'Double Bottom pattern detected, suggesting potential reversal',
      indicator: 'Chart Pattern',
    });
  }
  
  // Generate signals for other patterns similarly...
  
  return signals;
};

// Helper function to calculate target price based on pattern
const calculateTargetPrice = (
  data: PricePoint[], 
  type: 'buy' | 'sell',
  pattern: string
): number => {
  // This is a simplified example
  // In a real app, you'd have more sophisticated calculations
  
  const currentPrice = data[data.length - 1].value;
  
  if (type === 'buy') {
    return currentPrice * 1.1; // 10% target
  } else {
    return currentPrice * 0.9; // 10% target
  }
};

// Helper function to calculate stop loss
const calculateStopLoss = (
  data: PricePoint[], 
  type: 'buy' | 'sell'
): number => {
  // This is a simplified example
  
  const currentPrice = data[data.length - 1].value;
  
  if (type === 'buy') {
    return currentPrice * 0.95; // 5% stop loss
  } else {
    return currentPrice * 1.05; // 5% stop loss
  }
};
