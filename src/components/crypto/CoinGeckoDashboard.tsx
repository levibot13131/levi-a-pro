
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, ArrowUp, ArrowDown, Info } from 'lucide-react';
import { useCoinGeckoData } from '@/hooks/use-coingecko-data';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { testConnection } from '@/services/crypto/coinGeckoService';
import { toast } from 'sonner';

interface CoinGeckoDashboardProps {
  refreshInterval?: number;
  showDetails?: boolean;
}

const CoinGeckoDashboard: React.FC<CoinGeckoDashboardProps> = ({ 
  refreshInterval = 30000,
  showDetails = true
}) => {
  const [activeTab, setActiveTab] = useState('simple');
  const [isConnectionTesting, setIsConnectionTesting] = useState(false);
  
  const {
    simplePrices,
    marketData,
    isLoading,
    error,
    lastUpdated,
    refreshData,
    isRefreshing
  } = useCoinGeckoData({
    refreshInterval,
    coins: ['bitcoin', 'ethereum', 'solana', 'cardano', 'binancecoin', 'ripple'],
    currencies: ['usd', 'ils']
  });
  
  const handleTestConnection = async () => {
    setIsConnectionTesting(true);
    try {
      const isConnected = await testConnection();
      if (isConnected) {
        toast.success('החיבור ל-CoinGecko תקין');
      } else {
        toast.error('בעיה בחיבור ל-CoinGecko');
      }
    } catch (err) {
      toast.error('שגיאה בבדיקת החיבור');
    } finally {
      setIsConnectionTesting(false);
    }
  };
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('he-IL', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 2
    }).format(value);
  };
  
  const formatPercentage = (value: number) => {
    return `${value > 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  return (
    <Card className="shadow-md">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>מחירי מטבעות קריפטו בזמן אמת</CardTitle>
          <CardDescription>
            נתונים מתעדכנים אוטומטית מ-CoinGecko כל {refreshInterval / 1000} שניות
          </CardDescription>
          {lastUpdated && (
            <p className="text-xs text-muted-foreground mt-1">
              עדכון אחרון: {lastUpdated.toLocaleTimeString()}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleTestConnection} 
            disabled={isConnectionTesting}
          >
            <Info className="h-4 w-4 mr-2" />
            {isConnectionTesting ? 'בודק...' : 'בדוק חיבור'}
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => refreshData()} 
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            רענן נתונים
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {error ? (
          <div className="p-4 text-center bg-red-50 text-red-800 rounded-lg">
            <p>{error}</p>
            <Button 
              variant="secondary" 
              size="sm" 
              onClick={() => refreshData()} 
              className="mt-2"
            >
              נסה שוב
            </Button>
          </div>
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4 w-full">
              <TabsTrigger value="simple">מחירים בסיסיים</TabsTrigger>
              <TabsTrigger value="market">נתוני שוק מפורטים</TabsTrigger>
            </TabsList>
            
            <TabsContent value="simple">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {isLoading ? (
                  Array(6).fill(0).map((_, i) => (
                    <Card key={i}>
                      <CardContent className="p-4">
                        <Skeleton className="h-6 w-24 mb-2" />
                        <Skeleton className="h-10 w-full" />
                      </CardContent>
                    </Card>
                  ))
                ) : simplePrices ? (
                  Object.keys(simplePrices).map(coinId => (
                    <Card key={coinId}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-medium capitalize">{coinId}</h3>
                          {simplePrices[coinId].usd_24h_change && (
                            <Badge className={simplePrices[coinId].usd_24h_change > 0 ? 
                              'bg-green-100 text-green-800' : 
                              'bg-red-100 text-red-800'
                            }>
                              <span className="flex items-center">
                                {simplePrices[coinId].usd_24h_change > 0 ? 
                                  <ArrowUp className="h-3 w-3 mr-1" /> : 
                                  <ArrowDown className="h-3 w-3 mr-1" />
                                }
                                {formatPercentage(simplePrices[coinId].usd_24h_change)}
                              </span>
                            </Badge>
                          )}
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">USD:</span>
                            <span className="font-semibold">
                              ${simplePrices[coinId].usd.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">ILS:</span>
                            <span className="font-semibold">
                              ₪{simplePrices[coinId].ils.toLocaleString()}
                            </span>
                          </div>
                          {showDetails && simplePrices[coinId].usd_market_cap && (
                            <div className="flex justify-between text-xs">
                              <span className="text-muted-foreground">שווי שוק:</span>
                              <span>
                                ${(simplePrices[coinId].usd_market_cap / 1e9).toFixed(2)}B
                              </span>
                            </div>
                          )}
                          {showDetails && simplePrices[coinId].usd_24h_vol && (
                            <div className="flex justify-between text-xs">
                              <span className="text-muted-foreground">נפח 24ש:</span>
                              <span>
                                ${(simplePrices[coinId].usd_24h_vol / 1e9).toFixed(2)}B
                              </span>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <p className="col-span-full text-center py-8">אין נתונים זמינים כרגע</p>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="market">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="px-4 py-2 text-right">#</th>
                      <th className="px-4 py-2 text-right">מטבע</th>
                      <th className="px-4 py-2 text-right">מחיר</th>
                      <th className="px-4 py-2 text-right">שינוי 24ש</th>
                      <th className="px-4 py-2 text-right">שווי שוק</th>
                      <th className="px-4 py-2 text-right">נפח 24ש</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoading ? (
                      Array(10).fill(0).map((_, i) => (
                        <tr key={i} className="border-b">
                          <td className="px-4 py-3"><Skeleton className="h-4 w-8" /></td>
                          <td className="px-4 py-3"><Skeleton className="h-4 w-24" /></td>
                          <td className="px-4 py-3"><Skeleton className="h-4 w-20" /></td>
                          <td className="px-4 py-3"><Skeleton className="h-4 w-16" /></td>
                          <td className="px-4 py-3"><Skeleton className="h-4 w-24" /></td>
                          <td className="px-4 py-3"><Skeleton className="h-4 w-20" /></td>
                        </tr>
                      ))
                    ) : marketData && marketData.length > 0 ? (
                      marketData.map((coin) => (
                        <tr key={coin.id} className="border-b hover:bg-muted/50">
                          <td className="px-4 py-3 text-right">{coin.market_cap_rank}</td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex items-center justify-end">
                              <span className="ml-2">{coin.name}</span>
                              {coin.image && (
                                <img 
                                  src={coin.image} 
                                  alt={coin.name} 
                                  className="w-6 h-6 object-contain"
                                />
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-right font-medium">
                            {formatCurrency(coin.current_price)}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <span className={coin.price_change_percentage_24h > 0 ? 
                              'text-green-600' : 'text-red-600'
                            }>
                              {formatPercentage(coin.price_change_percentage_24h)}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right">
                            ${(coin.market_cap / 1e9).toFixed(2)}B
                          </td>
                          <td className="px-4 py-3 text-right">
                            ${(coin.total_volume / 1e9).toFixed(2)}B
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="px-4 py-8 text-center">
                          אין נתוני שוק זמינים כרגע
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
};

export default CoinGeckoDashboard;
