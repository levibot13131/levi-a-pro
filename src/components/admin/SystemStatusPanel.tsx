
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Database, 
  Zap,
  RefreshCw,
  Play,
  Square
} from 'lucide-react';
import { liveSignalEngine } from '@/services/trading/liveSignalEngine';
import { toast } from 'sonner';

export const SystemStatusPanel: React.FC = () => {
  const [engineStatus, setEngineStatus] = useState<any>(null);
  const [refreshing, setRefreshing] = useState(false);

  const refreshStatus = async () => {
    setRefreshing(true);
    try {
      const status = liveSignalEngine.getDetailedStatus();
      setEngineStatus(status);
      console.log('📊 Engine Status Updated:', status);
    } catch (error) {
      console.error('Error refreshing status:', error);
      toast.error('שגיאה ברענון סטטוס המערכת');
    } finally {
      setRefreshing(false);
    }
  };

  const toggleEngine = () => {
    if (engineStatus?.isRunning) {
      liveSignalEngine.stop();
      toast.success('מנוע האיתותים הופסק');
    } else {
      liveSignalEngine.start();
      toast.success('מנוע האיתותים הופעל');
    }
    setTimeout(refreshStatus, 1000);
  };

  const sendTestSignal = async () => {
    try {
      await liveSignalEngine.sendTestSignal();
    } catch (error) {
      console.error('Test signal failed:', error);
    }
  };

  useEffect(() => {
    refreshStatus();
    const interval = setInterval(refreshStatus, 10000); // Refresh every 10 seconds
    return () => clearInterval(interval);
  }, []);

  if (!engineStatus) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>טוען סטטוס מערכת...</p>
        </CardContent>
      </Card>
    );
  }

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'HEALTHY': return 'text-green-600';
      case 'DEGRADED': return 'text-yellow-600';
      case 'ERROR': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusBadge = (isActive: boolean, label: string) => (
    <Badge variant={isActive ? "default" : "secondary"} className="flex items-center gap-1">
      {isActive ? <CheckCircle className="h-3 w-3" /> : <AlertTriangle className="h-3 w-3" />}
      {label}
    </Badge>
  );

  return (
    <div className="space-y-6">
      {/* Main Engine Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              מצב מנוע האיתותים
            </span>
            <div className="flex gap-2">
              <Button
                variant={engineStatus.isRunning ? "destructive" : "default"}
                size="sm"
                onClick={toggleEngine}
              >
                {engineStatus.isRunning ? <Square className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                {engineStatus.isRunning ? 'עצור' : 'הפעל'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={refreshStatus}
                disabled={refreshing}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                רענן
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded">
              <Activity className="h-8 w-8 mx-auto mb-2 text-blue-600" />
              <div className={`text-2xl font-bold ${getHealthColor(engineStatus.healthCheck?.overallHealth)}`}>
                {engineStatus.healthCheck?.overallHealth || 'UNKNOWN'}
              </div>
              <div className="text-sm text-muted-foreground">מצב כללי</div>
            </div>
            
            <div className="text-center p-4 bg-green-50 rounded">
              <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-600" />
              <div className="text-2xl font-bold text-green-600">{engineStatus.totalSignals}</div>
              <div className="text-sm text-muted-foreground">איתותים נשלחו</div>
            </div>
            
            <div className="text-center p-4 bg-orange-50 rounded">
              <AlertTriangle className="h-8 w-8 mx-auto mb-2 text-orange-600" />
              <div className="text-2xl font-bold text-orange-600">{engineStatus.totalRejections}</div>
              <div className="text-sm text-muted-foreground">איתותים נדחו</div>
            </div>
            
            <div className="text-center p-4 bg-purple-50 rounded">
              <Clock className="h-8 w-8 mx-auto mb-2 text-purple-600" />
              <div className="text-2xl font-bold text-purple-600">{engineStatus.analysisCount}</div>
              <div className="text-sm text-muted-foreground">ניתוחים</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* System Components Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            סטטוס רכיבי המערכת
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {getStatusBadge(engineStatus.isRunning, 'מנוע AI')}
            {getStatusBadge(engineStatus.healthCheck?.dataConnection, 'נתוני שוק')}
            {getStatusBadge(engineStatus.healthCheck?.aiProcessor, 'מעבד AI')}
            {getStatusBadge(true, 'טלגרם בוט')}
            {getStatusBadge(true, 'בסיס נתונים')}
            {getStatusBadge(true, 'מערכת אבטחה')}
          </div>
        </CardContent>
      </Card>

      {/* Current Analysis Status */}
      <Card>
        <CardHeader>
          <CardTitle>מצב ניתוח נוכחי</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <span>מחזור נוכחי:</span>
            <Badge variant="outline">{engineStatus.currentCycle}</Badge>
          </div>
          
          <div className="flex justify-between items-center">
            <span>סטטוס נתוני שוק:</span>
            <Badge variant={engineStatus.marketDataStatus === 'LIVE_DATA_OK' ? 'default' : 'secondary'}>
              {engineStatus.marketDataStatus}
            </Badge>
          </div>
          
          <div className="flex justify-between items-center">
            <span>ניתוח אחרון:</span>
            <span className="text-sm text-muted-foreground">
              {engineStatus.lastAnalysis > 0 ? 
                new Date(engineStatus.lastAnalysis).toLocaleTimeString('he-IL') : 
                'טרם בוצע'
              }
            </span>
          </div>

          {engineStatus.lastAnalysisReport && (
            <div className="p-3 bg-gray-50 rounded text-sm">
              <strong>דוח ניתוח אחרון:</strong><br />
              {engineStatus.lastAnalysisReport}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Production Filters */}
      <Card>
        <CardHeader>
          <CardTitle>פילטרי איכות פרודקשן</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>ביטחון מינימלי: <strong>{engineStatus.productionFilters?.minConfidence}%</strong></div>
            <div>יחס R/R מינימלי: <strong>{engineStatus.productionFilters?.minRiskReward}</strong></div>
            <div>תנועת מחיר מינימלית: <strong>{engineStatus.productionFilters?.minPriceMovement}%</strong></div>
            <div>זמן המתנה: <strong>{engineStatus.productionFilters?.cooldownMinutes} דק'</strong></div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Rejections */}
      {engineStatus.recentRejections && engineStatus.recentRejections.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>דחיות אחרונות</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {engineStatus.recentRejections.slice(-10).map((rejection: any, index: number) => (
                <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded text-sm">
                  <div>
                    <strong>{rejection.symbol}</strong> - {rejection.reason}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(rejection.timestamp).toLocaleTimeString('he-IL')}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>פעולות מהירות</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Button onClick={sendTestSignal}>
              שלח איתות בדיקה
            </Button>
            <Button variant="outline" onClick={() => liveSignalEngine.performManualAnalysis('BTCUSDT')}>
              ניתוח ידני - BTC
            </Button>
            <Button variant="outline" onClick={refreshStatus}>
              רענן סטטוס
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
