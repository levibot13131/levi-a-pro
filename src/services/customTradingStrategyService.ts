
// Define the trading approach patterns and rules

export interface TradingPerformanceStats {
  winRate: number;
  profitFactor: number;
  maxDrawdown: number; // Add this missing property
  averageWin: number;
  averageLoss: number;
  expectancy: number;
  totalTrades: number;
  profitableTradesCount: number;
  lossingTradesCount: number;
}

export interface TrendTradingStats {
  firstTargetSuccessRate: number; // Add these missing properties
  secondTargetSuccessRate: number;
  thirdTargetSuccessRate: number;
  averageTrendDuration: number;
  strongTrendPercentage: number;
  weakTrendPercentage: number;
  breakoutSuccessRate: number;
  pullbackFrequency: number;
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
) => {
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
  
  return {
    units: positionSize,
    totalValue: positionValue,
    riskAmount,
    riskPerUnit
  };
};

// Function to add a trading journal entry
export const addTradingJournalEntry = async (entry: any) => {
  // In a real app, this would save to a database or localStorage
  console.log('Adding trading journal entry:', entry);
  return { success: true, id: 'entry-' + Date.now() };
};
