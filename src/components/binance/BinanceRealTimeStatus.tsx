
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity } from 'lucide-react';
import { useSystemStatus } from '@/hooks/use-system-status';
import { toast } from 'sonner';
import { useBinanceConnection } from '@/hooks/use-binance-connection';
import { 
  isRealTimeMode as checkIsRealTimeMode, 
  setRealTimeMode 
} from '@/services/binance/marketData';
import { 
  ConnectionStatusCard, 
  ProxyWarningCard, 
  ConnectionStatsCard 
} from './BinanceStatusCards';

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
  };
  
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
          <ConnectionStatusCard 
            isActive={isBinanceActive}
            connectionStatus={connectionStatus}
            isForceRealTime={isForceRealTime}
            handleToggleRealData={handleToggleRealData}
            handleManualRefresh={handleManualRefresh}
            handleEnableRealTime={handleEnableRealTime}
            isDevelopment={isDevelopment}
          />
          
          <ConnectionStatsCard 
            connectionStatus={connectionStatus}
            isRealTime={isRealTime}
            isDevelopment={isDevelopment}
            lastUpdateTime={lastUpdateTime}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default BinanceRealTimeStatus;
