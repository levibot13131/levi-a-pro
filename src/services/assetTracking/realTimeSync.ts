
import { getTrackedAssets, saveTrackedAssets } from './storage';
import { getAssetById } from '@/services/realTimeAssetService';

// Active tracking flag
let trackingActive = false;
let trackingInterval: ReturnType<typeof setInterval> | null = null;

// Start asset tracking
export const startAssetTracking = (): boolean => {
  if (trackingActive) return false;
  
  // Start interval to update asset prices
  trackingInterval = setInterval(() => {
    updateTrackedAssetPrices();
  }, 5000); // Update every 5 seconds
  
  trackingActive = true;
  console.log('Real-time asset tracking started');
  return true;
};

// Stop asset tracking
export const stopAssetTracking = (): boolean => {
  if (!trackingActive || !trackingInterval) return false;
  
  clearInterval(trackingInterval);
  trackingInterval = null;
  trackingActive = false;
  
  console.log('Real-time asset tracking stopped');
  return true;
};

// Check if tracking is active
export const isTrackingActive = (): boolean => {
  return trackingActive;
};

// Update tracked asset prices
const updateTrackedAssetPrices = (): void => {
  const trackedAssets = getTrackedAssets();
  let updatedCount = 0;
  
  const updatedAssets = trackedAssets.map(asset => {
    const liveAsset = getAssetById(asset.id);
    
    if (liveAsset) {
      updatedCount++;
      return {
        ...asset,
        price: liveAsset.price,
        change24h: liveAsset.change24h,
        lastUpdated: Date.now()
      };
    }
    
    return asset;
  });
  
  if (updatedCount > 0) {
    saveTrackedAssets(updatedAssets);
    console.log(`Updated ${updatedCount} tracked assets with real-time data`);
  }
};
