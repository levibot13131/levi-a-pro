
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, AlertTriangle, TrendingUp, Calculator } from 'lucide-react';
import { riskManagementEngine } from '@/services/risk/riskManagementEngine';

interface EnhancedSignal {
  signal: any;
  riskData: any;
  intelligenceData: any;
  timestamp: number;
}

export const RiskEnhancedSignalMonitor: React.FC = () => {
  const [recentSignals, setRecentSignals] = useState<EnhancedSignal[]>([]);
  const [riskStats, setRiskStats] = useState(riskManagementEngine.getDailyStats());

  useEffect(() => {
    // Listen for enhanced signals
    const handleEnhancedSignal = (event: CustomEvent) => {
      const { signal, scoredSignal, riskData } = event.detail;
      
      const enhancedSignal: EnhancedSignal = {
        signal,
        riskData,
        intelligenceData: scoredSignal.intelligenceData,
        timestamp: Date.now()
      };
      
      setRecentSignals(prev => [enhancedSignal, ...prev.slice(0, 9)]); // Keep last 10
    };

    window.addEventListener('enhanced-signal-sent', handleEnhancedSignal as EventListener);

    // Update risk stats periodically
    const interval = setInterval(() => {
      setRiskStats(riskManagementEngine.getDailyStats());
    }, 5000);

    return () => {
      window.removeEventListener('enhanced-signal-sent', handleEnhancedSignal as EventListener);
      clearInterval(interval);
    };
  }, []);

  const getRiskStatusColor = (withinLimits: boolean) => {
    return withinLimits ? 'text-green-600' : 'text-red-600';
  };

  const getRiskBadgeVariant = (withinLimits: boolean) => {
    return withinLimits ? 'default' : 'destructive';
  };

  return (
    <div className="space-y-6">
      {/* Risk Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Risk-Enhanced Signal Monitor
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{recentSignals.length}</div>
              <div className="text-sm text-muted-foreground">Signals Today</div>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold ${getRiskStatusColor(riskStats.isWithinLimits)}`}>
                {riskStats.dailyLoss.toFixed(1)}%
              </div>
              <div className="text-sm text-muted-foreground">Daily Loss</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{riskStats.activePositions}</div>
              <div className="text-sm text-muted-foreground">Active Positions</div>
            </div>
            <div className="text-center">
              <Badge variant={getRiskBadgeVariant(riskStats.isWithinLimits)}>
                {riskStats.emergencyPause ? 'PAUSED' : riskStats.isWithinLimits ? 'SAFE' : 'RISK'}
              </Badge>
              <div className="text-sm text-muted-foreground">Status</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Risk-Enhanced Signals */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Risk-Enhanced Signals</CardTitle>
        </CardHeader>
        <CardContent>
          {recentSignals.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No recent signals. Start the engine to see risk-enhanced signals here.
            </div>
          ) : (
            <div className="space-y-4">
              {recentSignals.map((enhancedSignal, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Badge variant={enhancedSignal.signal.action === 'buy' ? 'default' : 'destructive'}>
                        {enhancedSignal.signal.action.toUpperCase()}
                      </Badge>
                      <span className="font-semibold">{enhancedSignal.signal.symbol}</span>
                      <span className="text-sm text-muted-foreground">
                        ${enhancedSignal.signal.price.toFixed(2)}
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(enhancedSignal.timestamp).toLocaleTimeString()}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                    <div className="flex items-center gap-2">
                      <Calculator className="h-4 w-4 text-blue-500" />
                      <div>
                        <div className="text-xs text-muted-foreground">Position Size</div>
                        <div className="text-sm font-semibold">
                          ${enhancedSignal.riskData?.recommendedPositionSize?.toFixed(2) || 'N/A'}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-red-500" />
                      <div>
                        <div className="text-xs text-muted-foreground">Risk Amount</div>
                        <div className="text-sm font-semibold">
                          ${enhancedSignal.riskData?.riskAmount?.toFixed(2) || 'N/A'}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-green-500" />
                      <div>
                        <div className="text-xs text-muted-foreground">Exposure</div>
                        <div className="text-sm font-semibold">
                          {enhancedSignal.riskData?.exposurePercent?.toFixed(1) || 'N/A'}%
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Badge variant={getRiskBadgeVariant(enhancedSignal.riskData?.withinLimits)}>
                        {enhancedSignal.riskData?.withinLimits ? 'Safe' : 'Risk'}
                      </Badge>
                    </div>
                  </div>

                  {/* Intelligence Summary */}
                  <div className="text-xs bg-gray-50 p-2 rounded">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      <div>🐋 {enhancedSignal.intelligenceData?.whaleActivity?.sentiment || 'Neutral'}</div>
                      <div>📱 {enhancedSignal.intelligenceData?.sentiment?.overallSentiment || 'Neutral'}</div>
                      <div>😰 {enhancedSignal.intelligenceData?.fearGreed?.classification || 'Unknown'}</div>
                      <div>🚨 {enhancedSignal.intelligenceData?.fundamentalRisk || 'Low'}</div>
                    </div>
                  </div>

                  {/* Risk Warnings */}
                  {enhancedSignal.riskData?.riskWarnings?.length > 0 && (
                    <div className="mt-2">
                      {enhancedSignal.riskData.riskWarnings.map((warning: string, wIndex: number) => (
                        <div key={wIndex} className="flex items-center gap-2 text-xs text-red-600">
                          <AlertTriangle className="h-3 w-3" />
                          {warning}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
