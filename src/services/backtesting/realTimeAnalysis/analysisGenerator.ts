
import { TradeSignal } from "@/types/asset";

export interface SignalAnalysisResult {
  totalSignals: number;
  buySignals: number;
  sellSignals: number;
  strongSignals: number;
  recentSignals: number;
  topAssets: string[];
  marketSentiment: 'bullish' | 'bearish' | 'neutral';
  signalStrength: number;
  summary: string;
  recommendation: string;
  buyToSellRatio?: string;
  mostCommonStrategy?: string;
  weakSignals: number;
  confidenceScore: number;
  assetId: string;
  timeframe: string;
  conclusion: string;
  supportingFactors: string[];
  riskFactors: string[];
  alternativeScenarios: string[];
  
  // Additional fields needed based on usage in code
  signalId?: string;
  type?: "buy" | "sell";
  timestamp?: number;
  confidence?: number;
  analysis?: string;
}

export const generateSignalAnalysis = (assetId?: string): SignalAnalysisResult => {
  // This is a mock implementation with all required properties
  return {
    totalSignals: 42,
    buySignals: 28,
    sellSignals: 14,
    strongSignals: 15,
    recentSignals: 5,
    weakSignals: 27,
    confidenceScore: 72,
    topAssets: ['BTC', 'ETH', 'SOL'],
    marketSentiment: 'bullish',
    signalStrength: 5,
    summary: 'מגמה חיובית בטווח הקצר', 
    recommendation: 'אפשרויות כניסה נוחות לפוזיציות לונג',
    assetId: assetId || 'all',
    timeframe: '1d',
    conclusion: 'מגמה חיובית בטווח הקצר',
    supportingFactors: [
      'התבססות מעל ממוצע נע 200',
      'תנועת כספים חיובית לשוק',
      'רוב האינדיקטורים במצב חיובי'
    ],
    riskFactors: [
      'התנגדות משמעותית ברמת 50,000$',
      'סנטימנט חיובי מידי בטווח הקצר'
    ],
    alternativeScenarios: [
      'תיקון טכני קל לפני המשך עלייה',
      'דשדוש ברמות הנוכחיות'
    ],
    // Adding missing fields that are expected in some parts of the code
    signalId: assetId ? `signal_${assetId}` : 'unknown_signal',
    type: "buy",
    timestamp: Date.now(),
    confidence: 85,
    analysis: 'ניתוח מקיף של מגמות השוק והאיתותים הטכניים מצביע על המשך תנועה חיובית'
  };
};
