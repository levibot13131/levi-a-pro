
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Target, BarChart3, Calendar, Trophy } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

interface PerformanceMetrics {
  totalTrades: number;
  winRate: number;
  avgRR: number;
  profitFactor: number;
  totalProfit: number;
  totalLoss: number;
  bestTrade: number;
  worstTrade: number;
  avgWin: number;
  avgLoss: number;
  maxDrawdown: number;
  currentStreak: number;
}

interface StrategyBreakdown {
  strategy: string;
  trades: number;
  winRate: number;
  profit: number;
  avgRR: number;
}

export const PerformanceDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    totalTrades: 47,
    winRate: 74.5,
    avgRR: 2.8,
    profitFactor: 3.2,
    totalProfit: 8420,
    totalLoss: -2630,
    bestTrade: 950,
    worstTrade: -320,
    avgWin: 320,
    avgLoss: -140,
    maxDrawdown: -580,
    currentStreak: 5
  });

  const [equityCurve] = useState([
    { date: '2024-01-01', equity: 10000, drawdown: 0 },
    { date: '2024-01-15', equity: 10850, drawdown: 0 },
    { date: '2024-02-01', equity: 11200, drawdown: 0 },
    { date: '2024-02-15', equity: 10950, drawdown: -250 },
    { date: '2024-03-01', equity: 12100, drawdown: 0 },
    { date: '2024-03-15', equity: 13200, drawdown: 0 },
    { date: '2024-04-01', equity: 12800, drawdown: -400 },
    { date: '2024-04-15', equity: 14200, drawdown: 0 },
    { date: '2024-05-01', equity: 15100, drawdown: 0 },
    { date: '2024-05-15', equity: 16420, drawdown: 0 }
  ]);

  const [strategyBreakdown] = useState<StrategyBreakdown[]>([
    { strategy: 'Almog Personal Method', trades: 23, winRate: 82.6, profit: 5200, avgRR: 3.1 },
    { strategy: 'Wyckoff Analysis', trades: 15, winRate: 73.3, profit: 2100, avgRR: 2.8 },
    { strategy: 'SMC Trading', trades: 9, winRate: 55.6, profit: 1120, avgRR: 2.2 }
  ]);

  const [assetPerformance] = useState([
    { asset: 'BTCUSDT', trades: 18, winRate: 77.8, profit: 3200 },
    { asset: 'ETHUSDT', trades: 12, winRate: 75.0, profit: 2100 },
    { asset: 'SOLUSDT', trades: 8, winRate: 62.5, profit: 1850 },
    { asset: 'BNBUSDT', trades: 9, winRate: 77.8, profit: 1270 }
  ]);

  const confidenceTiers = [
    { tier: 'Elite (90%+)', count: 12, winRate: 91.7, color: '#10b981' },
    { tier: 'High (80-89%)', count: 18, winRate: 77.8, color: '#3b82f6' },
    { tier: 'Good (70-79%)', count: 13, winRate: 69.2, color: '#f59e0b' },
    { tier: 'Medium (<70%)', count: 4, winRate: 50.0, color: '#ef4444' }
  ];

  const getMetricColor = (value: number, threshold: number, reverse = false) => {
    const isGood = reverse ? value < threshold : value > threshold;
    return isGood ? 'text-green-600' : 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Key Performance Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{metrics.totalTrades}</div>
            <div className="text-sm text-muted-foreground">Total Trades</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className={`text-2xl font-bold ${getMetricColor(metrics.winRate, 60)}`}>
              {metrics.winRate}%
            </div>
            <div className="text-sm text-muted-foreground">Win Rate</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className={`text-2xl font-bold ${getMetricColor(metrics.avgRR, 2)}`}>
              {metrics.avgRR}:1
            </div>
            <div className="text-sm text-muted-foreground">Avg R/R</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className={`text-2xl font-bold ${getMetricColor(metrics.profitFactor, 1.5)}`}>
              {metrics.profitFactor}
            </div>
            <div className="text-sm text-muted-foreground">Profit Factor</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              ${metrics.totalProfit.toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground">Total Profit</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className={`text-2xl font-bold ${getMetricColor(Math.abs(metrics.maxDrawdown), 1000, true)}`}>
              ${Math.abs(metrics.maxDrawdown)}
            </div>
            <div className="text-sm text-muted-foreground">Max Drawdown</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="strategies">Strategies</TabsTrigger>
          <TabsTrigger value="assets">Assets</TabsTrigger>
          <TabsTrigger value="confidence">Confidence</TabsTrigger>
          <TabsTrigger value="equity">Equity Curve</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-yellow-500" />
                  Best & Worst Trades
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Best Trade:</span>
                    <span className="font-bold text-green-600">+${metrics.bestTrade}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Worst Trade:</span>
                    <span className="font-bold text-red-600">${metrics.worstTrade}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Average Win:</span>
                    <span className="font-bold text-green-600">+${metrics.avgWin}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Average Loss:</span>
                    <span className="font-bold text-red-600">${metrics.avgLoss}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Current Streak:</span>
                    <Badge variant={metrics.currentStreak > 0 ? "default" : "destructive"}>
                      {metrics.currentStreak > 0 ? `+${metrics.currentStreak} Wins` : `${Math.abs(metrics.currentStreak)} Losses`}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Monthly Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={[
                    { month: 'Jan', profit: 850 },
                    { month: 'Feb', profit: 1200 },
                    { month: 'Mar', profit: 950 },
                    { month: 'Apr', profit: 1800 },
                    { month: 'May', profit: 1620 }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="profit" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="strategies">
          <Card>
            <CardHeader>
              <CardTitle>Strategy Performance Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {strategyBreakdown.map((strategy, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-semibold">{strategy.strategy}</h4>
                      <Badge variant={strategy.winRate > 70 ? "default" : "secondary"}>
                        {strategy.winRate}% Win Rate
                      </Badge>
                    </div>
                    <div className="grid grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Trades:</span>
                        <div className="font-semibold">{strategy.trades}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Profit:</span>
                        <div className="font-semibold text-green-600">${strategy.profit}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Avg R/R:</span>
                        <div className="font-semibold">{strategy.avgRR}:1</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Performance:</span>
                        <div className={`font-semibold ${strategy.winRate > 70 ? 'text-green-600' : 'text-orange-600'}`}>
                          {strategy.winRate > 80 ? 'Excellent' : strategy.winRate > 70 ? 'Good' : 'Average'}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="assets">
          <Card>
            <CardHeader>
              <CardTitle>Asset Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {assetPerformance.map((asset, index) => (
                  <div key={index} className="flex justify-between items-center p-3 border rounded">
                    <div className="flex items-center gap-3">
                      <span className="font-semibold">{asset.asset}</span>
                      <Badge variant="outline">{asset.trades} trades</Badge>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`font-semibold ${asset.winRate > 70 ? 'text-green-600' : 'text-orange-600'}`}>
                        {asset.winRate}% WR
                      </span>
                      <span className="font-bold text-green-600">+${asset.profit}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="confidence">
          <Card>
            <CardHeader>
              <CardTitle>Performance by Confidence Tier</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {confidenceTiers.map((tier, index) => (
                  <div key={index} className="flex justify-between items-center p-3 border rounded">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 rounded" style={{ backgroundColor: tier.color }}></div>
                      <span className="font-semibold">{tier.tier}</span>
                      <Badge variant="outline">{tier.count} signals</Badge>
                    </div>
                    <div className="font-bold" style={{ color: tier.color }}>
                      {tier.winRate}% Win Rate
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="equity">
          <Card>
            <CardHeader>
              <CardTitle>Equity Curve & Drawdown</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={equityCurve}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="equity" stroke="#3b82f6" strokeWidth={2} name="Equity" />
                  <Line type="monotone" dataKey="drawdown" stroke="#ef4444" strokeWidth={2} name="Drawdown" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
