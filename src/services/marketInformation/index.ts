
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
  updateAssetsFromConnectedSources
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
