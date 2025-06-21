
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X, AlertTriangle, TrendingDown, Filter } from 'lucide-react';

interface RejectedSignal {
  id: string;
  symbol: string;
  action: 'buy' | 'sell';
  price: number;
  confidence: number;
  score: number;
  reason: string;
  timestamp: number;
  strategy: string;
}

const SignalRejectionMonitor: React.FC = () => {
  const [rejectedSignals, setRejectedSignals] = useState<RejectedSignal[]>([]);
  const [rejectionStats, setRejectionStats] = useState({
    totalRejected: 0,
    reasonBreakdown: {} as Record<string, number>
  });

  useEffect(() => {
    // Simulate rejected signals for demonstration
    const mockRejectedSignals: RejectedSignal[] = [
      {
        id: '1',
        symbol: 'BTCUSDT',
        action: 'buy',
        price: 43250,
        confidence: 0.72,
        score: 145,
        reason: 'Score too low: 145/160',
        timestamp: Date.now() - 300000,
        strategy: 'rsi-macd-confluence'
      },
      {
        id: '2',
        symbol: 'ETHUSDT',
        action: 'sell',
        price: 2650,
        confidence: 0.68,
        score: 138,
        reason: 'Confidence too low: 68% < 75%',
        timestamp: Date.now() - 600000,
        strategy: 'smart-money-concepts'
      },
      {
        id: '3',
        symbol: 'SOLUSDT',
        action: 'buy',
        price: 98.5,
        confidence: 0.82,
        score: 155,
        reason: 'R/R too low: 1.6 < 1.8',
        timestamp: Date.now() - 900000,
        strategy: 'wyckoff-method'
      }
    ];

    setRejectedSignals(mockRejectedSignals);

    // Calculate rejection stats
    const reasonBreakdown: Record<string, number> = {};
    mockRejectedSignals.forEach(signal => {
      const mainReason = signal.reason.split(':')[0];
      reasonBreakdown[mainReason] = (reasonBreakdown[mainReason] || 0) + 1;
    });

    setRejectionStats({
      totalRejected: mockRejectedSignals.length,
      reasonBreakdown
    });
  }, []);

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString('he-IL');
  };

  const getRejectionReasonColor = (reason: string) => {
    if (reason.includes('Score too low')) return 'bg-red-100 text-red-800';
    if (reason.includes('Confidence')) return 'bg-orange-100 text-orange-800';
    if (reason.includes('R/R')) return 'bg-yellow-100 text-yellow-800';
    if (reason.includes('limit')) return 'bg-purple-100 text-purple-800';
    return 'bg-gray-100 text-gray-800';
  };

  const clearRejectedSignals = () => {
    setRejectedSignals([]);
    setRejectionStats({
      totalRejected: 0,
      reasonBreakdown: {}
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-right flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={clearRejectedSignals}
          >
            <X className="h-4 w-4 mr-1" />
            נקה
          </Button>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            איתותים שנדחו
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Rejection Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="text-center p-3 bg-red-50 rounded-lg">
            <div className="text-xl font-bold text-red-600">{rejectionStats.totalRejected}</div>
            <div className="text-sm text-red-700">סה"כ נדחו</div>
          </div>
          
          {Object.entries(rejectionStats.reasonBreakdown).map(([reason, count]) => (
            <div key={reason} className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-lg font-bold text-gray-600">{count}</div>
              <div className="text-xs text-gray-700">{reason}</div>
            </div>
          ))}
        </div>

        {/* Rejected Signals List */}
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {rejectedSignals.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Filter className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>אין איתותים שנדחו</p>
              <p className="text-sm">זה אומר שהמערכת עובדת טוב!</p>
            </div>
          ) : (
            rejectedSignals.map((signal) => (
              <Card key={signal.id} className="border-r-4 border-r-red-500">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <Badge className={getRejectionReasonColor(signal.reason)}>
                      {signal.reason}
                    </Badge>
                    <div className="text-right">
                      <p className="font-bold">{signal.symbol}</p>
                      <p className="text-sm text-muted-foreground">
                        {signal.action === 'buy' ? 'קנייה' : 'מכירה'} @ ${signal.price.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">ניקוד:</span>
                      <span className="font-medium ml-1">{signal.score}/160</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">ביטחון:</span>
                      <span className="font-medium ml-1">{(signal.confidence * 100).toFixed(1)}%</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">זמן:</span>
                      <span className="font-medium ml-1">{formatTime(signal.timestamp)}</span>
                    </div>
                  </div>
                  
                  <div className="mt-2 pt-2 border-t">
                    <span className="text-xs text-muted-foreground">
                      אסטרטגיה: {signal.strategy}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SignalRejectionMonitor;
