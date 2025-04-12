
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { BacktestingResult } from '@/services/backtestingService';

interface ResultsPerformanceTabProps {
  results: BacktestingResult;
}

const ResultsPerformanceTab: React.FC<ResultsPerformanceTabProps> = ({ results }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-3 text-right">סיכום ביצועים</h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-medium">{results.performance.totalReturnPercentage.toFixed(2)}%</span>
              <span className="text-sm">תשואה כוללת</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium">{results.performance.winRate.toFixed(2)}%</span>
              <span className="text-sm">אחוז הצלחה</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium">{results.performance.totalTrades}</span>
              <span className="text-sm">סה"כ עסקאות</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium">{results.performance.profitFactor.toFixed(2)}</span>
              <span className="text-sm">מכפיל רווח</span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-3 text-right">סטטיסטיקה</h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-medium">{results.performance.winningTrades}</span>
              <span className="text-sm">עסקאות מרוויחות</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium">{results.performance.losingTrades}</span>
              <span className="text-sm">עסקאות מפסידות</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium">{results.performance.maxDrawdown.toFixed(2)}%</span>
              <span className="text-sm">ירידה מקסימלית</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium">{results.performance.averageProfit.toFixed(2)}%</span>
              <span className="text-sm">רווח ממוצע</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResultsPerformanceTab;
