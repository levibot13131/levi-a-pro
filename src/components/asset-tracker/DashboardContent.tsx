
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  getTrackedAssets, 
  togglePin, 
  toggleAlerts, 
  setAssetPriority 
} from '@/services/assetTracking';
import TrackedAssetList from './TrackedAssetList';
import MarketInformation from './MarketInformation';

const DashboardContent = () => {
  const { data: assets = [], isLoading } = useQuery({
    queryKey: ['trackedAssets'],
    queryFn: getTrackedAssets,
  });

  const handleTogglePin = (assetId: string) => {
    togglePin(assetId);
  };

  const handleToggleAlerts = (assetId: string) => {
    toggleAlerts(assetId);
  };

  const handleSetPriority = (assetId: string, priority: 'high' | 'medium' | 'low') => {
    setAssetPriority(assetId, priority);
  };

  if (isLoading) {
    return <div>טוען נתונים...</div>;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <TrackedAssetList 
          assets={assets}
          onTogglePin={handleTogglePin}
          onToggleAlerts={handleToggleAlerts}
          onSetPriority={handleSetPriority}
        />
      </div>
      <div className="lg:col-span-1">
        <MarketInformation />
      </div>
    </div>
  );
};

export default DashboardContent;
