
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { Asset } from '@/types/asset';
import { 
  getTrackedAssets, 
  addTrackedAsset, 
  removeTrackedAsset,
  updateTrackedAsset
} from '@/services/assetTracking';
import { toast } from 'sonner';

export function useAssetTracking() {
  const queryClient = useQueryClient();
  
  // Get all tracked assets
  const { data: trackedAssets = [], isLoading, refetch } = useQuery({
    queryKey: ['trackedAssets'],
    queryFn: () => getTrackedAssets(),
  });
  
  // Check if a specific asset is tracked
  const isTracked = (assetId: string) => {
    return trackedAssets.some(asset => asset.id === assetId);
  };
  
  // Track an asset
  const trackAssetMutation = useMutation({
    mutationFn: async (asset: Asset) => {
      const success = addTrackedAsset(asset.id);
      if (!success) {
        throw new Error('Failed to add asset to tracking list');
      }
      return success;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trackedAssets'] });
    },
    onError: (error) => {
      toast.error('שגיאה בהוספת נכס למעקב', {
        description: error.message
      });
    }
  });
  
  // Untrack an asset
  const untrackAssetMutation = useMutation({
    mutationFn: async (assetId: string = '') => {
      const success = removeTrackedAsset(assetId);
      if (!success) {
        throw new Error('Failed to remove asset from tracking list');
      }
      return success;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trackedAssets'] });
    },
    onError: (error) => {
      toast.error('שגיאה בהסרת נכס ממעקב', {
        description: error.message
      });
    }
  });
  
  // Toggle tracking status
  const toggleTrackingMutation = useMutation({
    mutationFn: async (asset: Asset) => {
      if (isTracked(asset.id)) {
        return removeTrackedAsset(asset.id);
      } else {
        return addTrackedAsset(asset.id);
      }
    },
    onSuccess: (_, asset) => {
      queryClient.invalidateQueries({ queryKey: ['trackedAssets'] });
      if (isTracked(asset.id)) {
        toast.success(`${asset.name} הוסר ממעקב`);
      } else {
        toast.success(`${asset.name} נוסף למעקב`);
      }
    },
    onError: (error) => {
      toast.error('שגיאה בעדכון מעקב', {
        description: error.message
      });
    }
  });
  
  return {
    trackedAssets,
    isLoading,
    isTracked,
    trackAsset: trackAssetMutation.mutate,
    untrackAsset: untrackAssetMutation.mutate,
    toggleTracking: toggleTrackingMutation.mutate,
    refetch
  };
}
