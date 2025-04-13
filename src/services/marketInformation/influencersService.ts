
import { MarketInfluencer } from '@/types/marketInformation';

// Mock data for market influencers
const marketInfluencers: MarketInfluencer[] = [
  {
    id: "1",
    name: "Michael Saylor",
    platform: "twitter",
    followers: 2500000,
    description: "מייסד MicroStrategy, תומך גדול של ביטקוין",
    topics: ["bitcoin", "crypto", "investing"],
    isFollowed: false,
    influence: 92,
    avatarUrl: "https://example.com/saylor.jpg",
    username: "@saylor",
    reliability: 85,
    expertise: ["macro", "bitcoin"],
    bio: "CEO of MicroStrategy, Bitcoin advocate",
    profileUrl: "https://twitter.com/saylor",
    isVerified: true,
    assetsDiscussed: ["BTC", "ETH"]
  },
  {
    id: "2",
    name: "Cathie Wood",
    platform: "twitter",
    followers: 1800000,
    description: "מנכ\"לית ומייסדת ARK Invest, מתמחה בהשקעות בחדשנות",
    topics: ["innovation", "tech", "investing"],
    isFollowed: false,
    influence: 88,
    avatarUrl: "https://example.com/wood.jpg",
    username: "@CathieDWood",
    reliability: 80,
    expertise: ["innovation", "technology"],
    bio: "CEO of ARK Invest",
    profileUrl: "https://twitter.com/cathiedwood",
    isVerified: true,
    assetsDiscussed: ["TSLA", "SQ", "COIN"]
  },
  {
    id: "3",
    name: "Vitalik Buterin",
    platform: "twitter",
    followers: 4500000,
    description: "מייסד אתריום, מפתח וחוקר מטבעות דיגיטליים",
    topics: ["ethereum", "crypto", "blockchain"],
    isFollowed: false,
    influence: 95,
    avatarUrl: "https://example.com/vitalik.jpg",
    username: "@VitalikButerin",
    reliability: 90,
    expertise: ["ethereum", "crypto"],
    bio: "Ethereum creator",
    profileUrl: "https://twitter.com/vitalikbuterin",
    isVerified: true,
    assetsDiscussed: ["ETH", "Layer2"]
  }
];

// Get all influencers
export const getInfluencers = (): MarketInfluencer[] => {
  return [...marketInfluencers];
};

// Get influencers by platform
export const getInfluencersByPlatform = (platform: string): MarketInfluencer[] => {
  return marketInfluencers.filter(influencer => influencer.platform === platform);
};

// Toggle follow status for an influencer
export const toggleInfluencerFollow = (id: string): boolean => {
  const index = marketInfluencers.findIndex(influencer => influencer.id === id);
  if (index === -1) return false;
  
  marketInfluencers[index].isFollowed = !marketInfluencers[index].isFollowed;
  return true;
};
