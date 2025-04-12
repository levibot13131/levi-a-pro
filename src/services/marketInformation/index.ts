
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

// Export functions for InformationSources.tsx
export {
  getInfluencers,
  getSources,
  toggleSourceFavorite,
  toggleInfluencerFollow
};

// Add mock functions for events
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

export const setEventReminder = (eventId: string) => {
  console.log(`Setting reminder for event ${eventId}`);
  return true;
};

export const addCustomEvent = (eventData: any) => {
  console.log('Custom event added:', eventData);
  return {
    id: Date.now().toString(),
    ...eventData
  };
};

// Export all other functions for completeness
export {
  // Influencers
  getInfluencerById,
  getInfluencersByPlatform,
  getInfluencersByAsset,
  searchInfluencers,
  
  // Sources
  getSourceById,
  getSourcesByType,
  searchSources
};
