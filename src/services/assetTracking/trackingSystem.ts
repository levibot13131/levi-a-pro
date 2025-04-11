
import { TrackedAsset } from './types';
import { getTrackedAssets, saveTrackedAssets } from './storage';
import { toast } from 'sonner';

// Initialize the tracking system
export const initializeTrackingSystem = () => {
  console.log('Tracking system initialized');
  // Implementation details would be added here
};

// Search tracked assets
export const searchTrackedAssets = (
  query: string,
  market?: string
): TrackedAsset[] => {
  const assets = getTrackedAssets();
  
  if (!query && !market) return assets;
  
  const normalizedQuery = query.toLowerCase().trim();
  
  return assets.filter(asset => {
    // Apply market filter if provided
    if (market && market !== 'all' && asset.type !== market) {
      return false;
    }
    
    // If no query, just apply market filter
    if (!normalizedQuery) return true;
    
    // Search by name, symbol or notes
    return (
      asset.name.toLowerCase().includes(normalizedQuery) ||
      asset.symbol.toLowerCase().includes(normalizedQuery) ||
      (asset.notes && asset.notes.toLowerCase().includes(normalizedQuery))
    );
  });
};

// Toggle pin status for an asset
export const togglePinAsset = (assetId: string): void => {
  const assets = getTrackedAssets();
  const assetIndex = assets.findIndex(a => a.id === assetId);
  
  if (assetIndex !== -1) {
    assets[assetIndex].isPinned = !assets[assetIndex].isPinned;
    saveTrackedAssets(assets);
    
    toast.success(
      assets[assetIndex].isPinned 
        ? `${assets[assetIndex].name} נעוץ בראש הרשימה` 
        : `${assets[assetIndex].name} שוחרר מנעיצה`
    );
  }
};

// Bulk update tracked assets
export const bulkUpdateTrackedAssets = (
  assetIds: string[],
  updates: Partial<TrackedAsset>
): void => {
  const assets = getTrackedAssets();
  let updatedCount = 0;
  
  const updatedAssets = assets.map(asset => {
    if (assetIds.includes(asset.id)) {
      updatedCount++;
      return { ...asset, ...updates };
    }
    return asset;
  });
  
  saveTrackedAssets(updatedAssets);
  
  if (updatedCount > 0) {
    toast.success(`עודכנו ${updatedCount} נכסים`);
  }
};

// Get asset statistics
export const getAssetTrackingStats = () => {
  const assets = getTrackedAssets();
  
  return {
    total: assets.length,
    byMarket: {
      crypto: assets.filter(a => a.type === 'crypto').length,
      stocks: assets.filter(a => a.type === 'stocks').length,
      forex: assets.filter(a => a.type === 'forex').length,
      commodities: assets.filter(a => a.type === 'commodities').length,
    },
    byPriority: {
      high: assets.filter(a => a.priority === 'high').length,
      medium: assets.filter(a => a.priority === 'medium').length,
      low: assets.filter(a => a.priority === 'low').length,
    },
    withAlerts: assets.filter(a => a.alertsEnabled).length,
    pinned: assets.filter(a => a.isPinned).length
  };
};
