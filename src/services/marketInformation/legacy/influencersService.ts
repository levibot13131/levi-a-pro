
import { LegacyMarketInfluencer } from './types';

// Mock data for market influencers
const influencers: LegacyMarketInfluencer[] = [
  {
    id: "1",
    name: "Ray Dalio",
    position: "Founder",
    company: "Bridgewater Associates",
    influence: 95,
    recentStatements: ["Concerned about inflation", "Recommends diversification"],
    sentiment: "neutral",
    specialty: ["macro", "economic cycles"],
    reliability: 90,
    followStatus: "following"
  },
  {
    id: "2",
    name: "Cathie Wood",
    position: "CEO",
    company: "ARK Invest",
    influence: 88,
    recentStatements: ["Bullish on innovation", "Sees potential in disruptive tech"],
    sentiment: "bullish",
    specialty: ["innovation", "technology"],
    reliability: 75,
    followStatus: "not-following"
  }
];

// Get all market influencers
export const getMarketInfluencers = (): LegacyMarketInfluencer[] => {
  return [...influencers];
};
