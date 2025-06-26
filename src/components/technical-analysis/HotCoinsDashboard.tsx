
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  RefreshCw, 
  TrendingUp, 
  TrendingDown, 
  Activity,
  Eye,
  AlertTriangle
} from 'lucide-react';
import LiveTradingChart from '@/components/charts/LiveTradingChart';
import { binanceSocket } from '@/services/binance/binanceSocket';
import { fundamentalsIngestion } from '@/services/fundamentals/fundamentalsIngestion';
import { EnhancedTimeframeAI } from '@/services/ai/enhancedTimeframeAI';

interface HotCoin {
  symbol: string;
  price: number;
  change24h: number;
  volume24h: number;
  volumeChange: number;
  socialMentions: number;
  heatScore: number;
  lastSignalAttempt?: Date;
  rejectionReason?: string;
}

interface RejectionBadge {
  type: 'heat' | 'confidence' | 'riskReward' | 'volume' | 'sentiment';
  reason: string;
  value: number;
  threshold: number;
  severity: 'low' | 'medium' | 'high';
}

const HotCoinsDashboard: React.FC = () => {
  const [hotCoins, setHotCoins] = useState<HotCoin[]>([]);
  const [selectedSymbol, setSelectedSymbol] = useState<string>('BTCUSDT');
  const [rejectionBadges, setRejectionBadges] = useState<RejectionBadge[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  // Mock hot coins data
  useEffect(() => {
    loadHotCoins();
    startFundamentalsIngestion();
    
    const interval = setInterval(() => {
      loadHotCoins();
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  const loadHotCoins = async () => {
    console.log('🔥 Loading hot coins data...');
    
    const mockCoins: HotCoin[] = [
      {
        symbol: 'BTCUSDT',
        price: 67250,
        change24h: 2.34,
        volume24h: 1500000000,
        volumeChange: 15.6,
        socialMentions: 1250,
        heatScore: 85,
        lastSignalAttempt: new Date(Date.now() - 10 * 60 * 1000),
        rejectionReason: 'R/R Below Threshold'
      },
      {
        symbol: 'ETHUSDT',
        price: 2650,
        change24h: 1.89,
        volume24h: 890000000,
        volumeChange: 22.3,
        socialMentions: 980,
        heatScore: 78
      },
      {
        symbol: 'SOLUSDT',
        price: 125.40,
        change24h: 4.56,
        volume24h: 340000000,
        volumeChange: 45.2,
        socialMentions: 456,
        heatScore: 92
      },
      {
        symbol: 'BNBUSDT',
        price: 315.80,
        change24h: -1.23,
        volume24h: 180000000,
        volumeChange: -8.4,
        socialMentions: 234,
        heatScore: 45
      },
      {
        symbol: 'ADAUSDT',
        price: 0.52,
        change24h: 3.21,
        volume24h: 120000000,
        volumeChange: 18.7,
        socialMentions: 345,
        heatScore: 67
      }
    ];

    setHotCoins(mockCoins);
    setLastUpdate(new Date());

    // Generate mock rejection badges for selected symbol
    if (selectedSymbol === 'BTCUSDT') {
      setRejectionBadges([
        {
          type: 'heat',
          reason: 'Market Heat',
          value: 85,
          threshold: 70,
          severity: 'high'
        },
        {
          type: 'riskReward',
          reason: 'R/R Ratio',
          value: 1.1,
          threshold: 1.3,
          severity: 'medium'
        },
        {
          type: 'confidence',
          reason: 'AI Confidence',
          value: 68,
          threshold: 70,
          severity: 'low'
        }
      ]);
    } else {
      setRejectionBadges([]);
    }
  };

  const startFundamentalsIngestion = () => {
    if (!fundamentalsIngestion.getIngestionStatus().isRunning) {
      fundamentalsIngestion.start();
      console.log('📰 Started fundamentals ingestion service');
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadHotCoins();
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const getHeatScoreColor = (score: number) => {
    if (score >= 80) return 'text-red-600';
    if (score >= 60) return 'text-orange-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getHeatScoreBg = (score: number) => {
    if (score >= 80) return 'bg-red-100';
    if (score >= 60) return 'bg-orange-100';
    if (score >= 40) return 'bg-yellow-100';
    return 'bg-green-100';
  };

  const sortedCoins = hotCoins.sort((a, b) => {
    // Sort by heat score and volume change
    const aScore = a.heatScore + (a.volumeChange * 0.1);
    const bScore = b.heatScore + (b.volumeChange * 0.1);
    return bScore - aScore;
  });

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-right">לוח מטבעות חמים</h1>
          <p className="text-muted-foreground text-right">ניתוח בזמן אמת של הזדמנויות טריידינג</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline">
            עדכון אחרון: {lastUpdate.toLocaleTimeString()}
          </Badge>
          <Button onClick={handleRefresh} disabled={isRefreshing} size="sm">
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Watchlist Table */}
        <Card className="xl:col-span-1">
          <CardHeader>
            <CardTitle className="text-right">רשימת צפייה - TOP 20</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {sortedCoins.map((coin, index) => (
                <div
                  key={coin.symbol}
                  className={`p-3 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
                    selectedSymbol === coin.symbol ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                  } ${index === 0 ? 'border-green-400 bg-green-50' : ''}`}
                  onClick={() => setSelectedSymbol(coin.symbol)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="text-right">
                      <div className="font-semibold">{coin.symbol.replace('USDT', '')}</div>
                      <div className="text-sm text-gray-500">${coin.price.toLocaleString()}</div>
                    </div>
                    <div className="text-left">
                      <Badge className={`${getHeatScoreBg(coin.heatScore)} ${getHeatScoreColor(coin.heatScore)} border-0`}>
                        🔥 {coin.heatScore}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="text-right">
                      <div className={coin.change24h >= 0 ? 'text-green-600' : 'text-red-600'}>
                        {coin.change24h >= 0 ? '+' : ''}{coin.change24h.toFixed(2)}%
                      </div>
                      <div className="text-gray-500">24שע</div>
                    </div>
                    <div className="text-right">
                      <div className={coin.volumeChange >= 0 ? 'text-green-600' : 'text-red-600'}>
                        {coin.volumeChange >= 0 ? '+' : ''}{coin.volumeChange.toFixed(1)}%
                      </div>
                      <div className="text-gray-500">נפח</div>
                    </div>
                  </div>

                  {coin.lastSignalAttempt && (
                    <div className="mt-2 pt-2 border-t">
                      <div className="flex items-center justify-between text-xs">
                        <Badge variant="outline" className="text-xs">
                          <Eye className="h-3 w-3 mr-1" />
                          {coin.rejectionReason}
                        </Badge>
                        <span className="text-gray-500">
                          {Math.floor((Date.now() - coin.lastSignalAttempt.getTime()) / 60000)}ד' אחרון
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Main Chart */}
        <div className="xl:col-span-2">
          <LiveTradingChart
            symbol={selectedSymbol}
            height={600}
            showOverlays={true}
            rejectionBadges={rejectionBadges}
            tradingOverlay={selectedSymbol === 'BTCUSDT' ? {
              entry: 66800,
              target: 69500,
              stopLoss: 65200,
              profitPercent: 0.67,
              isActive: true
            } : undefined}
          />
        </div>
      </div>

      {/* Statistics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="text-right">
                <div className="text-2xl font-bold text-green-600">3</div>
                <div className="text-sm text-gray-600">איתותים פעילים</div>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600">12</div>
                <div className="text-sm text-gray-600">ניתוחים 24שע</div>
              </div>
              <Activity className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="text-right">
                <div className="text-2xl font-bold text-red-600">8</div>
                <div className="text-sm text-gray-600">דחיות באיכות</div>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="text-right">
                <div className="text-2xl font-bold text-purple-600">75%</div>
                <div className="text-sm text-gray-600">דיוק מערכת</div>
              </div>
              <Eye className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HotCoinsDashboard;
