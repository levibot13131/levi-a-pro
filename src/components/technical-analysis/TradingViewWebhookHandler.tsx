
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Bell, 
  Trash2, 
  ArrowUp, 
  ArrowDown, 
  Info,
  ExternalLink,
  RefreshCw
} from 'lucide-react';
import { useWebhookSignals } from '@/hooks/use-webhook-signals';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import EmptySignalsState from './webhook/EmptySignalsState';
import WebhookGuide from './webhook/WebhookGuide';
import WebhookUrlDisplay from './webhook/WebhookUrlDisplay';

const TradingViewWebhookHandler: React.FC = () => {
  const { signals, isLoading, clearSignals, simulateSignal } = useWebhookSignals();
  
  const renderSignalIcon = (action: 'buy' | 'sell' | 'info') => {
    switch (action) {
      case 'buy':
        return <ArrowUp className="h-4 w-4 text-green-500" />;
      case 'sell':
        return <ArrowDown className="h-4 w-4 text-red-500" />;
      default:
        return <Info className="h-4 w-4 text-blue-500" />;
    }
  };
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-8 gap-1"
              onClick={() => simulateSignal('buy')}
            >
              <ArrowUp className="h-3 w-3 text-green-500" />
              סימולציית קנייה
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 gap-1"
              onClick={() => simulateSignal('sell')}
            >
              <ArrowDown className="h-3 w-3 text-red-500" />
              סימולציית מכירה
            </Button>
          </div>
          <CardTitle className="text-right flex items-center gap-2">
            <Bell className="h-5 w-5" />
            איתותים מטריידינגויו
            {signals.length > 0 && (
              <Badge className="text-xs">{signals.length}</Badge>
            )}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        {signals.length === 0 ? (
          <div className="space-y-6">
            <EmptySignalsState />
            <Separator />
            <WebhookGuide />
            <WebhookUrlDisplay />
          </div>
        ) : (
          <div className="space-y-4">
            <ScrollArea className="h-[300px] rounded-md border p-4">
              <div className="space-y-3">
                {signals.map((signal) => (
                  <div
                    key={signal.id}
                    className="p-3 border rounded-md bg-background hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <Badge
                        variant="outline"
                        className={`gap-1 ${
                          signal.action === 'buy'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                            : signal.action === 'sell'
                            ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                            : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                        }`}
                      >
                        {renderSignalIcon(signal.action)}
                        {signal.action === 'buy'
                          ? 'קנייה'
                          : signal.action === 'sell'
                          ? 'מכירה'
                          : 'מידע'}
                      </Badge>
                      <div className="text-right">
                        <div className="font-semibold">{signal.symbol}</div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(signal.timestamp).toLocaleString('he-IL')}
                        </div>
                      </div>
                    </div>
                    <p className="mt-2 text-sm text-right">{signal.message}</p>
                    {signal.details && (
                      <p className="mt-1 text-xs text-muted-foreground text-right">
                        {signal.details}
                      </p>
                    )}
                    <div className="text-xs text-muted-foreground mt-2 text-right">
                      מקור: {signal.source}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
            
            <div className="flex justify-between">
              <Button
                variant="outline"
                size="sm"
                className="gap-1"
                onClick={() => simulateSignal('info')}
              >
                <RefreshCw className="h-4 w-4" />
                הוסף איתות לדוגמה
              </Button>
              
              <Button
                variant="destructive"
                size="sm"
                className="gap-1"
                onClick={clearSignals}
              >
                <Trash2 className="h-4 w-4" />
                נקה איתותים
              </Button>
            </div>
            
            <Separator className="my-4" />
            
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-right">הגדרת Webhook ב-TradingView</h3>
              <p className="text-sm text-right">
                נצח את הלינק למטה ב-Alert בטריידינגויו כדי לקבל איתותים בזמן אמת
              </p>
              <WebhookUrlDisplay />
              <div className="flex justify-end mt-2">
                <Button variant="outline" size="sm" className="gap-1">
                  <ExternalLink className="h-4 w-4" />
                  למדריך המלא
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TradingViewWebhookHandler;
