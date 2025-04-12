import { Asset } from '@/types/asset';
import { getAssets, getTrendingAssets } from '@/services/mockDataService';
import { toast } from 'sonner';

// Type for tracked assets
export interface TrackedAsset {
  id: string;
  name: string;
  symbol: string;
  type: 'crypto' | 'stocks' | 'forex' | 'commodities';
  price: number;
  change24h: number;
  priority: string;
  alertsEnabled: boolean;
  lastUpdated: number;
  isPinned: boolean;
}

// Storage key for auto watchlist
const AUTO_WATCHLIST_KEY = 'auto_watchlist_assets';
const AUTO_WATCHLIST_ENABLED_KEY = 'auto_watchlist_enabled';

/**
 * Sort assets by trading volume (descending)
 */
export const sortAssetsByVolume = (assets: Asset[]): Asset[] => {
  return [...assets].sort((a, b) => {
    // Use volume24h if available, otherwise use a default comparison
    const volumeA = (a as any).volume24h || (a as any).volume || 0;
    const volumeB = (b as any).volume24h || (b as any).volume || 0;
    return volumeB - volumeA;
  });
};

/**
 * Create an auto watchlist of top assets
 */
export const createAutoWatchlist = async (count: number = 10): Promise<TrackedAsset[]> => {
  try {
    // Get trending assets first
    const trendingAssets = await getTrendingAssets(count);
    
    // If we don't have enough trending assets, get some regular assets
    let assetsToTrack: Asset[] = [...trendingAssets];
    if (assetsToTrack.length < count) {
      const regularAssets = await getAssets();
      const sortedAssets = sortAssetsByVolume(regularAssets);
      
      // Add more assets until we reach the desired count
      assetsToTrack = [
        ...assetsToTrack,
        ...sortedAssets.filter(asset => 
          !assetsToTrack.some(a => a.id === asset.id)
        )
      ].slice(0, count);
    }
    
    // Convert to TrackedAsset format
    const trackedAssets: TrackedAsset[] = assetsToTrack.map(asset => ({
      id: asset.id,
      name: asset.name,
      symbol: asset.symbol,
      type: asset.type as 'crypto' | 'stocks' | 'forex' | 'commodities',
      price: asset.price,
      change24h: asset.change24h || 0,
      priority: "high",
      alertsEnabled: true,
      lastUpdated: Date.now(),
      isPinned: false
    }));
    
    // Save to localStorage
    saveAutoWatchlist(trackedAssets);
    
    return trackedAssets;
  } catch (error) {
    console.error('Error creating auto watchlist:', error);
    toast.error('שגיאה ביצירת רשימת מעקב אוטומטית', {
      description: 'לא ניתן היה ליצור רשימת מעקב אוטומטית'
    });
    return [];
  }
};

/**
 * Save auto watchlist to localStorage
 */
export const saveAutoWatchlist = (assets: TrackedAsset[]): void => {
  localStorage.setItem(AUTO_WATCHLIST_KEY, JSON.stringify(assets));
};

/**
 * Get auto watchlist from localStorage
 */
export const getAutoWatchlist = (): TrackedAsset[] => {
  try {
    const savedAssets = localStorage.getItem(AUTO_WATCHLIST_KEY);
    if (!savedAssets) return [];
    
    const parsedAssets = JSON.parse(savedAssets);
    return Array.isArray(parsedAssets) ? parsedAssets : [];
  } catch (error) {
    console.error('Error getting auto watchlist:', error);
    return [];
  }
};

/**
 * Enable or disable auto watchlist
 */
export const setAutoWatchlistEnabled = (enabled: boolean): void => {
  localStorage.setItem(AUTO_WATCHLIST_ENABLED_KEY, JSON.stringify(enabled));
  
  if (enabled) {
    toast.success('רשימת מעקב אוטומטית הופעלה', {
      description: 'הנכסים בעלי הביצועים הטובים ביותר יתווספו אוטומטית לרשימת המעקב'
    });
  } else {
    toast.info('רשימת מעקב אוטומטית הופסקה');
  }
};

/**
 * Check if auto watchlist is enabled
 */
export const isAutoWatchlistEnabled = (): boolean => {
  try {
    const enabled = localStorage.getItem(AUTO_WATCHLIST_ENABLED_KEY);
    return enabled ? JSON.parse(enabled) : false;
  } catch (error) {
    console.error('Error checking auto watchlist status:', error);
    return false;
  }
};

/**
 * Update auto watchlist with current asset data
 */
export const updateAutoWatchlist = async (): Promise<TrackedAsset[]> => {
  if (!isAutoWatchlistEnabled()) return [];
  
  const currentWatchlist = getAutoWatchlist();
  const updatedWatchlist = await createAutoWatchlist(currentWatchlist.length || 10);
  
  // Save the combined watchlist (keep existing assets plus new ones)
  const combinedWatchlist = [
    ...currentWatchlist.filter(asset => 
      !updatedWatchlist.some(a => a.id === asset.id)
    ),
    ...updatedWatchlist
  ];
  
  saveAutoWatchlist(combinedWatchlist);
  return combinedWatchlist as TrackedAsset[];
};

/**
 * Initialize auto watchlist
 */
export const initializeAutoWatchlist = async (): Promise<void> => {
  const currentWatchlist = getAutoWatchlist();
  
  // If watchlist is enabled but empty, create initial watchlist
  if (isAutoWatchlistEnabled() && currentWatchlist.length === 0) {
    await createAutoWatchlist();
  }
};

// Export the watchlist creation function
export default createAutoWatchlist;
