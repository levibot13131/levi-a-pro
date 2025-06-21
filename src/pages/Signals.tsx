
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, TrendingDown, Activity, Zap, Clock, Target, Shield } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface Signal {
  id: string;
  symbol: string;
  action: 'buy' | 'sell';
  price: number;
  targetPrice: number;
  stopLoss: number;
  confidence: number;
  strategy: string;
  timestamp: number;
  status: 'active' | 'filled' | 'cancelled';
  telegramSent: boolean;
}

const Signals: React.FC = () => {
  const { user, isAdmin } = useAuth();
  const [signals, setSignals] = useState<Signal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('active');

  // Mock signals for demo - in production this would come from Supabase
  useEffect(() => {
    const mockSignals: Signal[] = [
      {
        id: '1',
        symbol: 'BTCUSDT',
        action: 'buy',
        price: 43250.00,
        targetPrice: 44500.00,
        stopLoss: 42000.00,
        confidence: 0.92,
        strategy: 'almog-personal-method',
        timestamp: Date.now() - 300000,
        status: 'active',
        telegramSent: true
      },
      {
        id: '2',
        symbol: 'ETHUSDT',
        action: 'sell',
        price: 2650.00,
        targetPrice: 2550.00,
        stopLoss: 2720.00,
        confidence: 0.87,
        strategy: 'rsi-macd-confluence',
        timestamp: Date.now() - 600000,
        status: 'active',
        telegramSent: true
      },
      {
        id: '3',
        symbol: 'SOLUSDT',
        action: 'buy',
        price: 98.50,
        targetPrice: 105.00,
        stopLoss: 95.00,
        confidence: 0.79,
        strategy: 'smart-money-concepts',
        timestamp: Date.now() - 900000,
        status: 'filled',
        telegramSent: true
      }
    ];

    setTimeout(() => {
      setSignals(mockSignals);
      setIsLoading(false);
    }, 1000);
  }, []);

  const generateManualSignal = () => {
    if (!isAdmin) {
      toast.error('רק המנהל יכול ליצור איתותים ידניים');
      return;
    }

    const newSignal: Signal = {
      id: Date.now().toString(),
      symbol: 'BTCUSDT',
      action: Math.random() > 0.5 ? 'buy' : 'sell',
      price: 43000 + Math.random() * 2000,
      targetPrice: 44000 + Math.random() * 1000,
      stopLoss: 42000 + Math.random() * 500,
      confidence: 0.8 + Math.random() * 0.15,
      strategy: 'manual-override',
      timestamp: Date.now(),
      status: 'active',
      telegramSent: false
    };

    setSignals(prev => [newSignal, ...prev]);
    toast.success('איתות ידני נוצר ונשלח לטלגרם');
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString('he-IL');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-blue-500';
      case 'filled': return 'bg-green-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const filteredSignals = signals.filter(signal => {
    if (activeTab === 'active') return signal.status === 'active';
    if (activeTab === 'filled') return signal.status === 'filled';
    return true;
  });

  if (isLoading) {
    return (
      <div className="container mx-auto py-6 px-4">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 px-4 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">איתותי מסחר</h1>
          <p className="text-muted-foreground">מעקב אחר איתותים פעילים והיסטוריה</p>
        </div>
        
        {isAdmin && (
          <Button onClick={generateManualSignal} className="gap-2">
            <Zap className="h-4 w-4" />
            יצירת איתות ידני
          </Button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">איתותים פעילים</p>
                <p className="text-2xl font-bold text-blue-600">
                  {signals.filter(s => s.status === 'active').length}
                </p>
              </div>
              <Activity className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">איתותים מולאו</p>
                <p className="text-2xl font-bold text-green-600">
                  {signals.filter(s => s.status === 'filled').length}
                </p>
              </div>
              <Target className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">אסטרטגיה אישית</p>
                <p className="text-2xl font-bold text-purple-600">
                  {signals.filter(s => s.strategy === 'almog-personal-method').length}
                </p>
              </div>
              <Shield className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">שיעור הצלחה</p>
                <p className="text-2xl font-bold text-orange-600">87%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Signals Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            איתותי מסחר
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="active">פעילים</TabsTrigger>
              <TabsTrigger value="filled">מולאו</TabsTrigger>
              <TabsTrigger value="all">הכל</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-4">
              <div className="space-y-4">
                {filteredSignals.map((signal) => (
                  <Card key={signal.id} className="border-r-4 border-r-primary">
                    <CardContent className="p-4">
                      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                        <div className="flex items-center gap-3">
                          {signal.action === 'buy' ? (
                            <TrendingUp className="h-6 w-6 text-green-600" />
                          ) : (
                            <TrendingDown className="h-6 w-6 text-red-600" />
                          )}
                          <div>
                            <p className="font-bold">{signal.symbol}</p>
                            <p className="text-sm text-muted-foreground capitalize">
                              {signal.action === 'buy' ? 'קנייה' : 'מכירה'}
                            </p>
                          </div>
                        </div>

                        <div>
                          <p className="text-sm text-muted-foreground">מחיר כניסה</p>
                          <p className="font-bold">${signal.price.toLocaleString()}</p>
                        </div>

                        <div>
                          <p className="text-sm text-muted-foreground">מחיר יעד</p>
                          <p className="font-bold text-green-600">
                            ${signal.targetPrice.toLocaleString()}
                          </p>
                        </div>

                        <div>
                          <p className="text-sm text-muted-foreground">סטופ לוס</p>
                          <p className="font-bold text-red-600">
                            ${signal.stopLoss.toLocaleString()}
                          </p>
                        </div>

                        <div className="flex flex-col gap-2">
                          <Badge className={getStatusColor(signal.status)}>
                            {signal.status === 'active' ? 'פעיל' : 
                             signal.status === 'filled' ? 'מולא' : 'בוטל'}
                          </Badge>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {formatTime(signal.timestamp)}
                          </div>
                        </div>
                      </div>

                      <div className="mt-3 pt-3 border-t flex justify-between items-center">
                        <div className="flex items-center gap-4">
                          <span className="text-sm">
                            <strong>אסטרטגיה:</strong> {signal.strategy}
                          </span>
                          <span className="text-sm">
                            <strong>רמת ביטחון:</strong> {(signal.confidence * 100).toFixed(0)}%
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          {signal.telegramSent && (
                            <Badge variant="outline" className="text-xs">
                              נשלח לטלגרם
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {filteredSignals.length === 0 && (
                  <div className="text-center py-12">
                    <Zap className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-lg font-medium">אין איתותים להצגה</p>
                    <p className="text-muted-foreground">
                      המערכת תציג כאן איתותים כשהם יווצרו
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Signals;
