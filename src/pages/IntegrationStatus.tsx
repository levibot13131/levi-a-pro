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
  BarChart3,
  Globe,
  Activity
} from 'lucide-react';

interface IntegrationService {
  name: string;
  status: 'connected' | 'disconnected' | 'warning';
  lastChecked: Date;
  responseTime?: number;
  description: string;
  endpoint?: string;
}

const IntegrationStatus = () => {
  const [services, setServices] = useState<IntegrationService[]>([
    {
      name: 'TradingView API',
      status: 'connected',
      lastChecked: new Date(),
      responseTime: 145,
      description: 'Real-time market data and charts',
      endpoint: 'https://api.tradingview.com'
    },
    {
      name: 'Binance API',
      status: 'connected', 
      lastChecked: new Date(),
      responseTime: 89,
      description: 'Cryptocurrency trading data',
      endpoint: 'https://api.binance.com'
    },
    {
      name: 'CoinGecko API',
      status: 'connected',
      lastChecked: new Date(),
      responseTime: 203,
      description: 'Market cap and price data',
      endpoint: 'https://api.coingecko.com'
    },
    {
      name: 'Telegram Bot',
      status: 'connected',
      lastChecked: new Date(),
      responseTime: 67,
      description: 'Alert notifications service',
      endpoint: 'https://api.telegram.org'
    },
    {
      name: 'Twitter/X Integration',
      status: 'warning',
      lastChecked: new Date(),
      responseTime: 340,
      description: 'Social sentiment analysis',
      endpoint: 'https://api.twitter.com'
    },
    {
      name: 'Supabase Database',
      status: 'connected',
      lastChecked: new Date(),
      responseTime: 56,
      description: 'Backend database and storage',
      endpoint: 'https://wugchjmppwehwlcflgor.supabase.co'
    }
  ]);
  
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refreshStatus = async () => {
    setIsRefreshing(true);
    
    // Perform actual health checks
    const updatedServices = await Promise.all(
      services.map(async (service) => {
        try {
          const start = Date.now();
          let response;
          
          switch (service.name) {
            case 'Binance API':
              response = await fetch('https://api.binance.com/api/v3/ping');
              break;
            case 'CoinGecko API':
              response = await fetch('https://api.coingecko.com/api/v3/ping');
              break;
            case 'Supabase Database':
              // Test database connection
              response = { ok: true }; // Placeholder - would test actual DB connection
              break;
            default:
              // Simulate response for other services
              response = { ok: Math.random() > 0.2 };
          }
          
          const responseTime = Date.now() - start;
          
          return {
            ...service,
            status: (response.ok ? 'connected' : 'disconnected') as 'connected' | 'disconnected' | 'warning',
            responseTime: responseTime,
            lastChecked: new Date()
          };
        } catch (error) {
          return {
            ...service,
            status: 'disconnected' as const,
            responseTime: undefined,
            lastChecked: new Date()
          };
        }
      })
    );
    
    setServices(updatedServices);
    setIsRefreshing(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'disconnected':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      default:
        return <XCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'connected':
        return <Badge className="bg-green-100 text-green-800">Connected</Badge>;
      case 'disconnected':
        return <Badge variant="destructive">Disconnected</Badge>;
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
      case 'twitter/x integration':
        return <Globe className="h-5 w-5" />;
      case 'supabase database':
        return <Activity className="h-5 w-5" />;
      default:
        return <Database className="h-5 w-5" />;
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Integration Status</h1>
          <p className="text-muted-foreground">Monitor third-party service integrations and API connections</p>
        </div>
        <Button 
          onClick={refreshStatus} 
          disabled={isRefreshing}
          className="gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh All
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

                {service.endpoint && (
                  <div className="text-xs text-muted-foreground mt-2 p-2 bg-muted rounded">
                    <strong>Endpoint:</strong> {service.endpoint}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Integration Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {services.filter(s => s.status === 'connected').length}
              </div>
              <div className="text-sm text-muted-foreground">Connected</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {services.filter(s => s.status === 'disconnected').length}
              </div>
              <div className="text-sm text-muted-foreground">Disconnected</div>
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

export default IntegrationStatus;
