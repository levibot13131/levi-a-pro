
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { TradeSignal, MarketAnalysis, Asset } from '@/types/asset';
import { getTradeSignals, getMarketAnalyses } from '@/services/mockTradingService';
import { getAssets } from '@/services/mockDataService';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowUpCircle, ArrowDownCircle, TrendingUp, TrendingDown, BarChart4, Landmark, BarChartHorizontal, Calendar, User, Lightbulb, Target, ShieldAlert, Play, Activity } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useStoredSignals, startRealTimeAnalysis, generateSignalAnalysis } from '@/services/backtesting/realTimeAnalysis';
import { toast } from 'sonner';

const TradingSignals = () => {
  const [selectedAssetId, setSelectedAssetId] = useState<string>('all');
  const [selectedAnalysisType, setSelectedAnalysisType] = useState<string>('all');
  const [realTimeActive, setRealTimeActive] = useState<boolean>(false);
  const [alertInstance, setAlertInstance] = useState<{ stop: () => void } | null>(null);
  
  // שליפת נתונים
  const { data: mockSignals, isLoading: mockSignalsLoading } = useQuery({
    queryKey: ['tradeSignals', selectedAssetId],
    queryFn: () => getTradeSignals(selectedAssetId !== 'all' ? selectedAssetId : undefined),
  });
  
  // שליפת איתותים בזמן אמת
  const { data: realTimeSignals = [], refetch: refetchRealTimeSignals } = useStoredSignals(
    selectedAssetId !== 'all' ? selectedAssetId : undefined
  );
  
  const { data: analyses, isLoading: analysesLoading } = useQuery({
    queryKey: ['marketAnalyses', selectedAssetId, selectedAnalysisType],
    queryFn: () => getMarketAnalyses(
      selectedAssetId !== 'all' ? selectedAssetId : undefined,
      selectedAnalysisType !== 'all' ? selectedAnalysisType as MarketAnalysis['type'] : undefined
    ),
  });
  
  const { data: assets } = useQuery({
    queryKey: ['assets'],
    queryFn: getAssets,
  });
  
  // שילוב של האיתותים המדומים והאיתותים בזמן אמת
  const allSignals: TradeSignal[] = React.useMemo(() => {
    const combined = [...(mockSignals || []), ...realTimeSignals];
    // מיון לפי זמן (מהחדש לישן)
    return combined.sort((a, b) => b.timestamp - a.timestamp);
  }, [mockSignals, realTimeSignals]);
  
  const signalsLoading = mockSignalsLoading;
  
  // רענון תקופתי של איתותים בזמן אמת
  useEffect(() => {
    const interval = setInterval(() => {
      refetchRealTimeSignals();
    }, 5000);
    
    return () => {
      clearInterval(interval);
      if (alertInstance) {
        alertInstance.stop();
      }
    };
  }, [refetchRealTimeSignals, alertInstance]);
  
  // פונקציה להפעלת/כיבוי ניתוח בזמן אמת
  const toggleRealTimeAnalysis = () => {
    if (realTimeActive && alertInstance) {
      alertInstance.stop();
      setAlertInstance(null);
      setRealTimeActive(false);
      toast.info("ניתוח בזמן אמת הופסק");
    } else {
      // הפעלת ניתוח בזמן אמת עבור כל הנכסים או הנכס הנבחר
      const assetsList = selectedAssetId !== 'all' 
        ? [selectedAssetId] 
        : assets?.slice(0, 5).map(a => a.id) || []; // מגביל ל-5 נכסים למניעת עומס
      
      const instance = startRealTimeAnalysis(assetsList, {
        strategy: 'אסטרטגיה משולבת',
      });
      
      setAlertInstance(instance);
      setRealTimeActive(true);
      toast.success("ניתוח בזמן אמת הופעל", {
        description: `המערכת תתחיל לשלוח התראות בזמן אמת עבור ${assetsList.length} נכסים`
      });
    }
  };
  
  // עיצוב לפי סוג עסקה
  const getSignalTypeStyles = (type: 'buy' | 'sell') => {
    if (type === 'buy') {
      return {
        icon: <ArrowUpCircle className="h-10 w-10 text-green-600" />,
        badge: <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">קנייה</Badge>,
        bgColor: 'bg-green-50 dark:bg-green-950',
        textColor: 'text-green-600'
      };
    } else {
      return {
        icon: <ArrowDownCircle className="h-10 w-10 text-red-600" />,
        badge: <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">מכירה</Badge>,
        bgColor: 'bg-red-50 dark:bg-red-950',
        textColor: 'text-red-600'
      };
    }
  };
  
  // עיצוב לפי עוצמת הסיגנל
  const getSignalStrengthBadge = (strength: 'weak' | 'medium' | 'strong') => {
    switch (strength) {
      case 'strong':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">חזק</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">בינוני</Badge>;
      case 'weak':
        return <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300">חלש</Badge>;
    }
  };
  
  // עיצוב לפי סנטימנט של ניתוח שוק
  const getAnalysisSentimentStyles = (sentiment: 'bullish' | 'bearish' | 'neutral') => {
    switch (sentiment) {
      case 'bullish':
        return {
          icon: <TrendingUp className="h-10 w-10 text-green-600" />,
          badge: <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">חיובי</Badge>,
          textColor: 'text-green-600'
        };
      case 'bearish':
        return {
          icon: <TrendingDown className="h-10 w-10 text-red-600" />,
          badge: <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">שלילי</Badge>,
          textColor: 'text-red-600'
        };
      case 'neutral':
        return {
          icon: <BarChartHorizontal className="h-10 w-10 text-blue-600" />,
          badge: <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">ניטרלי</Badge>,
          textColor: 'text-blue-600'
        };
    }
  };
  
  // קבלת שם נכס
  const getAssetName = (assetId: string) => {
    return assets?.find(a => a.id === assetId)?.name || assetId;
  };
  
  // פורמט לתאריך
  const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('he-IL', { 
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // סוג ניתוח
  const getAnalysisTypeBadge = (type: MarketAnalysis['type']) => {
    switch (type) {
      case 'technical':
        return <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300">טכני</Badge>;
      case 'fundamental':
        return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">פונדמנטלי</Badge>;
      case 'sentiment':
        return <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300">סנטימנט</Badge>;
    }
  };
  
  // ניתוח הסיגנלים הקיימים
  const signalAnalysis = React.useMemo(() => {
    if (!allSignals || allSignals.length === 0) return null;
    return generateSignalAnalysis(selectedAssetId !== 'all' ? selectedAssetId : undefined);
  }, [allSignals, selectedAssetId]);
  
  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <div className="flex justify-between items-center mb-6">
        <Button 
          onClick={toggleRealTimeAnalysis}
          variant={realTimeActive ? "destructive" : "default"}
          className="flex items-center gap-2"
        >
          {realTimeActive ? (
            <>הפסק ניתוח בזמן אמת</>
          ) : (
            <>
              <Play className="h-4 w-4" />
              הפעל ניתוח בזמן אמת
            </>
          )}
        </Button>
        <h1 className="text-3xl font-bold text-right">איתותי מסחר וניתוח שוק</h1>
      </div>
      
      {/* סיכום הניתוח */}
      {signalAnalysis && (
        <Card className="mb-6 border-2 border-primary/50">
          <CardContent className="pt-4">
            <div className="flex justify-between items-start">
              <div className="flex flex-col gap-2">
                <div className="flex gap-3">
                  <div className="text-center px-3 py-2 bg-muted rounded-md">
                    <p className="text-lg font-bold">{signalAnalysis.buySignals}</p>
                    <p className="text-xs text-green-600">קנייה</p>
                  </div>
                  <div className="text-center px-3 py-2 bg-muted rounded-md">
                    <p className="text-lg font-bold">{signalAnalysis.sellSignals}</p>
                    <p className="text-xs text-red-600">מכירה</p>
                  </div>
                  <div className="text-center px-3 py-2 bg-muted rounded-md">
                    <p className="text-lg font-bold">{signalAnalysis.recentSignals}</p>
                    <p className="text-xs">24 שעות</p>
                  </div>
                </div>
                {realTimeActive && (
                  <div className="flex items-center gap-1 text-green-600">
                    <Activity className="h-3 w-3 animate-pulse" />
                    <span className="text-sm">ניתוח בזמן אמת פעיל</span>
                  </div>
                )}
              </div>
              <div className="text-right">
                <h3 className="font-bold text-lg">סיכום איתותים ({signalAnalysis.totalSignals})</h3>
                <p className="text-sm mt-1">{signalAnalysis.summary}</p>
                <p className="font-medium text-primary mt-2">{signalAnalysis.recommendation}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      <Tabs defaultValue="signals" className="space-y-4">
        <TabsList className="grid w-full md:w-[400px] grid-cols-2">
          <TabsTrigger value="signals">
            <Target className="h-4 w-4 mr-2" />
            איתותי מסחר
          </TabsTrigger>
          <TabsTrigger value="analyses">
            <BarChart4 className="h-4 w-4 mr-2" />
            ניתוחי שוק
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="signals" className="space-y-4">
          <div className="flex justify-end mb-4">
            <Select value={selectedAssetId} onValueChange={setSelectedAssetId}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="כל הנכסים" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">כל הנכסים</SelectItem>
                {assets?.map(asset => (
                  <SelectItem key={asset.id} value={asset.id}>
                    {asset.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {signalsLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : allSignals && allSignals.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {allSignals.map(signal => {
                const styles = getSignalTypeStyles(signal.type);
                const isRealTimeSignal = realTimeSignals.some(s => s.id === signal.id);
                
                return (
                  <Card key={signal.id} className={`${styles.bgColor} border-2 ${signal.type === 'buy' ? 'border-green-200' : 'border-red-200'}`}>
                    <CardHeader className="flex flex-row items-center gap-4">
                      {styles.icon}
                      <div className="text-right">
                        <div className="flex flex-wrap gap-2 mb-1">
                          {styles.badge}
                          {getSignalStrengthBadge(signal.strength)}
                          {isRealTimeSignal && (
                            <Badge variant="outline" className="border-primary flex items-center gap-1">
                              <Activity className="h-3 w-3" />
                              זמן אמת
                            </Badge>
                          )}
                        </div>
                        <CardTitle>{getAssetName(signal.assetId)}</CardTitle>
                        <CardDescription>
                          איתות ב-{formatDate(signal.timestamp)}
                        </CardDescription>
                      </div>
                    </CardHeader>
                    <CardContent className="text-right">
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-muted-foreground">מחיר כניסה</p>
                          <p className="text-lg font-semibold">${signal.price.toLocaleString()}</p>
                        </div>
                        {signal.targetPrice && (
                          <div>
                            <p className="text-sm text-muted-foreground">יעד מחיר</p>
                            <p className="text-lg font-semibold text-green-600">${signal.targetPrice.toLocaleString()}</p>
                          </div>
                        )}
                        {signal.stopLoss && (
                          <div>
                            <p className="text-sm text-muted-foreground">סטופ לוס</p>
                            <p className="text-lg font-semibold text-red-600">${signal.stopLoss.toLocaleString()}</p>
                          </div>
                        )}
                        {signal.riskRewardRatio && (
                          <div>
                            <p className="text-sm text-muted-foreground">יחס סיכוי/סיכון</p>
                            <p className="text-lg font-semibold">1:{signal.riskRewardRatio}</p>
                          </div>
                        )}
                      </div>
                      
                      <div className="mb-4">
                        <div className="flex items-center gap-2 mb-1">
                          <BarChart4 className="h-4 w-4" />
                          <p className="font-medium">אסטרטגיה: {signal.strategy}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <p className="font-medium">טווח זמן: {signal.timeframe}</p>
                        </div>
                      </div>
                      
                      {signal.notes && (
                        <div className="mt-4 p-3 bg-white dark:bg-gray-800 rounded-md">
                          <p className="text-sm">{signal.notes}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <Card>
              <CardContent className="py-10 text-center">
                <Target className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                <p className="text-lg font-medium">אין איתותי מסחר זמינים</p>
                <p className="text-muted-foreground">נסה להחליף את הפילטר או להפעיל ניתוח בזמן אמת</p>
                {!realTimeActive && (
                  <Button className="mt-4" onClick={toggleRealTimeAnalysis}>
                    <Play className="h-4 w-4 mr-2" />
                    הפעל ניתוח בזמן אמת
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="analyses" className="space-y-4">
          <div className="flex flex-wrap gap-4 justify-end mb-4">
            <Select value={selectedAssetId} onValueChange={setSelectedAssetId}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="כל הנכסים" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">כל הנכסים</SelectItem>
                {assets?.map(asset => (
                  <SelectItem key={asset.id} value={asset.id}>
                    {asset.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={selectedAnalysisType} onValueChange={setSelectedAnalysisType}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="כל סוגי הניתוח" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">כל סוגי הניתוח</SelectItem>
                <SelectItem value="technical">ניתוח טכני</SelectItem>
                <SelectItem value="fundamental">ניתוח פונדמנטלי</SelectItem>
                <SelectItem value="sentiment">ניתוח סנטימנט</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {analysesLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : analyses && analyses.length > 0 ? (
            <div className="space-y-6">
              {analyses.map(analysis => {
                const styles = getAnalysisSentimentStyles(analysis.sentiment);
                
                return (
                  <Card key={analysis.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2">
                          {getAnalysisTypeBadge(analysis.type)}
                          {styles.badge}
                        </div>
                        {styles.icon}
                      </div>
                      <div className="text-right mt-4">
                        <CardTitle className="text-xl">{analysis.title}</CardTitle>
                        <CardDescription className="mt-1">
                          {analysis.assetId && `${getAssetName(analysis.assetId)} | `}
                          {analysis.marketSector && `${analysis.marketSector} | `}
                          {new Date(analysis.publishedAt).toLocaleDateString('he-IL')}
                        </CardDescription>
                      </div>
                    </CardHeader>
                    <CardContent className="text-right">
                      <p className="text-lg mb-4">{analysis.summary}</p>
                      
                      <div className="flex items-center gap-2 mb-3">
                        <User className="h-4 w-4" />
                        <p className="font-medium">{analysis.author}</p>
                      </div>
                      
                      <div className="mt-6">
                        <h3 className="font-semibold mb-2 flex items-center gap-1">
                          <Lightbulb className="h-4 w-4" />
                          נקודות מפתח
                        </h3>
                        <ul className="list-disc list-inside space-y-1">
                          {analysis.keyPoints.map((point, idx) => (
                            <li key={idx}>{point}</li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="mt-6 p-4 rounded-md border border-gray-200 dark:border-gray-800">
                        <h3 className="font-semibold mb-2">מסקנה</h3>
                        <p className={styles.textColor}>{analysis.conclusion}</p>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-end">
                      <Button>קרא את הניתוח המלא</Button>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          ) : (
            <Card>
              <CardContent className="py-10 text-center">
                <BarChart4 className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                <p className="text-lg font-medium">אין ניתוחי שוק זמינים</p>
                <p className="text-muted-foreground">נסה להחליף את הפילטרים או לבדוק שוב מאוחר יותר</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TradingSignals;
