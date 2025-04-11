
// Export all services from this directory
export * from './eventsService';
export * from './influencersService';
export * from './sourcesService';
export * from './externalSourcesService';
export * from './mockData';

// For backward compatibility, re-export functions with legacy names
import { getInformationSources } from './sourcesService';
import { getMarketInfluencers } from './influencersService';
import { getUpcomingMarketEvents, setEventReminder, addCustomEvent } from './eventsService';
import { toggleSourceFocus } from './sourcesService';
import { toggleInfluencerFollow } from './influencersService';

// Re-export with the names expected by InformationSources.tsx and other files
export {
  getInformationSources,
  getMarketInfluencers,
  getUpcomingMarketEvents,
  toggleSourceFocus,
  toggleInfluencerFollow,
  setEventReminder,
  addCustomEvent
};
