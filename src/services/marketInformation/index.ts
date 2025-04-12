
// Re-export all market information services
import { 
  getInfluencers, 
  getInfluencerById, 
  getInfluencersByPlatform,
  getInfluencersByAsset,
  toggleInfluencerFollow,
  searchInfluencers
} from './influencersService';

import {
  getSources,
  getSourceById,
  getSourcesByType,
  searchSources,
  toggleSourceFavorite
} from './sourcesService';

// Export functions matching the names expected in InformationSources.tsx
export const getMarketInfluencers = getInfluencers;
export const getInformationSources = getSources;
export const toggleSourceFocus = toggleSourceFavorite;

// Add missing functions expected by InformationSources.tsx
export const getUpcomingMarketEvents = () => {
  return [
    {
      id: '1',
      title: 'הודעת ריבית פדרלית',
      date: '2025-05-01',
      importance: 'high',
      category: 'economic',
      description: 'הודעת הריבית הפדרלית לחודש מאי 2025'
    },
    {
      id: '2',
      title: 'פרסום דוחות רבעון ראשון',
      date: '2025-04-20',
      importance: 'medium',
      category: 'earnings',
      description: 'פרסום דוחות רבעוניים של חברות מרכזיות בשוק הקריפטו'
    }
  ];
};

export const setEventReminder = (eventId: string, enabled: boolean) => {
  console.log(`Event reminder ${enabled ? 'enabled' : 'disabled'} for event ${eventId}`);
  return true;
};

export const addCustomEvent = (eventData: any) => {
  console.log('Custom event added:', eventData);
  return {
    id: Date.now().toString(),
    ...eventData
  };
};

export {
  // Influencers
  getInfluencers,
  getInfluencerById,
  getInfluencersByPlatform,
  getInfluencersByAsset,
  toggleInfluencerFollow,
  searchInfluencers,
  
  // Sources
  getSources,
  getSourceById,
  getSourcesByType,
  searchSources,
  toggleSourceFavorite
};
