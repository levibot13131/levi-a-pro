
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar } from 'recharts';
import { LineChart as LineChartIcon, BarChart3, Activity, TrendingUp, TrendingDown, Target, Zap } from 'lucide-react';

// Mock data for charts
const priceData = [
  { time: '09:00', price: 43250, volume: 1250000 },
  { time: '10:00', price: 43380, volume: 1680000 },
  { time: '11:00', price: 43150, volume: 2100000 },
  { time: '12:00', price: 43420, volume: 1890000 },
  { time: '13:00', price: 43650, volume: 2450000 },
  { time: '14:00', price: 43580, volume: 1750000 },
  { time: '15:00', price: 43720, volume: 2200000 },
  { time: '16:00', price: 43890, volume: 1980000 },
];

const technicalIndicators = [
  { name: 'RSI', value: 67.8, status: 'neutral', color: 'yellow' },
  { name: 'MACD', value: 0.45, status: 'bullish', color: 'green' },
  { name: 'BB Upper', value: 44200, status: 'resistance', color: 'red' },
  { name: 'BB Lower', value: 42800, status: 'support', color: 'green' },
  { name: 'EMA 20', value: 43650, status: 'bullish', color: 'green' },
  { name: 'SMA 50', value: 43420, status: 'neutral', color: 'yellow' },
];

const patterns = [
  { name: 'דוג'י', confidence: 85, type: 'reversal', timeframe: '1H' },
  { name: 'פטיש', confidence: 72, type: 'bullish', timeframe: '4H' },
  { name: 'משולש עולה', confidence: 91, type: 'continuation', timeframe: '1D' },
];

const ChartsAnalysis: React.FC = () => {
  const [selectedSymbol, setSelectedSymbol] = useState('BTCUSDT');
  const [selectedTimeframe, setSelectedTimeframe] = useState('1H');

  const symbols = ['BTCUSDT', 'ETHUSDT', 'SOLUSDT', 'ADAUSDT'];
  const timeframes = ['5M', '15M', '1H', '4H', '1D', '1W'];

  return (
    <div className="space-y-6 p-6">
      <div className="text-right">
        <h1 className="text-3xl font-bold flex items-center justify-end gap-2">
          <LineChartIcon className="h-8 w-8" />
          ניתוח גרפים מתקדם
        </h1>
        <p className="text-muted-foreground">
          ניתוח טכני מקיף עם זיהוי דפוסים ואיתותים חכמים
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="flex gap-2">
          {symbols.map((symbol) => (
            <Button
              key={symbol}
              variant={selectedSymbol === symbol ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedSymbol(symbol)}
            >
              {symbol}
            </Button>
          ))}
        </div>
        <div className="flex gap-2">
          {timeframes.map((tf) => (
            <Button
              key={tf}
              variant={selectedTimeframe === tf ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedTimeframe(tf)}
            >
              {tf}
            </Button>
          ))}
        </div>
      </div>

      {/* Main Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-right flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge className="bg-green-100 text-green-800">חי</Badge>
              <span>+2.4%</span>
            </div>
            <span>{selectedSymbol} - {selectedTimeframe}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={priceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis domain={['dataMin - 100', 'dataMax + 100']} />
                <Tooltip 
                  formatter={(value, name) => [`$${value.toLocaleString()}`, 'מחיר']}
                  labelFormatter={(label) => `זמן: ${label}`}
                />
                <Area 
                  type="monotone" 
                  dataKey="price" 
                  stroke="#8884d8" 
                  fill="#8884d8" 
                  fillOpacity={0.1}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="indicators" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="indicators">מדדים טכניים</TabsTrigger>
          <TabsTrigger value="patterns">דפוסי מחיר</TabsTrigger>
          <TabsTrigger value="volume">ניתוח נפח</TabsTrigger>
          <TabsTrigger value="signals">איתותים</TabsTrigger>
        </TabsList>

        <TabsContent value="indicators" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {technicalIndicators.map((indicator) => (
              <Card key={indicator.name}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <Badge 
                      className={
                        indicator.color === 'green' ? 'bg-green-100 text-green-800' :
                        indicator.color === 'red' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }
                    >
                      {indicator.status}
                    </Badge>
                    <div className="text-right">
                      <p className="font-semibold">{indicator.name}</p>
                      <p className="text-lg font-bold">{indicator.value}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="patterns" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {patterns.map((pattern, index) => (
              <Card key={index} className="border-r-4 border-r-primary">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <Badge className="bg-blue-100 text-blue-800">
                      {pattern.timeframe}
                    </Badge>
                    <h3 className="font-semibold">{pattern.name}</h3>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>רמת ביטחון</span>
                      <span className="font-bold">{pattern.confidence}%</span>
                    </div>
                    <div className="flex justify-between">
                      <Badge 
                        className={
                          pattern.type === 'bullish' ? 'bg-green-100 text-green-800' :
                          pattern.type === 'bearish' ? 'bg-red-100 text-red-800' :
                          'bg-blue-100 text-blue-800'
                        }
                      >
                        {pattern.type}
                      </Badge>
                      <span className="text-sm text-muted-foreground">סוג</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="volume" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-right">ניתוח נפח מסחר</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={priceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value) => [`${(value as number).toLocaleString()}`, 'נפח']}
                    />
                    <Bar dataKey="volume" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="signals" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="border-l-4 border-l-green-500">
              <CardHeader>
                <CardTitle className="text-right flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                  איתות קנייה
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-bold text-green-600">$43,250</span>
                    <span>מחיר כניסה</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-bold">$44,500</span>
                    <span>יעד</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-bold text-red-600">$42,800</span>
                    <span>סטופ לוס</span>
                  </div>
                  <div className="flex justify-between">
                    <Badge className="bg-green-100 text-green-800">92%</Badge>
                    <span>ביטחון</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-blue-500">
              <CardHeader>
                <CardTitle className="text-right flex items-center gap-2">
                  <Target className="h-5 w-5 text-blue-500" />
                  הזדמנות סקלפינג
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-bold">5 דקות</span>
                    <span>זמן צפוי</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-bold text-blue-600">0.8%</span>
                    <span>רווח צפוי</span>
                  </div>
                  <div className="flex justify-between">
                    <Badge className="bg-blue-100 text-blue-800">גבוה</Badge>
                    <span>נפח</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Live Status */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-green-500" />
              <span className="text-green-600 font-medium">מערכת פעילה</span>
            </div>
            <div className="text-right">
              <p className="font-semibold">סריקה פעילה של {symbols.length} נכסים</p>
              <p className="text-sm text-muted-foreground">עדכון אחרון: לפני 2 שניות</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChartsAnalysis;
