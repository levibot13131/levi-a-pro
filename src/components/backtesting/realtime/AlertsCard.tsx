
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, BellOff, AlertTriangle, Activity, Settings } from 'lucide-react';

interface ProxyStatus {
  isEnabled: boolean;
  hasUrl: boolean;
}

interface AlertsCardProps {
  signals: any[];
  isActive: boolean;
  toggleRealTimeAlerts: () => void;
  handleClearSignals: () => void;
  enableAutomaticAlerts: () => void;
  areAutoAlertsEnabled: boolean;
  isBinanceConnected: boolean;
  binanceMarketData: any;
  proxyStatus: ProxyStatus;
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
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <Badge variant={isActive ? "default" : "outline"}>
            {isActive ? "פעיל" : "לא פעיל"}
          </Badge>
          <CardTitle className="text-right">התראות בזמן אמת</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-col space-y-2">
            <div className="flex justify-between items-center">
              <Button 
                variant={isActive ? "destructive" : "default"}
                size="sm"
                onClick={toggleRealTimeAlerts}
                disabled={!isBinanceConnected && !proxyStatus.isEnabled}
              >
                {isActive ? (
                  <>
                    <BellOff className="ml-2 h-4 w-4" />
                    הפסק התראות
                  </>
                ) : (
                  <>
                    <Bell className="ml-2 h-4 w-4" />
                    הפעל התראות
                  </>
                )}
              </Button>
              
              <div className="flex items-center text-right">
                <span className="text-sm font-medium">סטטוס התראות:</span>
                <Badge variant={isActive ? "success" : "secondary"} className="mr-2">
                  {isActive ? "פעיל" : "לא פעיל"}
                </Badge>
              </div>
            </div>
            
            {!isBinanceConnected && (
              <div className="bg-orange-50 dark:bg-orange-950/20 p-2 rounded-md flex items-center">
                <AlertTriangle className="h-4 w-4 text-orange-500 ml-2" />
                <span className="text-xs">נדרש חיבור לבינאנס עבור התראות בזמן אמת</span>
              </div>
            )}
            
            {!proxyStatus.isEnabled && (
              <div className="bg-yellow-50 dark:bg-yellow-950/20 p-2 rounded-md flex items-center">
                <Settings className="h-4 w-4 text-yellow-500 ml-2" />
                <span className="text-xs">מומלץ להפעיל פרוקסי לקבלת התראות מדויקות</span>
              </div>
            )}
          </div>
          
          <div className="flex justify-between">
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleClearSignals}
              disabled={signals.length === 0}
            >
              נקה התראות
            </Button>
            
            <Button
              variant={areAutoAlertsEnabled ? "secondary" : "outline"}
              size="sm"
              onClick={enableAutomaticAlerts}
              disabled={!isActive}
            >
              <Activity className="ml-2 h-4 w-4" />
              התראות אוטומטיות
            </Button>
          </div>
          
          <div className="border rounded-md p-2">
            <h4 className="text-sm font-medium mb-2 text-right">התראות אחרונות</h4>
            
            {signals.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center">
                אין התראות חדשות
              </p>
            ) : (
              <div className="space-y-2 max-h-[200px] overflow-y-auto">
                {signals.map((signal, index) => (
                  <div 
                    key={index} 
                    className="text-xs p-2 border-l-2 border-primary bg-muted rounded-sm text-right"
                  >
                    <div className="font-medium">
                      {signal.type}: {signal.asset}
                    </div>
                    <div className="text-muted-foreground">
                      {signal.message}
                    </div>
                    <div className="text-[10px] text-muted-foreground">
                      {new Date(signal.timestamp).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AlertsCard;
