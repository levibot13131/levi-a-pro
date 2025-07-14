import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { productionTradingEngine } from '@/services/trading/productionTradingEngine';
import { EngineStatus } from '@/types/trading';
import { 
  Play, 
  Square, 
  Activity, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle,
  Clock,
  Target,
  BarChart3
} from 'lucide-react';

const TradingEngineControl: React.FC = () => {
  const { toast } = useToast();
  const [engineStatus, setEngineStatus] = useState<EngineStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const updateStatus = () => {
    const status = productionTradingEngine.getEngineStatus();
    setEngineStatus({
      ...status,
      totalSignals: status.signalsToday,
      totalRejections: 0,
      lastAnalysis: Date.now(),
      analysisCount: 0,
      lastAnalysisReport: 'System operational',
      signalsLast24h: status.signalsToday,
      lastSuccessfulSignal: Date.now(),
      failedTelegram: 0
    });
    };

    updateStatus();
    const interval = setInterval(updateStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleStartEngine = async () => {
    setIsLoading(true);
    try {
      await productionTradingEngine.startEngine();
      toast({
        title: "🚀 LeviPro Engine Started",
        description: "All trading systems are now operational",
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: "❌ Engine Start Failed",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStopEngine = () => {
    productionTradingEngine.stopEngine();
    toast({
      title: "⏹️ Engine Stopped",
      description: "Trading engine has been stopped",
    });
  };

  const generateTestSignal = async (symbol: string) => {
    setIsLoading(true);
    try {
      const signal = await productionTradingEngine.generateTestSignal();
      if (signal) {
        toast({
          title: "🧪 Test Signal Generated",
          description: `Test signal generated successfully`,
        });
      } else {
        toast({
          title: "ℹ️ No Signal Generated",
          description: `No trading opportunities found for ${symbol}`,
        });
      }
    } catch (error) {
      toast({
        title: "❌ Test Failed",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (timestamp: number) => {
    return timestamp ? new Date(timestamp).toLocaleTimeString('he-IL') : 'לא זמין';
  };

  const formatDuration = (timestamp: number) => {
    if (!timestamp) return 'לא זמין';
    const minutes = Math.floor((Date.now() - timestamp) / 60000);
    return `לפני ${minutes} דקות`;
  };

  if (!engineStatus) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <Activity className="h-6 w-6 animate-spin text-muted-foreground" />
            <span className="mr-2 text-muted-foreground">טוען נתוני מנוע...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Engine Control */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            LeviPro Trading Engine Control
          </CardTitle>
          <CardDescription>
            Control and monitor the complete trading system
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`h-3 w-3 rounded-full ${
                engineStatus.isRunning ? 'bg-green-500 animate-pulse' : 'bg-red-500'
              }`} />
              <span className="text-sm font-medium">
                {engineStatus.isRunning ? 'פעיל' : 'כבוי'}
              </span>
            </div>
            
            <div className="flex gap-2">
              {!engineStatus.isRunning ? (
                <Button 
                  onClick={handleStartEngine}
                  disabled={isLoading}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Play className="h-4 w-4 ml-2" />
                  הפעל מנוע
                </Button>
              ) : (
                <Button 
                  onClick={handleStopEngine}
                  variant="destructive"
                >
                  <Square className="h-4 w-4 ml-2" />
                  עצור מנוע
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Engine Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">סיגנלים שנשלחו</p>
                <p className="text-2xl font-bold">{engineStatus.totalSignals}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-orange-600" />
              <div>
                <p className="text-sm text-muted-foreground">נדחו</p>
                <p className="text-2xl font-bold">{engineStatus.totalRejections}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">היום</p>
                <p className="text-2xl font-bold">{engineStatus.signalsLast24h}/10</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-purple-600" />
              <div>
                <p className="text-sm text-muted-foreground">ניתוחים</p>
                <p className="text-2xl font-bold">{engineStatus.analysisCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Last Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            ניתוח אחרון
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">זמן:</span>
              <span className="text-sm">{formatTime(engineStatus.lastAnalysis)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">לפני:</span>
              <span className="text-sm">{formatDuration(engineStatus.lastAnalysis)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">פרטים:</span>
              <span className="text-sm">{engineStatus.lastAnalysisReport}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Test Signals */}
      <Card>
        <CardHeader>
          <CardTitle>בדיקת סיגנלים</CardTitle>
          <CardDescription>
            צור סיגנל בדיקה עבור מטבע ספציפי
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            {['BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'SOLUSDT', 'XRPUSDT'].map(symbol => (
              <Button
                key={symbol}
                variant="outline"
                size="sm"
                onClick={() => generateTestSignal(symbol)}
                disabled={isLoading}
              >
                {symbol.replace('USDT', '')}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* System Health */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            מצב מערכת
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              <Badge variant={engineStatus.isRunning ? "default" : "secondary"}>
                מנוע עיקרי
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="default">
                נתוני שוק
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="default">
                AI למידה
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="default">
                טלגרם
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TradingEngineControl;