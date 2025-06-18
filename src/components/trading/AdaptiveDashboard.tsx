
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { adaptiveEngine, StrategyPerformance } from '@/services/trading/adaptiveEngine';
import { Brain, TrendingUp, Clock, Target, AlertTriangle, Activity } from 'lucide-react';
import { toast } from 'sonner';

const AdaptiveDashboard: React.FC = () => {
  const [strategyPerformance, setStrategyPerformance] = useState<StrategyPerformance[]>([]);
  const [optimalHours, setOptimalHours] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAdaptiveData();
    
    // Refresh every 5 minutes
    const interval = setInterval(loadAdaptiveData, 300000);
    return () => clearInterval(interval);
  }, []);

  const loadAdaptiveData = async () => {
    try {
      setLoading(true);
      const [performance, hours] = await Promise.all([
        adaptiveEngine.getStrategyPerformance(),
        adaptiveEngine.getOptimalTradingHours()
      ]);
      
      setStrategyPerformance(performance);
      setOptimalHours(hours);
    } catch (error) {
      console.error('Error loading adaptive data:', error);
      toast.error('שגיאה בטעינת נתוני למידה');
    } finally {
      setLoading(false);
    }
  };

  const getPerformanceColor = (successRate: number) => {
    if (successRate >= 0.7) return 'text-green-600';
    if (successRate >= 0.5) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getWeightColor = (weight: number) => {
    if (weight >= 0.8) return 'bg-green-500';
    if (weight >= 0.6) return 'bg-yellow-500';
    if (weight >= 0.4) return 'bg-orange-500';
    return 'bg-red-500';
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center">
            <Activity className="h-6 w-6 animate-spin mr-2" />
            <span>טוען נתוני למידה אדפטיבית...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Brain className="h-4 w-4" />
              אסטרטגיות פעילות
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{strategyPerformance.length}</div>
            <p className="text-xs text-muted-foreground">
              מתוכן {strategyPerformance.filter(s => s.success_rate > 0.5).length} מעל 50% הצלחה
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              ביצועים כלליים
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {strategyPerformance.length > 0 
                ? (strategyPerformance.reduce((sum, s) => sum + s.success_rate, 0) / strategyPerformance.length * 100).toFixed(1)
                : 0}%
            </div>
            <p className="text-xs text-muted-foreground">שיעור הצלחה ממוצע</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4" />
              שעות אופטימליות
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{optimalHours.length}</div>
            <p className="text-xs text-muted-foreground">
              {optimalHours.slice(0, 2).join(', ')}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Strategy Performance Details */}
      <Tabs defaultValue="performance" className="space-y-4">
        <TabsList>
          <TabsTrigger value="performance">ביצועי אסטרטגיות</TabsTrigger>
          <TabsTrigger value="optimization">אופטימיזציה</TabsTrigger>
          <TabsTrigger value="insights">תובנות</TabsTrigger>
        </TabsList>

        <TabsContent value="performance">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                ביצועי אסטרטגיות מפורט
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {strategyPerformance
                  .sort((a, b) => {
                    // ALMOG'S PERSONAL STRATEGY ALWAYS FIRST
                    if (a.strategy_name === 'almog-personal-method') return -1;
                    if (b.strategy_name === 'almog-personal-method') return 1;
                    return b.success_rate - a.success_rate;
                  })
                  .map((strategy) => (
                  <div key={strategy.strategy_id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">
                          {strategy.strategy_name === 'almog-personal-method' ? '🧠 האסטרטגיה האישית של אלמוג' : strategy.strategy_name}
                        </h3>
                        {strategy.strategy_name === 'almog-personal-method' && (
                          <Badge className="bg-gradient-to-r from-green-500 to-blue-500 text-white">
                            עדיפות עליונה
                          </Badge>
                        )}
                      </div>
                      <Badge 
                        variant={strategy.success_rate > 0.7 ? 'default' : strategy.success_rate > 0.5 ? 'secondary' : 'destructive'}
                      >
                        {(strategy.success_rate * 100).toFixed(1)}% הצלחה
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                      <div className="text-center">
                        <div className="text-lg font-bold">{strategy.total_signals}</div>
                        <div className="text-xs text-muted-foreground">איתותים</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-green-600">{strategy.successful_signals}</div>
                        <div className="text-xs text-muted-foreground">מוצלחים</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-red-600">{strategy.failed_signals}</div>
                        <div className="text-xs text-muted-foreground">כושלים</div>
                      </div>
                      <div className="text-center">
                        <div className={`text-lg font-bold ${strategy.avg_profit_loss > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {strategy.avg_profit_loss > 0 ? '+' : ''}{strategy.avg_profit_loss.toFixed(2)}%
                        </div>
                        <div className="text-xs text-muted-foreground">רווח ממוצע</div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>משקל נוכחי:</span>
                        <span className="font-semibold">{(strategy.current_weight * 100).toFixed(0)}%</span>
                      </div>
                      <Progress 
                        value={strategy.current_weight * 100} 
                        className="h-2"
                      />
                      <div className="flex items-center justify-between text-sm">
                        <span>ציון ביטחון:</span>
                        <span className="font-semibold">{(strategy.confidence_score * 100).toFixed(0)}%</span>
                      </div>
                    </div>

                    {strategy.strategy_name === 'almog-personal-method' && (
                      <div className="mt-3 p-2 bg-blue-50 rounded border-l-4 border-l-blue-500">
                        <p className="text-sm font-medium text-blue-800">
                          🛡️ אסטרטגיה מוגנת - משקל מינימום 80% תמיד
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="optimization">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                אופטימיזציה אוטומטית
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2">הגדרות למידה</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">קצב למידה:</span>
                      <span className="ml-2">10%</span>
                    </div>
                    <div>
                      <span className="font-medium">מינימום איתותים להתאמה:</span>
                      <span className="ml-2">10</span>
                    </div>
                    <div>
                      <span className="font-medium">משקל מקסימלי:</span>
                      <span className="ml-2">100%</span>
                    </div>
                    <div>
                      <span className="font-medium">משקל מינימלי:</span>
                      <span className="ml-2">10%</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2">עדכונים אחרונים</h3>
                  <div className="space-y-2 text-sm">
                    {strategyPerformance
                      .filter(s => s.last_updated && new Date(s.last_updated).getTime() > Date.now() - 24 * 60 * 60 * 1000)
                      .map(s => (
                        <div key={s.strategy_id} className="flex justify-between">
                          <span>{s.strategy_name}</span>
                          <span className="text-muted-foreground">
                            {new Date(s.last_updated).toLocaleString('he-IL')}
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                תובנות ומלצות
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Optimal Trading Hours */}
                {optimalHours.length > 0 && (
                  <div className="p-4 border rounded-lg bg-green-50">
                    <h3 className="font-semibold mb-2 text-green-800">⏰ שעות מסחר אופטימליות</h3>
                    <div className="flex flex-wrap gap-2">
                      {optimalHours.map(hour => (
                        <Badge key={hour} className="bg-green-100 text-green-800">
                          {hour}
                        </Badge>
                      ))}
                    </div>
                    <p className="text-sm text-green-700 mt-2">
                      השעות עם הביצועים הטובים ביותר בהיסטוריה
                    </p>
                  </div>
                )}

                {/* Poor Performing Strategies */}
                {strategyPerformance.filter(s => s.success_rate < 0.3 && s.total_signals >= 10).length > 0 && (
                  <div className="p-4 border rounded-lg bg-red-50">
                    <h3 className="font-semibold mb-2 text-red-800">⚠️ אסטרטגיות בעייתיות</h3>
                    <div className="space-y-2">
                      {strategyPerformance
                        .filter(s => s.success_rate < 0.3 && s.total_signals >= 10 && s.strategy_name !== 'almog-personal-method')
                        .map(s => (
                          <div key={s.strategy_id} className="text-sm">
                            <span className="font-medium">{s.strategy_name}</span>
                            <span className="text-red-600 ml-2">
                              ({(s.success_rate * 100).toFixed(1)}% הצלחה)
                            </span>
                          </div>
                        ))}
                    </div>
                    <p className="text-sm text-red-700 mt-2">
                      שקול להשבית אסטרטגיות עם ביצועים גרועים
                    </p>
                  </div>
                )}

                {/* High Performing Strategies */}
                {strategyPerformance.filter(s => s.success_rate > 0.8).length > 0 && (
                  <div className="p-4 border rounded-lg bg-blue-50">
                    <h3 className="font-semibold mb-2 text-blue-800">🚀 אסטרטגיות מצטיינות</h3>
                    <div className="space-y-2">
                      {strategyPerformance
                        .filter(s => s.success_rate > 0.8)
                        .map(s => (
                          <div key={s.strategy_id} className="text-sm">
                            <span className="font-medium">{s.strategy_name}</span>
                            <span className="text-blue-600 ml-2">
                              ({(s.success_rate * 100).toFixed(1)}% הצלחה)
                            </span>
                          </div>
                        ))}
                    </div>
                    <p className="text-sm text-blue-700 mt-2">
                      אסטרטגיות עם ביצועים יוצאי דופן
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdaptiveDashboard;
