
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
  Download,
  Zap
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
    multiTimeframe: number;
    marketHeat: number;
    other: number;
  };
  bestSignal?: {
    symbol: string;
    confidence: number;
    riskReward: number;
    priceChange: number;
    reason: string;
  };
  aggressiveMode: boolean;
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
    try {
      // Get debug info from the engine using the new method
      const debugData = liveSignalEngine.getDebugInfo();
      const rejections = debugData.recentRejections;
      const analysisTime = Date.now();
      
      const rejectionStats = {
        lowConfidence: rejections.filter(r => r.reason.toLowerCase().includes('confidence')).length,
        lowRiskReward: rejections.filter(r => r.reason.toLowerCase().includes('r/r')).length,
        insufficientVolume: rejections.filter(r => r.reason.toLowerCase().includes('volume')).length,
        weakPriceMove: rejections.filter(r => r.reason.toLowerCase().includes('movement')).length,
        noSentiment: rejections.filter(r => r.reason.toLowerCase().includes('sentiment')).length,
        cooldown: rejections.filter(r => r.reason.toLowerCase().includes('cooldown')).length,
        multiTimeframe: rejections.filter(r => r.reason.toLowerCase().includes('timeframe')).length,
        marketHeat: rejections.filter(r => r.reason.toLowerCase().includes('volatile')).length,
        other: rejections.filter(r => 
          !r.reason.toLowerCase().includes('confidence') && 
          !r.reason.toLowerCase().includes('r/r') && 
          !r.reason.toLowerCase().includes('volume') && 
          !r.reason.toLowerCase().includes('movement') && 
          !r.reason.toLowerCase().includes('sentiment') &&
          !r.reason.toLowerCase().includes('cooldown') &&
          !r.reason.toLowerCase().includes('timeframe') &&
          !r.reason.toLowerCase().includes('volatile')
        ).length
      };

      // Find the best signal that was still rejected
      const bestRejection = rejections.reduce((best, current) => {
        return (current.confidence > (best?.confidence || 0)) ? current : best;
      }, null as any);

      setDebugInfo({
        timestamp: analysisTime,
        symbolsAnalyzed: debugData.totalAnalysed || 0,
        rejections: rejectionStats,
        bestSignal: bestRejection ? {
          symbol: bestRejection.symbol,
          confidence: bestRejection.confidence,
          riskReward: bestRejection.riskReward,
          priceChange: 0, // Will be enhanced
          reason: bestRejection.reason
        } : undefined,
        aggressiveMode: true // Based on the current mode
      });
    } catch (error) {
      console.error('Failed to update debug info:', error);
    }
  };

  const handleForceAnalysis = async () => {
    setIsRefreshing(true);
    try {
      // Trigger manual analysis
      await liveSignalEngine.performManualAnalysis('BTCUSDT');
      updateDebugInfo();
      toast.success('ניתוח ידני הושלם - מצב אגרסיבי');
    } catch (error) {
      console.error('Manual analysis failed:', error);
      toast.error('שגיאה בניתוח ידני');
    } finally {
      setIsRefreshing(false);
    }
  };

  const exportRejectionsToCSV = () => {
    try {
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
      a.download = `aggressive_signal_rejections_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
      
      toast.success('קובץ CSV נוצר בהצלחה - מצב אגרסיבי');
    } catch (error) {
      console.error('Failed to export CSV:', error);
      toast.error('שגיאה בייצוא CSV');
    }
  };

  const sendTestSignal = async () => {
    try {
      await liveSignalEngine.sendTestSignal();
      toast.success('איתות בדיקה נשלח במצב אגרסיבי');
    } catch (error) {
      console.error('Test signal failed:', error);
      toast.error('שגיאה בשליחת איתות בדיקה');
    }
  };

  return (
    <Card className="border-orange-200">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-orange-500" />
            Signal Engine Debug Panel - AGGRESSIVE MODE
            {debugInfo?.aggressiveMode && (
              <Badge className="bg-red-100 text-red-800">
                🔥 AGGRESSIVE
              </Badge>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              onClick={sendTestSignal}
              size="sm"
              className="bg-green-600 hover:bg-green-700"
            >
              <Zap className="h-4 w-4 mr-2" />
              Test Signal
            </Button>
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
          {/* Engine Status - AGGRESSIVE MODE */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className={`text-2xl font-bold ${engineStatus.isRunning ? 'text-green-600' : 'text-red-600'}`}>
                {engineStatus.isRunning ? 'ACTIVE' : 'STOPPED'}
              </div>
              <div className="text-sm text-muted-foreground">AGGRESSIVE Engine Status</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {engineStatus.analysisCount || 0}
              </div>
              <div className="text-sm text-muted-foreground">Analysis Cycles</div>
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

          {/* AGGRESSIVE Mode Alert */}
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <h4 className="font-semibold text-red-800 mb-2 flex items-center gap-2">
              <Zap className="h-4 w-4" />
              AGGRESSIVE Production Mode Active
            </h4>
            <div className="text-sm text-red-700 space-y-1">
              <div>🔥 Confidence threshold: 65% (reduced from 75%)</div>
              <div>🔥 R/R ratio: 1.2 (reduced from 1.3)</div>
              <div>🔥 Price movement: 1.5% (reduced from 2.0%)</div>
              <div>🔥 Cooldown: 15 min (reduced from 20 min)</div>
              <div>🔥 Multi-TF alignment: 60% (reduced from 75%)</div>
              <div>🚀 Target: Generate signals within 24 hours</div>
            </div>
          </div>

          {/* Last Analysis */}
          <div className="p-4 bg-gray-50 rounded border">
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Last AGGRESSIVE Analysis Report
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

          {/* Rejection Statistics - Enhanced for Aggressive Mode */}
          {debugInfo && (
            <div>
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                AGGRESSIVE Signal Rejection Analysis
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                <div className="p-3 border rounded text-center">
                  <div className="text-lg font-bold text-red-600">{debugInfo.rejections.lowConfidence}</div>
                  <div className="text-xs text-muted-foreground">Low Confidence (&lt;65%)</div>
                </div>
                <div className="p-3 border rounded text-center">
                  <div className="text-lg font-bold text-orange-600">{debugInfo.rejections.lowRiskReward}</div>
                  <div className="text-xs text-muted-foreground">Poor R/R (&lt;1.2)</div>
                </div>
                <div className="p-3 border rounded text-center">
                  <div className="text-lg font-bold text-yellow-600">{debugInfo.rejections.multiTimeframe}</div>
                  <div className="text-xs text-muted-foreground">Multi-TF (&lt;60%)</div>
                </div>
                <div className="p-3 border rounded text-center">
                  <div className="text-lg font-bold text-blue-600">{debugInfo.rejections.cooldown}</div>
                  <div className="text-xs text-muted-foreground">Cooldown (15min)</div>
                </div>
                <div className="p-3 border rounded text-center">
                  <div className="text-lg font-bold text-purple-600">{debugInfo.rejections.marketHeat}</div>
                  <div className="text-xs text-muted-foreground">Market Heat</div>
                </div>
                <div className="p-3 border rounded text-center">
                  <div className="text-lg font-bold text-pink-600">{debugInfo.rejections.weakPriceMove}</div>
                  <div className="text-xs text-muted-foreground">Weak Move (&lt;1.5%)</div>
                </div>
                <div className="p-3 border rounded text-center">
                  <div className="text-lg font-bold text-gray-600">{debugInfo.rejections.other}</div>
                  <div className="text-xs text-muted-foreground">Other Reasons</div>
                </div>
                <div className="p-3 border rounded text-center">
                  <div className="text-lg font-bold text-indigo-600">{engineStatus.totalRejections}</div>
                  <div className="text-xs text-muted-foreground">Total Rejections</div>
                </div>
                <div className="p-3 border rounded text-center">
                  <div className="text-lg font-bold text-green-600">{debugInfo.symbolsAnalyzed}</div>
                  <div className="text-xs text-muted-foreground">Total Analyzed</div>
                </div>
                <div className="p-3 border rounded text-center">
                  <div className="text-lg font-bold text-teal-600">
                    {debugInfo.symbolsAnalyzed > 0 ? ((engineStatus.totalSignals / debugInfo.symbolsAnalyzed) * 100).toFixed(1) : 0}%
                  </div>
                  <div className="text-xs text-muted-foreground">Success Rate</div>
                </div>
              </div>
            </div>
          )}

          {/* Best Signal That Was Rejected */}
          {debugInfo?.bestSignal && (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded">
              <h4 className="font-semibold mb-2 flex items-center gap-2 text-yellow-800">
                <TrendingUp className="h-4 w-4" />
                Best AGGRESSIVE Signal (Still Rejected)
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

          {/* Current AGGRESSIVE Filter Settings */}
          <div className="p-4 bg-red-50 border border-red-200 rounded">
            <h4 className="font-semibold mb-2 text-red-800">Current AGGRESSIVE Production Filters</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              <div className="flex justify-between">
                <span>Confidence Min:</span>
                <Badge variant="outline" className="bg-red-100">65%</Badge>
              </div>
              <div className="flex justify-between">
                <span>R/R Min:</span>
                <Badge variant="outline" className="bg-red-100">1.2</Badge>
              </div>
              <div className="flex justify-between">
                <span>Price Move Min:</span>
                <Badge variant="outline" className="bg-red-100">1.5%</Badge>
              </div>
              <div className="flex justify-between">
                <span>Cooldown:</span>
                <Badge variant="outline" className="bg-red-100">15 min</Badge>
              </div>
              <div className="flex justify-between">
                <span>Multi-TF Align:</span>
                <Badge variant="outline" className="bg-red-100">60%</Badge>
              </div>
              <div className="flex justify-between">
                <span>Max/Hour:</span>
                <Badge variant="outline" className="bg-red-100">5</Badge>
              </div>
              <div className="flex justify-between">
                <span>Volume Check:</span>
                <Badge variant="outline" className="bg-green-100">DISABLED</Badge>
              </div>
              <div className="flex justify-between">
                <span>Sentiment Check:</span>
                <Badge variant="outline" className="bg-green-100">DISABLED</Badge>
              </div>
            </div>
          </div>

          {/* Learning & Market Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-green-50 border border-green-200 rounded">
              <h4 className="font-semibold mb-2 text-green-800 flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                AGGRESSIVE Learning System Status
              </h4>
              <div className="text-sm space-y-1 text-green-700">
                <div>✅ Rejection tracking: ACTIVE</div>
                <div>✅ Confidence boost: 10% AGGRESSIVE mode</div>
                <div>✅ Strategy learning: RUNNING</div>
                <div>✅ Multi-timeframe analysis: 60% threshold</div>
                <div>✅ Filter relaxation: ENABLED</div>
                <div>📊 Total rejections logged: {engineStatus.totalRejections}</div>
              </div>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded">
              <h4 className="font-semibold mb-2 text-blue-800 flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Market Data Status
              </h4>
              <div className="text-sm space-y-1 text-blue-700">
                <div>📊 Market data: {engineStatus.marketDataStatus}</div>
                <div>🧠 AI engine: {engineStatus.aiEngineStatus}</div>
                <div>🔄 Current cycle: {engineStatus.currentCycle}</div>
                <div>⏰ Analysis interval: 30 seconds</div>
                <div>🎯 Symbols monitored: 6 (BTC, ETH, SOL, BNB, ADA, DOT)</div>
                <div>📈 Timeframes: 1m, 5m, 15m, 1h, 4h, 1d</div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SignalEngineDebugPanel;
