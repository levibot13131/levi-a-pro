
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
  TrendingUp
} from 'lucide-react';
import { liveSignalEngine } from '@/services/trading/liveSignalEngine';

interface AnalysisDebugInfo {
  timestamp: number;
  symbolsAnalyzed: number;
  rejections: {
    lowConfidence: number;
    lowRiskReward: number;
    insufficientVolume: number;
    weakPriceMove: number;
    noSentiment: number;
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
      // Try to get debug info from the engine
      const debugData = liveSignalEngine.getDebugInfo();
      if (debugData) {
        updateDebugInfo();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const updateDebugInfo = () => {
    // Get recent rejections and analyze them
    const rejections = liveSignalEngine.getRecentRejections(50);
    const analysisTime = Date.now();
    
    const rejectionStats = {
      lowConfidence: rejections.filter(r => r.reason.includes('Confidence')).length,
      lowRiskReward: rejections.filter(r => r.reason.includes('R/R')).length,
      insufficientVolume: rejections.filter(r => r.reason.includes('volume')).length,
      weakPriceMove: rejections.filter(r => r.reason.includes('movement')).length,
      noSentiment: rejections.filter(r => r.reason.includes('sentiment')).length,
      other: rejections.filter(r => 
        !r.reason.includes('Confidence') && 
        !r.reason.includes('R/R') && 
        !r.reason.includes('volume') && 
        !r.reason.includes('movement') && 
        !r.reason.includes('sentiment')
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
    } catch (error) {
      console.error('Manual analysis failed:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleRelaxFilters = () => {
    // This would temporarily relax the filtering criteria
    console.log('🔧 Temporarily relaxing signal filters for testing...');
    // Implementation would modify the engine's filtering thresholds
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
              onClick={handleRelaxFilters}
              size="sm"
              variant="secondary"
            >
              Relax Filters (Test)
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Engine Status */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
            <p className="text-xs text-muted-foreground mt-1">
              Last update: {engineStatus.lastAnalysis ? new Date(engineStatus.lastAnalysis).toLocaleString() : 'Never'}
            </p>
          </div>

          {/* Rejection Statistics */}
          {debugInfo && (
            <div>
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Signal Rejection Analysis
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <div className="p-3 border rounded text-center">
                  <div className="text-lg font-bold text-red-600">{debugInfo.rejections.lowConfidence}</div>
                  <div className="text-xs text-muted-foreground">Low Confidence (&lt;80%)</div>
                </div>
                <div className="p-3 border rounded text-center">
                  <div className="text-lg font-bold text-orange-600">{debugInfo.rejections.lowRiskReward}</div>
                  <div className="text-xs text-muted-foreground">Poor R/R (&lt;1.5)</div>
                </div>
                <div className="p-3 border rounded text-center">
                  <div className="text-lg font-bold text-yellow-600">{debugInfo.rejections.insufficientVolume}</div>
                  <div className="text-xs text-muted-foreground">Low Volume</div>
                </div>
                <div className="p-3 border rounded text-center">
                  <div className="text-lg font-bold text-blue-600">{debugInfo.rejections.weakPriceMove}</div>
                  <div className="text-xs text-muted-foreground">Weak Movement (&lt;2.5%)</div>
                </div>
                <div className="p-3 border rounded text-center">
                  <div className="text-lg font-bold text-purple-600">{debugInfo.rejections.noSentiment}</div>
                  <div className="text-xs text-muted-foreground">No Sentiment</div>
                </div>
                <div className="p-3 border rounded text-center">
                  <div className="text-lg font-bold text-gray-600">{debugInfo.rejections.other}</div>
                  <div className="text-xs text-muted-foreground">Other Reasons</div>
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
                  <div className="font-semibold">{debugInfo.bestSignal.confidence}%</div>
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
            <h4 className="font-semibold mb-2 text-blue-800">Current Filter Thresholds</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              <div className="flex justify-between">
                <span>Confidence Min:</span>
                <Badge variant="outline">80%</Badge>
              </div>
              <div className="flex justify-between">
                <span>R/R Min:</span>
                <Badge variant="outline">1.5</Badge>
              </div>
              <div className="flex justify-between">
                <span>Price Move Min:</span>
                <Badge variant="outline">2.5%</Badge>
              </div>
              <div className="flex justify-between">
                <span>Analysis Interval:</span>
                <Badge variant="outline">30s</Badge>
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div className="p-4 bg-green-50 border border-green-200 rounded">
            <h4 className="font-semibold mb-2 text-green-800 flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Recommendations
            </h4>
            <ul className="text-sm space-y-1 text-green-700">
              <li>• If no signals in 24h: Lower confidence to 70% temporarily</li>
              <li>• If market is sideways: Reduce price movement requirement to 1.5%</li>
              <li>• Monitor volume spikes during major news events</li>
              <li>• Check if sentiment data is being received properly</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SignalEngineDebugPanel;
