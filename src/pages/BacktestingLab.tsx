
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { TestTube, PlayCircle, BarChart3, TrendingUp, TrendingDown } from 'lucide-react';

const BacktestingLab: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<any>(null);

  const runBacktest = async () => {
    setIsRunning(true);
    
    // Simulate backtesting process
    setTimeout(() => {
      setResults({
        totalTrades: 156,
        winRate: 68.5,
        totalReturn: 234.7,
        maxDrawdown: 12.3,
        sharpeRatio: 1.84,
        profitFactor: 2.31,
        avgWin: 3.2,
        avgLoss: -1.8,
        winningTrades: 107,
        losingTrades: 49,
        strategy: 'LeviPro Personal Method'
      });
      setIsRunning(false);
    }, 3000);
  };

  return (
    <div className="container mx-auto py-6 px-4 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">מעבדת בדיקות</h1>
          <p className="text-muted-foreground">
            בדיקת ביצועי אסטרטגיות על נתונים היסטוריים
          </p>
        </div>
        <TestTube className="h-12 w-12 text-primary" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Backtest Configuration */}
        <Card>
          <CardHeader>
            <CardTitle>הגדרות בדיקה</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="strategy">אסטרטגיה</Label>
              <select className="w-full p-2 border rounded">
                <option value="personal">LeviPro Personal Method</option>
                <option value="wyckoff">Wyckoff Analysis</option>
                <option value="smc">Smart Money Concepts</option>
                <option value="rsi-macd">RSI + MACD</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="symbol">זוג מטבעות</Label>
              <select className="w-full p-2 border rounded">
                <option value="BTCUSDT">BTC/USDT</option>
                <option value="ETHUSDT">ETH/USDT</option>
                <option value="SOLUSDT">SOL/USDT</option>
                <option value="BNBUSDT">BNB/USDT</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="timeframe">מסגרת זמן</Label>
              <select className="w-full p-2 border rounded">
                <option value="5m">5 דקות</option>
                <option value="15m">15 דקות</option>
                <option value="1h">שעה</option>
                <option value="4h">4 שעות</option>
                <option value="1d">יום</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start-date">תאריך התחלה</Label>
                <Input type="date" id="start-date" defaultValue="2024-01-01" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end-date">תאריך סיום</Label>
                <Input type="date" id="end-date" defaultValue="2024-12-31" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="initial-balance">יתרה התחלתית ($)</Label>
              <Input type="number" id="initial-balance" defaultValue="10000" />
            </div>

            <Button 
              onClick={runBacktest} 
              disabled={isRunning}
              className="w-full"
            >
              {isRunning ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                  מריץ בדיקה...
                </>
              ) : (
                <>
                  <PlayCircle className="h-4 w-4 mr-2" />
                  הרץ בדיקה
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Results */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              תוצאות
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!results ? (
              <div className="text-center py-8 text-muted-foreground">
                <TestTube className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>הרץ בדיקה כדי לראות תוצאות</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="text-center mb-4">
                  <Badge variant="default" className="text-lg py-2 px-4">
                    {results.strategy}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-muted rounded">
                    <p className="text-2xl font-bold text-green-600">
                      {results.winRate}%
                    </p>
                    <p className="text-sm text-muted-foreground">אחוז הצלחה</p>
                  </div>
                  <div className="text-center p-3 bg-muted rounded">
                    <p className="text-2xl font-bold text-blue-600">
                      {results.totalReturn}%
                    </p>
                    <p className="text-sm text-muted-foreground">תשואה כוללת</p>
                  </div>
                  <div className="text-center p-3 bg-muted rounded">
                    <p className="text-2xl font-bold text-red-600">
                      {results.maxDrawdown}%
                    </p>
                    <p className="text-sm text-muted-foreground">נסיגה מקסימלית</p>
                  </div>
                  <div className="text-center p-3 bg-muted rounded">
                    <p className="text-2xl font-bold text-purple-600">
                      {results.sharpeRatio}
                    </p>
                    <p className="text-sm text-muted-foreground">יחס שארפ</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>סה"כ עסקאות:</span>
                    <span className="font-semibold">{results.totalTrades}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>עסקאות רווחיות:</span>
                    <span className="font-semibold text-green-600">
                      <TrendingUp className="inline h-4 w-4 mr-1" />
                      {results.winningTrades}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>עסקאות הפסדיות:</span>
                    <span className="font-semibold text-red-600">
                      <TrendingDown className="inline h-4 w-4 mr-1" />
                      {results.losingTrades}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>רווח ממוצע:</span>
                    <span className="font-semibold text-green-600">{results.avgWin}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>הפסד ממוצע:</span>
                    <span className="font-semibold text-red-600">{results.avgLoss}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>פקטור רווח:</span>
                    <span className="font-semibold">{results.profitFactor}</span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Strategy Performance Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>השוואת ביצועי אסטרטגיות</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center p-4 border rounded">
                <h3 className="font-semibold mb-2">LeviPro Personal</h3>
                <div className="text-2xl font-bold text-green-600 mb-1">68.5%</div>
                <div className="text-sm text-muted-foreground">Win Rate</div>
              </div>
              <div className="text-center p-4 border rounded">
                <h3 className="font-semibold mb-2">Wyckoff</h3>
                <div className="text-2xl font-bold text-blue-600 mb-1">62.3%</div>
                <div className="text-sm text-muted-foreground">Win Rate</div>
              </div>
              <div className="text-center p-4 border rounded">
                <h3 className="font-semibold mb-2">SMC</h3>
                <div className="text-2xl font-bold text-purple-600 mb-1">59.1%</div>
                <div className="text-sm text-muted-foreground">Win Rate</div>
              </div>
              <div className="text-center p-4 border rounded">
                <h3 className="font-semibold mb-2">RSI+MACD</h3>
                <div className="text-2xl font-bold text-orange-600 mb-1">55.7%</div>
                <div className="text-sm text-muted-foreground">Win Rate</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BacktestingLab;
