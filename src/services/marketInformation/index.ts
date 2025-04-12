
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
