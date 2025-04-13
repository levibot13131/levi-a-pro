
// Re-export all legacy services for backward compatibility
export { getMarketEvents } from './eventsService';
export { getMarketInfluencers } from './influencersService';
export { getFinancialDataSources, connectToExternalDataSource, refreshMarketData } from './sourcesService';
export { 
  connectToExternalSource, 
  disconnectFromExternalSource, 
  fetchDataFromExternalSource 
} from './externalsService';

// Export types
export type { 
  LegacyMarketEvent,
  LegacyMarketInfluencer,
  LegacyFinancialDataSource
} from './types';
