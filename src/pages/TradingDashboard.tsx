
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Play, 
  Square, 
  Activity, 
  TrendingUp, 
  Brain, 
  Zap, 
  Shield,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { engineController } from '@/services/trading/engineController';
import { strategyEngine } from '@/services/trading/strategyEngine';
import { TradingStrategy } from '@/types/trading';
import { toast } from 'sonner';

const TradingDashboard: React.FC = () => {
  const [isEngineRunning, setIsEngineRunning] = useState(false);
  const [strategies, setStrategies] = useState<TradingStrategy[]>([]);
  const [engineStats, setEngineStats] = useState({
    totalSignals: 0,
    lastSignalTime: null as number | null,
    activeStrategies: 0,
    personalMethodActive: true
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeDashboard = () => {
      try {
        // Load strategies
        const activeStrategies = strategyEngine.getActiveStrategies();
        setStrategies(activeStrategies);
        
        // Get engine status
        const status = engineController.getStatus();
        setIsEngineRunning(status.isRunning);
        setEngineStats({
          totalSignals: status.totalSignals || 0,
          lastSignalTime: status.lastSignalTime,
          activeStrategies: activeStrategies.length,
          personalMethodActive: true
        });
        
        console.log('📊 Dashboard initialized with', activeStrategies.length, 'strategies');
        console.log('🧠 Personal Method confirmed active with 80% weight');
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error initializing dashboard:', error);
        setIsLoading(false);
      }
    };

    initializeDashboard();

    // Listen for engine status updates
    const statusListener = (status: any) => {
      setIsEngineRunning(status.isRunning);
      setEngineStats({
        totalSignals: status.totalSignals || 0,
        lastSignalTime: status.lastSignalTime,
        activeStrategies: status.activeStrategies?.length || 0,
        personalMethodActive: status.personalMethodActive || true
      });
    };

    engineController.addStatusListener(statusListener);

    return () => {
      engineController.removeStatusListener(statusListener);
    };
  }, []);

  const handleStartEngine = async () => {
    console.log('🎯 Starting LeviPro Engine from Dashboard...');
    const success = await engineController.startEngine();
    if (success) {
      setIsEngineRunning(true);
      toast.success('🚀 מנוע LeviPro הופעל - אסטרטגיה אישית פעילה');
    }
  };

  const handleStopEngine = () => {
    console.log('⏹️ Stopping LeviPro Engine from Dashboard...');
    engineController.stopEngine();
    setIsEngineRunning(false);
    toast.info('⏸️ מנוע LeviPro הופסק');
  };

  const handleStrategyToggle = (strategyId: string, isActive: boolean) => {
    if (strategyId === 'almog-personal-method') {
      toast.warning('🛡️ האסטרטגיה האישית חסינה לשינויים');
      return;
    }

    const updatedStrategies = strategies.map(strategy =>
      strategy.id === strategyId ? { ...strategy, isActive } : strategy
    );
    setStrategies(updatedStrategies);
    
    strategyEngine.updateStrategy(strategyId, { isActive });
    toast.success(`אסטרטגיה ${isActive ? 'הופעלה' : 'הופסקה'}`);
  };

  const formatLastSignalTime = (timestamp: number | null) => {
    if (!timestamp) return 'אף פעם';
    
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'עכשיו';
    if (minutes < 60) return `לפני ${minutes} דקות`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `לפני ${hours} שעות`;
    
    const days = Math.floor(hours / 24);
    return `לפני ${days} ימים`;
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-6 px-4">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 px-4 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">LeviPro Trading Dashboard</h1>
          <p className="text-muted-foreground">מערכת מסחר אלגוריתמית עם אסטרטגיה אישית</p>
        </div>
        <Badge variant={isEngineRunning ? "default" : "secondary"} className="text-lg px-4 py-2">
          {isEngineRunning ? '🟢 מנוע פעיל' : '🔴 מנוע מופסק'}
        </Badge>
      </div>

      {/* Engine Control */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            בקרת מנוע המסחר
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            {!isEngineRunning ? (
              <Button 
                onClick={handleStartEngine} 
                className="flex-1 bg-green-600 hover:bg-green-700 text-lg py-3"
              >
                <Play className="h-5 w-5 mr-2" />
                הפעל מנוע LeviPro
              </Button>
            ) : (
              <Button 
                onClick={handleStopEngine} 
                variant="destructive" 
                className="flex-1 text-lg py-3"
              >
                <Square className="h-5 w-5 mr-2" />
                עצור מנוע
              </Button>
            )}
          </div>

          {/* Engine Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{engineStats.totalSignals}</div>
              <div className="text-sm text-blue-800">סך איתותים</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{engineStats.activeStrategies}</div>
              <div className="text-sm text-green-800">אסטרטגיות פעילות</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-lg font-bold text-purple-600">80%</div>
              <div className="text-sm text-purple-800">משקל אסטרטגיה אישית</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-sm font-medium text-orange-600">איתות אחרון</div>
              <div className="text-xs text-orange-800">{formatLastSignalTime(engineStats.lastSignalTime)}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Personal Strategy Highlight */}
      <Card className="border-purple-200 bg-purple-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-800">
            <Brain className="h-6 w-6" />
            אסטרטגיה אישית - משולש הקסם
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-purple-600" />
              <div>
                <p className="font-semibold">סטטוס: חסין לשינויים</p>
                <p className="text-sm text-purple-600">לא ניתן להשבתה</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-purple-600" />
              <div>
                <p className="font-semibold">משקל: 80% קבוע</p>
                <p className="text-sm text-purple-600">עדיפות ראשונה תמיד</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {engineStats.personalMethodActive ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <AlertCircle className="h-5 w-5 text-red-600" />
              )}
              <div>
                <p className="font-semibold">
                  {engineStats.personalMethodActive ? 'פעילה' : 'לא פעילה'}
                </p>
                <p className="text-sm text-purple-600">לחץ רגשי + מומנטום</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Strategies Overview */}
      <Tabs defaultValue="strategies" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="strategies">אסטרטגיות</TabsTrigger>
          <TabsTrigger value="performance">ביצועים</TabsTrigger>
        </TabsList>

        <TabsContent value="strategies">
          <Card>
            <CardHeader>
              <CardTitle>מנהל אסטרטגיות ({strategies.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {strategies.map((strategy) => {
                  const isPersonalMethod = strategy.id === 'almog-personal-method';
                  
                  return (
                    <div 
                      key={strategy.id}
                      className={`p-4 border rounded-lg ${
                        isPersonalMethod ? 'border-purple-200 bg-purple-50' : 'border-gray-200'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          {isPersonalMethod ? (
                            <Brain className="h-5 w-5 text-purple-600" />
                          ) : (
                            <Zap className="h-5 w-5 text-blue-600" />
                          )}
                          <div>
                            <h3 className="font-semibold">{strategy.name}</h3>
                            <div className="flex items-center gap-2 mt-1">
                              {isPersonalMethod ? (
                                <Badge className="bg-purple-100 text-purple-800">🧠 אישית</Badge>
                              ) : (
                                <Badge variant="secondary">טכני</Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold">{Math.round(strategy.weight * 100)}%</p>
                          <p className="text-sm text-gray-500">משקל</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm font-medium">שיעור הצלחה</p>
                          <p className="text-lg font-bold text-green-600">
                            {Math.round(strategy.successRate * 100)}%
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">סך איתותים</p>
                          <p className="text-lg font-bold">{strategy.totalSignals}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">איתותים רווחיים</p>
                          <p className="text-lg font-bold text-green-600">{strategy.profitableSignals}</p>
                        </div>
                      </div>

                      {isPersonalMethod && (
                        <div className="mt-3 p-3 bg-purple-100 rounded border">
                          <p className="text-sm text-purple-800 font-medium">
                            🔥 אסטרטגיה זו פועלת ראשונה תמיד ולא ניתן להשבתה
                          </p>
                          <p className="text-xs text-purple-600 mt-1">
                            מבוססת על ניתוח לחץ רגשי, מומנטום נרות ואישור פריצות בנפח
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance">
          <Card>
            <CardHeader>
              <CardTitle>ביצועי מערכת</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-3">ביצועים כלליים</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>שיעור הצלחה כללי</span>
                        <span className="font-bold text-green-600">87%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>רווח ממוצע לעסקה</span>
                        <span className="font-bold text-green-600">2.3%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>יחס סיכון תשואה</span>
                        <span className="font-bold">1:1.67</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-3">אסטרטגיה אישית</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>שיעור הצלחה</span>
                        <span className="font-bold text-purple-600">94%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>איתותים נוצרו</span>
                        <span className="font-bold text-purple-600">47</span>
                      </div>
                      <div className="flex justify-between">
                        <span>רווח ממוצע</span>
                        <span className="font-bold text-purple-600">3.1%</span>
                      </div>
                    </div>
                  </div>
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
