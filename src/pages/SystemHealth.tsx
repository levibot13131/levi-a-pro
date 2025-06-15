
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  RefreshCw,
  Wifi,
  Database,
  MessageCircle,
  BarChart3
} from 'lucide-react';

interface ServiceStatus {
  name: string;
  status: 'online' | 'offline' | 'warning';
  lastChecked: Date;
  responseTime?: number;
  description: string;
}

const SystemHealth = () => {
  const [services, setServices] = useState<ServiceStatus[]>([
    {
      name: 'TradingView API',
      status: 'online',
      lastChecked: new Date(),
      responseTime: 145,
      description: 'Real-time market data and charts'
    },
    {
      name: 'Binance API',
      status: 'online', 
      lastChecked: new Date(),
      responseTime: 89,
      description: 'Cryptocurrency trading data'
    },
    {
      name: 'CoinGecko API',
      status: 'online',
      lastChecked: new Date(),
      responseTime: 203,
      description: 'Market cap and price data'
    },
    {
      name: 'Telegram Bot',
      status: 'online',
      lastChecked: new Date(),
      responseTime: 67,
      description: 'Alert notifications service'
    }
  ]);
  
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refreshStatus = async () => {
    setIsRefreshing(true);
    
    // Simulate API health checks
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setServices(prev => prev.map(service => ({
      ...service,
      lastChecked: new Date(),
      responseTime: Math.floor(Math.random() * 300) + 50
    })));
    
    setIsRefreshing(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'offline':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      default:
        return <XCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'online':
        return <Badge className="bg-green-100 text-green-800">Online</Badge>;
      case 'offline':
        return <Badge variant="destructive">Offline</Badge>;
      case 'warning':
        return <Badge className="bg-yellow-100 text-yellow-800">Warning</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const getServiceIcon = (serviceName: string) => {
    switch (serviceName.toLowerCase()) {
      case 'tradingview api':
        return <BarChart3 className="h-5 w-5" />;
      case 'binance api':
        return <Database className="h-5 w-5" />;
      case 'coingecko api':
        return <Wifi className="h-5 w-5" />;
      case 'telegram bot':
        return <MessageCircle className="h-5 w-5" />;
      default:
        return <Database className="h-5 w-5" />;
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">System Health</h1>
          <p className="text-muted-foreground">Monitor system performance and service status</p>
        </div>
        <Button 
          onClick={refreshStatus} 
          disabled={isRefreshing}
          className="gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh Status
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {services.map((service, index) => (
          <Card key={index}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getServiceIcon(service.name)}
                  <CardTitle className="text-lg">{service.name}</CardTitle>
                </div>
                {getStatusBadge(service.status)}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  {service.description}
                </p>
                
                <div className="flex items-center justify-between text-sm">
                  <span>Status:</span>
                  <div className="flex items-center gap-1">
                    {getStatusIcon(service.status)}
                    <span className="capitalize">{service.status}</span>
                  </div>
                </div>
                
                {service.responseTime && (
                  <div className="flex items-center justify-between text-sm">
                    <span>Response Time:</span>
                    <span className={service.responseTime > 200 ? 'text-yellow-600' : 'text-green-600'}>
                      {service.responseTime}ms
                    </span>
                  </div>
                )}
                
                <div className="flex items-center justify-between text-sm">
                  <span>Last Checked:</span>
                  <span>{service.lastChecked.toLocaleTimeString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>System Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {services.filter(s => s.status === 'online').length}
              </div>
              <div className="text-sm text-muted-foreground">Services Online</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {services.filter(s => s.status === 'offline').length}
              </div>
              <div className="text-sm text-muted-foreground">Services Offline</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {services.filter(s => s.status === 'warning').length}
              </div>
              <div className="text-sm text-muted-foreground">Warnings</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                {Math.round(services.reduce((acc, s) => acc + (s.responseTime || 0), 0) / services.length)}ms
              </div>
              <div className="text-sm text-muted-foreground">Avg Response</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SystemHealth;
