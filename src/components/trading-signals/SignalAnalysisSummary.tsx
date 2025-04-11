
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Activity } from 'lucide-react';

interface SignalAnalysisSummaryProps {
  signalAnalysis: {
    totalSignals: number;
    buySignals: number;
    sellSignals: number;
    strongSignals: number;
    recentSignals: number;
    buyToSellRatio?: string;
    mostCommonStrategy?: string;
    summary: string;
    recommendation: string;
  };
  realTimeActive: boolean;
}

const SignalAnalysisSummary: React.FC<SignalAnalysisSummaryProps> = ({ 
  signalAnalysis, 
  realTimeActive 
}) => {
  return (
    <Card className="mb-6 border-2 border-primary/50">
      <CardContent className="pt-4">
        <div className="flex justify-between items-start">
          <div className="flex flex-col gap-2">
            <div className="flex gap-3">
              <div className="text-center px-3 py-2 bg-muted rounded-md">
                <p className="text-lg font-bold">{signalAnalysis.buySignals}</p>
                <p className="text-xs text-green-600">קנייה</p>
              </div>
              <div className="text-center px-3 py-2 bg-muted rounded-md">
                <p className="text-lg font-bold">{signalAnalysis.sellSignals}</p>
                <p className="text-xs text-red-600">מכירה</p>
              </div>
              <div className="text-center px-3 py-2 bg-muted rounded-md">
                <p className="text-lg font-bold">{signalAnalysis.recentSignals}</p>
                <p className="text-xs">24 שעות</p>
              </div>
            </div>
            {realTimeActive && (
              <div className="flex items-center gap-1 text-green-600">
                <Activity className="h-3 w-3 animate-pulse" />
                <span className="text-sm">ניתוח בזמן אמת פעיל</span>
              </div>
            )}
          </div>
          <div className="text-right">
            <h3 className="font-bold text-lg">סיכום איתותים ({signalAnalysis.totalSignals})</h3>
            <p className="text-sm mt-1">{signalAnalysis.summary}</p>
            <p className="font-medium text-primary mt-2">{signalAnalysis.recommendation}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SignalAnalysisSummary;
