
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  Settings, 
  RefreshCw, 
  TrendingUp, 
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Activity
} from 'lucide-react';
import { binanceSocket, OHLCVData } from '@/services/binance/binanceSocket';

interface RejectionBadge {
  type: 'heat' | 'confidence' | 'riskReward' | 'volume' | 'sentiment';
  reason: string;
  value: number;
  threshold: number;
  severity: 'low' | 'medium' | 'high';
}

interface TradingOverlay {
  entry: number;
  target: number;
  stopLoss: number;
  profitPercent: number;
  isActive: boolean;
}

interface LiveTradingChartProps {
  symbol: string;
  height?: number;
  showOverlays?: boolean;
  rejectionBadges?: RejectionBadge[];
  tradingOverlay?: TradingOverlay;
}

const LiveTradingChart: React.FC<LiveTradingChartProps> = ({
  symbol,
  height = 600,
  showOverlays = true,
  rejectionBadges = [],
  tradingOverlay
}) => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('1h');
  const [liveData, setLiveData] = useState<OHLCVData | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'fallback' | 'disconnected'>('disconnected');
  const [showEMA, setShowEMA] = useState(true);
  const [showRSI, setShowRSI] = useState(true);
  const [showVolume, setShowVolume] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const cleanupRef = useRef<(() => void) | null>(null);

  const timeframes = [
    { value: '1m', label: '1 דקה' },
    { value: '5m', label: '5 דקות' },
    { value: '15m', label: '15 דקות' },
    { value: '1h', label: '1 שעה' },
    { value: '4h', label: '4 שעות' },
    { value: '1d', label: '1 יום' }
  ];

  useEffect(() => {
    console.log(`📊 Starting live chart for ${symbol} on ${selectedTimeframe}`);
    
    // Cleanup previous subscription
    if (cleanupRef.current) {
      cleanupRef.current();
    }
    
    // Subscribe to live data
    const cleanup = binanceSocket.subscribe(symbol, selectedTimeframe, (data: OHLCVData) => {
      setLiveData(data);
      console.log(`📊 Live data received for ${symbol}: $${data.close.toFixed(2)}`);
    });
    
    cleanupRef.current = cleanup;
    
    // Check connection status periodically
    const statusInterval = setInterval(() => {
      const statuses = binanceSocket.getConnectionStatus();
      const streamName = `${symbol.toLowerCase()}@kline_${selectedTimeframe}`;
      setConnectionStatus(statuses[streamName] || 'disconnected');
    }, 5000);
    
    return () => {
      cleanup();
      clearInterval(statusInterval);
    };
  }, [symbol, selectedTimeframe]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    
    // Force reconnection
    if (cleanupRef.current) {
      cleanupRef.current();
    }
    
    setTimeout(() => {
      const cleanup = binanceSocket.subscribe(symbol, selectedTimeframe, (data: OHLCVData) => {
        setLiveData(data);
      });
      cleanupRef.current = cleanup;
      setIsRefreshing(false);
    }, 1000);
  };

  const getRejectionBadgeColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-800 border-red-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getRejectionIcon = (type: string) => {
    switch (type) {
      case 'heat': return <AlertTriangle className="h-3 w-3" />;
      case 'confidence': return <XCircle className="h-3 w-3" />;
      case 'riskReward': return <TrendingDown className="h-3 w-3" />;
      case 'volume': return <Activity className="h-3 w-3" />;
      default: return <AlertTriangle className="h-3 w-3" />;
    }
  };

  const getConnectionStatusColor = () => {
    switch (connectionStatus) {
      case 'connected': return 'bg-green-100 text-green-800';
      case 'fallback': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-red-100 text-red-800';
    }
  };

  const getConnectionStatusText = () => {
    switch (connectionStatus) {
      case 'connected': return 'WebSocket חי';
      case 'fallback': return 'REST גיבוי';
      default: return 'מנותק';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            {symbol} - גרף חי
          </CardTitle>
          
          <div className="flex items-center gap-2">
            <Badge className={getConnectionStatusColor()}>
              {getConnectionStatusText()}
            </Badge>
            
            <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {timeframes.map(tf => (
                  <SelectItem key={tf.value} value={tf.value}>
                    {tf.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>
        
        {/* Overlay Controls */}
        {showOverlays && (
          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center space-x-2">
              <Switch id="ema" checked={showEMA} onCheckedChange={setShowEMA} />
              <Label htmlFor="ema" className="text-sm">EMA</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="rsi" checked={showRSI} onCheckedChange={setShowRSI} />
              <Label htmlFor="rsi" className="text-sm">RSI</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="volume" checked={showVolume} onCheckedChange={setShowVolume} />
              <Label htmlFor="volume" className="text-sm">נפח</Label>
            </div>
          </div>
        )}
      </CardHeader>
      
      <CardContent>
        {/* Live Price Display */}
        {liveData && (
          <div className="mb-4 p-4 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold">${liveData.close.toFixed(2)}</div>
                <div className="text-sm text-gray-500">מחיר נוכחי</div>
              </div>
              <div>
                <div className={`text-lg font-semibold ${liveData.change24h >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {liveData.change24h >= 0 ? '+' : ''}{liveData.change24h.toFixed(2)}%
                </div>
                <div className="text-sm text-gray-500">שינוי 24 שעות</div>
              </div>
              <div>
                <div className="text-lg font-semibold">{liveData.volume.toLocaleString()}</div>
                <div className="text-sm text-gray-500">נפח</div>
              </div>
              <div>
                <div className="text-lg font-semibold">${liveData.atr.toFixed(2)}</div>
                <div className="text-sm text-gray-500">ATR</div>
              </div>
              <div>
                <div className="text-lg font-semibold">{liveData.spread.toFixed(4)}</div>
                <div className="text-sm text-gray-500">ספרד</div>
              </div>
            </div>
          </div>
        )}

        {/* Trading Overlay */}
        {tradingOverlay && tradingOverlay.isActive && (
          <div className="mb-4 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
            <h4 className="font-semibold mb-2">עסקה פעילה</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <div className="text-gray-600">כניסה</div>
                <div className="font-semibold">${tradingOverlay.entry.toFixed(2)}</div>
              </div>
              <div>
                <div className="text-gray-600">מטרה</div>
                <div className="font-semibold text-green-600">${tradingOverlay.target.toFixed(2)}</div>
              </div>
              <div>
                <div className="text-gray-600">עצור הפסד</div>
                <div className="font-semibold text-red-600">${tradingOverlay.stopLoss.toFixed(2)}</div>
              </div>
              <div>
                <div className="text-gray-600">רווח נוכחי</div>
                <div className={`font-semibold ${tradingOverlay.profitPercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {tradingOverlay.profitPercent >= 0 ? '+' : ''}{tradingOverlay.profitPercent.toFixed(2)}%
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Chart Area */}
        <div 
          className="relative bg-white border rounded-lg"
          style={{ height }}
        >
          {liveData ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <TrendingUp className="h-16 w-16 mx-auto mb-4 text-blue-500" />
                <h3 className="text-xl font-semibold mb-2">גרף חי עובד</h3>
                <p className="text-gray-600">
                  מחיר נוכחי: ${liveData.close.toFixed(2)}
                </p>
                <p className="text-sm text-gray-500">
                  עדכון אחרון: {new Date(liveData.timestamp).toLocaleTimeString()}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <RefreshCw className="h-12 w-12 mx-auto mb-4 animate-spin text-blue-500" />
                <p className="text-gray-600">טוען נתוני גרף...</p>
              </div>
            </div>
          )}
        </div>

        {/* Rejection Badges */}
        {rejectionBadges.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-semibold mb-2">סיבות דחייה אחרונות:</h4>
            <div className="flex flex-wrap gap-2">
              {rejectionBadges.map((badge, index) => (
                <TooltipProvider key={index}>
                  <Tooltip>
                    <TooltipTrigger>
                      <Badge className={`${getRejectionBadgeColor(badge.severity)} border cursor-help`}>
                        {getRejectionIcon(badge.type)}
                        <span className="mr-1">{badge.reason}</span>
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-right">
                        ערך: {badge.value.toFixed(2)} / סף: {badge.threshold.toFixed(2)}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
            </div>
          </div>
        )}

        {/* Chart Status */}
        <div className="mt-4 text-center text-sm text-gray-500">
          <p>
            סטטוס חיבור: <span className="font-semibold">{getConnectionStatusText()}</span>
            {liveData && (
              <> | עדכון אחרון: {new Date(liveData.timestamp).toLocaleTimeString()}</>
            )}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default LiveTradingChart;
