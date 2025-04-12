
import { PricePoint, TradeSignal, TimeframeType } from "@/types/asset";
import { generateWhaleSignals } from './whaleSignalGenerator';
import { v4 as uuidv4 } from 'uuid';

export const generateSignalsFromHistory = async (
  priceData: PricePoint[],
  strategy: string = "A.A",
  assetId: string = "bitcoin"
): Promise<TradeSignal[]> => {
  if (!priceData || priceData.length < 10) {
    console.log('Not enough price data points for signal generation');
    return [];
  }
  
  // איסוף האיתותים מכל האסטרטגיות
  let signals: TradeSignal[] = [];
  
  // נחליט לפי האסטרטגיה איזה סיגנלים לייצר
  switch (strategy) {
    case "A.A":
    case "KSem":
      // שימוש באסטרטגיית AA של KSem
      signals = await generateAASignals(priceData, assetId);
      break;
    
    case "Whale Activity":
      // איתותי פעילות לווייתנים
      signals = await generateWhaleSignals(priceData, assetId);
      break;
    
    default:
      // ברירת מחדל - אסטרטגיית AA
      signals = await generateAASignals(priceData, assetId);
  }
  
  // מיון האיתותים לפי זמן (מהחדש לישן)
  signals.sort((a, b) => b.timestamp - a.timestamp);
  
  return signals;
};

// אסטרטגיית AA לניתוח מחיר
const generateAASignals = async (
  priceData: PricePoint[],
  assetId: string
): Promise<TradeSignal[]> => {
  const signals: TradeSignal[] = [];
  const strategy = "A.A"; // Define strategy here
  
  // חישובים לזיהוי מגמות ונקודות כניסה
  // ממוצע נע פשוט קצר טווח
  const shortTermPeriod = 7;
  
  // ממוצע נע פשוט ארוך טווח
  const longTermPeriod = 20;
  
  if (priceData.length < longTermPeriod) {
    return signals;
  }
  
  // חישוב ממוצעים נעים
  for (let i = longTermPeriod; i < priceData.length; i++) {
    // חישוב ממוצע קצר
    let shortSum = 0;
    for (let j = 0; j < shortTermPeriod; j++) {
      shortSum += priceData[i - j].price;
    }
    const shortAvg = shortSum / shortTermPeriod;
    
    // חישוב ממוצע ארוך
    let longSum = 0;
    for (let j = 0; j < longTermPeriod; j++) {
      longSum += priceData[i - j].price;
    }
    const longAvg = longSum / longTermPeriod;
    
    // חיפוש חציית ממוצעים - איתות אפשרי
    const prevShortSum = priceData.slice(i - shortTermPeriod - 1, i - 1).reduce((sum, point) => sum + point.price, 0);
    const prevShortAvg = prevShortSum / shortTermPeriod;
    
    const prevLongSum = priceData.slice(i - longTermPeriod - 1, i - 1).reduce((sum, point) => sum + point.price, 0);
    const prevLongAvg = prevLongSum / longTermPeriod;
    
    const timeframe: TimeframeType = "1d";
    const now = Date.now();
    
    // חציית ממוצעים כלפי מעלה - איתות קנייה
    if (prevShortAvg <= prevLongAvg && shortAvg > longAvg) {
      // איתות קנייה
      signals.push({
        id: `${strategy}-${assetId}-buy-${uuidv4()}`,
        assetId,
        type: 'buy',
        price: priceData[i].price,
        timestamp: priceData[i].timestamp,
        strength: Math.random() > 0.6 ? 'strong' : 'medium',
        strategy,
        timeframe,
        targetPrice: priceData[i].price * 1.05,
        stopLoss: priceData[i].price * 0.97,
        riskRewardRatio: 1.67,
        notes: 'חציית ממוצעים נעים כלפי מעלה - איתות קנייה',
        createdAt: now
      });
    }
    // חציית ממוצעים כלפי מטה - איתות מכירה
    else if (prevShortAvg >= prevLongAvg && shortAvg < longAvg) {
      // איתות מכירה
      signals.push({
        id: `${strategy}-${assetId}-sell-${uuidv4()}`,
        assetId,
        type: 'sell',
        price: priceData[i].price,
        timestamp: priceData[i].timestamp,
        strength: Math.random() > 0.6 ? 'strong' : 'medium',
        strategy,
        timeframe,
        targetPrice: priceData[i].price * 0.95,
        stopLoss: priceData[i].price * 1.03,
        riskRewardRatio: 1.67,
        notes: 'חציית ממוצעים נעים כלפי מטה - איתות מכירה',
        createdAt: now
      });
    }
  }
  
  return signals;
};

// ייצוא של פונקציות נוספות אם יש
export * from './whaleSignalGenerator';
