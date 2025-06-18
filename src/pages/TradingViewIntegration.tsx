
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  Settings, 
  RefreshCw, 
  TrendingUp, 
  Activity,
  Zap
} from 'lucide-react';
import LiveTradingViewChart from '@/components/charts/LiveTradingViewChart';

const TradingViewIntegration = () => {
  const [selectedSymbol, setSelectedSymbol] = useState('BTCUSDT');
  const [isConnected, setIsConnected] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const symbols = [
    'BTCUSDT', 'ETHUSDT', 'SOLUSDT', 'BNBUSDT', 
    'ADAUSDT', 'DOTUSDT', 'LINKUSDT', 'MATICUSDT'
  ];

  const refreshChart = () => {
    setLastUpdate(new Date());
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-right">TradingView Integration</h1>
          <p className="text-muted-foreground text-right">גרפים מתקדמים וניתוח טכני בזמן אמת</p>
        </div>
        <div className="flex gap-2">
          <Badge variant={isConnected ? "default" : "secondary"}>
            <Activity className="h-3 w-3 mr-1" />
            {isConnected ? 'מחובר' : 'מנותק'}
          </Badge>
          <Button variant="outline" onClick={refreshChart}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Chart Controls */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-right">
            <BarChart3 className="h-5 w-5" />
            בקרת גרפים
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Select value={selectedSymbol} onValueChange={setSelectedSymbol}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {symbols.map(symbol => (
                  <SelectItem key={symbol} value={symbol}>
                    {symbol}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              הגדרות גרף
            </Button>
            
            <div className="flex-1 text-right text-sm text-muted-foreground">
              עדכון אחרון: {lastUpdate.toLocaleTimeString('he-IL')}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Chart */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-right">גרף {selectedSymbol}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[600px]">
            <LiveTradingViewChart 
              symbol={selectedSymbol}
              height={600}
            />
          </div>
        </CardContent>
      </Card>

      {/* Integration Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-right">סטטוס חיבור</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <Badge className="bg-green-100 text-green-800">
                <Zap className="h-3 w-3 mr-1" />
                פעיל
              </Badge>
              <div className="text-right">
                <div className="text-lg font-bold">100%</div>
                <div className="text-xs text-muted-foreground">זמינות</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-right">עדכונים בזמן אמת</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <Badge className="bg-blue-100 text-blue-800">
                <TrendingUp className="h-3 w-3 mr-1" />
                פועל
              </Badge>
              <div className="text-right">
                <div className="text-lg font-bold">1s</div>
                <div className="text-xs text-muted-foreground">תדירות עדכון</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-right">איכות נתונים</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <Badge className="bg-green-100 text-green-800">
                <Activity className="h-3 w-3 mr-1" />
                גבוהה
              </Badge>
              <div className="text-right">
                <div className="text-lg font-bold">98%</div>
                <div className="text-xs text-muted-foreground">דיוק</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TradingViewIntegration;
