
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getTrackedAssets } from '@/services/assetTracking';
import { toggleAssetPin, toggleAssetAlerts, setAssetPriority } from '@/services/assetTracking/assetManagement';
import TrackedAssetList from './TrackedAssetList';
import MarketInformation from './MarketInformation';
import SocialMonitoring from './SocialMonitoring';
import ExternalSources from './ExternalSources';
import TradingViewBanner from './TradingViewBanner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Globe, Activity, ExternalLink } from 'lucide-react';
import { useTradingViewConnection } from '@/hooks/use-tradingview-connection';
import { startAssetTracking, stopAssetTracking, isTrackingActive } from '@/services/assetTracking/realTimeSync';
import { Asset } from '@/types/asset';
import { TrackedAsset } from '@/services/assetTracking/types';

const DashboardContent = () => {
  const { data: assets = [], isLoading, refetch } = useQuery({
    queryKey: ['trackedAssets'],
    queryFn: getTrackedAssets,
  });

  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const { isConnected } = useTradingViewConnection();
  
  React.useEffect(() => {
    if (!isTrackingActive()) {
      startAssetTracking();
    }
    
    return () => {
      // Cleanup if needed
    };
  }, []);

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
    if (asset) {
      // Convert TrackedAsset to Asset for compatibility
      const convertedAsset: Asset = {
        id: asset.id,
        name: asset.name,
        symbol: asset.symbol,
        type: asset.type,
        price: asset.price,
        change24h: asset.change24h,
        marketCap: asset.marketCap || 0,
        volume24h: asset.volume24h || 0,
        rank: asset.rank || 0
      };
      setSelectedAsset(convertedAsset);
    }
  };

  if (isLoading) {
    return <div>טוען נתונים...</div>;
  }

  return (
    <div className="grid grid-cols-1 gap-6">
      <TradingViewBanner isConnected={isConnected} />
      
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
                <ExternalLink className="h-4 w-4" />
                מקורות חיצוניים
              </TabsTrigger>
              <TabsTrigger value="social" className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                מדיה חברתית
              </TabsTrigger>
            </TabsList>
            <TabsContent value="marketInfo">
              <MarketInformation selectedAsset={selectedAsset} />
            </TabsContent>
            <TabsContent value="externalSources">
              <ExternalSources onUpdate={refetch} selectedAsset={selectedAsset} />
            </TabsContent>
            <TabsContent value="social">
              <SocialMonitoring selectedAsset={selectedAsset} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default DashboardContent;
