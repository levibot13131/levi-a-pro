
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { PricePoint } from '@/types/asset';

interface PriceChartProps {
  data: PricePoint[];
  isLoading?: boolean;
  title?: string;
  height?: number;
  showCardWrapper?: boolean;
  color?: string;
}

const PriceChart: React.FC<PriceChartProps> = ({
  data,
  isLoading = false,
  title = 'מחיר',
  height = 300,
  showCardWrapper = true,
  color = '#22c55e'
}) => {
  // Format data for the chart
  const chartData = data.map((point) => ({
    time: new Date(point.timestamp).toLocaleDateString('he-IL'),
    price: point.price,
    volume: point.volume || 0
  }));

  const formatPrice = (price: number) => {
    return price >= 1 
      ? price.toLocaleString(undefined, { maximumFractionDigits: 2 })
      : price.toLocaleString(undefined, { maximumFractionDigits: 8 });
  };

  const renderChart = () => (
    <div style={{ width: '100%', height }}>
      {isLoading ? (
        <div className="flex flex-col space-y-3 w-full h-full">
          <Skeleton className="h-[70%] w-full" />
          <Skeleton className="h-[20%] w-full" />
        </div>
      ) : data.length > 0 ? (
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
          >
            <defs>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.8} />
                <stop offset="95%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis 
              dataKey="time" 
              axisLine={false}
              tickLine={false}
              tickMargin={10}
              tick={{ fontSize: 12, fill: '#888888' }}
            />
            <YAxis 
              type="number" 
              domain={['auto', 'auto']} 
              axisLine={false}
              tickLine={false}
              tickMargin={10}
              tickFormatter={formatPrice}
              orientation="right"
              tick={{ fontSize: 12, fill: '#888888' }}
            />
            <Tooltip 
              formatter={(value: number) => [`$${formatPrice(value)}`, 'מחיר']}
              labelFormatter={(label) => `תאריך: ${label}`}
            />
            <Area 
              type="monotone" 
              dataKey="price" 
              stroke={color}
              fillOpacity={1}
              fill="url(#colorPrice)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex items-center justify-center h-full text-muted-foreground">
          אין נתונים להצגה
        </div>
      )}
    </div>
  );

  if (!showCardWrapper) {
    return renderChart();
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-right">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {renderChart()}
      </CardContent>
    </Card>
  );
};

export default PriceChart;
