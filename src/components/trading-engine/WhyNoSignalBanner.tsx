
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Eye, RefreshCw } from 'lucide-react';
import { liveSignalEngine } from '@/services/trading/liveSignalEngine';

const WhyNoSignalBanner: React.FC = () => {
  const [lastAnalysisReport, setLastAnalysisReport] = useState('');
  const [engineStatus, setEngineStatus] = useState(liveSignalEngine.getEngineStatus());

  useEffect(() => {
    const interval = setInterval(() => {
      const status = liveSignalEngine.getEngineStatus();
      setEngineStatus(status);
      setLastAnalysisReport(status.lastAnalysisReport || '');
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  if (!engineStatus.isRunning) {
    return (
      <Card className="border-red-500 bg-red-50">
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            <h3 className="font-semibold text-red-800">Signal Engine Not Running</h3>
            <Badge variant="destructive">OFFLINE</Badge>
          </div>
          <p className="text-sm text-red-700 mt-2">
            Start the engine to begin real-time signal analysis
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-blue-500 bg-blue-50">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Eye className="h-5 w-5 text-blue-500" />
            <h3 className="font-semibold text-blue-800">Last Analysis Cycle Results</h3>
            <Badge variant="outline" className="text-blue-600">
              <RefreshCw className="h-3 w-3 mr-1" />
              Every 30s
            </Badge>
          </div>
          <div className="text-xs text-blue-600">
            Last: {engineStatus.lastAnalysis ? new Date(engineStatus.lastAnalysis).toLocaleTimeString() : 'Never'}
          </div>
        </div>
        
        <div className="space-y-2">
          {lastAnalysisReport ? (
            <div className="bg-white p-3 rounded border">
              <h4 className="text-sm font-semibold mb-2">📊 Analysis Results:</h4>
              <div className="text-xs font-mono whitespace-pre-line text-gray-700">
                {lastAnalysisReport}
              </div>
            </div>
          ) : (
            <div className="text-sm text-blue-700">
              🔍 Waiting for next analysis cycle... (runs every 30 seconds)
            </div>
          )}
          
          <div className="flex gap-4 text-xs text-blue-600">
            <span>📈 Total Signals: {engineStatus.totalSignals}</span>
            <span>❌ Total Rejections: {engineStatus.totalRejections}</span>
            <span>🎯 Success Rate: {engineStatus.totalSignals > 0 ? Math.round((engineStatus.totalSignals / (engineStatus.totalSignals + engineStatus.totalRejections)) * 100) : 0}%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WhyNoSignalBanner;
