
import { TRACKED_ASSETS_KEY, TrackedAsset } from './types';
import { Asset } from '@/types/asset';
import { getTrackedAssets as getStoredAssets, saveTrackedAssets } from './storage';

// Get list of tracked assets from local storage
export const getTrackedAssets = async (): Promise<TrackedAsset[]> => {
  try {
    const storedData = localStorage.getItem(TRACKED_ASSETS_KEY);
    
    if (!storedData) {
      return [];
    }
    
    const assets: TrackedAsset[] = JSON.parse(storedData);
    return assets;
  } catch (error) {
    console.error('Error getting tracked assets:', error);
    return [];
  }
};

// Get asset by ID (mock implementation)
export const getAssetById = async (assetId: string): Promise<Asset | null> => {
  try {
    // Mock implementation - in a real app, you would fetch this from an API
    return {
      id: assetId,
      name: `Asset ${assetId}`,
      symbol: assetId.toUpperCase(),
      type: 'crypto',
      price: 1000,
      change24h: 0.5,
      marketCap: 1000000,
      volume24h: 500000,
      rank: 1
    };
  } catch (error) {
    console.error('Error getting asset by ID:', error);
    return null;
  }
};

// Toggle pin status of an asset
export const toggleAssetPin = async (assetId: string): Promise<boolean> => {
  try {
    const existingAssets = getStoredAssets();
    const updatedAssets = existingAssets.map(asset =>
      asset.id === assetId ? { ...asset, isPinned: !asset.isPinned } : asset
    );
    saveTrackedAssets(updatedAssets);
    return true;
  } catch (error) {
    console.error('Error toggling asset pin:', error);
    return false;
  }
};

// Toggle alerts for an asset
export const toggleAssetAlerts = async (assetId: string): Promise<boolean> => {
  try {
    const existingAssets = getStoredAssets();
    const updatedAssets = existingAssets.map(asset =>
      asset.id === assetId ? { ...asset, alertsEnabled: !asset.alertsEnabled } : asset
    );
    saveTrackedAssets(updatedAssets);
    return true;
  } catch (error) {
    console.error('Error toggling asset alerts:', error);
    return false;
  }
};

// Set priority for an asset
export const setAssetPriority = async (assetId: string, priority: 'high' | 'medium' | 'low'): Promise<boolean> => {
  try {
    const existingAssets = getStoredAssets();
    const updatedAssets = existingAssets.map(asset =>
      asset.id === assetId ? { ...asset, priority } : asset
    );
    saveTrackedAssets(updatedAssets);
    return true;
  } catch (error) {
    console.error('Error setting asset priority:', error);
    return false;
  }
};

export { saveTrackedAssets };
