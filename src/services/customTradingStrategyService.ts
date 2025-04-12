
// Custom trading strategy service exports

export interface PositionSizingCalculation {
  positionSize: number;
  riskAmount: number;
  potentialProfit: number;
  riskRewardRatio: number;
  maxLossAmount: number; // Added property
  takeProfitPrice?: number; // Added property
}

export interface TradingPerformanceStats {
  winRate: number;
  averageProfit: number;
  profitFactor: number;
  maxDrawdown: number;
  sharpeRatio: number;
}

export interface TrendTradingStats {
  trendStrength: number;
  averageTrendDuration: number;
  winRateInTrend: number;
  firstTargetSuccessRate: number; // Added property
  secondTargetSuccessRate: number; // Added property
  thirdTargetSuccessRate: number; // Added property
}

// Extended trading approach with keyPrinciples
export const tradingApproach = {
  name: "Trend Following",
  description: "Strategy focusing on identifying and following established market trends",
  timeframes: ["1h", "4h", "1d"],
  indicators: ["Moving Averages", "MACD", "RSI"],
  rules: [
    "Enter when price breaks above/below key moving averages",
    "Use RSI to confirm trend strength",
    "Set stop-loss at recent swing high/low"
  ],
  keyPrinciples: [
    "סחור בכיוון המגמה הראשית",
    "השתמש בזמני כניסה מדויקים",
    "הגדר יעדי רווח וסטופ לוס לפני כניסה",
    "נהל את הסיכון באופן מדוייק בכל עסקה",
    "התאם את גודל הפוזיציה לתנודתיות המכשיר"
  ]
};

// Extended risk management rules with additional properties
export const riskManagementRules = [
  {
    id: "rule1",
    rule: "לעולם אל תסכן יותר מ-1-2% מהחשבון בעסקה בודדת",
    priority: "critical",
    explanation: "הגבלת הסיכון לאחוז קטן מהחשבון מבטיחה שגם סדרת הפסדים לא תחסל את החשבון."
  },
  {
    id: "rule2",
    rule: "תמיד השתמש בסטופ לוס",
    priority: "critical",
    explanation: "סטופ לוס הוא כלי ניהול סיכונים הכרחי שמגדיר את מקסימום ההפסד שלך בעסקה."
  },
  {
    id: "rule3",
    rule: "ודא יחס סיכוי לסיכון של לפחות 1:2",
    priority: "high",
    explanation: "יחס של לפחות 1:2 מאפשר לך להרוויח גם אם הצלחת רק ב-40% מהעסקאות שלך."
  },
  {
    id: "rule4",
    rule: "הימנע ממסחר בזמן פרסום חדשות כלכליות",
    priority: "medium",
    explanation: "תנודתיות גבוהה בזמן פרסום חדשות יכולה לגרום להפסדים בלתי צפויים."
  },
  {
    id: "rule5",
    rule: "הקטן גודל פוזיציה בתקופות של תנודתיות גבוהה",
    priority: "medium",
    explanation: "תנודתיות גבוהה מגדילה את הסיכוי לתזוזות קיצוניות ולהפעלת סטופים."
  }
];

export const calculatePositionSize = (
  accountSize: number,
  riskPercentage: number,
  entryPrice: number,
  stopLossPrice: number,
  direction: 'long' | 'short' = 'long'
): PositionSizingCalculation => {
  const riskPerUnit = Math.abs(entryPrice - stopLossPrice);
  const riskAmount = accountSize * (riskPercentage / 100);
  const shares = riskAmount / riskPerUnit;
  
  const positionSize = shares * entryPrice;
  const takeProfitPrice = direction === 'long' 
    ? entryPrice + (riskPerUnit * 2) 
    : entryPrice - (riskPerUnit * 2);
  
  const potentialProfit = shares * Math.abs(takeProfitPrice - entryPrice);
  const maxLossAmount = riskAmount;
  
  return {
    positionSize,
    riskAmount,
    potentialProfit,
    riskRewardRatio: potentialProfit / riskAmount,
    maxLossAmount,
    takeProfitPrice
  };
};

export const getTradingPerformanceStats = (): TradingPerformanceStats => {
  return {
    winRate: 62.5,
    averageProfit: 1.8,
    profitFactor: 2.1,
    maxDrawdown: 12.3,
    sharpeRatio: 1.45
  };
};

export const getTrendTradingStats = (): TrendTradingStats => {
  return {
    trendStrength: 7.2,
    averageTrendDuration: 14.5,
    winRateInTrend: 78.3,
    firstTargetSuccessRate: 68.5,
    secondTargetSuccessRate: 42.3,
    thirdTargetSuccessRate: 28.7
  };
};

// Mock function to add trading journal entry
export const addTradingJournalEntry = async (entry: any): Promise<any> => {
  // In a real app, this would send the entry to a backend service
  console.log("Adding entry to trading journal:", entry);
  
  // Create a copy with a generated ID
  const savedEntry = {
    ...entry,
    id: `entry_${Date.now()}`
  };
  
  // Simulate async operation
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(savedEntry);
    }, 300);
  });
};
