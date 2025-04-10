
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAssets, getAssetHistory } from '@/services/mockDataService';
import { analyzeAsset, getWyckoffPatterns, getSMCPatterns } from '@/services/technicalAnalysisService';
import { Asset } from '@/types/asset';
import { formatPrice } from '@/utils/formatUtils';

// Import components
import AssetSelector from '@/components/technical-analysis/AssetSelector';
import AssetInfoCard from '@/components/technical-analysis/AssetInfoCard';
import BasicTabContent from '@/components/technical-analysis/BasicTabContent';
import AdvancedTabContent from '@/components/technical-analysis/AdvancedTabContent';
import SmartTabContent from '@/components/technical-analysis/SmartTabContent';
import PatternProcessor from '@/components/technical-analysis/PatternProcessor';
import { timeframeOptions } from '@/components/technical-analysis/TimeframeOptions';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart3, Brain, ActivitySquare } from 'lucide-react';

const TechnicalAnalysis = () => {
  const [selectedAssetId, setSelectedAssetId] = useState<string>('bitcoin');
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>('1d');
  const [selectedAnalysisMethod, setSelectedAnalysisMethod] = useState<string>('all');
  const [showVolume, setShowVolume] = useState<boolean>(true);
  const [selectedTab, setSelectedTab] = useState<string>("basic");
  
  // שליפת נתונים
  const { data: assets } = useQuery({
    queryKey: ['assets'],
    queryFn: getAssets,
  });
  
  const { data: assetHistory, isLoading: historyLoading } = useQuery({
    queryKey: ['assetHistory', selectedAssetId, selectedTimeframe],
    queryFn: () => getAssetHistory(selectedAssetId, selectedTimeframe as any),
  });
  
  const { data: analysisData, isLoading: analysisLoading } = useQuery({
    queryKey: ['analysisData', selectedAssetId, selectedTimeframe, selectedAnalysisMethod],
    queryFn: () => analyzeAsset(selectedAssetId, selectedTimeframe as any, selectedAnalysisMethod),
  });
  
  const { data: wyckoffPatterns } = useQuery({
    queryKey: ['wyckoffPatterns', selectedAssetId, selectedTimeframe],
    queryFn: () => getWyckoffPatterns(selectedAssetId, selectedTimeframe as any),
    enabled: selectedAnalysisMethod === 'wyckoff' || selectedAnalysisMethod === 'all',
  });
  
  const { data: smcPatterns } = useQuery({
    queryKey: ['smcPatterns', selectedAssetId, selectedTimeframe],
    queryFn: () => getSMCPatterns(selectedAssetId, selectedTimeframe as any),
    enabled: selectedAnalysisMethod === 'smc' || selectedAnalysisMethod === 'all',
  });

  // Process patterns data with the dedicated component
  const processedAnalysisData = PatternProcessor({
    analysisData,
    wyckoffPatterns,
    smcPatterns,
    assetHistory
  });

  const selectedAsset = assets?.find(asset => asset.id === selectedAssetId);

  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <h1 className="text-3xl font-bold mb-6 text-right">ניתוח טכני מתקדם</h1>
      
      {/* בחירת נכס וטווח זמן */}
      <AssetSelector 
        assets={assets}
        selectedAssetId={selectedAssetId}
        setSelectedAssetId={setSelectedAssetId}
        timeframeOptions={timeframeOptions}
        selectedTimeframe={selectedTimeframe}
        setSelectedTimeframe={setSelectedTimeframe}
      />
      
      {/* תצוגת מידע נכס */}
      {selectedAsset && (
        <div className="mb-6">
          <AssetInfoCard 
            asset={selectedAsset}
            formatPrice={formatPrice}
          />
        </div>
      )}
      
      {/* לשוניות לניווט בין תצוגות שונות */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="mb-6">
        <TabsList className="grid grid-cols-3 w-full max-w-md mx-auto">
          <TabsTrigger value="basic" className="flex items-center gap-1">
            <BarChart3 className="h-4 w-4" />
            בסיסי
          </TabsTrigger>
          <TabsTrigger value="advanced" className="flex items-center gap-1">
            <ActivitySquare className="h-4 w-4" />
            מתקדם
          </TabsTrigger>
          <TabsTrigger value="smart" className="flex items-center gap-1">
            <Brain className="h-4 w-4" />
            חכם
          </TabsTrigger>
        </TabsList>
      
        {/* תוכן הלשוניות */}
        <TabsContent value="basic" className="mt-0">
          <BasicTabContent 
            historyLoading={historyLoading}
            assetHistory={assetHistory}
            showVolume={showVolume}
            setShowVolume={setShowVolume}
            formatPrice={formatPrice}
            analysisData={processedAnalysisData}
            analysisLoading={analysisLoading}
            selectedAsset={selectedAsset}
            selectedAnalysisMethod={selectedAnalysisMethod}
            setSelectedAnalysisMethod={setSelectedAnalysisMethod}
            wyckoffPatterns={wyckoffPatterns}
            smcPatterns={smcPatterns}
          />
        </TabsContent>
        
        <TabsContent value="advanced" className="mt-0">
          <AdvancedTabContent 
            assetId={selectedAssetId}
            formatPrice={formatPrice}
          />
        </TabsContent>
        
        <TabsContent value="smart" className="mt-0">
          <SmartTabContent 
            assetId={selectedAssetId}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TechnicalAnalysis;
