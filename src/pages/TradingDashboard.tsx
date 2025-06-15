
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { 
  Activity, 
  TrendingUp, 
  Settings, 
  Play, 
  Pause, 
  RefreshCw,
  Signal,
  Eye,
  Target,
  DollarSign,
  AlertTriangle
} from 'lucide-react';
import { tradingEngine } from '@/services/trading/tradingEngine';
import { strategyEngine } from '@/services/trading/strategyEngine';
import { telegramBot } from '@/services/telegram/telegramBot';
import { TradingSignal, SystemHealth } from '@/types/trading';

const TradingDashboard = () => {
  const [isEngineRunning, setIsEngineRunning] = useState(false);
  const [signals, setSignals] = useState<TradingSignal[]>([]);
  const [systemHealth, setSystemHealth] = useState<SystemHealth | null>(null);
  const [watchList, setWatchList] = useState<string[]>([]);
  const [activeStrategies, setActiveStrategies] = useState(0);
  const [engineStats, setEngineStats] = useState({
    totalSignals: 0,
    profitableSignals: 0,
    successRate: 0
  });

  useEffect(() => {
    // Initialize dashboard
    updateDashboardData();
    
    // Listen for trading signals
    const handleNewSignal = (event: CustomEvent) => {
      const signal = event.detail as TradingSignal;
      setSignals(prev => [signal, ...prev.slice(0, 19)]); // Keep last 20 signals
      updateStats();
    };

    // Listen for system health updates
    const handleHealthUpdate = (event: CustomEvent) => {
      const health = event.detail as SystemHealth;
      setSystemHealth(health);
    };

    window.addEventListener('trading-signal', handleNewSignal as EventListener);
    window.addEventListener('system-health-update', handleHealthUpdate as EventListener);

    // Auto-refresh every 30 seconds
    const interval = setInterval(updateDashboardData, 30000);

    return () => {
      window.removeEventListener('trading-signal', handleNewSignal as EventListener);
      window.removeEventListener('system-health-update', handleHealthUpdate as EventListener);
      clearInterval(interval);
    };
  }, []);

  const updateDashboardData = () => {
    setIsEngineRunning(tradingEngine.getIsRunning());
    setSignals(tradingEngine.getAllSignals());
    setSystemHealth(tradingEngine.getSystemHealth());
    setWatchList(tradingEngine.getWatchList());
    setActiveStrategies(strategyEngine.getActiveStrategies().length);
    updateStats();
  };

  const updateStats = () => {
    const allSignals = tradingEngine.getAllSignals();
    const profitable = allSignals.filter(s => 
      s.result && s.result.profit && s.result.profit > 0
    ).length;
    
    setEngineStats({
      totalSignals: allSignals.length,
      profitableSignals: profitable,
      successRate: allSignals.length > 0 ? (profitable / allSignals.length) * 100 : 0
    });
  };

  const handleEngineToggle = async () => {
    try {
      if (isEngineRunning) {
        tradingEngine.stop();
        setIsEngineRunning(false);
        toast.info('מנוע המסחר הופסק');
      } else {
        await tradingEngine.start();
        setIsEngineRunning(true);
        toast.success('מנוע המסחר הופעל');
      }
    } catch (error) {
      toast.error('שגיאה בהפעלת/הפסקת המנוע');
    }
  };

  const handleTestTelegram = async () => {
    await telegramBot.sendTestMessage();
  };

  const handleRefresh = () => {
    updateDashboardData();
    toast.success('נתונים עודכנו');
  };

  const getHealthColor = (isHealthy: boolean) => {
    return isHealthy ? 'bg-green-500' : 'bg-red-500';
  };

  const getSignalTypeColor = (action: string) => {
    return action === 'buy' ? 'text-green-600' : 'text-red-600';
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 8
    }).format(price);
  };

  return (
    <div className="container mx-auto py-6 px-4 md:px-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">🔐 LeviPro - מערכת מסחר אוטומטית</h1>
          <p className="text-muted-foreground mt-1">
            מערכת מסחר מתקדמת עם AI ושיטות מסחר מובילות
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant={isEngineRunning ? "destructive" : "default"}
            onClick={handleEngineToggle}
            className="flex items-center gap-2"
          >
            {isEngineRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            {isEngineRunning ? 'הפסק מנוע' : 'הפעל מנוע'}
          </Button>
          
          <Button variant="outline" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">סטטוס מנוע</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <Badge variant={isEngineRunning ? "default" : "secondary"}>
                {isEngineRunning ? 'פועל' : 'כבוי'}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              {watchList.length} נכסים במעקב
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">איתותים פעילים</CardTitle>
            <Signal className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{signals.filter(s => s.status === 'active').length}</div>
            <p className="text-xs text-muted-foreground">
              {engineStats.totalSignals} איתותים סה"כ
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">שיעור הצלחה</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{engineStats.successRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              {engineStats.profitableSignals} רווחיים מתוך {engineStats.totalSignals}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">אסטרטגיות פעילות</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeStrategies}</div>
            <p className="text-xs text-muted-foreground">
              כולל שיטה אישית ו-8 שיטות נוספות
            </p>
          </CardContent>
        </Card>
      </div>

      {/* System Health */}
      {systemHealth && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              מצב המערכת
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${getHealthColor(systemHealth.binance)}`} />
                <span className="text-sm">Binance</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${getHealthColor(systemHealth.tradingView)}`} />
                <span className="text-sm">TradingView</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${getHealthColor(systemHealth.twitter)}`} />
                <span className="text-sm">Twitter</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${getHealthColor(systemHealth.coinGecko)}`} />
                <span className="text-sm">CoinGecko</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${getHealthColor(systemHealth.telegram)}`} />
                <span className="text-sm">Telegram</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${getHealthColor(systemHealth.fundamentalData)}`} />
                <span className="text-sm">נתונים</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Content Tabs */}
      <Tabs defaultValue="signals" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="signals">איתותי מסחר</TabsTrigger>
          <TabsTrigger value="strategies">אסטרטגיות</TabsTrigger>
          <TabsTrigger value="settings">הגדרות</TabsTrigger>
        </TabsList>

        <TabsContent value="signals" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>איתותי מסחר אחרונים</CardTitle>
            </CardHeader>
            <CardContent>
              {signals.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  לא נמצאו איתותים. הפעל את המנוע כדי להתחיל לקבל איתותים.
                </div>
              ) : (
                <div className="space-y-4">
                  {signals.slice(0, 10).map((signal) => (
                    <div key={signal.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant={signal.action === 'buy' ? 'default' : 'destructive'}>
                            {signal.action === 'buy' ? 'קנייה' : 'מכירה'}
                          </Badge>
                          <span className="font-semibold">{signal.symbol}</span>
                          <Badge variant="outline">{signal.strategy}</Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {signal.reasoning}
                        </div>
                      </div>
                      
                      <div className="text-right space-y-1">
                        <div className="text-sm">
                          <span className="font-medium">מחיר: </span>
                          {formatPrice(signal.price)}
                        </div>
                        <div className="text-sm">
                          <span className="font-medium">יעד: </span>
                          {formatPrice(signal.targetPrice)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          ביטחון: {(signal.confidence * 100).toFixed(0)}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="strategies" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>ניהול אסטרטגיות מסחר</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {strategyEngine.getActiveStrategies().map((strategy) => (
                  <div key={strategy.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">{strategy.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        משקל: {(strategy.weight * 100).toFixed(0)}% | 
                        הצלחה: {(strategy.successRate * 100).toFixed(1)}% | 
                        איתותים: {strategy.totalSignals}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch 
                        checked={strategy.isActive}
                        onCheckedChange={(checked) => {
                          strategy.isActive = checked;
                          strategyEngine.updateStrategy(strategy);
                          updateDashboardData();
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>הגדרות מערכת</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="auto-trading">מסחר אוטומטי</Label>
                  <p className="text-sm text-muted-foreground">
                    הפעל מסחר אוטומטי (דורש חיבור Binance)
                  </p>
                </div>
                <Switch id="auto-trading" />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="telegram-alerts">התראות טלגרם</Label>
                  <p className="text-sm text-muted-foreground">
                    שלח איתותים לטלגרם (@mytrsdingbot)
                  </p>
                </div>
                <Switch id="telegram-alerts" defaultChecked />
              </div>

              <div className="space-y-2">
                <Label>בדיקת חיבור טלגרם</Label>
                <Button onClick={handleTestTelegram} variant="outline">
                  שלח הודעת בדיקה
                </Button>
              </div>

              <div className="space-y-2">
                <Label>רשימת מעקב</Label>
                <div className="flex flex-wrap gap-2">
                  {watchList.map((symbol) => (
                    <Badge key={symbol} variant="outline">
                      {symbol}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TradingDashboard;
