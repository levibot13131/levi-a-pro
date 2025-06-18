
import React, { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useEngineStatus } from '@/hooks/useEngineStatus';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { 
  Activity, 
  Brain, 
  Shield, 
  Zap, 
  CheckCircle, 
  AlertCircle,
  Database
} from 'lucide-react';

interface SystemStatus {
  database: boolean;
  authentication: boolean;
  signalEngine: boolean;
  personalStrategy: boolean;
  realTimeUpdates: boolean;
}

export const SystemStatusIndicator = () => {
  const { status: engineStatus } = useEngineStatus();
  const { isAuthenticated, user } = useAuth();
  const [systemStatus, setSystemStatus] = useState<SystemStatus>({
    database: false,
    authentication: false,
    signalEngine: false,
    personalStrategy: false,
    realTimeUpdates: false,
  });

  useEffect(() => {
    const checkSystemHealth = async () => {
      // Check database connectivity
      const dbHealth = await checkDatabaseHealth();
      
      // Check real-time subscriptions
      const realtimeHealth = await checkRealtimeHealth();
      
      setSystemStatus({
        database: dbHealth,
        authentication: isAuthenticated,
        signalEngine: engineStatus.isRunning,
        personalStrategy: engineStatus.activeStrategies.includes('almog-personal-method'),
        realTimeUpdates: realtimeHealth,
      });
    };

    checkSystemHealth();
    const interval = setInterval(checkSystemHealth, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [isAuthenticated, engineStatus]);

  const checkDatabaseHealth = async (): Promise<boolean> => {
    try {
      const { error } = await supabase.from('trading_signals').select('id').limit(1);
      return !error;
    } catch {
      return false;
    }
  };

  const checkRealtimeHealth = async (): Promise<boolean> => {
    try {
      // Test realtime connection
      const channel = supabase.channel('health-check');
      const subscription = channel.subscribe();
      
      setTimeout(() => {
        supabase.removeChannel(channel);
      }, 1000);
      
      return subscription !== null;
    } catch {
      return false;
    }
  };

  const getStatusIcon = (status: boolean) => {
    return status ? (
      <CheckCircle className="h-3 w-3 text-green-500" />
    ) : (
      <AlertCircle className="h-3 w-3 text-red-500" />
    );
  };

  const overallHealth = Object.values(systemStatus).filter(Boolean).length;
  const totalChecks = Object.keys(systemStatus).length;
  const healthPercentage = Math.round((overallHealth / totalChecks) * 100);

  return (
    <Card className="w-full max-w-sm">
      <CardContent className="pt-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">סטטוס מערכת</span>
            <Badge 
              variant={healthPercentage >= 80 ? "default" : healthPercentage >= 60 ? "secondary" : "destructive"}
              className="gap-1"
            >
              <Activity className="h-3 w-3" />
              {healthPercentage}%
            </Badge>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {getStatusIcon(systemStatus.database)}
                <span>בסיס נתונים</span>
              </div>
              <Database className="h-3 w-3 text-muted-foreground" />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {getStatusIcon(systemStatus.authentication)}
                <span>אימות משתמשים</span>
              </div>
              <Shield className="h-3 w-3 text-muted-foreground" />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {getStatusIcon(systemStatus.signalEngine)}
                <span>מנוע איתותים</span>
              </div>
              <Zap className="h-3 w-3 text-muted-foreground" />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {getStatusIcon(systemStatus.personalStrategy)}
                <span>אסטרטגיה אישית</span>
              </div>
              <Brain className="h-3 w-3 text-muted-foreground" />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {getStatusIcon(systemStatus.realTimeUpdates)}
                <span>עדכונים בזמן אמת</span>
              </div>
              <Activity className="h-3 w-3 text-muted-foreground" />
            </div>
          </div>

          {user && (
            <div className="pt-2 border-t text-xs text-muted-foreground">
              משתמש: {user.email?.split('@')[0]}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
