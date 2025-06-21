
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Activity, Wifi, WifiOff, AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';

interface ServiceStatus {
  name: string;
  status: 'connected' | 'disconnected' | 'error';
  lastCheck: number;
  responseTime?: number;
  details?: string;
}

const SystemHealthMonitor: React.FC = () => {
  const [services, setServices] = useState<ServiceStatus[]>([
    { name: 'Binance API', status: 'connected', lastCheck: Date.now(), responseTime: 120 },
    { name: 'CoinGecko API', status: 'connected', lastCheck: Date.now(), responseTime: 250 },
    { name: 'Telegram Bot', status: 'connected', lastCheck: Date.now(), responseTime: 180 },
    { name: 'WhaleAlert API', status: 'connected', lastCheck: Date.now(), responseTime: 340 },
    { name: 'Fear & Greed Index', status: 'connected', lastCheck: Date.now(), responseTime: 190 },
    { name: 'News Feed API', status: 'connected', lastCheck: Date.now(), responseTime: 410 }
  ]);

  const [overallHealth, setOverallHealth] = useState(100);
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      checkSystemHealth();
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const checkSystemHealth = async () => {
    setIsChecking(true);
    
    try {
      // Simulate health checks with realistic response times
      const updatedServices = await Promise.all(
        services.map(async (service) => {
          // Simulate API calls with random response times and occasional failures
          const responseTime = 100 + Math.random() * 400;
          const isHealthy = Math.random() > 0.05; // 95% uptime simulation
          
          return {
            ...service,
            status: isHealthy ? 'connected' as const : 'error' as const,
            lastCheck: Date.now(),
            responseTime: Math.round(responseTime),
            details: isHealthy ? 'Service operational' : 'Connection timeout'
          };
        })
      );

      setServices(updatedServices);
      
      // Calculate overall health
      const connectedServices = updatedServices.filter(s => s.status === 'connected').length;
      const healthPercentage = Math.round((connectedServices / updatedServices.length) * 100);
      setOverallHealth(healthPercentage);
      
    } catch (error) {
      console.error('Health check failed:', error);
    } finally {
      setIsChecking(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <WifiOff className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'connected':
        return <Badge className="bg-green-100 text-green-800">מחובר</Badge>;
      case 'error':
        return <Badge variant="destructive">שגיאה</Badge>;
      default:
        return <Badge variant="secondary">לא זמין</Badge>;
    }
  };

  const getHealthColor = (health: number) => {
    if (health >= 90) return 'text-green-600';
    if (health >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-right flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={checkSystemHealth}
              disabled={isChecking}
            >
              <RefreshCw className={`h-4 w-4 ${isChecking ? 'animate-spin' : ''}`} />
            </Button>
            <div className={`text-2xl font-bold ${getHealthColor(overallHealth)}`}>
              {overallHealth}%
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-blue-500" />
            בריאות המערכת
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span>בריאות כללית</span>
            <span className={getHealthColor(overallHealth)}>{overallHealth}%</span>
          </div>
          <Progress value={overallHealth} className="h-2" />
        </div>

        <div className="space-y-3">
          {services.map((service, index) => (
            <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                {getStatusIcon(service.status)}
                <div>
                  <p className="font-medium">{service.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {service.responseTime}ms | {new Date(service.lastCheck).toLocaleTimeString('he-IL')}
                  </p>
                </div>
              </div>
              {getStatusBadge(service.status)}
            </div>
          ))}
        </div>

        <div className="pt-3 border-t">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              עדכון אחרון: {new Date().toLocaleTimeString('he-IL')}
            </span>
            <div className="flex items-center gap-1">
              {overallHealth >= 90 ? (
                <Wifi className="h-4 w-4 text-green-500" />
              ) : (
                <WifiOff className="h-4 w-4 text-red-500" />
              )}
              <span className="text-xs">
                {overallHealth >= 90 ? 'מערכת יציבה' : 'בעיות חיבור'}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SystemHealthMonitor;
