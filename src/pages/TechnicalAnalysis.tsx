
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAssets, getAssetHistory } from '@/services/mockDataService';
import { analyzeAsset, getWyckoffPatterns, getSMCPatterns } from '@/services/technicalAnalysisService';
import { Asset } from '@/types/asset';

// Import components
import AssetSelector from '@/components/technical-analysis/AssetSelector';
import AssetInfoCard from '@/components/technical-analysis/AssetInfoCard';
import PriceVolumeChart from '@/components/technical-analysis/PriceVolumeChart';
import TechnicalIndicators from '@/components/technical-analysis/TechnicalIndicators';
import AdvancedAnalysisMethods from '@/components/technical-analysis/AdvancedAnalysisMethods';
import AlertSettings from '@/components/technical-analysis/AlertSettings';
import WhaleTracker from '@/components/technical-analysis/WhaleTracker';
import TradingLearningSystem from '@/components/technical-analysis/TradingLearningSystem';
import AdvancedPricePatterns from '@/components/technical-analysis/AdvancedPricePatterns';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart3, Brain, ActivitySquare } from 'lucide-react';

const timeframeOptions = [
  { value: '5m', label: '5 דקות' },
  { value: '15m', label: '15 דקות' },
  { value: '1h', label: 'שעה' },
  { value: '4h', label: '4 שעות' },
  { value: '1d', label: 'יומי' },
  { value: '1w', label: 'שבועי' },
];

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

  // עיבוד נתוני תבניות לתצוגה בגרף
  const processedAnalysisData = React.useMemo(() => {
    if (!analysisData) return null;
    
    const enhancedData = { ...analysisData };
    
    // הוספת תבניות שזוהו מהניתוחים השונים
    const patterns = [];
    
    // הוספת תבניות וויקוף אם קיימות
    if (wyckoffPatterns?.patterns && wyckoffPatterns.patterns.length > 0) {
      wyckoffPatterns.patterns.forEach((pattern, idx) => {
        if (!pattern.chartArea && assetHistory) {
          // ייצור אזור גרף לדוגמה אם אין מידע ספציפי
          const dataLength = assetHistory.data.length;
          const quarter = Math.floor(dataLength / 4);
          
          pattern.chartArea = {
            startTimestamp: assetHistory.data[quarter * (idx % 3)].timestamp,
            endTimestamp: assetHistory.data[Math.min(quarter * (idx % 3 + 1) + quarter, dataLength - 1)].timestamp,
            minPrice: Math.min(...assetHistory.data.slice(quarter * (idx % 3), quarter * (idx % 3 + 1) + quarter).map(p => p.price)) * 0.98,
            maxPrice: Math.max(...assetHistory.data.slice(quarter * (idx % 3), quarter * (idx % 3 + 1) + quarter).map(p => p.price)) * 1.02
          };
        }
        
        patterns.push({
          ...pattern,
          type: pattern.phase === 'אקומולציה' ? 'bullish' : pattern.phase === 'דיסטריביושן' ? 'bearish' : 'neutral'
        });
      });
    }
    
    // הוספת תבניות SMC אם קיימות
    if (smcPatterns?.patterns && smcPatterns.patterns.length > 0) {
      smcPatterns.patterns.forEach((pattern, idx) => {
        if (!pattern.chartArea && assetHistory) {
          // ייצור אזור גרף לדוגמה אם אין מידע ספציפי
          const dataLength = assetHistory.data.length;
          const third = Math.floor(dataLength / 3);
          
          pattern.chartArea = {
            startTimestamp: assetHistory.data[third * (idx % 2) + third].timestamp,
            endTimestamp: assetHistory.data[Math.min(third * (idx % 2 + 1) + third, dataLength - 1)].timestamp,
            minPrice: pattern.entryZone?.min || (Math.min(...assetHistory.data.slice(third * (idx % 2) + third, third * (idx % 2 + 1) + third).map(p => p.price)) * 0.98),
            maxPrice: pattern.entryZone?.max || (Math.max(...assetHistory.data.slice(third * (idx % 2) + third, third * (idx % 2 + 1) + third).map(p => p.price)) * 1.02)
          };
        }
        
        patterns.push({
          ...pattern,
          type: pattern.bias || 'neutral'
        });
      });
    }
    
    enhancedData.patterns = patterns;
    
    // הוספת רמות מפתח אם קיימות
    const keyLevels = [];
    
    // רמות תמיכה והתנגדות לדוגמה - בגרסה אמיתית אלו יבואו מאלגוריתם ניתוח
    if (assetHistory) {
      const prices = assetHistory.data.map(p => p.price);
      const maxPrice = Math.max(...prices);
      const minPrice = Math.min(...prices);
      const range = maxPrice - minPrice;
      
      // רמת התנגדות עליונה
      keyLevels.push({
        name: 'התנגדות עליונה',
        price: maxPrice - (range * 0.1),
        type: 'resistance'
      });
      
      // רמת תמיכה תחתונה
      keyLevels.push({
        name: 'תמיכה עיקרית',
        price: minPrice + (range * 0.15),
        type: 'support'
      });
      
      // רמת פיבונאצ'י 0.618
      keyLevels.push({
        name: 'פיבונאצ\'י 0.618',
        price: minPrice + (range * 0.618),
        type: range * 0.618 < (maxPrice - minPrice) / 2 ? 'support' : 'resistance'
      });
    }
    
    enhancedData.keyLevels = keyLevels;
    
    // הוספת הסברים מפורטים לסיגנלים
    if (enhancedData.signals) {
      enhancedData.signals = enhancedData.signals.map(signal => {
        let reason = '';
        
        if (signal.indicator === 'RSI') {
          reason = signal.type === 'buy' 
            ? 'ה-RSI עלה מאזור מכירת יתר, מציין היפוך מגמה פוטנציאלי כלפי מעלה'
            : 'ה-RSI ירד מאזור קניית יתר, מציין היפוך מגמה פוטנציאלי כלפי מטה';
        } else if (signal.indicator === 'MACD') {
          reason = signal.type === 'buy'
            ? 'חיתוך קו MACD את קו האיתות כלפי מעלה, מציין מומנטום חיובי' 
            : 'חיתוך קו MACD את קו האיתות כלפי מטה, מציין מומנטום שלילי';
        } else if (signal.indicator === 'ממוצע נע') {
          reason = signal.type === 'buy'
            ? 'המחיר חצה את הממוצע הנע כלפי מעלה, מציין מגמה עולה'
            : 'המחיר חצה את הממוצע הנע כלפי מטה, מציין מגמה יורדת';
        } else if (signal.indicator === 'תבנית מחיר') {
          reason = signal.type === 'buy'
            ? 'זוהתה תבנית מחיר עולה, מציינת פוטנציאל לעלייה'
            : 'זוהתה תבנית מחיר יורדת, מציינת פוטנציאל לירידה';
        }
        
        return {
          ...signal,
          reason
        };
      });
    }
    
    return enhancedData;
  }, [analysisData, wyckoffPatterns, smcPatterns, assetHistory]);

  const selectedAsset = assets?.find(asset => asset.id === selectedAssetId);

  // פורמט לתצוגת מחיר
  const formatPrice = (price: number) => {
    return price < 1 
      ? price.toFixed(6) 
      : price < 1000 
        ? price.toFixed(2) 
        : price.toLocaleString(undefined, { maximumFractionDigits: 2 });
  };

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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="lg:col-span-2">
              {/* גרף מחיר ונפח */}
              <PriceVolumeChart 
                historyLoading={historyLoading}
                assetHistory={assetHistory}
                showVolume={showVolume}
                setShowVolume={setShowVolume}
                formatPrice={formatPrice}
                analysisData={processedAnalysisData}
              />
              
              {/* אינדיקטורים טכניים */}
              <TechnicalIndicators 
                analysisLoading={analysisLoading}
                analysisData={processedAnalysisData}
                selectedAsset={selectedAsset}
              />
            </div>
            
            <div>
              {/* שיטות ניתוח מתקדמות */}
              <AdvancedAnalysisMethods 
                selectedAnalysisMethod={selectedAnalysisMethod}
                setSelectedAnalysisMethod={setSelectedAnalysisMethod}
                wyckoffPatterns={wyckoffPatterns}
                smcPatterns={smcPatterns}
                formatPrice={formatPrice}
              />
              
              {/* הגדרות התראות */}
              <AlertSettings />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="advanced" className="mt-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* לשונית ניתוח מתקדם */}
            <AdvancedPricePatterns 
              assetId={selectedAssetId}
              formatPrice={formatPrice}
            />
            
            {/* מעקב אחר ארנקים גדולים */}
            <WhaleTracker 
              assetId={selectedAssetId}
              formatPrice={formatPrice}
            />
          </div>
        </TabsContent>
        
        <TabsContent value="smart" className="mt-0">
          <div className="mb-6">
            {/* מערכת הלמידה החכמה */}
            <TradingLearningSystem 
              assetId={selectedAssetId}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TechnicalAnalysis;

