
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Target, BarChart4 } from 'lucide-react';
import { getAlertDestinations } from '@/services/tradingView/alerts/destinations';
import SignalAnalysisSummary from '@/components/trading-signals/SignalAnalysisSummary';
import SignalsTab from '@/components/trading-signals/SignalsTab';
import AnalysesTab from '@/components/trading-signals/AnalysesTab';
import AlertDestinationsManager from '@/components/trading-signals/AlertDestinationsManager';
import TradingSignalsHeader from '@/components/trading-signals/TradingSignalsHeader';
import SetupGuide from '@/components/trading-signals/SetupGuide';
import { useTradingSignals } from '@/components/trading-signals/useTradingSignals';
import { useSignalAnalysis } from '@/components/trading-signals/useSignalAnalysis';
import { TradeSignal } from '@/types/asset';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const TradingSignals = () => {
  const {
    selectedAssetId,
    setSelectedAssetId,
    selectedAnalysisType,
    setSelectedAnalysisType,
    realTimeActive,
    showSettings,
    setShowSettings,
    assets,
    allSignals,
    signalsLoading,
    realTimeSignals,
    analyses,
    analysesLoading,
    formatDate,
    getAssetName,
    toggleRealTimeAnalysis
  } = useTradingSignals();
  
  // Add live signals from database with real-time subscription
  const { data: liveSignals = [], refetch } = useQuery({
    queryKey: ['live-trading-signals'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('trading_signals')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);
      
      if (error) {
        console.error('Error fetching live signals:', error);
        return [];
      }
      
      return data || [];
    },
    refetchInterval: 5000, // Refresh every 5 seconds
  });

  // Set up real-time subscription for new signals
  React.useEffect(() => {
    const channel = supabase
      .channel('trading-signals-live')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'trading_signals'
        },
        () => {
          refetch(); // Refresh when new signal is inserted
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refetch]);

  // Convert live signals to TradeSignal format
  const convertedLiveSignals: TradeSignal[] = liveSignals.map(signal => ({
    id: signal.id,
    assetId: signal.symbol,
    type: signal.action as 'buy' | 'sell',
    message: signal.reasoning,
    timestamp: new Date(signal.created_at).getTime(),
    price: signal.price,
    strength: signal.confidence > 0.8 ? 'strong' : signal.confidence > 0.6 ? 'medium' : 'weak',
    strategy: signal.strategy,
    timeframe: '1h' as const,
    createdAt: new Date(signal.created_at).getTime(),
  }));

  // Combine all signals (live + mock + real-time)
  const combinedSignals = [...convertedLiveSignals, ...allSignals];
  
  // Signal analysis calculation
  const signalAnalysis = useSignalAnalysis(combinedSignals, selectedAssetId);
  
  // Check if there are active alert destinations
  const hasActiveDestinations = getAlertDestinations().some(dest => dest.active);
  
  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <TradingSignalsHeader
        realTimeActive={realTimeActive}
        toggleRealTimeAnalysis={toggleRealTimeAnalysis}
        showSettings={showSettings}
        setShowSettings={setShowSettings}
      />
      
      {/* Setup guide or success message based on configuration */}
      <SetupGuide 
        hasActiveDestinations={hasActiveDestinations}
        showSettings={showSettings}
        setShowSettings={setShowSettings}
      />
      
      {/* Alert destinations manager */}
      {showSettings && (
        <div className="mb-6">
          <AlertDestinationsManager />
        </div>
      )}
      
      {/* Signal analysis summary */}
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
            איתותי מסחר ({combinedSignals.length})
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
            allSignals={combinedSignals}
            signalsLoading={signalsLoading}
            realTimeSignals={realTimeSignals as TradeSignal[]}
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
