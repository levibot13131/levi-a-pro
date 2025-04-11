
import { getTrackedAssets, saveTrackedAssets } from './storage';
import { getAssetById } from '@/services/realTimeAssetService';
import { toast } from 'sonner';
import { isTradingViewConnected } from '@/services/tradingView/tradingViewAuthService';

// Active tracking flag
let trackingActive = false;
let trackingInterval: ReturnType<typeof setInterval> | null = null;

// Last update timestamp
let lastUpdateTime = 0;

// Start asset tracking
export const startAssetTracking = (): boolean => {
  if (trackingActive) return false;
  
  // Start interval to update asset prices
  trackingInterval = setInterval(() => {
    updateTrackedAssetPrices();
  }, 5000); // Update every 5 seconds
  
  trackingActive = true;
  lastUpdateTime = Date.now();
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

// Get last update time
export const getLastUpdateTime = (): number => {
  return lastUpdateTime;
};

// Force an immediate update
export const forceUpdate = async (): Promise<number> => {
  const updatedCount = await updateTrackedAssetPrices();
  return updatedCount;
};

// Check if TradingView is the data source
export const isTradingViewDataSource = (): boolean => {
  return isTradingViewConnected();
};

// Update tracked asset prices
const updateTrackedAssetPrices = async (): Promise<number> => {
  const trackedAssets = getTrackedAssets();
  let updatedCount = 0;
  
  const updatedAssets = trackedAssets.map(asset => {
    const liveAsset = getAssetById(asset.id);
    
    if (liveAsset) {
      updatedCount++;
      
      // If change is significant, notify user
      const priceChange = Math.abs((liveAsset.price - asset.price) / asset.price * 100);
      if (priceChange > 2 && asset.alertsEnabled) {
        // Only notify for significant price movements (>2%)
        const direction = liveAsset.price > asset.price ? 'עלה' : 'ירד';
        toast.info(`${asset.name} ${direction} ב-${priceChange.toFixed(1)}%`, {
          description: `מחיר קודם: $${asset.price.toFixed(2)}, מחיר חדש: $${liveAsset.price.toFixed(2)}`
        });
      }
      
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
    lastUpdateTime = Date.now();
    console.log(`Updated ${updatedCount} tracked assets with real-time data`);
  }
  
  return updatedCount;
};

// Initialize tracking on module load if not already running
if (!trackingActive) {
  startAssetTracking();
}
