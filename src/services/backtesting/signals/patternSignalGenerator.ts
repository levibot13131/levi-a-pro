
import { PricePoint, TradeSignal } from '@/types/asset';

/**
 * Generate trading signals based on price patterns
 */
export function generatePatternSignals(
  priceData: PricePoint[],
  assetId: string
): TradeSignal[] {
  if (!priceData || priceData.length < 20) {
    return [];
  }
  
  const signals: TradeSignal[] = [];
  
  // Look for double bottom pattern (very simplified)
  for (let i = 20; i < priceData.length - 1; i++) {
    // Check for first bottom
    if (
      priceData[i - 10].price > priceData[i - 5].price &&
      priceData[i - 5].price < priceData[i].price &&
      // Second bottom around the same level
      Math.abs(priceData[i - 5].price - priceData[i].price) / priceData[i - 5].price < 0.03 &&
      // Price going up after second bottom
      priceData[i].price < priceData[i + 1].price
    ) {
      // Double bottom: Potential buy signal
      signals.push({
        id: `pattern-buy-${i}`,
        assetId,
        type: 'buy',
        price: priceData[i + 1].price,
        timestamp: priceData[i + 1].timestamp,
        strength: 'strong',
        strategy: 'Double Bottom',
        timeframe: '1d',
        targetPrice: priceData[i + 1].price * 1.10,
        stopLoss: priceData[i].price * 0.98,
        riskRewardRatio: 5.0,
        notes: 'Double bottom pattern detected',
        source: 'system',
        createdAt: Date.now()
      });
    }
  }
  
  // Look for double top pattern (very simplified)
  for (let i = 20; i < priceData.length - 1; i++) {
    // Check for first top
    if (
      priceData[i - 10].price < priceData[i - 5].price &&
      priceData[i - 5].price > priceData[i].price &&
      // Second top around the same level
      Math.abs(priceData[i - 5].price - priceData[i].price) / priceData[i - 5].price < 0.03 &&
      // Price going down after second top
      priceData[i].price > priceData[i + 1].price
    ) {
      // Double top: Potential sell signal
      signals.push({
        id: `pattern-sell-${i}`,
        assetId,
        type: 'sell',
        price: priceData[i + 1].price,
        timestamp: priceData[i + 1].timestamp,
        strength: 'strong',
        strategy: 'Double Top',
        timeframe: '1d',
        targetPrice: priceData[i + 1].price * 0.90,
        stopLoss: priceData[i].price * 1.02,
        riskRewardRatio: 5.0,
        notes: 'Double top pattern detected',
        source: 'system',
        createdAt: Date.now()
      });
    }
  }
  
  return signals;
}
