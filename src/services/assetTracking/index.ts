
import { Asset } from '@/types/asset';
import { TrackedAsset, TRACKED_ASSETS_KEY } from './types';
import { getTrackedAssets as getTrackedAssetsFromStorage, saveTrackedAssets } from './storage';

export { 
  toggleAssetPin, 
  toggleAssetAlerts, 
  setAssetPriority 
} from './assetManagement';

// Export the main getTrackedAssets function
export const getTrackedAssets = async () => {
  return getTrackedAssetsFromStorage();
};

export const addTrackedAsset = async (asset: Asset | string): Promise<boolean> => {
  try {
    const existingAssets = await getTrackedAssetsFromStorage();
    
    // Handle both Asset object and string ID
    const assetId = typeof asset === 'string' ? asset : asset.id;
    
    // Check if asset is already tracked
    if (existingAssets.some(a => a.id === assetId)) {
      return false;
    }
    
    // Create tracked asset object based on input type
    let newTrackedAsset: TrackedAsset;
    
    if (typeof asset === 'string') {
      // Minimal asset when only ID is provided
      newTrackedAsset = {
        id: asset,
        name: `Asset ${asset}`, // Placeholder
        symbol: asset.toUpperCase(), // Placeholder
        type: 'crypto', // Default
        price: 0,
        change24h: 0,
        priority: 'medium',
        alertsEnabled: false,
        lastUpdated: Date.now(),
        isPinned: false,
        status: 'active',
        addedAt: Date.now(),
        lastChecked: Date.now(),
      };
    } else {
      // Full asset object is available
      newTrackedAsset = {
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
        rank: asset.rank,
        isPinned: false,
        status: 'active',
        addedAt: Date.now(),
        lastChecked: Date.now(),
      };
    }
    
    saveTrackedAssets([...existingAssets, newTrackedAsset]);
    return true;
  } catch (error) {
    console.error('Error adding tracked asset:', error);
    return false;
  }
};

export const removeTrackedAsset = async (assetId: string): Promise<boolean> => {
  try {
    const existingAssets = await getTrackedAssetsFromStorage();
    const updatedAssets = existingAssets.filter(asset => asset.id !== assetId);
    
    if (updatedAssets.length === existingAssets.length) {
      return false; // Asset not found
    }
    
    saveTrackedAssets(updatedAssets);
    return true;
  } catch (error) {
    console.error('Error removing tracked asset:', error);
    return false;
  }
};

export const updateTrackedAsset = async (updatedAsset: TrackedAsset): Promise<boolean> => {
  try {
    const existingAssets = await getTrackedAssetsFromStorage();
    const updatedAssets = existingAssets.map(asset => 
      asset.id === updatedAsset.id ? { ...asset, ...updatedAsset } : asset
    );
    
    saveTrackedAssets(updatedAssets);
    return true;
  } catch (error) {
    console.error('Error updating tracked asset:', error);
    return false;
  }
};

// Tracking active state
let trackingActive = false;
let trackingInterval: ReturnType<typeof setInterval> | null = null;

export const startAssetTracking = (intervalMs = 60000): void => {
  if (trackingActive) return;
  
  trackingActive = true;
  trackingInterval = setInterval(async () => {
    try {
      const trackedAssets = await getTrackedAssetsFromStorage();
      
      // Update asset data in local storage
      for (const asset of trackedAssets) {
        // In a real app, you would fetch current data from an API
        const updatedAsset: TrackedAsset = {
          ...asset,
          lastChecked: Date.now()
        };
        
        await updateTrackedAsset(updatedAsset);
      }
    } catch (error) {
      console.error('Error in asset tracking interval:', error);
    }
  }, intervalMs);
};

export const stopAssetTracking = (): void => {
  if (trackingInterval) {
    clearInterval(trackingInterval);
    trackingInterval = null;
  }
  trackingActive = false;
};

export const isTrackingActive = (): boolean => {
  return trackingActive;
};
