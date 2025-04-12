
import { Asset } from '@/types/asset';
import { TrackedAsset, TRACKED_ASSETS_KEY } from './types';
import { getTrackedAssets as getTrackedAssetsFromStorage, saveTrackedAssets } from './storage';

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

// Add a new asset to tracking list
export const addTrackedAsset = async (assetId: string): Promise<boolean> => {
  try {
    const existingAssets = getTrackedAssets();
    
    // Check if asset is already being tracked
    if (existingAssets.some(a => a.id === assetId)) {
      return false;
    }
    
    // Get asset details from the API
    // In a real implementation, you would fetch this from your API
    // For now, we'll create a simple mock asset
    const asset: TrackedAsset = {
      id: assetId,
      name: `Asset ${assetId}`,
      symbol: assetId.substring(0, 4).toUpperCase(),
      type: 'crypto',
      price: Math.random() * 10000,
      change24h: (Math.random() - 0.5) * 10,
      priority: 'medium',
      alertsEnabled: false,
      lastUpdated: Date.now(),
      technicalSignal: 'neutral',
      sentimentSignal: 'neutral',
      isPinned: false
    };
    
    // Add to list and save
    const updatedAssets = [...existingAssets, asset];
    saveTrackedAssets(updatedAssets);
    
    return true;
  } catch (error) {
    console.error('Error adding asset to tracking:', error);
    return false;
  }
};

// Remove an asset from tracking list
export const removeTrackedAsset = async (assetId: string): Promise<boolean> => {
  try {
    const existingAssets = getTrackedAssets();
    const updatedAssets = existingAssets.filter(a => a.id !== assetId);
    saveTrackedAssets(updatedAssets);
    return true;
  } catch (error) {
    console.error('Error removing asset from tracking:', error);
    return false;
  }
};

// Update asset details
export const updateTrackedAsset = async (asset: Asset): Promise<boolean> => {
  try {
    const existingAssets = getTrackedAssets();
    const updatedAssets = existingAssets.map(trackedAsset =>
      trackedAsset.id === asset.id ? { 
        ...trackedAsset, 
        price: asset.price, 
        change24h: asset.change24h,
        lastUpdated: Date.now()
      } : trackedAsset
    );
    saveTrackedAssets(updatedAssets);
    return true;
  } catch (error) {
    console.error('Error updating tracked asset:', error);
    return false;
  }
};

// Real-time asset tracking system
let trackingInterval: number | null = null;
const TRACKING_INTERVAL_MS = 5000; // 5 seconds

// Start real-time asset tracking
export const startAssetTracking = (): void => {
  if (trackingInterval) {
    return; // Already tracking
  }
  
  // Set up periodic tracking (mock implementation)
  trackingInterval = window.setInterval(() => {
    const assets = getTrackedAssets();
    
    // In a real implementation, you would fetch real-time data
    // Here we'll just update the prices with random changes
    const updatedAssets = assets.map(asset => ({
      ...asset,
      price: asset.price * (1 + (Math.random() - 0.48) * 0.02), // Small random change
      change24h: asset.change24h + (Math.random() - 0.5) * 0.2, // Small random change
      lastUpdated: Date.now()
    }));
    
    saveTrackedAssets(updatedAssets);
  }, TRACKING_INTERVAL_MS);
  
  console.log('Real-time asset tracking started');
};

// Stop real-time asset tracking
export const stopAssetTracking = (): void => {
  if (trackingInterval) {
    window.clearInterval(trackingInterval);
    trackingInterval = null;
    console.log('Real-time asset tracking stopped');
  }
};

// Check if tracking is active
export const isTrackingActive = (): boolean => {
  return trackingInterval !== null;
};
