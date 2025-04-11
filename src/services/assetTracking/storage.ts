
import { TrackedAsset, TRACKED_ASSETS_KEY } from './types';

// Get tracked assets from localStorage
export const getTrackedAssets = (): TrackedAsset[] => {
  const storedAssets = localStorage.getItem(TRACKED_ASSETS_KEY);
  if (storedAssets) {
    return JSON.parse(storedAssets);
  }
  return [];
};

// Save tracked assets to localStorage
export const saveTrackedAssets = (assets: TrackedAsset[]): void => {
  localStorage.setItem(TRACKED_ASSETS_KEY, JSON.stringify(assets));
};
