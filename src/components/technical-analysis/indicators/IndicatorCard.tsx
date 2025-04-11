
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface IndicatorCardProps {
  indicator: {
    name: string;
    value: string | number;
    description: string;
    signal: 'buy' | 'sell' | 'neutral';
  };
}

const IndicatorCard = ({ indicator }: IndicatorCardProps) => {
  return (
    <div className="p-4 border rounded-md">
      <div className="flex items-center justify-between mb-2">
        <Badge 
          className={
            indicator.signal === 'buy' 
              ? 'bg-green-100 text-green-800' 
              : indicator.signal === 'sell' 
                ? 'bg-red-100 text-red-800'
                : 'bg-blue-100 text-blue-800'
          }
        >
          {indicator.signal === 'buy' 
            ? 'קנייה' 
            : indicator.signal === 'sell' 
              ? 'מכירה'
              : 'ניטרלי'
          }
        </Badge>
        <h4 className="font-medium text-right">{indicator.name}</h4>
      </div>
      <p className="text-sm text-right">{indicator.description}</p>
      <div className="mt-2 text-right">
        <span className="text-sm text-muted-foreground">ערך: </span>
        <span className="font-medium">{indicator.value}</span>
      </div>
    </div>
  );
};

export default IndicatorCard;
