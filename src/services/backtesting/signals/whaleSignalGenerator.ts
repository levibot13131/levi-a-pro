
import { PricePoint, TradeSignal } from "@/types/asset";

// יצירת סיגנלים המבוססים על פעילות של "לווייתנים" (משקיעים גדולים)
export const generateWhaleSignals = async (
  priceData: PricePoint[],
  assetId: string,
  strategy: string
): Promise<TradeSignal[]> => {
  const signals: TradeSignal[] = [];
  
  // למטרות הדגמה, נייצר סיגנלים אקראיים בנקודות ספציפיות
  // במערכת אמיתית, יש להתחבר ל-API חיצוני שמספק מידע על פעילות לווייתנים
  
  // נבחר נקודות אקראיות לסיגנלים של לווייתנים
  const dataPoints = [...priceData];
  const selectedPoints: number[] = [];
  
  // בחירת מספר אקראי של נקודות (בין 3 ל-7)
  const numPoints = 3 + Math.floor(Math.random() * 5);
  
  for (let i = 0; i < numPoints; i++) {
    const randomIndex = 10 + Math.floor(Math.random() * (dataPoints.length - 20));
    if (!selectedPoints.includes(randomIndex)) {
      selectedPoints.push(randomIndex);
    }
  }
  
  // יצירת סיגנלים בנקודות הנבחרות
  for (const index of selectedPoints) {
    const isBuy = Math.random() > 0.5;
    const strength = Math.random() > 0.7 ? 'strong' : Math.random() > 0.4 ? 'medium' : 'weak';
    
    signals.push({
      id: `whale-${index}`,
      assetId: assetId,
      type: isBuy ? 'buy' : 'sell',
      price: dataPoints[index].price,
      timestamp: dataPoints[index].timestamp,
      strength: strength,
      strategy: strategy,
      timeframe: '1d',
      targetPrice: isBuy ? dataPoints[index].price * 1.15 : dataPoints[index].price * 0.85,
      stopLoss: isBuy ? dataPoints[index].price * 0.95 : dataPoints[index].price * 1.05,
      riskRewardRatio: 3.0,
      notes: isBuy 
        ? 'זוהתה כניסה משמעותית של לווייתן לשוק' 
        : 'זוהתה יציאה משמעותית של לווייתן מהשוק'
    });
  }
  
  return signals;
};
