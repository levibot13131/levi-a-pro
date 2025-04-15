
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface ChartData {
  date: string;
  positive: number;
  negative: number;
  neutral: number;
  volume: number;
}

interface TwitterSentimentChartProps {
  data: ChartData[];
}

const TwitterSentimentChart: React.FC<TwitterSentimentChartProps> = ({ data }) => {
  // מותאם לגרף RTL
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border p-2 rounded-md shadow-md text-right">
          <p className="font-medium">{`תאריך: ${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={`item-${index}`} style={{ color: entry.color }}>
              {`${entry.name}: ${entry.value}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };
  
  return (
    <div className="h-[350px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#555" opacity={0.2} />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            align="right" 
            verticalAlign="top"
            wrapperStyle={{ paddingBottom: "10px" }}
          />
          <Line 
            type="monotone" 
            dataKey="positive" 
            name="חיובי" 
            stroke="#22c55e" 
            strokeWidth={2}
            activeDot={{ r: 6 }} 
          />
          <Line 
            type="monotone" 
            dataKey="negative" 
            name="שלילי" 
            stroke="#ef4444" 
            strokeWidth={2}
          />
          <Line 
            type="monotone" 
            dataKey="neutral" 
            name="ניטרלי" 
            stroke="#64748b" 
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TwitterSentimentChart;
