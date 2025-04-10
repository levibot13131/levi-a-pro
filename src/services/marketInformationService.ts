
// Re-export all the types
export * from '@/types/marketInformation';

// Re-export all the services individually
export { 
  getInformationSources, 
  toggleSourceFocus
} from './marketInformation/sourcesService';

export { 
  getMarketInfluencers, 
  toggleInfluencerFollow
} from './marketInformation/influencersService';

export { 
  getUpcomingMarketEvents, 
  setEventReminder, 
  addCustomEvent,
  // Export timeRangeOptions with a new name to avoid conflict
  timeRangeOptions as eventTimeRangeOptions
} from './marketInformation/eventsService';
