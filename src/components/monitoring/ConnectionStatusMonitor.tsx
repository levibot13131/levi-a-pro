import React, { useEffect, useMemo } from 'react';
import { useRealtimeStatus } from '@/hooks/use-realtime-status';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertCircle, ArrowDownUp, RefreshCw, CheckCircle2, Activity } from 'lucide-react';
import { toast } from 'sonner';

interface ConnectionStatusMonitorProps {
  monitorInterval?: number; // milliseconds
  showControls?: boolean;
}

/**
 * Component for monitoring and displaying the status of real-time connections.
 * Includes automatic refresh and manual controls for real-time services.
 */
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
  
  // Calculate overall connection health
  const connectionHealth = useMemo(() => {
    if (!status) return 'unknown';
    
    const connections = [status.tradingView, status.binance, status.twitter];
    const activeCount = connections.filter(Boolean).length;
    
    if (activeCount === connections.length) return 'healthy';
    if (activeCount > 0) return 'partial';
    return 'disconnected';
  }, [status]);
  
  // Health indicator UI elements
  const healthIndicator = useMemo(() => {
    switch (connectionHealth) {
      case 'healthy':
        return {
          icon: <CheckCircle2 className="h-4 w-4" />,
          label: 'Healthy',
          color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
        };
      case 'partial':
        return {
          icon: <AlertCircle className="h-4 w-4" />,
          label: 'Partial',
          color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
        };
      case 'disconnected':
        return {
          icon: <AlertCircle className="h-4 w-4" />,
          label: 'Disconnected',
          color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
        };
      default:
        return {
          icon: <Activity className="h-4 w-4" />,
          label: 'Unknown',
          color: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
        };
    }
  }, [connectionHealth]);
  
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

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex justify-between items-center">
          <span>Connection Status</span>
          <Badge className={`${healthIndicator.color} flex items-center gap-1`}>
            {healthIndicator.icon} {healthIndicator.label}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-4">
          {/* Connection statuses */}
          <div className="grid grid-cols-3 gap-2">
            <StatusIndicator 
              label="TradingView" 
              isActive={!!status?.tradingView} 
              isLoading={isLoading}
            />
            <StatusIndicator 
              label="Binance" 
              isActive={!!status?.binance} 
              isLoading={isLoading}
            />
            <StatusIndicator 
              label="Twitter" 
              isActive={!!status?.twitter} 
              isLoading={isLoading}
            />
          </div>
          
          {/* Last checked time */}
          <div className="text-sm text-muted-foreground text-right">
            Last checked: {status?.lastChecked 
              ? new Date(status.lastChecked).toLocaleString() 
              : 'Never'
            }
          </div>
          
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
          
          {/* Error message */}
          {error && (
            <div className="text-sm text-red-500 mt-2">
              Error: {error.message}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

// Helper component for individual status indicators
interface StatusIndicatorProps {
  label: string;
  isActive: boolean;
  isLoading: boolean;
}

const StatusIndicator: React.FC<StatusIndicatorProps> = ({ label, isActive, isLoading }) => {
  return (
    <div className="flex flex-col items-center p-2 rounded-md bg-muted/20">
      <span className="text-xs text-muted-foreground mb-1">{label}</span>
      {isLoading ? (
        <div className="h-3 w-3 rounded-full bg-gray-300 animate-pulse"></div>
      ) : (
        <div className={`h-3 w-3 rounded-full ${isActive ? 'bg-green-500' : 'bg-red-500'}`}></div>
      )}
    </div>
  );
};

export default ConnectionStatusMonitor;
