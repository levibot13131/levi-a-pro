
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Play, Square, BarChart3, TrendingUp, TrendingDown } from 'lucide-react';
import { toast } from 'sonner';

const BacktestingLab: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<any>(null);

  const runBacktest = async () => {
    setIsRunning(true);
    setProgress(0);
    
    // Simulate backtesting progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsRunning(false);
          setResults({
            totalTrades: 156,
            winRate: 68.5,
            profitFactor: 2.34,
            maxDrawdown: 12.3,
            totalReturn: 45.7
          });
          toast.success('בדיקה אחורית הושלמה בהצלחה');
          return 100;
        }
        return prev + 2;
      });
    }, 100);
  };

  return (
    <div className="container mx-auto py-6 px-4 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">מעבדת בחינה אחורית</h1>
        <p className="text-muted-foreground">בדוק אסטרטגיות מסחר על נתונים היסטוריים</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>הגדרות בדיקה</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">אסטרטגיה</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="בחר אסטרטגיה" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="almog-personal">LeviPro Method</SelectItem>
                      <SelectItem value="rsi-macd">RSI + MACD</SelectItem>
                      <SelectItem value="smc">Smart Money Concepts</SelectItem>
                      <SelectItem value="wyckoff">Wyckoff Method</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">נכס</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="בחר נכס" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BTCUSDT">Bitcoin (BTC)</SelectItem>
                      <SelectItem value="ETHUSDT">Ethereum (ETH)</SelectItem>
                      <SelectItem value="SOLUSDT">Solana (SOL)</SelectItem>
                      <SelectItem value="BNBUSDT">BNB</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">תאריך התחלה</label>
                  <Input type="date" defaultValue="2024-01-01" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">תאריך סיום</label>
                  <Input type="date" defaultValue="2024-12-31" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">קפיטל התחלתי ($)</label>
                  <Input type="number" defaultValue="10000" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">סיכון לעסקה (%)</label>
                  <Input type="number" defaultValue="2" />
                </div>
              </div>

              <Button 
                onClick={runBacktest} 
                disabled={isRunning}
                className="w-full"
              >
                {isRunning ? (
                  <>
                    <Square className="h-4 w-4 mr-2" />
                    רץ... {progress.toFixed(0)}%
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    הפעל בדיקה אחורית
                  </>
                )}
              </Button>

              {isRunning && (
                <Progress value={progress} className="w-full" />
              )}
            </CardContent>
          </Card>

          {results && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  תוצאות בדיקה
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {results.totalTrades}
                    </div>
                    <div className="text-sm text-muted-foreground">סך עסקאות</div>
                  </div>
                  
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {results.winRate}%
                    </div>
                    <div className="text-sm text-muted-foreground">שיעור הצלחה</div>
                  </div>
                  
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">
                      {results.profitFactor}
                    </div>
                    <div className="text-sm text-muted-foreground">יחס רווח</div>
                  </div>
                  
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-red-600">
                      -{results.maxDrawdown}%
                    </div>
                    <div className="text-sm text-muted-foreground">משיכה מקסימלית</div>
                  </div>
                  
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      +{results.totalReturn}%
                    </div>
                    <div className="text-sm text-muted-foreground">תשואה כוללת</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>סטטיסטיקות מהירות</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">עסקאות מנצחות</span>
                <Badge className="bg-green-100 text-green-800">107</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">עסקאות מפסידות</span>
                <Badge className="bg-red-100 text-red-800">49</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">רווח ממוצע</span>
                <span className="text-sm font-medium text-green-600">+2.34%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">הפסד ממוצע</span>
                <span className="text-sm font-medium text-red-600">-1.02%</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>ביצועים חודשיים</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {[
                  { month: 'ינואר', return: 5.2, positive: true },
                  { month: 'פברואר', return: -2.1, positive: false },
                  { month: 'מרץ', return: 8.7, positive: true },
                  { month: 'אפריל', return: 3.4, positive: true },
                  { month: 'מאי', return: -1.2, positive: false },
                  { month: 'יוני', return: 6.8, positive: true }
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm">{item.month}</span>
                    <div className="flex items-center gap-2">
                      {item.positive ? (
                        <TrendingUp className="h-4 w-4 text-green-600" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-600" />
                      )}
                      <span className={`text-sm font-medium ${item.positive ? 'text-green-600' : 'text-red-600'}`}>
                        {item.positive ? '+' : ''}{item.return}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BacktestingLab;
