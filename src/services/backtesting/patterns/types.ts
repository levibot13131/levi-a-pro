
// Pattern types for market analysis
export type PatternType = 'bullish' | 'bearish' | 'neutral';

// Interface for detected patterns
export interface DetectedPattern {
  name: string;
  type: PatternType;
  startDate: string;
  endDate: string;
  significance: number; // 1-10 rating
  description: string;
}

// Interface for trend information
export interface TrendInfo {
  period: string;
  direction: string;
  strength: number;
}

// Interface for cluster information
export interface ClusterInfo {
  period: string;
  count: number;
  performance: number;
  strategy: string;
}

// Interface for regime analysis results
export interface RegimeAnalysisResult {
  bullMarketPerformance: number;
  bearMarketPerformance: number;
  rangeBoundPerformance: number;
  volatilePerformance: number;
  bestRegime: string;
}
