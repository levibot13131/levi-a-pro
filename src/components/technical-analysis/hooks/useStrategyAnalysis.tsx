
import { useState } from 'react';
import { AssetHistoricalData } from '@/types/asset';
import { Trade, BacktestResults } from '@/services/backtesting/types';
import { detectMarketTrends, analyzeTradeClusters, analyzeMarketRegimes } from '@/services/backtestingService';
import { toast } from 'sonner';

export const useStrategyAnalysis = (assetHistory: AssetHistoricalData | undefined) => {
  const [analysisBusy, setAnalysisBusy] = useState<boolean>(false);
  const [strategyAnalysisData, setStrategyAnalysisData] = useState<any>(null);
  const [showStrategyAnalysis, setShowStrategyAnalysis] = useState<boolean>(false);

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
            exitReason: Math.random() > 0.5 ? 'הגעה למטרה' : 'סטופ לוס',
            tradingSession: Math.random() > 0.66 ? 'asian' : Math.random() > 0.5 ? 'european' : 'american',
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

  return {
    analysisBusy,
    strategyAnalysisData,
    showStrategyAnalysis,
    setShowStrategyAnalysis,
    analyzeStrategy
  };
};
