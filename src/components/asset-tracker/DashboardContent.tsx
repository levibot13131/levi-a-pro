
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getTrackedAssets } from '@/services/assetTracking';
import { toggleAssetPin, toggleAssetAlerts, setAssetPriority } from '@/services/assetTracking/assetManagement';
import TrackedAssetList from './TrackedAssetList';
import MarketInformation from './MarketInformation';
import SocialMonitoring from './SocialMonitoring';
import ExternalSources from './ExternalSources';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Globe, Activity, Link } from 'lucide-react';

const DashboardContent = () => {
  const { data: assets = [], isLoading, refetch } = useQuery({
    queryKey: ['trackedAssets'],
    queryFn: getTrackedAssets,
  });

  const [selectedAsset, setSelectedAsset] = useState(null);

  const handleTogglePin = (assetId: string) => {
    toggleAssetPin(assetId);
    refetch();
  };

  const handleToggleAlerts = (assetId: string) => {
    toggleAssetAlerts(assetId);
    refetch();
  };

  const handleSetPriority = (assetId: string, priority: 'high' | 'medium' | 'low') => {
    setAssetPriority(assetId, priority);
    refetch();
  };

  const handleSelectAsset = (assetId: string) => {
    const asset = assets.find(a => a.id === assetId);
    setSelectedAsset(asset);
  };

  if (isLoading) {
    return <div>טוען נתונים...</div>;
  }

  return (
    <div className="grid grid-cols-1 gap-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <TrackedAssetList 
            assets={assets}
            onTogglePin={handleTogglePin}
            onToggleAlerts={handleToggleAlerts}
            onSetPriority={handleSetPriority}
            onRowAction={handleSelectAsset}
          />
        </div>
        <div className="lg:col-span-1">
          <Tabs defaultValue="marketInfo">
            <TabsList className="w-full">
              <TabsTrigger value="marketInfo" className="flex items-center gap-2">
                <Activity className="h-4 w-4" />
                מידע פונדמנטלי
              </TabsTrigger>
              <TabsTrigger value="externalSources" className="flex items-center gap-2">
                <Link className="h-4 w-4" />
                מקורות חיצוניים
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="marketInfo">
              <MarketInformation />
            </TabsContent>
            
            <TabsContent value="externalSources">
              <ExternalSources onUpdate={refetch} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      {selectedAsset && (
        <div className="mt-6">
          <SocialMonitoring selectedAsset={selectedAsset} />
        </div>
      )}
    </div>
  );
};

export default DashboardContent;
