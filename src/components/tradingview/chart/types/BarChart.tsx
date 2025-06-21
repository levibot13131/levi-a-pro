
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
      
      {showVolume ? (
        // When showing volume, use dual Y-axes with proper yAxisId matching
        <>
          <YAxis 
            yAxisId="price"
            domain={['auto', 'auto']} 
            tickFormatter={formatPrice}
            tick={{ fontSize: 12 }}
            width={80}
            stroke="#888888"
            orientation="left"
          />
          <YAxis 
            yAxisId="volume"
            domain={['auto', 'auto']} 
            tick={{ fontSize: 12 }}
            width={80}
            stroke="#888888"
            orientation="right"
          />
          <Bar 
            yAxisId="price"
            dataKey="price" 
            fill={isPositiveChange ? "#10b981" : "#ef4444"} 
            radius={[4, 4, 0, 0]}
          />
          <Bar 
            yAxisId="volume"
            dataKey="volume" 
            fill="#8884d8" 
            opacity={0.5} 
          />
        </>
      ) : (
        // When not showing volume, use single Y-axis without yAxisId
        <>
          <YAxis 
            domain={['auto', 'auto']} 
            tickFormatter={formatPrice}
            tick={{ fontSize: 12 }}
            width={80}
            stroke="#888888"
            orientation="right"
          />
          <Bar 
            dataKey="price" 
            fill={isPositiveChange ? "#10b981" : "#ef4444"} 
            radius={[4, 4, 0, 0]}
          />
        </>
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
    </BarChart>
  );
};

export default CustomBarChart;
