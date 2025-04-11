
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  initializeTrackedAssets, 
  getFilteredTrackedAssets,
  startAssetTracking,
  stopAssetTracking,
  isTrackingActive
} from '@/services/assetTracking';
import { 
  toggleAssetPin, 
  toggleAssetAlerts, 
  setAssetPriority
} from '@/services/assetTracking/assetManagement';
import TrackedAssetList from '@/components/asset-tracker/TrackedAssetList';
import AssetSearchDialog from '@/components/asset-tracker/AssetSearchDialog';
import { useTradingViewConnection } from '@/hooks/use-tradingview-connection';
import { Tabs, TabsContent } from '@/components/ui/tabs';

// Import our new components
import AssetTrackerHeader from '@/components/asset-tracker/AssetTrackerHeader';
import TradingViewBanner from '@/components/asset-tracker/TradingViewBanner';
import AssetTabsList from '@/components/asset-tracker/AssetTabsList';
import AssetFilters from '@/components/asset-tracker/AssetFilters';
import DashboardContent from '@/components/asset-tracker/DashboardContent';

const AssetTracker = () => {
  const [activeMarket, setActiveMarket] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [signalFilter, setSignalFilter] = useState<string>('all');
  const [trackingActive, setTrackingActive] = useState<boolean>(false);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const { isConnected } = useTradingViewConnection();
  
  const { data: trackedAssets = [], refetch } = useQuery({
    queryKey: ['trackedAssets', activeMarket, priorityFilter, signalFilter],
    queryFn: () => getFilteredTrackedAssets(
      activeMarket !== 'all' ? activeMarket : undefined,
      priorityFilter !== 'all' ? priorityFilter as any : undefined,
      signalFilter !== 'all' ? signalFilter as any : undefined
    ),
    refetchInterval: 5000,
  });
  
  useEffect(() => {
    initializeTrackedAssets();
    setTrackingActive(isTrackingActive());
    
    if (!isTrackingActive()) {
      startAssetTracking();
      setTrackingActive(true);
    }
    
    return () => {};
  }, []);
  
  const handleToggleTracking = () => {
    if (trackingActive) {
      stopAssetTracking();
      setTrackingActive(false);
    } else {
      startAssetTracking();
      setTrackingActive(true);
    }
  };
  
  const cryptoCount = trackedAssets.filter(a => a.type === 'crypto').length;
  const stocksCount = trackedAssets.filter(a => a.type === 'stocks').length;
  const forexCount = trackedAssets.filter(a => a.type === 'forex').length;
  const commoditiesCount = trackedAssets.filter(a => a.type === 'commodities').length;
  
  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <AssetTrackerHeader 
        trackingActive={trackingActive}
        handleToggleTracking={handleToggleTracking}
        refetch={refetch}
        openAssetSearch={() => setIsSearchOpen(true)}
        totalAssetsCount={trackedAssets.length}
      />
      
      <TradingViewBanner isConnected={isConnected} />
      
      <Tabs defaultValue="dashboard" className="space-y-4">
        <AssetTabsList 
          cryptoCount={cryptoCount}
          stocksCount={stocksCount}
          forexCount={forexCount}
          commoditiesCount={commoditiesCount}
        />
        
        <AssetFilters 
          priorityFilter={priorityFilter}
          setPriorityFilter={setPriorityFilter}
          signalFilter={signalFilter}
          setSignalFilter={setSignalFilter}
        />
        
        <TabsContent value="dashboard">
          <DashboardContent />
        </TabsContent>
        
        <TabsContent value="crypto">
          <TrackedAssetList 
            assets={trackedAssets.filter(a => a.type === 'crypto')}
            onTogglePin={toggleAssetPin}
            onToggleAlerts={toggleAssetAlerts}
            onSetPriority={setAssetPriority}
          />
        </TabsContent>
        
        <TabsContent value="stocks">
          <TrackedAssetList 
            assets={trackedAssets.filter(a => a.type === 'stocks')}
            onTogglePin={toggleAssetPin}
            onToggleAlerts={toggleAssetAlerts}
            onSetPriority={setAssetPriority}
          />
        </TabsContent>
        
        <TabsContent value="forex">
          <TrackedAssetList 
            assets={trackedAssets.filter(a => a.type === 'forex')}
            onTogglePin={toggleAssetPin}
            onToggleAlerts={toggleAssetAlerts}
            onSetPriority={setAssetPriority}
          />
        </TabsContent>
        
        <TabsContent value="commodities">
          <TrackedAssetList 
            assets={trackedAssets.filter(a => a.type === 'commodities')}
            onTogglePin={toggleAssetPin}
            onToggleAlerts={toggleAssetAlerts}
            onSetPriority={setAssetPriority}
          />
        </TabsContent>
      </Tabs>
      
      <AssetSearchDialog 
        isOpen={isSearchOpen} 
        onOpenChange={setIsSearchOpen} 
        onAssetAdd={() => refetch()}
      />
    </div>
  );
};

export default AssetTracker;
