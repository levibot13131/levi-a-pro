
import { getAssetById } from '@/services/realTimeAssetService';
import { TRACKED_ASSETS_KEY, TrackedAsset } from './types';
import { Asset } from '@/types/asset';

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

// Add a new asset to tracking list
export const addTrackedAsset = async (assetId: string): Promise<boolean> => {
  try {
    const existingAssets = await getTrackedAssets();
    
    // Check if asset is already being tracked
    if (existingAssets.some(a => a.id === assetId)) {
      return false;
    }
    
    // Get asset details from the API
    const asset = await getAssetById(assetId);
    
    if (!asset) {
      throw new Error(`Asset not found: ${assetId}`);
    }
    
    // Convert Asset to TrackedAsset
    const trackedAsset: TrackedAsset = {
      id: asset.id,
      name: asset.name,
      symbol: asset.symbol,
      type: asset.type as 'crypto' | 'stocks' | 'forex' | 'commodities',
      price: asset.price,
      change24h: asset.change24h,
      priority: 'medium',
      alertsEnabled: false,
      lastUpdated: Date.now(),
      marketCap: asset.marketCap,
      volume24h: asset.volume24h,
      rank: asset.rank
    };
    
    // Add to list and save
    const updatedAssets = [...existingAssets, trackedAsset];
    localStorage.setItem(TRACKED_ASSETS_KEY, JSON.stringify(updatedAssets));
    
    return true;
  } catch (error) {
    console.error('Error adding asset to tracking:', error);
    return false;
  }
};

// Remove an asset from tracking list
export const removeTrackedAsset = async (assetId: string): Promise<boolean> => {
  try {
    const existingAssets = await getTrackedAssets();
    const updatedAssets = existingAssets.filter(a => a.id !== assetId);
    localStorage.setItem(TRACKED_ASSETS_KEY, JSON.stringify(updatedAssets));
    return true;
  } catch (error) {
    console.error('Error removing asset from tracking:', error);
    return false;
  }
};

// Toggle pin status of an asset
export const toggleAssetPin = async (assetId: string): Promise<boolean> => {
  try {
    const existingAssets = await getTrackedAssets();
    const updatedAssets = existingAssets.map(asset =>
      asset.id === assetId ? { ...asset, isPinned: !asset.isPinned } : asset
    );
    localStorage.setItem(TRACKED_ASSETS_KEY, JSON.stringify(updatedAssets));
    return true;
  } catch (error) {
    console.error('Error toggling asset pin:', error);
    return false;
  }
};

// Toggle alerts for an asset
export const toggleAssetAlerts = async (assetId: string): Promise<boolean> => {
  try {
    const existingAssets = await getTrackedAssets();
    const updatedAssets = existingAssets.map(asset =>
      asset.id === assetId ? { ...asset, alertsEnabled: !asset.alertsEnabled } : asset
    );
    localStorage.setItem(TRACKED_ASSETS_KEY, JSON.stringify(updatedAssets));
    return true;
  } catch (error) {
    console.error('Error toggling asset alerts:', error);
    return false;
  }
};

// Set priority for an asset
export const setAssetPriority = async (assetId: string, priority: 'high' | 'medium' | 'low'): Promise<boolean> => {
  try {
    const existingAssets = await getTrackedAssets();
    const updatedAssets = existingAssets.map(asset =>
      asset.id === assetId ? { ...asset, priority } : asset
    );
    localStorage.setItem(TRACKED_ASSETS_KEY, JSON.stringify(updatedAssets));
    return true;
  } catch (error) {
    console.error('Error setting asset priority:', error);
    return false;
  }
};

// Update asset details (price, change)
export const updateTrackedAsset = async (asset: Asset): Promise<boolean> => {
  try {
    const existingAssets = await getTrackedAssets();
    const updatedAssets = existingAssets.map(trackedAsset =>
      trackedAsset.id === asset.id ? { 
        ...trackedAsset, 
        price: asset.price, 
        change24h: asset.change24h,
        lastUpdated: Date.now()
      } : trackedAsset
    );
    localStorage.setItem(TRACKED_ASSETS_KEY, JSON.stringify(updatedAssets));
    return true;
  } catch (error) {
    console.error('Error updating tracked asset:', error);
    return false;
  }
};
