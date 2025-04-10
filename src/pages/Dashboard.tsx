
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Asset, AssetHistoricalData } from '@/types/asset';
import { getAssets, getAssetHistory } from '@/services/mockDataService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { useToast } from '@/hooks/use-toast';

const Dashboard = () => {
  const { toast } = useToast();
  const [selectedAsset, setSelectedAsset] = useState<string | null>(null);
  const [timeframe, setTimeframe] = useState<AssetHistoricalData['timeframe']>('1m');

  // שליפת רשימת הנכסים
  const { data: assets, isLoading: assetsLoading, error: assetsError } = useQuery({
    queryKey: ['assets'],
    queryFn: getAssets,
  });

  // שליפת נתונים היסטוריים לנכס הנבחר
  const { data: historicalData, isLoading: historyLoading } = useQuery({
    queryKey: ['assetHistory', selectedAsset, timeframe],
    queryFn: () => selectedAsset ? getAssetHistory(selectedAsset, timeframe) : null,
    enabled: !!selectedAsset,
  });

  // בחירת נכס ברירת מחדל כשהנתונים נטענים
  useEffect(() => {
    if (assets?.length && !selectedAsset) {
      setSelectedAsset(assets[0].id);
    }
  }, [assets, selectedAsset]);

  // הצגת שגיאה אם יש
  useEffect(() => {
    if (assetsError) {
      toast({
        title: 'שגיאה בטעינת נתונים',
        description: 'לא ניתן לטעון את נתוני הנכסים. נסה שוב מאוחר יותר.',
        variant: 'destructive',
      });
    }
  }, [assetsError, toast]);

  // עיבוד נתונים לגרף
  const formatChartData = (data?: AssetHistoricalData) => {
    if (!data) return [];
    
    return data.data.map(point => ({
      date: new Date(point.timestamp).toLocaleDateString('he-IL'),
      price: point.price
    }));
  };

  // הצגת שינוי המחיר (חיובי או שלילי)
  const renderPriceChange = (change: number) => {
    const color = change >= 0 ? 'text-green-500' : 'text-red-500';
    const sign = change >= 0 ? '+' : '';
    return <span className={color}>{sign}{change.toFixed(2)}%</span>;
  };

  // עיצוב התרשים
  const chartConfig = {
    price: {
      label: 'מחיר',
      theme: {
        light: '#0369a1',
        dark: '#38bdf8',
      },
    },
  };

  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <h1 className="text-3xl font-bold mb-6 text-right">לוח מחוונים למסחר</h1>
      
      {/* כרטיסי נכסים */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
        {assetsLoading ? (
          Array.from({ length: 4 }).map((_, idx) => (
            <Card key={idx} className="animate-pulse h-32">
              <CardContent className="p-4">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
                <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
              </CardContent>
            </Card>
          ))
        ) : (
          assets?.map((asset: Asset) => (
            <Card 
              key={asset.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                selectedAsset === asset.id ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => setSelectedAsset(asset.id)}
            >
              <CardContent className="p-4 flex items-center">
                {asset.imageUrl && (
                  <div className="w-12 h-12 mr-4 shrink-0">
                    <img 
                      src={asset.imageUrl} 
                      alt={asset.name} 
                      className="w-full h-full object-contain"
                    />
                  </div>
                )}
                <div className="flex-1 text-right">
                  <h3 className="font-bold">{asset.name}</h3>
                  <div className="text-sm text-gray-500 mb-1">{asset.symbol}</div>
                  <div className="flex justify-between">
                    <div>
                      {renderPriceChange(asset.change24h)}
                    </div>
                    <div className="font-semibold">
                      ${asset.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* כרטיס גרף */}
      <Card className="mb-8">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>מחיר היסטורי</CardTitle>
            <CardDescription>
              {selectedAsset && assets?.find(a => a.id === selectedAsset)?.name}
            </CardDescription>
          </div>
          <div className="flex space-x-2 rtl:space-x-reverse">
            <Button 
              variant={timeframe === '1d' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setTimeframe('1d')}
            >
              יום
            </Button>
            <Button 
              variant={timeframe === '1w' ? 'default' : 'outline'}
              size="sm" 
              onClick={() => setTimeframe('1w')}
            >
              שבוע
            </Button>
            <Button 
              variant={timeframe === '1m' ? 'default' : 'outline'}
              size="sm" 
              onClick={() => setTimeframe('1m')}
            >
              חודש
            </Button>
            <Button 
              variant={timeframe === '3m' ? 'default' : 'outline'}
              size="sm" 
              onClick={() => setTimeframe('3m')}
            >
              3 חודשים
            </Button>
            <Button 
              variant={timeframe === '1y' ? 'default' : 'outline'}
              size="sm" 
              onClick={() => setTimeframe('1y')}
            >
              שנה
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] w-full">
            {historyLoading ? (
              <div className="w-full h-full flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : (
              historicalData && (
                <ChartContainer config={chartConfig}>
                  <AreaChart data={formatChartData(historicalData)}>
                    <defs>
                      <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0369a1" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#0369a1" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="date" 
                      tickFormatter={(value) => value.split('/').slice(0, 2).join('/')}
                    />
                    <YAxis 
                      domain={['auto', 'auto']}
                      tickFormatter={(value) => `$${value.toLocaleString()}`}
                    />
                    <ChartTooltip
                      content={<ChartTooltipContent labelFormatter={(label) => `תאריך: ${label}`} />}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="price" 
                      stroke="#0369a1" 
                      fillOpacity={1}
                      fill="url(#colorPrice)" 
                    />
                  </AreaChart>
                </ChartContainer>
              )
            )}
          </div>
        </CardContent>
      </Card>

      {/* כרטיס עם פרטי נכס */}
      {selectedAsset && assets && (
        <Card>
          <CardHeader>
            <CardTitle className="text-right">פרטי נכס</CardTitle>
          </CardHeader>
          <CardContent>
            {(() => {
              const asset = assets.find(a => a.id === selectedAsset);
              if (!asset) return null;
              
              return (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-right">
                  <div>
                    <h3 className="font-semibold mb-2">מידע בסיסי</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-500">סימול:</span>
                        <span>{asset.symbol}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">סוג:</span>
                        <span>
                          {asset.type === 'crypto' ? 'קריפטו' : 
                           asset.type === 'stock' ? 'מניה' : 'מט"ח'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">מחיר נוכחי:</span>
                        <span className="font-semibold">
                          ${asset.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">נתוני מסחר</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-500">שינוי 24 שעות:</span>
                        <span>{renderPriceChange(asset.change24h)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">מחזור מסחר 24 שעות:</span>
                        <span>${asset.volume24h.toLocaleString()}</span>
                      </div>
                      {asset.marketCap && (
                        <div className="flex justify-between">
                          <span className="text-gray-500">שווי שוק:</span>
                          <span>${asset.marketCap.toLocaleString()}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })()}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Dashboard;
