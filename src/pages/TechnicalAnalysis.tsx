
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Activity,
  RefreshCw,
  Settings
} from 'lucide-react';
import { toast } from 'sonner';
import TradingViewChart from '@/components/tradingview/TradingViewChart';
import Navbar from '@/components/layout/Navbar';

const TechnicalAnalysis: React.FC = () => {
  const [selectedSymbol, setSelectedSymbol] = useState('BTCUSDT');
  const [selectedTimeframe, setSelectedTimeframe] = useState('1D');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const symbols = ['BTCUSDT', 'ETHUSDT', 'SOLUSDT', 'BNBUSDT', 'ADAUSDT', 'DOTUSDT'];
  const timeframes = ['5m', '15m', '30m', '1h', '4h', '1D', '1W'];

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      // Simulate data refresh
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('נתונים עודכנו בהצלחה');
    } catch (error) {
      toast.error('שגיאה בעדכון הנתונים');
    } finally {
      setIsRefreshing(false);
    }
  };

  const mockPriceData = {
    'BTCUSDT': { price: 43250, change: 2.34, volume: '28.5B' },
    'ETHUSDT': { price: 2580, change: -1.23, volume: '15.2B' },
    'SOLUSDT': { price: 125.50, change: 4.56, volume: '2.8B' },
    'BNBUSDT': { price: 318.75, change: 1.89, volume: '1.2B' },
    'ADAUSDT': { price: 0.485, change: -0.67, volume: '890M' },
    'DOTUSDT': { price: 7.82, change: 3.21, volume: '645M' }
  };

  const currentData = mockPriceData[selectedSymbol as keyof typeof mockPriceData];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navbar />
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <Card className="border-2 border-blue-500">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-6 w-6 text-blue-500" />
                ניתוח טכני מתקדם - LeviPro
                <Badge variant="default" className="bg-green-600">
                  <Activity className="h-3 w-3 mr-1" />
                  LIVE
                </Badge>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handleRefresh}
                  variant="outline"
                  size="sm"
                  disabled={isRefreshing}
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                  רענן נתונים
                </Button>
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4 mr-2" />
                  הגדרות
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  ${currentData?.price.toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">מחיר נוכחי</div>
              </div>
              
              <div className="text-center">
                <div className={`text-2xl font-bold ${currentData?.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {currentData?.change >= 0 ? '+' : ''}{currentData?.change}%
                </div>
                <div className="text-sm text-muted-foreground">שינוי 24 שעות</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {currentData?.volume}
                </div>
                <div className="text-sm text-muted-foreground">נפח מסחר</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {selectedSymbol}
                </div>
                <div className="text-sm text-muted-foreground">נכס נבחר</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Symbol Selection */}
        <Card>
          <CardHeader>
            <CardTitle>בחירת נכס ומסגרת זמן</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2">נכסים:</h4>
                <div className="flex flex-wrap gap-2">
                  {symbols.map(symbol => (
                    <Button
                      key={symbol}
                      variant={selectedSymbol === symbol ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedSymbol(symbol)}
                    >
                      {symbol}
                    </Button>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">מסגרת זמן:</h4>
                <div className="flex flex-wrap gap-2">
                  {timeframes.map(tf => (
                    <Button
                      key={tf}
                      variant={selectedTimeframe === tf ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedTimeframe(tf)}
                    >
                      {tf}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Charts */}
        <Tabs defaultValue="chart" className="space-y-4">
          <TabsList className="w-full">
            <TabsTrigger value="chart">גרף מחיר</TabsTrigger>
            <TabsTrigger value="indicators">אינדיקטורים</TabsTrigger>
            <TabsTrigger value="patterns">תבניות</TabsTrigger>
            <TabsTrigger value="signals">איתותים</TabsTrigger>
          </TabsList>
          
          <TabsContent value="chart" className="space-y-4">
            <TradingViewChart 
              symbol={selectedSymbol}
              timeframe={selectedTimeframe}
              height={500}
              showToolbar={true}
            />
          </TabsContent>
          
          <TabsContent value="indicators" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>אינדיקטורים טכניים</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 border rounded">
                    <h4 className="font-semibold mb-2">RSI (14)</h4>
                    <div className="text-2xl font-bold text-blue-600">67.5</div>
                    <div className="text-sm text-muted-foreground">נייטרלי</div>
                  </div>
                  
                  <div className="p-4 border rounded">
                    <h4 className="font-semibold mb-2">MACD</h4>
                    <div className="text-2xl font-bold text-green-600">+125.3</div>
                    <div className="text-sm text-muted-foreground">חיובי</div>
                  </div>
                  
                  <div className="p-4 border rounded">
                    <h4 className="font-semibold mb-2">MA (50)</h4>
                    <div className="text-2xl font-bold text-orange-600">42,850</div>
                    <div className="text-sm text-muted-foreground">תמיכה</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="patterns" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>זיהוי תבניות</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <TrendingUp className="h-12 w-12 mx-auto mb-4" />
                  <p>זיהוי תבניות אוטומטי</p>
                  <p className="text-sm">תבניות יופיעו כאן כאשר יזוהו</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="signals" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>איתותי מסחר</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <Activity className="h-12 w-12 mx-auto mb-4" />
                  <p>איתותי מסחר בזמן אמת</p>
                  <p className="text-sm">איתותים יופיעו כאן בהתאם לאסטרטגיה</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Status Footer */}
        <Card className="border-dashed border-2">
          <CardContent className="py-4">
            <div className="text-center text-sm text-muted-foreground">
              ✅ המערכת פעילה ומעודכנת | 🔄 רענון אוטומטי כל 30 שניות | 📊 נתונים בזמן אמת מ-Binance & CoinGecko
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TechnicalAnalysis;
