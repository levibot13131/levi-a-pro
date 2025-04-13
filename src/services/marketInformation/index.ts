
// Re-export all market information services
import { getSources, getSourceById, getSourcesByType, toggleSourceFavorite } from './sourcesService';
import { getInfluencers, getInfluencersByPlatform, toggleInfluencerFollow } from './influencersService';
import { getUpcomingMarketEvents, setEventReminder } from './eventsService';
import { 
  getExternalSources, 
  connectToExternalSource, 
  disconnectExternalSource,
  updateAssetsFromConnectedSources 
} from './externalSourcesService';

// Legacy service functions - re-exported from legacy service
import {
  getFinancialDataSources,
  getMarketInfluencers,
  getMarketEvents,
  connectToExternalDataSource,
  refreshMarketData
} from './legacyService';

// Export all services
export {
  // Sources
  getSources,
  getSourceById,
  getSourcesByType,
  toggleSourceFavorite,
  
  // Influencers
  getInfluencers,
  getInfluencersByPlatform,
  toggleInfluencerFollow,
  
  // Events
  getUpcomingMarketEvents,
  setEventReminder,
  
  // External sources
  getExternalSources,
  connectToExternalSource,
  disconnectExternalSource,
  updateAssetsFromConnectedSources,
  
  // Legacy services
  getFinancialDataSources,
  getMarketInfluencers,
  getMarketEvents,
  connectToExternalDataSource,
  refreshMarketData
};

// Export types
export type { 
  MarketEvent, 
  MarketInfluencer, 
  FinancialDataSource, 
  MarketSource,
  EventReminder,
  CustomEventData,
  AddCustomEventFn
} from '@/types/marketInformation';
