export interface PositionSizingCalculation {
  accountSize: number;
  riskPercentage: number;
  entryPrice: number;
  stopLossPrice: number;
  takeProfitPrice?: number; // Optional take profit price
  positionSize: number;
  maxLossAmount: number;
  potentialProfit: number;
  riskRewardRatio: number;
}

export const calculatePositionSize = (
  accountSize: number,
  riskPercentage: number,
  entryPrice: number,
  stopLossPrice: number,
  takeProfitPrice?: number
): PositionSizingCalculation => {
  const maxLossAmount = accountSize * (riskPercentage / 100);
  const priceDifference = Math.abs(entryPrice - stopLossPrice);
  const positionSize = priceDifference > 0 ? maxLossAmount / priceDifference : 0;
  
  // Calculate potential profit and risk reward ratio
  let potentialProfit = 0;
  let riskRewardRatio = 0;
  
  if (takeProfitPrice) {
    potentialProfit = Math.abs(takeProfitPrice - entryPrice) * positionSize;
    riskRewardRatio = potentialProfit / maxLossAmount;
  }
  
  return {
    accountSize,
    riskPercentage,
    entryPrice,
    stopLossPrice,
    takeProfitPrice,
    positionSize,
    maxLossAmount,
    potentialProfit,
    riskRewardRatio
  };
};

export interface TradingJournalEntry {
  id: string;
  date: string;
  assetId: string;
  assetName: string;
  direction: 'long' | 'short';
  entryPrice: number;
  exitPrice?: number;
  stopLoss: number;
  targetPrice?: number;
  positionSize: number;
  risk: number;
  outcome?: 'win' | 'loss' | 'breakeven' | 'open';
  profit?: number;
  profitPercentage?: number;
  notes?: string;
  tags?: string[];
  screenshot?: string;
  strategy: string;
}

export const tradingApproach = {
  name: "A.A - Advanced Analysis",
  description: "שיטת A.A היא אסטרטגיית מסחר המשלבת עקרונות טכניים וניהול סיכונים מתקדם",
  keyPrinciples: [
    "שמירה על סיכון של עד 1% מהתיק לכל עסקה",
    "כניסה רק בעסקאות עם יחס סיכוי:סיכון של 2 ומעלה",
    "זיהוי מגמות שוק ומסחר בכיוון המגמה הראשית",
    "שימוש בתבניות מחיר ונרות יפניים לזיהוי נקודות כניסה",
    "ממוצעים נעים לאישור מגמה וסינון כניסות",
    "ניהול פוזיציה עם יציאות מדורגות",
    "חלוקת הפוזיציה ליחידות סיכון נפרדות"
  ]
};

export interface TradingPerformanceStats {
  winRate: number;
  profitFactor: number;
  maxDrawdown: number;
  averageWin: number;
  averageLoss: number;
  expectancy: number;
  totalTrades: number;
  profitableTrades: number;
  losingTrades: number;
}

export interface TrendTradingStats {
  firstTargetSuccessRate: number;
  secondTargetSuccessRate: number;
  thirdTargetSuccessRate: number;
  averageRR: number;
  bestTimeframes: string[];
  bestPatterns: string[];
}

export const riskManagementRules = [
  {
    id: 1,
    title: "הגבלת סיכון לעסקה",
    rule: "לעולם לא לסכן יותר מ-1% מהתיק בעסקה בודדת",
    explanation: "הגבלת סיכון מאפשרת שרידות לאורך זמן גם בתקופות של עסקאות מפסידות רצופות",
    priority: "גבוהה"
  },
  {
    id: 2,
    title: "יחס סיכוי:סיכון",
    rule: "יש לחפש עסקאות עם יחס סיכוי:סיכון של 2:1 לפחות",
    explanation: "מאפשר רווחיות גם כשאחוז העסקאות המנצחות נמוך מ-50%",
    priority: "גבוהה"
  },
  {
    id: 3,
    title: "ניהול פוזיציה",
    rule: "לחלק את הפוזיציה ליחידות סיכון עם יציאות מדורגות",
    explanation: "מימוש רווחים בשלבים מאפשר להנות מעליות משמעותיות ולהגן על רווחים קיימים",
    priority: "בינונית"
  },
  {
    id: 4,
    title: "נקודות יציאה מוגדרות מראש",
    rule: "יש להגדיר מראש את נקודות היציאה לרווח והפסד",
    explanation: "הגדרה מראש מונעת החלטות רגשיות בזמן אמת",
    priority: "גבוהה"
  },
  {
    id: 5,
    title: "שעות מסחר",
    rule: "להתמקד בשעות המסחר בעלות הנזילות הגבוהה",
    explanation: "בשעות מסחר פעילות התנודתיות יציבה יותר והסיכון לתזוזות חדות לא צפויות נמוך יותר",
    priority: "בינונית"
  }
];

export const addTradingJournalEntry = async (entry: TradingJournalEntry): Promise<TradingJournalEntry> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    ...entry,
    id: entry.id || `entry-${Date.now()}`
  };
};

export const getTradingPerformanceStats = async () => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    winRate: 63,
    profitFactor: 2.1,
    maxDrawdown: 8.5,
    averageWin: 2.3,
    averageLoss: -1.1,
    expectancy: 0.84,
    totalTrades: 127,
    profitableTrades: 80,
    losingTrades: 47
  };
};

export const getTrendTradingStats = async () => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    firstTargetSuccessRate: 78,
    secondTargetSuccessRate: 52,
    thirdTargetSuccessRate: 31,
    averageRR: 2.7,
    bestTimeframes: ['1D', '4H', '1H'],
    bestPatterns: ['Bull Flag', 'Cup and Handle', 'Inverse H&S']
  };
};
