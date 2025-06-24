
import React, { useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface TradingViewWidgetProps {
  symbol: string;
  timeframe?: string;
  height?: number;
  theme?: 'light' | 'dark';
  showToolbar?: boolean;
}

declare global {
  interface Window {
    TradingView: any;
  }
}

const TradingViewWidget: React.FC<TradingViewWidgetProps> = ({
  symbol,
  timeframe = '1D',
  height = 400,
  theme = 'light',
  showToolbar = true
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetRef = useRef<any>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Clean up previous widget
    if (widgetRef.current) {
      widgetRef.current.remove();
    }
    containerRef.current.innerHTML = '';

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/tv.js';
    script.async = true;
    
    script.onload = () => {
      if (window.TradingView && containerRef.current) {
        try {
          widgetRef.current = new window.TradingView.widget({
            autosize: false,
            width: '100%',
            height: height,
            symbol: `BINANCE:${symbol}`,
            interval: timeframe,
            timezone: 'Asia/Jerusalem',
            theme: theme,
            style: '1',
            locale: 'he_IL',
            toolbar_bg: '#f1f3f6',
            enable_publishing: false,
            hide_side_toolbar: !showToolbar,
            allow_symbol_change: true,
            container_id: containerRef.current.id,
            studies: [
              'RSI@tv-basicstudies',
              'MACD@tv-basicstudies',
              'Volume@tv-basicstudies'
            ],
            show_popup_button: true,
            popup_width: '1000',
            popup_height: '650',
            overrides: {
              'paneProperties.background': '#ffffff',
              'paneProperties.vertGridProperties.color': '#e1e1e1',
              'paneProperties.horzGridProperties.color': '#e1e1e1',
              'symbolWatermarkProperties.transparency': 90,
              'scalesProperties.textColor': '#333333'
            }
          });
        } catch (error) {
          console.error('TradingView widget creation failed:', error);
        }
      }
    };

    // Create unique container ID
    const uniqueId = `tradingview_${symbol}_${Date.now()}`;
    containerRef.current.id = uniqueId;
    
    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
      if (widgetRef.current) {
        try {
          widgetRef.current.remove();
        } catch (error) {
          console.error('Error removing TradingView widget:', error);
        }
      }
    };
  }, [symbol, timeframe, height, theme, showToolbar]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-right flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            {timeframe} • זמן אמת
          </span>
          <span>{symbol} - גרף מחירים</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div 
          ref={containerRef}
          style={{ height: `${height}px`, width: '100%' }}
          className="rounded-lg overflow-hidden border"
        />
      </CardContent>
    </Card>
  );
};

export default TradingViewWidget;
