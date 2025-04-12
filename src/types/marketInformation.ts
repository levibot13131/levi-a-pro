
export interface MarketInfluencer {
  id: string;
  name: string;
  username: string;
  platform: string;
  followers: number;
  description: string;
  assetsDiscussed: string[];
  reliability: number;
  expertise: string[];
  bio: string;
  profileUrl: string;
  isVerified: boolean;
  imageUrl?: string; // Added property
}

export interface FinancialDataSource {
  id: string;
  name: string;
  type: string;
  description: string;
  url: string;
  reliability: number;
  category: string | string[]; // Changed to accept both string and string[]
  rating: number;
  platform: string;
  isPaid: boolean;
  frequencyUpdate: string;
  languages: string[];
  isFeatured: boolean;
  categories: string[];
}

export interface MarketEvent {
  id: string;
  title: string;
  date: string;
  importance: string;
  description: string;
  type: string;
  relatedAssets: string[];
  expectedImpact: string;
  source: string;
  reminder: boolean; // Added property
  category?: string; // Added property
}

export interface EventReminder {
  eventId: string;
  userId: string;
  notificationTime: number;
  enabled: boolean;
}

// Function to add a custom event
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
