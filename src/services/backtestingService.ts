
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
  getInformationSources,
  getMarketInfluencers,
  getUpcomingMarketEvents,
  toggleSourceFocus,
  toggleInfluencerFollow,
  setEventReminder,
  addCustomEvent
} from './marketInformation/index';

export {
  getInformationSources,
  getMarketInfluencers,
  getUpcomingMarketEvents,
  toggleSourceFocus,
  toggleInfluencerFollow,
  setEventReminder,
  addCustomEvent
};

// Re-export the types directly from the types module
export type { FinancialDataSource, MarketInfluencer, MarketEvent } from '@/types/marketInformation';
