
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { ArrowUp, ArrowDown, BarChartHorizontal } from 'lucide-react';

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
    <div className="p-4 border-2 rounded-md border-primary">
      <div className="flex justify-between mb-3">
        <Badge 
          className={
            finalSignal.signal === 'buy' 
              ? 'bg-green-100 text-green-800 text-lg p-2' 
              : finalSignal.signal === 'sell' 
                ? 'bg-red-100 text-red-800 text-lg p-2'
                : 'bg-blue-100 text-blue-800 text-lg p-2'
          }
        >
          {finalSignal.signal === 'buy' 
            ? (
              <div className="flex items-center gap-1">
                <ArrowUp className="h-4 w-4" />
                קנייה
              </div>
            ) 
            : finalSignal.signal === 'sell' 
              ? (
                <div className="flex items-center gap-1">
                  <ArrowDown className="h-4 w-4" />
                  מכירה
                </div>
              )
              : (
                <div className="flex items-center gap-1">
                  <BarChartHorizontal className="h-4 w-4" />
                  המתנה
                </div>
              )
          }
        </Badge>
        <h3 className="font-bold text-lg text-right">איתות משולב מכל הטווחים</h3>
      </div>
      
      <p className="text-right mb-3">{finalSignal.description}</p>
      
      <div className="flex justify-between items-center">
        <Badge variant="outline" className="text-lg p-2">
          מידת ודאות: {finalSignal.confidence}%
        </Badge>
        <Badge variant="outline" className="text-lg p-2">
          עוצמת איתות: {finalSignal.strength}/10
        </Badge>
      </div>
    </div>
  );
};

export default FinalSignalPanel;
