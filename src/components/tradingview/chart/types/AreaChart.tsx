
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Bar } from 'recharts';
import { formatDate, formatPrice } from '../utils/formatters';
import { ChartBaseProps } from '../ChartRenderer';

const CustomAreaChart: React.FC<ChartBaseProps> = ({ 
  data, 
  showVolume, 
  isPositiveChange,
  showPatterns,
  showSignals
}) => {
  return (
    <AreaChart data={data} margin={{ top: 10, right: 30, left: 10, bottom: 10 }}>
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
  );
};

export default CustomAreaChart;
