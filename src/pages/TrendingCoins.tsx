
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useBinanceData } from '@/hooks/use-binance-data';
import { useTrendingCoins } from '@/hooks/use-trending-coins';

export interface BinanceFundamentalData {
  symbol: string;
  marketCap: number;
  circulatingSupply: number;
  totalSupply: number;
  maxSupply?: number;
  launchDate?: string;
  website?: string;
  allTimeHigh?: number;
  allTimeHighDate?: string;
  fundamentalScore?: number;
  socialMentions24h?: number;
  sentiment?: number;
}

const TrendingCoins = () => {
  const [selectedCoin, setSelectedCoin] = useState<string | null>(null);
  const { marketData, fundamentalData, isLoading } = useBinanceData(['BTCUSDT', 'ETHUSDT', 'SOLUSDT']);
  const { startRealTimeUpdates, stopRealTimeUpdates, isRealTimeActive } = useTrendingCoins();
  
  // Sort coins by market cap
  const sortedCoins = Object.entries(marketData || {})
    .sort(([, a], [, b]) => (b.price || 0) - (a.price || 0))
    .map(([symbol]) => symbol);
  
  // Format number with commas
  const formatNumber = (num: number, decimals = 2) => {
    return num.toLocaleString(undefined, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    });
  };
  
  // Get sentiment color
  const getSentimentColor = (sentiment: number) => {
    if (sentiment >= 0.7) return "text-green-500";
    if (sentiment >= 0.4) return "text-yellow-500";
    return "text-red-500";
  };
  
  // Render fundamentals card
  const renderFundamentalsCard = (symbol: string, data: BinanceFundamentalData) => {
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-center">מדדים פונדמנטליים - {symbol.replace('USDT', '')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Market Cap */}
            <div className="bg-card p-3 border rounded-lg">
              <div className="text-sm text-muted-foreground">שווי שוק</div>
              <div className="text-lg font-bold">${(data.marketCap / 1000000000).toFixed(2)}B</div>
            </div>
            
            {/* Circulating Supply */}
            <div className="bg-card p-3 border rounded-lg">
              <div className="text-sm text-muted-foreground">כמות במחזור</div>
              <div className="text-lg font-bold">{formatNumber(data.circulatingSupply, 0)}</div>
            </div>
            
            {/* Total Supply */}
            <div className="bg-card p-3 border rounded-lg">
              <div className="text-sm text-muted-foreground">כמות כוללת</div>
              <div className="text-lg font-bold">{formatNumber(data.totalSupply, 0)}</div>
            </div>
            
            {/* Max Supply */}
            <div className="bg-card p-3 border rounded-lg">
              <div className="text-sm text-muted-foreground">כמות מקסימלית</div>
              <div className="text-lg font-bold">{data.maxSupply ? formatNumber(data.maxSupply, 0) : 'ללא הגבלה'}</div>
            </div>
            
            {/* Fundamental Score */}
            <div className="bg-card p-3 border rounded-lg">
              <div className="text-sm text-muted-foreground">ציון פונדמנטלי</div>
              <div className="text-lg font-bold">{data.fundamentalScore}/100</div>
            </div>
            
            {/* Social Mentions */}
            <div className="bg-card p-3 border rounded-lg">
              <div className="text-sm text-muted-foreground">אזכורים ברשתות</div>
              <div className="text-lg font-bold">{data.socialMentions24h} ב-24 שעות</div>
            </div>
            
            {/* Sentiment */}
            <div className="bg-card p-3 border rounded-lg">
              <div className="text-sm text-muted-foreground">סנטימנט (שלילי-חיובי)</div>
              <div className={`text-lg font-bold ${getSentimentColor(data.sentiment || 0)}`}>
                {(data.sentiment || 0) >= 0.7 ? 'חיובי מאוד' : 
                 (data.sentiment || 0) >= 0.5 ? 'חיובי' :
                 (data.sentiment || 0) >= 0.4 ? 'ניטרלי' : 
                 (data.sentiment || 0) >= 0.3 ? 'שלילי' : 'שלילי מאוד'}
              </div>
            </div>
            
            {/* All-Time High */}
            <div className="bg-card p-3 border rounded-lg">
              <div className="text-sm text-muted-foreground">שיא כל הזמנים</div>
              <div className="text-lg font-bold">${formatNumber(data.allTimeHigh || 0)}</div>
              <div className="text-xs text-muted-foreground">{data.allTimeHighDate}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };
  
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">מטבעות מובילים</h1>
      
      <div className="flex justify-center mb-6">
        <div className="space-x-2">
          {isRealTimeActive ? (
            <button 
              className="px-4 py-2 bg-red-500 text-white rounded-md"
              onClick={stopRealTimeUpdates}
            >
              הפסק עדכון בזמן אמת
            </button>
          ) : (
            <button 
              className="px-4 py-2 bg-blue-500 text-white rounded-md"
              onClick={startRealTimeUpdates}
            >
              הפעל עדכון בזמן אמת
            </button>
          )}
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center">
          <div className="spinner" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {sortedCoins.map(symbol => {
              const coin = marketData?.[symbol] || { price: 0, change24h: 0, high24h: 0, low24h: 0, volume24h: 0, lastUpdated: Date.now() };
              return (
                <Card 
                  key={symbol}
                  className={`cursor-pointer hover:border-primary transition-colors ${selectedCoin === symbol ? 'border-primary border-2' : ''}`}
                  onClick={() => setSelectedCoin(symbol)}
                >
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <Badge variant={coin.change24h >= 0 ? "default" : "destructive"}>
                        {coin.change24h >= 0 ? '+' : ''}{coin.change24h.toFixed(2)}%
                      </Badge>
                      <CardTitle>{symbol.replace('USDT', '')}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-right mb-2">
                      ${formatNumber(coin.price)}
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">נפח 24ש:</span>
                        <span className="font-medium float-right">
                          ${(coin.volume24h / 1000000).toFixed(2)}M
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">שיא 24ש:</span>
                        <span className="font-medium float-right">
                          ${formatNumber(coin.high24h)}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">שפל 24ש:</span>
                        <span className="font-medium float-right">
                          ${formatNumber(coin.low24h)}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">עדכון אחרון:</span>
                        <span className="font-medium float-right">
                          {new Date(coin.lastUpdated).toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          
          {selectedCoin && fundamentalData[selectedCoin] && (
            renderFundamentalsCard(selectedCoin, fundamentalData[selectedCoin] as BinanceFundamentalData)
          )}
        </>
      )}
    </div>
  );
};

export default TrendingCoins;
