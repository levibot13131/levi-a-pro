import { getAllAssets } from '@/services/realTimeAssetService';
import { TrackedAsset, MARKETS, MAX_ASSETS_PER_MARKET } from './types';
import { getTrackedAssets, saveTrackedAssets } from './storage';

// Initialize tracked assets with defaults for each market
export const initializeTrackedAssets = (): TrackedAsset[] => {
  let trackedAssets = getTrackedAssets();
  
  // If we already have tracked assets, don't override
  if (trackedAssets.length > 0) {
    return trackedAssets;
  }
  
  // Otherwise initialize with top assets from each market
  trackedAssets = [];
  
  const allAssets = getAllAssets();
  
  // Group by market
  const assetsByMarket: Record<string, any[]> = {};
  allAssets.forEach(asset => {
    if (!assetsByMarket[asset.type]) {
      assetsByMarket[asset.type] = [];
    }
    assetsByMarket[asset.type].push(asset);
  });
  
  // Take top assets from each market
  MARKETS.forEach(market => {
    const marketAssets = assetsByMarket[market] || [];
    const topAssets = marketAssets
      .sort((a, b) => b.marketCap - a.marketCap)
      .slice(0, MAX_ASSETS_PER_MARKET);
      
    topAssets.forEach(asset => {
      trackedAssets.push({
        id: asset.id,
        name: asset.name,
        symbol: asset.symbol,
        type: asset.type,
        price: asset.price,
        change24h: asset.change24h,
        priority: 'medium',
        alertsEnabled: true,
        lastUpdated: Date.now(),
        isPinned: false
      });
    });
  });
  
  // Save to localStorage
  saveTrackedAssets(trackedAssets);
  
  return trackedAssets;
};
