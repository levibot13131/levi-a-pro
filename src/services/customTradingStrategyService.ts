
import { toast } from "sonner";
import { Asset } from "@/types/asset";

// Define types for your strategy
export interface RiskManagementRule {
  id: string;
  description: string;
  category: 'stopLoss' | 'positionSize' | 'psychology' | 'general';
  priority: 'critical' | 'high' | 'medium' | 'low';
}

export interface PositionSizingCalculation {
  accountSize: number;
  riskPercentage: number;
  entryPrice: number;
  stopLossPrice: number;
  positionSize: number;
  maxLossAmount: number;
  riskRewardRatio: number;
  targetPrice?: number;
}

export interface TradingJournalEntry {
  id: string;
  date: string;
  asset: string;
  direction: 'long' | 'short';
  entryPrice: number;
  stopLoss: number;
  target?: number;
  positionSize: number;
  riskAmount: number;
  riskPercentage: number;
  outcome?: 'win' | 'loss' | 'breakeven';
  profit?: number;
  profitPercentage?: number;
  reasonForEntry: string;
  lessonLearned?: string;
  screenshots?: string[];
  followedStrategy: boolean;
  psychologicalState?: string;
}

// Custom trading approach based on the user's strategy
export const tradingApproach = {
  name: "אסטרטגיה משולבת קסם",
  description: "שיטה משולבת לזיהוי הזדמנויות מסחר איכותיות עם ניהול סיכונים קפדני",
  keyPrinciples: [
    "סטופ לוס הוא הכלי שמבטיח את השליטה בהפסד",
    "קביעה נכונה של גודל הפוזיציה",
    "ניהול יומן מסחר",
    "התראות בטריידינגוויו",
    "שמירה עיקשת על כללי המסחר",
    "חופשות התקררות פסיכולוגית ולמידה",
    "מינון כמות המסחר - להימנע מאובר טריידינג",
    "הכנה למצבי קיצון וידיעה מה עלותם",
    "ניהול טריידים בזמן אמת"
  ]
};

// Risk management rules based on the user's slides
export const riskManagementRules: RiskManagementRule[] = [
  {
    id: "stop-loss-mandatory",
    description: "סטופ לוס הוא הכלי שמבטיח את השליטה בהפסד",
    category: "stopLoss",
    priority: "critical"
  },
  {
    id: "position-size-1pct",
    description: "הגדרתי מראש שמותר לי לסכן 1% בלבד מהתיק בפוזיציה בודדת",
    category: "positionSize",
    priority: "critical"
  },
  {
    id: "stop-placement",
    description: "קביעת סטופ לוס במרחק טכני, לא בהתבסס על אחוז כלשהו",
    category: "stopLoss",
    priority: "high"
  },
  {
    id: "multiple-stops",
    description: "לעיתים נשים יותר מסטופ אחד",
    category: "stopLoss",
    priority: "medium"
  },
  {
    id: "active-management",
    description: "ניהול פעיל של הטרייד כאשר הגרף מתקדם",
    category: "general",
    priority: "high"
  },
  {
    id: "first-target-25pct",
    description: "בתבנית ראשונה בטרנד בד״כ נממש 25% במטרה ראשונה ו 25%-50% במטרה השניה",
    category: "general",
    priority: "medium"
  },
  {
    id: "avoid-overtrading",
    description: "מינון כמות המסחר - להימנע מאובר טריידינג בכל מחיר",
    category: "psychology",
    priority: "high"
  },
  {
    id: "emotional-balance",
    description: "שמירה על איזון פסיכולוגי ע״י טכניקות וע״י מנגנון זיהוי יציאה מאיזון",
    category: "psychology",
    priority: "high"
  }
];

// Calculate position size based on the user's formula
export const calculatePositionSize = (
  accountSize: number,
  riskPercentage: number,
  entryPrice: number,
  stopLossPrice: number,
  targetPrice?: number
): PositionSizingCalculation => {
  // Make sure stop loss is a valid value
  if (entryPrice === stopLossPrice) {
    throw new Error("Entry price cannot be equal to stop loss price");
  }
  
  // Calculate the risk per pip/point
  const direction = entryPrice > stopLossPrice ? 'long' : 'short';
  const riskPerUnit = Math.abs(entryPrice - stopLossPrice);
  
  // Calculate max risk amount in currency
  const maxRiskAmount = accountSize * (riskPercentage / 100);
  
  // Calculate position size
  const positionSize = maxRiskAmount / riskPerUnit;
  
  // Calculate risk reward ratio if target is provided
  let riskRewardRatio = 0;
  if (targetPrice) {
    const rewardPerUnit = Math.abs(targetPrice - entryPrice);
    riskRewardRatio = rewardPerUnit / riskPerUnit;
  }
  
  return {
    accountSize,
    riskPercentage,
    entryPrice,
    stopLossPrice,
    positionSize,
    maxLossAmount: maxRiskAmount,
    riskRewardRatio,
    targetPrice
  };
};

// Add an entry to trading journal
export const addTradingJournalEntry = async (entry: Omit<TradingJournalEntry, 'id'>): Promise<TradingJournalEntry> => {
  // In a real app, this would persist to a database
  const id = `trade-${Date.now()}`;
  const newEntry = { ...entry, id };
  
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 500));
  
  toast.success("העסקה נוספה ליומן המסחר", {
    description: `${entry.asset} ${entry.direction === 'long' ? 'קניה' : 'מכירה'} במחיר ${entry.entryPrice}`
  });
  
  return newEntry as TradingJournalEntry;
};

// Get historical performance stats
export const getTradingPerformanceStats = async (
  timeframe: 'week' | 'month' | 'quarter' | 'year' | 'all' = 'all'
): Promise<{
  winRate: number;
  averageWin: number;
  averageLoss: number;
  profitFactor: number;
  totalTrades: number;
  netProfit: number;
  netProfitPercentage: number;
  maxDrawdown: number;
  riskRewardAverage: number;
  bestTrade: number;
  worstTrade: number;
}> => {
  // In a real app, this would fetch from a database
  // Now just return mock data
  
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 800));
  
  return {
    winRate: 68,
    averageWin: 2.4,
    averageLoss: 1.0,
    profitFactor: 1.85,
    totalTrades: 145,
    netProfit: 15680,
    netProfitPercentage: 15.68,
    maxDrawdown: 8.5,
    riskRewardAverage: 2.1,
    bestTrade: 5.8,
    worstTrade: -1.5
  };
};

// Analyze a trade setup based on the custom strategy
export const analyzeTradeSetup = (
  asset: Asset,
  entryPrice: number,
  stopLossPrice: number,
  targetPrice: number,
  technicalFactors: {
    trendAlignment: boolean;
    patternQuality: 'high' | 'medium' | 'low';
    supportResistance: boolean;
    volumeConfirmation: boolean;
    momentum: boolean;
  }
): {
  score: number; // 0-100
  recommendation: 'strong buy' | 'buy' | 'neutral' | 'avoid' | 'strong avoid';
  reasons: string[];
  suggestedPositionSize: number;
  estimatedSuccessRate: number;
} => {
  // Calculate base score
  let score = 50; // Start at neutral
  const reasons: string[] = [];
  
  // Assess risk reward ratio
  const riskAmount = Math.abs(entryPrice - stopLossPrice);
  const rewardAmount = Math.abs(targetPrice - entryPrice);
  const riskRewardRatio = rewardAmount / riskAmount;
  
  // Add points based on risk:reward
  if (riskRewardRatio >= 3) {
    score += 20;
    reasons.push(`יחס סיכוי:סיכון מצוין של ${riskRewardRatio.toFixed(1)}:1`);
  } else if (riskRewardRatio >= 2) {
    score += 10;
    reasons.push(`יחס סיכוי:סיכון טוב של ${riskRewardRatio.toFixed(1)}:1`);
  } else if (riskRewardRatio < 1.5) {
    score -= 15;
    reasons.push(`יחס סיכוי:סיכון לא מספיק (${riskRewardRatio.toFixed(1)}:1)`);
  }
  
  // Technical factors
  if (technicalFactors.trendAlignment) {
    score += 15;
    reasons.push("התאמה למגמה הראשית");
  } else {
    score -= 10;
    reasons.push("אין התאמה למגמה הראשית - סיכון מוגבר");
  }
  
  if (technicalFactors.patternQuality === 'high') {
    score += 15;
    reasons.push("תבנית מחיר איכותית מאוד");
  } else if (technicalFactors.patternQuality === 'medium') {
    score += 5;
    reasons.push("תבנית מחיר באיכות בינונית");
  } else {
    score -= 5;
    reasons.push("תבנית מחיר חלשה");
  }
  
  if (technicalFactors.supportResistance) {
    score += 10;
    reasons.push("תמיכה/התנגדות משמעותית באזור הכניסה");
  }
  
  if (technicalFactors.volumeConfirmation) {
    score += 10;
    reasons.push("אישור מנפח המסחר");
  } else {
    score -= 5;
    reasons.push("אין אישור מנפח המסחר");
  }
  
  if (technicalFactors.momentum) {
    score += 10;
    reasons.push("מומנטום תומך");
  } else {
    score -= 5;
    reasons.push("אין מומנטום תומך");
  }
  
  // Ensure score is within range
  score = Math.max(0, Math.min(100, score));
  
  // Determine recommendation
  let recommendation: 'strong buy' | 'buy' | 'neutral' | 'avoid' | 'strong avoid';
  
  if (score >= 80) {
    recommendation = 'strong buy';
  } else if (score >= 65) {
    recommendation = 'buy';
  } else if (score >= 45) {
    recommendation = 'neutral';
  } else if (score >= 30) {
    recommendation = 'avoid';
  } else {
    recommendation = 'strong avoid';
  }
  
  // Estimate success rate based on pattern quality and statistics
  const estimatedSuccessRate = Math.min(85, (score / 100) * 85);
  
  // Calculate suggested position size (base: 1% of account)
  let suggestedPositionSize = 1.0; // Default risk percentage
  
  if (score >= 80 && riskRewardRatio >= 2.5) {
    suggestedPositionSize = 1.5; // Increase for very good setups
  } else if (score < 50) {
    suggestedPositionSize = 0.5; // Reduce for questionable setups
  }
  
  return {
    score,
    recommendation,
    reasons,
    suggestedPositionSize,
    estimatedSuccessRate
  };
};

// Implement key statistics for trend trading with the KSEM strategy
export const getTrendTradingStats = async (): Promise<{
  firstTargetSuccessRate: number;
  secondTargetSuccessRate: number;
  thirdTargetSuccessRate: number;
}> => {
  // In a real application, this would fetch from a database
  
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 600));
  
  return {
    firstTargetSuccessRate: 85, // Based on the user's chart showing 85% success for first target
    secondTargetSuccessRate: 65, // Based on the user's chart showing 65% success for first target
    thirdTargetSuccessRate: 50   // Based on the user's chart showing 50% success for third target
  };
};
