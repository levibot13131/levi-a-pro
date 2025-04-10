
import { Trade } from '../types';
import { DetectedPattern } from './types';

// Type for price data with OHLC
interface PriceData {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

// Detect candlestick patterns in trade history
export const detectPatterns = (
  trades: Trade[], 
  assetPrices: PriceData[]
): DetectedPattern[] => {
  const patterns: DetectedPattern[] = [];
  
  // Need at least a few data points for pattern detection
  if (assetPrices.length < 5) return patterns;
  
  // Example pattern detection (in reality, would use more sophisticated algorithms)
  
  // Check for double bottom pattern
  for (let i = 2; i < assetPrices.length - 2; i++) {
    const firstBottom = assetPrices[i-2];
    const middle = assetPrices[i];
    const secondBottom = assetPrices[i+2];
    
    if (
      firstBottom.low < firstBottom.open && 
      firstBottom.low < assetPrices[i-1].low &&
      secondBottom.low < secondBottom.open &&
      secondBottom.low < assetPrices[i+1].low &&
      Math.abs(firstBottom.low - secondBottom.low) / firstBottom.low < 0.03 && // Bottoms within 3%
      middle.low > firstBottom.low * 1.03 // Middle at least 3% higher
    ) {
      patterns.push({
        name: 'Double Bottom',
        type: 'bullish',
        startDate: new Date(firstBottom.date).toISOString(),
        endDate: new Date(secondBottom.date).toISOString(),
        significance: 8,
        description: 'תבנית דאבל בוטום מצביעה על תמיכה משמעותית והיפוך מגמה פוטנציאלי'
      });
    }
  }
  
  // Check for head and shoulders pattern
  for (let i = 4; i < assetPrices.length - 2; i++) {
    const leftShoulder = assetPrices[i-4];
    const head = assetPrices[i-2];
    const rightShoulder = assetPrices[i];
    
    if (
      head.high > leftShoulder.high &&
      head.high > rightShoulder.high &&
      Math.abs(leftShoulder.high - rightShoulder.high) / leftShoulder.high < 0.05 && // Shoulders within 5%
      assetPrices[i-3].low < leftShoulder.low * 1.02 && // Neck line
      assetPrices[i-1].low < rightShoulder.low * 1.02
    ) {
      patterns.push({
        name: 'Head and Shoulders',
        type: 'bearish',
        startDate: new Date(leftShoulder.date).toISOString(),
        endDate: new Date(rightShoulder.date).toISOString(),
        significance: 9,
        description: 'תבנית הראש והכתפיים מצביעה על היפוך מגמה מעליות לירידות, סיכוי גבוה לתחילת מגמה יורדת'
      });
    }
  }
  
  return patterns;
};
