
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Bell, 
  Trash2, 
  ArrowUp, 
  ArrowDown, 
  Info,
  PlayCircle,
  PauseCircle,
  RefreshCw,
  Smartphone
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import EmptySignalsState from './EmptySignalsState';

interface AlertsCardProps {
  signals: any[];
  isActive: boolean;
  toggleRealTimeAlerts: () => void;
  handleClearSignals: () => void;
}

const AlertsCard: React.FC<AlertsCardProps> = ({
  signals,
  isActive,
  toggleRealTimeAlerts,
  handleClearSignals
}) => {
  const renderSignalIcon = (action: string) => {
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
              variant={isActive ? "default" : "outline"}
              size="sm"
              className="h-8 gap-1"
              onClick={toggleRealTimeAlerts}
            >
              {isActive ? (
                <>
                  <PauseCircle className="h-3 w-3" />
                  הפסק ניתוח
                </>
              ) : (
                <>
                  <PlayCircle className="h-3 w-3" />
                  התחל ניתוח
                </>
              )}
            </Button>
            
            {isActive && (
              <Badge className="bg-green-100 text-green-800 flex gap-1 items-center">
                <RefreshCw className="h-3 w-3 animate-spin" />
                בדיקה פעילה
              </Badge>
            )}
          </div>
          <CardTitle className="text-right flex items-center gap-2">
            <Bell className="h-5 w-5" />
            איתותים בזמן אמת
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
            <div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-md text-right">
              <h3 className="font-medium mb-2">כיצד לקבל איתותים?</h3>
              <p className="text-sm mb-3">
                לחץ על "התחל ניתוח" כדי שהמערכת תבדוק בזמן אמת את השווקים לאיתור הזדמנויות. 
                איתותים חזקים ישלחו אוטומטית גם לוואטסאפ (אם מחובר).
              </p>
              <div className="flex justify-between">
                <Button variant="outline" size="sm" className="gap-1" onClick={toggleRealTimeAlerts}>
                  <PlayCircle className="h-3 w-3" />
                  {isActive ? 'הפסק איתותים' : 'התחל איתותים'}
                </Button>
                
                <Button variant="outline" size="sm" className="gap-1" onClick={() => window.location.hash = "#whatsapp"}>
                  <Smartphone className="h-3 w-3" />
                  הגדר וואטסאפ
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <ScrollArea className="h-[300px] rounded-md border p-4">
              <div className="space-y-3">
                {signals.map((signal, index) => (
                  <div
                    key={index}
                    className="p-3 border rounded-md bg-background hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <Badge
                        variant="outline"
                        className={`gap-1 ${
                          signal.action === 'buy' || signal.type === 'buy'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                            : signal.action === 'sell' || signal.type === 'sell'
                            ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                            : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                        }`}
                      >
                        {renderSignalIcon(signal.action || signal.type)}
                        {signal.action === 'buy' || signal.type === 'buy'
                          ? 'קנייה'
                          : signal.action === 'sell' || signal.type === 'sell'
                          ? 'מכירה'
                          : 'מידע'}
                      </Badge>
                      <div className="text-right">
                        <div className="font-semibold">{signal.symbol || signal.assetId}</div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(signal.timestamp).toLocaleString('he-IL')}
                        </div>
                      </div>
                    </div>
                    <p className="mt-2 text-sm text-right">{signal.message || signal.notes || "איתות חדש"}</p>
                    {(signal.details || signal.strategy) && (
                      <p className="mt-1 text-xs text-muted-foreground text-right">
                        {signal.details || `אסטרטגיה: ${signal.strategy}`}
                      </p>
                    )}
                    <div className="text-xs text-muted-foreground mt-2 text-right">
                      מקור: {signal.source || "ניתוח טכני"}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
            
            <div className="flex justify-between">
              <Button
                variant={isActive ? "default" : "outline"}
                size="sm"
                className="gap-1"
                onClick={toggleRealTimeAlerts}
              >
                {isActive ? (
                  <>
                    <PauseCircle className="h-4 w-4" />
                    הפסק ניתוח
                  </>
                ) : (
                  <>
                    <PlayCircle className="h-4 w-4" />
                    התחל ניתוח
                  </>
                )}
              </Button>
              
              <Button
                variant="destructive"
                size="sm"
                className="gap-1"
                onClick={handleClearSignals}
              >
                <Trash2 className="h-4 w-4" />
                נקה איתותים
              </Button>
            </div>
            
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md text-right">
              <p className="text-sm">
                איתותים חזקים ישלחו אוטומטית גם לוואטסאפ. 
                <Button 
                  variant="link" 
                  className="h-auto p-0 mr-1" 
                  onClick={() => window.location.hash = "#whatsapp"}
                >
                  ניתן לבדוק ולעדכן את ההגדרות כאן
                </Button>
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AlertsCard;
