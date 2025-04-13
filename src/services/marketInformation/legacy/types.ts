
export interface LegacyMarketEvent {
  id: string;
  title: string;
  date: string;
  category: string;
  impact: string;
  description: string;
  expectedVolatility: string;
  assetImpact: Record<string, string>;
  importance: string;
  source: string;
  reminder: boolean;
}

export interface LegacyMarketInfluencer {
  id: string;
  name: string;
  position: string;
  company: string;
  influence: number;
  recentStatements: string[];
  sentiment: string;
  specialty: string[];
  reliability: number;
  followStatus: string;
}

export interface LegacyFinancialDataSource {
  id: string;
  name: string;
  url: string;
  category: string;
  dataPoints: string[];
  description: string;
  reliabilityRating: number;
  accessType: string;
  languages: string[];
  updateFrequency: string;
}
