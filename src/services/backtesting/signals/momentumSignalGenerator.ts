
import { v4 as uuidv4 } from 'uuid';
import { PricePoint, TradeSignal } from '@/types/asset';

// Function to generate momentum-based signals
export const generateMomentumSignals = (
  priceData: PricePoint[],
  assetId: string,
  timeframe: string
): TradeSignal[] => {
  const signals: TradeSignal[] = [];
  
  // Need at least 20 data points to generate signals
  if (priceData.length < 20) {
    return signals;
  }
  
  // Simple momentum detection (price crossing average)
  const shortTermAvg = calculateMovingAverage(priceData, 5);
  const longTermAvg = calculateMovingAverage(priceData, 20);
  
  for (let i = 1; i < priceData.length; i++) {
    // Buy signal: short-term MA crosses above long-term MA
    if (
      shortTermAvg[i - 1] <= longTermAvg[i - 1] &&
      shortTermAvg[i] > longTermAvg[i]
    ) {
      signals.push({
        id: uuidv4(),
        assetId,
        type: 'buy',
        price: priceData[i].value,
        timestamp: new Date(priceData[i].time).getTime(),
        strength: getSignalStrength(priceData, i, 'buy'),
        strategy: 'Momentum Crossover',
        timeframe,
        targetPrice: priceData[i].value * 1.05, // 5% target
        stopLoss: priceData[i].value * 0.97, // 3% stop loss
        riskRewardRatio: 5/3, // Risk reward ratio
        createdAt: Date.now(),
        notes: 'Short-term moving average crossed above long-term moving average',
        indicator: 'MA Crossover',
        // Remove the source property since it doesn't exist in TradeSignal type
      });
    }
    
    // Sell signal: short-term MA crosses below long-term MA
    if (
      shortTermAvg[i - 1] >= longTermAvg[i - 1] &&
      shortTermAvg[i] < longTermAvg[i]
    ) {
      signals.push({
        id: uuidv4(),
        assetId,
        type: 'sell',
        price: priceData[i].value,
        timestamp: new Date(priceData[i].time).getTime(),
        strength: getSignalStrength(priceData, i, 'sell'),
        strategy: 'Momentum Crossover',
        timeframe,
        targetPrice: priceData[i].value * 0.95, // 5% target
        stopLoss: priceData[i].value * 1.03, // 3% stop loss
        riskRewardRatio: 5/3, // Risk reward ratio
        createdAt: Date.now(),
        notes: 'Short-term moving average crossed below long-term moving average',
        indicator: 'MA Crossover',
        // Remove the source property since it doesn't exist in TradeSignal type
      });
    }
  }
  
  return signals;
};

// Helper function to calculate moving average
const calculateMovingAverage = (data: PricePoint[], period: number): number[] => {
  const result: number[] = [];
  for (let i = 0; i < data.length; i++) {
    if (i < period - 1) {
      result.push(0);
      continue;
    }
    
    let sum = 0;
    for (let j = 0; j < period; j++) {
      sum += data[i - j].value;
    }
    result.push(sum / period);
  }
  return result;
};

// Helper function to determine signal strength
const getSignalStrength = (
  data: PricePoint[], 
  index: number, 
  type: 'buy' | 'sell'
): 'weak' | 'medium' | 'strong' => {
  // This is a simplified example
  // In a real app, you'd have more sophisticated logic
  
  if (index < 5) return 'medium'; // Not enough historical data
  
  const currentPrice = data[index].value;
  const previousPrice = data[index - 5].value;
  const priceChange = Math.abs((currentPrice - previousPrice) / previousPrice * 100);
  
  if (priceChange > 5) return 'strong';
  if (priceChange > 2) return 'medium';
  return 'weak';
};
