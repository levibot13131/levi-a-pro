
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { AlertTriangle, Send, ArrowUp, ArrowDown, BarChartHorizontal, Star, StarOff, Filter, Scan, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface TechnicalIndicatorsProps {
  analysisLoading: boolean;
  analysisData: any;
  selectedAsset: any;
}

const TechnicalIndicators = ({ analysisLoading, analysisData, selectedAsset }: TechnicalIndicatorsProps) => {
  const [autoScanEnabled, setAutoScanEnabled] = useState<boolean>(true);
  const [watchlistEnabled, setWatchlistEnabled] = useState<boolean>(true);
  const [selectedTimeframes, setSelectedTimeframes] = useState<string[]>(['1d', '4h', '1h']);
  const [activeScanTab, setActiveScanTab] = useState<string>("indicators");
  
  // יצירת הודעות איתות לשליחה
  const generateSignal = () => {
    if (!selectedAsset || !analysisData) return;
    
    toast.success('איתות נשלח בהצלחה', {
      description: `ניתוח טכני ל-${selectedAsset.name} בטווח ${selectedAsset.timeframe} נשלח למכשירך`,
      action: {
        label: 'הצג פרטים',
        onClick: () => console.log('הצגת פרטי איתות'),
      },
    });
  };

  // הוספה לרשימת מעקב
  const toggleWatchlist = () => {
    const action = watchlistEnabled ? 'הוסר מ' : 'נוסף ל';
    setWatchlistEnabled(!watchlistEnabled);
    
    toast.info(`${selectedAsset?.name} ${action}רשימת המעקב`, {
      description: watchlistEnabled 
        ? 'לא תקבל עוד התראות על נכס זה' 
        : 'תקבל התראות על הזדמנויות מסחר בנכס זה',
    });
  };

  // סריקה אוטומטית של מטבעות לפי סקירות שבועיות
  const getAutoScanResults = () => {
    // בגרסה אמיתית, זה יכול להיות API שיחזיר מטבעות מומלצים מבוסס על ניתוח שבועי
    return [
      { 
        symbol: 'BTC', 
        name: 'Bitcoin', 
        timeframe: '1w',
        sentiment: 'buy',
        strength: 8,
        reason: 'פריצת התנגדות ארוכת טווח, מומנטום חיובי, תמיכה במחזור החדש'
      },
      { 
        symbol: 'ETH', 
        name: 'Ethereum',
        timeframe: '1w',
        sentiment: 'neutral',
        strength: 5,
        reason: 'התבססות מעל אזור תמיכה, אך ממתין לאישור מגמה חיובית'
      },
      { 
        symbol: 'SOL', 
        name: 'Solana',
        timeframe: '1w',
        sentiment: 'buy',
        strength: 7,
        reason: 'עלייה בנפח מסחר, חציית ממוצעים נעים חיובית, תבנית הגביע בהשלמה'
      },
      { 
        symbol: 'LINK', 
        name: 'Chainlink',
        timeframe: '1w', 
        sentiment: 'buy',
        strength: 6,
        reason: 'סיום פאזת אקומולציה, יציאה ממבנה דגל, תבניות מחיר חיוביות'
      },
      { 
        symbol: 'AVAX', 
        name: 'Avalanche',
        timeframe: '1w',
        sentiment: 'sell',
        strength: 7,
        reason: 'שבירת תמיכה משמעותית, נפח מסחר בירידה, מגמה שלילית בממוצעים'
      }
    ];
  };

  // ניתוח מרובה טווחי זמנים
  const getMultiTimeframeAnalysis = () => {
    // בגרסה אמיתית, זה יהיה תוצאה של API שמבצע ניתוח על כל טווחי הזמן
    return [
      {
        timeframe: '1w',
        signal: 'buy',
        strength: 8,
        keyIndicators: ['מומנטום חיובי', 'תמיכה במחזור חדש', 'אקומולציה מוסדית']
      },
      {
        timeframe: '1d',
        signal: 'buy',
        strength: 7,
        keyIndicators: ['RSI מתכנס', 'פריצת התנגדות', 'תבנית דגל']
      },
      {
        timeframe: '4h',
        signal: 'neutral',
        strength: 5,
        keyIndicators: ['התבססות בטווח', 'ממתין לפריצה', 'נפח ממוצע']
      },
      {
        timeframe: '1h',
        signal: 'buy',
        strength: 6,
        keyIndicators: ['אתות קנייה MACD', 'תמיכה בולינגר', 'מומנטום קצר']
      },
      {
        timeframe: '15m',
        signal: 'sell',
        strength: 4,
        keyIndicators: ['קנייתר יתר RSI', 'התנגדות קצרת טווח', 'היחלשות מומנטום']
      }
    ];
  };

  // חישוב איתות סופי משולב מכל הניתוחים
  const getFinalSignal = () => {
    // בגרסה אמיתית, החישוב יביא בחשבון הרבה פרמטרים כולל המשקלים הנכונים לכל טווח זמן
    const multiTimeframe = getMultiTimeframeAnalysis();
    
    // משקולות לפי טווחי זמן (טווחים ארוכים יותר מקבלים משקל גבוה יותר)
    const weights = {
      '1w': 0.3,
      '1d': 0.25,
      '4h': 0.2,
      '1h': 0.15,
      '15m': 0.1
    };
    
    let buySignalStrength = 0;
    let sellSignalStrength = 0;
    
    // חישוב כוח הסיגנל המשוקלל
    multiTimeframe.forEach(tf => {
      const weight = weights[tf.timeframe as keyof typeof weights] || 0.1;
      
      if (tf.signal === 'buy') {
        buySignalStrength += tf.strength * weight;
      } else if (tf.signal === 'sell') {
        sellSignalStrength += tf.strength * weight;
      }
    });
    
    // קביעת הסיגנל הסופי
    const signalDiff = buySignalStrength - sellSignalStrength;
    
    if (signalDiff > 2) {
      return {
        signal: 'buy',
        strength: Math.min(10, Math.round(buySignalStrength)),
        confidence: Math.min(100, Math.round((buySignalStrength / (buySignalStrength + sellSignalStrength)) * 100)),
        description: "ניתוח כל טווחי הזמן מצביע על מגמה חיובית חזקה. רוב האינדיקטורים והתבניות מהטווח הארוך לקצר תומכים בעלייה."
      };
    } else if (signalDiff < -2) {
      return {
        signal: 'sell',
        strength: Math.min(10, Math.round(sellSignalStrength)),
        confidence: Math.min(100, Math.round((sellSignalStrength / (buySignalStrength + sellSignalStrength)) * 100)),
        description: "ניתוח כל טווחי הזמן מצביע על מגמה שלילית. רוב האינדיקטורים והתבניות מראים חולשה לאורך מספר טווחי זמן."
      };
    } else {
      return {
        signal: 'neutral',
        strength: 5,
        confidence: 50,
        description: "ניתוח טווחי הזמן מראה סיגנלים מעורבים. יש פער בין המגמות בטווח הארוך והקצר. מומלץ להמתין לאיתות ברור יותר."
      };
    }
  };
  
  const autoScanResults = getAutoScanResults();
  const multiTimeframeData = getMultiTimeframeAnalysis();
  const finalSignal = getFinalSignal();

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Switch
              id="auto-scan"
              checked={autoScanEnabled}
              onCheckedChange={setAutoScanEnabled}
            />
            <Label htmlFor="auto-scan">סריקה אוטומטית</Label>
          </div>
          <CardTitle className="text-right">אינדיקטורים וסריקה חכמה</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        {analysisLoading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : analysisData ? (
          <Tabs defaultValue="indicators" value={activeScanTab} onValueChange={setActiveScanTab}>
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="indicators" className="flex items-center gap-1">
                <BarChartHorizontal className="h-4 w-4" />
                אינדיקטורים
              </TabsTrigger>
              <TabsTrigger value="multiTimeframe" className="flex items-center gap-1">
                <Filter className="h-4 w-4" />
                רב-טווחי
              </TabsTrigger>
              <TabsTrigger value="autoScan" className="flex items-center gap-1">
                <Scan className="h-4 w-4" />
                סריקה שבועית
              </TabsTrigger>
            </TabsList>

            <TabsContent value="indicators">
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
                  {analysisData.indicators.map((indicator: any, idx: number) => (
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
                    <div className="flex items-center gap-2">
                      <Button 
                        className="gap-2" 
                        onClick={generateSignal}
                      >
                        <Send className="h-4 w-4" />
                        שלח איתות למכשיר
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={toggleWatchlist}
                        title={watchlistEnabled ? "הסר מרשימת מעקב" : "הוסף לרשימת מעקב"}
                      >
                        {watchlistEnabled ? (
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        ) : (
                          <StarOff className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    
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
            </TabsContent>

            <TabsContent value="multiTimeframe">
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-md">
                  <h3 className="font-semibold text-lg mb-3 text-right">ניתוח רב-טווחי</h3>
                  <p className="text-sm text-right mb-4">
                    הניתוח מציג את הסיגנלים בטווחי זמן שונים כדי לספק תמונה מלאה על המגמות בנכס. 
                    איתות אופטימלי יתרחש כאשר רוב טווחי הזמן מצביעים על אותו הכיוון.
                  </p>
                  
                  <div className="space-y-2">
                    {multiTimeframeData.map((tf, idx) => (
                      <div key={idx} className="flex justify-between items-center border-b pb-2">
                        <div className="flex items-center gap-2">
                          <Badge 
                            className={
                              tf.signal === 'buy' 
                                ? 'bg-green-100 text-green-800' 
                                : tf.signal === 'sell' 
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-blue-100 text-blue-800'
                            }
                          >
                            {tf.signal === 'buy' ? 'קנייה' : tf.signal === 'sell' ? 'מכירה' : 'ניטרלי'}
                          </Badge>
                          <span className="text-sm">עוצמה: {tf.strength}/10</span>
                        </div>
                        
                        <div className="text-right">
                          <div className="font-medium">{tf.timeframe}</div>
                          <div className="text-xs text-gray-500 truncate max-w-[200px]">
                            {tf.keyIndicators.join(', ')}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* מסקנה משולבת מכל טווחי הזמן */}
                <div className="p-4 border-2 rounded-md border-primary">
                  <div className="flex justify-between mb-3">
                    <Badge 
                      className={
                        finalSignal.signal === 'buy' 
                          ? 'bg-green-100 text-green-800 text-lg p-2' 
                          : finalSignal.signal === 'sell' 
                            ? 'bg-red-100 text-red-800 text-lg p-2'
                            : 'bg-blue-100 text-blue-800 text-lg p-2'
                      }
                    >
                      {finalSignal.signal === 'buy' 
                        ? (
                          <div className="flex items-center gap-1">
                            <ArrowUp className="h-4 w-4" />
                            קנייה
                          </div>
                        ) 
                        : finalSignal.signal === 'sell' 
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
                    <h3 className="font-bold text-lg text-right">איתות משולב מכל הטווחים</h3>
                  </div>
                  
                  <p className="text-right mb-3">{finalSignal.description}</p>
                  
                  <div className="flex justify-between items-center">
                    <Badge variant="outline" className="text-lg p-2">
                      מידת ודאות: {finalSignal.confidence}%
                    </Badge>
                    <Badge variant="outline" className="text-lg p-2">
                      עוצמת איתות: {finalSignal.strength}/10
                    </Badge>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="autoScan">
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-md">
                  <div className="flex justify-between items-start">
                    <div className="flex gap-1 items-center">
                      <AlertCircle className="h-4 w-4 text-orange-500" />
                      <span className="text-xs text-orange-500">סריקה אוטומטית שבועית</span>
                    </div>
                    <h3 className="font-semibold text-lg text-right">מטבעות מומלצים למעקב</h3>
                  </div>
                  <p className="text-sm text-right mt-2 mb-4">
                    המערכת סורקת באופן אוטומטי את כלל המטבעות ומזהה הזדמנויות מסחר על בסיס הסקירות השבועיות. 
                    האיתותים מבוססים על אינטגרציה של מגוון רחב של אינדיקטורים טכניים ותבניות מחיר.
                  </p>
                  
                  <div className="space-y-3">
                    {autoScanResults.map((coin, idx) => (
                      <div key={idx} className="border rounded-md p-3">
                        <div className="flex justify-between items-start mb-2">
                          <Badge 
                            className={
                              coin.sentiment === 'buy' 
                                ? 'bg-green-100 text-green-800' 
                                : coin.sentiment === 'sell' 
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-blue-100 text-blue-800'
                            }
                          >
                            {coin.sentiment === 'buy' ? 'קנייה' : coin.sentiment === 'sell' ? 'מכירה' : 'ניטרלי'}
                            {' '}({coin.strength}/10)
                          </Badge>
                          <div className="text-right">
                            <div className="font-medium">{coin.name} ({coin.symbol})</div>
                            <div className="text-xs text-gray-500">טווח זמן: {coin.timeframe}</div>
                          </div>
                        </div>
                        <p className="text-sm text-right">{coin.reason}</p>
                        
                        <div className="flex justify-end mt-2">
                          <Button variant="outline" size="sm" className="text-xs">
                            צפה בניתוח מלא
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-center">
                  <Button className="gap-2">
                    <Scan className="h-4 w-4" />
                    סרוק שוק מחדש
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        ) : (
          <div className="text-center p-10">
            <AlertTriangle className="h-10 w-10 text-yellow-500 mx-auto mb-4" />
            <p>לא נמצאו נתוני אינדיקטורים עבור הנכס הנבחר</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TechnicalIndicators;
