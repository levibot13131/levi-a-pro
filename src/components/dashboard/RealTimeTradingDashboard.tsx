
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { 
  Play, 
  Pause, 
  RefreshCw, 
  TrendingUp, 
  TrendingDown,
  Activity,
  Signal,
  Zap
} from 'lucide-react';
import LiveTradingViewChart from '../charts/LiveTradingViewChart';

interface TradingSignal {
  id: string;
  symbol: string;
  strategy: string;
  action: string;
  price: number;
  target_price: number;
  stop_loss: number;
  confidence: number;
  reasoning: string;
  created_at: string;
  status: string;
}

const RealTimeTradingDashboard = () => {
  const [selectedSymbol, setSelectedSymbol] = useState('BTCUSDT');
  const [isEngineRunning, setIsEngineRunning] = useState(false);
  const [signals, setSignals] = useState<TradingSignal[]>([]);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'connecting' | 'disconnected'>('connecting');

  const symbols = ['BTCUSDT', 'ETHUSDT', 'SOLUSDT', 'BNBUSDT', 'ADAUSDT', 'DOTUSDT'];

  // Enhanced signals fetching with better real-time updates
  const { data: fetchedSignals, refetch, isLoading } = useQuery({
    queryKey: ['real-time-trading-signals', selectedSymbol],
    queryFn: async () => {
      const query = supabase
        .from('trading_signals')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);
      
      // Filter by symbol if not showing all
      if (selectedSymbol !== 'ALL') {
        query.eq('symbol', selectedSymbol);
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching signals:', error);
        throw error;
      }
      
      return data || [];
    },
    refetchInterval: 5000, // Refresh every 5 seconds
    refetchIntervalInBackground: true,
  });

  useEffect(() => {
    if (fetchedSignals) {
      setSignals(fetchedSignals);
      setLastUpdate(new Date());
    }
  }, [fetchedSignals]);

  // Set up enhanced real-time subscription
  useEffect(() => {
    console.log('🔌 Setting up real-time dashboard subscription...');
    setConnectionStatus('connecting');
    
    const channel = supabase
      .channel('trading-dashboard-live')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'trading_signals'
        },
        (payload) => {
          console.log('📢 New signal received in dashboard:', payload);
          const newSignal = payload.new as TradingSignal;
          
          // Only add if it matches current filter or showing all
          if (selectedSymbol === 'ALL' || newSignal.symbol === selectedSymbol) {
            setSignals(prev => [newSignal, ...prev.slice(0, 49)]);
            setLastUpdate(new Date());
            
            toast.success(`🚀 איתות חדש: ${newSignal.action.toUpperCase()}`, {
              description: `${newSignal.symbol} - ${newSignal.reasoning.substring(0, 50)}...`,
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
          console.log('📝 Signal updated in dashboard:', payload);
          refetch(); // Refresh on updates
          setLastUpdate(new Date());
        }
      )
      .subscribe((status) => {
        console.log('Dashboard subscription status:', status);
        if (status === 'SUBSCRIBED') {
          setConnectionStatus('connected');
          console.log('✅ Dashboard successfully connected to real-time updates');
        } else if (status === 'CHANNEL_ERROR') {
          setConnectionStatus('disconnected');
          console.error('❌ Dashboard real-time connection failed');
        }
      });

    return () => {
      console.log('🔌 Cleaning up dashboard subscription');
      supabase.removeChannel(channel);
    };
  }, [selectedSymbol, refetch]);

  const startTradingEngine = async () => {
    try {
      setIsEngineRunning(true);
      
      // Call the trading engine function
      const { data, error } = await supabase.functions.invoke('trading-signals-engine', {
        body: { action: 'start', symbols: symbols }
      });
      
      if (error) {
        throw error;
      }
      
      toast.success('🚀 מנוע המסחר הופעל בהצלחה', {
        description: 'המערכת תתחיל לייצר איתותים בזמן אמת'
      });
      refetch();
    } catch (error) {
      console.error('Error starting trading engine:', error);
      toast.error('שגיאה בהפעלת המנוע', {
        description: 'נסה שוב או בדוק את החיבור לשרת'
      });
      setIsEngineRunning(false);
    }
  };

  const stopTradingEngine = () => {
    setIsEngineRunning(false);
    toast.info('⏹️ מנוע המסחר הופסק');
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 6
    }).format(price);
  };

  const getSignalIcon = (action: string) => {
    return action === 'buy' ? <TrendingUp className="h-4 w-4 text-green-500" /> : <TrendingDown className="h-4 w-4 text-red-500" />;
  };

  const getConnectionStatusBadge = () => {
    switch (connectionStatus) {
      case 'connected':
        return <Badge className="bg-green-100 text-green-800"><Zap className="h-3 w-3 mr-1" />מחובר</Badge>;
      case 'connecting':
        return <Badge className="bg-yellow-100 text-yellow-800"><Activity className="h-3 w-3 mr-1 animate-pulse" />מתחבר</Badge>;
      case 'disconnected':
        return <Badge variant="destructive"><Activity className="h-3 w-3 mr-1" />מנותק</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Enhanced Header Controls */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Select value={selectedSymbol} onValueChange={setSelectedSymbol}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">כל הסמלים</SelectItem>
              {symbols.map(symbol => (
                <SelectItem key={symbol} value={symbol}>
                  {symbol}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Badge variant={isEngineRunning ? "default" : "secondary"}>
            <Activity className="h-3 w-3 mr-1" />
            {isEngineRunning ? 'פועל' : 'כבוי'}
          </Badge>

          {getConnectionStatusBadge()}
        </div>

        <div className="flex gap-2">
          <Button
            variant={isEngineRunning ? "destructive" : "default"}
            onClick={isEngineRunning ? stopTradingEngine : startTradingEngine}
            className="gap-2"
          >
            {isEngineRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            {isEngineRunning ? 'הפסק מנוע' : 'הפעל מנוע'}
          </Button>
          
          <Button variant="outline" onClick={() => refetch()} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      {/* Chart with selected symbol */}
      {selectedSymbol !== 'ALL' && (
        <LiveTradingViewChart 
          symbol={selectedSymbol}
          height={500}
        />
      )}

      {/* Enhanced Signals Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-right">
              איתותי מסחר בזמן אמת
              <div className="flex items-center gap-2">
                <Signal className="h-5 w-5" />
                <Badge variant="outline">{signals.length}</Badge>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {signals.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      טוען איתותים...
                    </div>
                  ) : (
                    <>
                      אין איתותים זמינים
                      <br />
                      הפעל את המנוע כדי להתחיל לקבל איתותים
                    </>
                  )}
                </div>
              ) : (
                signals.map((signal) => (
                  <div key={signal.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {getSignalIcon(signal.action)}
                        <Badge variant={signal.action === 'buy' ? 'default' : 'destructive'}>
                          {signal.action === 'buy' ? 'קנייה' : 'מכירה'}
                        </Badge>
                        <span className="font-semibold">{signal.symbol}</span>
                        <Badge variant="outline" className="text-xs">
                          {signal.strategy}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {signal.reasoning.length > 60 
                          ? `${signal.reasoning.substring(0, 60)}...` 
                          : signal.reasoning
                        }
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {new Date(signal.created_at).toLocaleString('he-IL')}
                      </div>
                    </div>
                    
                    <div className="text-right text-sm">
                      <div className="font-medium">{formatPrice(signal.price)}</div>
                      <div className="text-xs text-muted-foreground">
                        ביטחון: {(signal.confidence * 100).toFixed(0)}%
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-right">סטטיסטיקות זמן אמת</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span>סה"כ איתותים:</span>
                <span className="font-semibold">{signals.length}</span>
              </div>
              <div className="flex justify-between">
                <span>איתותי קנייה:</span>
                <span className="font-semibold text-green-600">
                  {signals.filter(s => s.action === 'buy').length}
                </span>
              </div>
              <div className="flex justify-between">
                <span>איתותי מכירה:</span>
                <span className="font-semibold text-red-600">
                  {signals.filter(s => s.action === 'sell').length}
                </span>
              </div>
              <div className="flex justify-between">
                <span>עדכון אחרון:</span>
                <span className="text-sm text-muted-foreground">
                  {lastUpdate.toLocaleTimeString('he-IL')}
                </span>
              </div>
              <div className="flex justify-between">
                <span>סטטוס חיבור:</span>
                {getConnectionStatusBadge()}
              </div>
              <div className="flex justify-between">
                <span>ביטחון ממוצע:</span>
                <span className="font-semibold">
                  {signals.length > 0 
                    ? `${Math.round(signals.reduce((acc, s) => acc + s.confidence, 0) / signals.length * 100)}%`
                    : 'N/A'
                  }
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RealTimeTradingDashboard;
