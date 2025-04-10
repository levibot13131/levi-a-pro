
// This file exports all backtesting services for easier imports
export * from './backtesting';
export * from './backtesting/types';
export * from './backtesting/positionSizer';
export * from './backtesting/signals';
export * from './backtesting/performanceCalculator';
export * from './backtesting/mockDataGenerator';
export * from './backtesting/patterns';
export * from './whaleTrackerService';

// Re-export from marketInformationService but exclude timeRangeOptions to avoid conflict
export {
  FinancialDataSource,
  MarketInfluencer,
  MarketEvent,
  getInformationSources,
  getMarketInfluencers,
  getUpcomingMarketEvents,
  toggleSourceFocus,
  toggleInfluencerFollow,
  setEventReminder,
  addCustomEvent
} from './marketInformationService';
