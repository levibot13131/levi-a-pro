import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, Activity, Wifi, WifiOff } from 'lucide-react';

interface CandleData {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface ImprovedLiveCandlestickChartProps {
  symbol: string;
  height?: number;
}

const TIMEFRAMES = [
  { value: '1m', label: '1m' },
  { value: '5m', label: '5m' },
  { value: '15m', label: '15m' },
  { value: '1h', label: '1h' },
  { value: '4h', label: '4h' },
  { value: '1d', label: '1d' }
];

const ImprovedLiveCandlestickChart: React.FC<ImprovedLiveCandlestickChartProps> = ({ 
  symbol, 
  height = 400 
}) => {
  const [candleData, setCandleData] = useState<CandleData[]>([]);
  const [timeframe, setTimeframe] = useState('15m');
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);
  const [priceChange, setPriceChange] = useState<number>(0);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  const wsRef = useRef<WebSocket | null>(null);
  const chartRef = useRef<HTMLDivElement>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize WebSocket connection
  useEffect(() => {
    connectWebSocket();
    loadHistoricalData();

    return () => {
      cleanup();
    };
  }, [symbol, timeframe]);

  const cleanup = () => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
  };

  const connectWebSocket = () => {
    cleanup();

    const wsUrl = `wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}@kline_${timeframe}`;
    console.log(`🔗 Connecting to Binance WebSocket: ${wsUrl}`);
    
    wsRef.current = new WebSocket(wsUrl);

    wsRef.current.onopen = () => {
      console.log(`✅ WebSocket connected for ${symbol} ${timeframe}`);
      setIsConnected(true);
      setReconnectAttempts(0);
    };

    wsRef.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.k) {
          const kline = data.k;
          const newCandle: CandleData = {
            time: kline.t,
            open: parseFloat(kline.o),
            high: parseFloat(kline.h),
            low: parseFloat(kline.l),
            close: parseFloat(kline.c),
            volume: parseFloat(kline.v)
          };

          setCurrentPrice(newCandle.close);
          setLastUpdate(new Date());
          
          // Calculate price change
          setCandleData(prev => {
            if (prev.length > 0) {
              const change = ((newCandle.close - prev[0].close) / prev[0].close) * 100;
              setPriceChange(change);
            }
            
            // Update or add candle
            const updated = [...prev];
            const existingIndex = updated.findIndex(c => c.time === newCandle.time);
            
            if (existingIndex >= 0) {
              updated[existingIndex] = newCandle;
            } else {
              updated.push(newCandle);
              // Keep only last 100 candles
              if (updated.length > 100) {
                updated.shift();
              }
            }
            
            return updated.sort((a, b) => a.time - b.time);
          });
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    wsRef.current.onclose = (event) => {
      console.log(`❌ WebSocket disconnected for ${symbol}. Code: ${event.code}, Reason: ${event.reason}`);
      setIsConnected(false);
      
      // Exponential backoff reconnection
      const delay = Math.min(1000 * Math.pow(2, reconnectAttempts), 30000);
      console.log(`🔄 Reconnecting in ${delay}ms... (attempt ${reconnectAttempts + 1})`);
      
      reconnectTimeoutRef.current = setTimeout(() => {
        setReconnectAttempts(prev => prev + 1);
        connectWebSocket();
      }, delay);
    };

    wsRef.current.onerror = (error) => {
      console.error('WebSocket error:', error);
      setIsConnected(false);
    };
  };

  const loadHistoricalData = async () => {
    try {
      console.log(`📊 Loading historical data for ${symbol} ${timeframe}...`);
      const response = await fetch(
        `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${timeframe}&limit=100`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      const candles: CandleData[] = data.map((kline: any[]) => ({
        time: kline[0],
        open: parseFloat(kline[1]),
        high: parseFloat(kline[2]),
        low: parseFloat(kline[3]),
        close: parseFloat(kline[4]),
        volume: parseFloat(kline[5])
      }));

      setCandleData(candles);
      if (candles.length > 0) {
        setCurrentPrice(candles[candles.length - 1].close);
        console.log(`✅ Loaded ${candles.length} historical candles for ${symbol}`);
      }
    } catch (error) {
      console.error('Error loading historical data:', error);
    }
  };

  const renderCandlestick = (candle: CandleData, index: number) => {
    const isGreen = candle.close > candle.open;
    const bodyHeight = Math.abs(candle.close - candle.open);
    const wickTop = candle.high - Math.max(candle.open, candle.close);
    const wickBottom = Math.min(candle.open, candle.close) - candle.low;
    
    const maxPrice = Math.max(...candleData.map(c => c.high));
    const minPrice = Math.min(...candleData.map(c => c.low));
    const priceRange = maxPrice - minPrice;
    
    if (priceRange === 0) return null;
    
    const y = ((maxPrice - candle.high) / priceRange) * (height - 60) + 20;
    const bodyY = ((maxPrice - Math.max(candle.open, candle.close)) / priceRange) * (height - 60) + 20;
    const bodyHeightPx = (bodyHeight / priceRange) * (height - 60);
    const wickTopPx = (wickTop / priceRange) * (height - 60);
    const wickBottomPx = (wickBottom / priceRange) * (height - 60);
    
    const x = (index / Math.max(candleData.length - 1, 1)) * 90 + 5;
    
    return (
      <g key={`${candle.time}-${index}`}>
        {/* Top wick */}
        <line
          x1={`${x}%`}
          y1={y}
          x2={`${x}%`}
          y2={bodyY}
          stroke={isGreen ? '#10b981' : '#ef4444'}
          strokeWidth="1"
        />
        
        {/* Body */}
        <rect
          x={`${x - 1}%`}
          y={bodyY}
          width="2%"
          height={Math.max(bodyHeightPx, 1)}
          fill={isGreen ? '#10b981' : '#ef4444'}
          stroke={isGreen ? '#10b981' : '#ef4444'}
        />
        
        {/* Bottom wick */}
        <line
          x1={`${x}%`}
          y1={bodyY + bodyHeightPx}
          x2={`${x}%`}
          y2={bodyY + bodyHeightPx + wickBottomPx}
          stroke={isGreen ? '#10b981' : '#ef4444'}
          strokeWidth="1"
        />
      </g>
    );
  };

  const handleManualRefresh = () => {
    console.log('🔄 Manual refresh triggered');
    loadHistoricalData();
    connectWebSocket();
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            {symbol}
            <Badge variant={isConnected ? "default" : "destructive"}>
              {isConnected ? (
                <>
                  <Wifi className="h-3 w-3 mr-1" />
                  LIVE
                </>
              ) : (
                <>
                  <WifiOff className="h-3 w-3 mr-1" />
                  {reconnectAttempts > 0 ? `RECONNECTING (${reconnectAttempts})` : 'OFFLINE'}
                </>
              )}
            </Badge>
          </CardTitle>
          
          <div className="flex items-center gap-2">
            <Select value={timeframe} onValueChange={setTimeframe}>
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TIMEFRAMES.map(tf => (
                  <SelectItem key={tf.value} value={tf.value}>
                    {tf.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Button variant="outline" size="sm" onClick={handleManualRefresh}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {currentPrice && (
          <div className="flex items-center gap-4">
            <div className="text-2xl font-bold">
              ${currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 8 })}
            </div>
            <div className={`flex items-center gap-1 ${priceChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              <Activity className="h-4 w-4" />
              {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)}%
            </div>
            {lastUpdate && (
              <div className="text-xs text-muted-foreground">
                Updated: {lastUpdate.toLocaleTimeString()}
              </div>
            )}
          </div>
        )}
      </CardHeader>
      
      <CardContent>
        <div ref={chartRef} style={{ height: `${height}px` }} className="relative bg-gray-900 rounded overflow-hidden">
          {candleData.length > 0 ? (
            <svg width="100%" height="100%" className="absolute inset-0">
              {candleData.map((candle, index) => renderCandlestick(candle, index))}
            </svg>
          ) : (
            <div className="flex items-center justify-center h-full text-white">
              Loading candlestick data...
            </div>
          )}
        </div>
        
        <div className="mt-2 text-xs text-muted-foreground text-center">
          Real-time candlestick chart powered by Binance WebSocket
        </div>
      </CardContent>
    </Card>
  );
};

export default ImprovedLiveCandlestickChart;
