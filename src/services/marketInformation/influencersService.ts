
import { MarketInfluencer } from '@/types/marketInformation';

// Mock data for market influencers
const mockInfluencers: MarketInfluencer[] = [
  {
    id: '1',
    name: 'מייקל סיילור',
    username: 'michael_saylor',
    platform: 'twitter',
    profileUrl: 'https://twitter.com/saylor',
    followers: 2900000,
    assetsDiscussed: ['bitcoin', 'crypto'],
    reliability: 95,
    description: 'מייסד ויו״ר של MicroStrategy, תומך נלהב של ביטקוין',
    bio: 'מייסד ויו״ר של MicroStrategy, תומך נלהב של ביטקוין',
    expertise: ['bitcoin', 'crypto'],
    isVerified: true,
    imageUrl: 'https://example.com/saylor.jpg'
  },
  {
    id: '2',
    name: 'קתי ווד',
    username: 'cathiedwood',
    platform: 'twitter',
    profileUrl: 'https://twitter.com/cathiedwood',
    followers: 1500000,
    assetsDiscussed: ['tesla', 'ark', 'innovation', 'tech'],
    reliability: 90,
    description: 'מייסדת ומנכ״לית של ARK Invest, מתמחה בהשקעות חדשניות וטכנולוגיה',
    bio: 'מייסדת ומנכ״לית של ARK Invest, מתמחה בהשקעות חדשניות וטכנולוגיה',
    expertise: ['innovation', 'tech'],
    isVerified: true,
    imageUrl: 'https://example.com/cathie.jpg'
  },
  {
    id: '3',
    name: 'ויטליק בוטרין',
    username: 'VitalikButerin',
    platform: 'telegram',
    profileUrl: 'https://t.me/vitalikbuterin',
    followers: 3200000,
    assetsDiscussed: ['ethereum', 'crypto', 'defi'],
    reliability: 98,
    description: 'מייסד אתריום ומפתח בלוקצ׳יין',
    bio: 'מייסד אתריום ומפתח בלוקצ׳יין',
    expertise: ['ethereum', 'crypto', 'defi'],
    isVerified: true,
    imageUrl: 'https://example.com/vitalik.jpg'
  },
  {
    id: '4',
    name: 'ריי דאליו',
    username: 'RayDalio',
    platform: 'youtube',
    profileUrl: 'https://youtube.com/raydalio',
    followers: 850000,
    assetsDiscussed: ['gold', 'bonds', 'macroeconomics'],
    reliability: 92,
    description: 'מייסד קרן הגידור Bridgewater Associates, מומחה למאקרו-כלכלה',
    bio: 'מייסד קרן הגידור Bridgewater Associates, מומחה למאקרו-כלכלה',
    expertise: ['gold', 'bonds', 'macroeconomics'],
    isVerified: true,
    imageUrl: 'https://example.com/ray.jpg'
  },
  {
    id: '5',
    name: 'אנטוני פומפליאנו',
    username: 'pomp',
    platform: 'twitter',
    profileUrl: 'https://twitter.com/apompliano',
    followers: 1800000,
    assetsDiscussed: ['bitcoin', 'crypto', 'entrepreneurship'],
    reliability: 85,
    description: 'יזם, משקיע ומארח פודקאסט, מומחה לביטקוין',
    bio: 'יזם, משקיע ומארח פודקאסט, מומחה לביטקוין',
    expertise: ['bitcoin', 'crypto', 'entrepreneurship'],
    isVerified: true,
    imageUrl: 'https://example.com/pomp.jpg'
  }
];

// Save followed status
const followedInfluencers = new Set<string>();

// Get all market influencers
export const getInfluencers = (): MarketInfluencer[] => {
  return mockInfluencers.map(influencer => ({
    ...influencer,
    isFollowing: followedInfluencers.has(influencer.id)
  }));
};

// Get influencers by platform
export const getInfluencersByPlatform = (platform: string): MarketInfluencer[] => {
  return mockInfluencers
    .filter(influencer => influencer.platform === platform)
    .map(influencer => ({
      ...influencer,
      isFollowing: followedInfluencers.has(influencer.id)
    }));
};

// Toggle follow status for an influencer
export const toggleInfluencerFollow = (influencerId: string): boolean => {
  if (followedInfluencers.has(influencerId)) {
    followedInfluencers.delete(influencerId);
  } else {
    followedInfluencers.add(influencerId);
  }
  
  return followedInfluencers.has(influencerId);
};
