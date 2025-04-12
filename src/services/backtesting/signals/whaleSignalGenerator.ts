
import { v4 as uuidv4 } from 'uuid';
import { PricePoint, TradeSignal } from '@/types/asset';

// Function to generate whale activity signals
export const generateWhaleSignals = (
  priceData: PricePoint[],
  volumeData: {time: string, value: number}[],
  assetId: string,
  timeframe: string
): TradeSignal[] => {
  const signals: TradeSignal[] = [];
  
  // Need matching price and volume data
  if (priceData.length !== volumeData.length || priceData.length < 10) {
    return signals;
  }
  
  // Calculate average volume for the last 10 periods
  const recentVolumes = volumeData.slice(-10);
  const avgVolume = recentVolumes.reduce((sum, item) => sum + item.value, 0) / recentVolumes.length;
  
  // Look for volume spikes (2x average) with price movement
  for (let i = priceData.length - 10; i < priceData.length; i++) {
    const volume = volumeData[i].value;
    const price = priceData[i].value;
    const prevPrice = priceData[i - 1].value;
    
    // Skip if not a significant volume spike
    if (volume < avgVolume * 2) continue;
    
    // Calculate price change percentage
    const priceChange = (price - prevPrice) / prevPrice * 100;
    
    // Significant price increase with high volume = buy signal
    if (priceChange > 3) {
      signals.push({
        id: uuidv4(),
        assetId,
        type: 'buy',
        price: price,
        timestamp: new Date(priceData[i].time).getTime(),
        strength: getSignalStrength(volume, avgVolume),
        strategy: 'Whale Activity',
        timeframe,
        targetPrice: price * 1.1, // 10% target
        stopLoss: price * 0.95, // 5% stop loss
        riskRewardRatio: 2,
        createdAt: Date.now(),
        notes: `Significant volume spike (${(volume / avgVolume).toFixed(1)}x average) with ${priceChange.toFixed(1)}% price increase`,
        indicator: 'Volume Spike',
        // Remove the source property since it doesn't exist in TradeSignal type
      });
    }
    
    // Significant price decrease with high volume = sell signal
    if (priceChange < -3) {
      signals.push({
        id: uuidv4(),
        assetId,
        type: 'sell',
        price: price,
        timestamp: new Date(priceData[i].time).getTime(),
        strength: getSignalStrength(volume, avgVolume),
        strategy: 'Whale Activity',
        timeframe,
        targetPrice: price * 0.9, // 10% target
        stopLoss: price * 1.05, // 5% stop loss
        riskRewardRatio: 2,
        createdAt: Date.now(),
        notes: `Significant volume spike (${(volume / avgVolume).toFixed(1)}x average) with ${Math.abs(priceChange).toFixed(1)}% price decrease`,
        indicator: 'Volume Spike',
      });
    }
  }
  
  return signals;
};

// Helper function to determine signal strength based on volume spike magnitude
const getSignalStrength = (
  volume: number, 
  avgVolume: number
): 'weak' | 'medium' | 'strong' => {
  const ratio = volume / avgVolume;
  
  if (ratio > 5) return 'strong';
  if (ratio > 3) return 'medium';
  return 'weak';
};
