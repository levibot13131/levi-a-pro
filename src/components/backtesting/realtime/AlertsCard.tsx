
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Check, RefreshCw, Power, Trash2, Zap, WifiOff } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { TradeSignal } from '@/types/asset';

interface AlertsCardProps {
  signals: any[];
  isActive: boolean;
  toggleRealTimeAlerts: () => void;
  handleClearSignals: () => void;
  enableAutomaticAlerts: () => void;
  areAutoAlertsEnabled: boolean;
  isBinanceConnected: boolean;
  binanceMarketData: any;
  proxyStatus: { isEnabled: boolean; hasUrl: boolean };
}

const AlertsCard: React.FC<AlertsCardProps> = ({
  signals,
  isActive,
  toggleRealTimeAlerts,
  handleClearSignals,
  enableAutomaticAlerts,
  areAutoAlertsEnabled,
  isBinanceConnected,
  binanceMarketData,
  proxyStatus
}) => {
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <Badge variant={isActive ? "default" : "outline"} className={isActive ? "bg-green-500" : ""}>
            {isActive ? 'פעיל' : 'לא פעיל'}
          </Badge>
          <CardTitle className="text-right text-xl">התראות בזמן אמת</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleClearSignals}
                disabled={signals.length === 0}
              >
                <Trash2 className="h-4 w-4 ml-1" />
                נקה התראות
              </Button>
            </div>
            
            <div>
              <Button 
                variant={isActive ? "destructive" : "default"}
                size="sm"
                onClick={toggleRealTimeAlerts}
              >
                {isActive ? (
                  <>
                    <Power className="h-4 w-4 ml-1" />
                    הפסק ניתוח
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4 ml-1" />
                    הפעל ניתוח בזמן אמת
                  </>
                )}
              </Button>
            </div>
          </div>
          
          {!isActive && !areAutoAlertsEnabled && (
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full" 
              onClick={enableAutomaticAlerts}
            >
              <RefreshCw className="h-4 w-4 ml-1" />
              הפעל מעקב אוטומטי אחר נכסים מסומנים
            </Button>
          )}
          
          {!proxyStatus.isEnabled && (
            <div className="bg-amber-50 dark:bg-amber-900/20 p-3 rounded-md text-amber-800 dark:text-amber-300 text-sm flex items-start">
              <AlertCircle className="h-4 w-4 mt-0.5 ml-2 flex-shrink-0" />
              <p className="text-right">
                הגדרת פרוקסי מומלצת עבור נתונים בזמן אמת. 
                <a href="/proxy-settings" className="underline ml-1">הגדר פרוקסי</a>
              </p>
            </div>
          )}
          
          {!isBinanceConnected && (
            <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md text-blue-800 dark:text-blue-300 text-sm flex items-start">
              <WifiOff className="h-4 w-4 mt-0.5 ml-2 flex-shrink-0" />
              <p className="text-right">
                חיבור לבינאנס יאפשר נתוני מחיר מדויקים יותר. 
                <a href="/binance-integration" className="underline ml-1">התחבר לבינאנס</a>
              </p>
            </div>
          )}
          
          <div className="border rounded-md">
            <ScrollArea className="h-[300px] p-4">
              {signals.length > 0 ? (
                <div className="space-y-3">
                  {signals.map((signal, index) => (
                    <div 
                      key={index} 
                      className={`p-3 rounded-md ${
                        signal.type === 'buy' 
                          ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900' 
                          : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <Badge variant="outline" className={
                          signal.type === 'buy' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                        }>
                          {signal.type === 'buy' ? 'קנייה' : 'מכירה'}
                        </Badge>
                        <div className="font-medium">{signal.symbolName || signal.assetId}</div>
                      </div>
                      <p className="text-sm text-right">{signal.description}</p>
                      <div className="mt-2 text-xs flex justify-between">
                        <span>
                          מחיר: {typeof signal.price === 'number' 
                            ? signal.price.toLocaleString(undefined, {maximumFractionDigits: 2}) 
                            : signal.price}
                        </span>
                        <span>
                          {new Date(signal.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-10">
                  <p>אין התראות עדיין</p>
                  <p className="text-sm">התראות יופיעו כאן ברגע שיתקבלו</p>
                </div>
              )}
            </ScrollArea>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AlertsCard;
