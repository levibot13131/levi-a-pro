
import { PricePoint, TradeSignal } from "@/types/asset";

// יצירת סיגנלים מבוססי תנועות מחיר (מומנטום)
export const generateMomentumSignals = (
  priceData: PricePoint[],
  strategy: string
): TradeSignal[] => {
  const signals: TradeSignal[] = [];
  
  // Simple example: Generate a signal when price increases by 5% in 3 bars
  for (let i = 3; i < priceData.length; i++) {
    const priceChange = (priceData[i].price - priceData[i - 3].price) / priceData[i - 3].price;
    
    if (priceChange > 0.05) {
      signals.push({
        id: `signal-${i}`,
        assetId: 'mock-asset',
        type: 'buy',
        price: priceData[i].price,
        timestamp: priceData[i].timestamp,
        strength: Math.random() > 0.7 ? 'strong' : Math.random() > 0.4 ? 'medium' : 'weak',
        strategy: strategy,
        timeframe: '1d',
        targetPrice: priceData[i].price * 1.1,
        stopLoss: priceData[i].price * 0.95,
        riskRewardRatio: 2.0,
        notes: 'מחיר עלה ב-5% תוך 3 נרות'
      });
    } else if (priceChange < -0.05) {
      signals.push({
        id: `signal-${i}`,
        assetId: 'mock-asset',
        type: 'sell',
        price: priceData[i].price,
        timestamp: priceData[i].timestamp,
        strength: Math.random() > 0.7 ? 'strong' : Math.random() > 0.4 ? 'medium' : 'weak',
        strategy: strategy,
        timeframe: '1d',
        targetPrice: priceData[i].price * 0.9,
        stopLoss: priceData[i].price * 1.05,
        riskRewardRatio: 2.0,
        notes: 'מחיר ירד ב-5% תוך 3 נרות'
      });
    }
  }
  
  return signals;
};
