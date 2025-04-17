
import React, { useEffect } from 'react';
import { useRealtimeStatus } from '@/hooks/use-realtime-status';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, ArrowDownUp } from 'lucide-react';
import { toast } from 'sonner';
import { HealthIndicator } from './status/HealthIndicator';
import { ConnectionDetails } from './status/ConnectionDetails';
import { LastCheckedTime } from './status/LastCheckedTime';
import { ErrorMessage } from './status/ErrorMessage';

interface ConnectionStatusMonitorProps {
  monitorInterval?: number; // milliseconds
  showControls?: boolean;
}

const ConnectionStatusMonitor: React.FC<ConnectionStatusMonitorProps> = ({
  monitorInterval = 60000, // Default: check every minute
  showControls = true
}) => {
  const {
    status,
    isLoading,
    error,
    refreshStatus,
    autoRefreshEnabled,
    toggleAutoRefresh,
    startUpdates,
    stopUpdates
  } = useRealtimeStatus(true);
  
  // Set up periodic refresh based on the monitor interval
  useEffect(() => {
    if (!autoRefreshEnabled) return;
    
    const intervalId = setInterval(() => {
      refreshStatus(false);
    }, monitorInterval);
    
    return () => clearInterval(intervalId);
  }, [autoRefreshEnabled, monitorInterval, refreshStatus]);
  
  const handleRefresh = () => {
    refreshStatus(true);
    toast.info('Checking connection status...');
  };

  // Calculate connection health based on active services
  const calculateConnectionHealth = () => {
    if (!status) return 'unknown';
    
    const connections = [status.tradingView, status.binance, status.twitter];
    const activeCount = connections.filter(Boolean).length;
    
    if (activeCount === connections.length) return 'healthy';
    if (activeCount > 0) return 'partial';
    return 'disconnected';
  };

  const connectionHealth = calculateConnectionHealth();

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex justify-between items-center">
          <span>Connection Status</span>
          <HealthIndicator health={connectionHealth} />
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-4">
          <ConnectionDetails 
            status={status} 
            isLoading={isLoading} 
          />
          
          <LastCheckedTime lastChecked={status?.lastChecked} />
          
          {/* Controls */}
          {showControls && (
            <div className="flex justify-between items-center pt-2">
              <Button 
                size="sm"
                variant="outline" 
                onClick={handleRefresh}
                disabled={isLoading}
                className="flex items-center gap-1"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={toggleAutoRefresh}
                  className="flex items-center gap-1"
                >
                  <ArrowDownUp className="h-3.5 w-3.5" />
                  {autoRefreshEnabled ? 'Disable Auto' : 'Enable Auto'}
                </Button>
                
                <Button
                  size="sm"
                  variant={connectionHealth === 'healthy' ? 'outline' : 'default'}
                  onClick={connectionHealth === 'healthy' ? stopUpdates : startUpdates}
                  className="flex items-center gap-1"
                >
                  {connectionHealth === 'healthy' ? 'Stop Services' : 'Start Services'}
                </Button>
              </div>
            </div>
          )}
          
          <ErrorMessage error={error} />
        </div>
      </CardContent>
    </Card>
  );
};

export default ConnectionStatusMonitor;
