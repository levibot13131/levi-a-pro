
import { MarketEvent } from '@/types/asset';
import { MARKET_EVENTS } from './mockData';

export const getMarketEvents = (filter?: string): MarketEvent[] => {
  if (!filter || filter === 'all') {
    return [...MARKET_EVENTS];
  }
  
  return MARKET_EVENTS.filter(event => 
    event.category === filter || 
    event.importance === filter ||
    event.relatedAssets.includes(filter)
  );
};

export const getUpcomingEvents = (days: number = 7): MarketEvent[] => {
  const today = new Date();
  const futureDate = new Date();
  futureDate.setDate(today.getDate() + days);
  
  return MARKET_EVENTS.filter(event => {
    const eventDate = new Date(event.date);
    return eventDate >= today && eventDate <= futureDate;
  });
};

export const getEventById = (id: string): MarketEvent | undefined => {
  return MARKET_EVENTS.find(event => event.id === id);
};

export const getRelatedEvents = (assetId: string): MarketEvent[] => {
  return MARKET_EVENTS.filter(event => 
    event.relatedAssets.includes(assetId)
  ).slice(0, 5);
};
