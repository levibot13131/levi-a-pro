
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TradeSignal } from '@/types/asset';

interface SignalCardProps {
  signal: TradeSignal;
}

const SignalCard: React.FC<SignalCardProps> = ({ signal }) => {
  return (
    <Card className={signal.type === 'buy' ? 'border-green-200' : 'border-red-200'}>
      <CardHeader>
        <div className="flex justify-between items-start">
          <Badge className={
            signal.type === 'buy' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
            'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
          }>
            {signal.type === 'buy' ? 'קנייה' : 'מכירה'}
          </Badge>
          <CardTitle className="text-right">
            איתות {signal.strategy}
          </CardTitle>
        </div>
        <CardDescription className="text-right">
          טווח זמן: {signal.timeframe} | עוצמה: {signal.strength}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-right">
            <div>
              <p className="text-sm text-muted-foreground">מחיר כניסה</p>
              <p className="text-lg font-semibold">${signal.price.toLocaleString()}</p>
            </div>
            {signal.stopLoss && (
              <div>
                <p className="text-sm text-muted-foreground">סטופ לוס</p>
                <p className="text-lg font-semibold text-red-600">${signal.stopLoss.toLocaleString()}</p>
              </div>
            )}
            {signal.targetPrice && (
              <div>
                <p className="text-sm text-muted-foreground">יעד מחיר</p>
                <p className="text-lg font-semibold text-green-600">${signal.targetPrice.toLocaleString()}</p>
              </div>
            )}
            {signal.riskRewardRatio && (
              <div>
                <p className="text-sm text-muted-foreground">יחס סיכוי/סיכון</p>
                <p className="text-lg font-semibold">1:{signal.riskRewardRatio}</p>
              </div>
            )}
          </div>
          
          {signal.notes && (
            <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md text-right">
              <p>{signal.notes}</p>
            </div>
          )}
          
          <div className="text-right">
            <p className="text-sm text-muted-foreground">התאמה לשיטת KSEM:</p>
            <p className="text-primary">איתות זה תואם את עקרונות השיטה וכולל הגדרת סטופ לוס וניהול פוזיציה מדויק</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SignalCard;
