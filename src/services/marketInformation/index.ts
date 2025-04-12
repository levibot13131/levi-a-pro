
// Re-export all market information services

import { getSources, getSourceById, getSourcesByType } from './sourcesService';
import { getInfluencers, getInfluencersByPlatform, toggleInfluencerFollow } from './influencersService';
import { getUpcomingMarketEvents, setEventReminder } from './eventsService';
import { 
  getExternalSources, 
  connectToExternalSource, 
  disconnectExternalSource,
  updateAssetsFromConnectedSources 
} from './externalSourcesService';

// Add export for toggleSourceFavorite
import { toggleSourceFavorite } from './sourcesService';

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

// Also export types for easy importing
export type { MarketInfluencer, FinancialDataSource, MarketEvent, MarketSource } from '@/types/marketInformation';
