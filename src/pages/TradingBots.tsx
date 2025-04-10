
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Badge } from '@/components/ui/badge';
import { ArrowUpIcon, ArrowDownIcon, BarChart3, Award, AlertTriangle, Brain, BookOpen, Activity } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { getMarketAnalyses } from '@/services/mockTradingService';

const TradingBots = () => {
  const [selectedAnalysisType, setSelectedAnalysisType] = useState<string>('technical');
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>('bitcoin');
  
  // שליפת ניתוחי שוק
  const { data: analyses, isLoading, error } = useQuery({
    queryKey: ['marketAnalyses', selectedAnalysisType, selectedAssetId],
    queryFn: () => getMarketAnalyses(selectedAssetId, selectedAnalysisType as any),
  });

  const strategyTypes = [
    { id: 'wyckoff', name: 'ניתוח וויקוף', description: 'זיהוי דפוסי אקומולציה ודיסטריביושן', icon: <BarChart3 className="h-5 w-5" /> },
    { id: 'smc', name: 'Smart Money Concept', description: 'זיהוי תנועות של השחקנים המוסדיים', icon: <Brain className="h-5 w-5" /> },
    { id: 'momentum', name: 'מומנטום', description: 'מעקב אחר תנועות מחיר חזקות', icon: <Activity className="h-5 w-5" /> },
    { id: 'support_resistance', name: 'תמיכות והתנגדויות', description: 'זיהוי רמות מחיר מרכזיות', icon: <Award className="h-5 w-5" /> },
    { id: 'fundamental', name: 'ניתוח פונדמנטלי', description: 'הערכת ערך אמיתי על בסיס נתוני יסוד', icon: <BookOpen className="h-5 w-5" /> },
  ];

  const getAnalysisColor = (sentiment: string) => {
    switch (sentiment) {
      case 'bullish': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'bearish': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'neutral': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      default: return '';
    }
  };

  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <h1 className="text-3xl font-bold mb-6 text-right">שיטות ניתוח מתקדמות</h1>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : error ? (
        <Card>
          <CardContent className="py-10 text-center">
            <AlertTriangle className="h-10 w-10 text-red-500 mx-auto mb-4" />
            <p className="text-lg font-medium">שגיאה בטעינת נתוני הניתוח</p>
            <p className="text-muted-foreground">אנא נסה שוב מאוחר יותר</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* רשימת שיטות הניתוח */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-right">שיטות ניתוח מובילות</CardTitle>
                <CardDescription className="text-right">בחר שיטת ניתוח לצפייה במידע מפורט</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-y-auto max-h-[600px]">
                  {strategyTypes.map((strategy) => (
                    <div 
                      key={strategy.id}
                      className={`p-4 border-b cursor-pointer hover:bg-muted/50 transition-colors ${
                        strategy.id === selectedAnalysisType ? 'bg-muted' : ''
                      }`}
                      onClick={() => setSelectedAnalysisType(strategy.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="p-2 bg-muted rounded-full">
                          {strategy.icon}
                        </div>
                        <div className="text-right">
                          <h3 className="font-medium">{strategy.name}</h3>
                          <p className="text-sm text-muted-foreground">{strategy.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* מידע מפורט על שיטת הניתוח הנבחרת */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-right">
                  {strategyTypes.find(s => s.id === selectedAnalysisType)?.name || 'ניתוח טכני'}
                </CardTitle>
                <CardDescription className="text-right">
                  {strategyTypes.find(s => s.id === selectedAnalysisType)?.description || 'ניתוח מגמות מחיר ונפח מסחר'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="overview">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="overview">סקירה כללית</TabsTrigger>
                    <TabsTrigger value="signals">איתותים</TabsTrigger>
                    <TabsTrigger value="examples">דוגמאות</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="overview" className="space-y-4 mt-4">
                    <div className="p-4 border rounded-md text-right">
                      {selectedAnalysisType === 'wyckoff' && (
                        <div className="space-y-4">
                          <h3 className="text-lg font-medium">מתודולוגיית וויקוף</h3>
                          <p>
                            פותחה ע"י ריצ'רד וויקוף בתחילת המאה ה-20 ומתמקדת בזיהוי 
                            פעולות של "הכסף החכם" בשוק. השיטה מחלקת את תנועת המחיר למחזורים של 
                            אקומולציה (צבירה) ודיסטריביושן (הפצה), וממקדת את הסוחר בכניסה לשוק 
                            בזמנים בהם השחקנים הגדולים פועלים.
                          </p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            <div className="p-3 border rounded-md">
                              <h4 className="font-medium">אקומולציה (צבירה)</h4>
                              <p className="text-sm">
                                שלב בו השחקנים הגדולים רוכשים נכס לאחר ירידת מחיר משמעותית.
                                סימנים: ירידה בנפח המסחר בזמן ירידות, עליה בנפח בזמן עליות קטנות.
                              </p>
                            </div>
                            <div className="p-3 border rounded-md">
                              <h4 className="font-medium">דיסטריביושן (הפצה)</h4>
                              <p className="text-sm">
                                שלב בו השחקנים הגדולים מוכרים את הנכס לציבור הרחב.
                                סימנים: ירידה בנפח המסחר בזמן עליות, עליה בנפח בזמן ירידות קטנות.
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {selectedAnalysisType === 'smc' && (
                        <div className="space-y-4">
                          <h3 className="text-lg font-medium">Smart Money Concept</h3>
                          <p>
                            שיטת ניתוח המתמקדת בזיהוי פעולות של השחקנים המוסדיים (בנקים, קרנות גידור) 
                            המהווים את "הכסף החכם". הגישה מבוססת על ההנחה שהשחקנים הגדולים מניעים את השוק 
                            ויוצרים מהלכי מחיר הניתנים לחיזוי.
                          </p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            <div className="p-3 border rounded-md">
                              <h4 className="font-medium">Order Blocks</h4>
                              <p className="text-sm">
                                אזורי מחיר בהם נעשו הזמנות גדולות על ידי השחקנים המוסדיים, 
                                ואשר המחיר נוטה לחזור אליהם בשלב מאוחר יותר.
                              </p>
                            </div>
                            <div className="p-3 border rounded-md">
                              <h4 className="font-medium">Liquidity Grabs</h4>
                              <p className="text-sm">
                                תנועות מחיר קצרות וחדות שמטרתן לגרוף נזילות (להפעיל פקודות סטופ) 
                                לפני תנועת מחיר גדולה בכיוון ההפוך.
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {selectedAnalysisType === 'momentum' && (
                        <div className="space-y-4">
                          <h3 className="text-lg font-medium">אסטרטגיית מומנטום</h3>
                          <p>
                            אסטרטגיה המבוססת על העיקרון שמחירים בתנועה חזקה ימשיכו לנוע באותו כיוון.
                            המסחר נעשה על ידי כניסה לפוזיציות בכיוון המגמה הנוכחית, בהנחה שהמומנטום יימשך.
                          </p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            <div className="p-3 border rounded-md">
                              <h4 className="font-medium">אינדיקטורים פופולריים</h4>
                              <ul className="list-disc list-inside text-sm space-y-1">
                                <li>RSI (Relative Strength Index)</li>
                                <li>MACD (Moving Average Convergence Divergence)</li>
                                <li>Stochastic Oscillator</li>
                                <li>ADX (Average Directional Index)</li>
                              </ul>
                            </div>
                            <div className="p-3 border rounded-md">
                              <h4 className="font-medium">אסטרטגיות נפוצות</h4>
                              <ul className="list-disc list-inside text-sm space-y-1">
                                <li>פריצות של רמות מחיר חשובות</li>
                                <li>חציית ממוצעים נעים</li>
                                <li>קניה בתיקונים במגמה עולה</li>
                                <li>מכירה בהתאוששויות במגמה יורדת</li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      )}

                      {selectedAnalysisType === 'support_resistance' && (
                        <div className="space-y-4">
                          <h3 className="text-lg font-medium">תמיכות והתנגדויות</h3>
                          <p>
                            שיטת ניתוח המזהה רמות מחיר שבהן יש עלייה משמעותית בהיצע (התנגדות) או בביקוש (תמיכה).
                            רמות אלו נחשבות לאזורים שבהם המחיר עשוי לשנות כיוון.
                          </p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            <div className="p-3 border rounded-md">
                              <h4 className="font-medium">סוגי רמות</h4>
                              <ul className="list-disc list-inside text-sm space-y-1">
                                <li>רמות אופקיות (שיאים ושפלים היסטוריים)</li>
                                <li>קווי מגמה (טרנדליינס)</li>
                                <li>רמות פיבונאצ'י</li>
                                <li>ממוצעים נעים</li>
                              </ul>
                            </div>
                            <div className="p-3 border rounded-md">
                              <h4 className="font-medium">אסטרטגיות נפוצות</h4>
                              <ul className="list-disc list-inside text-sm space-y-1">
                                <li>קניה בבדיקת רמת תמיכה</li>
                                <li>מכירה בבדיקת רמת התנגדות</li>
                                <li>קניה בפריצת התנגדות</li>
                                <li>מכירה בשבירת תמיכה</li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      )}

                      {selectedAnalysisType === 'fundamental' && (
                        <div className="space-y-4">
                          <h3 className="text-lg font-medium">ניתוח פונדמנטלי</h3>
                          <p>
                            שיטת ניתוח המתמקדת בהערכת הערך האמיתי של נכס על בסיס נתונים כלכליים, 
                            פיננסיים ומדדים אחרים. בניגוד לניתוח טכני, ניתוח פונדמנטלי בוחן את "איכות" הנכס 
                            ולא רק את תנועת המחיר שלו.
                          </p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            <div className="p-3 border rounded-md">
                              <h4 className="font-medium">במניות</h4>
                              <ul className="list-disc list-inside text-sm space-y-1">
                                <li>דוחות כספיים ורווחיות</li>
                                <li>מכפילי הון (P/E, P/B, P/S)</li>
                                <li>צמיחה ונתחי שוק</li>
                                <li>איכות ההנהלה ושקיפות</li>
                              </ul>
                            </div>
                            <div className="p-3 border rounded-md">
                              <h4 className="font-medium">בקריפטו</h4>
                              <ul className="list-disc list-inside text-sm space-y-1">
                                <li>מדדי רשת (נפח עסקאות, כתובות פעילות)</li>
                                <li>פיתוחים טכנולוגיים ועדכוני פרוטוקול</li>
                                <li>חדשות על שיתופי פעולה ואימוץ</li>
                                <li>ניתוח מטרות הפרויקט והיתכנותן</li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {analyses && analyses.length > 0 && (
                      <div className="mt-6">
                        <h3 className="text-lg font-medium mb-4 text-right">ניתוחים אחרונים</h3>
                        <div className="space-y-4">
                          {analyses.map((analysis) => (
                            <div key={analysis.id} className="p-4 border rounded-md">
                              <div className="flex justify-between items-start mb-2">
                                <Badge 
                                  className={getAnalysisColor(analysis.sentiment || 'neutral')}
                                >
                                  {analysis.sentiment === 'bullish' ? 'חיובי' : 
                                   analysis.sentiment === 'bearish' ? 'שלילי' : 'ניטרלי'}
                                </Badge>
                                <div className="text-right">
                                  <h4 className="font-medium">{analysis.title}</h4>
                                  <p className="text-sm text-muted-foreground">{analysis.summary}</p>
                                </div>
                              </div>
                              <Separator className="my-2" />
                              <div className="text-sm text-right">
                                <p className="mb-2">{analysis.content}</p>
                                <p className="text-muted-foreground">פורסם: {new Date(analysis.publishedAt).toLocaleDateString('he-IL')}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="signals" className="mt-4">
                    <div className="text-right">
                      <h3 className="text-lg font-medium mb-4">איתותי {strategyTypes.find(s => s.id === selectedAnalysisType)?.name}</h3>
                      <div className="space-y-4">
                        {selectedAnalysisType === 'wyckoff' && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-3 border rounded-md">
                              <h4 className="font-medium">איתותי קנייה</h4>
                              <ul className="list-disc list-inside text-sm space-y-1 mt-2">
                                <li>זיהוי Spring (מבחן אביב) - פריצה מתחת לתמיכה עם חזרה מעליה</li>
                                <li>עלייה בנפח לאחר אקומולציה ממושכת</li>
                                <li>בדיקות מוצלחות של אזור תמיכה</li>
                                <li>הופעת Sign of Strength לאחר הצבירה</li>
                              </ul>
                            </div>
                            <div className="p-3 border rounded-md">
                              <h4 className="font-medium">איתותי מכירה</h4>
                              <ul className="list-disc list-inside text-sm space-y-1 mt-2">
                                <li>זיהוי UTAD (Upthrust After Distribution) - פריצה מעל התנגדות עם נסיגה</li>
                                <li>זיהוי הפצה (דיסטריביושן) עם נפח מסחר גבוה</li>
                                <li>כישלון בפריצת התנגדות עם נפח גבוה</li>
                                <li>הופעת Sign of Weakness לאחר ההפצה</li>
                              </ul>
                            </div>
                          </div>
                        )}
                        
                        {selectedAnalysisType === 'smc' && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-3 border rounded-md">
                              <h4 className="font-medium">איתותי קנייה</h4>
                              <ul className="list-disc list-inside text-sm space-y-1 mt-2">
                                <li>חזרה ל-Bullish Order Block לאחר Liquidity Grab</li>
                                <li>יצירת אזור ביקוש (Demand Zone) חדש</li>
                                <li>פריצת Fair Value Gap (FVG) עולה</li>
                                <li>מחיר מגיע לאזור Discount בתוך מגמה עולה</li>
                              </ul>
                            </div>
                            <div className="p-3 border rounded-md">
                              <h4 className="font-medium">איתותי מכירה</h4>
                              <ul className="list-disc list-inside text-sm space-y-1 mt-2">
                                <li>מחיר מגיע ל-Bearish Order Block</li>
                                <li>יצירת אזור היצע (Supply Zone) חדש</li>
                                <li>פריצת Fair Value Gap (FVG) יורד</li>
                                <li>מחיר מגיע לאזור Premium בתוך מגמה יורדת</li>
                              </ul>
                            </div>
                          </div>
                        )}
                        
                        {(selectedAnalysisType !== 'wyckoff' && selectedAnalysisType !== 'smc') && (
                          <p className="text-muted-foreground">
                            בחר בשיטת ניתוח לצפייה באיתותים הרלוונטיים
                          </p>
                        )}
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="examples" className="mt-4">
                    <div className="text-right">
                      <h3 className="text-lg font-medium mb-4">דוגמאות מהשוק</h3>
                      <p className="mb-4">דוגמאות מחיי אמת ליישום שיטת {strategyTypes.find(s => s.id === selectedAnalysisType)?.name}</p>
                      
                      <div className="p-4 border rounded-md mb-4 bg-gray-50 dark:bg-gray-800">
                        <p className="text-sm italic">
                          דוגמאות מפורטות עם גרפים וניתוחים מעמיקים יופיעו בגרסה הבאה של המערכת.
                          המערכת תכלול מקרי בוחן מפורטים של עסקאות מוצלחות תוך שימוש בשיטות הניתוח השונות.
                        </p>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default TradingBots;
