// This file exports all backtesting services for easier imports
export * from './backtesting';
export * from './backtesting/positionSizer';
export * from './backtesting/signals';
export * from './backtesting/performanceCalculator';
export * from './backtesting/mockDataGenerator';
export * from './backtesting/patterns';
export * from './whaleTrackerService';

// Import directly from the marketInformation directory services 
// to avoid circular dependency and type conflicts
import {
  getSources,
  getInfluencers,
  toggleSourceFavorite,
  toggleInfluencerFollow,
  getUpcomingMarketEvents,
  setEventReminder,
  addCustomEvent
} from './marketInformation/index';

export {
  getSources as getInformationSources,
  getInfluencers as getMarketInfluencers,
  getUpcomingMarketEvents,
  toggleSourceFavorite as toggleSourceFocus,
  toggleInfluencerFollow,
  setEventReminder,
  addCustomEvent
};

// Re-export the types directly from the types module
export type { MarketInfluencer, FinancialDataSource as MarketSource } from '@/types/marketInformation';
export type { MarketEvent } from '@/types/marketInformation';

import { TradeSignal } from '@/types/asset';
import { addCustomEvent } from './marketInformation/index';

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
  return addCustomEvent(assetId, eventData);
};
