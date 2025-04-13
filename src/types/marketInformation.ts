
export interface MarketEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  category: string;
  impact: 'low' | 'medium' | 'high';
  source: string;
  time: string;
  link: string;
  reminder: boolean;
  importance: string;
  type: string;
  relatedAssets: string[];
  expectedImpact: string;
}

export interface MarketInfluencer {
  id: string;
  name: string;
  platform: string;
  followers: number;
  description: string;
  topics: string[];
  isFollowed: boolean;
  influence: number;
  avatarUrl: string;
  username: string;
  reliability?: number;
  expertise?: string[];
  bio?: string;
  profileUrl?: string;
  isVerified?: boolean;
  assetsDiscussed?: string[];
}

export interface FinancialDataSource {
  id: string;
  name: string;
  type: string;
  url: string;
  description: string;
  reliability: number;
  isPaid: boolean;
  frequencyUpdate: string;
  imageUrl: string;
  languages: string[];
  categories: string[];
  isFeatured: boolean;
  rating: number;
  platform: string;
  category?: string | string[];
}

export type MarketSource = FinancialDataSource;

export interface EventReminder {
  eventId: string;
  userId: string;
  notificationTime: number;
  enabled: boolean;
}

export interface CustomEventData {
  title: string;
  date: string;
  importance: string;
  description: string;
  type: string;
  relatedAssets: string[];
  expectedImpact: string;
  source: string;
}

export type AddCustomEventFn = (assetId: string, eventData: CustomEventData) => Promise<MarketEvent>;
