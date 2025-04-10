
import { toast } from "sonner";
import { MarketEvent } from '@/types/marketInformation';
import { MARKET_EVENTS } from './mockData';

export const getUpcomingMarketEvents = async (days: number = 30): Promise<MarketEvent[]> => {
  return new Promise(resolve => {
    const now = new Date();
    const futureDate = new Date();
    futureDate.setDate(now.getDate() + days);
    
    const filteredEvents = MARKET_EVENTS.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate >= now && eventDate <= futureDate;
    });
    
    setTimeout(() => resolve(filteredEvents), 700);
  });
};

export const setEventReminder = async (eventId: string, reminder: boolean): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  const event = MARKET_EVENTS.find(e => e.id === eventId);
  if (event) {
    event.reminder = reminder;
    toast.success(`Reminder ${reminder ? 'set' : 'removed'} for "${event.title}"`);
  }
};

// Function to add custom market event
export const addCustomEvent = async (event: Omit<MarketEvent, 'id'>): Promise<MarketEvent> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const newEvent: MarketEvent = {
    ...event,
    id: `event-custom-${Date.now()}`
  };
  MARKET_EVENTS.push(newEvent);
  toast.success(`Added new event: ${newEvent.title}`);
  return newEvent;
};

// Time range options for events
export const timeRangeOptions = [
  { value: '1', label: 'יום אחרון' },
  { value: '7', label: 'שבוע אחרון' },
  { value: '30', label: 'חודש אחרון' },
  { value: '90', label: 'שלושה חודשים' },
];
