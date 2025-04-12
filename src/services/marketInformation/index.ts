
import { MarketInfluencer, FinancialDataSource, MarketEvent, EventReminder, CustomEventData } from '@/types/marketInformation';

// Mock sources data
const sources: FinancialDataSource[] = [];
const influencers: MarketInfluencer[] = [];
const events: MarketEvent[] = [];
const reminders: EventReminder[] = [];

// Get sources
export const getSources = (): FinancialDataSource[] => {
  return sources;
};

// Get influencers
export const getInfluencers = (): MarketInfluencer[] => {
  return influencers;
};

// Toggle source favorite
export const toggleSourceFavorite = (sourceId: string): boolean => {
  return true;
};

// Toggle influencer follow
export const toggleInfluencerFollow = (influencerId: string): boolean => {
  return true;
};

// Get upcoming market events
export const getUpcomingMarketEvents = (): MarketEvent[] => {
  return events;
};

// Set event reminder
export const setEventReminder = (eventId: string, notificationTime: number): boolean => {
  return true;
};

// Add custom event
export const addCustomEvent = async (assetId: string, eventData: CustomEventData): Promise<MarketEvent> => {
  const newEvent: MarketEvent = {
    id: `event_${Date.now()}`,
    ...eventData
  };
  events.push(newEvent);
  return newEvent;
};
