
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Bar } from 'recharts';
import { formatDate, formatPrice } from '../utils/formatters';
import { ChartBaseProps } from '../ChartRenderer';

const CustomLineChart: React.FC<ChartBaseProps> = ({ 
  data, 
  showVolume, 
  isPositiveChange 
}) => {
  return (
    <LineChart data={data} margin={{ top: 10, right: 30, left: 10, bottom: 10 }}>
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
  );
};

export default CustomLineChart;

