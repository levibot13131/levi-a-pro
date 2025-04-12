
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchCoinMarketCapData, fetchTrendingCoins, CoinMarketCapData } from '@/services/crypto/coinMarketCapService';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Flame, Search, TrendingUp, RefreshCw, Info, Star, BarChart2 } from 'lucide-react';
import { useBinanceConnection } from '@/hooks/use-binance-connection';
import { useBinanceData } from '@/hooks/use-binance-data';
import { toast } from 'sonner';

const TrendingCoins = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCoin, setSelectedCoin] = useState<CoinMarketCapData | null>(null);
  const { isConnected: isBinanceConnected } = useBinanceConnection();
  
  // שליפת כל המטבעות
  const { 
    data: allCoins = [], 
    isLoading: allCoinsLoading,
    refetch: refetchAllCoins
  } = useQuery({
    queryKey: ['coinMarketCap', 'all'],
    queryFn: () => fetchCoinMarketCapData(50),
    refetchInterval: 60000, // רענון כל דקה
  });
  
  // שליפת מטבעות חמים
  const { 
    data: trendingCoins = [],
    isLoading: trendingCoinsLoading,
    refetch: refetchTrendingCoins
  } = useQuery({
    queryKey: ['coinMarketCap', 'trending'],
    queryFn: () => fetchTrendingCoins(10),
    refetchInterval: 30000, // רענון כל 30 שניות
  });
  
  // שימוש ב-Binance API לקבלת נתונים בזמן אמת
  const binanceSymbols = allCoins
    .filter(coin => coin.availableOnBinance)
    .map(coin => `${coin.symbol}USDT`)
    .slice(0, 10); // הגבלה ל-10 מטבעות לביצועים טובים יותר

  const { 
    marketData: binanceMarketData,
    fundamentalData: binanceFundamentalData,
    isLoading: binanceDataLoading 
  } = useBinanceData(isBinanceConnected ? binanceSymbols : []);
  
  // רענון הנתונים באופן ידני
  const handleRefresh = () => {
    refetchAllCoins();
    refetchTrendingCoins();
    toast.success('נתוני המטבעות מתרעננים...');
  };
  
  // סינון לפי חיפוש
  const filteredCoins = React.useMemo(() => {
    if (!searchTerm.trim()) return allCoins;
    
    const term = searchTerm.toLowerCase().trim();
    return allCoins.filter(coin => 
      coin.name.toLowerCase().includes(term) || 
      coin.symbol.toLowerCase().includes(term)
    );
  }, [allCoins, searchTerm]);

  // בחירת מטבע להצגת פרטים נוספים
  const handleSelectCoin = (coin: CoinMarketCapData) => {
    setSelectedCoin(coin);
  };
  
  // פונקציות עזר לעיצוב
  const formatNumber = (num: number, decimals: number = 2) => {
    return num.toLocaleString(undefined, { maximumFractionDigits: decimals });
  };
  
  const formatPrice = (price: number) => {
    if (price < 0.01) return `$${price.toFixed(6)}`;
    if (price < 1) return `$${price.toFixed(4)}`;
    if (price < 1000) return `$${price.toFixed(2)}`;
    return `$${formatNumber(price, 2)}`;
  };
  
  const formatMarketCap = (marketCap: number) => {
    if (marketCap >= 1000000000) return `$${(marketCap / 1000000000).toFixed(2)}B`;
    if (marketCap >= 1000000) return `$${(marketCap / 1000000).toFixed(2)}M`;
    return `$${(marketCap / 1000).toFixed(2)}K`;
  };
  
  const formatPercentage = (percent: number) => {
    const formatted = percent.toFixed(2);
    const isPositive = percent >= 0;
    
    return (
      <span className={isPositive ? 'text-green-500' : 'text-red-500'}>
        {isPositive ? '+' : ''}{formatted}%
      </span>
    );
  };
  
  // בדיקה אם יש נתוני בינאנס למטבע
  const getBinanceData = (symbol: string) => {
    const binanceSymbol = `${symbol}USDT`;
    return binanceMarketData[binanceSymbol];
  };
  
  return (
    <div className="container py-6">
      <div className="flex flex-col gap-2 md:flex-row md:justify-between md:items-center mb-6">
        <h1 className="text-3xl font-bold tracking-tight">מטבעות קריפטו חמים</h1>
        
        <div className="flex items-center space-x-2 space-x-reverse flex-row-reverse">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh}
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            רענן נתונים
          </Button>
          
          {isBinanceConnected && (
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              Binance מחובר
            </Badge>
          )}
        </div>
      </div>
      
      {/* חיפוש */}
      <div className="my-4">
        <div className="relative">
          <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="חפש מטבעות לפי שם או סמל..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-4 pr-10 text-right"
          />
        </div>
      </div>
      
      {/* פרטי מטבע נבחר */}
      {selectedCoin && (
        <Card className="mb-6">
          <CardHeader>
            <div className="flex justify-between items-start">
              <Badge variant={selectedCoin.trending ? "default" : "outline"} className={selectedCoin.trending ? "bg-orange-500 hover:bg-orange-600" : ""}>
                {selectedCoin.trending ? (
                  <><Flame className="h-3.5 w-3.5 mr-1" />חם</>
                ) : (
                  `דירוג #${selectedCoin.rank}`
                )}
              </Badge>
              <CardTitle className="text-right flex items-center gap-2">
                {selectedCoin.name} ({selectedCoin.symbol})
              </CardTitle>
            </div>
            <CardDescription className="text-right">
              נתונים מקיפים ומידע בזמן אמת
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="py-3">
                  <CardTitle className="text-center text-base">מחיר נוכחי</CardTitle>
                </CardHeader>
                <CardContent className="text-center py-2">
                  <div className="text-3xl font-bold">{formatPrice(selectedCoin.price)}</div>
                  <div className="mt-2">
                    {formatPercentage(selectedCoin.change24h)} (24ש')
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="py-3">
                  <CardTitle className="text-center text-base">שווי שוק</CardTitle>
                </CardHeader>
                <CardContent className="text-center py-2">
                  <div className="text-3xl font-bold">{formatMarketCap(selectedCoin.marketCap)}</div>
                  <div className="text-sm text-muted-foreground mt-2">
                    דירוג: #{selectedCoin.rank}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="py-3">
                  <CardTitle className="text-center text-base">מחזור מסחר 24ש'</CardTitle>
                </CardHeader>
                <CardContent className="text-center py-2">
                  <div className="text-3xl font-bold">{formatMarketCap(selectedCoin.volume24h)}</div>
                  <div className="text-sm text-muted-foreground mt-2">
                    עדכון אחרון: {new Date(selectedCoin.lastUpdated).toLocaleTimeString('he-IL')}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* נתוני בינאנס בזמן אמת */}
            {isBinanceConnected && getBinanceData(selectedCoin.symbol) && (
              <div className="mt-6 bg-muted/40 p-4 rounded-md">
                <h3 className="text-lg font-medium mb-4 text-right flex items-center justify-end gap-2">
                  <span>נתוני בינאנס בזמן אמת</span>
                  <TrendingUp className="h-5 w-5 text-green-500" />
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-card border rounded-md p-4">
                    <div className="text-right text-sm font-medium mb-1">נתוני שוק</div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>מחיר:</span>
                        <span className="font-medium">
                          ${getBinanceData(selectedCoin.symbol)?.price.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>שינוי 24ש':</span>
                        <span>
                          {formatPercentage(getBinanceData(selectedCoin.symbol)?.change24h || 0)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>נפח מסחר:</span>
                        <span>${formatNumber(getBinanceData(selectedCoin.symbol)?.volume || 0)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-card border rounded-md p-4">
                    <div className="text-right text-sm font-medium mb-1">נתונים פונדמנטליים</div>
                    <div className="space-y-2">
                      {binanceFundamentalData[`${selectedCoin.symbol}USDT`] ? (
                        <>
                          <div className="flex justify-between">
                            <span>מדד פונדמנטלי:</span>
                            <span className="font-medium">
                              {binanceFundamentalData[`${selectedCoin.symbol}USDT`]?.fundamentalScore.toFixed(1)}/100
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>אזכורים חברתיים:</span>
                            <span>
                              {binanceFundamentalData[`${selectedCoin.symbol}USDT`]?.socialMentions24h.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>סנטימנט שוק:</span>
                            <span className={
                              binanceFundamentalData[`${selectedCoin.symbol}USDT`]?.sentiment === 'bullish' 
                                ? 'text-green-500' 
                                : binanceFundamentalData[`${selectedCoin.symbol}USDT`]?.sentiment === 'bearish' 
                                  ? 'text-red-500' 
                                  : 'text-yellow-500'
                            }>
                              {binanceFundamentalData[`${selectedCoin.symbol}USDT`]?.sentiment === 'bullish' 
                                ? 'חיובי' 
                                : binanceFundamentalData[`${selectedCoin.symbol}USDT`]?.sentiment === 'bearish' 
                                  ? 'שלילי' 
                                  : 'נייטרלי'}
                            </span>
                          </div>
                        </>
                      ) : (
                        <div className="flex justify-center items-center h-20 text-sm text-muted-foreground">
                          טוען נתונים פונדמנטליים...
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div className="flex justify-center mt-6">
              <Button variant="outline" onClick={() => setSelectedCoin(null)}>
                חזרה לרשימה
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* טאבים לתצוגת מטבעות */}
      <Tabs defaultValue="trending">
        <TabsList className="w-full md:w-[400px]">
          <TabsTrigger value="trending" className="flex items-center gap-2">
            <Flame className="h-4 w-4" />
            מטבעות חמים
          </TabsTrigger>
          <TabsTrigger value="all" className="flex items-center gap-2">
            <BarChart2 className="h-4 w-4" />
            כל המטבעות
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="trending">
          <Card>
            <CardContent className="pt-6">
              {trendingCoinsLoading ? (
                <div className="space-y-2">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex justify-between items-center py-2">
                      <Skeleton className="h-6 w-[100px]" />
                      <Skeleton className="h-6 w-[120px]" />
                      <Skeleton className="h-6 w-[80px]" />
                    </div>
                  ))}
                </div>
              ) : trendingCoins.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right">דירוג</TableHead>
                      <TableHead className="text-right">שם</TableHead>
                      <TableHead className="text-right">מחיר</TableHead>
                      <TableHead className="text-right">שינוי 24ש'</TableHead>
                      <TableHead className="text-right">שווי שוק</TableHead>
                      <TableHead className="text-right">נתונים נוספים</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {trendingCoins.map(coin => (
                      <TableRow key={coin.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="bg-orange-100 text-orange-800 border-orange-200">
                              <Flame className="h-3 w-3 mr-1" />
                              {coin.rank}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{coin.name} ({coin.symbol})</TableCell>
                        <TableCell>{formatPrice(coin.price)}</TableCell>
                        <TableCell>{formatPercentage(coin.change24h)}</TableCell>
                        <TableCell>{formatMarketCap(coin.marketCap)}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm" onClick={() => handleSelectCoin(coin)}>
                            <Info className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-12">
                  <TrendingUp className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
                  <h3 className="text-lg font-medium mb-1">אין מטבעות חמים כרגע</h3>
                  <p className="text-muted-foreground mb-4">
                    נסה לרענן את הנתונים
                  </p>
                  <Button variant="outline" onClick={handleRefresh}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    רענן נתונים
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="all">
          <Card>
            <CardContent className="pt-6">
              {allCoinsLoading ? (
                <div className="space-y-2">
                  {[...Array(10)].map((_, i) => (
                    <div key={i} className="flex justify-between items-center py-2">
                      <Skeleton className="h-6 w-[60px]" />
                      <Skeleton className="h-6 w-[120px]" />
                      <Skeleton className="h-6 w-[80px]" />
                      <Skeleton className="h-6 w-[80px]" />
                      <Skeleton className="h-6 w-[80px]" />
                    </div>
                  ))}
                </div>
              ) : filteredCoins.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right">דירוג</TableHead>
                      <TableHead className="text-right">שם</TableHead>
                      <TableHead className="text-right">מחיר</TableHead>
                      <TableHead className="text-right">שינוי 24ש'</TableHead>
                      <TableHead className="text-right">שווי שוק</TableHead>
                      <TableHead className="text-right">נפח מסחר 24ש'</TableHead>
                      <TableHead className="text-right">נתונים נוספים</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCoins.map(coin => (
                      <TableRow key={coin.id}>
                        <TableCell className="font-medium">
                          {coin.trending ? (
                            <Badge className="bg-orange-500">
                              <Flame className="h-3 w-3 mr-1" />
                              {coin.rank}
                            </Badge>
                          ) : (
                            <span>{coin.rank}</span>
                          )}
                        </TableCell>
                        <TableCell className="font-medium">{coin.name} ({coin.symbol})</TableCell>
                        <TableCell>{formatPrice(coin.price)}</TableCell>
                        <TableCell>{formatPercentage(coin.change24h)}</TableCell>
                        <TableCell>{formatMarketCap(coin.marketCap)}</TableCell>
                        <TableCell>{formatMarketCap(coin.volume24h)}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm" onClick={() => handleSelectCoin(coin)}>
                            <Info className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-12">
                  <Search className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
                  <h3 className="text-lg font-medium mb-1">לא נמצאו תוצאות</h3>
                  <p className="text-muted-foreground mb-4">
                    נסה לחפש מחדש עם מונחים אחרים
                  </p>
                  <Button variant="outline" onClick={() => setSearchTerm('')}>
                    נקה חיפוש
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TrendingCoins;
