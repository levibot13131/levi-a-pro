
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Asset } from '@/types/asset';
import { getAssetById } from '@/services/mockDataService';
import { toast } from 'sonner';

// שירות המעקב אחר נכסים
interface TrackedAsset {
  id: string;
  name: string;
  symbol: string;
  price: number;
  change24h: number;
  type: string;
  addedAt: number;
  alertsEnabled: boolean;
}

// מפתח לשמירת נכסים במעקב
const TRACKED_ASSETS_KEY = 'levi_bot_tracked_assets';

// פונקציה לקבלת נכסים במעקב
const getTrackedAssets = (): TrackedAsset[] => {
  const storedAssets = localStorage.getItem(TRACKED_ASSETS_KEY);
  if (!storedAssets) return [];
  
  try {
    return JSON.parse(storedAssets);
  } catch (error) {
    console.error('Error parsing tracked assets:', error);
    return [];
  }
};

// פונקציה לשמירת נכסים במעקב
const saveTrackedAssets = (assets: TrackedAsset[]): void => {
  localStorage.setItem(TRACKED_ASSETS_KEY, JSON.stringify(assets));
};

// פונקציה להוספת נכס למעקב
const trackAsset = async (asset: Asset): Promise<boolean> => {
  const trackedAssets = getTrackedAssets();
  
  // בדיקה אם הנכס כבר במעקב
  if (trackedAssets.some(a => a.id === asset.id)) {
    return false;
  }
  
  // הוספת הנכס לרשימת המעקב
  const newTrackedAsset: TrackedAsset = {
    id: asset.id,
    name: asset.name,
    symbol: asset.symbol,
    price: asset.price,
    change24h: asset.change24h,
    type: asset.type,
    addedAt: Date.now(),
    alertsEnabled: true
  };
  
  trackedAssets.push(newTrackedAsset);
  saveTrackedAssets(trackedAssets);
  
  return true;
};

// פונקציה להסרת נכס ממעקב
const untrackAsset = async (assetId: string): Promise<boolean> => {
  const trackedAssets = getTrackedAssets();
  
  // בדיקה אם הנכס קיים ברשימה
  const index = trackedAssets.findIndex(a => a.id === assetId);
  if (index === -1) {
    return false;
  }
  
  // הסרת הנכס מהרשימה
  trackedAssets.splice(index, 1);
  saveTrackedAssets(trackedAssets);
  
  return true;
};

// פונקציה לבדיקה אם נכס נמצא במעקב
const isAssetTracked = (assetId: string): boolean => {
  const trackedAssets = getTrackedAssets();
  return trackedAssets.some(a => a.id === assetId);
};

export function useAssetTracking(assetId: string) {
  const [isTracked, setIsTracked] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  const { data: asset, isLoading: assetLoading, refetch } = useQuery({
    queryKey: ['asset', assetId],
    queryFn: () => getAssetById(assetId),
    enabled: !!assetId
  });
  
  useEffect(() => {
    if (assetId) {
      const tracked = isAssetTracked(assetId);
      setIsTracked(tracked);
      setIsLoading(false);
    }
  }, [assetId]);
  
  const handleTrackAsset = async () => {
    if (!asset) return;
    
    try {
      await trackAsset(asset);
      setIsTracked(true);
      toast.success(`נוסף למעקב: ${asset.name}`, {
        description: 'הנכס נוסף בהצלחה לרשימת המעקב של Levi Bot'
      });
    } catch (error) {
      toast.error('שגיאה בהוספה למעקב', {
        description: 'לא ניתן להוסיף את הנכס למעקב'
      });
    }
  };
  
  const handleUntrackAsset = async () => {
    if (!asset) return;
    
    try {
      await untrackAsset(assetId);
      setIsTracked(false);
      toast.success(`הוסר ממעקב: ${asset.name}`, {
        description: 'הנכס הוסר בהצלחה מרשימת המעקב שלך'
      });
    } catch (error) {
      toast.error('שגיאה בהסרה ממעקב', {
        description: 'לא ניתן להסיר את הנכס מהמעקב'
      });
    }
  };
  
  const toggleTracking = async () => {
    if (isTracked) {
      await handleUntrackAsset();
    } else {
      await handleTrackAsset();
    }
  };
  
  return {
    asset,
    isTracked,
    isLoading: isLoading || assetLoading,
    trackAsset: handleTrackAsset,
    untrackAsset: handleUntrackAsset,
    toggleTracking,
    refetch
  };
}

export { getTrackedAssets, trackAsset, untrackAsset, isAssetTracked };
