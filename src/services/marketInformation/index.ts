
import { MarketInfluencer, FinancialDataSource, MarketEvent, EventReminder, CustomEventData } from '@/types/marketInformation';
import { MARKET_EVENTS, MARKET_INFLUENCERS, FINANCIAL_DATA_SOURCES } from './mockData';

// Mock sources data - use our mock data from mockData.ts
const sources = FINANCIAL_DATA_SOURCES;
const influencers = MARKET_INFLUENCERS;
const events = MARKET_EVENTS;
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
export const setEventReminder = (eventId: string, notificationTime: number = 0): boolean => {
  const eventIndex = events.findIndex(e => e.id === eventId);
  if (eventIndex >= 0) {
    const reminderExists = reminders.some(r => r.eventId === eventId);
    if (reminderExists) {
      // Toggle off
      const index = reminders.findIndex(r => r.eventId === eventId);
      reminders.splice(index, 1);
      events[eventIndex].reminder = false;
    } else {
      // Add new reminder
      reminders.push({
        eventId,
        userId: 'current-user',
        notificationTime,
        enabled: true
      });
      events[eventIndex].reminder = true;
    }
    return true;
  }
  return false;
};

// Add custom event
export const addCustomEvent = async (assetId: string, eventData: CustomEventData): Promise<MarketEvent> => {
  const newEvent: MarketEvent = {
    id: `event_${Date.now()}`,
    reminder: false,
    category: "custom",
    ...eventData
  };
  events.push(newEvent);
  return newEvent;
};

// Get event by id
export const getEventById = (eventId: string): MarketEvent | undefined => {
  return events.find(event => event.id === eventId);
};

// Get events by category
export const getEventsByCategory = (category: string): MarketEvent[] => {
  return events.filter(event => event.category === category);
};

// Get events by importance
export const getEventsByImportance = (importance: string): MarketEvent[] => {
  return events.filter(event => event.importance === importance);
};
