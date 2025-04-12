
// Mock implementations of market information services

export interface Source {
  id: string;
  name: string;
  type: string;
  description: string;
  url: string;
  reliability: number;
}

export interface Influencer {
  id: string;
  name: string;
  platform: string;
  followers: number;
  reliability: number;
  description: string;
  assetsDiscussed: string[];
}

export interface MarketEvent {
  id: string;
  title: string;
  date: string;
  importance: string;
  description: string;
  type: string;
}

export const getSources = () => {
  return [
    {
      id: 'source-1',
      name: 'CryptoNews',
      type: 'news',
      description: 'Leading cryptocurrency news site',
      url: 'https://cryptonews.com',
      reliability: 4
    },
    {
      id: 'source-2',
      name: 'TokenMetrics',
      type: 'data',
      description: 'Advanced crypto analytics platform',
      url: 'https://tokenmetrics.com',
      reliability: 5
    }
  ];
};

export const getInfluencers = () => {
  return [
    {
      id: 'influencer-1',
      name: 'Crypto Expert',
      platform: 'twitter',
      followers: 250000,
      reliability: 4,
      description: 'Cryptocurrency analyst and trader',
      assetsDiscussed: ['bitcoin', 'ethereum']
    },
    {
      id: 'influencer-2',
      name: 'Blockchain Guru',
      platform: 'youtube',
      followers: 500000,
      reliability: 3,
      description: 'Blockchain technology expert',
      assetsDiscussed: ['solana', 'cardano']
    }
  ];
};

export const getUpcomingMarketEvents = () => {
  return [
    {
      id: 'event-1',
      title: 'Bitcoin Halving',
      date: '2024-05-15',
      importance: 'high',
      description: 'Bitcoin mining reward halving event',
      type: 'protocol'
    },
    {
      id: 'event-2',
      title: 'Ethereum Conference',
      date: '2024-06-10',
      importance: 'medium',
      description: 'Annual Ethereum developer conference',
      type: 'conference'
    }
  ];
};

export const toggleSourceFavorite = (sourceId: string) => {
  console.log(`Toggled favorite for source: ${sourceId}`);
  return true;
};

export const toggleInfluencerFollow = (influencerId: string) => {
  console.log(`Toggled follow for influencer: ${influencerId}`);
  return true;
};

export const setEventReminder = (eventId: string) => {
  console.log(`Set reminder for event: ${eventId}`);
  return true;
};

export const addCustomEvent = (assetId: string, eventData: any) => {
  console.log(`Custom event added for ${assetId}:`, eventData);
  // In a real app, this would integrate with a database or other storage
  return {
    id: `event-${Date.now()}`,
    assetId,
    ...eventData,
    timestamp: Date.now()
  };
};

export const getMarketEvents = (assetId: string) => {
  // This would fetch events from a database or API
  return [
    {
      id: 'event-1',
      assetId,
      title: 'Network Upgrade',
      description: 'Major network upgrade completed successfully',
      date: '2023-06-15',
      impact: 'positive'
    },
    {
      id: 'event-2',
      assetId,
      title: 'Regulatory News',
      description: 'New regulations announced affecting the market',
      date: '2023-05-22',
      impact: 'negative'
    }
  ];
};
