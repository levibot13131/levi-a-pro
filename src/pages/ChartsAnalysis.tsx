
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar } from 'recharts';
import { LineChart as LineChartIcon, BarChart3, Activity, TrendingUp, TrendingDown, Target, Zap, RefreshCw } from 'lucide-react';

const ChartsAnalysis: React.FC = () => {
  const [selectedSymbol, setSelectedSymbol] = useState('BTCUSDT');
  const [selectedTimeframe, setSelectedTimeframe] = useState('1H');
  const [priceData, setPriceData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<string>('');

  const symbols = ['BTCUSDT', 'ETHUSDT', 'SOLUSDT', 'ADAUSDT'];
  const timeframes = ['5M', '15M', '1H', '4H', '1D', '1W'];

  // Mock data for demonstration - in production this would come from real API
  const generatePriceData = (symbol: string) => {
    const basePrice = {
      'BTCUSDT': 103500,
      'ETHUSDT': 2420,
      'SOLUSDT': 140,
      'ADAUSDT': 0.575
    }[symbol] || 100;

    const dataPoints = 24; // 24 hours of data
    const now = Date.now();
    
    let currentPrice = basePrice;
    const data = [];
    
    for (let i = dataPoints; i >= 0; i--) {
      const variation = (Math.random() - 0.5) * 0.04; // ±2% variation
      currentPrice = currentPrice * (1 + variation);
      
      const volume = Math.floor(Math.random() * 2000000) + 500000;
      
      data.push({
        time: new Date(now - (i * 60 * 60 * 1000)).toLocaleTimeString('he-IL', { 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        price: Math.round(currentPrice * 100) / 100,
        volume: volume,
        timestamp: now - (i * 60 * 60 * 1000)
      });
    }
    
    return data;
  };

  const loadChartData = async () => {
    setIsLoading(true);
    try {
      console.log(`📊 Loading chart data for ${selectedSymbol} - ${selectedTimeframe}`);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const data = generatePriceData(selectedSymbol);
      setPriceData(data);
      setLastUpdate(new Date().toLocaleTimeString('he-IL'));
      
      console.log(`✅ Chart data loaded: ${data.length} points for ${selectedSymbol}`);
    } catch (error) {
      console.error('❌ Error loading chart data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Load initial data and set up auto-refresh
  useEffect(() => {
    loadChartData();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      loadChartData();
    }, 30000);
    
    return () => clearInterval(interval);
  }, [selectedSymbol, selectedTimeframe]);

  const technicalIndicators = [
    { name: 'RSI', value: 67.8, status: 'neutral', color: 'yellow' },
    { name: 'MACD', value: 0.45, status: 'bullish', color: 'green' },
    { name: 'BB Upper', value: priceData.length > 0 ? Math.max(...priceData.map(d => d.price)) * 1.02 : 44200, status: 'resistance', color: 'red' },
    { name: 'BB Lower', value: priceData.length > 0 ? Math.min(...priceData.map(d => d.price)) * 0.98 : 42800, status: 'support', color: 'green' },
    { name: 'EMA 20', value: priceData.length > 0 ? priceData[priceData.length - 1]?.price * 1.001 : 43650, status: 'bullish', color: 'green' },
    { name: 'SMA 50', value: priceData.length > 0 ? priceData[priceData.length - 1]?.price * 0.999 : 43420, status: 'neutral', color: 'yellow' },
  ];

  const patterns = [
    { name: "דוג'י", confidence: 85, type: 'reversal', timeframe: '1H' },
    { name: 'פטיש', confidence: 72, type: 'bullish', timeframe: '4H' },
    { name: 'משולש עולה', confidence: 91, type: 'continuation', timeframe: '1D' },
  ];

  const currentPrice = priceData.length > 0 ? priceData[priceData.length - 1]?.price : 0;
  const priceChange = priceData.length > 1 
    ? ((currentPrice - priceData[0].price) / priceData[0].price) * 100 
    : 0;
  const isPositive = priceChange >= 0;

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
        <div className="flex gap-2 items-center">
          <Button
            onClick={loadChartData}
            variant="outline"
            size="sm"
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            רענן
          </Button>
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
              <Badge className={isLoading ? "bg-gray-100 text-gray-800" : "bg-green-100 text-green-800"}>
                {isLoading ? 'טוען...' : 'חי'}
              </Badge>
              {!isLoading && priceData.length > 0 && (
                <span className={isPositive ? 'text-green-500' : 'text-red-500'}>
                  {isPositive ? '+' : ''}{priceChange.toFixed(2)}%
                </span>
              )}
              {lastUpdate && (
                <span className="text-xs text-muted-foreground">
                  עודכן: {lastUpdate}
                </span>
              )}
            </div>
            <div className="text-right">
              <span className="text-2xl font-bold">{selectedSymbol}</span>
              {currentPrice > 0 && (
                <div className="text-sm text-muted-foreground">
                  ${currentPrice.toLocaleString()}
                </div>
              )}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-96">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <span className="mr-2">טוען נתוני גרף...</span>
              </div>
            ) : priceData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={priceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis domain={['dataMin - 1%', 'dataMax + 1%']} />
                  <Tooltip 
                    formatter={(value, name) => [`$${Number(value).toLocaleString()}`, 'מחיר']}
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
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                <div className="text-center">
                  <BarChart3 className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>אין נתונים זמינים</p>
                  <Button onClick={loadChartData} variant="outline" size="sm" className="mt-2">
                    נסה שוב
                  </Button>
                </div>
              </div>
            )}
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
                      <p className="text-lg font-bold">
                        {typeof indicator.value === 'number' ? indicator.value.toFixed(2) : indicator.value}
                      </p>
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
                {priceData.length > 0 ? (
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
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    אין נתוני נפח זמינים
                  </div>
                )}
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
                    <span className="font-bold text-green-600">${currentPrice.toLocaleString()}</span>
                    <span>מחיר כניסה</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-bold">${(currentPrice * 1.035).toLocaleString()}</span>
                    <span>יעד</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-bold text-red-600">${(currentPrice * 0.98).toLocaleString()}</span>
                    <span>סטופ לוס</span>
                  </div>
                  <div className="flex justify-between">
                    <Badge className="bg-green-100 text-green-800">87%</Badge>
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
                    <span className="font-bold">15 דקות</span>
                    <span>זמן צפוי</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-bold text-blue-600">1.2%</span>
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
              <Activity className="h-5 w-5 text-green-500 animate-pulse" />
              <span className="text-green-600 font-medium">
                {isLoading ? 'טוען נתונים...' : 'מערכת פעילה'}
              </span>
            </div>
            <div className="text-right">
              <p className="font-semibold">סריקה פעילה של {symbols.length} נכסים</p>
              <p className="text-sm text-muted-foreground">
                עדכון אחרון: {lastUpdate || 'בטעינה...'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChartsAnalysis;
