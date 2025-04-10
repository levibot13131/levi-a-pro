
import { PricePoint } from "@/types/asset";

// פונקציה לזיהוי תבניות היפוך
export const identifyReversalPatterns = (
  priceData: PricePoint[],
  windowSize: number = 10
): { type: string; position: number; strength: 'weak' | 'medium' | 'strong'; description: string }[] => {
  const patterns = [];
  
  // צריך לפחות windowSize נקודות מחיר
  if (priceData.length < windowSize) return patterns;
  
  // בדיקת תבנית "דאבל טופ" (שיא כפול)
  for (let i = windowSize; i < priceData.length - 3; i++) {
    // חיפוש שני שיאים בגובה דומה עם שקע באמצע
    const peak1 = Math.max(...priceData.slice(i - windowSize, i).map(p => p.price));
    const peak1Pos = priceData.slice(i - windowSize, i).findIndex(p => p.price === peak1) + (i - windowSize);
    
    const valley = Math.min(...priceData.slice(peak1Pos + 1, i + 3).map(p => p.price));
    const valleyPos = priceData.slice(peak1Pos + 1, i + 3).findIndex(p => p.price === valley) + (peak1Pos + 1);
    
    const peakData = priceData.slice(valleyPos + 1, valleyPos + windowSize);
    if (peakData.length < 3) continue;
    
    const peak2 = Math.max(...peakData.map(p => p.price));
    const peak2Pos = peakData.findIndex(p => p.price === peak2) + (valleyPos + 1);
    
    // אם שני השיאים בגובה דומה (הפרש של פחות מ-2%)
    if (Math.abs(peak2 - peak1) / peak1 < 0.02 && 
        valley < peak1 * 0.97 && 
        peak2Pos - peak1Pos > 3) {
      
      patterns.push({
        type: 'double_top',
        position: peak2Pos,
        strength: 'medium',
        description: 'תבנית שיא כפול - סימן היפוך לירידה'
      });
    }
  }
  
  // בדיקת תבנית "דאבל בוטום" (תחתית כפולה)
  for (let i = windowSize; i < priceData.length - 3; i++) {
    // חיפוש שתי תחתיות בגובה דומה עם פסגה באמצע
    const bottom1 = Math.min(...priceData.slice(i - windowSize, i).map(p => p.price));
    const bottom1Pos = priceData.slice(i - windowSize, i).findIndex(p => p.price === bottom1) + (i - windowSize);
    
    const peak = Math.max(...priceData.slice(bottom1Pos + 1, i + 3).map(p => p.price));
    const peakPos = priceData.slice(bottom1Pos + 1, i + 3).findIndex(p => p.price === peak) + (bottom1Pos + 1);
    
    const bottomData = priceData.slice(peakPos + 1, peakPos + windowSize);
    if (bottomData.length < 3) continue;
    
    const bottom2 = Math.min(...bottomData.map(p => p.price));
    const bottom2Pos = bottomData.findIndex(p => p.price === bottom2) + (peakPos + 1);
    
    // אם שתי התחתיות בגובה דומה (הפרש של פחות מ-2%)
    if (Math.abs(bottom2 - bottom1) / bottom1 < 0.02 && 
        peak > bottom1 * 1.03 && 
        bottom2Pos - bottom1Pos > 3) {
      
      patterns.push({
        type: 'double_bottom',
        position: bottom2Pos,
        strength: 'medium',
        description: 'תבנית תחתית כפולה - סימן היפוך לעלייה'
      });
    }
  }
  
  // בדיקת תבנית "ראש וכתפיים" (Head and Shoulders)
  for (let i = windowSize * 2; i < priceData.length - windowSize; i++) {
    const windowData = priceData.slice(i - windowSize * 2, i + windowSize);
    
    // מציאת שלושה שיאים מקומיים
    const peaks = [];
    for (let j = 1; j < windowData.length - 1; j++) {
      if (windowData[j].price > windowData[j-1].price && 
          windowData[j].price > windowData[j+1].price) {
        peaks.push({ price: windowData[j].price, position: j + (i - windowSize * 2) });
      }
    }
    
    // צריך לפחות 3 שיאים
    if (peaks.length < 3) continue;
    
    // בדיקה אם השיא האמצעי הוא הגבוה ביותר והשיאים הצדדיים דומים בגובהם
    for (let p = 0; p < peaks.length - 2; p++) {
      const leftShoulder = peaks[p];
      const head = peaks[p+1];
      const rightShoulder = peaks[p+2];
      
      if (head.price > leftShoulder.price && 
          head.price > rightShoulder.price && 
          Math.abs(leftShoulder.price - rightShoulder.price) / leftShoulder.price < 0.05) {
        
        patterns.push({
          type: 'head_and_shoulders',
          position: rightShoulder.position,
          strength: 'strong',
          description: 'תבנית ראש וכתפיים - סימן היפוך חזק למגמה יורדת'
        });
      }
    }
  }
  
  // תבנית "אדם וחווה" (Adam & Eve)
  for (let i = windowSize; i < priceData.length - windowSize; i++) {
    // חיפוש תחתית חדה ("אדם") ותחתית מעוגלת ("חווה")
    const windowBefore = priceData.slice(i - windowSize, i);
    const windowAfter = priceData.slice(i, i + windowSize);
    
    // מציאת התחתית הראשונה ("אדם") - תחתית חדה וצרה
    const min1 = Math.min(...windowBefore.map(p => p.price));
    const min1Pos = windowBefore.findIndex(p => p.price === min1) + (i - windowSize);
    
    // בדיקה שזו אכן תחתית חדה (ירידה ועלייה מהירות)
    let isSharpBottom = false;
    if (min1Pos > i - windowSize + 1 && min1Pos < i - 1) {
      const dropRate = (windowBefore[min1Pos - 1].price - min1) / windowBefore[min1Pos - 1].price;
      const riseRate = (windowBefore[min1Pos + 1].price - min1) / min1;
      
      isSharpBottom = dropRate > 0.01 && riseRate > 0.01;
    }
    
    if (!isSharpBottom) continue;
    
    // מציאת התחתית השנייה ("חווה") - תחתית מעוגלת ורחבה
    const min2 = Math.min(...windowAfter.map(p => p.price));
    const min2Pos = windowAfter.findIndex(p => p.price === min2) + i;
    
    // בדיקה שזו אכן תחתית מעוגלת (ירידה ועלייה איטיות)
    let isRoundBottom = false;
    if (min2Pos > i + 1 && min2Pos < i + windowSize - 1) {
      // מציאת ממוצע נע של מחירים מסביב לתחתית
      const surroundingPrices = windowAfter.slice(Math.max(0, min2Pos - i - 3), Math.min(windowSize, min2Pos - i + 4));
      const priceVariation = Math.max(...surroundingPrices.map(p => p.price)) - Math.min(...surroundingPrices.map(p => p.price));
      
      isRoundBottom = priceVariation / min2 < 0.03; // שינוי מחיר קטן יחסית מסביב לתחתית
    }
    
    if (!isRoundBottom) continue;
    
    // אם שתי התחתיות ברמה דומה והמרחק ביניהן מספיק
    if (Math.abs(min2 - min1) / min1 < 0.03 && min2Pos - min1Pos > 5) {
      patterns.push({
        type: 'adam_and_eve',
        position: min2Pos,
        strength: 'strong',
        description: 'תבנית אדם וחווה - סימן היפוך חזק למגמה עולה'
      });
    }
  }
  
  return patterns;
};
