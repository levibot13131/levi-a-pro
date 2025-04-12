
import { useState } from 'react';
import { AssetHistoricalData } from '@/types/asset';
import { BacktestTrade, BacktestResult } from '@/services/backtesting/types';
import { detectTrends, analyzeTradeClusters, analyzeMarketRegimes } from '@/services/backtestingService';
import { toast } from 'sonner';

export const useStrategyAnalysis = (assetHistory: AssetHistoricalData | undefined) => {
  const [analysisBusy, setAnalysisBusy] = useState<boolean>(false);
  const [strategyAnalysisData, setStrategyAnalysisData] = useState<any>(null);
  const [showStrategyAnalysis, setShowStrategyAnalysis] = useState<boolean>(false);

  const analyzeStrategy = () => {
    if (!assetHistory || !assetHistory.prices || assetHistory.prices.length < 30) {
      toast.error("נדרשים נתונים היסטוריים מספקים לניתוח");
      return;
    }

    setAnalysisBusy(true);
    toast.info("מנתח אסטרטגיה על נתונים היסטוריים...");

    setTimeout(() => {
      try {
        // Create mock trades for demonstration - in a real app, these would be actual backtest results
        const mockTradesData = assetHistory.prices.slice(0, -5).map((point, index) => {
          const futurePoints = assetHistory.prices.slice(index + 1, index + 6);
          const direction = Math.random() > 0.5 ? 'long' : 'short';
          const entryPrice = point[1]; // Using price from the price array
          const exitPrice = futurePoints[futurePoints.length - 1][1]; // Using price from the future array
          const profit = direction === 'long' ? exitPrice - entryPrice : entryPrice - exitPrice;
          const profitPercentage = (profit / entryPrice) * 100;
          
          return {
            id: `trade-${index}`,
            type: direction === 'long' ? 'buy' : 'sell',
            quantity: 100,
            entryPrice,
            entryDate: point[0], // Using timestamp from the price array
            exitPrice,
            exitDate: futurePoints[futurePoints.length - 1][0], // Using timestamp from the future array
            profit,
            profitPercentage,
            assetId: 'sample-asset',
            assetName: 'מטבע לדוגמה',
            direction,
            stopLoss: entryPrice * (direction === 'long' ? 0.95 : 1.05),
            status: Math.random() > 0.2 ? 'closed' : 'open',
            strategyUsed: ['פריצת התנגדות', 'זיהוי תמיכה', 'תבנית מחיר', 'אינדיקטור RSI'][Math.floor(Math.random() * 4)],
            duration: 5
          } as BacktestTrade;
        });

        const trendAnalysis = detectTrends(mockTradesData);
        const clusterAnalysis = analyzeTradeClusters(mockTradesData);

        // Calculate average profit for all trades
        const averageProfit = mockTradesData.length > 0 
          ? mockTradesData.reduce((sum, t) => sum + (t.profitPercentage || 0), 0) / mockTradesData.length 
          : 0;

        // Create a sample result structure
        const mockResult: BacktestResult = {
          id: 'sample-backtest',
          assetId: 'sample-asset',
          settings: {
            startDate: new Date(assetHistory.prices[0][0]).toISOString(),
            endDate: new Date(assetHistory.prices[assetHistory.prices.length - 1][0]).toISOString(),
            strategy: 'Sample Strategy',
            timeframe: '1d', // Default timeframe
            initialCapital: 10000,
            takeProfit: 5,
            stopLoss: 3,
            riskPerTrade: 2,
            tradeSize: 'percentage',
            leverage: 1,
            compounding: true,
            fees: 0.1
          },
          trades: mockTradesData,
          performance: {
            totalReturn: mockTradesData.reduce((sum, t) => sum + (t.profit || 0), 0),
            totalReturnPercentage: mockTradesData.reduce((sum, t) => sum + (t.profitPercentage || 0), 0),
            winRate: (mockTradesData.filter(t => (t.profit || 0) > 0).length / mockTradesData.length) * 100,
            averageWin: 2.5,
            averageLoss: -1.2,
            largestWin: 8.7,
            largestLoss: -5.3,
            profitFactor: 2.1,
            maxDrawdown: 12.5,
            sharpeRatio: 1.8,
            totalTrades: mockTradesData.length,
            winningTrades: mockTradesData.filter(t => (t.profit || 0) > 0).length,
            losingTrades: mockTradesData.filter(t => (t.profit || 0) <= 0).length,
            averageTradeDuration: 5,
            averageProfit: averageProfit
          },
          equity: assetHistory.prices.map((point, index) => ({
            date: new Date(point[0]).toISOString(),
            value: 1000 * (1 + (index * 0.01)),
            drawdown: Math.random() * 5,
            equity: 1000 * (1 + (index * 0.01))
          })),
          monthly: [
            { period: '2025-01', return: 2.5, trades: 8 },
            { period: '2025-02', return: -1.2, trades: 6 },
            { period: '2025-03', return: 3.7, trades: 9 }
          ],
          assetPerformance: [
            { 
              assetId: 'sample-asset', 
              assetName: 'מטבע לדוגמה', 
              return: 3.5, 
              trades: mockTradesData.length, 
              winRate: 65.3, 
              averageReturn: averageProfit 
            }
          ],
          createdAt: Date.now()
        };
        
        const regimeAnalysis = analyzeMarketRegimes(mockResult);

        setStrategyAnalysisData({
          trendAnalysis,
          clusterAnalysis,
          regimeAnalysis,
          performanceSummary: {
            winRate: mockResult.performance.winRate.toFixed(1) + '%',
            profitFactor: mockResult.performance.profitFactor.toFixed(2),
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
