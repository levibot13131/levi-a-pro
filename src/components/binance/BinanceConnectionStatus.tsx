
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';
import { useBinanceConnection } from '@/hooks/use-binance-connection';
import { toast } from 'sonner';
import { testBinanceConnection } from '@/services/binance/binanceService';

interface BinanceConnectionStatusProps {
  onStatusChange?: (isConnected: boolean) => void;
}

const BinanceConnectionStatus: React.FC<BinanceConnectionStatusProps> = ({
  onStatusChange
}) => {
  const { isConnected, credentials, refreshConnection } = useBinanceConnection();
  const [isTesting, setIsTesting] = useState(false);
  const [lastTestResult, setLastTestResult] = useState<boolean | null>(null);
  const [lastTestTime, setLastTestTime] = useState<Date | null>(null);
  
  useEffect(() => {
    if (onStatusChange) {
      onStatusChange(isConnected);
    }
  }, [isConnected, onStatusChange]);
  
  const handleTestConnection = async () => {
    if (!isConnected) {
      toast.error('חיבור לא פעיל', {
        description: 'אנא התחבר תחילה לחשבון בינאנס'
      });
      return;
    }
    
    setIsTesting(true);
    
    try {
      const result = await testBinanceConnection();
      setLastTestResult(result);
      setLastTestTime(new Date());
      
      if (result) {
        toast.success('החיבור לבינאנס תקין', {
          description: 'המערכת מחוברת כראוי לחשבון הבינאנס'
        });
      } else {
        toast.error('החיבור לבינאנס נכשל', {
          description: 'בדוק את המפתחות שהזנת ונסה שוב'
        });
      }
    } catch (error) {
      setLastTestResult(false);
      setLastTestTime(new Date());
      toast.error('שגיאה בבדיקת החיבור', {
        description: 'אירעה שגיאה בעת בדיקת החיבור לבינאנס'
      });
    } finally {
      setIsTesting(false);
    }
  };
  
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('he-IL', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <Badge
            variant={isConnected ? "default" : "destructive"}
            className={isConnected ? "bg-green-100 text-green-800" : ""}
          >
            {isConnected ? 'מחובר' : 'לא מחובר'}
          </Badge>
          <CardTitle className="text-right">סטטוס חיבור Binance</CardTitle>
        </div>
        <CardDescription className="text-right">
          בדוק את סטטוס החיבור לחשבון הבינאנס שלך
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {isConnected ? (
            <>
              <div className="bg-muted p-3 rounded text-right">
                <p className="text-sm font-medium">פרטי חיבור:</p>
                <div className="text-xs text-muted-foreground">
                  <div className="mt-1">חובר בתאריך: {new Date(credentials?.lastConnected || 0).toLocaleString('he-IL')}</div>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <Button
                  variant="secondary"
                  onClick={refreshConnection}
                  size="sm"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  רענן חיבור
                </Button>
                
                <Button
                  onClick={handleTestConnection}
                  size="sm"
                  disabled={isTesting}
                >
                  {isTesting ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      בודק...
                    </>
                  ) : (
                    <>בדיקת חיבור</>
                  )}
                </Button>
              </div>
              
              {lastTestResult !== null && (
                <div className={`p-3 rounded-md text-right ${
                  lastTestResult ? 'bg-green-50' : 'bg-red-50'
                }`}>
                  <div className="flex justify-end items-center">
                    {lastTestResult ? (
                      <CheckCircle className="h-5 w-5 text-green-600 ml-2" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-red-600 ml-2" />
                    )}
                    <span className="font-medium">
                      {lastTestResult ? 'החיבור תקין' : 'החיבור נכשל'}
                    </span>
                  </div>
                  <p className="text-xs mt-1">
                    נבדק בשעה: {lastTestTime ? formatTime(lastTestTime) : ''}
                  </p>
                </div>
              )}
            </>
          ) : (
            <div className="text-center">
              <AlertCircle className="h-12 w-12 mx-auto text-orange-500 mb-2" />
              <h3 className="font-medium mb-1">לא מחובר לבינאנס</h3>
              <p className="text-sm text-muted-foreground mb-4">
                חבר את המערכת לחשבון הבינאנס שלך כדי לקבל נתונים בזמן אמת
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default BinanceConnectionStatus;
