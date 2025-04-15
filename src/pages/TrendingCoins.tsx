
import React, { useState, useEffect } from 'react';
import { Container } from '@/components/ui/container';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useBinanceData } from '@/hooks/use-binance-data';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RotateCw } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';

type MarketDataEntry = {
  symbol: string;
  price: number;
  change24h: number;
  high24h: number;
  low24h: number;
  volume24h: number;
  lastUpdated: number;
  name?: string;
};

const TrendingCoins: React.FC = () => {
  const [topCoins, setTopCoins] = useState<string[]>(['BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'SOLUSDT', 'ADAUSDT']);
  const [timeRange, setTimeRange] = useState<string>('24h');
  
  const { marketData, isLoading, refreshData } = useBinanceData(
    topCoins
  );
  
  // Sort coins by market cap or volume
  const sortedCoins = Object.values(marketData || {}).sort((a, b) => {
    return (b.price || 0) * (b.volume24h || 0) - (a.price || 0) * (a.volume24h || 0);
  });
  
  // Format coin name from symbol
  const formatCoinName = (symbol: string): string => {
    if (!symbol) return '';
    return symbol.replace('USDT', '');
  };
  
  return (
    <Container className="py-8">
      <div className="flex justify-between items-center mb-6">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => refreshData()}
          disabled={isLoading}
        >
          <RotateCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          רענן נתונים
        </Button>
        <h1 className="text-3xl font-bold">מטבעות מובילים</h1>
      </div>
      
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">סקירה כללית</TabsTrigger>
          <TabsTrigger value="charts">גרפים</TabsTrigger>
          <TabsTrigger value="details">פרטים מלאים</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {isLoading ? (
              Array(5).fill(0).map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <Skeleton className="h-5 w-20 mb-1" />
                    <Skeleton className="h-4 w-32" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-12 w-28 mb-2" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4 mt-2" />
                  </CardContent>
                </Card>
              ))
            ) : (
              sortedCoins.slice(0, 6).map((coin) => (
                <Card key={coin.symbol} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center justify-between">
                      {formatCoinName(coin.symbol)}
                      <span className={`text-sm ${coin.change24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {coin.change24h >= 0 ? '+' : ''}{coin.change24h ? coin.change24h.toFixed(2) : '0.00'}%
                      </span>
                    </CardTitle>
                    <CardDescription>
                      עדכון אחרון: {new Date(coin.lastUpdated).toLocaleTimeString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold mb-2">
                      ${coin.price ? coin.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00'}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      <div className="flex justify-between mb-1">
                        <span>גבוה (24ש):</span>
                        <span>${coin.high24h ? coin.high24h.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>נמוך (24ש):</span>
                        <span>${coin.low24h ? coin.low24h.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00'}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="charts">
          <Card>
            <CardHeader>
              <CardTitle>השוואת ביצועים</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={sortedCoins.map(coin => ({
                      name: formatCoinName(coin.symbol),
                      value: coin.price,
                      change: coin.change24h
                    }))}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="value" stroke="#8884d8" activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="details">
          <Card>
            <CardHeader>
              <CardTitle>נתונים מפורטים</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative overflow-x-auto">
                <table className="w-full text-sm text-left rtl:text-right">
                  <thead className="text-xs uppercase bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th scope="col" className="px-6 py-3">מטבע</th>
                      <th scope="col" className="px-6 py-3">מחיר</th>
                      <th scope="col" className="px-6 py-3">שינוי (24ש)</th>
                      <th scope="col" className="px-6 py-3">נפח מסחר (24ש)</th>
                      <th scope="col" className="px-6 py-3">גבוה/נמוך (24ש)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedCoins.map((coin) => (
                      <tr key={coin.symbol} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                        <td className="px-6 py-4 font-medium whitespace-nowrap">{formatCoinName(coin.symbol)}</td>
                        <td className="px-6 py-4">${coin.price ? coin.price.toLocaleString() : '0.00'}</td>
                        <td className={`px-6 py-4 ${coin.change24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                          {coin.change24h >= 0 ? '+' : ''}{coin.change24h ? coin.change24h.toFixed(2) : '0.00'}%
                        </td>
                        <td className="px-6 py-4">${coin.volume24h ? (coin.volume24h/1000000).toFixed(2) : '0.00'}M</td>
                        <td className="px-6 py-4">
                          ${coin.high24h ? coin.high24h.toLocaleString() : '0.00'} / ${coin.low24h ? coin.low24h.toLocaleString() : '0.00'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </Container>
  );
};

export default TrendingCoins;
