
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Container } from '@/components/ui/container';
import RequireAuth from '@/components/auth/RequireAuth';
import { getAssetById, getAssetHistory } from '@/services/mockDataService';
import { analyzeAsset, getWyckoffPatterns, getSMCPatterns } from '@/services/technicalAnalysisService';
import { getWhaleMovements, getWhaleBehaviorPatterns } from '@/services/whaleTrackerService';
import { getNewsByAssetId } from '@/services/mockNewsService';
import PriceChartSection from '@/components/comprehensive-analysis/PriceChartSection';
import AnalysisSection from '@/components/comprehensive-analysis/AnalysisSection';
import { calculateOverallRecommendation } from '@/components/comprehensive-analysis/utils/recommendationCalculator';
import { generateTradePlan } from '@/components/comprehensive-analysis/utils/tradePlanGenerator';
import { Skeleton } from '@/components/ui/skeleton';

const AssetDetails = () => {
  const { id } = useParams();
  const [showVolume, setShowVolume] = useState<boolean>(true);
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>('1d');
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
  const { data: asset, isLoading: assetLoading } = useQuery({
    queryKey: ['asset', id],
    queryFn: () => getAssetById(id || ''),
    enabled: !!id
  });
  
  const { data: assetHistory, isLoading: historyLoading } = useQuery({
    queryKey: ['assetHistory', id, selectedTimeframe],
    queryFn: () => getAssetHistory(id || '', selectedTimeframe as any),
    enabled: !!id
  });
  
  // Fetch all analysis data in parallel
  const { data: technicalAnalysis, isLoading: analysisLoading } = useQuery({
    queryKey: ['analysisData', id, selectedTimeframe, 'all'],
    queryFn: () => analyzeAsset(id || '', selectedTimeframe as any, 'all'),
    enabled: !!id
  });
  
  const { data: wyckoffPatterns, isLoading: wyckoffLoading } = useQuery({
    queryKey: ['wyckoffPatterns', id, selectedTimeframe],
    queryFn: () => getWyckoffPatterns(id || '', selectedTimeframe as any),
    enabled: !!id
  });
  
  const { data: smcPatterns, isLoading: smcLoading } = useQuery({
    queryKey: ['smcPatterns', id, selectedTimeframe],
    queryFn: () => getSMCPatterns(id || '', selectedTimeframe as any),
    enabled: !!id
  });
  
  const { data: whaleMovements, isLoading: whaleLoading } = useQuery({
    queryKey: ['whaleMovements', id, 7],
    queryFn: () => getWhaleMovements(id || '', 7),
    enabled: !!id
  });
  
  const { data: whaleBehavior, isLoading: whaleBehaviorLoading } = useQuery({
    queryKey: ['whaleBehaviorPatterns', id],
    queryFn: () => getWhaleBehaviorPatterns(id || ''),
    enabled: !!id
  });
  
  const { data: newsItems, isLoading: newsLoading } = useQuery({
    queryKey: ['news', id],
    queryFn: () => getNewsByAssetId(id || ''),
    enabled: !!id
  });
  
  // Overall loading state
  const isLoading = assetLoading || historyLoading || analysisLoading || 
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
    if (isLoading || !asset || !technicalAnalysis || !smcPatterns || !assetHistory || !userStrategy) {
      return null;
    }
    
    return generateTradePlan(
      asset,
      technicalAnalysis,
      smcPatterns,
      assetHistory,
      userStrategy
    );
  };
  
  return (
    <RequireAuth>
      <Container className="py-6">
        <div className="flex justify-between items-center mb-6">
          <div className="text-left">
            {!isLoading && asset && (
              <div className="flex items-center gap-2">
                <div className="bg-primary/10 p-2 rounded-full">
                  {asset.icon || '💰'}
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">מחיר נוכחי</span>
                  <div className="text-2xl font-bold">${formatPrice(asset.price)}</div>
                </div>
              </div>
            )}
          </div>
          <div className="text-right">
            <h1 className="text-3xl font-bold tracking-tight mb-1">
              {isLoading ? <Skeleton className="h-9 w-32" /> : (asset ? asset.name : 'פרטי נכס')}
            </h1>
            <p className="text-muted-foreground">
              {isLoading ? <Skeleton className="h-5 w-48" /> : `מזהה: ${id}`}
            </p>
          </div>
        </div>
        
        {/* Show loading state or chart */}
        {isLoading ? (
          <Skeleton className="h-[300px] mb-6" />
        ) : asset && assetHistory && (
          <PriceChartSection 
            selectedAsset={asset}
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
          selectedAsset={asset}
          assetHistory={assetHistory}
          userStrategy={userStrategy}
          formatPrice={formatPrice}
          calculateOverallRecommendation={calculateRecommendationWrapper}
          generateTradePlan={generateTradePlanWrapper}
          isLoading={isLoading}
        />
      </Container>
    </RequireAuth>
  );
};

export default AssetDetails;
