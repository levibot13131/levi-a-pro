
import React from 'react';
import { WebhookSignal } from '@/types/webhookSignal';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import EmptySignalsState from './EmptySignalsState';

interface SignalsListProps {
  signals: WebhookSignal[];
}

const SignalsList: React.FC<SignalsListProps> = ({ signals }) => {
  if (signals.length === 0) {
    return <EmptySignalsState />;
  }
  
  return (
    <ScrollArea className="h-[300px]">
      <div className="space-y-2">
        {signals.map(signal => (
          <div 
            key={signal.id} 
            className={`p-2 rounded border ${
              signal.action === 'buy' 
                ? 'bg-green-50 border-green-200' 
                : signal.action === 'sell' 
                  ? 'bg-red-50 border-red-200' 
                  : 'bg-blue-50 border-blue-200'
            }`}
          >
            <div className="flex justify-between items-start">
              <Badge 
                className={
                  signal.action === 'buy' 
                    ? 'bg-green-100 text-green-800' 
                    : signal.action === 'sell' 
                      ? 'bg-red-100 text-red-800' 
                      : 'bg-blue-100 text-blue-800'
                }
              >
                {signal.action === 'buy' ? 'קנייה' : signal.action === 'sell' ? 'מכירה' : 'מידע'}
              </Badge>
              <span className="font-bold">{signal.symbol}</span>
            </div>
            <p className="mt-1 text-right font-medium">{signal.message}</p>
            
            {signal.details && (
              <div className="mt-1 text-xs text-gray-600 bg-white p-1.5 rounded">
                <p className="text-right">{signal.details}</p>
              </div>
            )}
            
            <div className="text-xs text-muted-foreground mt-1 flex justify-between">
              <Button variant="ghost" size="sm" className="h-6 px-1 py-0 text-xs">
                פתח בגרף
              </Button>
              <span>{new Date(signal.timestamp).toLocaleString('he-IL')}</span>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};

export default SignalsList;
