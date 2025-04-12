
import { MarketSource } from '@/types/market';

let sources: MarketSource[] = [];

// Initialize demo data
const initializeSources = () => {
  sources = [
    // Sample sources data
    {
      id: '1',
      name: 'CoinDesk',
      type: 'news',
      url: 'https://coindesk.com',
      description: 'Cryptocurrency news site',
      reliability: 85,
      isPremium: false,
      imageUrl: 'https://example.com/coindesk.jpg',
      apiAvailable: true,
      languages: ['en'],
      categories: ['crypto', 'blockchain', 'news']
    },
    // Add more sources here
  ];
  return sources;
};

// Toggle favorite status
export const toggleSourceFavorite = (id: string) => {
  // In a real app, this would update a user's favorites
  return true;
};

// Get all sources
export const getSources = () => {
  if (sources.length === 0) {
    initializeSources();
  }
  return sources;
};

// Get source by ID
export const getSourceById = (id: string) => {
  return sources.find(source => source.id === id);
};

// Get sources by type
export const getSourcesByType = (type: string) => {
  return sources.filter(source => source.type === type);
};

// Search sources
export const searchSources = (query: string) => {
  const lowerQuery = query.toLowerCase();
  return sources.filter(source => 
    source.name.toLowerCase().includes(lowerQuery) ||
    source.description.toLowerCase().includes(lowerQuery) ||
    source.categories.some(cat => cat.toLowerCase().includes(lowerQuery))
  );
};
