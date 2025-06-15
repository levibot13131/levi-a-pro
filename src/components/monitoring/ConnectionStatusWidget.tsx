
import React, { useEffect, useState } from 'react';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipTrigger 
} from '@/components/ui/tooltip';
import { useRealtimeStatus } from '@/hooks/use-realtime-status';
import { 
  AlertCircle, 
  CheckCircle2, 
  WifiOff, 
  Wifi
} from 'lucide-react';

interface ConnectionStatusWidgetProps {
  showLabel?: boolean;
  refreshInterval?: number;
}

/**
 * A compact widget displaying real-time connection status
 * Suitable for headers, floating UI, or status bars
 */
const ConnectionStatusWidget: React.FC<ConnectionStatusWidgetProps> = ({
  showLabel = false,
  refreshInterval = 30000
}) => {
  const { status, refreshStatus } = useRealtimeStatus(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  
  // Check network connectivity
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  // Refresh connection status periodically
  useEffect(() => {
    const intervalId = setInterval(() => {
      refreshStatus(false);
    }, refreshInterval);
    
    return () => clearInterval(intervalId);
  }, [refreshInterval, refreshStatus]);
  
  // Calculate overall connection status
  const connectionStatus = (() => {
    // First check if device is online at all
    if (!isOnline) {
      return {
        status: 'offline',
        icon: <WifiOff size={16} className="text-red-500" />,
        label: 'Offline',
        tooltip: 'Your device is offline. Please check your network connection.'
      };
    }
    
    // If no status data yet, show unknown
    if (!status) {
      return {
        status: 'unknown',
        icon: <AlertCircle size={16} className="text-gray-500" />,
        label: 'Checking',
        tooltip: 'Checking connection status...'
      };
    }
    
    // Count active connections
    const connections = [status.tradingView, status.binance, status.twitter];
    const activeCount = connections.filter(Boolean).length;
    
    if (activeCount === connections.length) {
      return {
        status: 'connected',
        icon: <CheckCircle2 size={16} className="text-green-500" />,
        label: 'Connected',
        tooltip: 'All real-time services are connected and working properly.'
      };
    } else if (activeCount > 0) {
      return {
        status: 'partial',
        icon: <AlertCircle size={16} className="text-yellow-500" />,
        label: 'Partial',
        tooltip: `${activeCount} of ${connections.length} services connected. Some features may be limited.`
      };
    } else {
      return {
        status: 'disconnected',
        icon: <Wifi size={16} className="text-red-500" />,
        label: 'Disconnected',
        tooltip: 'Not connected to any real-time services. Real-time updates are unavailable.'
      };
    }
  })();
  
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-background/80 border">
          {connectionStatus.icon}
          {showLabel && (
            <span className="text-xs font-medium">{connectionStatus.label}</span>
          )}
        </div>
      </TooltipTrigger>
      <TooltipContent>
        <div className="text-sm">
          <p className="font-medium mb-1">{connectionStatus.label}</p>
          <p className="text-xs text-muted-foreground">
            {connectionStatus.tooltip}
          </p>
          {status && (
            <div className="grid grid-cols-3 gap-1 mt-2 pt-2 border-t border-muted">
              <ServiceStatus name="TradingView" active={status.tradingView} />
              <ServiceStatus name="Binance" active={status.binance} />
              <ServiceStatus name="Twitter" active={status.twitter} />
            </div>
          )}
        </div>
      </TooltipContent>
    </Tooltip>
  );
};

const ServiceStatus: React.FC<{ name: string; active: boolean }> = ({ 
  name, 
  active 
}) => {
  return (
    <div className="flex flex-col items-center">
      <span className="text-xs text-muted-foreground">{name}</span>
      <span className={`h-2 w-2 rounded-full mt-1 ${active ? 'bg-green-500' : 'bg-red-500'}`} />
    </div>
  );
};

export default ConnectionStatusWidget;
