
import { AssetHistoricalData } from "@/types/asset";
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
}

export interface WyckoffAnalysis {
  phase?: string;
  patterns?: {
    name: string;
    phase: string;
    description: string;
    probability: number;
    events?: string[];
  }[];
  conclusion?: string;
}

export interface SMCAnalysis {
  patterns?: {
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
  }[];
  conclusion?: string;
}

// ניתוח כללי של נכס פיננסי
export const analyzeAsset = async (
  assetId: string, 
  timeframe: AssetHistoricalData['timeframe'],
  method = 'all'
): Promise<AnalysisResult> => {
  // בשלב זה, הפונקציה היא מדומה ומחזירה נתונים מזויפים לדוגמה
  // בגרסה אמיתית, היא תשתמש בספריות ניתוח טכני אמיתיות
  
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
  
  // בהתבסס על סוג הנכס, אפשר להתאים את המסקנה
  if (assetId === 'bitcoin' || assetId === 'ethereum') {
    conclusion += " שוק הקריפטו מראה תנודתיות גבוהה בטווח הזמן הנוכחי, יש לשים לב במיוחד לנפחי המסחר ולאירועים מאקרו כלכליים.";
  } else if (assetId === 'apple' || assetId === 'microsoft') {
    conclusion += " מניות הטכנולוגיה מושפעות כרגע מהדוחות הכספיים העונתיים והכרזות הפד לגבי שיעורי הריבית.";
  }
  
  return {
    rsiData,
    rsiInterpretation: avgRsi > 70 
      ? "ערך ה-RSI מעל 70 מצביע על מצב של קניית יתר. היסטורית, זהו סימן שהשוק עשוי להיות בשל לתיקון כלפי מטה. עם זאת, בשווקים חזקים, ה-RSI יכול להישאר באזור קניית היתר לתקופות ממושכות." 
      : avgRsi < 30 
        ? "ערך ה-RSI מתחת ל-30 מצביע על מצב של מכירת יתר. זהו סימן פוטנציאלי שהנכס נמכר יותר מדי ועשוי להיות בשל להתאוששות. חפש איתותי אישור נוספים לפני כניסה לפוזיציה."
        : "ה-RSI נמצא באזור הביניים, ללא אינדיקציה חזקה לקנייה או מכירה מבחינת מומנטום. שווה לבחון אינדיקטורים נוספים ולהתמקד במגמה הכללית.",
    indicators,
    signals: signalPoints,
    overallSignal,
    signalStrength,
    conclusion
  };
};

// ניתוח בשיטת וויקוף
export const getWyckoffPatterns = async (
  assetId: string, 
  timeframe: AssetHistoricalData['timeframe']
): Promise<WyckoffAnalysis> => {
  // פונקציה מדומה שמחזירה דוגמאות של דפוסי וויקוף
  const patterns = [];
  let phase = "";
  let conclusion = "";
  
  // יצירת דפוסים אקראיים - בגרסה אמיתית, יהיה כאן אלגוריתם לזיהוי דפוסים אמיתי
  if (Math.random() > 0.3) {
    // אקומולציה או דיסטריביושן, בחירה אקראית
    const isAccumulation = Math.random() > 0.5;
    
    if (isAccumulation) {
      phase = "אקומולציה (צבירה)";
      
      patterns.push({
        name: "שלב A - אקומולציה",
        phase: "אקומולציה",
        description: "נצפית ירידת מחיר עד לנקודת תמיכה ונפח מסחר גבוה, המצביע על סיום מכירה",
        probability: 65 + Math.floor(Math.random() * 20),
        events: [
          "ירידת מחיר משמעותית (Selling Climax)",
          "התייצבות על תמיכה עם נפח גבוה",
          "מבחן תחתית מוצלח (Automatic Rally)"
        ]
      });
      
      if (Math.random() > 0.5) {
        patterns.push({
          name: "מבחן אביב (Spring)",
          phase: "אקומולציה",
          description: "מבחן קצר של השפל האחרון עם נפח נמוך, מסמן סיום מכירות",
          probability: 70 + Math.floor(Math.random() * 20),
          events: [
            "חדירה קצרה מתחת לתמיכה",
            "התאוששות מהירה",
            "ירידה בנפח המסחר בזמן החדירה כלפי מטה"
          ]
        });
      }
      
      conclusion = "השוק נראה בשלב אקומולציה לפי שיטת וויקוף. הכסף החכם נראה כמצטבר בנכס זה, עם סימנים של סיום מכירות והתחלת אקומולציה. אם השלב יושלם בהצלחה, צפויה עלייה משמעותית בטווח הבינוני.";
    } else {
      phase = "דיסטריביושן (הפצה)";
      
      patterns.push({
        name: "שלב A - דיסטריביושן",
        phase: "דיסטריביושן",
        description: "נצפית עליית מחיר לשיא חדש עם סימני היחלשות בנפח, המעידה על התחלת חלוקה",
        probability: 60 + Math.floor(Math.random() * 20),
        events: [
          "עליית מחיר לשיא חדש (Buying Climax)",
          "ירידה בנפח המסחר בשיאים חדשים",
          "תנודתיות גבוהה באזור ההתנגדות"
        ]
      });
      
      if (Math.random() > 0.5) {
        patterns.push({
          name: "גג כפול (UTAD)",
          phase: "דיסטריביושן",
          description: "ניסיון כושל לשבור את השיא האחרון, מסמן סיום קניות",
          probability: 75 + Math.floor(Math.random() * 15),
          events: [
            "הגעה לאזור השיא הקודם",
            "כישלון בשבירה משמעותית של השיא",
            "ירידה בנפח המסחר בניסיון השיא החדש"
          ]
        });
      }
      
      conclusion = "השוק נראה בשלב דיסטריביושן לפי שיטת וויקוף. הכסף החכם נראה במגמת יציאה מהנכס, עם סימנים של היחלשות הביקוש. אם השלב יושלם בהצלחה, צפויה ירידה משמעותית בטווח הבינוני.";
    }
  }
  
  return {
    phase,
    patterns,
    conclusion
  };
};

// ניתוח בשיטת Smart Money Concept
export const getSMCPatterns = async (
  assetId: string, 
  timeframe: AssetHistoricalData['timeframe']
): Promise<SMCAnalysis> => {
  // שליפת נתוני מחיר
  const historyData = await getAssetHistory(assetId, timeframe);
  const lastPrice = historyData.data[historyData.data.length - 1].price;
  
  // פונקציה מדומה שמחזירה דוגמאות של דפוסי SMC
  const patterns = [];
  let conclusion = "";
  
  // יצירת דפוסים אקראיים - בגרסה אמיתית, יהיה כאן אלגוריתם לזיהוי דפוסים אמיתי
  if (Math.random() > 0.3) {
    const isBullish = Math.random() > 0.5;
    
    if (isBullish) {
      // תבניות עולות
      if (Math.random() > 0.5) {
        const entryMin = lastPrice * 0.98;
        const entryMax = lastPrice * 0.99;
        const targetPrice = lastPrice * 1.05;
        const stopLoss = lastPrice * 0.96;
        
        patterns.push({
          name: "גריפת נזילות (Liquidity Grab)",
          bias: 'bullish',
          description: "זוהתה תנועת מחיר חדה כלפי מטה שגרפה את הנזילות באזור הסטופים, ולאחריה התאוששות מהירה",
          entryZone: {
            min: entryMin,
            max: entryMax
          },
          targetPrice,
          stopLoss,
          riskRewardRatio: 2.5,
          keyLevels: [
            { name: "שיא אחרון", price: lastPrice * 1.03 },
            { name: "אזור נזילות", price: lastPrice * 0.97 },
            { name: "גריפת הנזילות", price: lastPrice * 0.965 }
          ]
        });
      } else {
        const entryMin = lastPrice * 0.99;
        const entryMax = lastPrice * 1.01;
        const targetPrice = lastPrice * 1.06;
        const stopLoss = lastPrice * 0.97;
        
        patterns.push({
          name: "נטישת הזמנות (Order Block)",
          bias: 'bullish',
          description: "זוהה בלוק הזמנות לא ממומש שנוצר לפני תנועה משמעותית, המהווה נקודת הזדמנות לכניסה",
          entryZone: {
            min: entryMin,
            max: entryMax
          },
          targetPrice,
          stopLoss,
          riskRewardRatio: 3.0,
          keyLevels: [
            { name: "יעד ראשון", price: lastPrice * 1.03 },
            { name: "בלוק הזמנות", price: lastPrice * 0.99 },
            { name: "מבחן מחודש", price: lastPrice * 1.01 }
          ]
        });
      }
      
      conclusion = "זוהו תבניות SMC עולות בנכס. הכסף החכם נראה במגמת צבירה, עם יצירת אזורי ביקוש משמעותיים. נראות הזדמנויות לכניסה לפוזיציית קנייה באזורים המסומנים, עם יחס סיכוי/סיכון אטרקטיבי.";
    } else {
      // תבניות יורדות
      if (Math.random() > 0.5) {
        const entryMin = lastPrice * 1.01;
        const entryMax = lastPrice * 1.02;
        const targetPrice = lastPrice * 0.95;
        const stopLoss = lastPrice * 1.04;
        
        patterns.push({
          name: "פגיעה במגמה (Breaker Block)",
          bias: 'bearish',
          description: "אזור שהיה תמיכה בעבר הפך להתנגדות, יצירת הזדמנות למכירה בבדיקה מחודשת",
          entryZone: {
            min: entryMin,
            max: entryMax
          },
          targetPrice,
          stopLoss,
          riskRewardRatio: 2.5,
          keyLevels: [
            { name: "בלוק המגמה", price: lastPrice * 1.02 },
            { name: "שפל אחרון", price: lastPrice * 0.97 },
            { name: "אזור היעד", price: lastPrice * 0.95 }
          ]
        });
      } else {
        const entryMin = lastPrice * 1.0;
        const entryMax = lastPrice * 1.02;
        const targetPrice = lastPrice * 0.94;
        const stopLoss = lastPrice * 1.03;
        
        patterns.push({
          name: "דחיית היצע (Supply Rejection)",
          bias: 'bearish',
          description: "מחיר נדחה חזק מאזור היצע משמעותי, מסמן חולשה וסבירות גבוהה להמשך ירידה",
          entryZone: {
            min: entryMin,
            max: entryMax
          },
          targetPrice,
          stopLoss,
          riskRewardRatio: 3.0,
          keyLevels: [
            { name: "אזור היצע", price: lastPrice * 1.02 },
            { name: "נקודת דחייה", price: lastPrice * 1.01 },
            { name: "שפל קודם", price: lastPrice * 0.97 }
          ]
        });
      }
      
      conclusion = "זוהו תבניות SMC יורדות בנכס. הכסף החכם נראה במגמת חלוקה, עם יצירת אזורי היצע משמעותיים. נראות הזדמנויות לכניסה לפוזיציית מכירה באזורים המסומנים, עם יחס סיכוי/סיכון אטרקטיבי.";
    }
  }
  
  return {
    patterns,
    conclusion
  };
};
