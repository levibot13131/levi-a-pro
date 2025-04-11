
import React, { useState, useEffect } from 'react';
import { 
  initializeAssets, 
  getAllAssets, 
  getMarketAssets,
  getTrendingAssets
} from '@/services/realTimeAssetService';
import AssetList from '@/components/market-data/AssetList';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Grid, BarChart3, TrendingUp } from 'lucide-react';
import TradingViewWebhookHandler from '@/components/technical-analysis/TradingViewWebhookHandler';
import ComprehensiveAnalysis from '@/components/backtesting/ComprehensiveAnalysis';
import { Asset } from '@/types/asset';
import { useQuery } from '@tanstack/react-query';

const MarketData = () => {
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  
  // Initialize asset data on component mount
  useEffect(() => {
    initializeAssets();
  }, []);
  
  // Use React Query to periodically fetch updated asset data
  const { data: allAssets = [], isLoading } = useQuery({
    queryKey: ['assets'],
    queryFn: getAllAssets,
    refetchInterval: 3000, // Refetch every 3 seconds
  });
  
  const { data: trendingAssets = [] } = useQuery({
    queryKey: ['trendingAssets'],
    queryFn: () => getTrendingAssets(10),
    refetchInterval: 5000, // Refetch every 5 seconds
  });
  
  const { data: cryptoAssets = [] } = useQuery({
    queryKey: ['assets', 'crypto'],
    queryFn: () => getMarketAssets('crypto'),
    refetchInterval: 3000,
  });
  
  const { data: stockAssets = [] } = useQuery({
    queryKey: ['assets', 'stocks'],
    queryFn: () => getMarketAssets('stocks'),
    refetchInterval: 3000,
  });
  
  const { data: forexAssets = [] } = useQuery({
    queryKey: ['assets', 'forex'],
    queryFn: () => getMarketAssets('forex'),
    refetchInterval: 3000,
  });
  
  const { data: commodityAssets = [] } = useQuery({
    queryKey: ['assets', 'commodities'],
    queryFn: () => getMarketAssets('commodities'),
    refetchInterval: 3000,
  });
  
  // Handle selecting an asset for analysis
  const handleAssetSelect = (asset: Asset) => {
    setSelectedAsset(asset);
  };
  
  return (
    <div className="container py-6">
      <div className="grid grid-cols-1 gap-6">
        <div className="flex flex-col gap-2 md:flex-row md:justify-between md:items-center">
          <h1 className="text-3xl font-bold tracking-tight">נתוני שוק בזמן אמת</h1>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-green-600" />
            <span className="text-sm font-medium">מתעדכן בזמן אמת כל 3 שניות</span>
          </div>
        </div>
        
        {/* Asset Analysis Section */}
        {selectedAsset && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-right">
                  ניתוח מקיף עבור {selectedAsset.name} ({selectedAsset.symbol})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ComprehensiveAnalysis assetId={selectedAsset.id} />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-right">התראות ואיתותים מטריידינגויו</CardTitle>
              </CardHeader>
              <CardContent>
                <TradingViewWebhookHandler />
              </CardContent>
            </Card>
          </div>
        )}
        
        {/* Asset Lists */}
        <Tabs defaultValue="all">
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="all" className="gap-2">
                <Grid className="h-4 w-4" />
                כל הנכסים
              </TabsTrigger>
              <TabsTrigger value="trending" className="gap-2">
                <TrendingUp className="h-4 w-4" />
                במגמה
              </TabsTrigger>
              <TabsTrigger value="by-market" className="gap-2">
                <BarChart3 className="h-4 w-4" />
                לפי שוק
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="all">
            <AssetList 
              assets={allAssets} 
              isLoading={isLoading}
              onAssetSelect={handleAssetSelect}
            />
          </TabsContent>
          
          <TabsContent value="trending">
            <AssetList 
              assets={trendingAssets}
              isLoading={isLoading}
              onAssetSelect={handleAssetSelect}
            />
          </TabsContent>
          
          <TabsContent value="by-market">
            <Tabs defaultValue="crypto">
              <TabsList className="mb-4">
                <TabsTrigger value="crypto">קריפטו</TabsTrigger>
                <TabsTrigger value="stocks">מניות</TabsTrigger>
                <TabsTrigger value="forex">מט"ח</TabsTrigger>
                <TabsTrigger value="commodities">סחורות</TabsTrigger>
              </TabsList>
              
              <TabsContent value="crypto">
                <AssetList 
                  assets={cryptoAssets}
                  isLoading={isLoading}
                  onAssetSelect={handleAssetSelect}
                />
              </TabsContent>
              
              <TabsContent value="stocks">
                <AssetList 
                  assets={stockAssets}
                  isLoading={isLoading}
                  onAssetSelect={handleAssetSelect}
                />
              </TabsContent>
              
              <TabsContent value="forex">
                <AssetList 
                  assets={forexAssets}
                  isLoading={isLoading}
                  onAssetSelect={handleAssetSelect}
                />
              </TabsContent>
              
              <TabsContent value="commodities">
                <AssetList 
                  assets={commodityAssets}
                  isLoading={isLoading}
                  onAssetSelect={handleAssetSelect}
                />
              </TabsContent>
            </Tabs>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MarketData;
