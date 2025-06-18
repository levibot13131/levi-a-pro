
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { 
  Activity, 
  Database, 
  RefreshCw, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  TrendingUp,
  Zap,
  Globe
} from 'lucide-react';

interface HealthMetrics {
  binance_status: boolean;
  coingecko_status: boolean;
  tradingview_status: boolean;
  twitter_status: boolean;
  telegram_status: boolean;
  fundamental_data_status: boolean;
  overall_health_score: number;
  created_at: string;
}

const SystemHealth = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { data: healthData, refetch, isLoading } = useQuery({
    queryKey: ['system-health'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('system_health_log')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      
      if (error) {
        console.error('Error fetching health data:', error);
        return null;
      }
      
      return data as HealthMetrics;
    },
    refetchInterval: 30000, // Refresh every 30 seconds
    refetchIntervalInBackground: true,
  });

  const refreshHealth = async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
  };

  const getHealthColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getHealthBadge = (status: boolean) => {
    return status ? (
      <Badge className="bg-green-100 text-green-800">
        <CheckCircle className="h-3 w-3 mr-1" />
        Online
      </Badge>
    ) : (
      <Badge variant="destructive">
        <XCircle className="h-3 w-3 mr-1" />
        Offline
      </Badge>
    );
  };

  const services = [
    { name: 'Binance API', status: healthData?.binance_status || false, icon: Database },
    { name: 'CoinGecko API', status: healthData?.coingecko_status || false, icon: TrendingUp },
    { name: 'TradingView', status: healthData?.tradingview_status || false, icon: Activity },
    { name: 'Twitter/X', status: healthData?.twitter_status || false, icon: Globe },
    { name: 'Telegram Bot', status: healthData?.telegram_status || false, icon: Zap },
    { name: 'Fundamental Data', status: healthData?.fundamental_data_status || false, icon: Database },
  ];

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-right">בריאות המערכת</h1>
          <p className="text-muted-foreground text-right">מעקב אחר תקינות כל רכיבי המערכת בזמן אמת</p>
        </div>
        <Button 
          onClick={refreshHealth} 
          disabled={isRefreshing || isLoading}
          className="gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          רענן
        </Button>
      </div>

      {/* Overall Health Score */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-right">ציון בריאות כללי</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <Progress value={healthData?.overall_health_score || 0} className="h-3" />
            </div>
            <div className={`text-3xl font-bold ml-4 ${getHealthColor(healthData?.overall_health_score || 0)}`}>
              {healthData?.overall_health_score || 0}%
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-2 text-right">
            עדכון אחרון: {healthData?.created_at ? new Date(healthData.created_at).toLocaleString('he-IL') : 'לא זמין'}
          </p>
        </CardContent>
      </Card>

      {/* Service Status Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service, index) => {
          const Icon = service.icon;
          return (
            <Card key={index}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className="h-5 w-5" />
                    <CardTitle className="text-lg">{service.name}</CardTitle>
                  </div>
                  {getHealthBadge(service.status)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center p-4">
                  {service.status ? (
                    <CheckCircle className="h-12 w-12 text-green-500" />
                  ) : (
                    <XCircle className="h-12 w-12 text-red-500" />
                  )}
                </div>
                <p className="text-center text-sm text-muted-foreground">
                  {service.status ? 'שירות פועל תקין' : 'שירות לא זמין'}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* System Metrics */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-right">מדדי מערכת</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {services.filter(s => s.status).length}
              </div>
              <div className="text-sm text-muted-foreground">שירותים פעילים</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {services.filter(s => !s.status).length}
              </div>
              <div className="text-sm text-muted-foreground">שירותים לא פעילים</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                {Math.round((services.filter(s => s.status).length / services.length) * 100)}%
              </div>
              <div className="text-sm text-muted-foreground">זמינות מערכת</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                24/7
              </div>
              <div className="text-sm text-muted-foreground">ניטור רציף</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {!healthData && !isLoading && (
        <Card className="mt-6">
          <CardContent className="py-10 text-center">
            <AlertTriangle className="h-10 w-10 text-yellow-500 mx-auto mb-4" />
            <p className="text-lg font-medium">אין נתוני בריאות זמינים</p>
            <p className="text-muted-foreground mb-4">הפעל את מנוע המסחר לקבלת נתוני בריאות</p>
            <Button onClick={refreshHealth}>
              <RefreshCw className="h-4 w-4 mr-2" />
              נסה שוב
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SystemHealth;
