
import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  ReferenceLine, Label 
} from 'recharts';

interface VolumeChartProps {
  volumeData: any[];
}

const VolumeChart: React.FC<VolumeChartProps> = ({ volumeData }) => {
  if (!volumeData || volumeData.length === 0) {
    return <div className="text-center p-2">אין נתוני נפח זמינים</div>;
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={volumeData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="timestamp" 
          tickFormatter={(timestamp) => {
            const date = new Date(timestamp);
            return date.toLocaleDateString('he-IL', { day: 'numeric', month: 'numeric' });
          }}
        />
        <YAxis 
          tickFormatter={(value) => value >= 1000000 
            ? `${(value / 1000000).toFixed(1)}M` 
            : value >= 1000 
              ? `${(value / 1000).toFixed(1)}K` 
              : value
          }
          width={60}
        />
        <Tooltip 
          formatter={(value: number) => {
            if (value >= 1000000) {
              return [`${(value / 1000000).toFixed(2)}M`, 'נפח']
            } else if (value >= 1000) {
              return [`${(value / 1000).toFixed(2)}K`, 'נפח']
            }
            return [value, 'נפח']
          }}
          labelFormatter={(timestamp) => {
            const date = new Date(timestamp as number);
            return date.toLocaleDateString('he-IL', { day: 'numeric', month: 'numeric' });
          }}
        />
        <Bar 
          dataKey="volume" 
          fill="#8884d8" 
          name="נפח מסחר"
        />
        
        {volumeData.map((point, idx) => {
          if ('abnormal' in point && point.abnormal) {
            return (
              <ReferenceLine
                key={`vol-${idx}`}
                x={point.timestamp}
                strokeWidth={2}
                stroke="rgba(255, 165, 0, 0.7)"
              >
                <Label 
                  value="נפח חריג" 
                  position="top" 
                  fill="rgba(255, 165, 0, 1)"
                  fontSize={10}
                />
              </ReferenceLine>
            );
          }
          return null;
        })}
      </BarChart>
    </ResponsiveContainer>
  );
};

export default VolumeChart;
