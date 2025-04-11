
import { TrackedAsset } from './types';
import { getTrackedAssets } from './storage';

// Get filtered tracked assets
export const getFilteredTrackedAssets = (
  market?: string,
  priorityFilter?: 'high' | 'medium' | 'low',
  signalFilter?: 'buy' | 'sell' | 'neutral' | 'bullish' | 'bearish'
): TrackedAsset[] => {
  let assets = getTrackedAssets();
  
  // Sort: pinned first, then by priority, then by name
  assets.sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    const aPriority = priorityOrder[a.priority] || 1;
    const bPriority = priorityOrder[b.priority] || 1;
    
    if (aPriority !== bPriority) {
      return aPriority - bPriority;
    }
    
    return a.name.localeCompare(b.name);
  });
  
  // Apply market filter
  if (market && market !== 'all') {
    assets = assets.filter(asset => asset.type === market);
  }
  
  // Apply priority filter
  if (priorityFilter) {
    assets = assets.filter(asset => asset.priority === priorityFilter);
  }
  
  // Apply signal filter
  if (signalFilter) {
    if (['buy', 'sell', 'neutral'].includes(signalFilter)) {
      assets = assets.filter(asset => asset.technicalSignal === signalFilter);
    } else {
      assets = assets.filter(asset => asset.sentimentSignal === signalFilter);
    }
  }
  
  return assets;
};
