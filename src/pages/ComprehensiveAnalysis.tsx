
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAssets, getAssetHistory } from '@/services/mockDataService';
import { analyzeAsset, getWyckoffPatterns, getSMCPatterns } from '@/services/technicalAnalysisService';
import { getWhaleMovements, getWhaleBehaviorPatterns } from '@/services/whaleTrackerService';
import { getNewsByAssetId } from '@/services/mockNewsService';
import AssetSelectorSection from '@/components/comprehensive-analysis/AssetSelectorSection';
import PriceChartSection from '@/components/comprehensive-analysis/PriceChartSection';
import AnalysisSection from '@/components/comprehensive-analysis/AnalysisSection';
import { calculateOverallRecommendation, generateTradePlan } from '@/components/comprehensive-analysis/utils/analysisCalculations';
import { Skeleton } from '@/components/ui/skeleton';

const timeframeOptions = [
  { value: '5m', label: '5 דקות' },
  { value: '15m', label: '15 דקות' },
  { value: '1h', label: 'שעה' },
  { value: '4h', label: '4 שעות' },
  { value: '1d', label: 'יומי' },
  { value: '1w', label: 'שבועי' },
];

const ComprehensiveAnalysis = () => {
  const [selectedAssetId, setSelectedAssetId] = useState<string>('bitcoin');
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>('1d');
  const [showVolume, setShowVolume] = useState<boolean>(true);
  const [userStrategy, setUserStrategy] = useState<{
    description: string;
    riskRules: string[];
    entryRules: string[];
    exitRules: string[];
  }>({
    description: 'אסטרטגיית מסחר שמשלבת ניתוח טכני מתקדם עם מעקב אחר תנועות ארנקים גדולים',
    riskRules: [
      'סיכון מקסימלי לעסקה: 1% מגודל התיק',
      'סטופ-לוס מתחת/מעל נקודת תמיכה/התנגדות קריטית',
      'יחס סיכוי:סיכון מינימלי של 1:2',
      'לא להיכנס לעסקאות בתקופת הכרזות משמעותיות או תנודתיות קיצונית',
    ],
    entryRules: [
      'כניסה רק כאשר יש התכנסות של לפחות 3 אינדיקטורים',
      'מחיר נמצא מעל/מתחת לממוצע נע 200',
      'זיהוי תבנית מחיר תומכת (דגל, משולש, תחתית כפולה וכו\')',
      'בדיקת תנועות ארנקים גדולים לפני כניסה'
    ],
    exitRules: [
      'מכירת 50% מהפוזיציה בהגעה ליעד ראשון (1:1)',
      'הזזת סטופ לנקודת כניסה לאחר הגעה ליעד ראשון',
      'סגירת שארית הפוזיציה בהגעה ליעד שני או במגע בסטופ',
      'סגירה מיידית בזיהוי תבנית היפוך משמעותית'
    ]
  });
  
  // Fetch asset data
  const { data: assets, isLoading: assetsLoading } = useQuery({
    queryKey: ['assets'],
    queryFn: getAssets,
  });
  
  const { data: assetHistory, isLoading: historyLoading } = useQuery({
    queryKey: ['assetHistory', selectedAssetId, selectedTimeframe],
    queryFn: () => getAssetHistory(selectedAssetId, selectedTimeframe as any),
  });
  
  // Fetch all analysis data in parallel
  const { data: technicalAnalysis, isLoading: analysisLoading } = useQuery({
    queryKey: ['analysisData', selectedAssetId, selectedTimeframe, 'all'],
    queryFn: () => analyzeAsset(selectedAssetId, selectedTimeframe as any, 'all'),
  });
  
  const { data: wyckoffPatterns, isLoading: wyckoffLoading } = useQuery({
    queryKey: ['wyckoffPatterns', selectedAssetId, selectedTimeframe],
    queryFn: () => getWyckoffPatterns(selectedAssetId, selectedTimeframe as any),
  });
  
  const { data: smcPatterns, isLoading: smcLoading } = useQuery({
    queryKey: ['smcPatterns', selectedAssetId, selectedTimeframe],
    queryFn: () => getSMCPatterns(selectedAssetId, selectedTimeframe as any),
  });
  
  const { data: whaleMovements, isLoading: whaleLoading } = useQuery({
    queryKey: ['whaleMovements', selectedAssetId, 7],
    queryFn: () => getWhaleMovements(selectedAssetId, 7),
  });
  
  const { data: whaleBehavior, isLoading: whaleBehaviorLoading } = useQuery({
    queryKey: ['whaleBehaviorPatterns', selectedAssetId],
    queryFn: () => getWhaleBehaviorPatterns(selectedAssetId),
  });
  
  const { data: newsItems, isLoading: newsLoading } = useQuery({
    queryKey: ['news', selectedAssetId],
    queryFn: () => getNewsByAssetId(selectedAssetId),
  });
  
  const selectedAsset = assets?.find(asset => asset.id === selectedAssetId);
  
  // Overall loading state
  const isLoading = assetsLoading || historyLoading || analysisLoading || 
                    wyckoffLoading || smcLoading || whaleLoading || 
                    whaleBehaviorLoading || newsLoading;
  
  // Format price for display
  const formatPrice = (price: number) => {
    return price < 1 
      ? price.toFixed(6) 
      : price < 1000 
        ? price.toFixed(2) 
        : price.toLocaleString(undefined, { maximumFractionDigits: 2 });
  };

  // Calculate overall recommendation
  const calculateRecommendationWrapper = () => {
    if (isLoading || !technicalAnalysis || !wyckoffPatterns || !smcPatterns || !whaleMovements || !newsItems) {
      return { signal: 'neutral' as const, strength: 0, reasoning: [] };
    }
    
    return calculateOverallRecommendation(
      technicalAnalysis,
      wyckoffPatterns,
      smcPatterns,
      whaleMovements,
      newsItems
    );
  };

  // Generate trade plan
  const generateTradePlanWrapper = () => {
    if (isLoading || !selectedAsset || !technicalAnalysis || !smcPatterns || !assetHistory || !userStrategy) {
      return null;
    }
    
    return generateTradePlan(
      selectedAsset,
      technicalAnalysis,
      smcPatterns,
      assetHistory,
      userStrategy
    );
  };
  
  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <h1 className="text-3xl font-bold mb-6 text-right">ניתוח שוק מקיף</h1>
      
      {/* Render asset selector even during loading */}
      <AssetSelectorSection 
        assets={assets}
        selectedAssetId={selectedAssetId}
        setSelectedAssetId={setSelectedAssetId}
        timeframeOptions={timeframeOptions}
        selectedTimeframe={selectedTimeframe}
        setSelectedTimeframe={setSelectedTimeframe}
        selectedAsset={selectedAsset}
      />
      
      {/* Show loading state or chart */}
      {isLoading && !selectedAsset ? (
        <Skeleton className="h-[300px] mb-6" />
      ) : selectedAsset && (
        <PriceChartSection 
          selectedAsset={selectedAsset}
          historyLoading={historyLoading}
          assetHistory={assetHistory}
          showVolume={showVolume}
          setShowVolume={setShowVolume}
          formatPrice={formatPrice}
          technicalAnalysis={technicalAnalysis}
        />
      )}
      
      {/* Analysis section with loading state */}
      <AnalysisSection 
        technicalAnalysis={technicalAnalysis}
        wyckoffPatterns={wyckoffPatterns}
        smcPatterns={smcPatterns}
        whaleMovements={whaleMovements}
        whaleBehavior={whaleBehavior}
        newsItems={newsItems}
        selectedAsset={selectedAsset}
        assetHistory={assetHistory}
        userStrategy={userStrategy}
        formatPrice={formatPrice}
        calculateOverallRecommendation={calculateRecommendationWrapper}
        generateTradePlan={generateTradePlanWrapper}
        isLoading={isLoading}
      />
    </div>
  );
};

export default ComprehensiveAnalysis;
