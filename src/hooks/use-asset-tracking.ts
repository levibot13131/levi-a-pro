
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Asset } from '@/types/asset';
import { getAssetById } from '@/services/mockDataService';
import { trackAsset, untrackAsset, isAssetTracked } from '@/services/assetTracking';
import { toast } from 'sonner';

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
        description: 'הנכס נוסף בהצלחה לרשימת המעקב שלך'
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
