
export interface HistoricalEvent {
  event: string;
  date: string;
  impact: string;
}

export interface HistoricalTrend {
  period: string;
  direction: string;
  strength: string | number;
}

export interface CyclicalPattern {
  name: string;
  description: string;
}

export interface SentimentAnalysis {
  overall: string;
  social: string;
  news: string;
  fearGreedIndex: number;
}

export interface PriceLevel {
  price: number;
  type: string;
  strength: string;
}

export interface TechnicalIndicator {
  name: string;
  value: string | number;
  interpretation: string;
}

export interface ShortTermPrediction {
  prediction: string;
  confidence: number;
  keyLevels: Array<{
    scenario: string;
    target: number;
    probability: number;
  }>;
  significantEvents: Array<{
    event: string;
    date: string;
    potentialImpact: string;
  }>;
}

export interface LongTermAnalysis {
  trend: string;
  keyFactors: string[];
  scenarios: Array<{
    description: string;
    probability: number;
    timeframe: string;
    priceTarget: number;
  }>;
}

export interface Analysis {
  historical: {
    keyEvents: HistoricalEvent[];
    trends: HistoricalTrend[];
    cyclicalPatterns: CyclicalPattern[];
  };
  current: {
    marketCondition: string;
    sentimentAnalysis: SentimentAnalysis;
    keyLevels: PriceLevel[];
    technicalIndicators: TechnicalIndicator[];
  };
  future: {
    shortTerm: ShortTermPrediction;
    longTerm: LongTermAnalysis;
  };
}
