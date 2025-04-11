
import { TradeSignal } from '@/types/asset';

/**
 * Generate a mock trade signal for testing
 */
export const generateMockSignal = (assetId: string, strategy?: string): TradeSignal => {
  const assetNames: Record<string, string> = {
    'bitcoin': 'Bitcoin',
    'ethereum': 'Ethereum',
    'solana': 'Solana',
    'aapl': 'Apple',
    'amzn': 'Amazon',
  };
  
  const assetName = assetNames[assetId] || 'Unknown Asset';
  const signalType = Math.random() > 0.5 ? 'buy' : 'sell';
  const price = 1000 + Math.random() * 50000;
  const currentTime = new Date();
  
  // Generate different reasons based on strategy
  let strategyName = strategy || 'A.A';
  let notes = '';
  
  if (strategyName === 'A.A') {
    notes = signalType === 'buy' 
      ? 'זוהתה פריצת רמת התנגדות משמעותית עם נפח מסחר גבוה. מומלץ להכנס לפוזיציית קנייה עם יחס סיכוי/סיכון 1:3.' 
      : 'זוהתה שבירת רמת תמיכה משמעותית. מומלץ להכנס לפוזיציית מכירה או לצאת מפוזיציות קיימות.';
  } else if (strategyName === 'SMC') {
    notes = signalType === 'buy'
      ? 'אזור ביקוש זוהה עם חזרה של המחיר לאזור. מומלץ להכנס לפוזיציית קנייה.'
      : 'זוהה אזור היצע עם דחייה מהמחיר. מומלץ להכנס לפוזיציית מכירה.';
  } else if (strategyName === 'Wyckoff') {
    notes = signalType === 'buy'
      ? 'זוהה שלב Phase C (Spring) במבנה Wyckoff. מומלץ להכנס לפוזיציית קנייה.'
      : 'זוהה שלב Phase E (UPTHRUST) במבנה Wyckoff. מומלץ להכנס לפוזיציית מכירה.';
  } else if (strategyName === 'אסטרטגיה משולבת') {
    notes = signalType === 'buy'
      ? 'התכנסות מספר אינדיקטורים טכניים יחד עם ניתוח מבני המצביע על המשך מגמה עולה.'
      : 'שילוב של מספר אינדיקטורים טכניים יחד עם ניתוח מבני המצביע על מגמה יורדת.';
  } else {
    notes = signalType === 'buy'
      ? 'זוהתה התכנסות בולינגר בנדס עם פריצה למעלה. נפח מסחר במגמת עלייה.'
      : 'זוהתה חציית MACD כלפי מטה יחד עם RSI בקנייתיתר.';
  }
  
  return {
    id: `signal-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    assetId,
    type: signalType,
    price,
    timestamp: currentTime.getTime(),
    strength: Math.random() > 0.7 ? 'strong' : Math.random() > 0.5 ? 'medium' : 'weak',
    strategy: strategyName,
    timeframe: ['1h', '4h', '1d', '1w'][Math.floor(Math.random() * 4)],
    targetPrice: signalType === 'buy' ? price * (1 + Math.random() * 0.2) : price * (1 - Math.random() * 0.2),
    stopLoss: signalType === 'buy' ? price * (1 - Math.random() * 0.1) : price * (1 + Math.random() * 0.1),
    riskRewardRatio: 1 + Math.random() * 3,
    notes,
  };
};
