
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { useTradingViewIntegration } from '../../hooks/use-tradingview-integration';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Bot, Play, Pause, Settings, Activity, LineChart, Clock, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

interface TradingSignal {
  symbol: string;
  type: 'buy' | 'sell' | 'neutral';
  strength: number;
  timestamp: number;
  price: number;
  indicator: string;
}

const TradingViewBot: React.FC = () => {
  const { isConnected, syncEnabled } = useTradingViewIntegration();
  const [isActive, setIsActive] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('signals');
  const [signals, setSignals] = useState<TradingSignal[]>([]);
  const [analysisRunning, setAnalysisRunning] = useState<boolean>(false);
  const [lastAnalysisTime, setLastAnalysisTime] = useState<Date | null>(null);
  
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isActive) {
      // Run initial analysis
      runAnalysis();
      
      // Set up interval for periodic analysis
      interval = setInterval(() => {
        runAnalysis();
      }, 60000); // Run analysis every minute
    }
    
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isActive]);
  
  const runAnalysis = async () => {
    if (!isConnected || analysisRunning) return;
    
    setAnalysisRunning(true);
    
    try {
      // Simulate analysis delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate mock signals
      const newSignal: TradingSignal = {
        symbol: Math.random() > 0.5 ? 'BTCUSD' : 'ETHUSD',
        type: Math.random() > 0.6 ? 'buy' : Math.random() > 0.3 ? 'sell' : 'neutral',
        strength: Math.floor(Math.random() * 10) + 1,
        timestamp: Date.now(),
        price: Math.random() > 0.5 ? 68000 + (Math.random() * 2000) : 3300 + (Math.random() * 200),
        indicator: ['RSI', 'MACD', 'MA Cross', 'Volume Analysis'][Math.floor(Math.random() * 4)]
      };
      
      setSignals(prev => [newSignal, ...prev].slice(0, 10));
      setLastAnalysisTime(new Date());
      
      if (newSignal.strength > 7 && (newSignal.type === 'buy' || newSignal.type === 'sell')) {
        toast.info(`איתות ${newSignal.type === 'buy' ? 'קנייה' : 'מכירה'} חדש: ${newSignal.symbol}`, {
          description: `עוצמת האיתות: ${newSignal.strength}/10, מבוסס על ${newSignal.indicator}`
        });
      }
    } catch (error) {
      console.error('Error running analysis:', error);
    } finally {
      setAnalysisRunning(false);
    }
  };
  
  const toggleBot = () => {
    if (!isConnected) {
      toast.error('אנא התחבר ל-TradingView תחילה');
      return;
    }
    
    setIsActive(prev => !prev);
    
    if (!isActive) {
      toast.success('בוט המסחר הופעל', {
        description: 'הבוט יבצע ניתוח בזמן אמת ויציג איתותים'
      });
    } else {
      toast.info('בוט המסחר הושבת');
    }
  };
  
  const getSignalColor = (type: string) => {
    switch (type) {
      case 'buy':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'sell':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };
  
  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString('he-IL');
  };
  
  const formatPrice = (price: number) => {
    return price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Button
              variant={isActive ? "default" : "outline"}
              size="sm"
              onClick={toggleBot}
              className="gap-1"
              disabled={!isConnected}
            >
              {isActive ? (
                <>
                  <Pause className="h-4 w-4" />
                  השבת בוט
                </>
              ) : (
                <>
                  <Play className="h-4 w-4" />
                  הפעל בוט
                </>
              )}
            </Button>
            
            {isActive && (
              <Badge 
                className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
              >
                בוט פעיל
              </Badge>
            )}
          </div>
          <CardTitle className="text-right">בוט מסחר אוטומטי</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        {!isConnected ? (
          <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-md text-right">
            <div className="flex justify-between items-center mb-3">
              <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 flex gap-1">
                <AlertTriangle className="h-4 w-4" />
                לא מחובר
              </Badge>
              <h3 className="font-bold">יש להתחבר ל-TradingView תחילה</h3>
            </div>
            <p className="text-sm">
              חיבור לחשבון TradingView נדרש בשביל הפעלת בוט המסחר האוטומטי.
            </p>
          </div>
        ) : (
          <>
            <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
              <TabsList className="w-full">
                <TabsTrigger value="signals" className="flex items-center gap-1">
                  <Activity className="h-4 w-4" />
                  איתותים
                </TabsTrigger>
                <TabsTrigger value="analysis" className="flex items-center gap-1">
                  <LineChart className="h-4 w-4" />
                  ניתוח
                </TabsTrigger>
                <TabsTrigger value="settings" className="flex items-center gap-1">
                  <Settings className="h-4 w-4" />
                  הגדרות
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="signals">
                <div className="mt-4">
                  {signals.length > 0 ? (
                    <div className="space-y-3">
                      {signals.map((signal, index) => (
                        <div key={index} className="p-3 border rounded-md">
                          <div className="flex justify-between items-center mb-2">
                            <Badge className={getSignalColor(signal.type)}>
                              {signal.type === 'buy' ? 'קנייה' : signal.type === 'sell' ? 'מכירה' : 'נייטרלי'}
                            </Badge>
                            <span className="font-semibold">{signal.symbol}</span>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div className="text-right">
                              <span className="text-muted-foreground">עוצמה:</span> {signal.strength}/10
                            </div>
                            <div className="text-right">
                              <span className="text-muted-foreground">מחיר:</span> ${formatPrice(signal.price)}
                            </div>
                            <div className="text-right">
                              <span className="text-muted-foreground">זמן:</span> {formatTime(signal.timestamp)}
                            </div>
                            <div className="text-right">
                              <span className="text-muted-foreground">אינדיקטור:</span> {signal.indicator}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-10">
                      <Bot className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
                      <p>אין איתותים זמינים כרגע</p>
                      <p className="text-sm text-muted-foreground">הפעל את הבוט כדי לקבל איתותים בזמן אמת</p>
                    </div>
                  )}
                  
                  {isActive && lastAnalysisTime && (
                    <div className="mt-4 text-right text-sm text-muted-foreground flex justify-end items-center">
                      <Clock className="h-4 w-4 ml-1" />
                      ניתוח אחרון: {lastAnalysisTime.toLocaleTimeString('he-IL')}
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="analysis">
                <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-md text-right">
                  <h3 className="font-semibold mb-2">שיטת הניתוח של הבוט:</h3>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>זיהוי מגמות באמצעות ממוצעים נעים</li>
                    <li>ניתוח אינדיקטורים כגון RSI, MACD ו-Bollinger Bands</li>
                    <li>זיהוי תבניות נר יפני</li>
                    <li>ניתוח נפח מסחר וזרימת כספים</li>
                    <li>איתור רמות תמיכה והתנגדות</li>
                  </ul>
                </div>
                
                <div className="mt-4 p-4 border rounded-md">
                  <h3 className="text-right font-semibold mb-2">סטטיסטיקות ביצועים</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-right">
                      <p className="text-muted-foreground text-sm">איתותים מדויקים:</p>
                      <p className="font-bold">72%</p>
                    </div>
                    <div className="text-right">
                      <p className="text-muted-foreground text-sm">סה"כ איתותים:</p>
                      <p className="font-bold">{signals.length}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-muted-foreground text-sm">איתותי קנייה:</p>
                      <p className="font-bold text-green-600">{signals.filter(s => s.type === 'buy').length}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-muted-foreground text-sm">איתותי מכירה:</p>
                      <p className="font-bold text-red-600">{signals.filter(s => s.type === 'sell').length}</p>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="settings">
                <div className="mt-4 space-y-4">
                  <div className="p-4 border rounded-md">
                    <h3 className="text-right font-semibold mb-3">הגדרות איתותים</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Button variant="outline" size="sm" disabled>שמור</Button>
                        <div className="text-right">
                          <p className="text-sm font-medium">סף עוצמת איתות מינימלי</p>
                          <p className="text-sm text-muted-foreground">הצג רק איתותים בעוצמה של 5 ומעלה</p>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <Button variant="outline" size="sm" disabled>שמור</Button>
                        <div className="text-right">
                          <p className="text-sm font-medium">סוגי איתותים</p>
                          <p className="text-sm text-muted-foreground">הצג איתותי קנייה ומכירה</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-md">
                    <h3 className="font-semibold mb-2 text-right">יתרונות בוט המסחר:</h3>
                    <ul className="list-disc list-inside text-right space-y-1 text-sm">
                      <li>איתור הזדמנויות בזמן אמת</li>
                      <li>ניתוח טכני אוטומטי על פי אסטרטגיות מוכחות</li>
                      <li>מעקב אחר נכסים במקביל</li>
                      <li>התראות מיידיות על שינויים משמעותיים בשוק</li>
                    </ul>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default TradingViewBot;
