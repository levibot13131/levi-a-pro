
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
  getSources as getInformationSources,
  getInfluencers as getMarketInfluencers,
  toggleSourceFavorite as toggleSourceFocus,
  toggleInfluencerFollow
} from './marketInformation/index';

// Mock function for upcoming events
const getUpcomingMarketEvents = () => [
  { id: '1', title: 'Event 1', date: '2025-04-15', importance: 'high', category: 'economic', description: 'Description 1' },
  { id: '2', title: 'Event 2', date: '2025-04-20', importance: 'medium', category: 'earnings', description: 'Description 2' }
];

// Mock function for setting event reminders
const setEventReminder = (eventId: string) => {
  console.log(`Setting reminder for event ${eventId}`);
  return true;
};

// Mock function for adding custom events
const addCustomEvent = (eventData: any) => {
  console.log('Adding custom event:', eventData);
  return { id: Date.now().toString(), ...eventData };
};

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
export type { MarketInfluencer, MarketSource } from '@/types/market';
export type { MarketEvent } from '@/types/marketData';
