
// Re-export everything from the marketInformation directory
export * from './marketInformation/index';

// Explicitly re-export the types to avoid any import issues
export type { 
  FinancialDataSource,
  MarketInfluencer,
  MarketEvent,
  MarketSource,
  EventReminder,
  CustomEventData,
  AddCustomEventFn
} from '@/types/marketInformation';

// Explicitly export the functions
export { 
  getUpcomingMarketEvents, 
  setEventReminder 
} from './marketInformation/eventsService';

export {
  getExternalSources,
  connectToExternalSource,
  disconnectExternalSource,
  updateAssetsFromConnectedSources
} from './marketInformation/externalSourcesService';

export {
  getSources,
  getSourceById,
  getSourcesByType,
  toggleSourceFavorite
} from './marketInformation/sourcesService';

export {
  getInfluencers,
  getInfluencersByPlatform,
  toggleInfluencerFollow
} from './marketInformation/influencersService';
