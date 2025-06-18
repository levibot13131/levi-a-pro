import React, { useEffect, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Target, BarChart4, Brain, Zap, Activity, CheckCircle, AlertTriangle } from 'lucide-react';
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

// Enhanced type guard for metadata with better validation
const hasLiveData = (metadata: any): boolean => {
  if (!metadata) return false;
  if (typeof metadata === 'string') {
    try {
      const parsed = JSON.parse(metadata);
      return parsed && typeof parsed === 'object' && parsed.live_data === true;
    } catch {
      return false;
    }
  }
  return typeof metadata === 'object' && 
         metadata !== null && 
         'live_data' in metadata && 
         metadata.live_data === true;
};

const TradingSignals = () => {
  const { isAdmin, user, isAuthenticated } = useAuth();
  const { status: engineStatus, startEngine } = useEngineStatus();
  
  // ... keep existing code for useTradingSignals hook
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
  
  // Enhanced connection state tracking with better initialization
  const [isConnected, setIsConnected] = React.useState(false);
  const [connectionStatus, setConnectionStatus] = React.useState<'connecting' | 'connected' | 'disconnected'>('connecting');
  const [lastSignalTime, setLastSignalTime] = React.useState<Date | null>(null);
  
  // LIVE signals from database with enhanced real-time subscription
  const { data: liveSignals = [], refetch, isLoading: signalsIsLoading } = useQuery({
    queryKey: ['live-trading-signals'],
    queryFn: async () => {
      if (!user || !isAuthenticated) {
        console.log('No authenticated user, skipping signal fetch');
        return [];
      }
      
      console.log('🔍 Fetching live signals for authenticated user:', user.email);
      
      const { data, error } = await supabase
        .from('trading_signals')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);
      
      if (error) {
        console.error('❌ Error fetching live signals:', error);
        setConnectionStatus('disconnected');
        toast.error('שגיאה בטעינת איתותים - מנסה להתחבר מחדש');
        return [];
      }
      
      console.log(`✅ Successfully fetched ${data?.length || 0} signals`);
      setConnectionStatus('connected');
      setIsConnected(true);
      
      if (data && data.length > 0) {
        setLastSignalTime(new Date(data[0].created_at));
      }
      
      return data || [];
    },
    refetchInterval: 5000,
    refetchIntervalInBackground: true,
    enabled: !!user && isAuthenticated,
    retry: 3,
    retryDelay: 2000,
  });

  // Enhanced real-time subscription with better error handling
  useEffect(() => {
    if (!user || !isAuthenticated) {
      console.log('❌ No authenticated user, skipping real-time subscription');
      setIsConnected(false);
      setConnectionStatus('disconnected');
      return;
    }

    console.log('🔥 Setting up ENHANCED real-time subscription for user:', user.email);
    setConnectionStatus('connecting');
    
    const channel = supabase
      .channel('live-trading-signals-enhanced')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'trading_signals'
        },
        (payload) => {
          console.log('🚀 NEW LIVE SIGNAL received:', payload);
          setLastSignalTime(new Date());
          refetch();
          
          const newSignal = payload.new as any;
          if (newSignal.strategy === 'almog-personal-method') {
            toast.success('🧠 איתות אישי LIVE חדש!', {
              description: `${newSignal.action?.toUpperCase()} ${newSignal.symbol} - האסטרטגיה שלך`,
              duration: 15000,
            });
          } else {
            toast.success('🔥 איתות LIVE חדש התקבל!', {
              description: `${newSignal.action?.toUpperCase()} ${newSignal.symbol} - ${newSignal.strategy}`,
              duration: 10000,
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
          console.log('📝 Signal updated:', payload);
          setLastSignalTime(new Date());
          refetch();
        }
      )
      .subscribe((status) => {
        console.log('📡 Real-time subscription status:', status);
        if (status === 'SUBSCRIBED') {
          console.log('✅ Successfully subscribed to LIVE signals');
          setIsConnected(true);
          setConnectionStatus('connected');
          toast.success('🔥 מחובר למערכת LIVE!', {
            description: 'מקבל איתותים בזמן אמת',
            duration: 5000,
          });
        } else if (status === 'CHANNEL_ERROR') {
          console.error('❌ Real-time subscription error');
          setIsConnected(false);
          setConnectionStatus('disconnected');
          toast.error('❌ שגיאה בחיבור זמן אמת - מנסה להתחבר מחדש...');
        } else if (status === 'CLOSED') {
          setIsConnected(false);
          setConnectionStatus('disconnected');
        }
      });

    return () => {
      console.log('🔌 Cleaning up enhanced real-time subscription');
      supabase.removeChannel(channel);
      setIsConnected(false);
      setConnectionStatus('disconnected');
    };
  }, [refetch, user, isAuthenticated]);

  // Enhanced auto-refresh with better timing
  useEffect(() => {
    if (!user || !isAuthenticated) return;

    const interval = setInterval(() => {
      console.log('🔄 Auto-refreshing LIVE signals (30s enhanced tick)');
      refetch();
    }, 30000);

    return () => clearInterval(interval);
  }, [refetch, user, isAuthenticated]);

  // Enhanced signal conversion with better error handling
  const convertedLiveSignals: TradeSignal[] = React.useMemo(() => {
    if (!liveSignals) return [];
    
    return liveSignals
      .filter(signal => {
        try {
          return hasLiveData(signal.metadata);
        } catch (error) {
          console.warn('Error checking live_data for signal:', signal.id, error);
          return false;
        }
      })
      .map(signal => {
        try {
          return {
            id: signal.id,
            assetId: signal.symbol,
            type: signal.action as 'buy' | 'sell',
            message: signal.reasoning || 'איתות LIVE',
            timestamp: new Date(signal.created_at).getTime(),
            price: signal.price || 0,
            strength: signal.confidence > 0.8 ? 'strong' : signal.confidence > 0.6 ? 'medium' : 'weak',
            strategy: signal.strategy || 'unknown',
            timeframe: '1h' as const,
            createdAt: new Date(signal.created_at).getTime(),
          };
        } catch (error) {
          console.error('Error converting signal:', signal.id, error);
          return null;
        }
      })
      .filter(Boolean) as TradeSignal[];
  }, [liveSignals]);

  // Enhanced prioritization with absolute personal strategy priority
  const prioritizedSignals = React.useMemo(() => {
    return convertedLiveSignals
      .sort((a, b) => {
        // ABSOLUTE PRIORITY: Personal strategy signals ALWAYS first
        if (a.strategy === 'almog-personal-method' && b.strategy !== 'almog-personal-method') return -1;
        if (b.strategy === 'almog-personal-method' && a.strategy !== 'almog-personal-method') return 1;
        
        // Then by timestamp
        return b.timestamp - a.timestamp;
      })
      .slice(0, 50);
  }, [convertedLiveSignals]);
  
  const signalAnalysis = useSignalAnalysis(prioritizedSignals, selectedAssetId);
  const hasActiveDestinations = getAlertDestinations().some(dest => dest.active);

  // Auto-notify and start engine for authenticated users
  useEffect(() => {
    if (isAuthenticated && user && !engineStatus.isRunning) {
      setTimeout(async () => {
        await startEngine();
        toast.success('🚀 מנוע האיתותים הופעל אוטומatically!', {
          description: 'האסטרטגיה האישית שלך פועלת עכשיו',
          duration: 8000,
        });
      }, 2000);
    }
  }, [isAuthenticated, user, engineStatus.isRunning, startEngine]);

  // Enhanced statistics
  const personalStrategySignals = prioritizedSignals.filter(s => s.strategy === 'almog-personal-method');
  const totalLiveSignals = prioritizedSignals.length;
  const connectionUptime = lastSignalTime ? 
    Math.floor((Date.now() - lastSignalTime.getTime()) / 1000) : 0;

  // Enhanced connection status display
  const getConnectionStatusDisplay = () => {
    if (!isAuthenticated || !user) {
      return {
        color: 'bg-red-500',
        text: '❌ לא מחובר - נדרש אימות',
        description: 'התחבר כדי לקבל איתותים'
      };
    }

    switch (connectionStatus) {
      case 'connected':
        return {
          color: 'bg-green-500 animate-pulse',
          text: `🔥 מחובר LIVE • ${totalLiveSignals} איתותים`,
          description: `משתמש: ${user.email?.split('@')[0]} | עדכון אחרון: ${lastSignalTime?.toLocaleTimeString('he-IL') || 'לא זמין'}`
        };
      case 'connecting':
        return {
          color: 'bg-yellow-500 animate-pulse',
          text: '🔄 מתחבר למערכת LIVE...',
          description: 'ממתין לחיבור'
        };
      case 'disconnected':
        return {
          color: 'bg-red-500',
          text: '❌ לא מחובר - מנסה להתחבר מחדש',
          description: 'בעיה בחיבור'
        };
      default:
        return {
          color: 'bg-gray-500',
          text: '⚪ סטטוס לא ידוע',
          description: 'בודק חיבור...'
        };
    }
  };

  const connectionDisplay = getConnectionStatusDisplay();

  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      {/* Enhanced Header with Real Connection Status */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Brain className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">מערכת איתותי מסחר LIVE - LeviPro</h1>
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
      
      {/* Enhanced LIVE Status Panel */}
      <Card className="mb-4 border-2 border-primary/20">
        <CardContent className="pt-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className={`h-3 w-3 rounded-full ${connectionDisplay.color}`}></div>
                <div>
                  <span className="font-semibold">{connectionDisplay.text}</span>
                  <p className="text-xs text-muted-foreground">{connectionDisplay.description}</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <Badge variant={engineStatus.isRunning ? "default" : "outline"} className="gap-1">
                <Activity className="h-3 w-3" />
                מנוע: {engineStatus.isRunning ? '🔥 פועל LIVE' : '⚪ כבוי'}
              </Badge>
              
              {isAuthenticated && isConnected && (
                <Badge variant="default" className="gap-1 bg-green-600">
                  <CheckCircle className="h-3 w-3" />
                  משתמש מאומת
                </Badge>
              )}
              
              {personalStrategySignals.length > 0 && (
                <Badge className="bg-gradient-to-r from-green-500 to-blue-500 text-white gap-1">
                  <Brain className="h-3 w-3" />
                  {personalStrategySignals.length} איתותים אישיים LIVE
                </Badge>
              )}
            </div>
          </div>

          {/* Enhanced Live Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
            <div className="flex justify-between">
              <span>סה"כ איתותים LIVE:</span>
              <span className="font-semibold text-green-600">{totalLiveSignals}</span>
            </div>
            <div className="flex justify-between">
              <span>איתותים אישיים:</span>
              <span className="font-semibold text-blue-600">{personalStrategySignals.length}</span>
            </div>
            <div className="flex justify-between">
              <span>מנוע פועל:</span>
              <span className={`font-semibold ${engineStatus.isRunning ? 'text-green-600' : 'text-red-600'}`}>
                {engineStatus.isRunning ? '✅ כן' : '❌ לא'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>זמן חיבור:</span>
              <span className="font-semibold">
                {connectionUptime > 0 ? `${connectionUptime}s` : 'N/A'}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
      
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
            signalsLoading={signalsIsLoading}
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
