
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Activity, AlertTriangle, CheckCircle2, Zap, Settings, 
  RefreshCw, ToggleLeft, ToggleRight 
} from 'lucide-react';
import { useSystemStatus } from '@/hooks/use-system-status';
import { toast } from 'sonner';
import { getProxyConfig, isProxyConfigured } from '@/services/proxy/proxyConfig';
import { Link } from 'react-router-dom';
import { useBinanceConnection } from '@/hooks/use-binance-connection';
import { 
  isRealTimeMode as checkIsRealTimeMode, 
  setRealTimeMode 
} from '@/services/binance/marketData';

const BinanceRealTimeStatus: React.FC = () => {
  const { isRealTime, connectionStatus, dataSources, enableRealTimeMode } = useSystemStatus();
  const [lastUpdateTime, setLastUpdateTime] = useState<Date | null>(null);
  const { isConnected: isBinanceConnected } = useBinanceConnection();
  const [isForceRealTime, setIsForceRealTime] = useState<boolean>(checkIsRealTimeMode());
  
  const binanceSource = dataSources.find(source => source.type === 'binance');
  const isBinanceActive = binanceSource?.status === 'active' || isBinanceConnected;
  
  // עדכון זמן עדכון אחרון
  useEffect(() => {
    if (isRealTime && isBinanceActive) {
      // עדכון ראשוני
      setLastUpdateTime(new Date());
      
      const interval = setInterval(() => {
        setLastUpdateTime(new Date());
      }, 30000);
      
      return () => clearInterval(interval);
    }
  }, [isRealTime, isBinanceActive]);
  
  const handleEnableRealTime = () => {
    // וידוא שיש מפתחות פרוקסי תקינים
    const isProxyReady = isProxyConfigured();
    
    if (!isProxyReady && !isDevelopment) {
      toast.warning('מומלץ להגדיר פרוקסי לחוויה מלאה', {
        description: 'ללא פרוקסי מוגדר, חלק מהפונקציות עשויות לא לעבוד'
      });
    }
    
    if (enableRealTimeMode()) {
      setLastUpdateTime(new Date());
      toast.success('מצב זמן אמת מופעל', {
        description: 'הנתונים יתעדכנו אוטומטית'
      });
    }
  };
  
  const handleManualRefresh = () => {
    // יוצר אירוע גלובלי שמבקש ריענון נתונים
    window.dispatchEvent(new CustomEvent('binance-refresh-request'));
    
    setLastUpdateTime(new Date());
    toast.success('נתונים רועננו', {
      description: 'נתוני בינאנס עודכנו ידנית'
    });
  };

  // טוגל למצב נתונים אמיתיים
  const handleToggleRealData = () => {
    const newValue = !isForceRealTime;
    setIsForceRealTime(newValue);
    
    // עדכון הגדרת מצב אמיתי בשירות
    setRealTimeMode(newValue);
    
    if (newValue) {
      toast.success('מצב נתונים אמיתיים מופעל', {
        description: 'המערכת תציג נתונים אמיתיים במקום נתוני דמו'
      });
    } else {
      toast.info('מצב נתונים אמיתיים מושבת', {
        description: 'המערכת תציג נתוני דמו'
      });
    }
    
    // הוספת קישור למדריך ההגדרה
    if (newValue) {
      setTimeout(() => {
        toast.info(
          <div className="flex flex-col">
            <span>לפרטים על הגדרה מלאה בסביבת אמת</span>
            <Link to="/deployment-guide" className="text-primary underline">
              עבור למדריך ההפצה המלא
            </Link>
          </div>
        );
      }, 2000);
    }
  };
  
  const proxyConfig = getProxyConfig();
  const showProxyWarning = isBinanceActive && !proxyConfig.isEnabled;
  const isDevelopment = process.env.NODE_ENV === 'development' || 
                        !window.location.hostname.includes('lovable.app');
  
  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-muted pb-2">
        <CardTitle className="flex justify-between items-center">
          <Badge variant={isRealTime ? "default" : "secondary"} className={isRealTime ? "bg-green-500" : ""}>
            {isRealTime ? 'פעיל' : 'לא פעיל'}
          </Badge>
          <div className="flex items-center">
            <Activity className="h-5 w-5 mr-2 text-primary" />
            סטטוס נתוני זמן אמת
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-4">
          {isBinanceActive ? (
            <div className="rounded-md p-3 bg-green-50 dark:bg-green-950/20 flex items-start justify-between">
              <div>
                <div className="flex flex-col gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-1"
                    onClick={handleManualRefresh}
                  >
                    <RefreshCw className="h-4 w-4" />
                    רענן נתונים
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-1 justify-start"
                    onClick={handleToggleRealData}
                  >
                    {isForceRealTime ? (
                      <>
                        <ToggleRight className="h-4 w-4 text-green-600" />
                        מצב נתונים אמיתיים
                      </>
                    ) : (
                      <>
                        <ToggleLeft className="h-4 w-4" />
                        מצב נתוני דמו
                      </>
                    )}
                  </Button>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <h3 className="font-semibold">בינאנס מחובר בהצלחה</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  מערכת זמן אמת פעילה. נתונים מתעדכנים אוטומטית כל {isDevelopment ? "5" : "30"} שניות.
                </p>
                <p className="text-sm font-medium mt-1">
                  מצב נתונים: {isForceRealTime ? (
                    <span className="text-green-600">אמיתי</span>
                  ) : (
                    <span className="text-orange-500">דמו</span>
                  )}
                </p>
              </div>
            </div>
          ) : (
            <div className="rounded-md p-3 bg-yellow-50 dark:bg-yellow-950/20 flex items-start justify-between">
              <div>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1"
                  onClick={handleEnableRealTime}
                  disabled={connectionStatus === 'disconnected'}
                >
                  <Zap className="h-4 w-4" />
                  הפעל זמן אמת
                </Button>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2 mb-1">
                  <AlertTriangle className="h-5 w-5 text-yellow-600" />
                  <h3 className="font-semibold">מצב דמו פעיל</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  המערכת פועלת במצב דמו. התחבר לבינאנס להפעלת מצב זמן אמת.
                </p>
                <Button
                  variant="link"
                  size="sm"
                  className="p-0 h-auto"
                  asChild
                >
                  <Link to="/deployment-guide">
                    למדריך הפצה מלא
                  </Link>
                </Button>
              </div>
            </div>
          )}
          
          {showProxyWarning && !isDevelopment && (
            <div className="rounded-md p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800">
              <div className="flex items-center gap-2 mb-1 justify-end">
                <h3 className="font-semibold">הגדרות פרוקסי חסרות</h3>
                <AlertTriangle className="h-5 w-5 text-amber-600" />
              </div>
              <p className="text-sm text-muted-foreground text-right mb-2">
                לחוויה מלאה וחיבור API מאובטח, מומלץ להגדיר פרוקסי.
              </p>
              <Button variant="outline" size="sm" className="w-full" asChild>
                <Link to="/proxy-settings">
                  <Settings className="mr-2 h-4 w-4" />
                  הגדר פרוקסי עכשיו
                </Link>
              </Button>
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="border rounded-md p-3">
              <div className="text-2xl font-bold text-primary">
                {isDevelopment ? "100%" :
                 connectionStatus === 'connected' ? '100%' : 
                 connectionStatus === 'partial' ? '50%' : '0%'}
              </div>
              <div className="text-sm text-muted-foreground">כיסוי נתונים בזמן אמת</div>
            </div>
            <div className="border rounded-md p-3">
              <div className="text-2xl font-bold text-primary">
                {isRealTime ? (isDevelopment ? '5s' : '30s') : 'N/A'}
              </div>
              <div className="text-sm text-muted-foreground">תדירות עדכון</div>
            </div>
          </div>
          
          {lastUpdateTime && (
            <div className="text-sm text-right text-muted-foreground">
              עדכון אחרון: {lastUpdateTime.toLocaleTimeString('he-IL')}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default BinanceRealTimeStatus;
