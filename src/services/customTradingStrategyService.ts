
import { TradeJournalEntry } from '@/types/journal';
import { v4 as uuidv4 } from 'uuid';

// Add missing interfaces
export interface TradingPerformanceStats {
  winRate: number;
  profitFactor: number;
  maxDrawdown: number;
}

export interface TrendTradingStats {
  firstTargetSuccessRate: number;
  secondTargetSuccessRate: number;
  thirdTargetSuccessRate: number;
}

export interface PositionSizingCalculation {
  positionSize: number;
  maxLossAmount: number;
  riskRewardRatio: number;
  takeProfitPrice?: number;
}

export interface RiskManagementRule {
  id: string;
  rule: string;
  explanation: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
}

export const tradingApproach = {
  name: "אסטרטגיית KSM",
  description: "אסטרטגיית מסחר המבוססת על זיהוי מגמות וניהול סיכונים מוקפד",
  keyPrinciples: [
    "ניהול סיכונים - לעולם לא לסכן יותר מ-1% מהתיק בעסקה בודדת",
    "מסחר עם המגמה - לזהות את כיוון המגמה ולמסחר בכיוונה",
    "כניסה בתיקונים - לחפש הזדמנויות כניסה בתיקונים למגמה הראשית",
    "יחס סיכוי/סיכון - לשאוף ליחס של לפחות 1:2",
    "שימוש ברמות מחיר מפתח - לזהות רמות תמיכה והתנגדות משמעותיות"
  ]
};

export const riskManagementRules: RiskManagementRule[] = [
  {
    id: "rule1",
    rule: "הגבל את הסיכון ל-1% מהתיק לעסקה",
    explanation: "לעולם אל תסכן יותר מ-1% מהתיק בעסקה בודדת, ללא יוצא מן הכלל",
    priority: "critical"
  },
  {
    id: "rule2",
    rule: "סטופ לוס חובה בכל עסקה",
    explanation: "קבע סטופ לוס לכל עסקה לפני הכניסה אליה, ללא יוצא מן הכלל",
    priority: "critical"
  },
  {
    id: "rule3",
    rule: "פוזיציה מדורגת בעת יציאה",
    explanation: "חלק את היציאה למספר שלבים, כדי למקסם את הרווח האפשרי",
    priority: "high"
  },
  {
    id: "rule4",
    rule: "פסיכולוגיה - שמור על משמעת",
    explanation: "הישמע לתוכנית המסחר שלך ואל תסטה ממנה בגלל רגשות",
    priority: "high"
  },
  {
    id: "rule5",
    rule: "הגבל את מספר העסקאות הפתוחות",
    explanation: "אל תחזיק יותר מ-5 עסקאות פתוחות בו זמנית",
    priority: "medium"
  }
];

// Mock implementation for trading strategy service
export const addTradingJournalEntry = async (entry: TradeJournalEntry): Promise<TradeJournalEntry> => {
  // In a real application, this would make an API call to save the entry
  return {
    ...entry,
    id: entry.id || uuidv4(), // Generate a new ID if one wasn't provided
  };
};

// Calculate position size based on risk parameters
export const calculatePositionSize = (
  accountSize: number,
  riskPercentage: number,
  entryPrice: number,
  stopLossPrice: number,
  targetPrice?: number
): PositionSizingCalculation => {
  // Validate inputs
  if (entryPrice <= 0) {
    throw new Error('מחיר כניסה חייב להיות גדול מאפס');
  }
  
  if (entryPrice === stopLossPrice) {
    throw new Error('מחיר כניסה וסטופ לוס לא יכולים להיות זהים');
  }

  // Calculate risk amount
  const maxRiskAmount = accountSize * (riskPercentage / 100);
  
  // Calculate risk per unit
  const isLong = entryPrice > stopLossPrice;
  const riskPerUnit = Math.abs(entryPrice - stopLossPrice);
  
  // Calculate position size
  const positionSize = maxRiskAmount / riskPerUnit;
  
  // Calculate risk-reward ratio if target price is provided
  let riskRewardRatio = 1.0;
  if (targetPrice !== undefined && targetPrice > 0) {
    const rewardPerUnit = isLong 
      ? targetPrice - entryPrice 
      : entryPrice - targetPrice;
    
    if (rewardPerUnit > 0 && riskPerUnit > 0) {
      riskRewardRatio = rewardPerUnit / riskPerUnit;
    }
  }
  
  return {
    positionSize,
    maxLossAmount: maxRiskAmount,
    riskRewardRatio,
    takeProfitPrice: targetPrice
  };
};

// Mock function to get trading performance stats
export const getTradingPerformanceStats = (): TradingPerformanceStats => {
  return {
    winRate: 68,
    profitFactor: 2.4,
    maxDrawdown: 12
  };
};

// Mock function to get trend trading stats
export const getTrendTradingStats = (): TrendTradingStats => {
  return {
    firstTargetSuccessRate: 75,
    secondTargetSuccessRate: 52,
    thirdTargetSuccessRate: 28
  };
};
