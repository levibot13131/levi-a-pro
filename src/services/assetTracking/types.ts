
import { Asset } from '@/types/asset';

export interface TrackedAsset {
  id: string;
  name: string;
  symbol: string;
  type: 'crypto' | 'stocks' | 'forex' | 'commodities';
  price: number;
  change24h: number;
  priority: 'high' | 'medium' | 'low';
  alertsEnabled: boolean;
  lastUpdated: number;
  technicalSignal?: 'buy' | 'sell' | 'neutral';
  sentimentSignal?: 'bullish' | 'bearish' | 'neutral';
  notes?: string;
  isPinned?: boolean;
}

// Storage key for tracked assets
export const TRACKED_ASSETS_KEY = 'tracked_assets_list';
export const MAX_ASSETS_PER_MARKET = 50;

// Markets to track
export const MARKETS = ['crypto', 'stocks', 'forex', 'commodities'];
