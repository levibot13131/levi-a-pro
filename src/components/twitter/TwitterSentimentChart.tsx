
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';

interface SentimentData {
  date: string;
  positive: number;
  neutral: number;
  negative: number;
  mentions: number;
  volume: number;
  sentimentScore: number;
}

interface TwitterSentimentChartProps {
  data?: SentimentData[];
}

const TwitterSentimentChart: React.FC<TwitterSentimentChartProps> = ({ data = [] }) => {
  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-right">ניתוח סנטימנט בטוויטר</CardTitle>
          <CardDescription className="text-right">
            ניתוח תחושת השוק לגבי מטבעות קריפטו מובילים
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center">נתוני סנטימנט יוצגו כאן בקרוב.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-right">ניתוח סנטימנט בטוויטר</CardTitle>
        <CardDescription className="text-right">
          ניתוח תחושת השוק לגבי מטבעות קריפטו מובילים
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="positive" stackId="1" stroke="#10b981" fill="#10b981" name="חיובי" />
              <Area type="monotone" dataKey="neutral" stackId="1" stroke="#f59e0b" fill="#f59e0b" name="ניטרלי" />
              <Area type="monotone" dataKey="negative" stackId="1" stroke="#ef4444" fill="#ef4444" name="שלילי" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        
        <div className="h-[200px] mt-6">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="mentions" stroke="#3b82f6" name="אזכורים" />
              <Line yAxisId="right" type="monotone" dataKey="sentimentScore" stroke="#8b5cf6" name="ציון סנטימנט" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default TwitterSentimentChart;
