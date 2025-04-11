
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useTradingViewConnection } from '@/hooks/use-tradingview-connection';
import { useTradingViewIntegration } from '@/hooks/use-tradingview-integration';
import { CheckCircle2, AlertTriangle, RefreshCw, Zap, ZapOff } from 'lucide-react';
import TradingViewConnectButton from '@/components/technical-analysis/tradingview/TradingViewConnectButton';

const TradingViewConnectionStatus: React.FC = () => {
  const { isConnected, credentials } = useTradingViewConnection();
  const { syncEnabled, isSyncing, lastSyncTime, manualSync, toggleAutoSync } = useTradingViewIntegration();
  
  const handleManualSync = async () => {
    await manualSync();
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-right">סטטוס חיבור TradingView</CardTitle>
      </CardHeader>
      <CardContent>
        {isConnected ? (
          <div className="space-y-4">
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-md">
              <div className="flex justify-between items-center mb-3">
                <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 flex gap-1">
                  <CheckCircle2 className="h-4 w-4" />
                  מחובר
                </Badge>
                <h3 className="font-bold">TradingView מחובר</h3>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-3">
                <div>
                  <div className="text-sm text-muted-foreground">שם משתמש</div>
                  <div className="font-semibold">{credentials?.username}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">חיבור אחרון</div>
                  <div className="font-semibold">
                    {credentials?.lastConnected
                      ? new Date(credentials.lastConnected).toLocaleString('he-IL')
                      : 'לא ידוע'
                    }
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1"
                  onClick={handleManualSync}
                  disabled={isSyncing}
                >
                  <RefreshCw className={`h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
                  {isSyncing ? 'מסנכרן...' : 'סנכרן עכשיו'}
                </Button>
                
                <div className="text-sm">
                  {lastSyncTime && (
                    <span>עדכון אחרון: {lastSyncTime.toLocaleTimeString('he-IL')}</span>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <Button
                variant={syncEnabled ? "default" : "outline"}
                size="sm"
                className="gap-1"
                onClick={toggleAutoSync}
              >
                {syncEnabled ? (
                  <>
                    <ZapOff className="h-4 w-4" />
                    כיבוי סנכרון אוטומטי
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4" />
                    הפעלת סנכרון אוטומטי
                  </>
                )}
              </Button>
              
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">סטטוס סנכרון:</span>
                <Badge variant="outline" className={syncEnabled ? 
                  "bg-green-100 text-green-800 dark:bg-green-900/20" : 
                  "bg-gray-100 text-gray-800 dark:bg-gray-900/20"
                }>
                  {syncEnabled ? 'פעיל' : 'מושבת'}
                </Badge>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-md text-right">
            <div className="flex justify-between items-center mb-3">
              <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 flex gap-1">
                <AlertTriangle className="h-4 w-4" />
                לא מחובר
              </Badge>
              <h3 className="font-bold">יש להתחבר ל-TradingView</h3>
            </div>
            
            <p className="text-sm mb-4">
              חיבור לחשבון TradingView שלך יאפשר לך לצפות בגרפים, חדשות ואיתותים מותאמים אישית בזמן אמת.
            </p>
            
            <TradingViewConnectButton />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TradingViewConnectionStatus;
