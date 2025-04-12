
export interface MarketEvent {
  id: string;
  title: string;
  date: string;
  importance: 'low' | 'medium' | 'high';
  category: string;
  description: string;
  reminder: boolean;
  relatedAssets: string[];
  expectedImpact: string;
  source: string;
  type: string;
}

export interface MarketInfluencer {
  id: string;
  name: string;
  username: string;
  platform: string;
  profileUrl: string;
  avatarUrl: string;
  followers: number;
  assetsDiscussed: string[];
  influence: number;
  verified: boolean;
  description?: string;
  isFollowing?: boolean;
  bio: string;
  expertise: string[];
}

export interface FinancialDataSource {
  id: string;
  name: string;
  type: string;
  url: string;
  description: string;
  reliability: number;
  isPremium: boolean;
  imageUrl: string;
  apiAvailable: boolean;
  languages: string[];
  categories: string[];
  category: string;
  rating: number;
  platform: string;
}

export interface EventsTabProps {
  events: MarketEvent[];
  setReminders: Set<string>;
  onSetReminder: (eventId: string) => void;
}

export interface InfluencersTabProps {
  influencers: MarketInfluencer[];
  followedInfluencerIds: Set<string>;
  onFollow: (influencerId: string) => void;
}

export interface SourcesTabProps {
  sources: FinancialDataSource[];
  focusedSourceIds: Set<string>;
  onFocus: (sourceId: string) => void;
}
