
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend, ReferenceLine } from 'recharts';
import { 
  BarChart3, TrendingUp, TrendingDown, ArrowUp, ArrowDown, 
  Activity, Volume2, Target, Signal, 
  BookOpen, Calendar, AlertTriangle, BarChartHorizontal,
  ChevronDown, RotateCcw, Send
} from 'lucide-react';
import { toast } from 'sonner';
import { getAssets, getAssetHistory } from '@/services/mockDataService';
import { Asset, AssetHistoricalData } from '@/types/asset';
import { analyzeAsset, getWyckoffPatterns, getSMCPatterns } from '@/services/technicalAnalysisService';

const timeframeOptions = [
  { value: '5m', label: '5 דקות' },
  { value: '15m', label: '15 דקות' },
  { value: '1h', label: 'שעה' },
  { value: '4h', label: '4 שעות' },
  { value: '1d', label: 'יומי' },
  { value: '1w', label: 'שבועי' },
];

const TechnicalAnalysis = () => {
  const [selectedAssetId, setSelectedAssetId] = useState<string>('bitcoin');
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>('1d');
  const [selectedAnalysisMethod, setSelectedAnalysisMethod] = useState<string>('all');
  const [showVolume, setShowVolume] = useState<boolean>(true);
  
  // שליפת נתונים
  const { data: assets } = useQuery({
    queryKey: ['assets'],
    queryFn: getAssets,
  });
  
  const { data: assetHistory, isLoading: historyLoading } = useQuery({
    queryKey: ['assetHistory', selectedAssetId, selectedTimeframe],
    queryFn: () => getAssetHistory(selectedAssetId, selectedTimeframe as any),
  });
  
  const { data: analysisData, isLoading: analysisLoading } = useQuery({
    queryKey: ['analysisData', selectedAssetId, selectedTimeframe, selectedAnalysisMethod],
    queryFn: () => analyzeAsset(selectedAssetId, selectedTimeframe as any, selectedAnalysisMethod),
  });
  
  const { data: wyckoffPatterns } = useQuery({
    queryKey: ['wyckoffPatterns', selectedAssetId, selectedTimeframe],
    queryFn: () => getWyckoffPatterns(selectedAssetId, selectedTimeframe as any),
    enabled: selectedAnalysisMethod === 'wyckoff' || selectedAnalysisMethod === 'all',
  });
  
  const { data: smcPatterns } = useQuery({
    queryKey: ['smcPatterns', selectedAssetId, selectedTimeframe],
    queryFn: () => getSMCPatterns(selectedAssetId, selectedTimeframe as any),
    enabled: selectedAnalysisMethod === 'smc' || selectedAnalysisMethod === 'all',
  });

  const selectedAsset = assets?.find(asset => asset.id === selectedAssetId);

  // יצירת הודעות איתות לשליחה
  const generateSignal = () => {
    if (!selectedAsset || !analysisData) return;
    
    toast.success('איתות נשלח בהצלחה', {
      description: `ניתוח טכני ל-${selectedAsset.name} בטווח ${selectedTimeframe} נשלח למכשירך`,
      action: {
        label: 'הצג פרטים',
        onClick: () => console.log('הצגת פרטי איתות'),
      },
    });
  };

  // פורמט לתצוגת מחיר
  const formatPrice = (price: number) => {
    return price < 1 
      ? price.toFixed(6) 
      : price < 1000 
        ? price.toFixed(2) 
        : price.toLocaleString(undefined, { maximumFractionDigits: 2 });
  };

  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <h1 className="text-3xl font-bold mb-6 text-right">ניתוח טכני מתקדם</h1>
      
      {/* בחירת נכס וטווח זמן */}
      <div className="flex flex-wrap gap-4 justify-end mb-6">
        <div className="flex items-center gap-2">
          <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="טווח זמן" />
            </SelectTrigger>
            <SelectContent>
              {timeframeOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedAssetId} onValueChange={setSelectedAssetId}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="בחר נכס" />
            </SelectTrigger>
            <SelectContent>
              {assets?.map(asset => (
                <SelectItem key={asset.id} value={asset.id}>
                  {asset.name} ({asset.symbol})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* תצוגת מידע נכס */}
      {selectedAsset && (
        <div className="mb-6">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  {selectedAsset.imageUrl && (
                    <img 
                      src={selectedAsset.imageUrl} 
                      alt={selectedAsset.name} 
                      className="w-10 h-10 object-contain"
                    />
                  )}
                </div>
                <div className="text-right">
                  <CardTitle className="text-2xl">{selectedAsset.name} ({selectedAsset.symbol})</CardTitle>
                  <div className="flex items-center gap-2 justify-end mt-1">
                    <Badge variant="outline">
                      {selectedAsset.type === 'crypto' 
                        ? 'קריפטו' 
                        : selectedAsset.type === 'stock' 
                          ? 'מניה' 
                          : 'מט"ח'}
                    </Badge>
                    <CardDescription className="text-lg">
                      מחיר: ${formatPrice(selectedAsset.price)}
                    </CardDescription>
                    <Badge className={selectedAsset.change24h >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                      {selectedAsset.change24h >= 0 ? '+' : ''}{selectedAsset.change24h}%
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
          </Card>
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          {/* גרף מחיר ונפח */}
          <Card className="mb-6">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setShowVolume(!showVolume)}
                  >
                    <Volume2 className="h-4 w-4 mr-2" />
                    {showVolume ? 'הסתר נפח' : 'הצג נפח'}
                  </Button>
                </div>
                <CardTitle className="text-right">גרף מחיר</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              {historyLoading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                </div>
              ) : assetHistory ? (
                <div className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={assetHistory.data}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="timestamp" 
                        tickFormatter={(timestamp) => {
                          const date = new Date(timestamp);
                          return date.toLocaleDateString('he-IL', { day: 'numeric', month: 'numeric' });
                        }}
                      />
                      <YAxis 
                        domain={['auto', 'auto']}
                        tickFormatter={(value) => formatPrice(value)}
                        width={80}
                      />
                      <Tooltip 
                        formatter={(value: number) => [`$${formatPrice(value)}`, 'מחיר']}
                        labelFormatter={(timestamp) => {
                          const date = new Date(timestamp as number);
                          return date.toLocaleDateString('he-IL', { 
                            day: 'numeric', 
                            month: 'numeric',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          });
                        }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="price" 
                        stroke="#8884d8" 
                        dot={false}
                        name="מחיר"
                      />
                      
                      {/* סימון סיגנלים על הגרף אם יש */}
                      {analysisData?.signals?.map((signal, idx) => (
                        <ReferenceLine 
                          key={idx}
                          x={signal.timestamp}
                          stroke={signal.type === 'buy' ? 'green' : 'red'}
                          strokeDasharray="3 3"
                          label={{ 
                            value: signal.type === 'buy' ? 'קנייה' : 'מכירה',
                            position: 'insideBottomLeft',
                            fill: signal.type === 'buy' ? 'green' : 'red',
                          }}
                        />
                      ))}
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="text-center p-10">
                  <AlertTriangle className="h-10 w-10 text-yellow-500 mx-auto mb-4" />
                  <p>לא נמצאו נתונים עבור הנכס בטווח הזמן הנבחר</p>
                </div>
              )}
              
              {showVolume && assetHistory && assetHistory.volumeData && (
                <div className="h-32 mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={assetHistory.volumeData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="timestamp" 
                        tickFormatter={(timestamp) => {
                          const date = new Date(timestamp);
                          return date.toLocaleDateString('he-IL', { day: 'numeric', month: 'numeric' });
                        }}
                      />
                      <YAxis 
                        tickFormatter={(value) => value >= 1000000 
                          ? `${(value / 1000000).toFixed(1)}M` 
                          : value >= 1000 
                            ? `${(value / 1000).toFixed(1)}K` 
                            : value
                        }
                        width={60}
                      />
                      <Tooltip 
                        formatter={(value: number) => {
                          if (value >= 1000000) {
                            return [`${(value / 1000000).toFixed(2)}M`, 'נפח']
                          } else if (value >= 1000) {
                            return [`${(value / 1000).toFixed(2)}K`, 'נפח']
                          }
                          return [value, 'נפח']
                        }}
                        labelFormatter={(timestamp) => {
                          const date = new Date(timestamp as number);
                          return date.toLocaleDateString('he-IL', { day: 'numeric', month: 'numeric' });
                        }}
                      />
                      <Bar 
                        dataKey="volume" 
                        fill="#8884d8" 
                        name="נפח מסחר"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* אינדיקטורים טכניים */}
          <Card>
            <CardHeader>
              <CardTitle className="text-right">אינדיקטורים טכניים</CardTitle>
            </CardHeader>
            <CardContent>
              {analysisLoading ? (
                <div className="flex justify-center items-center h-32">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                </div>
              ) : analysisData ? (
                <div>
                  {/* תצוגת RSI */}
                  <div className="mb-6">
                    <h3 className="font-semibold text-lg mb-2 text-right">RSI (מדד עוצמת תנועה יחסית)</h3>
                    <div className="h-32">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={analysisData.rsiData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis 
                            dataKey="timestamp" 
                            tickFormatter={(timestamp) => {
                              const date = new Date(timestamp);
                              return date.toLocaleDateString('he-IL', { day: 'numeric', month: 'numeric' });
                            }}
                          />
                          <YAxis 
                            domain={[0, 100]}
                            tickCount={5}
                            width={40}
                          />
                          <Tooltip 
                            formatter={(value: number) => [`${value.toFixed(2)}`, 'RSI']}
                            labelFormatter={(timestamp) => {
                              const date = new Date(timestamp as number);
                              return date.toLocaleDateString('he-IL', { 
                                day: 'numeric', 
                                month: 'numeric',
                                year: 'numeric'
                              });
                            }}
                          />
                          <ReferenceLine y={70} stroke="red" strokeDasharray="3 3" label="קנייתר יתר" />
                          <ReferenceLine y={30} stroke="green" strokeDasharray="3 3" label="מכירת יתר" />
                          <Line 
                            type="monotone" 
                            dataKey="value" 
                            stroke="#ff7300" 
                            dot={false}
                            name="RSI"
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                    
                    <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-md text-right">
                      <p className="font-medium">פרשנות:</p>
                      <p className="text-sm">{analysisData.rsiInterpretation}</p>
                    </div>
                  </div>
                  
                  {/* אינדיקטורים נוספים - MACD, ממוצעים נעים, וכו' */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {analysisData.indicators.map((indicator, idx) => (
                      <div key={idx} className="p-4 border rounded-md">
                        <div className="flex items-center justify-between mb-2">
                          <Badge 
                            className={
                              indicator.signal === 'buy' 
                                ? 'bg-green-100 text-green-800' 
                                : indicator.signal === 'sell' 
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-blue-100 text-blue-800'
                            }
                          >
                            {indicator.signal === 'buy' 
                              ? 'קנייה' 
                              : indicator.signal === 'sell' 
                                ? 'מכירה'
                                : 'ניטרלי'
                            }
                          </Badge>
                          <h4 className="font-medium text-right">{indicator.name}</h4>
                        </div>
                        <p className="text-sm text-right">{indicator.description}</p>
                        <div className="mt-2 text-right">
                          <span className="text-sm text-muted-foreground">ערך: </span>
                          <span className="font-medium">{indicator.value}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* מסקנה והמלצה כללית */}
                  <div className="p-4 border-2 rounded-md border-primary">
                    <h3 className="font-bold text-lg mb-2 text-right">סיכום והמלצה</h3>
                    <p className="text-right mb-4">{analysisData.conclusion}</p>
                    
                    <div className="flex justify-between items-center">
                      <Button 
                        className="gap-2" 
                        onClick={generateSignal}
                      >
                        <Send className="h-4 w-4" />
                        שלח איתות למכשיר
                      </Button>
                      
                      <div className="flex items-center gap-2">
                        <Badge 
                          className={
                            analysisData.overallSignal === 'buy' 
                              ? 'bg-green-100 text-green-800 text-lg p-2' 
                              : analysisData.overallSignal === 'sell' 
                                ? 'bg-red-100 text-red-800 text-lg p-2'
                                : 'bg-blue-100 text-blue-800 text-lg p-2'
                          }
                        >
                          {analysisData.overallSignal === 'buy' 
                            ? (
                              <div className="flex items-center gap-1">
                                <ArrowUp className="h-4 w-4" />
                                קנייה
                              </div>
                            ) 
                            : analysisData.overallSignal === 'sell' 
                              ? (
                                <div className="flex items-center gap-1">
                                  <ArrowDown className="h-4 w-4" />
                                  מכירה
                                </div>
                              )
                              : (
                                <div className="flex items-center gap-1">
                                  <BarChartHorizontal className="h-4 w-4" />
                                  המתנה
                                </div>
                              )
                          }
                        </Badge>
                        
                        <Badge 
                          variant="outline" 
                          className="text-lg p-2"
                        >
                          עוצמה: {analysisData.signalStrength}/10
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center p-10">
                  <AlertTriangle className="h-10 w-10 text-yellow-500 mx-auto mb-4" />
                  <p>לא נמצאו נתוני אינדיקטורים עבור הנכס הנבחר</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        <div>
          {/* שיטות ניתוח מתקדמות */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-right">שיטות ניתוח מתקדמות</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="all">
                <TabsList className="grid w-full grid-cols-3 mb-4">
                  <TabsTrigger value="all" onClick={() => setSelectedAnalysisMethod('all')}>הכל</TabsTrigger>
                  <TabsTrigger value="wyckoff" onClick={() => setSelectedAnalysisMethod('wyckoff')}>וויקוף</TabsTrigger>
                  <TabsTrigger value="smc" onClick={() => setSelectedAnalysisMethod('smc')}>SMC</TabsTrigger>
                </TabsList>
                
                <TabsContent value="all" className="space-y-4">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-lg mb-2 text-right">מתודולוגיית וויקוף</h3>
                      {wyckoffPatterns?.patterns?.length ? (
                        <div className="space-y-2">
                          {wyckoffPatterns.patterns.map((pattern, idx) => (
                            <div key={idx} className="p-3 border rounded-md">
                              <div className="flex justify-between items-center mb-1">
                                <Badge 
                                  className={
                                    pattern.phase.includes('אקומולציה') 
                                      ? 'bg-green-100 text-green-800' 
                                      : 'bg-red-100 text-red-800'
                                  }
                                >
                                  {pattern.phase}
                                </Badge>
                                <h4 className="font-medium text-right">{pattern.name}</h4>
                              </div>
                              <p className="text-sm text-right">{pattern.description}</p>
                              <p className="text-sm mt-1 text-right text-muted-foreground">
                                סבירות: {pattern.probability}%
                              </p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground text-right">
                          לא זוהו תבניות וויקוף בתקופה הנבחרת
                        </p>
                      )}
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="font-semibold text-lg mb-2 text-right">SMC (Smart Money Concept)</h3>
                      {smcPatterns?.patterns?.length ? (
                        <div className="space-y-2">
                          {smcPatterns.patterns.map((pattern, idx) => (
                            <div key={idx} className="p-3 border rounded-md">
                              <div className="flex justify-between items-center mb-1">
                                <Badge 
                                  className={
                                    pattern.bias === 'bullish' 
                                      ? 'bg-green-100 text-green-800' 
                                      : 'bg-red-100 text-red-800'
                                  }
                                >
                                  {pattern.bias === 'bullish' ? 'עולה' : 'יורד'}
                                </Badge>
                                <h4 className="font-medium text-right">{pattern.name}</h4>
                              </div>
                              <p className="text-sm text-right">{pattern.description}</p>
                              <div className="text-sm mt-1 text-right text-muted-foreground">
                                <div>אזור כניסה: {formatPrice(pattern.entryZone.min)} - {formatPrice(pattern.entryZone.max)}</div>
                                {pattern.targetPrice && <div>יעד: {formatPrice(pattern.targetPrice)}</div>}
                                {pattern.stopLoss && <div>סטופ: {formatPrice(pattern.stopLoss)}</div>}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground text-right">
                          לא זוהו תבניות SMC בתקופה הנבחרת
                        </p>
                      )}
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="wyckoff" className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg mb-2 text-right">מתודולוגיית וויקוף</h3>
                    <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-md text-right">
                      <p className="text-sm">
                        מתודולוגיית וויקוף מבוססת על זיהוי פעולות של "כסף חכם" בשוק.
                        היא מתמקדת בזיהוי מחזורי אקומולציה (צבירה) ודיסטריביושן (הפצה) 
                        ושימוש בנפח המסחר לאישור תנועות מחיר.
                      </p>
                    </div>
                    
                    {wyckoffPatterns?.phase && (
                      <div className="mb-6">
                        <h4 className="font-medium text-right mb-2">שלב נוכחי</h4>
                        <Badge className="w-full justify-center text-base py-2">
                          {wyckoffPatterns.phase}
                        </Badge>
                      </div>
                    )}
                    
                    {wyckoffPatterns?.patterns?.length ? (
                      <div className="space-y-3">
                        {wyckoffPatterns.patterns.map((pattern, idx) => (
                          <div key={idx} className="p-3 border rounded-md">
                            <div className="flex justify-between items-center mb-1">
                              <Badge 
                                className={
                                  pattern.phase.includes('אקומולציה') 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-red-100 text-red-800'
                                }
                              >
                                {pattern.phase}
                              </Badge>
                              <h4 className="font-medium text-right">{pattern.name}</h4>
                            </div>
                            <p className="text-sm text-right">{pattern.description}</p>
                            <p className="text-sm mt-1 text-right text-muted-foreground">
                              סבירות: {pattern.probability}%
                            </p>
                            {pattern.events && (
                              <div className="mt-2">
                                <p className="text-sm font-medium text-right">אירועים מזוהים:</p>
                                <ul className="text-sm list-disc list-inside space-y-1 rtl:list-inside text-right">
                                  {pattern.events.map((event, i) => (
                                    <li key={i}>{event}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground text-right">
                        לא זוהו תבניות וויקוף בתקופה הנבחרת
                      </p>
                    )}
                    
                    {wyckoffPatterns?.conclusion && (
                      <div className="mt-4 p-3 border-2 rounded-md border-primary text-right">
                        <h4 className="font-medium mb-1">מסקנה</h4>
                        <p className="text-sm">{wyckoffPatterns.conclusion}</p>
                      </div>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="smc" className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg mb-2 text-right">SMC (Smart Money Concept)</h3>
                    <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-md text-right">
                      <p className="text-sm">
                        שיטת SMC מתמקדת בזיהוי אזורי נזילות, מסירת הזמנות ומלכודות מחיר 
                        שנוצרות על ידי בנקים וגופים מוסדיים. היא מחפשת "תנועות הטעיה" 
                        לפני מהלכי מחיר משמעותיים.
                      </p>
                    </div>
                    
                    {smcPatterns?.patterns?.length ? (
                      <div className="space-y-3">
                        {smcPatterns.patterns.map((pattern, idx) => (
                          <div key={idx} className="p-3 border rounded-md">
                            <div className="flex justify-between items-center mb-1">
                              <Badge 
                                className={
                                  pattern.bias === 'bullish' 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-red-100 text-red-800'
                                }
                              >
                                {pattern.bias === 'bullish' ? 'עולה' : 'יורד'}
                              </Badge>
                              <h4 className="font-medium text-right">{pattern.name}</h4>
                            </div>
                            <p className="text-sm text-right">{pattern.description}</p>
                            
                            <div className="text-sm mt-3 space-y-1 text-right">
                              <div className="flex justify-between">
                                <Badge variant="outline">
                                  {formatPrice(pattern.entryZone.min)} - {formatPrice(pattern.entryZone.max)}
                                </Badge>
                                <span className="text-muted-foreground">אזור כניסה:</span>
                              </div>
                              
                              {pattern.targetPrice && (
                                <div className="flex justify-between">
                                  <Badge variant="outline" className="bg-green-50 text-green-800">
                                    {formatPrice(pattern.targetPrice)}
                                  </Badge>
                                  <span className="text-muted-foreground">יעד:</span>
                                </div>
                              )}
                              
                              {pattern.stopLoss && (
                                <div className="flex justify-between">
                                  <Badge variant="outline" className="bg-red-50 text-red-800">
                                    {formatPrice(pattern.stopLoss)}
                                  </Badge>
                                  <span className="text-muted-foreground">סטופ:</span>
                                </div>
                              )}
                              
                              {pattern.riskRewardRatio && (
                                <div className="flex justify-between">
                                  <Badge variant="outline">
                                    1:{pattern.riskRewardRatio}
                                  </Badge>
                                  <span className="text-muted-foreground">יחס סיכוי/סיכון:</span>
                                </div>
                              )}
                            </div>
                            
                            {pattern.keyLevels && (
                              <div className="mt-2">
                                <p className="text-sm font-medium text-right">רמות מפתח:</p>
                                <ul className="text-sm list-disc list-inside space-y-1 rtl:list-inside text-right">
                                  {pattern.keyLevels.map((level, i) => (
                                    <li key={i}>{level.name}: {formatPrice(level.price)}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground text-right">
                        לא זוהו תבניות SMC בתקופה הנבחרת
                      </p>
                    )}
                    
                    {smcPatterns?.conclusion && (
                      <div className="mt-4 p-3 border-2 rounded-md border-primary text-right">
                        <h4 className="font-medium mb-1">מסקנה</h4>
                        <p className="text-sm">{smcPatterns.conclusion}</p>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
          
          {/* הגדרות התראות */}
          <Card>
            <CardHeader>
              <CardTitle className="text-right">הגדרות התראות</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-right">
                <div>
                  <h3 className="font-medium mb-2">ערוצי התראות</h3>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between p-2 border rounded-md">
                      <Button variant="outline" size="sm">הגדר</Button>
                      <div className="flex items-center gap-2">
                        <span>Telegram</span>
                        <Send className="h-4 w-4" />
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-2 border rounded-md">
                      <Button variant="outline" size="sm">הגדר</Button>
                      <div className="flex items-center gap-2">
                        <span>WhatsApp</span>
                        <Send className="h-4 w-4" />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">סוגי התראות</h3>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <input type="checkbox" id="price_alerts" className="h-4 w-4" checked />
                      <label htmlFor="price_alerts" className="flex-1 text-right mr-2">התראות מחיר</label>
                    </div>
                    <div className="flex items-center justify-between">
                      <input type="checkbox" id="technical_signals" className="h-4 w-4" checked />
                      <label htmlFor="technical_signals" className="flex-1 text-right mr-2">איתותים טכניים</label>
                    </div>
                    <div className="flex items-center justify-between">
                      <input type="checkbox" id="pattern_alerts" className="h-4 w-4" checked />
                      <label htmlFor="pattern_alerts" className="flex-1 text-right mr-2">זיהוי תבניות</label>
                    </div>
                    <div className="flex items-center justify-between">
                      <input type="checkbox" id="market_news" className="h-4 w-4" checked />
                      <label htmlFor="market_news" className="flex-1 text-right mr-2">חדשות שוק רלוונטיות</label>
                    </div>
                  </div>
                </div>
                
                <Button className="w-full">שמור הגדרות</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TechnicalAnalysis;
