
// Update the component to handle the updated SignalAnalysisResult type
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { SignalAnalysisResult } from '@/services/backtesting/realTimeAnalysis/analysisGenerator';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, TrendingUp, TrendingDown, Activity, BarChart4 } from 'lucide-react';

interface SignalAnalysisSummaryProps {
  signalAnalysis: SignalAnalysisResult;
  realTimeActive?: boolean;
}

const SignalAnalysisSummary: React.FC<SignalAnalysisSummaryProps> = ({ 
  signalAnalysis, 
  realTimeActive = false 
}) => {
  // Display market sentiment with appropriate icon and color
  const renderSentimentBadge = () => {
    const { marketSentiment } = signalAnalysis;
    
    switch (marketSentiment) {
      case 'bullish':
        return (
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 flex gap-1">
            <TrendingUp className="h-3.5 w-3.5" />
            חיובי
          </Badge>
        );
      case 'bearish':
        return (
          <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 flex gap-1">
            <TrendingDown className="h-3.5 w-3.5" />
            שלילי
          </Badge>
        );
      default:
        return (
          <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 flex gap-1">
            <Activity className="h-3.5 w-3.5" />
            ניטרלי
          </Badge>
        );
    }
  };
  
  return (
    <Card className="bg-accent/30 mb-6">
      <CardContent className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="flex gap-1">
                <AlertCircle className="h-3.5 w-3.5" />
                {realTimeActive ? 'ניתוח בזמן אמת' : 'תקציר ניתוח'}
              </Badge>
              <h3 className="font-bold text-right">סנטימנט שוק</h3>
            </div>
            <div className="flex justify-between items-center">
              {renderSentimentBadge()}
              <div className="text-right">
                <div className="text-2xl font-bold">{signalAnalysis.signalStrength}/10</div>
                <div className="text-sm text-muted-foreground">עוצמת איתות</div>
              </div>
            </div>
            <div className="text-sm text-muted-foreground text-right">
              {signalAnalysis.summary}
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="flex gap-1">
                <BarChart4 className="h-3.5 w-3.5" />
                סטטיסטיקות
              </Badge>
              <h3 className="font-bold text-right">סיכום איתותים</h3>
            </div>
            <div className="grid grid-cols-2 gap-1">
              <div className="text-right">
                <div className="text-xl font-semibold">{signalAnalysis.totalSignals}</div>
                <div className="text-xs text-muted-foreground">סה"כ איתותים</div>
              </div>
              <div className="text-right">
                <div className="text-xl font-semibold">{signalAnalysis.recentSignals}</div>
                <div className="text-xs text-muted-foreground">איתותים אחרונים</div>
              </div>
              <div className="text-right">
                <div className="text-xl font-semibold text-green-600">{signalAnalysis.buySignals}</div>
                <div className="text-xs text-muted-foreground">איתותי קנייה</div>
              </div>
              <div className="text-right">
                <div className="text-xl font-semibold text-red-600">{signalAnalysis.sellSignals}</div>
                <div className="text-xs text-muted-foreground">איתותי מכירה</div>
              </div>
            </div>
            <div className="text-sm text-right">
              {signalAnalysis.buyToSellRatio && (
                <span className="text-muted-foreground">יחס קנייה/מכירה: {signalAnalysis.buyToSellRatio}</span>
              )}
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span></span>
              <h3 className="font-bold text-right">המלצה</h3>
            </div>
            <div className="text-right">
              <p className="font-medium">{signalAnalysis.recommendation}</p>
              {signalAnalysis.topAssets && signalAnalysis.topAssets.length > 0 && (
                <>
                  <p className="text-sm text-muted-foreground mt-2">נכסים מובילים:</p>
                  <div className="flex flex-wrap gap-1 mt-1 justify-end">
                    {signalAnalysis.topAssets.map((asset) => (
                      <Badge key={asset} variant="secondary" className="text-xs">
                        {asset}
                      </Badge>
                    ))}
                  </div>
                </>
              )}
              {signalAnalysis.mostCommonStrategy && (
                <p className="text-xs text-muted-foreground mt-2">
                  אסטרטגיה מובילה: {signalAnalysis.mostCommonStrategy}
                </p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SignalAnalysisSummary;
