
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { BacktestingResult } from '@/services/backtestingService';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, Legend } from 'recharts';
import { format } from 'date-fns';

interface ResultsChartTabProps {
  results: BacktestingResult;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const ResultsChartTab: React.FC<ResultsChartTabProps> = ({ results }) => {
  // Prepare data for equity chart
  const equityChartData = results.equity.map(point => ({
    date: typeof point.date === 'string' ? new Date(point.date) : new Date(point.date),
    value: point.value,
    drawdown: point.drawdown
  }));

  // Prepare data for monthly returns chart
  const monthlyReturnsData = [...(results.monthly || [])].sort((a, b) => 
    new Date(a.period).getTime() - new Date(b.period).getTime()
  ).map(month => ({
    month: format(new Date(month.period), 'MMM yy'),
    return: parseFloat(month.return.toFixed(2)),
    trades: month.trades
  }));

  // Prepare data for win/loss pie chart
  const winLossData = [
    { name: 'זכיות', value: results.performance.winningTrades },
    { name: 'הפסדים', value: results.performance.losingTrades }
  ];

  return (
    <div className="space-y-6">
      <Card className="mb-6">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-3 text-right">גרף הון</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={equityChartData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(date) => format(new Date(date), 'dd/MM')} 
                />
                <YAxis />
                <Tooltip 
                  formatter={(value: number) => [`$${value.toFixed(2)}`, 'ערך']}
                  labelFormatter={(date) => format(new Date(date), 'dd/MM/yyyy')}
                />
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-3 text-right">תשואות חודשיות</h3>
            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={monthlyReturnsData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip
                    formatter={(value: number) => [`${value.toFixed(2)}%`, 'תשואה']}
                  />
                  <Bar 
                    dataKey="return" 
                    fill="#8884d8" 
                    name="תשואה חודשית"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-3 text-right">עסקאות מוצלחות/כושלות</h3>
            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={winLossData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }: { name: string; percent: number }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {winLossData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => [value, 'מספר עסקאות']}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ResultsChartTab;
