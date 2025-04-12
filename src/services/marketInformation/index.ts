
import { v4 as uuidv4 } from 'uuid';

// Mock implementation for market information services
export const getInfluencers = () => {
  return [
    {
      id: '1',
      name: 'Crypto Trader',
      description: 'Expert in cryptocurrency trading and analysis',
      platform: 'twitter',
      profileUrl: 'https://twitter.com/cryptotrader',
      avatarUrl: '',
      followers: 100000,
      assetsDiscussed: ['bitcoin', 'ethereum'],
      isVerified: true,
      isFollowing: false,
      lastPost: '2023-01-01T00:00:00Z'
    },
    {
      id: '2',
      name: 'Stock Analyzer',
      description: 'Professional stock market analyst',
      platform: 'youtube',
      profileUrl: 'https://youtube.com/stockanalyzer',
      avatarUrl: '',
      followers: 50000,
      assetsDiscussed: ['stocks', 'indices'],
      isVerified: true,
      isFollowing: true,
      lastPost: '2023-01-02T00:00:00Z'
    }
  ];
};

export const getSources = () => {
  return [
    {
      id: '1',
      name: 'Financial Times',
      type: 'news',
      description: 'Leading financial news source',
      url: 'https://ft.com',
      isFeatured: true,
      reliability: 5,
      categories: ['finance', 'markets']
    },
    {
      id: '2',
      name: 'Bloomberg',
      type: 'news',
      description: 'Business and markets news',
      url: 'https://bloomberg.com',
      isFeatured: true,
      reliability: 5,
      categories: ['finance', 'business']
    }
  ];
};

export const getUpcomingMarketEvents = () => {
  return [
    {
      id: '1',
      title: 'Fed Interest Rate Decision',
      description: 'Federal Reserve announcement on interest rates',
      date: '2023-03-15',
      time: '14:00',
      type: 'economic',
      expectedImpact: 'neutral',
      relatedAssets: ['USD', 'bonds'],
      source: 'Federal Reserve',
      link: 'https://federalreserve.gov'
    },
    {
      id: '2',
      title: 'Apple Earnings Report',
      description: 'Q1 2023 earnings announcement',
      date: '2023-01-26',
      time: '16:30',
      type: 'corporate',
      expectedImpact: 'positive',
      relatedAssets: ['AAPL', 'tech sector'],
      source: 'Apple Inc',
      link: 'https://investor.apple.com'
    }
  ];
};

export const toggleSourceFavorite = (sourceId: string) => {
  console.log('Toggled favorite for source:', sourceId);
  return true;
};

export const toggleInfluencerFollow = (influencerId: string) => {
  console.log('Toggled follow for influencer:', influencerId);
  return true;
};

export const setEventReminder = (eventId: string) => {
  console.log('Set reminder for event:', eventId);
  return true;
};
