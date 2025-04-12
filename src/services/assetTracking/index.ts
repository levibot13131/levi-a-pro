
import { Asset } from '@/types/asset';
import { TrackedAsset, TRACKED_ASSETS_KEY } from './types';

// Helper to initialize tracked assets for first time users
export const initializeTrackedAssets = (): void => {
  const existingAssets = localStorage.getItem(TRACKED_ASSETS_KEY);
  
  if (!existingAssets) {
    // Initialize with some default tracked assets
    const defaultAssets: TrackedAsset[] = [
      {
        id: 'bitcoin',
        name: 'Bitcoin',
        symbol: 'BTC',
        type: 'crypto',
        price: 50000,
        change24h: 2.5,
        priority: 'high',
        alertsEnabled: true,
        lastUpdated: Date.now(),
        technicalSignal: 'buy',
        sentimentSignal: 'bullish',
        isPinned: true,
        marketCap: 1000000000000,
        volume24h: 30000000000,
        rank: 1
      },
      {
        id: 'ethereum',
        name: 'Ethereum',
        symbol: 'ETH',
        type: 'crypto',
        price: 3500,
        change24h: 1.8,
        priority: 'high',
        alertsEnabled: true,
        lastUpdated: Date.now(),
        technicalSignal: 'neutral',
        sentimentSignal: 'neutral',
        isPinned: false,
        marketCap: 400000000000,
        volume24h: 18000000000,
        rank: 2
      }
    ];
    
    localStorage.setItem(TRACKED_ASSETS_KEY, JSON.stringify(defaultAssets));
  }
};

// Get all tracked assets
export const getTrackedAssets = (): TrackedAsset[] => {
  const assetsJson = localStorage.getItem(TRACKED_ASSETS_KEY) || '[]';
  return JSON.parse(assetsJson);
};

// Get filtered tracked assets
export const getFilteredTrackedAssets = (
  marketType?: string,
  priority?: 'high' | 'medium' | 'low',
  signal?: 'buy' | 'sell' | 'neutral'
): TrackedAsset[] => {
  let assets = getTrackedAssets();
  
  if (marketType && marketType !== 'all') {
    assets = assets.filter(asset => asset.type === marketType);
  }
  
  if (priority && priority !== 'all') {
    assets = assets.filter(asset => asset.priority === priority);
  }
  
  if (signal && signal !== 'all') {
    assets = assets.filter(asset => asset.technicalSignal === signal);
  }
  
  return assets;
};

// The other asset tracking functions would go here...
// The implementation of these functions will depend on the actual app requirements
