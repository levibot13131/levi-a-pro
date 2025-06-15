
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle, Play, Square, Settings } from 'lucide-react';
import { toast } from 'sonner';

interface AlertService {
  name: string;
  status: 'active' | 'inactive' | 'error';
  lastUpdate: Date | null;
  alertCount: number;
}

interface RealTimeAlertsServiceProps {
  assetIds: string[];
  settings: any;
  children?: ((props: {
    signals: any[];
    isActive: boolean;
    toggleRealTimeAlerts: () => void;
    handleClearSignals: () => void;
    enableAutomaticAlerts: () => void;
    areAutoAlertsEnabled: boolean;
    isBinanceConnected: boolean;
    binanceMarketData: any;
    proxyStatus: null;
  }) => React.ReactNode) | React.ReactNode;
}

const RealTimeAlertsService: React.FC<RealTimeAlertsServiceProps> = ({ assetIds, settings, children }) => {
  const [services, setServices] = useState<AlertService[]>([
    { name: 'Telegram Alerts', status: 'inactive', lastUpdate: null, alertCount: 0 },
    { name: 'Email Notifications', status: 'inactive', lastUpdate: null, alertCount: 0 },
    { name: 'Push Notifications', status: 'inactive', lastUpdate: null, alertCount: 0 }
  ]);
  const [isRunning, setIsRunning] = useState(false);

  const toggleService = async () => {
    setIsRunning(!isRunning);
    
    if (!isRunning) {
      // Start services
      setServices(prev => prev.map(service => ({
        ...service,
        status: 'active',
        lastUpdate: new Date()
      })));
      
      toast.success('Alert services started', {
        description: 'Real-time alerts are now active'
      });
    } else {
      // Stop services
      setServices(prev => prev.map(service => ({
        ...service,
        status: 'inactive'
      })));
      
      toast.info('Alert services stopped');
    }
  };

  useEffect(() => {
    if (isRunning) {
      const interval = setInterval(() => {
        setServices(prev => prev.map(service => ({
          ...service,
          alertCount: service.alertCount + Math.floor(Math.random() * 3),
          lastUpdate: new Date()
        })));
      }, 30000);

      return () => clearInterval(interval);
    }
  }, [isRunning]);

  // If children function is provided, call it with service data
  if (typeof children === 'function') {
    return (
      <>
        {children({
          signals: [],
          isActive: isRunning,
          toggleRealTimeAlerts: toggleService,
          handleClearSignals: () => {},
          enableAutomaticAlerts: () => {},
          areAutoAlertsEnabled: true,
          isBinanceConnected: true,
          binanceMarketData: {},
          proxyStatus: null
        })}
      </>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            <Button
              variant={isRunning ? "destructive" : "default"}
              size="sm"
              onClick={toggleService}
            >
              {isRunning ? <Square className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
              {isRunning ? 'Stop Alerts' : 'Start Alerts'}
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Configure
            </Button>
          </div>
          <CardTitle>Real-Time Alert Services</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {services.map((service, index) => (
            <div key={index} className="flex justify-between items-center p-3 border rounded">
              <div className="flex items-center gap-2">
                <Badge variant={
                  service.status === 'active' ? 'default' : 
                  service.status === 'error' ? 'destructive' : 'secondary'
                }>
                  {service.status === 'active' && <CheckCircle className="h-3 w-3 mr-1" />}
                  {service.status === 'error' && <AlertTriangle className="h-3 w-3 mr-1" />}
                  {service.status}
                </Badge>
                <span className="text-sm">
                  Alerts sent: {service.alertCount}
                </span>
              </div>
              <div className="text-right">
                <div className="font-medium">{service.name}</div>
                <div className="text-xs text-muted-foreground">
                  {service.lastUpdate ? 
                    `Last: ${service.lastUpdate.toLocaleTimeString()}` : 
                    'Never'
                  }
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RealTimeAlertsService;
