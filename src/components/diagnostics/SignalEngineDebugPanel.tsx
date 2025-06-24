
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Activity, 
  RefreshCw, 
  AlertTriangle, 
  CheckCircle,
  XCircle,
  BarChart3,
  Clock,
  TrendingUp,
  Download
} from 'lucide-react';
import { liveSignalEngine } from '@/services/trading/liveSignalEngine';
import { toast } from 'sonner';

interface AnalysisDebugInfo {
  timestamp: number;
  symbolsAnalyzed: number;
  rejections: {
    lowConfidence: number;
    lowRiskReward: number;
    insufficientVolume: number;
    weakPriceMove: number;
    noSentiment: number;
    cooldown: number;
    other: number;
  };
  bestSignal?: {
    symbol: string;
    confidence: number;
    riskReward: number;
    priceChange: number;
    reason: string;
  };
}

const SignalEngineDebugPanel: React.FC = () => {
  const [debugInfo, setDebugInfo] = useState<AnalysisDebugInfo | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [engineStatus, setEngineStatus] = useState(liveSignalEngine.getEngineStatus());

  useEffect(() => {
    const interval = setInterval(() => {
      setEngineStatus(liveSignalEngine.getEngineStatus());
      updateDebugInfo();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const updateDebugInfo = () => {
    // Get debug info from the engine
    const debugData = liveSignalEngine.getDebugInfo();
    const rejections = debugData.recentRejections;
    const analysisTime = Date.now();
    
    const rejectionStats = {
      lowConfidence: rejections.filter(r => r.reason.includes('confidence')).length,
      lowRiskReward: rejections.filter(r => r.reason.includes('R/R')).length,
      insufficientVolume: rejections.filter(r => r.reason.includes('volume')).length,
      weakPriceMove: rejections.filter(r => r.reason.includes('movement')).length,
      noSentiment: rejections.filter(r => r.reason.includes('sentiment')).length,
      cooldown: rejections.filter(r => r.reason.includes('Cooldown')).length,
      other: rejections.filter(r => 
        !r.reason.includes('confidence') && 
        !r.reason.includes('R/R') && 
        !r.reason.includes('volume') && 
        !r.reason.includes('movement') && 
        !r.reason.includes('sentiment') &&
        !r.reason.includes('Cooldown')
      ).length
    };

    // Find the best signal that was still rejected
    const bestRejection = rejections.reduce((best, current) => {
      return (current.confidence > (best?.confidence || 0)) ? current : best;
    }, null as any);

    setDebugInfo({
      timestamp: analysisTime,
      symbolsAnalyzed: 6, // BTCUSDT, ETHUSDT, SOLUSDT, BNBUSDT, ADAUSDT, DOTUSDT
      rejections: rejectionStats,
      bestSignal: bestRejection ? {
        symbol: bestRejection.symbol,
        confidence: bestRejection.confidence,
        riskReward: bestRejection.riskReward,
        priceChange: 0, // Will be enhanced
        reason: bestRejection.reason
      } : undefined
    });
  };

  const handleForceAnalysis = async () => {
    setIsRefreshing(true);
    try {
      // Trigger manual analysis
      await liveSignalEngine.performManualAnalysis('BTCUSDT');
      updateDebugInfo();
      toast.success('ניתוח ידני הושלם');
    } catch (error) {
      console.error('Manual analysis failed:', error);
      toast.error('שגיאה בניתוח ידני');
    } finally {
      setIsRefreshing(false);
    }
  };

  const exportRejectionsToCSV = () => {
    const debugData = liveSignalEngine.getDebugInfo();
    const rejections = debugData.recentRejections;
    
    const csvContent = [
      'Timestamp,Symbol,Reason,Confidence,Risk_Reward,Details',
      ...rejections.map(r => 
        `${new Date(r.timestamp).toISOString()},${r.symbol},"${r.reason}",${r.confidence},${r.riskReward},"${r.details || ''}"`
      )
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `signal_rejections_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    toast.success('קובץ CSV נוצר בהצלחה');
  };

  return (
    <Card className="border-orange-200">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-orange-500" />
            Signal Engine Debug Panel
          </div>
          <div className="flex gap-2">
            <Button
              onClick={handleForceAnalysis}
              disabled={isRefreshing}
              size="sm"
              variant="outline"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              Force Analysis
            </Button>
            <Button
              onClick={exportRejectionsToCSV}
              size="sm"
              variant="secondary"
            >
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Engine Status */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className={`text-2xl font-bold ${engineStatus.isRunning ? 'text-green-600' : 'text-red-600'}`}>
                {engineStatus.isRunning ? 'ACTIVE' : 'STOPPED'}
              </div>
              <div className="text-sm text-muted-foreground">Engine Status</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {engineStatus.analysisCount || 0}
              </div>
              <div className="text-sm text-muted-foreground">Cycles Completed</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {engineStatus.totalSignals}
              </div>
              <div className="text-sm text-muted-foreground">Signals Sent</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {engineStatus.signalsLast24h || 0}
              </div>
              <div className="text-sm text-muted-foreground">Last 24h</div>
            </div>
          </div>

          {/* Last Analysis */}
          <div className="p-4 bg-gray-50 rounded border">
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Last Analysis Report
            </h4>
            <p className="text-sm text-muted-foreground">
              {engineStatus.lastAnalysisReport || 'No analysis data available'}
            </p>
            <div className="flex justify-between items-center mt-2">
              <p className="text-xs text-muted-foreground">
                Last update: {engineStatus.lastAnalysis ? new Date(engineStatus.lastAnalysis).toLocaleString() : 'Never'}
              </p>
              <p className="text-xs text-muted-foreground">
                Last signal: {engineStatus.lastSuccessfulSignal ? new Date(engineStatus.lastSuccessfulSignal).toLocaleString() : 'None'}
              </p>
            </div>
          </div>

          {/* Rejection Statistics */}
          {debugInfo && (
            <div>
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Signal Rejection Analysis
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="p-3 border rounded text-center">
                  <div className="text-lg font-bold text-red-600">{debugInfo.rejections.lowConfidence}</div>
                  <div className="text-xs text-muted-foreground">Low Confidence</div>
                </div>
                <div className="p-3 border rounded text-center">
                  <div className="text-lg font-bold text-orange-600">{debugInfo.rejections.lowRiskReward}</div>
                  <div className="text-xs text-muted-foreground">Poor R/R</div>
                </div>
                <div className="p-3 border rounded text-center">
                  <div className="text-lg font-bold text-yellow-600">{debugInfo.rejections.insufficientVolume}</div>
                  <div className="text-xs text-muted-foreground">Low Volume</div>
                </div>
                <div className="p-3 border rounded text-center">
                  <div className="text-lg font-bold text-blue-600">{debugInfo.rejections.weakPriceMove}</div>
                  <div className="text-xs text-muted-foreground">Weak Movement</div>
                </div>
                <div className="p-3 border rounded text-center">
                  <div className="text-lg font-bold text-purple-600">{debugInfo.rejections.cooldown}</div>
                  <div className="text-xs text-muted-foreground">Cooldown Active</div>
                </div>
                <div className="p-3 border rounded text-center">
                  <div className="text-lg font-bold text-pink-600">{debugInfo.rejections.noSentiment}</div>
                  <div className="text-xs text-muted-foreground">No Sentiment</div>
                </div>
                <div className="p-3 border rounded text-center">
                  <div className="text-lg font-bold text-gray-600">{debugInfo.rejections.other}</div>
                  <div className="text-xs text-muted-foreground">Other Reasons</div>
                </div>
                <div className="p-3 border rounded text-center">
                  <div className="text-lg font-bold text-indigo-600">{engineStatus.totalRejections}</div>
                  <div className="text-xs text-muted-foreground">Total Rejections</div>
                </div>
              </div>
            </div>
          )}

          {/* Best Signal That Was Rejected */}
          {debugInfo?.bestSignal && (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded">
              <h4 className="font-semibold mb-2 flex items-center gap-2 text-yellow-800">
                <TrendingUp className="h-4 w-4" />
                Best Signal (Still Rejected)
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                <div>
                  <span className="text-muted-foreground">Symbol:</span>
                  <div className="font-semibold">{debugInfo.bestSignal.symbol}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Confidence:</span>
                  <div className="font-semibold">{debugInfo.bestSignal.confidence.toFixed(1)}%</div>
                </div>
                <div>
                  <span className="text-muted-foreground">R/R Ratio:</span>
                  <div className="font-semibold">{debugInfo.bestSignal.riskReward.toFixed(2)}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Reason:</span>
                  <div className="font-semibold text-red-600 text-xs">{debugInfo.bestSignal.reason}</div>
                </div>
              </div>
            </div>
          )}

          {/* Current Filter Settings */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded">
            <h4 className="font-semibold mb-2 text-blue-800">Current Production Filters</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              <div className="flex justify-between">
                <span>Confidence Min:</span>
                <Badge variant="outline">75%</Badge>
              </div>
              <div className="flex justify-between">
                <span>R/R Min:</span>
                <Badge variant="outline">1.3</Badge>
              </div>
              <div className="flex justify-between">
                <span>Price Move Min:</span>
                <Badge variant="outline">2.0%</Badge>
              </div>
              <div className="flex justify-between">
                <span>Cooldown:</span>
                <Badge variant="outline">20 min</Badge>
              </div>
            </div>
          </div>

          {/* Learning Stats */}
          <div className="p-4 bg-green-50 border border-green-200 rounded">
            <h4 className="font-semibold mb-2 text-green-800 flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Learning System Status
            </h4>
            <div className="text-sm space-y-1 text-green-700">
              <div>✅ Rejection tracking: ACTIVE</div>
              <div>✅ Confidence adjustment: ENABLED</div>
              <div>✅ Strategy weight learning: RUNNING</div>
              <div>✅ Multi-timeframe analysis: ENABLED</div>
              <div>📊 Total rejections logged: {engineStatus.totalRejections}</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SignalEngineDebugPanel;
