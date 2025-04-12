
import { PricePoint, TradeSignal } from '@/types/asset';

/**
 * Generate trading signals based on momentum indicators
 */
export function generateMomentumSignals(
  priceData: PricePoint[],
  assetId: string
): TradeSignal[] {
  if (!priceData || priceData.length < 14) {
    return [];
  }
  
  const signals: TradeSignal[] = [];
  
  // Calculate a simple RSI
  const rsiValues = calculateRSI(priceData, 14);
  
  // Generate signals based on RSI
  for (let i = 14; i < priceData.length - 1; i++) {
    // Oversold (RSI < 30): Potential buy signal
    if (rsiValues[i] < 30 && rsiValues[i - 1] >= 30) {
      signals.push({
        id: `momentum-buy-${i}`,
        assetId,
        type: 'buy',
        price: priceData[i].price,
        timestamp: priceData[i].timestamp,
        strength: 'strong',
        strategy: 'RSI Oversold',
        timeframe: '1d',
        targetPrice: priceData[i].price * 1.05,
        stopLoss: priceData[i].price * 0.98,
        riskRewardRatio: 2.5,
        notes: 'RSI entered oversold zone',
        source: 'system',
        createdAt: Date.now()
      });
    }
    
    // Overbought (RSI > 70): Potential sell signal
    if (rsiValues[i] > 70 && rsiValues[i - 1] <= 70) {
      signals.push({
        id: `momentum-sell-${i}`,
        assetId,
        type: 'sell',
        price: priceData[i].price,
        timestamp: priceData[i].timestamp,
        strength: 'strong',
        strategy: 'RSI Overbought',
        timeframe: '1d',
        targetPrice: priceData[i].price * 0.95,
        stopLoss: priceData[i].price * 1.02,
        riskRewardRatio: 2.5,
        notes: 'RSI entered overbought zone',
        source: 'system',
        createdAt: Date.now()
      });
    }
  }
  
  return signals;
}

/**
 * Calculate Relative Strength Index (RSI)
 */
function calculateRSI(priceData: PricePoint[], period: number): number[] {
  const rsi: number[] = [];
  
  // Fill with nulls for the first few periods
  for (let i = 0; i < period; i++) {
    rsi.push(50); // Default to neutral
  }
  
  // Calculate price changes
  const changes: number[] = [];
  for (let i = 1; i < priceData.length; i++) {
    changes.push(priceData[i].price - priceData[i - 1].price);
  }
  
  // Calculate RSI
  for (let i = period; i < priceData.length; i++) {
    const gains = changes.slice(i - period, i).filter(change => change > 0);
    const losses = changes.slice(i - period, i).filter(change => change < 0);
    
    const avgGain = gains.length > 0 ? gains.reduce((sum, val) => sum + val, 0) / period : 0;
    const avgLoss = losses.length > 0 ? Math.abs(losses.reduce((sum, val) => sum + val, 0)) / period : 0;
    
    if (avgLoss === 0) {
      rsi.push(100);
    } else {
      const rs = avgGain / avgLoss;
      rsi.push(100 - (100 / (1 + rs)));
    }
  }
  
  return rsi;
}
