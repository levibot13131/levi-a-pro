
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useRealtimeStatus } from '@/hooks/use-realtime-status';
import { RefreshCw, Zap, ZapOff, CheckCircle2, XCircle } from 'lucide-react';

const RealTimeStatus: React.FC = () => {
  const {
    status,
    isLoading,
    refreshStatus,
    autoRefreshEnabled,
    toggleAutoRefresh,
    startUpdates
  } = useRealtimeStatus(true);
  
  const handleRefresh = () => {
    refreshStatus(true);
  };
  
  const handleStart = () => {
    startUpdates();
  };
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-right">סטטוס עדכונים בזמן אמת</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                className="gap-1"
                disabled={isLoading}
                onClick={handleRefresh}
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                רענן סטטוס
              </Button>
              
              <Button
                variant={autoRefreshEnabled ? "default" : "outline"}
                size="sm"
                className="gap-1"
                onClick={toggleAutoRefresh}
              >
                {autoRefreshEnabled ? (
                  <>
                    <ZapOff className="h-4 w-4" />
                    כיבוי עדכון אוטומטי
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4" />
                    הפעלת עדכון אוטומטי
                  </>
                )}
              </Button>
            </div>
            
            <Button
              variant="default"
              size="sm"
              className="gap-1"
              onClick={handleStart}
            >
              <Zap className="h-4 w-4" />
              הפעל את כל העדכונים
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-muted rounded-md">
              <div className="flex justify-between items-center mb-2">
                <Badge
                  className={status?.tradingView ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
                >
                  {status?.tradingView ? 'פעיל' : 'לא פעיל'}
                </Badge>
                <h3 className="font-semibold text-right">TradingView</h3>
              </div>
              <div className="flex justify-end items-center mt-2">
                {status?.tradingView ? (
                  <CheckCircle2 className="h-5 w-5 text-green-600 ml-1" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-600 ml-1" />
                )}
                <span className="text-sm">סטטוס חיבור</span>
              </div>
            </div>
            
            <div className="p-4 bg-muted rounded-md">
              <div className="flex justify-between items-center mb-2">
                <Badge
                  className={status?.binance ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
                >
                  {status?.binance ? 'פעיל' : 'לא פעיל'}
                </Badge>
                <h3 className="font-semibold text-right">Binance</h3>
              </div>
              <div className="flex justify-end items-center mt-2">
                {status?.binance ? (
                  <CheckCircle2 className="h-5 w-5 text-green-600 ml-1" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-600 ml-1" />
                )}
                <span className="text-sm">סטטוס חיבור</span>
              </div>
            </div>
            
            <div className="p-4 bg-muted rounded-md">
              <div className="flex justify-between items-center mb-2">
                <Badge
                  className={status?.twitter ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
                >
                  {status?.twitter ? 'פעיל' : 'לא פעיל'}
                </Badge>
                <h3 className="font-semibold text-right">Twitter</h3>
              </div>
              <div className="flex justify-end items-center mt-2">
                {status?.twitter ? (
                  <CheckCircle2 className="h-5 w-5 text-green-600 ml-1" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-600 ml-1" />
                )}
                <span className="text-sm">סטטוס חיבור</span>
              </div>
            </div>
          </div>
          
          {status && (
            <div className="text-xs text-muted-foreground text-right">
              עדכון אחרון: {new Date(status.lastChecked).toLocaleString('he-IL')}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RealTimeStatus;
