
// This file exports all backtesting services for easier imports
export * from './backtesting';
export * from './backtesting/positionSizer';
export * from './backtesting/signals';
export * from './backtesting/performanceCalculator';
export * from './backtesting/mockDataGenerator';
export * from './backtesting/patterns';
export * from './whaleTrackerService';

// Import directly from the marketInformation directory services
import {
  getSources,
  getInfluencers,
  toggleSourceFavorite,
  toggleInfluencerFollow,
  getUpcomingMarketEvents,
  setEventReminder,
  addCustomEvent as addMarketCustomEvent
} from './marketInformation/index';

// Re-export with renamed functions to avoid conflicts
export {
  getSources as getInformationSources,
  getInfluencers as getMarketInfluencers,
  getUpcomingMarketEvents,
  toggleSourceFavorite as toggleSourceFocus,
  toggleInfluencerFollow,
  setEventReminder,
  addMarketCustomEvent as addCustomEvent
};

// Re-export the types directly from the types module
export type { MarketInfluencer, FinancialDataSource as MarketSource } from '@/types/marketInformation';
export type { MarketEvent } from '@/types/marketInformation';

export interface BacktestResult {
  winRate: number;
  profitFactor: number;
  totalTrades: number;
  profitableTrades: number;
  unprofitableTrades: number;
  maxDrawdown: number;
  averageProfitPerTrade: number;
  averageLossPerTrade: number;
  expectancy: number;
}

export const addEventToAssetTimeline = (assetId: string, eventData: any) => {
  return addMarketCustomEvent(assetId, eventData);
};
