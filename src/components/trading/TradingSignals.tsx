
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Zap, TrendingUp, TrendingDown, Clock, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

interface TradingSignal {
  id: string;
  symbol: string;
  action: 'buy' | 'sell';
  price: number;
  targetPrice: number;
  stopLoss: number;
  confidence: number;
  strategy: string;
  reasoning: string;
  timestamp: number;
  status: 'active' | 'completed' | 'cancelled';
}

const TradingSignals: React.FC = () => {
  const [signals, setSignals] = useState<TradingSignal[]>([]);
  const [isEngineRunning, setIsEngineRunning] = useState(false);

  useEffect(() => {
    // Mock signals for demonstration
    const mockSignals: TradingSignal[] = [
      {
        id: '1',
        symbol: 'BTCUSDT',
        action: 'buy',
        price: 43250,
        targetPrice: 44500,
        stopLoss: 42800,
        confidence: 0.94,
        strategy: 'almog-personal-method',
        reasoning: 'זיהוי אזור לחץ רגשי חזק + אישור מומנטום חיובי',
        timestamp: Date.now() - 300000,
        status: 'active'
      },
      {
        id: '2',
        symbol: 'ETHUSDT',
        action: 'sell',
        price: 2580,
        targetPrice: 2520,
        stopLoss: 2610,
        confidence: 0.87,
        strategy: 'smc-strategy',
        reasoning: 'פרצת Fair Value Gap + אישור Order Block',
        timestamp: Date.now() - 600000,
        status: 'active'
      }
    ];
    setSignals(mockSignals);
  }, []);

  const startEngine = () => {
    setIsEngineRunning(true);
    toast.success('מנוע המסחר הופעל בהצלחה');
  };

  const stopEngine = () => {
    setIsEngineRunning(false);
    toast.info('מנוע המסחר הופסק');
  };

  const getActionIcon = (action: string) => {
    return action === 'buy' ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />;
  };

  const getActionColor = (action: string) => {
    return action === 'buy' ? 'text-green-600' : 'text-red-600';
  };

  const getStrategyBadge = (strategy: string) => {
    if (strategy === 'almog-personal-method') {
      return <Badge className="bg-blue-100 text-blue-800">השיטה האישית</Badge>;
    }
    return <Badge variant="secondary">{strategy}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <Button 
            onClick={startEngine} 
            disabled={isEngineRunning}
            className="bg-green-600 hover:bg-green-700"
          >
            <Zap className="h-4 w-4 mr-2" />
            הפעל מנוע
          </Button>
          <Button 
            onClick={stopEngine} 
            disabled={!isEngineRunning}
            variant="outline"
          >
            <Clock className="h-4 w-4 mr-2" />
            עצור מנוע
          </Button>
        </div>
        <div className="text-right">
          <h1 className="text-3xl font-bold">איתותי מסחר חיים</h1>
          <p className="text-gray-600">
            סטטוס: {isEngineRunning ? (
              <span className="text-green-600 font-medium">פעיל</span>
            ) : (
              <span className="text-red-600 font-medium">מופסק</span>
            )}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-right flex items-center justify-between">
              איתותים פעילים
              <Zap className="h-5 w-5 text-yellow-500" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{signals.filter(s => s.status === 'active').length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-right flex items-center justify-between">
              רמת ביטחון ממוצעת
              <CheckCircle className="h-5 w-5 text-green-500" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {signals.length > 0 ? Math.round(signals.reduce((sum, s) => sum + s.confidence, 0) / signals.length * 100) : 0}%
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-right flex items-center justify-between">
              השיטה האישית
              <TrendingUp className="h-5 w-5 text-blue-500" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">
              {signals.filter(s => s.strategy === 'almog-personal-method').length}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        {signals.map((signal) => (
          <Card key={signal.id} className="border-r-4 border-r-blue-500">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getStrategyBadge(signal.strategy)}
                  <Badge className={`${getActionColor(signal.action)}`}>
                    {getActionIcon(signal.action)}
                    {signal.action === 'buy' ? 'קנה' : 'מכור'}
                  </Badge>
                </div>
                <div className="text-right">
                  <h3 className="text-xl font-bold">{signal.symbol}</h3>
                  <p className="text-sm text-gray-600">
                    {new Date(signal.timestamp).toLocaleString('he-IL')}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium">${signal.price.toLocaleString()}</span>
                    <span>מחיר כניסה:</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-green-600">${signal.targetPrice.toLocaleString()}</span>
                    <span>יעד:</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-red-600">${signal.stopLoss.toLocaleString()}</span>
                    <span>סטופ לוס:</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium">{Math.round(signal.confidence * 100)}%</span>
                    <span>רמת ביטחון:</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium mb-1">נימוק:</p>
                    <p className="text-sm text-gray-600">{signal.reasoning}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TradingSignals;
