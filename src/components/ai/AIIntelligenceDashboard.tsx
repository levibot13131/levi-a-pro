
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Brain, 
  Target, 
  TrendingUp, 
  BarChart3, 
  Clock,
  Zap,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Eye
} from 'lucide-react';

interface AIMetrics {
  leviScore: number;
  correlationScore: number;
  timeframeAlignment: number;
  signalMemoryHitRate: number;
  totalSignalsProcessed: number;
  successfulPredictions: number;
}

const AIIntelligenceDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<AIMetrics>({
    leviScore: 87,
    correlationScore: 75,
    timeframeAlignment: 82,
    signalMemoryHitRate: 78,
    totalSignalsProcessed: 156,
    successfulPredictions: 122
  });

  const [recentSignals, setRecentSignals] = useState([
    {
      id: '1',
      symbol: 'BTCUSDT',
      action: 'BUY',
      leviScore: 91,
      correlation: 85,
      timeframe: 88,
      sent: true,
      timestamp: Date.now() - 1800000
    },
    {
      id: '2',
      symbol: 'ETHUSDT',
      action: 'SELL',
      leviScore: 76,
      correlation: 65,
      timeframe: 70,
      sent: false,
      timestamp: Date.now() - 3600000
    }
  ]);

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadge = (score: number) => {
    if (score >= 90) return 'ELITE';
    if (score >= 80) return 'HIGH';
    if (score >= 70) return 'MEDIUM';
    return 'LOW';
  };

  return (
    <div className="space-y-6">
      <Card className="border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-6 w-6 text-purple-500" />
            AI Intelligence Dashboard - LeviPro Enhanced
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="overview">
            <TabsList className="w-full">
              <TabsTrigger value="overview">סקירה כללית</TabsTrigger>
              <TabsTrigger value="memory">זיכרון AI</TabsTrigger>
              <TabsTrigger value="correlation">אישור משולש</TabsTrigger>
              <TabsTrigger value="timeframes">ניתוח זמנים</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className={`text-2xl font-bold ${getScoreColor(metrics.leviScore)}`}>
                      {metrics.leviScore}%
                    </div>
                    <div className="text-sm text-muted-foreground">LeviScore ממוצע</div>
                    <Badge variant="outline" className="mt-1">
                      {getScoreBadge(metrics.leviScore)}
                    </Badge>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4 text-center">
                    <div className={`text-2xl font-bold ${getScoreColor(metrics.correlationScore)}`}>
                      {metrics.correlationScore}%
                    </div>
                    <div className="text-sm text-muted-foreground">אישור משולש</div>
                    <div className="text-xs text-muted-foreground mt-1">חדשות + מחיר + נפח</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4 text-center">
                    <div className={`text-2xl font-bold ${getScoreColor(metrics.timeframeAlignment)}`}>
                      {metrics.timeframeAlignment}%
                    </div>
                    <div className="text-sm text-muted-foreground">יישור זמנים</div>
                    <div className="text-xs text-muted-foreground mt-1">15m-1h-4h-1d</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4 text-center">
                    <div className={`text-2xl font-bold ${getScoreColor(metrics.signalMemoryHitRate)}`}>
                      {metrics.signalMemoryHitRate}%
                    </div>
                    <div className="text-sm text-muted-foreground">זיכרון AI</div>
                    <div className="text-xs text-muted-foreground mt-1">שיעור הצלחה</div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">איתותים אחרונים - ניתוח AI מתקדם</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentSignals.map((signal) => (
                      <div key={signal.id} className="p-3 border rounded flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Badge variant={signal.action === 'BUY' ? 'default' : 'destructive'}>
                            {signal.action}
                          </Badge>
                          <span className="font-semibold">{signal.symbol}</span>
                          <div className="flex items-center gap-2 text-sm">
                            <span>LeviScore: <span className={getScoreColor(signal.leviScore)}>{signal.leviScore}%</span></span>
                            <span>אישור: <span className={getScoreColor(signal.correlation)}>{signal.correlation}%</span></span>
                            <span>זמנים: <span className={getScoreColor(signal.timeframe)}>{signal.timeframe}%</span></span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {signal.sent ? (
                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                          ) : (
                            <XCircle className="h-5 w-5 text-red-500" />
                          )}
                          <span className="text-xs text-muted-foreground">
                            {new Date(signal.timestamp).toLocaleTimeString('he-IL')}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="memory" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    זיכרון AI - למידה מביצועים היסטוריים
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h4 className="font-semibold">סטטיסטיקות למידה</h4>
                      <div className="text-sm space-y-1">
                        <div className="flex justify-between">
                          <span>איתותים מעובדים:</span>
                          <span className="font-semibold">{metrics.totalSignalsProcessed}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>תחזיות מוצלחות:</span>
                          <span className="font-semibold text-green-600">{metrics.successfulPredictions}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>שיעור הצלחה:</span>
                          <span className="font-semibold">{((metrics.successfulPredictions / metrics.totalSignalsProcessed) * 100).toFixed(1)}%</span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-semibold">ביצועים לפי סמל</h4>
                      <div className="text-sm space-y-1">
                        <div className="flex justify-between">
                          <span>BTCUSDT:</span>
                          <span className="font-semibold text-green-600">82%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>ETHUSDT:</span>
                          <span className="font-semibold text-yellow-600">74%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>SOLUSDT:</span>
                          <span className="font-semibold text-green-600">79%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="correlation" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    מנוע אישור משולש - חדשות + אונצ'יין + מחיר
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardContent className="p-4 text-center">
                        <CheckCircle2 className="h-8 w-8 text-green-500 mx-auto mb-2" />
                        <div className="font-semibold">חדשות</div>
                        <div className="text-sm text-muted-foreground">סנטימנט חיובי</div>
                        <div className="text-lg font-bold text-green-600 mt-2">85%</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <CheckCircle2 className="h-8 w-8 text-green-500 mx-auto mb-2" />
                        <div className="font-semibold">אונצ'יין</div>
                        <div className="text-sm text-muted-foreground">זינוק נפח</div>
                        <div className="text-lg font-bold text-green-600 mt-2">78%</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <AlertTriangle className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                        <div className="font-semibold">מחיר</div>
                        <div className="text-sm text-muted-foreground">תנועה בינונית</div>
                        <div className="text-lg font-bold text-yellow-600 mt-2">62%</div>
                      </CardContent>
                    </Card>
                  </div>
                  <div className="mt-4 p-3 bg-blue-50 rounded">
                    <div className="text-sm text-blue-800">
                      <strong>מסקנה:</strong> 2 מתוך 3 אישורים - איתות בעל פוטנציאל גבוה
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="timeframes" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    ניתוח רב-זמני - יישור מסגרות זמן
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-3 border rounded">
                      <div className="text-lg font-bold text-green-600">🟢</div>
                      <div className="font-semibold">15 דקות</div>
                      <div className="text-sm text-muted-foreground">עלייה</div>
                    </div>
                    <div className="text-center p-3 border rounded">
                      <div className="text-lg font-bold text-green-600">🟢</div>
                      <div className="font-semibold">1 שעה</div>
                      <div className="text-sm text-muted-foreground">עלייה</div>
                    </div>
                    <div className="text-center p-3 border rounded">
                      <div className="text-lg font-bold text-yellow-600">⚪</div>
                      <div className="font-semibold">4 שעות</div>
                      <div className="text-sm text-muted-foreground">נייטרל</div>
                    </div>
                    <div className="text-center p-3 border rounded">
                      <div className="text-lg font-bold text-green-600">🟢</div>
                      <div className="font-semibold">יום</div>
                      <div className="text-sm text-muted-foreground">עלייה</div>
                    </div>
                  </div>
                  <div className="mt-4 p-3 bg-green-50 rounded">
                    <div className="text-sm text-green-800">
                      <strong>יישור זמנים:</strong> 75% מסכימים על כיוון עלייה - סיכוי גבוה להצלחה
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIIntelligenceDashboard;
