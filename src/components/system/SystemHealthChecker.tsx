
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Clock, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface HealthCheck {
  name: string;
  status: 'healthy' | 'unhealthy' | 'checking';
  message: string;
  lastChecked: Date;
}

const SystemHealthChecker = () => {
  const [healthChecks, setHealthChecks] = useState<HealthCheck[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const runHealthCheck = async () => {
    setIsRunning(true);
    const checks: HealthCheck[] = [];

    // Check Supabase connection
    try {
      const { data, error } = await supabase.from('trading_signals').select('id').limit(1);
      checks.push({
        name: 'Supabase Database',
        status: error ? 'unhealthy' : 'healthy',
        message: error ? `Error: ${error.message}` : 'Connected successfully',
        lastChecked: new Date()
      });
    } catch (error) {
      checks.push({
        name: 'Supabase Database',
        status: 'unhealthy',
        message: 'Connection failed',
        lastChecked: new Date()
      });
    }

    // Check Edge Function
    try {
      const { data, error } = await supabase.functions.invoke('trading-signals-engine');
      checks.push({
        name: 'Trading Engine Function',
        status: error ? 'unhealthy' : 'healthy',
        message: error ? `Error: ${error.message}` : 'Function responding',
        lastChecked: new Date()
      });
    } catch (error) {
      checks.push({
        name: 'Trading Engine Function',
        status: 'unhealthy',
        message: 'Function not responding',
        lastChecked: new Date()
      });
    }

    // Check Binance API
    try {
      const response = await fetch('https://api.binance.com/api/v3/ping');
      checks.push({
        name: 'Binance API',
        status: response.ok ? 'healthy' : 'unhealthy',
        message: response.ok ? 'API accessible' : 'API not responding',
        lastChecked: new Date()
      });
    } catch (error) {
      checks.push({
        name: 'Binance API',
        status: 'unhealthy',
        message: 'Connection failed',
        lastChecked: new Date()
      });
    }

    // Check Telegram Bot
    try {
      const botToken = '7639756648:AAG0-DpkgBCwdRFU1J9A9wktbL9DH4LpFdk';
      const response = await fetch(`https://api.telegram.org/bot${botToken}/getMe`);
      const result = await response.json();
      checks.push({
        name: 'Telegram Bot',
        status: result.ok ? 'healthy' : 'unhealthy',
        message: result.ok ? `Bot @${result.result.username} active` : 'Bot not responding',
        lastChecked: new Date()
      });
    } catch (error) {
      checks.push({
        name: 'Telegram Bot',
        status: 'unhealthy',
        message: 'Connection failed',
        lastChecked: new Date()
      });
    }

    // Check Real-time subscriptions
    try {
      const channel = supabase.channel('health-check');
      await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => reject(new Error('Timeout')), 5000);
        channel.subscribe((status) => {
          clearTimeout(timeout);
          if (status === 'SUBSCRIBED') {
            resolve(status);
          } else {
            reject(new Error('Failed to subscribe'));
          }
        });
      });
      
      checks.push({
        name: 'Real-time Subscriptions',
        status: 'healthy',
        message: 'Real-time channels working',
        lastChecked: new Date()
      });
      
      supabase.removeChannel(channel);
    } catch (error) {
      checks.push({
        name: 'Real-time Subscriptions',
        status: 'unhealthy',
        message: 'Real-time not working',
        lastChecked: new Date()
      });
    }

    setHealthChecks(checks);
    setIsRunning(false);

    const healthyCount = checks.filter(c => c.status === 'healthy').length;
    const totalCount = checks.length;
    
    if (healthyCount === totalCount) {
      toast.success(`✅ System Health: ${healthyCount}/${totalCount} services healthy`);
    } else {
      toast.warning(`⚠️ System Health: ${healthyCount}/${totalCount} services healthy`);
    }
  };

  useEffect(() => {
    runHealthCheck();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'unhealthy':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'healthy':
        return <Badge variant="default" className="bg-green-500">תקין</Badge>;
      case 'unhealthy':
        return <Badge variant="destructive">לא תקין</Badge>;
      default:
        return <Badge variant="secondary">בבדיקה</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-right">בדיקת מצב המערכת</CardTitle>
          <Button 
            onClick={runHealthCheck} 
            disabled={isRunning}
            variant="outline"
            size="sm"
          >
            <RefreshCw className={`h-4 w-4 ${isRunning ? 'animate-spin' : ''}`} />
            {isRunning ? 'בודק...' : 'בדוק שוב'}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {healthChecks.map((check, index) => (
            <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-2">
                {getStatusIcon(check.status)}
                <div>
                  <h3 className="font-medium">{check.name}</h3>
                  <p className="text-sm text-muted-foreground">{check.message}</p>
                  <p className="text-xs text-muted-foreground">
                    נבדק: {check.lastChecked.toLocaleTimeString('he-IL')}
                  </p>
                </div>
              </div>
              {getStatusBadge(check.status)}
            </div>
          ))}
          
          {healthChecks.length === 0 && (
            <div className="text-center py-4 text-muted-foreground">
              לחץ "בדוק שוב" כדי להתחיל בדיקת מערכת
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SystemHealthChecker;
