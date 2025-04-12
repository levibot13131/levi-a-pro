
// Re-export all market information services

import { getSources, getSourceById, getSourcesByType } from './sourcesService';
import { getInfluencers, getInfluencersByPlatform } from './influencersService';
import { getUpcomingMarketEvents, getUpcomingEvents, setEventReminder } from './eventsService';
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
  
  // Influencers
  getInfluencers,
  getInfluencersByPlatform,
  
  // Events
  getUpcomingMarketEvents,
  getUpcomingEvents,
  setEventReminder,
  
  // External sources
  getExternalSources,
  connectToExternalSource,
  disconnectExternalSource,
  updateAssetsFromConnectedSources
};

// Also export types for easy importing
export type { MarketInfluencer, FinancialDataSource, MarketEvent } from '@/types/marketInformation';

