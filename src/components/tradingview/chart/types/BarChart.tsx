
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { formatDate, formatPrice } from '../utils/formatters';
import { ChartBaseProps } from '../ChartRenderer';

const CustomBarChart: React.FC<ChartBaseProps> = ({ 
  data, 
  showVolume, 
  isPositiveChange,
  showPatterns,
  showSignals
}) => {
  // Log chart rendering decisions for transparency
  console.log(`📊 BarChart rendering: ${data.length} data points, volume: ${showVolume ? 'ON' : 'OFF'}`);
  
  return (
    <BarChart data={data} margin={{ top: 10, right: 30, left: 10, bottom: 10 }}>
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
      />
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
      />
      {showVolume && (
        <Bar dataKey="volume" fill="#8884d8" opacity={0.5} />
      )}
    </BarChart>
  );
};

export default CustomBarChart;
