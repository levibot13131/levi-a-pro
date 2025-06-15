
import React, { useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface LiveTradingViewChartProps {
  symbol: string;
  height?: number;
  theme?: 'light' | 'dark';
}

const LiveTradingViewChart: React.FC<LiveTradingViewChartProps> = ({
  symbol,
  height = 400,
  theme = 'light'
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Clear previous widget if exists
    containerRef.current.innerHTML = '';

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/tv.js';
    script.async = true;
    script.onload = () => {
      if (window.TradingView) {
        new window.TradingView.widget({
          autosize: true,
          symbol: `BINANCE:${symbol}`,
          interval: '1',
          timezone: 'Etc/UTC',
          theme: theme,
          style: '1',
          locale: 'en',
          toolbar_bg: '#f1f3f6',
          enable_publishing: false,
          hide_side_toolbar: false,
          allow_symbol_change: true,
          container_id: `tradingview_${symbol}`,
          height: height,
          width: '100%',
          studies: [
            'RSI@tv-basicstudies',
            'MACD@tv-basicstudies'
          ],
          show_popup_button: true,
          popup_width: '1000',
          popup_height: '650'
        });
      }
    };

    // Create a unique container ID for this symbol
    const uniqueId = `tradingview_${symbol}`;
    containerRef.current.id = uniqueId;
    
    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, [symbol, height, theme]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-right">{symbol} - גרף מחירים חי</CardTitle>
      </CardHeader>
      <CardContent>
        <div 
          ref={containerRef}
          style={{ height: `${height}px`, width: '100%' }}
          className="rounded-lg overflow-hidden"
        />
      </CardContent>
    </Card>
  );
};

// Declare TradingView on window for TypeScript
declare global {
  interface Window {
    TradingView: any;
  }
}

export default LiveTradingViewChart;
