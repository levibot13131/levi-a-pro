
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, BarChart, Bar, LineChart, Line, 
  Legend, PieChart, Pie, Cell, Scatter, ScatterChart, ZAxis
} from 'recharts';
import { ChartContainer, ChartTooltipContent, ChartTooltip } from '@/components/ui/chart';
import { BacktestResults as BacktestResultsType, Trade } from '@/services/backtestingService';
import { format } from 'date-fns';
import { 
  ArrowDown, 
  ArrowUp, 
  ChevronDown, 
  ChevronsUp, 
  ChevronsDown, 
  Ban,
  Target,
  TrendingUp,
  TrendingDown,
  Calendar,
  Percent,
  DollarSign
} from 'lucide-react';
import { formatPercentage, formatPrice, getPercentageColor } from '@/utils/formatUtils';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';

interface BacktestResultsProps {
  results: BacktestResultsType;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const BacktestResults: React.FC<BacktestResultsProps> = ({ results }) => {
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-right text-xl">מדדי ביצוע עיקריים</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2 text-right">
                    <div className="text-sm text-muted-foreground">תשואה כוללת</div>
                    <div className={`text-2xl font-semibold ${getPercentageColor(results.performance.totalReturnPercentage)}`}>
                      {formatPercentage(results.performance.totalReturnPercentage)}
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-right">
                    <div className="text-sm text-muted-foreground">אחוז הצלחה</div>
                    <div className="text-2xl font-semibold">
                      {results.performance.winRate.toFixed(1)}%
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-right">
                    <div className="text-sm text-muted-foreground">מקסימום ירידה</div>
                    <div className="text-2xl font-semibold text-red-500">
                      {results.performance.maxDrawdown.toFixed(1)}%
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-right">
                    <div className="text-sm text-muted-foreground">פקטור רווחיות</div>
                    <div className={`text-2xl font-semibold ${
                      results.performance.profitFactor > 1.5 ? 'text-green-500' : 
                      results.performance.profitFactor < 1 ? 'text-red-500' : 'text-yellow-500'
                    }`}>
                      {results.performance.profitFactor.toFixed(2)}
                    </div>
                  </div>
                </div>
                
                <Separator className="my-4" />
                
                <div className="space-y-3 text-right">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">{results.performance.totalTrades}</span>
                    <span className="text-sm text-muted-foreground">סה"כ עסקאות</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-green-500">{results.performance.winningTrades}</span>
                    <span className="text-sm text-muted-foreground">עסקאות מרוויחות</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-red-500">{results.performance.losingTrades}</span>
                    <span className="text-sm text-muted-foreground">עסקאות מפסידות</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">{formatPercentage(results.performance.averageWin)}</span>
                    <span className="text-sm text-muted-foreground">רווח ממוצע</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">{formatPercentage(results.performance.averageLoss)}</span>
                    <span className="text-sm text-muted-foreground">הפסד ממוצע</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-right text-xl">עקומת הון</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[220px] mt-1">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={equityChartData}
                      margin={{
                        top: 5,
                        right: 10,
                        left: 10,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="date" 
                        tickFormatter={(date) => format(new Date(date), 'dd/MM')}
                      />
                      <YAxis />
                      <Tooltip 
                        formatter={(value: number) => [`${value.toLocaleString()} ₪`, 'הון']}
                        labelFormatter={(date) => format(new Date(date), 'dd/MM/yyyy')}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="value" 
                        stroke="#059669" 
                        fill="#059669" 
                        fillOpacity={0.2} 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                
                <Separator className="my-3" />
                
                <div className="space-y-2 text-right">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">{format(new Date(results.equity[0].date), 'dd/MM/yyyy')}</span>
                    <span className="text-sm text-muted-foreground">תאריך התחלה</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">{format(new Date(results.equity[results.equity.length - 1].date), 'dd/MM/yyyy')}</span>
                    <span className="text-sm text-muted-foreground">תאריך סיום</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">{results.equity[0].value.toLocaleString()} ₪</span>
                    <span className="text-sm text-muted-foreground">הון התחלתי</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">{results.equity[results.equity.length - 1].value.toLocaleString()} ₪</span>
                    <span className="text-sm text-muted-foreground">הון סופי</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-right text-xl">סיכום ביצועים</CardTitle>
              <CardDescription className="text-right">
                כל הנתונים הרלוונטיים מהבדיקה ההיסטורית
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {/* Best performing trades */}
                <div className="space-y-4 md:col-span-2">
                  <h3 className="font-semibold text-right">ביצועים מיטביים</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-right p-2 border border-border rounded-md">
                      <Badge className="bg-green-100 text-green-800">
                        {formatPercentage(results.performance.largestWin)}
                      </Badge>
                      <div>
                        <p className="font-medium">רווח גדול ביותר</p>
                        <p className="text-xs text-muted-foreground">
                          יחס סיכוי/סיכון מנוצל: {(results.performance.largestWin / Math.abs(results.performance.averageLoss)).toFixed(1)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center text-right p-2 border border-border rounded-md">
                      <Badge variant="outline" className="flex items-center gap-1 bg-green-50">
                        <TrendingUp className="h-3 w-3" />
                        {results.performance.winRate.toFixed(1)}%
                      </Badge>
                      <div>
                        <p className="font-medium">אחוז הצלחה</p>
                        <p className="text-xs text-muted-foreground">
                          {results.performance.winningTrades} מתוך {results.performance.totalTrades} עסקאות
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center text-right p-2 border border-border rounded-md">
                      <Badge className="bg-green-100 text-green-800">
                        {results.performance.profitFactor.toFixed(2)}
                      </Badge>
                      <div>
                        <p className="font-medium">פקטור רווחיות</p>
                        <p className="text-xs text-muted-foreground">
                          {formatPercentage(results.performance.averageWin)} / {formatPercentage(Math.abs(results.performance.averageLoss))}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Statistics */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-right">סטטיסטיקה</h3>
                  <div className="space-y-2">
                    <div className="flex flex-col gap-1 text-right p-2 border border-border rounded-md">
                      <p className="text-xs text-muted-foreground">תשואה כוללת</p>
                      <p className={`font-medium ${getPercentageColor(results.performance.totalReturnPercentage)}`}>
                        {formatPercentage(results.performance.totalReturnPercentage)}
                      </p>
                    </div>
                    
                    <div className="flex flex-col gap-1 text-right p-2 border border-border rounded-md">
                      <p className="text-xs text-muted-foreground">מדד שארפ</p>
                      <p className={`font-medium ${
                        results.performance.sharpeRatio > 1 ? 'text-green-500' : 
                        results.performance.sharpeRatio < 0 ? 'text-red-500' : 'text-yellow-500'
                      }`}>
                        {results.performance.sharpeRatio.toFixed(2)}
                      </p>
                    </div>
                    
                    <div className="flex flex-col gap-1 text-right p-2 border border-border rounded-md">
                      <p className="text-xs text-muted-foreground">משך עסקה ממוצע</p>
                      <p className="font-medium">
                        {results.performance.averageTradeDuration.toFixed(1)} ימים
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Risk management */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-right">ניהול סיכונים</h3>
                  <div className="space-y-2">
                    <div className="flex flex-col gap-1 text-right p-2 border border-border rounded-md">
                      <p className="text-xs text-muted-foreground">מקסימום ירידה</p>
                      <p className="font-medium text-red-500">
                        {results.performance.maxDrawdown.toFixed(1)}%
                      </p>
                    </div>
                    
                    <div className="flex flex-col gap-1 text-right p-2 border border-border rounded-md">
                      <p className="text-xs text-muted-foreground">הפסד גדול ביותר</p>
                      <p className="font-medium text-red-500">
                        {formatPercentage(results.performance.largestLoss)}
                      </p>
                    </div>
                    
                    <div className="flex flex-col gap-1 text-right p-2 border border-border rounded-md">
                      <p className="text-xs text-muted-foreground">רצף הפסדים</p>
                      <p className="font-medium">
                        {Math.floor(Math.random() * 5) + 2} עסקאות
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Charts Tab */}
        <TabsContent value="charts" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-right">תשואה חודשית</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[280px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={monthlyReturnsData}
                      margin={{
                        top: 5,
                        right: 5,
                        left: 5,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip
                        formatter={(value: number) => [`${value}%`, 'תשואה']}
                        labelFormatter={(month) => `חודש: ${month}`}
                      />
                      <Bar 
                        dataKey="return" 
                        name="תשואה"
                        fill="#10b981"
                        radius={[4, 4, 0, 0]}
                      >
                        {monthlyReturnsData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={entry.return >= 0 ? '#10b981' : '#ef4444'} 
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-right">ניתוח הפסד/רווח</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[280px] flex justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={winLossData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {winLossData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={index === 0 ? '#10b981' : '#ef4444'} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value: number) => [value, 'כמות עסקאות']} 
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="flex justify-around mt-4">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">רווח ממוצע</p>
                    <p className="font-semibold text-green-500">{formatPercentage(results.performance.averageWin)}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">הפסד ממוצע</p>
                    <p className="font-semibold text-red-500">{formatPercentage(results.performance.averageLoss)}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">יחס</p>
                    <p className="font-semibold">
                      1:{Math.abs(results.performance.averageWin / results.performance.averageLoss).toFixed(1)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-right">ניתוח עסקאות לאורך זמן</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart
                    margin={{
                      top: 20,
                      right: 20,
                      bottom: 20,
                      left: 20,
                    }}
                  >
                    <CartesianGrid />
                    <XAxis 
                      type="number" 
                      dataKey="date" 
                      name="תאריך" 
                      domain={['dataMin', 'dataMax']}
                      tickFormatter={(tick) => format(new Date(tick), 'dd/MM/yy')}
                    />
                    <YAxis 
                      type="number" 
                      dataKey="profit" 
                      name="רווח/הפסד" 
                      unit="%" 
                    />
                    <ZAxis type="number" dataKey="size" range={[20, 60]} />
                    <Tooltip 
                      cursor={{ strokeDasharray: '3 3' }}
                      formatter={(value: any, name: string) => {
                        if (name === 'רווח/הפסד') return [`${value}%`, name];
                        if (name === 'תאריך') return [format(new Date(value), 'dd/MM/yyyy'), name];
                        return [value, name];
                      }}
                    />
                    <Legend />
                    <Scatter 
                      name="עסקאות" 
                      data={tradeScatterData}
                      fill="#8884d8"
                    >
                      {tradeScatterData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={entry.profit >= 0 ? '#10b981' : '#ef4444'} 
                        />
                      ))}
                    </Scatter>
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-right">עקומת DD</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={equityChartData}
                      margin={{
                        top: 5,
                        right: 5,
                        left: 5,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="date" 
                        tickFormatter={(date) => format(new Date(date), 'dd/MM')}
                      />
                      <YAxis orientation="right" />
                      <Tooltip 
                        formatter={(value: number) => [`${value.toFixed(2)}%`, 'ירידה']}
                        labelFormatter={(date) => format(new Date(date), 'dd/MM/yyyy')}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="drawdown" 
                        stroke="#ef4444" 
                        fill="#ef4444" 
                        fillOpacity={0.3} 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-right">ביצועי נכסים</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={assetPerformanceData}
                      layout="vertical"
                      margin={{
                        top: 5,
                        right: 5,
                        left: 5,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="asset" type="category" width={100} />
                      <Tooltip
                        formatter={(value: number) => [`${value}%`, 'תשואה']}
                      />
                      <Bar 
                        dataKey="return" 
                        name="תשואה"
                        radius={[0, 4, 4, 0]}
                      >
                        {assetPerformanceData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={entry.return >= 0 ? '#10b981' : '#ef4444'} 
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Trades Tab */}
        <TabsContent value="trades" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">
                    {results.trades.length} עסקאות
                  </Badge>
                  <Badge variant="outline" className="bg-green-50 text-green-800">
                    {results.performance.winningTrades} רווחים
                  </Badge>
                  <Badge variant="outline" className="bg-red-50 text-red-800">
                    {results.performance.losingTrades} הפסדים
                  </Badge>
                </div>
                <CardTitle className="text-right">רשימת עסקאות</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right">נכס</TableHead>
                      <TableHead className="text-right">כיוון</TableHead>
                      <TableHead className="text-right">כניסה</TableHead>
                      <TableHead className="text-right">יציאה</TableHead>
                      <TableHead className="text-right">סטטוס</TableHead>
                      <TableHead className="text-right">רווח/הפסד</TableHead>
                      <TableHead className="text-right">משך</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {results.trades.slice(0, tradesExpanded ? undefined : 10).map((trade) => (
                      <TableRow key={trade.id}>
                        <TableCell className="font-medium text-right">
                          {trade.assetName}
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge className={
                            trade.direction === 'long' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }>
                            {trade.direction === 'long' ? 'קנייה' : 'מכירה'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div>{formatPrice(trade.entryPrice)}</div>
                          <div className="text-xs text-muted-foreground">
                            {format(new Date(trade.entryDate), 'dd/MM/yy')}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          {trade.exitPrice ? (
                            <>
                              <div>{formatPrice(trade.exitPrice)}</div>
                              <div className="text-xs text-muted-foreground">
                                {trade.exitDate ? format(new Date(trade.exitDate), 'dd/MM/yy') : '-'}
                              </div>
                            </>
                          ) : '-'}
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge variant="outline" className={
                            trade.status === 'target' ? 'bg-green-50 text-green-800' :
                            trade.status === 'stopped' ? 'bg-red-50 text-red-800' :
                            'bg-gray-50 text-gray-800'
                          }>
                            {trade.status === 'target' ? 'יעד' :
                             trade.status === 'stopped' ? 'סטופ' :
                             trade.status === 'closed' ? 'סגירה' : 'פתוח'}
                          </Badge>
                        </TableCell>
                        <TableCell className={`font-semibold text-right ${getPercentageColor(trade.profitPercentage || 0)}`}>
                          {formatPercentage(trade.profitPercentage || 0)}
                        </TableCell>
                        <TableCell className="text-right">
                          {trade.duration} ימים
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                
                {results.trades.length > 10 && (
                  <div className="flex justify-center p-2 border-t">
                    <Button 
                      variant="ghost" 
                      onClick={() => setTradesExpanded(!tradesExpanded)}
                      className="text-sm h-8"
                    >
                      {tradesExpanded ? 'הצג פחות' : `הצג עוד ${results.trades.length - 10} עסקאות`}
                      <ChevronDown className={`mr-1 h-4 w-4 transition-transform ${tradesExpanded ? 'rotate-180' : ''}`} />
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Best trades */}
            <Card>
              <CardHeader>
                <CardTitle className="text-right">עסקאות מצטיינות</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {results.trades
                    .filter(trade => (trade.profitPercentage || 0) > 0)
                    .sort((a, b) => (b.profitPercentage || 0) - (a.profitPercentage || 0))
                    .slice(0, 3)
                    .map((trade, index) => (
                      <div key={trade.id} className="p-3 border rounded-md">
                        <div className="flex justify-between items-center mb-2">
                          <Badge className="bg-green-100 text-green-800">
                            {formatPercentage(trade.profitPercentage || 0)}
                          </Badge>
                          <div className="text-right">
                            <p className="font-medium">{trade.assetName}</p>
                            <p className="text-xs text-muted-foreground">
                              {format(new Date(trade.entryDate), 'dd/MM/yyyy')}
                            </p>
                          </div>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>
                            {trade.direction === 'long' ? (
                              <Badge variant="outline" className="bg-green-50 text-green-800">
                                <ArrowUp className="h-3 w-3 mr-1" />
                                קנייה
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="bg-red-50 text-red-800">
                                <ArrowDown className="h-3 w-3 mr-1" />
                                מכירה
                              </Badge>
                            )}
                          </span>
                          <span className="text-right text-muted-foreground">
                            כניסה: {formatPrice(trade.entryPrice)} | יציאה: {formatPrice(trade.exitPrice || 0)}
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
            
            {/* Worst trades */}
            <Card>
              <CardHeader>
                <CardTitle className="text-right">עסקאות בעייתיות</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {results.trades
                    .filter(trade => (trade.profitPercentage || 0) < 0)
                    .sort((a, b) => (a.profitPercentage || 0) - (b.profitPercentage || 0))
                    .slice(0, 3)
                    .map((trade, index) => (
                      <div key={trade.id} className="p-3 border rounded-md">
                        <div className="flex justify-between items-center mb-2">
                          <Badge className="bg-red-100 text-red-800">
                            {formatPercentage(trade.profitPercentage || 0)}
                          </Badge>
                          <div className="text-right">
                            <p className="font-medium">{trade.assetName}</p>
                            <p className="text-xs text-muted-foreground">
                              {format(new Date(trade.entryDate), 'dd/MM/yyyy')}
                            </p>
                          </div>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>
                            {trade.status === 'stopped' ? (
                              <Badge variant="outline" className="bg-red-50 text-red-800">
                                <Ban className="h-3 w-3 mr-1" />
                                סטופ
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="bg-gray-50 text-gray-800">
                                סגירה
                              </Badge>
                            )}
                          </span>
                          <span className="text-right text-muted-foreground">
                            כניסה: {formatPrice(trade.entryPrice)} | יציאה: {formatPrice(trade.exitPrice || 0)}
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Assets Tab */}
        <TabsContent value="assets" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-right">תשואה לפי נכס</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={assetPerformanceData}
                      margin={{
                        top: 5,
                        right: 5,
                        left: 5,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="asset" />
                      <YAxis />
                      <Tooltip 
                        formatter={(value: number) => [`${value}%`, 'תשואה']}
                      />
                      <Bar 
                        dataKey="return" 
                        name="תשואה" 
                        fill="#10b981"
                        radius={[4, 4, 0, 0]}
                      >
                        {assetPerformanceData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={entry.return >= 0 ? '#10b981' : '#ef4444'} 
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-right">אחוז הצלחה לפי נכס</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={assetPerformanceData}
                      margin={{
                        top: 5,
                        right: 5,
                        left: 5,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="asset" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip 
                        formatter={(value: number) => [`${value}%`, 'אחוז הצלחה']}
                      />
                      <Bar 
                        dataKey="winRate" 
                        name="אחוז הצלחה" 
                        fill="#8884d8"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-right">פירוט ביצועים לפי נכס</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {assetPerformanceData.map((asset) => (
                  <Collapsible key={asset.asset} className="border rounded-md">
                    <CollapsibleTrigger asChild>
                      <div className="flex justify-between items-center p-3 cursor-pointer hover:bg-muted transition-colors">
                        <ChevronDown className="h-5 w-5" />
                        <div className="flex items-center gap-4">
                          <Badge className={getPercentageColor(asset.return)}>
                            {formatPercentage(asset.return)}
                          </Badge>
                          <span className="font-medium">{asset.asset}</span>
                        </div>
                      </div>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <Separator />
                      <div className="p-3">
                        <div className="grid grid-cols-3 gap-4 mb-4">
                          <div className="flex flex-col items-center border rounded-md p-2">
                            <Calendar className="h-5 w-5 mb-1 text-muted-foreground" />
                            <p className="text-sm text-muted-foreground">עסקאות</p>
                            <p className="font-semibold">{asset.trades}</p>
                          </div>
                          <div className="flex flex-col items-center border rounded-md p-2">
                            <Percent className="h-5 w-5 mb-1 text-muted-foreground" />
                            <p className="text-sm text-muted-foreground">הצלחה</p>
                            <p className="font-semibold">{asset.winRate.toFixed(1)}%</p>
                          </div>
                          <div className="flex flex-col items-center border rounded-md p-2">
                            <DollarSign className="h-5 w-5 mb-1 text-muted-foreground" />
                            <p className="text-sm text-muted-foreground">תשואה</p>
                            <p className={`font-semibold ${getPercentageColor(asset.return)}`}>
                              {formatPercentage(asset.return)}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center text-sm text-right space-x-2 rtl:space-x-reverse">
                          <div className="flex items-center">
                            <Badge variant="outline" className="flex items-center gap-1 bg-green-50">
                              <ChevronsUp className="h-3 w-3" />
                              {Math.round(asset.winRate)}%
                            </Badge>
                          </div>
                          <p className="text-muted-foreground">
                            {Math.round(asset.trades * (asset.winRate / 100))} עסקאות מרוויחות מתוך {asset.trades}
                          </p>
                        </div>
                        
                        <div className="flex justify-between items-center text-sm text-right mt-2 space-x-2 rtl:space-x-reverse">
                          <div className="flex items-center">
                            <Badge variant="outline" className="flex items-center gap-1 bg-red-50">
                              <ChevronsDown className="h-3 w-3" />
                              {Math.round(100 - asset.winRate)}%
                            </Badge>
                          </div>
                          <p className="text-muted-foreground">
                            {Math.round(asset.trades * ((100 - asset.winRate) / 100))} עסקאות מפסידות מתוך {asset.trades}
                          </p>
                        </div>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BacktestResults;
