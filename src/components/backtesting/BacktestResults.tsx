
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ResultsPerformanceTab from './results/ResultsPerformanceTab';
import ResultsTradesTab from './results/ResultsTradesTab';
import ResultsStatisticsTab from './results/ResultsStatisticsTab';
import ResultsChartTab from './results/ResultsChartTab';
import { BacktestingResult, Trade } from '@/services/backtestingService';
import { Asset } from '@/types/asset';
import { format } from 'date-fns';

interface BacktestResultsProps {
  results: BacktestingResult;
  asset?: Asset;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const BacktestResults: React.FC<BacktestResultsProps> = ({ results, asset }) => {
  const [tab, setTab] = useState('overview');
  const [tradesExpanded, setTradesExpanded] = useState(false);

  // Format for equityChart
  const equityChartData = results.equity.map(point => ({
    date: point.date,
    value: point.value,
    drawdown: point.drawdown
  }));

  // Format for monthly returns chart
  const monthlyReturnsData = [...results.monthly].sort((a, b) => 
    new Date(a.period).getTime() - new Date(b.period).getTime()
  ).map(month => ({
    month: format(new Date(month.period), 'MMM yy'),
    return: parseFloat(month.return.toFixed(2)),
    trades: month.trades
  }));

  // Format for win/loss pie chart
  const winLossData = [
    { name: 'זכיות', value: results.performance.winningTrades },
    { name: 'הפסדים', value: results.performance.losingTrades }
  ];

  // Format for asset performance chart
  const assetPerformanceData = results.assetPerformance.map(asset => ({
    asset: asset.assetName,
    return: parseFloat(asset.return.toFixed(2)),
    winRate: parseFloat(asset.winRate.toFixed(2)),
    trades: asset.trades
  }));

  // Format for trade scatter plot
  const tradeScatterData = results.trades.map(trade => ({
    date: new Date(trade.entryDate).getTime(),
    profit: trade.profitPercentage || 0,
    size: Math.abs(trade.profit || 0) / 100 + 20,
    name: `${trade.assetName} ${trade.direction === 'long' ? 'קנייה' : 'מכירה'}`,
    status: trade.status,
    id: trade.id
  }));

  return (
    <div className="space-y-6">
      <Tabs defaultValue="overview" value={tab} onValueChange={setTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">סקירה כללית</TabsTrigger>
          <TabsTrigger value="charts">גרפים</TabsTrigger>
          <TabsTrigger value="trades">עסקאות</TabsTrigger>
          <TabsTrigger value="assets">ביצועי נכסים</TabsTrigger>
        </TabsList>
        
        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <ResultsPerformanceTab results={results} />
        </TabsContent>
        
        {/* Charts Tab */}
        <TabsContent value="charts" className="space-y-6">
          <ResultsChartTab results={results} />
        </TabsContent>
        
        {/* Trades Tab */}
        <TabsContent value="trades" className="space-y-6">
          <ResultsTradesTab results={results} />
        </TabsContent>
        
        {/* Assets Tab */}
        <TabsContent value="assets" className="space-y-6">
          <ResultsStatisticsTab results={results} asset={asset} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BacktestResults;
