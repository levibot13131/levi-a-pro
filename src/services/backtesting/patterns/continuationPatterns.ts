
import { PricePoint } from "@/types/asset";

// זיהוי תבניות המשכיות
export const identifyContinuationPatterns = (
  priceData: PricePoint[],
  windowSize: number = 10
): { type: string; position: number; strength: 'weak' | 'medium' | 'strong'; description: string }[] => {
  const patterns = [];
  
  // מציאת תבנית "דגל" (Flag pattern)
  for (let i = windowSize; i < priceData.length - windowSize/2; i++) {
    // בדיקת מהלך חזק כלפי מעלה או מטה
    const trendStart = i - windowSize;
    const trendEnd = i - windowSize/2;
    
    const startPrice = priceData[trendStart].price;
    const endPrice = priceData[trendEnd].price;
    const priceChange = (endPrice - startPrice) / startPrice;
    
    // אם יש מהלך חזק (מעל 5% שינוי)
    if (Math.abs(priceChange) > 0.05) {
      // בדיקת התכנסות מחירים אחרי המהלך
      const consolidationStart = trendEnd;
      const consolidationEnd = i;
      
      const consolidationPrices = priceData.slice(consolidationStart, consolidationEnd).map(p => p.price);
      const maxPrice = Math.max(...consolidationPrices);
      const minPrice = Math.min(...consolidationPrices);
      const priceRange = (maxPrice - minPrice) / minPrice;
      
      // אם טווח המחירים בהתכנסות קטן (פחות מ-3%)
      if (priceRange < 0.03) {
        patterns.push({
          type: priceChange > 0 ? 'bull_flag' : 'bear_flag',
          position: i,
          strength: 'medium',
          description: priceChange > 0 ? 
            'תבנית דגל עולה - התכנסות אחרי עלייה חדה, צפי להמשך מגמה עולה' : 
            'תבנית דגל יורד - התכנסות אחרי ירידה חדה, צפי להמשך מגמה יורדת'
        });
      }
    }
  }
  
  return patterns;
};
