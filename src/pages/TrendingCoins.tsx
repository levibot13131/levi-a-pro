
import React, { useEffect, useState } from 'react';
import { Container } from '@/components/ui/container';
import { useBinanceData } from '@/hooks/use-binance-data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowUpRight, ArrowDownRight, Sparkles } from 'lucide-react';

const trendingCoins = ['BTCUSDT', 'ETHUSDT', 'SOLUSDT', 'DOGEUSDT', 'ADAUSDT'];

const TrendingCoins: React.FC = () => {
  const [sortedCoins, setSortedCoins] = useState<string[]>([]);
  const { marketData, isLoading } = useBinanceData(trendingCoins);

  useEffect(() => {
    // Sort coins by performance
    if (marketData) {
      const sorted = [...trendingCoins].sort((a, b) => {
        const aData = marketData[a];
        const bData = marketData[b];
        
        if (!aData || !bData) return 0;
        return bData.change24h - aData.change24h;
      });
      setSortedCoins(sorted);
    }
  }, [marketData]);

  return (
    <Container className="py-6">
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
        <Sparkles className="h-8 w-8 text-yellow-400" />
        מטבעות מובילים
      </h1>

      {isLoading ? (
        <div>טוען נתונים...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedCoins.map(symbol => {
            const data = marketData[symbol];
            const isPositive = data?.change24h && data.change24h > 0;
            
            return (
              <Card key={symbol}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <Badge variant="outline">{symbol.replace('USDT', '')}</Badge>
                    <CardTitle>{data?.name || symbol.replace('USDT', '')}</CardTitle>
                  </div>
                  <CardDescription className="text-right">
                    מחיר נוכחי ומגמות
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div className="text-2xl font-bold">
                      ${data?.price ? data.price.toLocaleString(undefined, {maximumFractionDigits: 2}) : 'N/A'}
                    </div>
                    <div className={`flex items-center ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                      {isPositive ? (
                        <ArrowUpRight className="h-5 w-5" />
                      ) : (
                        <ArrowDownRight className="h-5 w-5" />
                      )}
                      <span className="font-medium">
                        {data?.change24h ? `${Math.abs(data.change24h).toFixed(2)}%` : 'N/A'}
                      </span>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-between text-sm text-muted-foreground">
                    <div>נפח 24 שעות:</div>
                    <div>${data?.volume24h ? (data.volume24h / 1000000).toFixed(2) + 'M' : 'N/A'}</div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </Container>
  );
};

export default TrendingCoins;
