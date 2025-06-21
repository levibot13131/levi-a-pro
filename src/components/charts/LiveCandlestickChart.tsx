import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, Activity, Wifi } from 'lucide-react';

interface CandleData {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface LiveCandlestickChartProps {
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

const LiveCandlestickChart: React.FC<LiveCandlestickChartProps> = ({ 
  symbol, 
  height = 400 
}) => {
  const [candleData, setCandleData] = useState<CandleData[]>([]);
  const [timeframe, setTimeframe] = useState('15m');
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);
  const [priceChange, setPriceChange] = useState<number>(0);
  const wsRef = useRef<WebSocket | null>(null);
  const chartRef = useRef<HTMLDivElement>(null);

  // Initialize WebSocket connection
  useEffect(() => {
    connectWebSocket();
    loadHistoricalData();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [symbol, timeframe]);

  const connectWebSocket = () => {
    if (wsRef.current) {
      wsRef.current.close();
    }

    const wsUrl = `wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}@kline_${timeframe}`;
    console.log(`🔗 Connecting to Binance WebSocket: ${wsUrl}`);
    
    wsRef.current = new WebSocket(wsUrl);

    wsRef.current.onopen = () => {
      console.log(`✅ WebSocket connected for ${symbol} ${timeframe}`);
      setIsConnected(true);
    };

    wsRef.current.onmessage = (event) => {
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
    };

    wsRef.current.onclose = () => {
      console.log(`❌ WebSocket disconnected for ${symbol}`);
      setIsConnected(false);
      
      // Reconnect after 5 seconds
      setTimeout(() => {
        if (wsRef.current?.readyState === WebSocket.CLOSED) {
          connectWebSocket();
        }
      }, 5000);
    };

    wsRef.current.onerror = (error) => {
      console.error('WebSocket error:', error);
      setIsConnected(false);
    };
  };

  const loadHistoricalData = async () => {
    try {
      const response = await fetch(
        `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${timeframe}&limit=100`
      );
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
    
    const y = ((maxPrice - candle.high) / priceRange) * (height - 60) + 20;
    const bodyY = ((maxPrice - Math.max(candle.open, candle.close)) / priceRange) * (height - 60) + 20;
    const bodyHeightPx = (bodyHeight / priceRange) * (height - 60);
    const wickTopPx = (wickTop / priceRange) * (height - 60);
    const wickBottomPx = (wickBottom / priceRange) * (height - 60);
    
    const x = (index / Math.max(candleData.length - 1, 1)) * 90 + 5;
    
    return (
      <g key={index}>
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
          height={bodyHeightPx}
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

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            {symbol}
            <Badge variant={isConnected ? "default" : "secondary"}>
              <Wifi className="h-3 w-3 mr-1" />
              {isConnected ? 'LIVE' : 'OFFLINE'}
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
            
            <Button variant="outline" size="sm" onClick={connectWebSocket}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {currentPrice && (
          <div className="flex items-center gap-4">
            <div className="text-2xl font-bold">
              ${currentPrice.toLocaleString()}
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
        <div ref={chartRef} style={{ height: `${height}px` }} className="relative bg-gray-900 rounded">
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

export default LiveCandlestickChart;
