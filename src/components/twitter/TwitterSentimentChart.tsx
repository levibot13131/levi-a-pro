
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface TwitterSentimentChartProps {
  data: {
    date: string;
    positive: number;
    negative: number;
    neutral: number;
    volume: number;
  }[];
}

const TwitterSentimentChart: React.FC<TwitterSentimentChartProps> = ({ data }) => {
  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#555" opacity={0.2} />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="positive" 
            name="חיובי" 
            stroke="#22c55e" 
            activeDot={{ r: 8 }} 
          />
          <Line 
            type="monotone" 
            dataKey="negative" 
            name="שלילי" 
            stroke="#ef4444"
          />
          <Line 
            type="monotone" 
            dataKey="neutral" 
            name="ניטרלי" 
            stroke="#9ca3af"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TwitterSentimentChart;
