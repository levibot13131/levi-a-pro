
import React from 'react';
import { Button } from '@/components/ui/button';
import { Gauge, LineChart, ArrowUpDown, Brain } from 'lucide-react';

interface StrategyAnalysisProps {
  strategyAnalysisData: any;
  onClose: () => void;
}

const StrategyAnalysis: React.FC<StrategyAnalysisProps> = ({ 
  strategyAnalysisData,
  onClose
}) => {
  if (!strategyAnalysisData) return null;
  
  return (
    <div className="mt-4 space-y-4">
      <div className="flex justify-between items-center">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onClose}
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
  );
};

export default StrategyAnalysis;
