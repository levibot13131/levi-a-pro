import { MAX_ASSETS_PER_MARKET, TrackedAsset, TRACKED_ASSETS_KEY } from './types';
import { getTrackedAssets, saveTrackedAssets } from './storage';
import { getAssetById } from '@/services/realTimeAssetService';
import { toast } from 'sonner';

// Add an asset to the tracked assets list
export const addTrackedAsset = (assetId: string): boolean => {
  const trackedAssets = getTrackedAssets();
  
  // Check if asset is already being tracked
  if (trackedAssets.some(a => a.id === assetId)) {
    toast.error('הנכס כבר במעקב שלך');
    return false;
  }
  
  // Get asset details from the real-time service
  const asset = getAssetById(assetId);
  if (!asset) {
    toast.error('הנכס לא נמצא');
    return false;
  }
  
  // Check if we've reached the market limit
  const marketAssets = trackedAssets.filter(a => a.type === asset.type);
  if (marketAssets.length >= MAX_ASSETS_PER_MARKET) {
    toast.error(`הגעת למגבלת הנכסים המרבית (${MAX_ASSETS_PER_MARKET}) עבור ${asset.type}`);
    return false;
  }
  
  // Create tracked asset from the asset data
  const trackedAsset: TrackedAsset = {
    id: asset.id,
    name: asset.name,
    symbol: asset.symbol,
    type: asset.type,
    price: asset.price,
    change24h: asset.change24h,
    priority: 'medium', // Default priority
    alertsEnabled: false,
    lastUpdated: Date.now(),
    isPinned: false
  };
  
  // Add to tracked assets
  trackedAssets.push(trackedAsset);
  saveTrackedAssets(trackedAssets);
  
  toast.success(`${asset.name} נוסף למעקב שלך`);
  return true;
};

// Remove an asset from the tracked assets list
export const removeTrackedAsset = (assetId: string): boolean => {
  const trackedAssets = getTrackedAssets();
  const initialLength = trackedAssets.length;
  
  const updatedAssets = trackedAssets.filter(asset => asset.id !== assetId);
  
  if (updatedAssets.length === initialLength) {
    toast.error('הנכס לא נמצא במעקב שלך');
    return false;
  }
  
  saveTrackedAssets(updatedAssets);
  toast.success('הנכס הוסר מהמעקב שלך');
  return true;
};

// Toggle asset pin status
export const toggleAssetPin = (assetId: string): boolean => {
  const trackedAssets = getTrackedAssets();
  const assetIndex = trackedAssets.findIndex(a => a.id === assetId);
  
  if (assetIndex === -1) {
    toast.error('הנכס לא נמצא במעקב שלך');
    return false;
  }
  
  trackedAssets[assetIndex].isPinned = !trackedAssets[assetIndex].isPinned;
  saveTrackedAssets(trackedAssets);
  
  toast.success(
    trackedAssets[assetIndex].isPinned
      ? `${trackedAssets[assetIndex].name} נעוץ בראש הרשימה`
      : `${trackedAssets[assetIndex].name} הוסר מנעיצה`
  );
  
  return true;
};

// Toggle alerts for asset
export const toggleAssetAlerts = (assetId: string): boolean => {
  const trackedAssets = getTrackedAssets();
  const assetIndex = trackedAssets.findIndex(a => a.id === assetId);
  
  if (assetIndex === -1) {
    toast.error('הנכס לא נמצא במעקב שלך');
    return false;
  }
  
  trackedAssets[assetIndex].alertsEnabled = !trackedAssets[assetIndex].alertsEnabled;
  saveTrackedAssets(trackedAssets);
  
  toast.success(
    trackedAssets[assetIndex].alertsEnabled
      ? `התראות הופעלו עבור ${trackedAssets[assetIndex].name}`
      : `התראות בוטלו עבור ${trackedAssets[assetIndex].name}`
  );
  
  return true;
};

// Set asset priority
export const setAssetPriority = (
  assetId: string,
  priority: 'high' | 'medium' | 'low'
): boolean => {
  const trackedAssets = getTrackedAssets();
  const assetIndex = trackedAssets.findIndex(a => a.id === assetId);
  
  if (assetIndex === -1) {
    toast.error('הנכס לא נמצא במעקב שלך');
    return false;
  }
  
  trackedAssets[assetIndex].priority = priority;
  saveTrackedAssets(trackedAssets);
  
  const priorityText = priority === 'high' ? 'גבוהה' : priority === 'medium' ? 'בינונית' : 'נמוכה';
  toast.success(`העדיפות של ${trackedAssets[assetIndex].name} שונתה ל${priorityText}`);
  
  return true;
};

// Update tracked asset
export const updateTrackedAsset = (
  assetId: string,
  updates: Partial<TrackedAsset>
): boolean => {
  const trackedAssets = getTrackedAssets();
  const assetIndex = trackedAssets.findIndex(a => a.id === assetId);
  
  if (assetIndex === -1) {
    toast.error('הנכס לא נמצא במעקב שלך');
    return false;
  }
  
  trackedAssets[assetIndex] = { ...trackedAssets[assetIndex], ...updates };
  saveTrackedAssets(trackedAssets);
  return true;
};

// Export getTrackedAssets for use in other modules
export { getTrackedAssets } from './storage';
