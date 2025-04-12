
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BellRing, ArrowUp, ArrowDown, Info } from 'lucide-react';
import AlertsControls from './AlertsControls';
import EmptySignalsState from '@/components/backtesting/realtime/EmptySignalsState';

interface AlertsCardProps {
  signals: any[];
  isActive: boolean;
  toggleRealTimeAlerts: () => void;
  handleClearSignals: () => void;
  enableAutomaticAlerts?: () => void; // Added as optional prop
  areAutoAlertsEnabled?: boolean; // Added as optional prop
}

const AlertsCard: React.FC<AlertsCardProps> = ({
  signals,
  isActive,
  toggleRealTimeAlerts,
  handleClearSignals,
  enableAutomaticAlerts,
  areAutoAlertsEnabled
}) => {
  const renderSignalIcon = (type: 'buy' | 'sell' | string) => {
    switch (type) {
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
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center space-x-2">
          {signals.length > 0 && (
            <Badge variant="outline">{signals.length}</Badge>
          )}
        </div>
        <CardTitle className="flex items-center gap-2 text-right">
          <BellRing className="h-5 w-5" />
          התראות בזמן אמת
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <AlertsControls
            isActive={isActive}
            signalsCount={signals.length}
            toggleRealTimeAlerts={toggleRealTimeAlerts}
            handleClearSignals={handleClearSignals}
            enableAutomaticAlerts={enableAutomaticAlerts}
            areAutoAlertsEnabled={areAutoAlertsEnabled}
          />

          <Separator />

          {signals.length === 0 ? (
            <EmptySignalsState />
          ) : (
            <ScrollArea className="h-[300px]">
              <div className="space-y-3">
                {signals.map((signal) => (
                  <div
                    key={signal.id}
                    className="p-3 border rounded-md hover:bg-accent/20 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <Badge
                        variant="outline"
                        className={`gap-1 ${
                          signal.type === 'buy'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                            : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                        }`}
                      >
                        {renderSignalIcon(signal.type)}
                        {signal.type === 'buy' ? 'קנייה' : 'מכירה'}
                      </Badge>
                      <div className="text-right">
                        <div className="font-semibold">{signal.assetId}</div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(signal.timestamp).toLocaleString('he-IL')}
                        </div>
                      </div>
                    </div>
                    <p className="mt-2 text-sm text-right">מחיר: ${signal.price?.toLocaleString()}</p>
                    <p className="text-sm text-right">
                      {signal.strategy && `אסטרטגיה: ${signal.strategy}`}
                    </p>
                    {signal.notes && (
                      <p className="mt-1 text-xs text-muted-foreground text-right">
                        {signal.notes}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AlertsCard;
