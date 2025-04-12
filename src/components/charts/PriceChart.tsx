
import React from 'react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip,
  Legend 
} from 'recharts';
import { formatCurrency } from '@/lib/utils';

export interface PriceChartProps {
  data: any[];
  height?: number;
}

const PriceChart: React.FC<PriceChartProps> = ({
  data,
  height = 400
}) => {
  const formatXAxis = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('he-IL', {
      month: 'short',
      day: 'numeric'
    });
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border rounded-md p-2 shadow-md">
          <p className="font-semibold">{new Date(label).toLocaleDateString('he-IL', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}</p>
          <p className="text-sm">
            <span className="font-medium">מחיר: </span>
            <span className="text-primary">${payload[0].value.toFixed(2)}</span>
          </p>
          {payload[1] && (
            <p className="text-sm">
              <span className="font-medium">נפח: </span>
              <span className="text-secondary">${(payload[1].value / 1000000).toFixed(2)}M</span>
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full" style={{ height: `${height}px` }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8884d8" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis 
            dataKey="timestamp" 
            tickFormatter={formatXAxis}
            tick={{ fontSize: 12 }}
            tickLine={false}
            axisLine={{ stroke: '#E5E7EB', strokeWidth: 1 }}
            minTickGap={30}
          />
          <YAxis 
            tickFormatter={(value) => `$${value.toLocaleString()}`}
            tick={{ fontSize: 12 }}
            tickLine={false}
            axisLine={{ stroke: '#E5E7EB', strokeWidth: 1 }}
            domain={['dataMin', 'dataMax']}
            width={80}
          />
          <CartesianGrid 
            strokeDasharray="3 3" 
            vertical={false} 
            stroke="#E5E7EB" 
          />
          <Tooltip content={<CustomTooltip />} />
          <Area 
            type="monotone" 
            dataKey="price" 
            stroke="#0ea5e9" 
            fillOpacity={1} 
            fill="url(#colorPrice)" 
            name="מחיר"
            strokeWidth={2}
          />
          {data.some(d => d.volume) && (
            <Area 
              type="monotone" 
              dataKey="volume" 
              stroke="#8884d8" 
              fillOpacity={1} 
              fill="url(#colorVolume)" 
              name="נפח מסחר"
              yAxisId={1}
              hide={true}
            />
          )}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PriceChart;
