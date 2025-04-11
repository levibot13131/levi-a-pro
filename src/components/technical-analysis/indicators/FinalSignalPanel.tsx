
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowUp, ArrowDown, BarChartHorizontal, AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface FinalSignalProps {
  finalSignal: {
    signal: 'buy' | 'sell' | 'neutral';
    strength: number;
    confidence: number;
    description: string;
  };
}

const FinalSignalPanel = ({ finalSignal }: FinalSignalProps) => {
  return (
    <Card className="border-2 border-primary dark:border-primary">
      <CardContent className="p-4 space-y-4">
        <div className="flex justify-between mb-3">
          <Badge 
            className={
              finalSignal.signal === 'buy' 
                ? 'bg-green-100 text-green-800 dark:bg-green-900/70 dark:text-green-300 text-lg p-2' 
                : finalSignal.signal === 'sell' 
                  ? 'bg-red-100 text-red-800 dark:bg-red-900/70 dark:text-red-300 text-lg p-2'
                  : 'bg-blue-100 text-blue-800 dark:bg-blue-900/70 dark:text-blue-300 text-lg p-2'
            }
          >
            {finalSignal.signal === 'buy' 
              ? (
                <div className="flex items-center gap-1">
                  <ArrowUp className="h-5 w-5" />
                  קנייה
                </div>
              ) 
              : finalSignal.signal === 'sell' 
                ? (
                  <div className="flex items-center gap-1">
                    <ArrowDown className="h-5 w-5" />
                    מכירה
                  </div>
                )
                : (
                  <div className="flex items-center gap-1">
                    <BarChartHorizontal className="h-5 w-5" />
                    המתנה
                  </div>
                )
            }
          </Badge>
          <h3 className="font-bold text-lg text-right">איתות משולב מכל הטווחים</h3>
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
          <p className="text-right text-sm">{finalSignal.description}</p>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-sm text-gray-500 mb-1 text-right">עוצמת איתות</div>
            <div className="flex justify-between items-center">
              <Progress 
                value={finalSignal.strength * 10} 
                className={`h-2 ${
                  finalSignal.signal === 'buy' 
                    ? 'bg-green-100' 
                    : finalSignal.signal === 'sell'
                      ? 'bg-red-100'
                      : 'bg-blue-100'
                }`}
                indicatorClassName={
                  finalSignal.signal === 'buy' 
                    ? 'bg-green-500' 
                    : finalSignal.signal === 'sell'
                      ? 'bg-red-500'
                      : 'bg-blue-500'
                }
              />
              <span className="ml-2 font-bold">{finalSignal.strength}/10</span>
            </div>
            <div className="flex justify-end mt-1 gap-1 text-sm">
              {finalSignal.signal === 'buy' && <TrendingUp className="h-4 w-4 text-green-600" />}
              {finalSignal.signal === 'sell' && <TrendingDown className="h-4 w-4 text-red-600" />}
              {finalSignal.strength >= 7 
                ? 'איתות חזק מאוד' 
                : finalSignal.strength >= 5 
                  ? 'איתות בינוני' 
                  : 'איתות חלש'}
            </div>
          </div>
          
          <div>
            <div className="text-sm text-gray-500 mb-1 text-right">מידת ודאות</div>
            <div className="flex justify-between items-center">
              <Progress 
                value={finalSignal.confidence} 
                className="h-2 bg-blue-100"
                indicatorClassName="bg-blue-500"
              />
              <span className="ml-2 font-bold">{finalSignal.confidence}%</span>
            </div>
            <div className="flex justify-end mt-1 gap-1 text-sm">
              {finalSignal.confidence < 60 && <AlertTriangle className="h-4 w-4 text-yellow-500" />}
              {finalSignal.confidence >= 80 
                ? 'ודאות גבוהה' 
                : finalSignal.confidence >= 60 
                  ? 'ודאות בינונית' 
                  : 'ודאות נמוכה'}
            </div>
          </div>
        </div>
        
        <div className="border-t pt-3 mt-3 text-right">
          <div className="text-sm text-muted-foreground">
            הניתוח משקלל את כל טווחי הזמן, עם דגש על טווחים ארוכים יותר.
            {finalSignal.confidence < 70 && " ייתכן שכדאי להמתין לאישור נוסף."}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FinalSignalPanel;
