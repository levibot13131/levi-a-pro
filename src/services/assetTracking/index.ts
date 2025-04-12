
import { Asset } from '@/types/asset';
import { 
  getTrackedAssets, 
  saveTrackedAssets,
  getAssetById, 
  toggleAssetPin, 
  toggleAssetAlerts,
  setAssetPriority
} from './assetManagement';
import { TrackedAsset } from './types';

export { 
  getTrackedAssets, 
  toggleAssetPin, 
  toggleAssetAlerts, 
  setAssetPriority 
};

export const addTrackedAsset = async (asset: Asset): Promise<boolean> => {
  try {
    const existingAssets = getTrackedAssets();
    
    // Check if asset is already tracked
    if (existingAssets.some(a => a.id === asset.id)) {
      return false;
    }
    
    const newTrackedAsset: TrackedAsset = {
      id: asset.id,
      name: asset.name,
      symbol: asset.symbol,
      addedAt: Date.now(),
      isPinned: false,
      alertsEnabled: false,
      lastChecked: Date.now(),
      priceAtAdd: asset.price,
      priority: 'medium',
      notes: '',
      tags: [],
      status: 'active',
      type: 'crypto'
    };
    
    saveTrackedAssets([...existingAssets, newTrackedAsset]);
    return true;
  } catch (error) {
    console.error('Error adding tracked asset:', error);
    return false;
  }
};

export const removeTrackedAsset = async (assetId: string): Promise<boolean> => {
  try {
    const existingAssets = getTrackedAssets();
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
    const existingAssets = getTrackedAssets();
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

export const getFilteredTrackedAssets = (
  priorityFilter: string,
  statusFilter: string,
  typeFilter: string
): TrackedAsset[] => {
  try {
    const assets = getTrackedAssets();
    
    return assets.filter(asset => {
      const matchesPriority = priorityFilter === 'all' || asset.priority === priorityFilter;
      const matchesStatus = statusFilter === 'all' || asset.status === statusFilter;
      const matchesType = typeFilter === 'all' || asset.type === typeFilter;
      
      return matchesPriority && matchesStatus && matchesType;
    });
  } catch (error) {
    console.error('Error getting filtered tracked assets:', error);
    return [];
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
      const trackedAssets = getTrackedAssets();
      
      for (const asset of trackedAssets) {
        const currentAsset = await getAssetById(asset.id);
        if (currentAsset) {
          // Update last checked timestamp
          updateTrackedAsset({
            ...asset,
            lastChecked: Date.now()
          });
        }
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

export const initializeTrackedAssets = (): void => {
  // Check if tracked assets exist in storage, if not initialize with empty array
  const assets = getTrackedAssets();
  if (!assets || assets.length === 0) {
    saveTrackedAssets([]);
  }
};
