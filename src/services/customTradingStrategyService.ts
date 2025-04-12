
// Define the trading approach patterns and rules

export interface TradingPerformanceStats {
  winRate: number;
  profitFactor: number;
  maxDrawdown: number;
  averageWin: number;
  averageLoss: number;
  expectancy: number;
  totalTrades: number;
  profitableTradesCount: number;
  lossingTradesCount: number;
}

export interface TrendTradingStats {
  firstTargetSuccessRate: number;
  secondTargetSuccessRate: number;
  thirdTargetSuccessRate: number;
  averageTrendDuration: number;
  strongTrendPercentage: number;
  weakTrendPercentage: number;
  breakoutSuccessRate: number;
  pullbackFrequency: number;
}

export interface PositionSizingCalculation {
  units: number;
  totalValue: number;
  riskAmount: number;
  riskPerUnit: number;
  maxLossAmount: number;
  positionSize: number;
  takeProfitPrice?: number;
  riskRewardRatio: number;
}

export const tradingApproach = {
  name: "מערכת מסחר מותאמת לשוק הקריפטו",
  description: "מערכת מסחר המבוססת על זיהוי מגמות וניהול סיכונים קפדני",
  keyPrinciples: [
    "זיהוי מגמה ראשית לפני כניסה לעסקה",
    "הגדרת יחס סיכוי/סיכון מינימלי של 1:2",
    "סיכון מקסימלי של 1%-2% מההון לעסקה",
    "שימוש באסטרטגיות יציאה מדורגות",
    "הימנעות ממסחר בתקופות של תנודתיות קיצונית"
  ],
  preferredTimeframes: ["4h", "1d"],
  indicators: ["מתנד RSI", "ממוצעים נעים", "רמות פיבונאצ'י", "נפחי מסחר"],
  riskManagementPolicies: [
    "הגדרת סטופ לוס לכל עסקה",
    "כניסה הדרגתית לעסקאות גדולות",
    "הזזת סטופ לוס לנקודת כניסה לאחר תנועת מחיר משמעותית לכיוון הרצוי"
  ]
};

export const riskManagementRules = {
  maxRiskPerTrade: 2, // אחוזים
  stopLossPlacement: [
    "מתחת/מעל לרמת תמיכה/התנגדות אחרונה",
    "מתחת/מעל לנר המסמן היפוך",
    "בהתבסס על טווח תנודתיות ATR"
  ],
  entryStrategies: [
    "פריצת רמות מפתח",
    "היפוכים בתבניות מחיר",
    "התכנסויות מחיר"
  ],
  exitStrategies: [
    "יציאה חלקית בהגעה ליחס רווח/סיכון 1:1",
    "יציאה חלקית בהגעה לרמות התנגדות",
    "סטופ נגרר בהתאם לתנועת המחיר"
  ]
};

// Example function for position size calculation
export const calculatePositionSize = (
  accountSize: number,
  riskPercentage: number,
  entryPrice: number,
  stopLossPrice: number,
  direction: 'long' | 'short'
): PositionSizingCalculation => {
  // Calculate the risk amount in absolute terms
  const riskAmount = (accountSize * riskPercentage) / 100;
  
  // Calculate the risk per unit based on entry and stop loss
  let riskPerUnit;
  if (direction === 'long') {
    riskPerUnit = entryPrice - stopLossPrice;
  } else {
    riskPerUnit = stopLossPrice - entryPrice;
  }
  
  if (riskPerUnit <= 0) {
    throw new Error('סטופ לוס חייב להיות מתחת למחיר הכניסה עבור עסקת לונג, ומעל מחיר הכניסה עבור עסקת שורט');
  }
  
  // Calculate the position size
  const positionSize = riskAmount / riskPerUnit;
  
  // Calculate the total position value
  const positionValue = positionSize * entryPrice;
  
  // Calculate take profit price for a 2:1 risk-reward ratio
  const takeProfitPrice = direction === 'long' 
    ? entryPrice + (riskPerUnit * 2) 
    : entryPrice - (riskPerUnit * 2);
  
  return {
    units: positionSize,
    totalValue: positionValue,
    riskAmount,
    riskPerUnit,
    maxLossAmount: riskAmount,
    positionSize,
    takeProfitPrice,
    riskRewardRatio: 2
  };
};

// Function to add a trading journal entry
export const addTradingJournalEntry = async (entry: any) => {
  // In a real app, this would save to a database or localStorage
  console.log('Adding trading journal entry:', entry);
  
  // Transform the entry to include the id and remove success property
  const savedEntry = {
    ...entry,
    id: 'entry-' + Date.now()
  };
  
  return savedEntry;
};

// Mock implementations of getTradingPerformanceStats and getTrendTradingStats
export const getTradingPerformanceStats = async (): Promise<TradingPerformanceStats> => {
  // This would fetch real data in a production environment
  return {
    winRate: 62,
    profitFactor: 1.8,
    maxDrawdown: 14,
    averageWin: 3.2,
    averageLoss: 1.7,
    expectancy: 0.9,
    totalTrades: 124,
    profitableTradesCount: 77,
    lossingTradesCount: 47
  };
};

export const getTrendTradingStats = async (): Promise<TrendTradingStats> => {
  // This would fetch real data in a production environment
  return {
    firstTargetSuccessRate: 78,
    secondTargetSuccessRate: 52,
    thirdTargetSuccessRate: 31,
    averageTrendDuration: 14,
    strongTrendPercentage: 42,
    weakTrendPercentage: 58,
    breakoutSuccessRate: 68,
    pullbackFrequency: 76
  };
};
