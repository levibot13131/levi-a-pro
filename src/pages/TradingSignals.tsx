
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { TradeSignal, MarketAnalysis } from '@/types/asset';
import { getTradeSignals, getMarketAnalyses } from '@/services/mockTradingService';
import { getAssets } from '@/services/mockDataService';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Play, Target, BarChart4 } from 'lucide-react';
import { 
  useStoredSignals, 
  startRealTimeAnalysis, 
  generateSignalAnalysis 
} from '@/services/backtesting/realTimeAnalysis';
import { toast } from 'sonner';
import SignalAnalysisSummary from '@/components/trading-signals/SignalAnalysisSummary';
import SignalsTab from '@/components/trading-signals/SignalsTab';
import AnalysesTab from '@/components/trading-signals/AnalysesTab';

const TradingSignals = () => {
  const [selectedAssetId, setSelectedAssetId] = useState<string>('all');
  const [selectedAnalysisType, setSelectedAnalysisType] = useState<string>('all');
  const [realTimeActive, setRealTimeActive] = useState<boolean>(false);
  const [alertInstance, setAlertInstance] = useState<{ stop: () => void } | null>(null);
  
  // שליפת נתונים
  const { data: mockSignals, isLoading: mockSignalsLoading } = useQuery({
    queryKey: ['tradeSignals', selectedAssetId],
    queryFn: () => getTradeSignals(selectedAssetId !== 'all' ? selectedAssetId : undefined),
  });
  
  // שליפת איתותים בזמן אמת
  const { data: realTimeSignals = [], refetch: refetchRealTimeSignals } = useStoredSignals(
    selectedAssetId !== 'all' ? selectedAssetId : undefined
  );
  
  const { data: analyses, isLoading: analysesLoading } = useQuery({
    queryKey: ['marketAnalyses', selectedAssetId, selectedAnalysisType],
    queryFn: () => getMarketAnalyses(
      selectedAssetId !== 'all' ? selectedAssetId : undefined,
      selectedAnalysisType !== 'all' ? selectedAnalysisType as MarketAnalysis['type'] : undefined
    ),
  });
  
  const { data: assets } = useQuery({
    queryKey: ['assets'],
    queryFn: getAssets,
  });
  
  // שילוב של האיתותים המדומים והאיתותים בזמן אמת
  const allSignals: TradeSignal[] = React.useMemo(() => {
    const combined = [...(mockSignals || []), ...realTimeSignals];
    // מיון לפי זמן (מהחדש לישן)
    return combined.sort((a, b) => b.timestamp - a.timestamp);
  }, [mockSignals, realTimeSignals]);
  
  const signalsLoading = mockSignalsLoading;
  
  // רענון תקופתי של איתותים בזמן אמת
  useEffect(() => {
    const interval = setInterval(() => {
      refetchRealTimeSignals();
    }, 5000);
    
    return () => {
      clearInterval(interval);
      if (alertInstance) {
        alertInstance.stop();
      }
    };
  }, [refetchRealTimeSignals, alertInstance]);
  
  // פונקציה להפעלת/כיבוי ניתוח בזמן אמת
  const toggleRealTimeAnalysis = () => {
    if (realTimeActive && alertInstance) {
      alertInstance.stop();
      setAlertInstance(null);
      setRealTimeActive(false);
      toast.info("ניתוח בזמן אמת הופסק");
    } else {
      // הפעלת ניתוח בזמן אמת עבור כל הנכסים או הנכס הנבחר
      const assetsList = selectedAssetId !== 'all' 
        ? [selectedAssetId] 
        : assets?.slice(0, 5).map(a => a.id) || []; // מגביל ל-5 נכסים למניעת עומס
      
      const instance = startRealTimeAnalysis(assetsList, {
        strategy: "A.A", // Using a valid strategy
      });
      
      setAlertInstance(instance);
      setRealTimeActive(true);
      toast.success("ניתוח בזמן אמת הופעל", {
        description: `המערכת תתחיל לשלוח התראות בזמן אמת עבור ${assetsList.length} נכסים`
      });
    }
  };
  
  // קבלת שם נכס
  const getAssetName = (assetId: string) => {
    return assets?.find(a => a.id === assetId)?.name || assetId;
  };
  
  // פורמט לתאריך
  const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('he-IL', { 
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // ניתוח הסיגנלים הקיימים
  const signalAnalysis = React.useMemo(() => {
    if (!allSignals || allSignals.length === 0) return null;
    return generateSignalAnalysis(selectedAssetId !== 'all' ? selectedAssetId : undefined);
  }, [allSignals, selectedAssetId]);
  
  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <div className="flex justify-between items-center mb-6">
        <Button 
          onClick={toggleRealTimeAnalysis}
          variant={realTimeActive ? "destructive" : "default"}
          className="flex items-center gap-2"
        >
          {realTimeActive ? (
            <>הפסק ניתוח בזמן אמת</>
          ) : (
            <>
              <Play className="h-4 w-4" />
              הפעל ניתוח בזמן אמת
            </>
          )}
        </Button>
        <h1 className="text-3xl font-bold text-right">איתותי מסחר וניתוח שוק</h1>
      </div>
      
      {/* סיכום הניתוח */}
      {signalAnalysis && (
        <SignalAnalysisSummary 
          signalAnalysis={signalAnalysis} 
          realTimeActive={realTimeActive}
        />
      )}
      
      <Tabs defaultValue="signals" className="space-y-4">
        <TabsList className="grid w-full md:w-[400px] grid-cols-2">
          <TabsTrigger value="signals">
            <Target className="h-4 w-4 mr-2" />
            איתותי מסחר
          </TabsTrigger>
          <TabsTrigger value="analyses">
            <BarChart4 className="h-4 w-4 mr-2" />
            ניתוחי שוק
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="signals">
          <SignalsTab 
            selectedAssetId={selectedAssetId}
            setSelectedAssetId={setSelectedAssetId}
            assets={assets}
            allSignals={allSignals}
            signalsLoading={signalsLoading}
            realTimeSignals={realTimeSignals}
            formatDate={formatDate}
            getAssetName={getAssetName}
            realTimeActive={realTimeActive}
            toggleRealTimeAnalysis={toggleRealTimeAnalysis}
          />
        </TabsContent>
        
        <TabsContent value="analyses">
          <AnalysesTab
            selectedAssetId={selectedAssetId}
            setSelectedAssetId={setSelectedAssetId}
            selectedAnalysisType={selectedAnalysisType}
            setSelectedAnalysisType={setSelectedAnalysisType}
            assets={assets}
            analyses={analyses}
            analysesLoading={analysesLoading}
            getAssetName={getAssetName}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TradingSignals;
