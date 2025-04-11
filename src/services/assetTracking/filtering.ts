
import { TrackedAsset } from './types';
import { getTrackedAssets } from './storage';

// Get all tracked assets with sorting and filtering
export const getFilteredTrackedAssets = (
  marketFilter?: string,
  priorityFilter?: 'high' | 'medium' | 'low',
  signalFilter?: 'buy' | 'sell' | 'bullish' | 'bearish'
): TrackedAsset[] => {
  let assets = getTrackedAssets();
  
  // Apply sorting by pinned status first
  assets = assets.sort((a, b) => {
    // Pinned assets come first
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    
    // Then sort by priority
    const priorityRank = { high: 0, medium: 1, low: 2 };
    return priorityRank[a.priority] - priorityRank[b.priority];
  });
  
  // Apply market filter
  if (marketFilter) {
    assets = assets.filter(asset => asset.type === marketFilter);
  }
  
  // Apply priority filter
  if (priorityFilter) {
    assets = assets.filter(asset => asset.priority === priorityFilter);
  }
  
  // Apply signal filter
  if (signalFilter) {
    if (signalFilter === 'buy' || signalFilter === 'sell') {
      assets = assets.filter(asset => asset.technicalSignal === signalFilter);
    } else if (signalFilter === 'bullish' || signalFilter === 'bearish') {
      assets = assets.filter(asset => asset.sentimentSignal === signalFilter);
    }
  }
  
  return assets;
};
