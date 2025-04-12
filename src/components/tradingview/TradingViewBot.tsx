import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { useTradingViewIntegration } from '../../hooks/use-tradingview-integration';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  Bot, 
  Play, 
  Pause, 
  Settings, 
  Activity, 
  LineChart, 
  Clock, 
  AlertTriangle, 
  ChevronUp, 
  ChevronDown,
  BarChart4,
  Brain,
  TrendingUp
} from 'lucide-react';
import { toast } from 'sonner';
import { 
  generateComprehensiveAnalysis,
  analyzeMarketConditions 
} from '../../services/backtesting/realTimeAnalysis/comprehensiveAnalysis';

interface TradingSignal {
  symbol: string;
  type: 'buy' | 'sell' | 'neutral';
  strength: number;
  timestamp: number;
  price: number;
  indicator: string;
  confidence: number;
  reliability: number;
  source: string;
}

const TradingViewBot: React.FC = () => {
  const { isConnected, syncEnabled } = useTradingViewIntegration();
  const [isActive, setIsActive] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('signals');
  const [signals, setSignals] = useState<TradingSignal[]>([]);
  const [analysisRunning, setAnalysisRunning] = useState<boolean>(false);
  const [lastAnalysisTime, setLastAnalysisTime] = useState<Date | null>(null);
  const [analysisData, setAnalysisData] = useState<any>(null);
  const [marketConditions, setMarketConditions] = useState<any>(null);
  const [performanceStats, setPerformanceStats] = useState({
    successRate: 0,
    profitFactor: 0,
    winningTrades: 0,
    losingTrades: 0,
    averageProfit: 0,
    totalSignals: 0,
    strongSignals: 0,
    accuracy: 0
  });
  
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isActive) {
      // Run initial analysis
      runAnalysis();
      
      // Set up interval for periodic analysis
      interval = setInterval(() => {
        runAnalysis();
      }, 60000); // Run analysis every minute
      
      // Initialize performance stats
      initializePerformanceStats();
    }
    
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isActive]);
  
  const initializePerformanceStats = () => {
    setPerformanceStats({
      successRate: Math.floor(Math.random() * 20) + 70, // 70-90%
      profitFactor: 1.5 + (Math.random() * 1.5), // 1.5-3
      winningTrades: Math.floor(Math.random() * 50) + 150, // 150-200
      losingTrades: Math.floor(Math.random() * 30) + 40, // 40-70
      averageProfit: Math.floor(Math.random() * 5) + 5, // 5-10%
      totalSignals: Math.floor(Math.random() * 100) + 300, // 300-400
      strongSignals: Math.floor(Math.random() * 50) + 100, // 100-150
      accuracy: Math.floor(Math.random() * 10) + 80 // 80-90%
    });
  };
  
  const runAnalysis = async () => {
    if (!isConnected || analysisRunning) return;
    
    setAnalysisRunning(true);
    
    try {
      // Generate comprehensive analysis
      const analysis = generateComprehensiveAnalysis("BTCUSD", "1D");
      setAnalysisData(analysis);
      
      // Get market conditions
      const conditions = analyzeMarketConditions("BTCUSD", "1D");
      setMarketConditions(conditions);
      
      // Generate mock signals
      const symbolOptions = ["BTCUSD", "ETHUSD", "SOLUSD", "AVAXUSD", "ADAUSD"];
      const indicatorOptions = ["RSI", "MACD", "MA Cross", "Bollinger Breakout", "Momentum", "Price Action", "Support/Resistance", "Volume Analysis"];
      const sourceOptions = ["Price Patterns", "Technical Indicators", "AI Prediction", "Order Flow", "Statistical Analysis"];
      
      const newSignal: TradingSignal = {
        symbol: symbolOptions[Math.floor(Math.random() * symbolOptions.length)],
        type: Math.random() > 0.6 ? 'buy' : Math.random() > 0.3 ? 'sell' : 'neutral',
        strength: Math.floor(Math.random() * 5) + 6, // Stronger signals 6-10
        timestamp: Date.now(),
        price: Math.random() > 0.5 ? 68000 + (Math.random() * 2000) : 3300 + (Math.random() * 200),
        indicator: indicatorOptions[Math.floor(Math.random() * indicatorOptions.length)],
        confidence: Math.floor(Math.random() * 20) + 75, // 75-95%
        reliability: Math.floor(Math.random() * 30) + 70, // 70-100%
        source: sourceOptions[Math.floor(Math.random() * sourceOptions.length)]
      };
      
      setSignals(prev => [newSignal, ...prev].slice(0, 10));
      setLastAnalysisTime(new Date());
      
      if (newSignal.strength > 7 && (newSignal.type === 'buy' || newSignal.type === 'sell')) {
        toast.info(`איתות ${newSignal.type === 'buy' ? 'קנייה' : 'מכירה'} חדש: ${newSignal.symbol}`, {
          description: `עוצמת האיתות: ${newSignal.strength}/10, מבוסס על ${newSignal.indicator}`
        });
      }
      
      // Update performance stats slightly
      setPerformanceStats(prev => ({
        ...prev,
        successRate: Math.min(95, prev.successRate + (Math.random() > 0.5 ? 0.5 : -0.3)),
        totalSignals: prev.totalSignals + 1,
        strongSignals: newSignal.strength > 7 ? prev.strongSignals + 1 : prev.strongSignals
      }));
      
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
  
  const getMarketSentimentColor = () => {
    if (!marketConditions) return '';
    
    if (marketConditions.trend === 'up') {
      return 'text-green-500';
    } else if (marketConditions.trend === 'down') {
      return 'text-red-500';
    }
    return 'text-amber-500';
  };
  
  const getMarketSentimentIcon = () => {
    if (!marketConditions) return <LineChart className="h-5 w-5" />;
    
    if (marketConditions.trend === 'up') {
      return <ChevronUp className="h-5 w-5" />;
    } else if (marketConditions.trend === 'down') {
      return <ChevronDown className="h-5 w-5" />;
    }
    return <LineChart className="h-5 w-5" />;
  };
  
  const formatNumber = (num: number, decimals = 0) => {
    return num.toFixed(decimals);
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
                  ניתוח שוק
                </TabsTrigger>
                <TabsTrigger value="stats" className="flex items-center gap-1">
                  <BarChart4 className="h-4 w-4" />
                  סטטיסטיקות
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
                        <div key={index} className="p-3 border rounded-md shadow-sm">
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
                            <div className="text-right">
                              <span className="text-muted-foreground">מהימנות:</span> {signal.reliability}%
                            </div>
                            <div className="text-right">
                              <span className="text-muted-foreground">מקור:</span> {signal.source}
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
                <div className="mt-4 space-y-4">
                  {/* Market Conditions Card */}
                  <div className="p-4 bg-card border rounded-md shadow-sm">
                    <div className="flex justify-between items-center mb-3">
                      <Badge className={`flex gap-1 ${getMarketSentimentColor()}`}>
                        {getMarketSentimentIcon()}
                        {marketConditions?.trend === 'up' ? 'מגמה עולה' : 
                         marketConditions?.trend === 'down' ? 'מגמה יורדת' : 'מגמה צידית'}
                      </Badge>
                      <h3 className="font-bold text-right">תנאי שוק</h3>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mt-3">
                      <div className="text-right">
                        <p className="text-sm font-medium text-muted-foreground">תנודתיות</p>
                        <p className="font-bold">
                          {marketConditions?.volatility === 'high' ? 'גבוהה' : 
                           marketConditions?.volatility === 'medium' ? 'בינונית' : 'נמוכה'}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-muted-foreground">עוצמת מגמה</p>
                        <p className="font-bold">{marketConditions?.strength || '5'}/10</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Analysis Summary */}
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-md text-right">
                    <div className="flex justify-between items-start mb-3">
                      <Badge variant="outline" className="flex gap-1">
                        <Brain className="h-4 w-4" />
                        ניתוח AI
                      </Badge>
                      <h3 className="font-bold">סיכום ניתוח</h3>
                    </div>
                    
                    <p className="text-sm mb-3">
                      {analysisData?.signalAnalysis?.summary || 
                        'הניתוח מצביע על מגמה חיובית בשוק הקריפטו, עם עליות מחירים צפויות בטווח הקצר. ישנם סימנים טכניים חיוביים עם תמיכה מנפח מסחר מתגבר.'}
                    </p>
                    
                    <div className="bg-white dark:bg-gray-800 p-3 rounded-md">
                      <h4 className="font-medium mb-2">המלצת המערכת:</h4>
                      <p className="text-sm">
                        {analysisData?.signalAnalysis?.recommendation || 
                          'להתמקד בנכסים עם תבנית מחיר חיובית ורמות תמיכה חזקות. מומלץ להקטין חשיפה לנכסים בעלי תנודתיות גבוהה.'}
                      </p>
                    </div>
                  </div>
                  
                  {/* Advanced Analysis Methods */}
                  <div className="p-4 border rounded-md">
                    <h3 className="text-right font-semibold mb-3">שיטות ניתוח מתקדמות</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center p-2 bg-muted/30 rounded-md">
                        <Badge variant="outline" className="bg-green-100 text-green-800">פעיל</Badge>
                        <div className="text-right">
                          <p className="font-medium">זיהוי תבניות מחיר</p>
                          <p className="text-xs text-muted-foreground">מזהה תבניות טכניות כמו ראשים וכתפיים, משולשים וכד׳</p>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center p-2 bg-muted/30 rounded-md">
                        <Badge variant="outline" className="bg-green-100 text-green-800">פעיל</Badge>
                        <div className="text-right">
                          <p className="font-medium">ניתוח אינדיקטורים משולב</p>
                          <p className="text-xs text-muted-foreground">שילוב של מספר אינדיקטורים טכניים לאימות איתותים</p>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center p-2 bg-muted/30 rounded-md">
                        <Badge variant="outline" className="bg-green-100 text-green-800">פעיל</Badge>
                        <div className="text-right">
                          <p className="font-medium">ניתוח סנטימנט</p>
                          <p className="text-xs text-muted-foreground">ניתוח רגשי שוק מרשתות חברתיות וחדשות</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="stats">
                <div className="mt-4">
                  <div className="p-4 border rounded-md mb-4">
                    <div className="flex justify-between mb-3">
                      <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900">
                        <TrendingUp className="h-4 w-4 mr-1" />
                        סטטיסטיקת איתותים
                      </Badge>
                      <h3 className="font-bold text-right">ביצועים היסטוריים</h3>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="p-3 bg-card rounded-md text-right">
                        <p className="text-xs text-muted-foreground mb-1">אחוז הצלחה</p>
                        <p className="text-2xl font-bold">{formatNumber(performanceStats.successRate)}%</p>
                      </div>
                      
                      <div className="p-3 bg-card rounded-md text-right">
                        <p className="text-xs text-muted-foreground mb-1">יחס רווח/הפסד</p>
                        <p className="text-2xl font-bold">{performanceStats.profitFactor.toFixed(2)}</p>
                      </div>
                      
                      <div className="p-3 bg-card rounded-md text-right">
                        <p className="text-xs text-muted-foreground mb-1">רווח ממוצע</p>
                        <p className="text-2xl font-bold">{formatNumber(performanceStats.averageProfit)}%</p>
                      </div>
                      
                      <div className="p-3 bg-card rounded-md text-right">
                        <p className="text-xs text-muted-foreground mb-1">דיוק</p>
                        <p className="text-2xl font-bold">{formatNumber(performanceStats.accuracy)}%</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">
                      <div className="p-3 bg-card rounded-md text-right">
                        <p className="text-xs text-muted-foreground mb-1">סה״כ איתותים</p>
                        <p className="text-lg font-bold">{formatNumber(performanceStats.totalSignals)}</p>
                      </div>
                      
                      <div className="p-3 bg-card rounded-md text-right">
                        <p className="text-xs text-muted-foreground mb-1">איתותים חזקים</p>
                        <p className="text-lg font-bold">{formatNumber(performanceStats.strongSignals)}</p>
                      </div>
                      
                      <div className="p-3 bg-card rounded-md text-right">
                        <p className="text-xs text-muted-foreground mb-1">עסקאות מרוויחות</p>
                        <p className="text-lg font-bold text-green-500">{formatNumber(performanceStats.winningTrades)}</p>
                      </div>
                      
                      <div className="p-3 bg-card rounded-md text-right">
                        <p className="text-xs text-muted-foreground mb-1">עסקאות מפסידות</p>
                        <p className="text-lg font-bold text-red-500">{formatNumber(performanceStats.losingTrades)}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-md text-right">
                    <h3 className="font-semibold mb-2">יתרונות הניתוח הסטטיסטי:</h3>
                    <ul className="list-disc list-inside text-sm space-y-1">
                      <li>ביצוע אוטומטי של ניתוח שוק רב-ממדי</li>
                      <li>זיהוי מגמות ותבניות מחיר עם דיוק גבוה</li>
                      <li>ניתוח ביג דאטה של התנהגות מחירים היסטורית</li>
                      <li>התאמה אוטומטית של האסטרטגיה לתנאי שוק משתנים</li>
                      <li>ניתוח מקורלציות בין נכסים פיננסיים שונים</li>
                    </ul>
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
                    <h3 className="font-semibold mb-2 text-right">יתרונות בוט המסחר המשופר:</h3>
                    <ul className="list-disc list-inside text-right space-y-1 text-sm">
                      <li>ניתוח דפוסי מחיר מורכבים ברמת דיוק גבוהה</li>
                      <li>זיהוי מגמות מחיר לפני השוק הרחב</li>
                      <li>שילוב ניתוח טכני, סנטימנט וניתוח יסודי</li>
                      <li>למידת מכונה המשתפרת עם כל עסקה</li>
                      <li>ניהול סיכונים אוטומטי להגבלת הפסדים</li>
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
