
import React, { useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Target, BarChart4, Brain, Zap, Activity } from 'lucide-react';
import { getAlertDestinations } from '@/services/tradingView/alerts/destinations';
import SignalAnalysisSummary from '@/components/trading-signals/SignalAnalysisSummary';
import SignalsTab from '@/components/trading-signals/SignalsTab';
import AnalysesTab from '@/components/trading-signals/AnalysesTab';
import AlertDestinationsManager from '@/components/trading-signals/AlertDestinationsManager';
import TradingSignalsHeader from '@/components/trading-signals/TradingSignalsHeader';
import SetupGuide from '@/components/trading-signals/SetupGuide';
import { useTradingSignals } from '@/components/trading-signals/useTradingSignals';
import { useSignalAnalysis } from '@/components/trading-signals/useSignalAnalysis';
import { useEngineStatus } from '@/hooks/useEngineStatus';
import { useAuth } from '@/contexts/AuthContext';
import { TradeSignal } from '@/types/asset';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const TradingSignals = () => {
  const { isAdmin } = useAuth();
  const { status: engineStatus, startEngine } = useEngineStatus();
  
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
  
  // LIVE signals from database with real-time subscription
  const { data: liveSignals = [], refetch } = useQuery({
    queryKey: ['live-trading-signals'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('trading_signals')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);
      
      if (error) {
        console.error('Error fetching live signals:', error);
        return [];
      }
      
      return data || [];
    },
    refetchInterval: 5000, // Refresh every 5 seconds
    refetchIntervalInBackground: true,
  });

  // Real-time subscription for LIVE signals
  useEffect(() => {
    console.log('🔥 Setting up LIVE real-time subscription for trading signals...');
    
    const channel = supabase
      .channel('live-trading-signals-realtime')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'trading_signals'
        },
        (payload) => {
          console.log('🚀 NEW LIVE SIGNAL received:', payload);
          refetch(); // Refresh immediately
          toast.success('איתות LIVE חדש התקבל!', {
            description: `${payload.new.action?.toUpperCase()} ${payload.new.symbol} - ${payload.new.strategy}`,
            duration: 10000,
          });
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'trading_signals'
        },
        (payload) => {
          console.log('📝 LIVE Signal updated:', payload);
          refetch();
        }
      )
      .subscribe((status) => {
        console.log('LIVE Real-time subscription status:', status);
        if (status === 'SUBSCRIBED') {
          console.log('✅ Successfully subscribed to LIVE signals');
        } else if (status === 'CHANNEL_ERROR') {
          console.error('❌ LIVE Real-time subscription error');
          toast.error('שגיאה בחיבור זמן אמת');
        }
      });

    return () => {
      console.log('Cleaning up LIVE real-time subscription');
      supabase.removeChannel(channel);
    };
  }, [refetch]);

  // Auto-refresh LIVE signals every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      console.log('🔄 Auto-refreshing LIVE signals (30s tick)');
      refetch();
    }, 30000);

    return () => clearInterval(interval);
  }, [refetch]);

  // Convert live signals to TradeSignal format - LIVE DATA ONLY
  const convertedLiveSignals: TradeSignal[] = liveSignals
    .filter(signal => signal.metadata?.live_data === true) // Only LIVE signals
    .map(signal => ({
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

  // ONLY show LIVE signals (no mock data)
  const combinedSignals = convertedLiveSignals
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 50);
  
  const signalAnalysis = useSignalAnalysis(combinedSignals, selectedAssetId);
  const hasActiveDestinations = getAlertDestinations().some(dest => dest.active);

  // Auto-notify admin if engine not running
  useEffect(() => {
    if (isAdmin && !engineStatus.isRunning) {
      toast.info('מנוע האיתותים LIVE אינו פועל', {
        description: 'לחץ על כפתור ההפעלה להתחיל לקבל איתותים אמיתיים',
        action: {
          label: 'הפעל מנוע LIVE',
          onClick: async () => {
            await startEngine();
          },
        },
      });
    }
  }, [isAdmin, engineStatus.isRunning, startEngine]);
  
  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      {/* Enhanced Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Brain className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">איתותי מסחר LIVE - LeviPro</h1>
          {isAdmin && (
            <Badge variant="secondary" className="gap-1">
              <Zap className="h-3 w-3" />
              מנהל מערכת - אלמוג
            </Badge>
          )}
        </div>
        <p className="text-muted-foreground">
          מערכת איתותים LIVE עם האסטרטגיה האישית של אלמוג - נתונים אמיתיים בלבד
        </p>
      </div>

      <TradingSignalsHeader
        realTimeActive={realTimeActive}
        toggleRealTimeAnalysis={toggleRealTimeAnalysis}
        showSettings={showSettings}
        setShowSettings={setShowSettings}
      />
      
      {/* LIVE status indicator */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-muted-foreground">
              🔥 עדכונים LIVE פעילים • {combinedSignals.length} איתותים אמיתיים
            </span>
          </div>
          <Badge variant={engineStatus.isRunning ? "default" : "outline"} className="gap-1">
            <Activity className="h-3 w-3" />
            מנוע LIVE: {engineStatus.isRunning ? 'פועל' : 'כבוי'}
          </Badge>
        </div>
        
        {liveSignals.filter(s => s.strategy === 'almog-personal-method').length > 0 && (
          <Badge className="bg-green-100 text-green-800 gap-1">
            <Brain className="h-3 w-3" />
            אסטרטגיה אישית LIVE פעילה
          </Badge>
        )}
      </div>
      
      <SetupGuide 
        hasActiveDestinations={hasActiveDestinations}
        showSettings={showSettings}
        setShowSettings={setShowSettings}
      />
      
      {showSettings && (
        <div className="mb-6">
          <AlertDestinationsManager />
        </div>
      )}
      
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
            איתותי LIVE ({combinedSignals.length})
          </TabsTrigger>
          <TabsTrigger value="analyses">
            <BarChart4 className="h-4 w-4 mr-2" />
            ניתוחי שוק LIVE
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
