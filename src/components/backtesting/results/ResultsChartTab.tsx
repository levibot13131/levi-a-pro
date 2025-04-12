
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { BacktestResult } from '@/services/backtesting/types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend, Scatter, ScatterChart, ZAxis, Cell, PieChart, Pie } from 'recharts';
import { format } from 'date-fns';

interface ResultsChartTabProps {
  results: BacktestResult;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const ResultsChartTab: React.FC<ResultsChartTabProps> = ({ results }) => {
  // Format for equity chart
  const equityChartData = results.equity.map(point => ({
    date: typeof point.date === 'string' ? new Date(point.date).getTime() : point.date,
    value: point.value,
    drawdown: point.drawdown
  }));

  // Format for monthly returns chart
  const monthlyReturnsData = results.monthly ? [...results.monthly]
    .sort((a, b) => new Date(a.period).getTime() - new Date(b.period).getTime())
    .map(month => ({
      month: format(new Date(month.period), 'MMM yy'),
      return: parseFloat(month.return.toFixed(2)),
      trades: month.trades
    })) : [];

  // Format for win/loss pie chart
  const winLossData = [
    { name: 'זכיות', value: results.performance.winningTrades },
    { name: 'הפסדים', value: results.performance.losingTrades }
  ];

  // Format for trade scatter plot
  const tradeScatterData = results.trades.map(trade => ({
    date: trade.entryDate,
    profit: trade.profitPercentage,
    size: Math.abs(trade.profit) / 100 + 20,
    name: `${trade.assetName || trade.assetId} ${trade.direction === 'long' ? 'קנייה' : 'מכירה'}`
  }));

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
        {`${name} ${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="space-y-6">
      {/* Equity Chart */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-3 text-right">התפתחות ההון</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={equityChartData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  scale="time"
                  type="number"
                  domain={['auto', 'auto']}
                  tickFormatter={(unixTime) => format(new Date(unixTime), 'MM/dd')}
                />
                <YAxis />
                <Tooltip 
                  formatter={(value: any) => [`${value}`, 'הון']}
                  labelFormatter={(label) => format(new Date(label), 'dd/MM/yyyy')}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#8884d8" 
                  fill="#8884d8" 
                  fillOpacity={0.3}
                  name="הון"
                />
                <Area 
                  type="monotone" 
                  dataKey="drawdown" 
                  stroke="#ff5252" 
                  fill="#ff5252" 
                  fillOpacity={0.1}
                  name="דרואדאון"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Monthly Returns Chart */}
      {monthlyReturnsData.length > 0 && (
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-3 text-right">תשואות חודשיות</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={monthlyReturnsData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value: any) => [`${value}%`, 'תשואה']}
                  />
                  <Legend />
                  <Bar 
                    dataKey="return" 
                    name="תשואה חודשית" 
                    fill="#8884d8"
                    radius={[4, 4, 0, 0]}
                  >
                    {monthlyReturnsData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.return >= 0 ? '#00C49F' : '#FF8042'} 
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Win/Loss Pie Chart */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-3 text-right">עסקאות רווחיות/הפסד</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={winLossData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {winLossData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: any) => [`${value}`, '']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Trade Scatter Plot */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-3 text-right">פיזור עסקאות</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  type="number"
                  dataKey="date"
                  name="תאריך"
                  domain={['auto', 'auto']}
                  tickFormatter={(unixTime) => format(new Date(unixTime), 'MM/dd')}
                />
                <YAxis 
                  type="number" 
                  dataKey="profit" 
                  name="רווח באחוזים"
                  unit="%"
                />
                <ZAxis 
                  type="number" 
                  dataKey="size" 
                  range={[50, 500]} 
                />
                <Tooltip 
                  cursor={{ strokeDasharray: '3 3' }}
                  formatter={(value: any, name: string) => {
                    if (name === 'רווח באחוזים') return [`${value}%`, name];
                    return [value, name];
                  }}
                  labelFormatter={(label) => format(new Date(label), 'dd/MM/yyyy')}
                />
                <Scatter 
                  name="עסקאות" 
                  data={tradeScatterData} 
                  fill="#8884d8"
                >
                  {tradeScatterData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.profit >= 0 ? '#00C49F' : '#FF8042'} 
                    />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResultsChartTab;
