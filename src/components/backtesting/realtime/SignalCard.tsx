
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { TradeSignal } from '@/types/asset';
import { format } from 'date-fns';

interface SignalCardProps {
  signal: TradeSignal;
}

const SignalCard: React.FC<SignalCardProps> = ({ signal }) => {
  const formatSignalTime = (timestamp: number) => {
    return format(new Date(timestamp), 'dd/MM/yyyy HH:mm');
  };

  const renderSignalStrength = (strength: string) => {
    const className = 
      strength === 'strong' ? 'bg-green-100 text-green-800' : 
      strength === 'medium' ? 'bg-yellow-100 text-yellow-800' :
      'bg-gray-100 text-gray-800';
    
    return (
      <Badge className={className}>
        {strength === 'strong' ? 'חזק' : 
         strength === 'medium' ? 'בינוני' : 'חלש'}
      </Badge>
    );
  };

  return (
    <div 
      className={`p-3 rounded-lg border ${
        signal.type === 'buy' 
          ? 'bg-green-50 border-green-200' 
          : 'bg-red-50 border-red-200'
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          {renderSignalStrength(signal.strength)}
          <Badge variant={signal.type === 'buy' ? 'outline' : 'secondary'}>
            {signal.type === 'buy' ? 'קנייה' : 'מכירה'}
          </Badge>
        </div>
        <div className="text-right">
          <div className="font-bold">{signal.strategy}</div>
          <div className="text-sm text-muted-foreground">{signal.timeframe}</div>
        </div>
      </div>

      <div className="mt-2 flex justify-between">
        <span className="text-sm text-muted-foreground">
          {formatSignalTime(signal.timestamp)}
        </span>
        <span className="font-medium">
          <span className="ml-1">מחיר:</span>
          ${signal.price.toLocaleString()}
        </span>
      </div>

      {(signal.targetPrice || signal.stopLoss) && (
        <div className="mt-2 flex justify-end gap-4 text-sm">
          {signal.stopLoss && (
            <div>
              <span className="ml-1 text-red-600">סטופ:</span>
              <span className="font-medium">${signal.stopLoss.toLocaleString()}</span>
            </div>
          )}
          {signal.targetPrice && (
            <div>
              <span className="ml-1 text-green-600">יעד:</span>
              <span className="font-medium">${signal.targetPrice.toLocaleString()}</span>
            </div>
          )}
          {signal.riskRewardRatio && (
            <div>
              <span className="ml-1">יחס סיכון:</span>
              <span className="font-medium">1:{signal.riskRewardRatio.toFixed(1)}</span>
            </div>
          )}
        </div>
      )}

      {signal.notes && (
        <div className="mt-2 text-right bg-white p-2 rounded-md text-sm">
          {signal.notes}
        </div>
      )}
    </div>
  );
};

export default SignalCard;
