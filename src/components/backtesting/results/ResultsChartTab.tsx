
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { BacktestingResult } from '@/services/backtestingService';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, AreaChart, Area, BarChart, Bar,
  PieChart, Pie, Cell
} from 'recharts';

interface ResultsChartTabProps {
  results: BacktestingResult;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const ResultsChartTab: React.FC<ResultsChartTabProps> = ({ results }) => {
  // Format data for the equity chart
  const equityData = results.equity.map(point => ({
    date: new Date(point.date).toLocaleDateString('he-IL'),
    value: point.value,
    drawdown: point.drawdown
  }));

  // Format data for the monthly returns chart
  const monthlyData = results.monthly.map(month => ({
    month: new Date(month.period).toLocaleDateString('he-IL', { month: 'short', year: '2-digit' }),
    return: month.return
  }));

  // Format data for the win/loss pie chart
  const winLossData = [
    { name: 'זכיות', value: results.performance.winningTrades },
    { name: 'הפסדים', value: results.performance.losingTrades }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="col-span-1 md:col-span-2">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-3 text-right">התפתחות ההון</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={equityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#8884d8" 
                  fill="#8884d8" 
                  fillOpacity={0.3}
                  name="הון" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-3 text-right">תשואות חודשיות</h3>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="return" fill="#82ca9d" name="תשואה %" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-3 text-right">עסקאות מוצלחות/כושלות</h3>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={winLossData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {winLossData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? '#00C49F' : '#FF8042'} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResultsChartTab;
