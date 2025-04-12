import { TrackedAsset } from '@/types/asset';

// מערך מוק של נכסים מעקב
const MOCK_TRACKED_ASSETS: TrackedAsset[] = [
  // ... keep existing code
];

// פונקציה חדשה - אתחול נכסים במעקב
export const initializeTrackedAssets = (): void => {
  console.log('Initializing tracked assets');
  // כאן היינו בדרך כלל מאתחלים את המערכת מהשרת או מהאחסון המקומי
};

// סינון של נכסים לפי קריטריונים
export const getFilteredTrackedAssets = (filter: string = 'all'): TrackedAsset[] => {
  if (filter === 'all') {
    return getTrackedAssets();
  } else if (filter === 'favorites') {
    return getTrackedAssets().filter(asset => asset.isFavorite);
  } else if (filter === 'alerts') {
    return getTrackedAssets().filter(asset => asset.alerts && asset.alerts.length > 0);
  } else if (filter.startsWith('type:')) {
    const type = filter.split(':')[1];
    return getTrackedAssets().filter(asset => asset.type === type);
  }
  return getTrackedAssets();
};

// פונקציות קיימות
export const getTrackedAssets = (): TrackedAsset[] => {
  // ... keep existing code
  return MOCK_TRACKED_ASSETS;
};

// Re-export from storage
export * from './storage';
// Export asset management functions
export { addTrackedAsset, removeTrackedAsset, updateTrackedAsset } from './assetManagement';
// Export realtime sync functions
export * from './realTimeSync';
// Export types
export * from './types';
