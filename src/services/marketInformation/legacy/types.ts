
// Legacy type definitions for compatibility with newer types
import { 
  FinancialDataSource,
  MarketInfluencer,
  MarketEvent
} from '@/types/marketInformation';

export interface LegacyFinancialDataSource {
  id: string;
  name: string;
  url: string;
  category: string;
  dataPoints: string[];
  description: string;
  reliabilityRating: number;
  // Add missing properties to match NewFinancialDataSource
  reliability?: number;
  accessType?: 'free' | 'paid' | 'api' | 'freemium';
  languages?: string[];
  updateFrequency?: string;
  focused?: boolean;
}

export interface LegacyMarketInfluencer {
  id: string;
  name: string;
  position: string;
  company: string;
  influence: number;
  recentStatements: string[];
  sentiment: 'bullish' | 'bearish' | 'neutral';
  // Add missing properties to match NewMarketInfluencer
  description?: string;
  platforms?: {
    type: 'twitter' | 'linkedin' | 'youtube' | 'blog' | 'other';
    url: string;
    followers: number;
  }[];
  specialty?: string[];
  reliability?: number;
  followStatus?: 'following' | 'not-following';
}

export interface LegacyMarketEvent {
  id: string;
  title: string;
  date: string;
  category: string;
  impact: string;
  description: string;
  expectedVolatility: string;
  assetImpact: {
    [key: string]: string;
  };
  // Add missing properties to match NewMarketEvent
  importance?: 'low' | 'medium' | 'high' | 'critical';
  source?: string;
  reminder?: boolean;
}
