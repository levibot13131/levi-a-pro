
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
  Signal
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

  const symbols = ['BTCUSDT', 'ETHUSDT', 'SOLUSDT', 'BNBUSDT'];

  // Fetch signals from database
  const { data: fetchedSignals, refetch } = useQuery({
    queryKey: ['trading-signals'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('trading_signals')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);
      
      if (error) {
        console.error('Error fetching signals:', error);
        return [];
      }
      
      return data || [];
    },
    refetchInterval: 5000, // Refresh every 5 seconds
  });

  useEffect(() => {
    if (fetchedSignals) {
      setSignals(fetchedSignals);
      setLastUpdate(new Date());
    }
  }, [fetchedSignals]);

  // Set up real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel('trading-signals-updates')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'trading_signals'
        },
        (payload) => {
          console.log('New signal received:', payload);
          setSignals(prev => [payload.new as TradingSignal, ...prev.slice(0, 19)]);
          setLastUpdate(new Date());
          toast.success('איתות חדש התקבל!', {
            description: `${payload.new.action} ${payload.new.symbol}`
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const startTradingEngine = async () => {
    try {
      setIsEngineRunning(true);
      toast.loading('מפעיל מנוע מסחר...');
      
      const { data, error } = await supabase.functions.invoke('trading-signals-engine');
      
      if (error) {
        throw error;
      }
      
      toast.success('מנוע המסחר הופעל בהצלחה');
      refetch();
    } catch (error) {
      console.error('Error starting trading engine:', error);
      toast.error('שגיאה בהפעלת המנוע');
      setIsEngineRunning(false);
    }
  };

  const stopTradingEngine = () => {
    setIsEngineRunning(false);
    toast.info('מנוע המסחר הופסק');
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

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Select value={selectedSymbol} onValueChange={setSelectedSymbol}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
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
          
          <Button variant="outline" onClick={() => refetch()}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Chart */}
      <LiveTradingViewChart 
        symbol={selectedSymbol}
        height={500}
      />

      {/* Signals Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-right">
              איתותי מסחר אחרונים
              <Signal className="h-5 w-5" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {signals.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  אין איתותים זמינים
                  <br />
                  הפעל את המנוע כדי להתחיל לקבל איתותים
                </div>
              ) : (
                signals.map((signal) => (
                  <div key={signal.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {getSignalIcon(signal.action)}
                        <Badge variant={signal.action === 'buy' ? 'default' : 'destructive'}>
                          {signal.action === 'buy' ? 'קנייה' : 'מכירה'}
                        </Badge>
                        <span className="font-semibold">{signal.symbol}</span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {signal.reasoning}
                      </div>
                    </div>
                    
                    <div className="text-right text-sm">
                      <div>{formatPrice(signal.price)}</div>
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
            <CardTitle className="text-right">סטטיסטיקות</CardTitle>
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
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RealTimeTradingDashboard;
