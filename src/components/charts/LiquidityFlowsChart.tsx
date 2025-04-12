
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

// Mock data for liquidity flows
const mockData = [
  { date: '1 באפר', inflow: 4000, outflow: 2400 },
  { date: '2 באפר', inflow: 3000, outflow: 1398 },
  { date: '3 באפר', inflow: 2000, outflow: 9800 },
  { date: '4 באפר', inflow: 2780, outflow: 3908 },
  { date: '5 באפר', inflow: 1890, outflow: 4800 },
  { date: '6 באפר', inflow: 2390, outflow: 3800 },
  { date: '7 באפר', inflow: 3490, outflow: 4300 },
  { date: '8 באפר', inflow: 5000, outflow: 2300 },
  { date: '9 באפר', inflow: 4200, outflow: 2900 },
  { date: '10 באפר', inflow: 3800, outflow: 2500 },
  { date: '11 באפר', inflow: 4100, outflow: 3900 },
  { date: '12 באפר', inflow: 5200, outflow: 3100 },
];

const LiquidityFlowsChart = () => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        data={mockData}
        margin={{
          top: 10,
          right: 30,
          left: 0,
          bottom: 0,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip 
          formatter={(value) => `$${value}M`}
          labelFormatter={(label) => `תאריך: ${label}`}
        />
        <Legend />
        <Area 
          type="monotone" 
          dataKey="inflow" 
          name="כניסת נזילות" 
          stackId="1" 
          stroke="#4ade80" 
          fill="#4ade80" 
        />
        <Area 
          type="monotone" 
          dataKey="outflow" 
          name="יציאת נזילות" 
          stackId="2" 
          stroke="#f87171" 
          fill="#f87171" 
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default LiquidityFlowsChart;
