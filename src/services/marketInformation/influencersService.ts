
import { MarketInfluencer } from '@/types/market';

let influencers: MarketInfluencer[] = [];

// Initialize demo data
const initializeInfluencers = () => {
  influencers = [
    // Sample influencers data
    {
      id: '1',
      name: 'Vitalik Buterin',
      username: 'VitalikButerin',
      platform: 'twitter',
      profileUrl: 'https://twitter.com/VitalikButerin',
      avatarUrl: 'https://example.com/vitalik.jpg',
      followers: 4200000,
      assetsDiscussed: ['ethereum', 'bitcoin'],
      influence: 95,
      verified: true,
      description: 'Ethereum co-founder',
      isFollowing: false
    },
    // Add more influencers here
  ];
  return influencers;
};

// Toggle follow status
export const toggleInfluencerFollow = (id: string): boolean => {
  const influencer = influencers.find(inf => inf.id === id);
  if (influencer) {
    influencer.isFollowing = !influencer.isFollowing;
    return true;
  }
  return false;
};

// Get all influencers
export const getInfluencers = () => {
  if (influencers.length === 0) {
    initializeInfluencers();
  }
  return influencers;
};

// Get influencer by ID
export const getInfluencerById = (id: string) => {
  return influencers.find(influencer => influencer.id === id);
};

// Get influencers by platform
export const getInfluencersByPlatform = (platform: string) => {
  return influencers.filter(influencer => influencer.platform === platform);
};

// Get influencers by asset
export const getInfluencersByAsset = (assetId: string) => {
  return influencers.filter(influencer => 
    influencer.assetsDiscussed.includes(assetId)
  );
};

// Search influencers
export const searchInfluencers = (query: string) => {
  const lowerQuery = query.toLowerCase();
  return influencers.filter(influencer => 
    influencer.name.toLowerCase().includes(lowerQuery) ||
    influencer.username.toLowerCase().includes(lowerQuery) ||
    influencer.description?.toLowerCase().includes(lowerQuery)
  );
};
