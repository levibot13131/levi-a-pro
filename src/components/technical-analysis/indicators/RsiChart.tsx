
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

interface RsiChartProps {
  rsiData: { timestamp: number; value: number }[];
  rsiInterpretation: string;
}

const RsiChart = ({ rsiData, rsiInterpretation }: RsiChartProps) => {
  return (
    <div className="mb-6">
      <h3 className="font-semibold text-lg mb-2 text-right">RSI (מדד עוצמת תנועה יחסית)</h3>
      <div className="h-32">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={rsiData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="timestamp" 
              tickFormatter={(timestamp) => {
                const date = new Date(timestamp);
                return date.toLocaleDateString('he-IL', { day: 'numeric', month: 'numeric' });
              }}
            />
            <YAxis 
              domain={[0, 100]}
              tickCount={5}
              width={40}
            />
            <Tooltip 
              formatter={(value: number) => [`${value.toFixed(2)}`, 'RSI']}
              labelFormatter={(timestamp) => {
                const date = new Date(timestamp as number);
                return date.toLocaleDateString('he-IL', { 
                  day: 'numeric', 
                  month: 'numeric',
                  year: 'numeric'
                });
              }}
            />
            <ReferenceLine y={70} stroke="red" strokeDasharray="3 3" label="קנייתר יתר" />
            <ReferenceLine y={30} stroke="green" strokeDasharray="3 3" label="מכירת יתר" />
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke="#ff7300" 
              dot={false}
              name="RSI"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-md text-right">
        <p className="font-medium">פרשנות:</p>
        <p className="text-sm">{rsiInterpretation}</p>
      </div>
    </div>
  );
};

export default RsiChart;
