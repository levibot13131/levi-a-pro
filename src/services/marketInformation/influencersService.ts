
import { toast } from "sonner";
import { MarketInfluencer } from '@/types/marketInformation';
import { MARKET_INFLUENCERS } from './mockData';

export const getMarketInfluencers = async (): Promise<MarketInfluencer[]> => {
  return new Promise(resolve => {
    setTimeout(() => resolve(MARKET_INFLUENCERS), 600);
  });
};

export const toggleInfluencerFollow = async (influencerId: string, following: boolean): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  const influencer = MARKET_INFLUENCERS.find(i => i.id === influencerId);
  if (influencer) {
    influencer.followStatus = following ? 'following' : 'not-following';
    toast.success(`${influencer.name} ${following ? 'added to' : 'removed from'} followed influencers`);
  }
};
