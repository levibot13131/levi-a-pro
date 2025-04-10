
import { PricePoint, TradeSignal } from "@/types/asset";
import { identifyReversalPatterns } from "../patterns/reversalPatterns";
import { identifyContinuationPatterns } from "../patterns/continuationPatterns";
import { identifyTrianglePatterns } from "../patterns/trianglePatterns";

// יצירת סיגנלים מתבניות מחיר
export const generatePatternSignals = (
  priceData: PricePoint[],
  strategy: string
): TradeSignal[] => {
  const signals: TradeSignal[] = [];
  
  // זיהוי תבניות היפוך
  const reversalPatterns = identifyReversalPatterns(priceData);
  const continuationPatterns = identifyContinuationPatterns(priceData);
  const trianglePatterns = identifyTrianglePatterns(priceData);
  
  // איחוד כל התבניות
  const patterns = [...reversalPatterns, ...continuationPatterns, ...trianglePatterns];
  
  // יצירת סיגנלים מתבניות
  for (const pattern of patterns) {
    const position = pattern.position;
    if (position >= priceData.length) continue;
    
    const price = priceData[position].price;
    const isBullish = 
      pattern.type === 'double_bottom' || 
      pattern.type === 'adam_and_eve' || 
      pattern.type === 'ascending_triangle' ||
      pattern.type === 'bull_flag' ||
      (pattern.type === 'converging_triangle' && Math.random() > 0.5);
    
    const isBearish = 
      pattern.type === 'double_top' || 
      pattern.type === 'head_and_shoulders' || 
      pattern.type === 'descending_triangle' ||
      pattern.type === 'bear_flag' ||
      (pattern.type === 'converging_triangle' && Math.random() <= 0.5);
    
    // הגדרת יחס סיכוי/סיכון
    let riskRewardRatio = 2.0;
    if (pattern.strength === 'strong') riskRewardRatio = 3.0;
    else if (pattern.strength === 'weak') riskRewardRatio = 1.5;
    
    // הגדרת מטרות ורמות סטופ לוס
    const stopLossPercent = isBullish ? 0.03 : 0.07;
    const targetPercent = stopLossPercent * riskRewardRatio;
    
    if (isBullish) {
      signals.push({
        id: `signal-${pattern.type}-${position}`,
        assetId: 'mock-asset',
        type: 'buy',
        price: price,
        timestamp: priceData[position].timestamp,
        strength: pattern.strength,
        strategy: strategy,
        timeframe: '1d',
        targetPrice: price * (1 + targetPercent),
        stopLoss: price * (1 - stopLossPercent),
        riskRewardRatio: riskRewardRatio,
        notes: pattern.description
      });
    } else if (isBearish) {
      signals.push({
        id: `signal-${pattern.type}-${position}`,
        assetId: 'mock-asset',
        type: 'sell',
        price: price,
        timestamp: priceData[position].timestamp,
        strength: pattern.strength,
        strategy: strategy,
        timeframe: '1d',
        targetPrice: price * (1 - targetPercent),
        stopLoss: price * (1 + stopLossPercent),
        riskRewardRatio: riskRewardRatio,
        notes: pattern.description
      });
    }
  }
  
  return signals;
};
