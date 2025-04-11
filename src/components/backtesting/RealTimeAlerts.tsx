
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bell, BellRing, Activity, CheckCircle2, AlertTriangle, Play, Pause, Trash2 } from 'lucide-react';
import { useStoredSignals, startRealTimeAnalysis, clearStoredSignals } from '@/services/backtesting/realTimeAnalysis';
import { TradeSignal } from '@/types/asset';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { BacktestSettings } from '@/services/backtesting/types';

interface RealTimeAlertsProps {
  assetIds: string[];
  settings: Partial<BacktestSettings>;
}

const RealTimeAlerts: React.FC<RealTimeAlertsProps> = ({ assetIds, settings }) => {
  const [isActive, setIsActive] = useState(false);
  const [alertInstance, setAlertInstance] = useState<{ stop: () => void } | null>(null);
  const { data: signals = [], refetch } = useStoredSignals();
  
  useEffect(() => {
    // Refetch signals periodically
    const interval = setInterval(() => {
      refetch();
    }, 5000);
    
    return () => {
      clearInterval(interval);
      // Cleanup any active instance on unmount
      if (alertInstance) {
        alertInstance.stop();
      }
    };
  }, [alertInstance, refetch]);
  
  const toggleRealTimeAlerts = () => {
    if (isActive && alertInstance) {
      // Stop current analysis
      alertInstance.stop();
      setAlertInstance(null);
      setIsActive(false);
      toast.info("ניתוח בזמן אמת הופסק");
    } else {
      // Start new analysis
      const instance = startRealTimeAnalysis(assetIds, settings);
      setAlertInstance(instance);
      setIsActive(true);
      toast.success("ניתוח בזמן אמת הופעל", {
        description: "המערכת תתחיל לשלוח התראות בזמן אמת"
      });
    }
  };
  
  const handleClearSignals = () => {
    clearStoredSignals();
    toast.info("כל ההתראות נמחקו");
    refetch();
  };
  
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
  
  const getSortedSignals = () => {
    return [...signals].sort((a, b) => b.timestamp - a.timestamp);
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            <Button 
              variant={isActive ? "destructive" : "default"}
              onClick={toggleRealTimeAlerts}
              className="gap-2"
            >
              {isActive ? (
                <>
                  <Pause className="h-4 w-4" />
                  הפסק התראות
                </>
              ) : (
                <>
                  <Play className="h-4 w-4" />
                  הפעל התראות בזמן אמת
                </>
              )}
            </Button>
            {signals.length > 0 && (
              <Button
                variant="outline"
                onClick={handleClearSignals}
                className="gap-2"
              >
                <Trash2 className="h-4 w-4" />
                נקה התראות
              </Button>
            )}
          </div>
          <div>
            <CardTitle className="text-right">התראות ואיתותים בזמן אמת</CardTitle>
            <CardDescription className="text-right">
              {isActive ? (
                <span className="flex items-center justify-end gap-1 text-green-600">
                  <Activity className="h-3 w-3 animate-pulse" />
                  מערכת ניתוח פעילה
                </span>
              ) : (
                "מערכת ניתוח מושבתת"
              )}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {signals.length > 0 ? (
          <ScrollArea className="h-[400px]">
            <div className="space-y-3">
              {getSortedSignals().map((signal: TradeSignal) => (
                <div 
                  key={signal.id} 
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
              ))}
            </div>
          </ScrollArea>
        ) : (
          <div className="text-center p-10 space-y-2">
            <BellRing className="h-10 w-10 mx-auto text-muted-foreground" />
            <p className="text-muted-foreground">אין התראות עדיין</p>
            {!isActive && (
              <Button onClick={toggleRealTimeAlerts} variant="outline">
                הפעל ניתוח בזמן אמת
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RealTimeAlerts;
