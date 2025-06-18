
import React, { useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Target, BarChart4, Brain, Zap, Activity, CheckCircle } from 'lucide-react';
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

// Type guard for checking if metadata contains live_data
const hasLiveData = (metadata: any): boolean => {
  return typeof metadata === 'object' && 
         metadata !== null && 
         'live_data' in metadata && 
         metadata.live_data === true;
};

const TradingSignals = () => {
  const { isAdmin, user } = useAuth();
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
  
  // Connection state tracking
  const [isConnected, setIsConnected] = React.useState(false);
  const [connectionStatus, setConnectionStatus] = React.useState<'connecting' | 'connected' | 'disconnected'>('connecting');
  
  // LIVE signals from database with real-time subscription
  const { data: liveSignals = [], refetch } = useQuery({
    queryKey: ['live-trading-signals'],
    queryFn: async () => {
      if (!user) {
        console.log('No authenticated user, skipping signal fetch');
        return [];
      }
      
      const { data, error } = await supabase
        .from('trading_signals')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);
      
      if (error) {
        console.error('Error fetching live signals:', error);
        setConnectionStatus('disconnected');
        return [];
      }
      
      setConnectionStatus('connected');
      setIsConnected(true);
      return data || [];
    },
    refetchInterval: 5000,
    refetchIntervalInBackground: true,
    enabled: !!user, // Only run when user is authenticated
  });

  // Real-time subscription for LIVE signals with connection tracking
  useEffect(() => {
    if (!user) {
      console.log('No user authenticated, skipping real-time subscription');
      setIsConnected(false);
      setConnectionStatus('disconnected');
      return;
    }

    console.log('🔥 Setting up LIVE real-time subscription for trading signals...');
    setConnectionStatus('connecting');
    
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
          refetch();
          
          // Only show toast for personal strategy signals
          if (payload.new.strategy === 'almog-personal-method') {
            toast.success('🧠 איתות אישי LIVE חדש!', {
              description: `${payload.new.action?.toUpperCase()} ${payload.new.symbol} - האסטרטגיה שלך`,
              duration: 12000,
            });
          } else {
            toast.success('איתות LIVE חדש התקבל!', {
              description: `${payload.new.action?.toUpperCase()} ${payload.new.symbol} - ${payload.new.strategy}`,
              duration: 8000,
            });
          }
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
          setIsConnected(true);
          setConnectionStatus('connected');
        } else if (status === 'CHANNEL_ERROR') {
          console.error('❌ LIVE Real-time subscription error');
          setIsConnected(false);
          setConnectionStatus('disconnected');
          toast.error('שגיאה בחיבור זמן אמת - מנסה להתחבר מחדש...');
        } else if (status === 'CLOSED') {
          setIsConnected(false);
          setConnectionStatus('disconnected');
        }
      });

    return () => {
      console.log('Cleaning up LIVE real-time subscription');
      supabase.removeChannel(channel);
      setIsConnected(false);
      setConnectionStatus('disconnected');
    };
  }, [refetch, user]);

  // Auto-refresh LIVE signals every 30 seconds
  useEffect(() => {
    if (!user) return;

    const interval = setInterval(() => {
      console.log('🔄 Auto-refreshing LIVE signals (30s tick)');
      refetch();
    }, 30000);

    return () => clearInterval(interval);
  }, [refetch, user]);

  // Convert live signals to TradeSignal format - LIVE DATA ONLY with proper type checking
  const convertedLiveSignals: TradeSignal[] = liveSignals
    .filter(signal => hasLiveData(signal.metadata))
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

  // PRIORITIZE personal strategy signals - ALMOG'S SIGNALS FIRST
  const prioritizedSignals = convertedLiveSignals
    .sort((a, b) => {
      // Personal strategy signals always come first
      if (a.strategy === 'almog-personal-method' && b.strategy !== 'almog-personal-method') return -1;
      if (b.strategy === 'almog-personal-method' && a.strategy !== 'almog-personal-method') return 1;
      
      // Then by timestamp
      return b.timestamp - a.timestamp;
    })
    .slice(0, 50);
  
  const signalAnalysis = useSignalAnalysis(prioritizedSignals, selectedAssetId);
  const hasActiveDestinations = getAlertDestinations().some(dest => dest.active);

  // Auto-notify admin if engine not running
  useEffect(() => {
    if (isAdmin && !engineStatus.isRunning && user) {
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
  }, [isAdmin, engineStatus.isRunning, startEngine, user]);

  // Count personal strategy signals
  const personalStrategySignals = prioritizedSignals.filter(s => s.strategy === 'almog-personal-method');
  
  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      {/* Enhanced Header with Connection Status */}
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
      
      {/* Enhanced LIVE status indicator with connection state */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className={`h-2 w-2 rounded-full ${
              connectionStatus === 'connected' ? 'bg-green-500 animate-pulse' : 
              connectionStatus === 'connecting' ? 'bg-yellow-500 animate-pulse' : 
              'bg-red-500'
            }`}></div>
            <span className="text-sm text-muted-foreground">
              {connectionStatus === 'connected' && (
                <>🔥 מחובר LIVE • {prioritizedSignals.length} איתותים אמיתיים</>
              )}
              {connectionStatus === 'connecting' && (
                <>🔄 מתחבר למערכת LIVE...</>
              )}
              {connectionStatus === 'disconnected' && (
                <>❌ לא מחובר - מנסה להתחבר מחדש</>
              )}
            </span>
          </div>
          <Badge variant={engineStatus.isRunning ? "default" : "outline"} className="gap-1">
            <Activity className="h-3 w-3" />
            מנוע LIVE: {engineStatus.isRunning ? 'פועל' : 'כבוי'}
          </Badge>
          {isConnected && (
            <Badge variant="default" className="gap-1 bg-green-600">
              <CheckCircle className="h-3 w-3" />
              משתמש מחובר
            </Badge>
          )}
        </div>
        
        {personalStrategySignals.length > 0 && (
          <Badge className="bg-gradient-to-r from-green-500 to-blue-500 text-white gap-1">
            <Brain className="h-3 w-3" />
            {personalStrategySignals.length} איתותים אישיים LIVE
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
            איתותי LIVE ({prioritizedSignals.length})
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
            allSignals={prioritizedSignals}
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
