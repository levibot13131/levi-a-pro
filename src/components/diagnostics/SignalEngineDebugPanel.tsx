
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  RefreshCw, 
  Download,
  XCircle,
  TrendingUp
} from 'lucide-react';
import { liveSignalEngine } from '@/services/trading/liveSignalEngine';

interface DebugInfo {
  totalAnalysed: number;
  totalSent: number;
  totalRejected: number;
  rejectedByRule: { [rule: string]: number };
  recentRejections: any[];
  learningStats: any;
  currentFilters: any;
  marketDataConnected: boolean;
  fundamentalDataAge: number;
}

export const SignalEngineDebugPanel: React.FC = () => {
  const [debugInfo, setDebugInfo] = useState<DebugInfo | null>(null);
  const [engineStatus, setEngineStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDebugInfo();
    const interval = setInterval(loadDebugInfo, 10000); // Update every 10 seconds
    return () => clearInterval(interval);
  }, []);

  const loadDebugInfo = async () => {
    try {
      const debug = liveSignalEngine.getDebugInfo();
      const status = liveSignalEngine.getDetailedStatus();
      
      setDebugInfo(debug);
      setEngineStatus(status);
      setLoading(false);

      console.log('🔧 Debug info loaded:', debug);
    } catch (error) {
      console.error('Failed to load debug info:', error);
      setLoading(false);
    }
  };

  const exportRejections = () => {
    if (!debugInfo) return;

    const csvContent = [
      'Symbol,Reason,Confidence,RiskReward,Timestamp,Details',
      ...debugInfo.recentRejections.map(r => 
        `${r.symbol},${r.reason},${r.confidence},${r.riskReward},${new Date(r.timestamp).toISOString()},${r.details || ''}`
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `signal_rejections_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getHealthColor = (isHealthy: boolean) => isHealthy ? 'text-green-600' : 'text-red-600';
  
  const getHealthIcon = (isHealthy: boolean) => 
    isHealthy ? <CheckCircle className="h-4 w-4 text-green-600" /> : <XCircle className="h-4 w-4 text-red-600" />;

  if (loading) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>טוען נתוני דיבאג...</p>
        </CardContent>
      </Card>
    );
  }

  if (!debugInfo || !engineStatus) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <AlertTriangle className="h-8 w-8 mx-auto mb-4 text-yellow-500" />
          <p>לא ניתן לטעון נתוני דיבאג</p>
        </CardContent>
      </Card>
    );
  }

  const successRate = debugInfo.totalAnalysed > 0 ? 
    ((debugInfo.totalSent / debugInfo.totalAnalysed) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Engine Status Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              מצב מנוע האיתותים - דיבאג מתקדם
            </span>
            <Button onClick={loadDebugInfo} disabled={loading} size="sm">
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded">
              <div className="text-2xl font-bold text-blue-600">{debugInfo.totalAnalysed}</div>
              <div className="text-sm text-muted-foreground">סה"כ נותח</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded">
              <div className="text-2xl font-bold text-green-600">{debugInfo.totalSent}</div>
              <div className="text-sm text-muted-foreground">איתותים נשלחו</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded">
              <div className="text-2xl font-bold text-red-600">{debugInfo.totalRejected}</div>
              <div className="text-sm text-muted-foreground">נדחו</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded">
              <div className="text-2xl font-bold text-purple-600">{successRate.toFixed(1)}%</div>
              <div className="text-sm text-muted-foreground">שיעור הצלחה</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* System Health */}
      <Card>
        <CardHeader>
          <CardTitle>בריאות המערכת</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="flex items-center justify-between p-3 border rounded">
              <span>מנוע פועל</span>
              <div className="flex items-center gap-2">
                {getHealthIcon(engineStatus.isRunning)}
                <span className={getHealthColor(engineStatus.isRunning)}>
                  {engineStatus.isRunning ? 'פעיל' : 'מופסק'}
                </span>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 border rounded">
              <span>נתוני שוק</span>
              <div className="flex items-center gap-2">
                {getHealthIcon(debugInfo.marketDataConnected)}
                <span className={getHealthColor(debugInfo.marketDataConnected)}>
                  {debugInfo.marketDataConnected ? 'מחובר' : 'לא מחובר'}
                </span>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 border rounded">
              <span>נתוני פונדמנטל</span>
              <div className="flex items-center gap-2">
                {getHealthIcon(debugInfo.fundamentalDataAge < 30)}
                <span className={getHealthColor(debugInfo.fundamentalDataAge < 30)}>
                  {debugInfo.fundamentalDataAge} דק'
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Filters */}
      <Card>
        <CardHeader>
          <CardTitle>פילטרים נוכחיים (מצב אגרסיבי)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="p-3 bg-gray-50 rounded">
              <div className="font-semibold">ביטחון מינימלי</div>
              <div className="text-lg font-bold text-blue-600">
                {debugInfo.currentFilters.minConfidence}%
              </div>
            </div>
            <div className="p-3 bg-gray-50 rounded">
              <div className="font-semibold">R/R מינימלי</div>
              <div className="text-lg font-bold text-green-600">
                {debugInfo.currentFilters.minRiskReward}
              </div>
            </div>
            <div className="p-3 bg-gray-50 rounded">
              <div className="font-semibold">תנועת מחיר</div>
              <div className="text-lg font-bold text-orange-600">
                {debugInfo.currentFilters.minPriceMovement}%
              </div>
            </div>
            <div className="p-3 bg-gray-50 rounded">
              <div className="font-semibold">קול-דאון</div>
              <div className="text-lg font-bold text-purple-600">
                {debugInfo.currentFilters.cooldownMinutes}m
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Rejection Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>ניתוח דחיות (100 אחרונות)</span>
            <Button onClick={exportRejections} size="sm" variant="outline">
              <Download className="h-4 w-4 mr-2" />
              ייצא CSV
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(debugInfo.rejectedByRule).map(([rule, count]) => (
                <div key={rule} className="flex items-center justify-between p-3 border rounded">
                  <span className="text-sm">{rule}</span>
                  <Badge variant="outline">{count}</Badge>
                </div>
              ))}
            </div>

            <div className="border rounded p-4">
              <h4 className="font-semibold mb-3">דחיות אחרונות</h4>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {debugInfo.recentRejections.slice(0, 10).map((rejection, index) => (
                  <div key={index} className="text-xs p-2 bg-gray-50 rounded">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">{rejection.symbol}</span>
                      <span className="text-gray-500">
                        {new Date(rejection.timestamp).toLocaleTimeString('he-IL')}
                      </span>
                    </div>
                    <div className="text-gray-600 mt-1">{rejection.reason}</div>
                    <div className="text-gray-500 mt-1">
                      ביטחון: {rejection.confidence}% | R/R: {rejection.riskReward}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Learning Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            סטטיסטיקות למידה
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded">
              <h4 className="font-semibold mb-2">מצב למידה פעיל</h4>
              <p className="text-sm text-gray-600">
                המערכת לומדת מכל דחייה ומשפרת את דיוק האיתותים לאורך זמן.
                כל דחייה נשמרת בטבלת signal_feedback עם סיבת הדחייה.
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 border rounded">
                <div className="text-lg font-bold">
                  {engineStatus.signalsLast24h || 0}
                </div>
                <div className="text-sm text-gray-600">איתותים 24 שעות</div>
              </div>
              <div className="text-center p-3 border rounded">
                <div className="text-lg font-bold">
                  {engineStatus.lastSuccessfulSignal ? 
                    Math.floor((Date.now() - engineStatus.lastSuccessfulSignal) / 60000) : 'N/A'}
                </div>
                <div className="text-sm text-gray-600">דקות מאז איתות אחרון</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
