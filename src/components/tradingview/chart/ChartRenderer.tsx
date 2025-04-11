
import React from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { TradingViewChartData } from '../../../services/tradingView/tradingViewIntegrationService';

interface ChartRendererProps {
  chartData: TradingViewChartData;
  chartType: 'candle' | 'line' | 'bar';
  showVolume: boolean;
  isPositiveChange: boolean;
}

const ChartRenderer: React.FC<ChartRendererProps> = ({ 
  chartData, 
  chartType,
  showVolume,
  isPositiveChange 
}) => {
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('he-IL', {
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const formatPrice = (price: number) => {
    if (price >= 1000) {
      return `$${price.toLocaleString()}`;
    }
    return `$${price.toFixed(2)}`;
  };

  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        {chartType === 'line' ? (
          <AreaChart data={chartData.data} margin={{ top: 10, right: 30, left: 10, bottom: 10 }}>
            <defs>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={isPositiveChange ? "#10b981" : "#ef4444"} stopOpacity={0.8}/>
                <stop offset="95%" stopColor={isPositiveChange ? "#10b981" : "#ef4444"} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#888888" opacity={0.2} />
            <XAxis 
              dataKey="timestamp" 
              tickFormatter={formatDate} 
              tick={{ fontSize: 12 }}
              stroke="#888888"
              allowDataOverflow={true}
              minTickGap={30}
            />
            <YAxis 
              domain={['auto', 'auto']} 
              tickFormatter={formatPrice}
              tick={{ fontSize: 12 }}
              width={80}
              stroke="#888888"
              orientation="right"
              yAxisId="price"
            />
            {showVolume && (
              <YAxis 
                dataKey="volume" 
                orientation="left"
                tick={{ fontSize: 12 }}
                width={80}
                stroke="#888888"
                yAxisId="volume"
              />
            )}
            <Tooltip 
              formatter={(value: number, name: string) => {
                if (name === 'price') return [formatPrice(value), 'מחיר'];
                if (name === 'volume') return [value.toLocaleString(), 'נפח'];
                return [value, name];
              }}
              labelFormatter={formatDate}
              contentStyle={{ textAlign: 'right', direction: 'rtl' }}
            />
            <Area 
              type="monotone" 
              dataKey="price" 
              stroke={isPositiveChange ? "#10b981" : "#ef4444"} 
              fillOpacity={1}
              fill="url(#colorPrice)"
              strokeWidth={2}
              yAxisId="price"
            />
            {showVolume && (
              <Bar dataKey="volume" fill="#8884d8" opacity={0.5} yAxisId="volume" />
            )}
          </AreaChart>
        ) : chartType === 'bar' ? (
          <BarChart data={chartData.data} margin={{ top: 10, right: 30, left: 10, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#888888" opacity={0.2} />
            <XAxis 
              dataKey="timestamp" 
              tickFormatter={formatDate} 
              tick={{ fontSize: 12 }}
              stroke="#888888"
              minTickGap={30}
            />
            <YAxis 
              domain={['auto', 'auto']} 
              tickFormatter={formatPrice}
              tick={{ fontSize: 12 }}
              width={80}
              stroke="#888888"
              orientation="right"
              yAxisId="price"
            />
            {showVolume && (
              <YAxis 
                dataKey="volume" 
                orientation="left"
                tick={{ fontSize: 12 }}
                width={80}
                stroke="#888888"
                yAxisId="volume"
              />
            )}
            <Tooltip 
              formatter={(value: number, name: string) => {
                if (name === 'price') return [formatPrice(value), 'מחיר'];
                if (name === 'volume') return [value.toLocaleString(), 'נפח'];
                return [value, name];
              }}
              labelFormatter={formatDate}
              contentStyle={{ textAlign: 'right', direction: 'rtl' }}
            />
            <Bar 
              dataKey="price" 
              fill={isPositiveChange ? "#10b981" : "#ef4444"} 
              radius={[4, 4, 0, 0]}
              yAxisId="price"
            />
            {showVolume && (
              <Bar dataKey="volume" fill="#8884d8" opacity={0.5} yAxisId="volume" />
            )}
          </BarChart>
        ) : (
          <LineChart data={chartData.data} margin={{ top: 10, right: 30, left: 10, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#888888" opacity={0.2} />
            <XAxis 
              dataKey="timestamp" 
              tickFormatter={formatDate} 
              tick={{ fontSize: 12 }}
              stroke="#888888"
              minTickGap={30}
            />
            <YAxis 
              domain={['auto', 'auto']} 
              tickFormatter={formatPrice}
              tick={{ fontSize: 12 }}
              width={80}
              stroke="#888888" 
              orientation="right"
              yAxisId="price"
            />
            {showVolume && (
              <YAxis 
                dataKey="volume" 
                orientation="left"
                tick={{ fontSize: 12 }}
                width={80}
                stroke="#888888"
                yAxisId="volume"
              />
            )}
            <Tooltip 
              formatter={(value: number, name: string) => {
                if (name === 'price') return [formatPrice(value), 'מחיר'];
                if (name === 'volume') return [value.toLocaleString(), 'נפח'];
                return [value, name];
              }}
              labelFormatter={formatDate}
              contentStyle={{ textAlign: 'right', direction: 'rtl' }}
            />
            <Line 
              type="monotone" 
              dataKey="price" 
              stroke={isPositiveChange ? "#10b981" : "#ef4444"} 
              dot={false}
              strokeWidth={2}
              yAxisId="price"
            />
            {showVolume && (
              <Bar dataKey="volume" fill="#8884d8" opacity={0.5} yAxisId="volume" />
            )}
          </LineChart>
        )}
      </ResponsiveContainer>
    </div>
  );
};

export default ChartRenderer;
