
import React from 'react';
import { TradeSignal } from '@/types/asset';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, BarChart4, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { getSignalTypeStyles, getSignalStrengthBadge } from './SignalTypeStyles';

interface SignalCardProps {
  signal: TradeSignal;
  assetName: string;
  isRealTimeSignal: boolean;
  formatDate: (timestamp: number) => string;
}

const SignalCard: React.FC<SignalCardProps> = ({ 
  signal, 
  assetName, 
  isRealTimeSignal, 
  formatDate 
}) => {
  const styles = getSignalTypeStyles(signal.type);

  return (
    <Card className={`${styles.bgColor} border-2 ${signal.type === 'buy' ? 'border-green-200' : 'border-red-200'}`}>
      <CardHeader className="flex flex-row items-center gap-4">
        {styles.icon}
        <div className="text-right">
          <div className="flex flex-wrap gap-2 mb-1">
            {styles.badge}
            {getSignalStrengthBadge(signal.strength)}
            {isRealTimeSignal && (
              <Badge variant="outline" className="border-primary flex items-center gap-1">
                <Activity className="h-3 w-3" />
                זמן אמת
              </Badge>
            )}
          </div>
          <CardTitle>{assetName}</CardTitle>
          <CardDescription>
            איתות ב-{formatDate(signal.timestamp)}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="text-right">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-sm text-muted-foreground">מחיר כניסה</p>
            <p className="text-lg font-semibold">${signal.price.toLocaleString()}</p>
          </div>
          {signal.targetPrice && (
            <div>
              <p className="text-sm text-muted-foreground">יעד מחיר</p>
              <p className="text-lg font-semibold text-green-600">${signal.targetPrice.toLocaleString()}</p>
            </div>
          )}
          {signal.stopLoss && (
            <div>
              <p className="text-sm text-muted-foreground">סטופ לוס</p>
              <p className="text-lg font-semibold text-red-600">${signal.stopLoss.toLocaleString()}</p>
            </div>
          )}
          {signal.riskRewardRatio && (
            <div>
              <p className="text-sm text-muted-foreground">יחס סיכוי/סיכון</p>
              <p className="text-lg font-semibold">1:{signal.riskRewardRatio}</p>
            </div>
          )}
        </div>
        
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-1">
            <BarChart4 className="h-4 w-4" />
            <p className="font-medium">אסטרטגיה: {signal.strategy}</p>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <p className="font-medium">טווח זמן: {signal.timeframe}</p>
          </div>
        </div>
        
        {signal.notes && (
          <div className="mt-4 p-3 bg-white dark:bg-gray-800 rounded-md">
            <p className="text-sm">{signal.notes}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SignalCard;
