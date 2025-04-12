
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
  
  // Additional fields needed based on usage in code
  signalId?: string;
  assetId?: string;
  type?: "buy" | "sell";
  timestamp?: number;
  timeframe?: string;
  confidence?: number;
  analysis?: string;
  supportingFactors?: string[];
  riskFactors?: string[];
  alternativeScenarios?: string[];
  conclusion?: string;
}

export const generateSignalAnalysis = (assetId?: string): SignalAnalysisResult => {
  // This is a mock implementation with all required properties
  return {
    totalSignals: 0,
    buySignals: 0,
    sellSignals: 0,
    strongSignals: 0,
    recentSignals: 0,
    topAssets: [],
    marketSentiment: 'neutral',
    signalStrength: 5,
    summary: 'אין מספיק נתונים לניתוח מקיף', // No sufficient data for comprehensive analysis
    recommendation: 'המתן לנתונים נוספים', // Wait for more data
    supportingFactors: [],
    riskFactors: [],
    alternativeScenarios: [],
    conclusion: ''
  };
};
