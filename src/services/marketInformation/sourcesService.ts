
import { FinancialDataSource } from '@/types/marketInformation';

let sources: FinancialDataSource[] = [
  {
    id: '1',
    name: 'CoinDesk',
    type: 'news',
    url: 'https://coindesk.com',
    description: 'Cryptocurrency news site',
    reliability: 85,
    isPaid: false,
    frequencyUpdate: 'daily',
    imageUrl: 'https://example.com/coindesk.jpg',
    languages: ['en'],
    categories: ['crypto', 'blockchain', 'news'],
    isFeatured: true,
    rating: 4.2,
    platform: 'web',
    category: 'crypto'
  },
  {
    id: '2',
    name: 'TradingView',
    type: 'charts',
    url: 'https://tradingview.com',
    description: 'Advanced financial visualization platform',
    reliability: 90,
    isPaid: true,
    frequencyUpdate: 'realtime',
    imageUrl: 'https://example.com/tradingview.jpg',
    languages: ['en', 'es', 'he'],
    categories: ['analysis', 'charts', 'trading'],
    isFeatured: true,
    rating: 4.8,
    platform: 'web',
    category: 'charts'
  },
  {
    id: '3',
    name: 'Bloomberg',
    type: 'news',
    url: 'https://bloomberg.com',
    description: 'Financial news and data provider',
    reliability: 95,
    isPaid: true,
    frequencyUpdate: 'hourly',
    imageUrl: 'https://example.com/bloomberg.jpg',
    languages: ['en'],
    categories: ['macro', 'stocks', 'news'],
    isFeatured: false,
    rating: 4.5,
    platform: 'web',
    category: 'finance'
  }
];

// Toggle favorite status for a source
export const toggleSourceFavorite = (id: string): boolean => {
  // In a real app, this would update a user's favorites
  return true;
};

// Get all sources
export const getSources = (): FinancialDataSource[] => {
  return [...sources];
};

// Get source by ID
export const getSourceById = (id: string): FinancialDataSource | undefined => {
  return sources.find(source => source.id === id);
};

// Get sources by type
export const getSourcesByType = (type: string): FinancialDataSource[] => {
  return sources.filter(source => source.type === type);
};
