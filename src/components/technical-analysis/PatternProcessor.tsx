
import React from 'react';
import { AssetHistoricalData, ChartArea } from '@/types/asset';

interface PatternProcessorProps {
  analysisData: any;
  wyckoffPatterns: any;
  smcPatterns: any;
  assetHistory: AssetHistoricalData | undefined;
}

const PatternProcessor: React.FC<PatternProcessorProps> = ({
  analysisData,
  wyckoffPatterns,
  smcPatterns,
  assetHistory
}) => {
  // This component doesn't render anything directly
  // It processes data and returns it for use in parent components
  
  // Processing logic for patterns
  const processedAnalysisData = React.useMemo(() => {
    if (!analysisData) return null;
    
    const enhancedData = { ...analysisData };
    
    // הוספת תבניות שזוהו מהניתוחים השונים
    const patterns = [];
    
    // הוספת תבניות וויקוף אם קיימות
    if (wyckoffPatterns?.patterns && wyckoffPatterns.patterns.length > 0) {
      wyckoffPatterns.patterns.forEach((pattern: any, idx: number) => {
        if (!pattern.chartArea && assetHistory) {
          // ייצור אזור גרף לדוגמה אם אין מידע ספציפי
          const dataLength = assetHistory.data.length;
          const quarter = Math.floor(dataLength / 4);
          
          const chartArea: ChartArea = {
            startTimestamp: assetHistory.data[quarter * (idx % 3)].timestamp,
            endTimestamp: assetHistory.data[Math.min(quarter * (idx % 3 + 1) + quarter, dataLength - 1)].timestamp,
            minPrice: Math.min(...assetHistory.data.slice(quarter * (idx % 3), quarter * (idx % 3 + 1) + quarter).map(p => p.price)) * 0.98,
            maxPrice: Math.max(...assetHistory.data.slice(quarter * (idx % 3), quarter * (idx % 3 + 1) + quarter).map(p => p.price)) * 1.02
          };
          
          pattern.chartArea = chartArea;
        }
        
        patterns.push({
          ...pattern,
          type: pattern.phase === 'אקומולציה' ? 'bullish' : pattern.phase === 'דיסטריביושן' ? 'bearish' : 'neutral'
        });
      });
    }
    
    // הוספת תבניות SMC אם קיימות
    if (smcPatterns?.patterns && smcPatterns.patterns.length > 0) {
      smcPatterns.patterns.forEach((pattern: any, idx: number) => {
        if (!pattern.chartArea && assetHistory) {
          // ייצור אזור גרף לדוגמה אם אין מידע ספציפי
          const dataLength = assetHistory.data.length;
          const third = Math.floor(dataLength / 3);
          
          const chartArea: ChartArea = {
            startTimestamp: assetHistory.data[third * (idx % 2) + third].timestamp,
            endTimestamp: assetHistory.data[Math.min(third * (idx % 2 + 1) + third, dataLength - 1)].timestamp,
            minPrice: pattern.entryZone?.min || (Math.min(...assetHistory.data.slice(third * (idx % 2) + third, third * (idx % 2 + 1) + third).map(p => p.price)) * 0.98),
            maxPrice: pattern.entryZone?.max || (Math.max(...assetHistory.data.slice(third * (idx % 2) + third, third * (idx % 2 + 1) + third).map(p => p.price)) * 1.02)
          };
          
          pattern.chartArea = chartArea;
        }
        
        patterns.push({
          ...pattern,
          type: pattern.bias || 'neutral'
        });
      });
    }
    
    enhancedData.patterns = patterns;
    
    // הוספת רמות מפתח אם קיימות ואם אין כבר רמות בניתוח
    if (!enhancedData.keyLevels && assetHistory) {
      const keyLevels = [];
      
      // רמות תמיכה והתנגדות לדוגמה - בגרסה אמיתית אלו יבואו מאלגוריתם ניתוח
      const prices = assetHistory.data.map(p => p.price);
      const maxPrice = Math.max(...prices);
      const minPrice = Math.min(...prices);
      const range = maxPrice - minPrice;
      
      // רמת התנגדות עליונה
      keyLevels.push({
        name: 'התנגדות עליונה',
        price: maxPrice - (range * 0.1),
        type: 'resistance' as const
      });
      
      // רמת תמיכה תחתונה
      keyLevels.push({
        name: 'תמיכה עיקרית',
        price: minPrice + (range * 0.15),
        type: 'support' as const
      });
      
      // רמת פיבונאצ'י 0.618
      keyLevels.push({
        name: 'פיבונאצ\'י 0.618',
        price: minPrice + (range * 0.618),
        type: range * 0.618 < (maxPrice - minPrice) / 2 ? 'support' as const : 'resistance' as const
      });
      
      enhancedData.keyLevels = keyLevels;
    }
    
    // הוספת הסברים מפורטים לסיגנלים
    if (enhancedData.signals) {
      enhancedData.signals = enhancedData.signals.map((signal: any) => {
        let reason = '';
        
        if (signal.indicator === 'RSI') {
          reason = signal.type === 'buy' 
            ? 'ה-RSI עלה מאזור מכירת יתר, מציין היפוך מגמה פוטנציאלי כלפי מעלה'
            : 'ה-RSI ירד מאזור קניית יתר, מציין היפוך מגמה פוטנציאלי כלפי מטה';
        } else if (signal.indicator === 'MACD') {
          reason = signal.type === 'buy'
            ? 'חיתוך קו MACD את קו האיתות כלפי מעלה, מציין מומנטום חיובי' 
            : 'חיתוך קו MACD את קו האיתות כלפי מטה, מציין מומנטום שלילי';
        } else if (signal.indicator === 'ממוצע נע') {
          reason = signal.type === 'buy'
            ? 'המחיר חצה את הממוצע הנע כלפי מעלה, מציין מגמה עולה'
            : 'המחיר חצה את הממוצע הנע כלפי מטה, מציין מגמה יורדת';
        } else if (signal.indicator === 'תבנית מחיר') {
          reason = signal.type === 'buy'
            ? 'זוהתה תבנית מחיר עולה, מציינת פוטנציאל לעלייה'
            : 'זוהתה תבנית מחיר יורדת, מציינת פוטנציאל לירידה';
        }
        
        return {
          ...signal,
          reason
        };
      });
    }
    
    return enhancedData;
  }, [analysisData, wyckoffPatterns, smcPatterns, assetHistory]);

  return processedAnalysisData;
};

export default PatternProcessor;
