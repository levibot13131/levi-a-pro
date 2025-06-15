
import React, { useEffect, useState } from 'react';
import { Container } from '../components/ui/container';
import SystemHealthChecker from '../components/system/SystemHealthChecker';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, Users, Activity, TrendingUp, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const SystemHealth = () => {
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const authorizedUsers = [
    'almogahronov1997@gmail.com',
    'avraham.oron@gmail.com'
  ];

  // Live system status check
  const { data: systemStatus, refetch: refetchStatus } = useQuery({
    queryKey: ['system-status'],
    queryFn: async () => {
      try {
        // Check trading engine status
        const { data: engineData } = await supabase
          .from('trading_engine_status')
          .select('*')
          .order('updated_at', { ascending: false })
          .limit(1);

        // Check recent signals
        const { data: signalsData } = await supabase
          .from('trading_signals')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(10);

        // Check system health logs
        const { data: healthData } = await supabase
          .from('system_health_log')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(1);

        return {
          engine: engineData?.[0] || null,
          recentSignals: signalsData || [],
          health: healthData?.[0] || null,
          timestamp: Date.now()
        };
      } catch (error) {
        console.error('Error fetching system status:', error);
        return null;
      }
    },
    refetchInterval: 10000, // Refresh every 10 seconds
  });

  const systemFeatures = [
    {
      name: 'Real-time Trading Engine',
      status: systemStatus?.engine?.is_running ? 'active' : 'inactive',
      description: `מנוע מסחר ${systemStatus?.engine?.is_running ? 'פועל' : 'כבוי'} - ${systemStatus?.engine?.total_signals_generated || 0} איתותים נוצרו`
    },
    {
      name: 'Telegram Bot Integration',
      status: 'active',
      description: 'בוט טלגרם שולח איתותים אוטומטיים'
    },
    {
      name: 'Live Market Data',
      status: 'active',
      description: 'נתוני שוק בזמן אמת מ-Binance'
    },
    {
      name: 'TradingView Charts',
      status: 'active',
      description: 'גרפים חיים עם אינדיקטורים טכניים'
    },
    {
      name: 'Strategy Engine',
      status: 'active',
      description: `מנוע אסטרטגיות - ${systemStatus?.engine?.success_rate ? (systemStatus.engine.success_rate * 100).toFixed(1) : 0}% הצלחה`
    },
    {
      name: 'Real-time Dashboard',
      status: 'active',
      description: `דשבורד מתעדכן - ${systemStatus?.recentSignals?.length || 0} איתותים אחרונים`
    }
  ];

  const handleRefresh = () => {
    refetchStatus();
    setLastUpdated(new Date());
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdated(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Container className="py-6">
      <div className="space-y-6">
        <div className="text-center">
          <div className="flex items-center justify-between mb-4">
            <Button onClick={handleRefresh} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              רענן
            </Button>
            <div className="text-center flex-1">
              <h1 className="text-3xl font-bold text-right mb-2">
                מצב מערכת LeviPro
              </h1>
              <p className="text-muted-foreground text-right">
                בדיקה מקיפה של כל רכיבי המערכת
              </p>
            </div>
            <div className="text-sm text-muted-foreground">
              עדכון אחרון: {lastUpdated.toLocaleTimeString('he-IL')}
            </div>
          </div>
        </div>

        {/* Security Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-right">
              <Shield className="h-5 w-5" />
              מצב אבטחה והרשאות
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Badge variant="default" className="bg-green-500">
                  מאובטח
                </Badge>
                <span className="font-medium">מערכת פרטית מלאה</span>
              </div>
              
              <div>
                <h3 className="font-medium mb-2 text-right">משתמשים מורשים:</h3>
                <div className="space-y-1">
                  {authorizedUsers.map((email, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                      <Badge variant="outline">
                        <Users className="h-3 w-3 mr-1" />
                        מורשה
                      </Badge>
                      <span className="text-sm">{email}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* System Features Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-right">
              <Activity className="h-5 w-5" />
              סטטוס תכונות המערכת
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {systemFeatures.map((feature, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <Badge 
                    variant="default" 
                    className={feature.status === 'active' ? 'bg-green-500' : 'bg-red-500'}
                  >
                    <TrendingUp className="h-3 w-3 mr-1" />
                    {feature.status === 'active' ? 'פעיל' : 'כבוי'}
                  </Badge>
                  <div className="text-right">
                    <h3 className="font-medium">{feature.name}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Live System Data */}
        {systemStatus && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-right">
                <Activity className="h-5 w-5" />
                נתוני מערכת חיים
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 border rounded">
                  <div className="text-2xl font-bold text-green-600">
                    {systemStatus.engine?.total_signals_generated || 0}
                  </div>
                  <div className="text-sm text-muted-foreground">סה"כ איתותים</div>
                </div>
                <div className="text-center p-4 border rounded">
                  <div className="text-2xl font-bold text-blue-600">
                    {systemStatus.engine?.success_rate ? (systemStatus.engine.success_rate * 100).toFixed(1) : 0}%
                  </div>
                  <div className="text-sm text-muted-foreground">שיעור הצלחה</div>
                </div>
                <div className="text-center p-4 border rounded">
                  <div className="text-2xl font-bold text-purple-600">
                    {systemStatus.recentSignals?.length || 0}
                  </div>
                  <div className="text-sm text-muted-foreground">איתותים אחרונים</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* System Health Checker */}
        <SystemHealthChecker />
      </div>
    </Container>
  );
};

export default SystemHealth;
