
import { PricePoint } from "@/types/asset";

// זיהוי תבניות משולשים
export const identifyTrianglePatterns = (
  priceData: PricePoint[],
  windowSize: number = 10
): { type: string; position: number; strength: 'weak' | 'medium' | 'strong'; description: string }[] => {
  const patterns = [];
  
  // תבנית "משולש" (Triangle patterns)
  for (let i = windowSize * 2; i < priceData.length; i++) {
    const windowData = priceData.slice(i - windowSize * 2, i);
    
    // מציאת שיאים ותחתיות
    const highPrices = [];
    const lowPrices = [];
    
    for (let j = 1; j < windowData.length - 1; j++) {
      // שיא מקומי
      if (windowData[j].price > windowData[j-1].price && 
          windowData[j].price > windowData[j+1].price) {
        highPrices.push({ price: windowData[j].price, position: j });
      }
      
      // תחתית מקומית
      if (windowData[j].price < windowData[j-1].price && 
          windowData[j].price < windowData[j+1].price) {
        lowPrices.push({ price: windowData[j].price, position: j });
      }
    }
    
    // צריך לפחות 3 שיאים ו-3 תחתיות
    if (highPrices.length < 3 || lowPrices.length < 3) continue;
    
    // בדיקת משולש מתכנס - השיאים יורדים והתחתיות עולות
    const isConvergingTriangle = 
      highPrices[highPrices.length-1].price < highPrices[0].price && 
      lowPrices[lowPrices.length-1].price > lowPrices[0].price;
    
    // בדיקת משולש עולה - השיאים שטוחים והתחתיות עולות
    const isAscendingTriangle = 
      Math.abs(highPrices[highPrices.length-1].price - highPrices[0].price) / highPrices[0].price < 0.02 && 
      lowPrices[lowPrices.length-1].price > lowPrices[0].price;
    
    // בדיקת משולש יורד - השיאים יורדים והתחתיות שטוחות
    const isDescendingTriangle = 
      highPrices[highPrices.length-1].price < highPrices[0].price && 
      Math.abs(lowPrices[lowPrices.length-1].price - lowPrices[0].price) / lowPrices[0].price < 0.02;
    
    if (isConvergingTriangle) {
      patterns.push({
        type: 'converging_triangle',
        position: i,
        strength: 'medium',
        description: 'תבנית משולש מתכנס - התכנסות לפני פריצה. המשך המגמה תלוי בכיוון הפריצה'
      });
    } else if (isAscendingTriangle) {
      patterns.push({
        type: 'ascending_triangle',
        position: i,
        strength: 'strong',
        description: 'תבנית משולש עולה - סימן לפריצה כלפי מעלה'
      });
    } else if (isDescendingTriangle) {
      patterns.push({
        type: 'descending_triangle',
        position: i,
        strength: 'strong',
        description: 'תבנית משולש יורד - סימן לפריצה כלפי מטה'
      });
    }
  }
  
  return patterns;
};
