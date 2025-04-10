import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AssetHistoricalData } from '@/types/asset';
import ChartToolbar from './charts/ChartToolbar';
import PriceChart from './charts/PriceChart';
import VolumeChart from './charts/VolumeChart';
import PatternDetails from './charts/PatternDetails';
import PatternList from './charts/PatternList';
import SignalList from './charts/SignalList';
import { Button } from '@/components/ui/button';
import { LineChart, Gauge, ArrowUpDown, Brain, History } from 'lucide-react';
import { detectMarketTrends, analyzeTradeClusters, analyzeMarketRegimes } from '@/services/backtestingService';
import { toast } from 'sonner';
import { Trade, BacktestResults } from '@/services/backtesting/types';

interface PriceVolumeChartProps {
  historyLoading: boolean;
  assetHistory: AssetHistoricalData | undefined;
  showVolume: boolean;
  setShowVolume: (value: boolean) => void;
  formatPrice: (price: number) => string;
  analysisData: any;
}

const PriceVolumeChart = ({
  historyLoading,
  assetHistory,
  showVolume,
  setShowVolume,
  formatPrice,
  analysisData
}: PriceVolumeChartProps) => {
  const [showPatterns, setShowPatterns] = useState<boolean>(true);
  const [showSignals, setShowSignals] = useState<boolean>(true);
  const [selectedPattern, setSelectedPattern] = useState<any>(null);
  const [showStrategyAnalysis, setShowStrategyAnalysis] = useState<boolean>(false);
  const [strategyAnalysisData, setStrategyAnalysisData] = useState<any>(null);
  const [analysisBusy, setAnalysisBusy] = useState<boolean>(false);

  const chartPatterns = analysisData?.patterns || [];

  const getPatternColor = (patternType: string) => {
    if (patternType.includes('bullish') || patternType.includes('buy')) {
      return 'rgba(0, 255, 0, 0.1)';
    } else if (patternType.includes('bearish') || patternType.includes('sell')) {
      return 'rgba(255, 0, 0, 0.1)';
    }
    return 'rgba(255, 165, 0, 0.1)';
  };

  const getPatternBorder = (patternType: string) => {
    if (patternType.includes('bullish') || patternType.includes('buy')) {
      return 'rgba(0, 200, 0, 0.5)';
    } else if (patternType.includes('bearish') || patternType.includes('sell')) {
      return 'rgba(200, 0, 0, 0.5)';
    }
    return 'rgba(200, 165, 0, 0.5)';
  };

  const analyzeStrategy = () => {
    if (!assetHistory || !assetHistory.data || assetHistory.data.length < 30) {
      toast.error("נדרשים נתונים היסטוריים מספקים לניתוח");
      return;
    }

    setAnalysisBusy(true);
    toast.info("מנתח אסטרטגיה על נתונים היסטוריים...");

    setTimeout(() => {
      try {
        const mockTrades: Trade[] = assetHistory.data.slice(0, -5).map((point, index) => {
          const futurePoints = assetHistory.data.slice(index + 1, index + 6);
          const direction = Math.random() > 0.5 ? 'long' : 'short';
          const entryPrice = point.price;
          const exitPrice = futurePoints[futurePoints.length - 1].price;
          const profit = direction === 'long' ? exitPrice - entryPrice : entryPrice - exitPrice;
          const profitPercentage = (profit / entryPrice) * 100;
          
          return {
            id: `trade-${index}`,
            assetId: 'sample-asset',
            assetName: 'מטבע לדוגמה',
            entryDate: new Date(point.timestamp).toISOString(),
            exitDate: new Date(futurePoints[futurePoints.length - 1].timestamp).toISOString(),
            entryPrice,
            exitPrice,
            direction,
            stopLoss: entryPrice * (direction === 'long' ? 0.95 : 1.05),
            takeProfit: entryPrice * (direction === 'long' ? 1.10 : 0.90),
            positionSize: 100,
            profit,
            profitPercentage,
            strategyUsed: ['פריצת התנגדות', 'זיהוי תמיכה', 'תבנית מחיר', 'אינדיקטור RSI'][Math.floor(Math.random() * 4)],
            duration: 5,
            status: Math.random() > 0.2 ? 'closed' : 'open',
            marketCondition: ['bull', 'bear', 'sideways'][Math.floor(Math.random() * 3)],
            entryReason: 'סימן היפוך מגמה',
            notes: 'עסקה לבדיקת אסטרטגיה'
          };
        });

        const trendAnalysis = detectMarketTrends(mockTrades);
        const clusterAnalysis = analyzeTradeClusters(mockTrades);
        
        const equityCurve = assetHistory.data.map((point, index) => ({
          date: new Date(point.timestamp).toISOString(),
          value: 1000 * (1 + (index * 0.01)),
          drawdown: Math.random() * 5
        }));
        
        const mockResults: BacktestResults = {
          trades: mockTrades,
          performance: {
            totalReturn: mockTrades.reduce((sum, t) => sum + (t.profit || 0), 0),
            totalReturnPercentage: mockTrades.reduce((sum, t) => sum + (t.profitPercentage || 0), 0),
            winRate: (mockTrades.filter(t => (t.profit || 0) > 0).length / mockTrades.length) * 100,
            averageWin: 2.5,
            averageLoss: -1.2,
            largestWin: 8.7,
            largestLoss: -5.3,
            profitFactor: 2.1,
            maxDrawdown: 12.5,
            sharpeRatio: 1.8,
            totalTrades: mockTrades.length,
            winningTrades: mockTrades.filter(t => (t.profit || 0) > 0).length,
            losingTrades: mockTrades.filter(t => (t.profit || 0) <= 0).length,
            averageTradeDuration: 5
          },
          equity: equityCurve,
          monthly: [
            { period: '2025-01', return: 2.5, trades: 8 },
            { period: '2025-02', return: -1.2, trades: 6 },
            { period: '2025-03', return: 3.7, trades: 9 }
          ],
          assetPerformance: [
            { assetId: 'sample-asset', assetName: 'מטבע לדוגמה', return: 3.5, trades: mockTrades.length, winRate: 65.3 }
          ]
        };
        
        const regimeAnalysis = analyzeMarketRegimes(mockResults);

        setStrategyAnalysisData({
          trendAnalysis,
          clusterAnalysis,
          regimeAnalysis,
          performanceSummary: {
            winRate: mockResults.performance.winRate.toFixed(1) + '%',
            profitFactor: mockResults.performance.profitFactor.toFixed(2),
            bestPerformingSetups: [
              { name: 'פריצת התנגדות', winRate: '78.5%', count: 28 },
              { name: 'תבנית דאבל בוטום', winRate: '72.3%', count: 15 },
              { name: 'סימן היפוך בדיקת תמיכה', winRate: '67.8%', count: 22 }
            ],
            worstPerformingSetups: [
              { name: 'נר יפני דוג׳י', winRate: '42.1%', count: 19 },
              { name: 'חציית ממוצע נע', winRate: '48.3%', count: 30 },
              { name: 'RSI קיצוני', winRate: '51.2%', count: 25 }
            ],
            marketConditionPerformance: [
              { condition: 'שוק עולה', performance: '+3.2%', count: 42 },
              { condition: 'שוק יורד', performance: '-1.8%', count: 31 },
              { condition: 'שוק ללא כיוון', performance: '+0.5%', count: 27 }
            ],
            commonMistakes: [
              'כניסה מוקדמת מדי לפני אישור מגמה',
              'הזזת סטופ לוס ללא הצדקה טכנית',
              'אי-יציאה בסימני חולשה ברורים',
              'התעלמות ממגמת-על בסקאלת זמן גבוהה יותר'
            ],
            improvementSuggestions: [
              'המתנה לאישור מגמה (לפחות 2 נרות)',
              'שימוש בשילוב מתאמי פיבונאצ׳י לזיהוי נקודות יציאה',
              'הוספת פילטר נפח מסחר לאיתותים',
              'הגדרת יחס סיכוי/סיכון מינימלי של 1:2'
            ]
          }
        });

        setShowStrategyAnalysis(true);
        setAnalysisBusy(false);
        toast.success("ניתוח האסטרטגיה הושלם");
      } catch (error) {
        console.error("Error analyzing strategy:", error);
        setAnalysisBusy(false);
        toast.error("שגיאה בניתוח האסטרטגיה");
      }
    }, 2000);
  };

  return (
    <Card className="mb-6">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            <ChartToolbar
              showVolume={showVolume}
              setShowVolume={setShowVolume}
              showPatterns={showPatterns} 
              setShowPatterns={setShowPatterns}
              showSignals={showSignals}
              setShowSignals={setShowSignals}
            />
            <Button 
              variant="outline" 
              size="sm" 
              onClick={analyzeStrategy}
              disabled={analysisBusy || historyLoading || !assetHistory}
              className="flex items-center gap-1"
            >
              {analysisBusy ? (
                <div className="h-4 w-4 border-t-2 border-primary animate-spin rounded-full" />
              ) : (
                <History className="h-4 w-4" />
              )}
              ניתוח אסטרטגיה
            </Button>
          </div>
          <CardTitle className="text-right">גרף מחיר</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-96 relative">
          <PatternDetails 
            selectedPattern={selectedPattern}
            onClose={() => setSelectedPattern(null)}
            formatPrice={formatPrice}
          />

          <PriceChart 
            historyLoading={historyLoading}
            assetHistory={assetHistory}
            formatPrice={formatPrice}
            analysisData={analysisData}
            showPatterns={showPatterns}
            showSignals={showSignals}
            onPatternClick={setSelectedPattern}
            getPatternColor={getPatternColor}
            getPatternBorder={getPatternBorder}
          />
        </div>
        
        {showPatterns && chartPatterns.length > 0 && !selectedPattern && !showStrategyAnalysis && (
          <PatternList 
            patterns={chartPatterns} 
            onPatternClick={setSelectedPattern} 
          />
        )}
        
        {showVolume && assetHistory && assetHistory.volumeData && !showStrategyAnalysis && (
          <div className="h-32 mt-4">
            <VolumeChart volumeData={assetHistory.volumeData} />
          </div>
        )}
        
        {showSignals && analysisData?.signals && analysisData.signals.length > 0 && !showStrategyAnalysis && (
          <SignalList 
            signals={analysisData.signals} 
            formatPrice={formatPrice} 
          />
        )}
        
        {showStrategyAnalysis && strategyAnalysisData && (
          <div className="mt-4 space-y-4">
            <div className="flex justify-between items-center">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowStrategyAnalysis(false)}
                className="text-muted-foreground"
              >
                חזרה לניתוח רגיל
              </Button>
              <h3 className="text-lg font-bold text-right">ניתוח מעמיק של האסטרטגיה</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-muted/40 p-4 rounded-lg">
                <h4 className="font-bold text-right mb-2 flex items-center justify-end gap-1">
                  <Gauge className="h-4 w-4" />
                  מדדי ביצוע
                </h4>
                <div className="space-y-2 text-right">
                  <div className="flex justify-between items-center border-b pb-1">
                    <span className="font-medium text-primary">{strategyAnalysisData.performanceSummary.winRate}</span>
                    <span>אחוז הצלחה</span>
                  </div>
                  <div className="flex justify-between items-center border-b pb-1">
                    <span className="font-medium text-primary">{strategyAnalysisData.performanceSummary.profitFactor}</span>
                    <span>יחס רווח/הפסד</span>
                  </div>
                  <div className="flex justify-between items-center border-b pb-1">
                    <span className="font-medium text-primary">{strategyAnalysisData.trendAnalysis.overallTrend}</span>
                    <span>מגמה כללית</span>
                  </div>
                  <div className="flex justify-between items-center border-b pb-1">
                    <span className="font-medium text-primary">{strategyAnalysisData.regimeAnalysis.bestRegime}</span>
                    <span>משטר שוק מועדף</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-muted/40 p-4 rounded-lg">
                <h4 className="font-bold text-right mb-2 flex items-center justify-end gap-1">
                  <LineChart className="h-4 w-4" />
                  סטאפים מובילים
                </h4>
                <div className="space-y-2 text-right">
                  {strategyAnalysisData.performanceSummary.bestPerformingSetups.map((setup: any, idx: number) => (
                    <div key={idx} className="flex justify-between items-center border-b pb-1">
                      <div>
                        <span className="font-medium text-primary">{setup.winRate}</span>
                        <span className="text-muted-foreground text-xs mr-1">{setup.count} עסקאות</span>
                      </div>
                      <span>{setup.name}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-red-50 dark:bg-red-950/20 p-4 rounded-lg">
                <h4 className="font-bold text-right mb-2 text-red-600 dark:text-red-400">טעויות נפוצות</h4>
                <ul className="list-disc list-inside space-y-1 text-right">
                  {strategyAnalysisData.performanceSummary.commonMistakes.map((mistake: string, idx: number) => (
                    <li key={idx} className="text-sm">{mistake}</li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg">
                <h4 className="font-bold text-right mb-2 text-green-600 dark:text-green-400">המלצות לשיפור</h4>
                <ul className="list-disc list-inside space-y-1 text-right">
                  {strategyAnalysisData.performanceSummary.improvementSuggestions.map((suggestion: string, idx: number) => (
                    <li key={idx} className="text-sm">{suggestion}</li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-muted/40 p-4 rounded-lg md:col-span-2">
                <h4 className="font-bold text-right mb-2 flex items-center justify-end gap-1">
                  <ArrowUpDown className="h-4 w-4" />
                  ביצועים לפי תנאי שוק
                </h4>
                <div className="grid grid-cols-3 gap-2">
                  {strategyAnalysisData.performanceSummary.marketConditionPerformance.map((condition: any, idx: number) => (
                    <div key={idx} className="bg-background rounded p-3 text-center">
                      <div className="text-lg font-bold">{condition.performance}</div>
                      <div className="text-sm">{condition.condition}</div>
                      <div className="text-xs text-muted-foreground">{condition.count} עסקאות</div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg md:col-span-2">
                <h4 className="font-bold text-right mb-2 flex items-center justify-end gap-1">
                  <Brain className="h-4 w-4" />
                  המלצה מסכמת
                </h4>
                <p className="text-right">
                  לפי הניתוח, האסטרטגיה שלך מראה תוצאות טובות בעיקר ב{strategyAnalysisData.regimeAnalysis.bestRegime} 
                  ובזיהוי תבניות {strategyAnalysisData.performanceSummary.bestPerformingSetups[0].name}. 
                  מומלץ להתמקד בשיפור הזיהוי של נקודות יציאה ולהימנע מכניסה מוקדמת מדי לפני קבלת אישור מגמה. 
                  שילוב של טכניקות פיבונאצ׳י ופילטור עסקאות לפי נפח מסחר צפוי לשפר משמעותית את אחוזי ההצלחה.
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PriceVolumeChart;
