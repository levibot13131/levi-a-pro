
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import TradingViewChart from '@/components/tradingview/TradingViewChart';
import ComprehensiveAnalysis from '@/components/comprehensive-analysis/ComprehensiveAnalysis';
import { Badge } from '@/components/ui/badge';
import { BarChart3, TrendingUp, Activity, Target } from 'lucide-react';

const ChartsAnalysis: React.FC = () => {
  const [selectedSymbol, setSelectedSymbol] = useState('BTCUSDT');
  const [selectedTimeframe, setSelectedTimeframe] = useState('1D');

  const cryptoAssets = [
    { symbol: 'BTCUSDT', name: 'Bitcoin', price: '$43,250' },
    { symbol: 'ETHUSDT', name: 'Ethereum', price: '$2,650' },
    { symbol: 'SOLUSDT', name: 'Solana', price: '$95.40' },
    { symbol: 'BNBUSDT', name: 'BNB', price: '$320.80' },
    { symbol: 'ADAUSDT', name: 'Cardano', price: '$0.52' },
    { symbol: 'XRPUSDT', name: 'XRP', price: '$0.63' },
    { symbol: 'DOTUSDT', name: 'Polkadot', price: '$7.85' },
    { symbol: 'LINKUSDT', name: 'Chainlink', price: '$14.90' },
    { symbol: 'AVAXUSDT', name: 'Avalanche', price: '$38.70' },
    { symbol: 'MATICUSDT', name: 'Polygon', price: '$0.89' }
  ];

  const timeframes = [
    { value: '5m', label: '5 דקות' },
    { value: '15m', label: '15 דקות' },
    { value: '1h', label: 'שעה' },
    { value: '4h', label: '4 שעות' },
    { value: '1D', label: 'יום' },
    { value: '1W', label: 'שבוע' },
    { value: '1M', label: 'חודש' }
  ];

  return (
    <div className="container mx-auto py-6 px-4 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {timeframes.map(tf => (
                <SelectItem key={tf.value} value={tf.value}>
                  {tf.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedSymbol} onValueChange={setSelectedSymbol}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {cryptoAssets.map(asset => (
                <SelectItem key={asset.symbol} value={asset.symbol}>
                  <div className="flex items-center justify-between w-full">
                    <span>{asset.name}</span>
                    <span className="text-sm text-muted-foreground">{asset.price}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <h1 className="text-3xl font-bold text-right flex items-center gap-2">
            <BarChart3 className="h-8 w-8" />
            ניתוח גרפים
          </h1>
          <p className="text-muted-foreground text-right">
            ניתוח טכני מתקדם עם גרפים אינטראקטיביים
          </p>
        </div>
      </div>

      <Tabs defaultValue="charts" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="charts">גרפים</TabsTrigger>
          <TabsTrigger value="analysis">ניתוח טכני</TabsTrigger>
          <TabsTrigger value="patterns">דפוסים</TabsTrigger>
          <TabsTrigger value="comprehensive">ניתוח מקיף</TabsTrigger>
        </TabsList>

        <TabsContent value="charts" className="space-y-6">
          {/* Main Chart */}
          <TradingViewChart 
            symbol={selectedSymbol}
            timeframe={selectedTimeframe}
            height={500}
            showToolbar={true}
          />

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 flex items-center space-x-2">
                <TrendingUp className="h-8 w-8 text-green-500" />
                <div>
                  <p className="text-sm font-medium">מחיר נוכחי</p>
                  <p className="text-2xl font-bold">
                    {cryptoAssets.find(a => a.symbol === selectedSymbol)?.price}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 flex items-center space-x-2">
                <Activity className="h-8 w-8 text-blue-500" />
                <div>
                  <p className="text-sm font-medium">שינוי 24 שעות</p>
                  <p className="text-2xl font-bold text-green-600">+2.45%</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 flex items-center space-x-2">
                <Target className="h-8 w-8 text-orange-500" />
                <div>
                  <p className="text-sm font-medium">נפח 24 שעות</p>
                  <p className="text-2xl font-bold">$1.2B</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 flex items-center space-x-2">
                <BarChart3 className="h-8 w-8 text-purple-500" />
                <div>
                  <p className="text-sm font-medium">RSI</p>
                  <p className="text-2xl font-bold">67.3</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Multiple Timeframe View */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-right">תצוגה - 4 שעות</CardTitle>
              </CardHeader>
              <CardContent>
                <TradingViewChart 
                  symbol={selectedSymbol}
                  timeframe="4h"
                  height={300}
                  showToolbar={false}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-right">תצוגה - יומית</CardTitle>
              </CardHeader>
              <CardContent>
                <TradingViewChart 
                  symbol={selectedSymbol}
                  timeframe="1D"
                  height={300}
                  showToolbar={false}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Technical Indicators */}
            <Card>
              <CardHeader>
                <CardTitle className="text-right">מדדים טכניים</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <Badge className="bg-yellow-100 text-yellow-800">ניטרלי</Badge>
                  <span className="text-sm">RSI (67.3)</span>
                </div>
                <div className="flex justify-between items-center">
                  <Badge className="bg-green-100 text-green-800">חיובי</Badge>
                  <span className="text-sm">MACD</span>
                </div>
                <div className="flex justify-between items-center">
                  <Badge className="bg-blue-100 text-blue-800">תמיכה</Badge>
                  <span className="text-sm">Bollinger Bands</span>
                </div>
                <div className="flex justify-between items-center">
                  <Badge className="bg-green-100 text-green-800">עליה</Badge>
                  <span className="text-sm">Moving Average</span>
                </div>
              </CardContent>
            </Card>

            {/* Support & Resistance */}
            <Card>
              <CardHeader>
                <CardTitle className="text-right">תמיכות והתנגדויות</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">התנגדות חזקה</div>
                  <div className="font-bold text-red-600">$44,800</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">התנגדות</div>
                  <div className="font-bold text-orange-600">$43,900</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">מחיר נוכחי</div>
                  <div className="font-bold">$43,250</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">תמיכה</div>
                  <div className="font-bold text-green-600">$42,100</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">תמיכה חזקה</div>
                  <div className="font-bold text-green-800">$41,200</div>
                </div>
              </CardContent>
            </Card>

            {/* Price Targets */}
            <Card>
              <CardHeader>
                <CardTitle className="text-right">יעדי מחיר</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">יעד עליון</div>
                  <div className="font-bold text-green-600">$46,500</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">יעד בינוני</div>
                  <div className="font-bold text-blue-600">$44,800</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">יעד תחתון</div>
                  <div className="font-bold text-orange-600">$41,900</div>
                </div>
                <div className="pt-2 border-t">
                  <div className="text-sm text-muted-foreground mb-1">סטופ לוס מומלץ</div>
                  <div className="font-bold text-red-600">$42,100</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="patterns" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-right">דפוסים זוהו</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-green-50 rounded">
                  <Badge className="bg-green-100 text-green-800">פעיל</Badge>
                  <div className="text-right">
                    <div className="font-medium">משולש עולה</div>
                    <div className="text-sm text-muted-foreground">ביטחון: 87%</div>
                  </div>
                </div>

                <div className="flex justify-between items-center p-3 bg-blue-50 rounded">
                  <Badge className="bg-blue-100 text-blue-800">ממתין</Badge>
                  <div className="text-right">
                    <div className="font-medium">פריצת נפח</div>
                    <div className="text-sm text-muted-foreground">ביטחון: 73%</div>
                  </div>
                </div>

                <div className="flex justify-between items-center p-3 bg-yellow-50 rounded">
                  <Badge className="bg-yellow-100 text-yellow-800">התפתחות</Badge>
                  <div className="text-right">
                    <div className="font-medium">דגל שורי</div>
                    <div className="text-sm text-muted-foreground">ביטחון: 65%</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-right">אותות פיבונאצ'י</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">רמת 0.618 (זהב)</div>
                  <div className="font-bold text-yellow-600">$42,890</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">רמת 0.5</div>
                  <div className="font-bold">$43,250</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">רמת 0.382</div>
                  <div className="font-bold">$43,610</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">הרחבה 1.618</div>
                  <div className="font-bold text-green-600">$45,120</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="comprehensive" className="space-y-6">
          <ComprehensiveAnalysis />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ChartsAnalysis;
