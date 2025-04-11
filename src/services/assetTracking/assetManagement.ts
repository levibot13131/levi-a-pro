
import { toast } from 'sonner';
import { getAssetById } from '@/services/realTimeAssetService';
import { TrackedAsset } from './types';
import { getTrackedAssets, saveTrackedAssets } from './storage';

// Add a new asset to track
export const addTrackedAsset = (assetId: string): boolean => {
  const trackedAssets = getTrackedAssets();
  
  // Check if asset is already tracked
  if (trackedAssets.find(a => a.id === assetId)) {
    return false;
  }
  
  // Get asset details
  const asset = getAssetById(assetId);
  if (!asset) {
    return false;
  }
  
  // Add to tracked assets
  trackedAssets.push({
    id: asset.id,
    name: asset.name,
    symbol: asset.symbol,
    type: asset.type,
    price: asset.price,
    change24h: asset.change24h,
    priority: 'medium',
    alertsEnabled: true,
    lastUpdated: Date.now()
  });
  
  // Save to localStorage
  saveTrackedAssets(trackedAssets);
  
  // Show toast notification
  toast.success(`התחלת לעקוב אחרי ${asset.name}`, {
    description: 'הנכס התווסף לרשימת המעקב שלך'
  });
  
  return true;
};

// Remove asset from tracking
export const removeTrackedAsset = (assetId: string): boolean => {
  let trackedAssets = getTrackedAssets();
  
  // Check if asset is tracked
  if (!trackedAssets.find(a => a.id === assetId)) {
    return false;
  }
  
  // Remove from tracked assets
  trackedAssets = trackedAssets.filter(a => a.id !== assetId);
  
  // Save to localStorage
  saveTrackedAssets(trackedAssets);
  
  // Show toast notification
  toast.info('הנכס הוסר מרשימת המעקב שלך');
  
  return true;
};

// Update tracked asset properties
export const updateTrackedAsset = (assetId: string, updates: Partial<TrackedAsset>): boolean => {
  const trackedAssets = getTrackedAssets();
  
  // Find asset index
  const assetIndex = trackedAssets.findIndex(a => a.id === assetId);
  if (assetIndex === -1) {
    return false;
  }
  
  // Update asset
  trackedAssets[assetIndex] = {
    ...trackedAssets[assetIndex],
    ...updates,
    lastUpdated: Date.now()
  };
  
  // Save to localStorage
  saveTrackedAssets(trackedAssets);
  
  return true;
};

// Pin/unpin asset to top of list
export const toggleAssetPin = (assetId: string): boolean => {
  const trackedAssets = getTrackedAssets();
  
  // Find asset
  const assetIndex = trackedAssets.findIndex(a => a.id === assetId);
  if (assetIndex === -1) {
    return false;
  }
  
  // Toggle pin status
  trackedAssets[assetIndex].isPinned = !trackedAssets[assetIndex].isPinned;
  
  // Save to localStorage
  saveTrackedAssets(trackedAssets);
  
  return true;
};

// Set priority for asset
export const setAssetPriority = (assetId: string, priority: 'high' | 'medium' | 'low'): boolean => {
  return updateTrackedAsset(assetId, { priority });
};

// Toggle alerts for asset
export const toggleAssetAlerts = (assetId: string): boolean => {
  const trackedAssets = getTrackedAssets();
  
  // Find asset
  const assetIndex = trackedAssets.findIndex(a => a.id === assetId);
  if (assetIndex === -1) {
    return false;
  }
  
  // Toggle alerts
  trackedAssets[assetIndex].alertsEnabled = !trackedAssets[assetIndex].alertsEnabled;
  
  // Save to localStorage
  saveTrackedAssets(trackedAssets);
  
  return true;
};
