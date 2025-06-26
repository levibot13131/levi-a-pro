
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, RefreshCw, Activity } from 'lucide-react';
import { liveMarketDataService } from '@/services/trading/liveMarketDataService';

interface HotCoin {
  symbol: string;
  price: number;
  change24h: number;
  volume24h: number;
  heatScore: number;
  signals: number;
  lastSignal?: string;
  pnl?: number;
}

export const HotCoinsDashboard: React.FC = () => {
  const [hotCoins, setHotCoins] = useState<HotCoin[]>([]);
  const [selectedSymbol, setSelectedSymbol] = useState<string>('BTCUSDT');
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const SYMBOLS = ['BTCUSDT', 'ETHUSDT', 'SOLUSDT', 'BNBUSDT', 'ADAUSDT', 'DOTUSDT', 'AVAXUSDT', 'MATICUSDT'];

  useEffect(() => {
    loadHotCoins();
    const interval = setInterval(loadHotCoins, 60000); // Update every 60s
    return () => clearInterval(interval);
  }, []);

  const loadHotCoins = async () => {
    try {
      console.log('🔥 Loading hot coins data...');
      const marketDataMap = await liveMarketDataService.getMultipleAssets(SYMBOLS);
      
      const coins: HotCoin[] = [];
      for (const [symbol, data] of marketDataMap) {
        const heatScore = Math.abs(data.change24h) * 2 + (data.volume24h / 1000000000) * 10;
        
        coins.push({
          symbol,
          price: data.price,
          change24h: data.change24h,
          volume24h: data.volume24h,
          heatScore: Math.min(100, heatScore),
          signals: Math.floor(Math.random() * 5), // Mock for now
          pnl: (Math.random() - 0.5) * 10 // Mock P/L
        });
      }

      // Sort by heat score descending
      coins.sort((a, b) => b.heatScore - a.heatScore);
      setHotCoins(coins);
      setLastUpdate(new Date());
      setLoading(false);
      
      console.log(`🔥 Hot coins updated: ${coins.length} symbols`);
    } catch (error) {
      console.error('❌ Failed to load hot coins:', error);
      setLoading(false);
    }
  };

  const getHeatColor = (score: number) => {
    if (score >= 80) return 'bg-red-500';
    if (score >= 60) return 'bg-orange-500';
    if (score >= 40) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getPnLColor = (pnl?: number) => {
    if (!pnl) return 'text-gray-500';
    return pnl > 0 ? 'text-green-600' : 'text-red-600';
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">🔥 דשבורד מטבעות חמים</h1>
        <div className="flex items-center gap-2">
          <Badge variant="outline">
            עדכון אחרון: {lastUpdate.toLocaleTimeString('he-IL')}
          </Badge>
          <Button onClick={loadHotCoins} disabled={loading} size="sm">
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Hot Coins Table */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              רשימת מעקב - מטבעות פעילים
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {hotCoins.map((coin, index) => (
                <div
                  key={coin.symbol}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedSymbol === coin.symbol ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedSymbol(coin.symbol)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Badge className="text-xs">#{index + 1}</Badge>
                      <div>
                        <div className="font-semibold">{coin.symbol}</div>
                        <div className="text-sm text-gray-500">
                          ${coin.price.toLocaleString()}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <div className={`flex items-center gap-1 ${coin.change24h >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {coin.change24h >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                          {Math.abs(coin.change24h).toFixed(2)}%
                        </div>
                        <div className="text-xs text-gray-500">24ש</div>
                      </div>
                      
                      <div className="text-center">
                        <Badge className={`${getHeatColor(coin.heatScore)} text-white text-xs`}>
                          {coin.heatScore.toFixed(0)}
                        </Badge>
                        <div className="text-xs text-gray-500">חום</div>
                      </div>
                      
                      <div className="text-center">
                        <div className={getPnLColor(coin.pnl)}>
                          {coin.pnl ? `${coin.pnl > 0 ? '+' : ''}${coin.pnl.toFixed(1)}%` : '--'}
                        </div>
                        <div className="text-xs text-gray-500">P/L</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* TradingView Chart & Signal Info */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>גרף זמן אמת - {selectedSymbol}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-gray-100 rounded flex items-center justify-center">
                <div className="text-center">
                  <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm text-gray-500">
                    TradingView Chart<br />
                    {selectedSymbol}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>מידע איתות אחרון</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>כניסה:</span>
                  <span className="font-mono">$67,250</span>
                </div>
                <div className="flex justify-between">
                  <span>יעד:</span>
                  <span className="font-mono text-green-600">$69,500</span>
                </div>
                <div className="flex justify-between">
                  <span>סטופ:</span>
                  <span className="font-mono text-red-600">$65,800</span>
                </div>
                <div className="flex justify-between">
                  <span>P/L נוכחי:</span>
                  <span className="font-mono text-green-600">+2.1%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>סיבות דחייה</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Badge variant="outline" className="mr-2">חום גבוה</Badge>
                <Badge variant="outline" className="mr-2">R/R נמוך</Badge>
                <Badge variant="outline" className="mr-2">ביטחון נמוך</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
