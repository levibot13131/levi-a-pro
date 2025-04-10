import { AssetHistoricalData, ChartArea } from "@/types/asset";
import { getAssetHistory } from "@/services/mockDataService";

// סוגי נתונים לניתוח טכני
export interface AnalysisResult {
  rsiData: { timestamp: number; value: number }[];
  rsiInterpretation: string;
  indicators: {
    name: string;
    value: string | number;
    description: string;
    signal: 'buy' | 'sell' | 'neutral';
  }[];
  signals?: {
    timestamp: number;
    type: 'buy' | 'sell';
    price: number;
    indicator: string;
  }[];
  overallSignal: 'buy' | 'sell' | 'neutral';
  signalStrength: number; // 1-10
  conclusion: string;
  patterns?: {
    name: string;
    description: string;
    type: string;
    chartArea?: ChartArea;
    probability?: number;
    keyLevels?: {
      name: string;
      price: number;
    }[];
  }[];
  keyLevels?: {
    name: string;
    price: number;
    type: 'support' | 'resistance';
  }[];
}

export interface WyckoffPattern {
  name: string;
  phase: string;
  description: string;
  probability: number;
  events?: string[];
  chartArea?: ChartArea;
}

export interface WyckoffAnalysis {
  phase?: string;
  patterns?: WyckoffPattern[];
  conclusion?: string;
}

export interface SMCPattern {
  name: string;
  bias: 'bullish' | 'bearish';
  description: string;
  entryZone: {
    min: number;
    max: number;
  };
  targetPrice?: number;
  stopLoss?: number;
  riskRewardRatio?: number;
  keyLevels?: {
    name: string;
    price: number;
  }[];
  chartArea?: ChartArea;
}

export interface SMCAnalysis {
  patterns?: SMCPattern[];
  conclusion?: string;
}

// ניתוח כללי של נכס פיננסי
export const analyzeAsset = async (
  assetId: string, 
  timeframe: AssetHistoricalData['timeframe'],
  method = 'all'
): Promise<AnalysisResult> => {
  const historyData = await getAssetHistory(assetId, timeframe);
  
  // יצירת נתוני RSI מדומים
  const rsiData = historyData.data.map((point, index) => {
    let rsiValue = 50 + Math.sin(index / 10) * 20 + (Math.random() * 10 - 5);
    rsiValue = Math.max(0, Math.min(100, rsiValue)); // מוודא שהערך בטווח 0-100
    
    return {
      timestamp: point.timestamp,
      value: rsiValue
    };
  });
  
  // חישוב ממוצע RSI אחרון
  const lastRsiValues = rsiData.slice(-5);
  const avgRsi = lastRsiValues.reduce((sum, item) => sum + item.value, 0) / lastRsiValues.length;
  
  // יצירת מערך אינדיקטורים
  const indicators = [
    {
      name: "RSI",
      value: avgRsi.toFixed(2),
      description: avgRsi > 70 
        ? "מצב קנייתר יתר, רמז אפשרי למכירה" 
        : avgRsi < 30 
          ? "מצב מכירת יתר, רמז אפשרי לקנייה"
          : "בטווח הניטרלי",
      signal: avgRsi > 70 ? 'sell' as const : avgRsi < 30 ? 'buy' as const : 'neutral' as const
    },
    {
      name: "MACD",
      value: "+0.35",
      description: "חיתוך כלפי מעלה, סימן חיובי לטווח הקצר",
      signal: 'buy' as const
    },
    {
      name: "ממוצע נע 50",
      value: historyData.data[historyData.data.length - 1].price.toFixed(2),
      description: "המחיר מעל הממוצע הנע, תומך במגמה חיובית",
      signal: 'buy' as const
    },
    {
      name: "בולינגר",
      value: "מרכז",
      description: "מחיר בתוך הרצועה המרכזית, ללא אינדיקציה ברורה",
      signal: 'neutral' as const
    },
    {
      name: "נפח מסחר",
      value: "עולה",
      description: "עלייה בנפח המסחר תומכת במגמה הנוכחית",
      signal: 'buy' as const
    },
    {
      name: "Stochastic",
      value: "65/70",
      description: "נע כלפי מעלה באזור הביניים, מצביע על מומנטום חיובי",
      signal: 'buy' as const
    }
  ];
  
  // יצירת סיגנלים מדומים על הגרף
  const signalPoints = [];
  for (let i = 5; i < historyData.data.length; i += Math.floor(Math.random() * 10) + 5) {
    if (Math.random() > 0.5) {
      signalPoints.push({
        timestamp: historyData.data[i].timestamp,
        type: Math.random() > 0.5 ? 'buy' as const : 'sell' as const,
        price: historyData.data[i].price,
        indicator: ['RSI', 'MACD', 'ממוצע נע', 'תבנית מחיר'][Math.floor(Math.random() * 4)]
      });
    }
  }
  
  // חישוב סיגנל כללי
  const buySignals = indicators.filter(ind => ind.signal === 'buy').length;
  const sellSignals = indicators.filter(ind => ind.signal === 'sell').length;
  const neutralSignals = indicators.filter(ind => ind.signal === 'neutral').length;
  
  let overallSignal: 'buy' | 'sell' | 'neutral';
  let signalStrength: number;
  let conclusion: string;
  
  if (buySignals > sellSignals + 1) {
    overallSignal = 'buy';
    signalStrength = Math.min(10, 5 + buySignals - sellSignals);
    conclusion = "הניתוח הטכני מצביע על מגמה חיובית. רוב האינדיקטורים מראים סימני קנייה, עם עוצמת סיגנל גבוהה. מומלץ לשקול כניסה לפוזיציית קנייה, תוך הגדרת סטופ לוס בטוח.";
  } else if (sellSignals > buySignals + 1) {
    overallSignal = 'sell';
    signalStrength = Math.min(10, 5 + sellSignals - buySignals);
    conclusion = "הניתוח הטכני מצביע על מגמה שלילית. רוב האינדיקטורים מראים סימני מכירה, עם עוצמת סיגנל גבוהה. מומלץ לשקול מכירה או קיצור פוזיציות קיימות.";
  } else {
    overallSignal = 'neutral';
    signalStrength = Math.max(1, 5 - Math.abs(buySignals - sellSignals));
    conclusion = "הניתוח הטכני מצביע על מגמה מעורבת. יש איזון בין סימני קנייה ומכירה, מה שמרמז על תקופת קונסולידציה. מומלץ להמתין לסיגנל ברור יותר לפני פתיחת פוזיציות חדשות.";
  }
  
  // הוספת רמות מפתח אם קיימות
  const keyLevels = [];
  
  // רמות תמיכה והתנגדות לדוגמה - בגרסה אמיתית אלו יבואו מאלגוריתם ניתוח
  if (historyData) {
    const prices = historyData.data.map(p => p.price);
    const maxPrice = Math.max(...prices);
    const minPrice = Math.min(...prices);
    const range = maxPrice - minPrice;
    
    // רמת התנגדות עליונה
    keyLevels.push({
      name: '
