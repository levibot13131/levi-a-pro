
import React, { useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
  
  // Enhanced real-time signals from database with proper subscription
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

  // Set up real-time subscription for new signals with better error handling
  useEffect(() => {
    console.log('Setting up real-time subscription for trading signals...');
    
    const channel = supabase
      .channel('trading-signals-realtime')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'trading_signals'
        },
        (payload) => {
          console.log('🔥 New signal received via real-time:', payload);
          refetch(); // Refresh the signals immediately
          toast.success('איתות חדש התקבל!', {
            description: `${payload.new.action?.toUpperCase()} ${payload.new.symbol} - ${payload.new.strategy}`,
            duration: 8000,
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
          console.log('📝 Signal updated via real-time:', payload);
          refetch(); // Refresh on updates too
        }
      )
      .subscribe((status) => {
        console.log('Real-time subscription status:', status);
        if (status === 'SUBSCRIBED') {
          console.log('✅ Successfully subscribed to real-time signals');
        } else if (status === 'CHANNEL_ERROR') {
          console.error('❌ Real-time subscription error');
          toast.error('שגיאה בחיבור זמן אמת');
        }
      });

    return () => {
      console.log('Cleaning up real-time subscription');
      supabase.removeChannel(channel);
    };
  }, [refetch]);

  // Auto-refresh signals every 30 seconds (matching engine tick)
  useEffect(() => {
    const interval = setInterval(() => {
      console.log('🔄 Auto-refreshing signals (30s tick)');
      refetch();
    }, 30000);

    return () => clearInterval(interval);
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

  // Combine all signals and sort by timestamp
  const combinedSignals = [...convertedLiveSignals, ...allSignals]
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 50); // Limit to latest 50 signals for performance
  
  // Signal analysis calculation
  const signalAnalysis = useSignalAnalysis(combinedSignals, selectedAssetId);
  
  // Check if there are active alert destinations
  const hasActiveDestinations = getAlertDestinations().some(dest => dest.active);

  // Auto-start engine if admin and not running
  useEffect(() => {
    if (isAdmin && !engineStatus.isRunning) {
      toast.info('המנוע אינו פועל', {
        description: 'לחץ על כפתור ההפעלה בכדי להתחיל לקבל איתותים',
        action: {
          label: 'הפעל מנוע',
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
          <h1 className="text-3xl font-bold">איתותי מסחר בזמן אמת</h1>
          {isAdmin && (
            <Badge variant="secondary" className="gap-1">
              <Zap className="h-3 w-3" />
              מנהל מערכת
            </Badge>
          )}
        </div>
        <p className="text-muted-foreground">
          מערכת איתותים מתקדמת עם האסטרטגיה האישית של אלמוג
        </p>
      </div>

      <TradingSignalsHeader
        realTimeActive={realTimeActive}
        toggleRealTimeAnalysis={toggleRealTimeAnalysis}
        showSettings={showSettings}
        setShowSettings={setShowSettings}
      />
      
      {/* Enhanced Real-time status indicator */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-muted-foreground">
              עדכונים בזמן אמת פעילים • {combinedSignals.length} איתותים
            </span>
          </div>
          <Badge variant={engineStatus.isRunning ? "default" : "outline"} className="gap-1">
            <Activity className="h-3 w-3" />
            מנוע: {engineStatus.isRunning ? 'פועל' : 'כבוי'}
          </Badge>
        </div>
        
        {liveSignals.filter(s => s.strategy === 'almog-personal-method').length > 0 && (
          <Badge className="bg-green-100 text-green-800 gap-1">
            <Brain className="h-3 w-3" />
            אסטרטגיה אישית פעילה
          </Badge>
        )}
      </div>
      
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
