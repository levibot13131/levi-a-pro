
import { PricePoint, TradeSignal } from '@/types/asset';

/**
 * Generate trading signals based on "whale" activity (large volume spikes)
 */
export function generateWhaleSignals(
  priceData: PricePoint[],
  assetId: string
): TradeSignal[] {
  if (!priceData || priceData.length < 10) {
    return [];
  }
  
  const signals: TradeSignal[] = [];
  
  // Need volume data to detect whale activity
  const priceWithVolume = priceData.filter(point => point.volume !== undefined);
  
  if (priceWithVolume.length < 10) {
    return signals;
  }
  
  // Calculate average volume
  const volumes = priceWithVolume.map(point => point.volume || 0);
  const avgVolume = volumes.reduce((sum, vol) => sum + vol, 0) / volumes.length;
  
  // Look for significant volume spikes (3x average)
  for (let i = 5; i < priceWithVolume.length - 1; i++) {
    const currentVolume = priceWithVolume[i].volume || 0;
    const previousVolume = priceWithVolume[i - 1].volume || 0;
    
    // Check if current volume is significantly higher than average
    if (currentVolume > avgVolume * 3 && currentVolume > previousVolume * 2) {
      // Determine if it's a buy or sell signal based on price action
      const priceChange = priceWithVolume[i + 1].price - priceWithVolume[i - 1].price;
      const signalType = priceChange > 0 ? 'buy' : 'sell';
      
      signals.push({
        id: `whale-${signalType}-${i}`,
        assetId,
        type: signalType,
        price: priceWithVolume[i].price,
        timestamp: priceWithVolume[i].timestamp,
        strength: 'strong',
        strategy: 'Whale Volume Spike',
        timeframe: '1d',
        targetPrice: signalType === 'buy' 
          ? priceWithVolume[i].price * 1.05 
          : priceWithVolume[i].price * 0.95,
        stopLoss: signalType === 'buy'
          ? priceWithVolume[i].price * 0.98
          : priceWithVolume[i].price * 1.02,
        riskRewardRatio: 2.5,
        notes: `Significant volume spike detected (${(currentVolume / avgVolume).toFixed(1)}x average)`,
        source: 'system',
        createdAt: Date.now()
      });
    }
  }
  
  return signals;
}
