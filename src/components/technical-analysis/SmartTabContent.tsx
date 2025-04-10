
import React, { useState } from 'react';
import TradingLearningSystem from './TradingLearningSystem';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Brain, BookOpen, Target, ShieldAlert, Lightbulb, ActivitySquare } from 'lucide-react';
import { tradingApproach, riskManagementRules } from '@/services/customTradingStrategyService';
import { useQuery } from '@tanstack/react-query';
import { getTradeSignals } from '@/services/mockTradingService';

interface SmartTabContentProps {
  assetId: string;
}

const SmartTabContent: React.FC<SmartTabContentProps> = ({
  assetId,
}) => {
  const [selectedSubTab, setSelectedSubTab] = useState<string>("learning");
  
  // שליפת איתותים ספציפיים לנכס זה
  const { data: signals, isLoading: signalsLoading } = useQuery({
    queryKey: ['assetTradeSignals', assetId],
    queryFn: () => getTradeSignals(assetId),
  });
  
  return (
    <div className="space-y-6">
      <Tabs value={selectedSubTab} onValueChange={setSelectedSubTab} className="w-full">
        <TabsList className="grid grid-cols-3 w-full max-w-md mx-auto mb-4">
          <TabsTrigger value="learning" className="flex items-center gap-1">
            <Brain className="h-4 w-4" />
            מערכת למידה
          </TabsTrigger>
          <TabsTrigger value="strategy" className="flex items-center gap-1">
            <BookOpen className="h-4 w-4" />
            השיטה שלי
          </TabsTrigger>
          <TabsTrigger value="signals" className="flex items-center gap-1">
            <Target className="h-4 w-4" />
            איתותים מותאמים
          </TabsTrigger>
        </TabsList>
      
        <TabsContent value="learning">
          {/* מערכת הלמידה החכמה */}
          <TradingLearningSystem 
            assetId={assetId}
          />
        </TabsContent>
        
        <TabsContent value="strategy">
          <Card>
            <CardHeader>
              <CardTitle className="text-right text-xl">
                {tradingApproach.name}
              </CardTitle>
              <CardDescription className="text-right">
                {tradingApproach.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-bold text-right mb-2 flex items-center justify-end gap-2">
                    <ActivitySquare className="h-4 w-4" />
                    עקרונות מפתח
                  </h3>
                  <ul className="space-y-2 text-right">
                    {tradingApproach.keyPrinciples.map((principle, idx) => (
                      <li key={idx} className="flex items-center gap-2 justify-end">
                        <span>{principle}</span>
                        <span className="text-primary text-sm font-bold">{idx + 1}.</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-bold text-right mb-2 flex items-center justify-end gap-2">
                    <ShieldAlert className="h-4 w-4" />
                    כללי ניהול סיכונים
                  </h3>
                  <div className="space-y-2">
                    {riskManagementRules.map((rule) => (
                      <div key={rule.id} className="border rounded-md p-3">
                        <div className="flex items-center justify-between mb-1">
                          <Badge className={
                            rule.priority === 'critical' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' :
                            rule.priority === 'high' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300' :
                            rule.priority === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' :
                            'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                          }>
                            {rule.priority === 'critical' ? 'קריטי' : 
                             rule.priority === 'high' ? 'גבוה' : 
                             rule.priority === 'medium' ? 'בינוני' : 'נמוך'}
                          </Badge>
                          <Badge className={
                            rule.category === 'stopLoss' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' :
                            rule.category === 'positionSize' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                            rule.category === 'psychology' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300' :
                            'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
                          }>
                            {rule.category === 'stopLoss' ? 'סטופ לוס' : 
                             rule.category === 'positionSize' ? 'גודל פוזיציה' : 
                             rule.category === 'psychology' ? 'פסיכולוגיה' : 'כללי'}
                          </Badge>
                        </div>
                        <p className="text-right">{rule.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-bold text-right mb-2 flex items-center justify-end gap-2">
                    <Lightbulb className="h-4 w-4" />
                    איך לשלב בניתוח
                  </h3>
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md text-right">
                    <p className="mb-2">כדי לשלב את השיטה בניתוח הטכני:</p>
                    <ol className="list-decimal list-inside space-y-1 mr-4">
                      <li>זהה את המגמה הראשית בטווח הארוך (1D ומעלה)</li>
                      <li>אתר תבניות מחיר בטווח הבינוני (4H)</li>
                      <li>חפש נקודות כניסה בטווח הקצר (1H, 15M)</li>
                      <li>ודא התאמה בין כל טווחי הזמן</li>
                      <li>הגדר מראש סטופ לוס וגודל פוזיציה</li>
                    </ol>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="signals">
          {signalsLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : signals && signals.length > 0 ? (
            <div className="space-y-4">
              <h3 className="font-bold text-xl text-right">איתותים מותאמים לשיטת KSEM</h3>
              <div className="grid grid-cols-1 gap-4">
                {signals.map((signal) => (
                  <Card key={signal.id} className={signal.type === 'buy' ? 'border-green-200' : 'border-red-200'}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <Badge className={
                          signal.type === 'buy' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                          'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                        }>
                          {signal.type === 'buy' ? 'קנייה' : 'מכירה'}
                        </Badge>
                        <CardTitle className="text-right">
                          איתות {signal.strategy}
                        </CardTitle>
                      </div>
                      <CardDescription className="text-right">
                        טווח זמן: {signal.timeframe} | עוצמה: {signal.strength}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4 text-right">
                          <div>
                            <p className="text-sm text-muted-foreground">מחיר כניסה</p>
                            <p className="text-lg font-semibold">${signal.price.toLocaleString()}</p>
                          </div>
                          {signal.stopLoss && (
                            <div>
                              <p className="text-sm text-muted-foreground">סטופ לוס</p>
                              <p className="text-lg font-semibold text-red-600">${signal.stopLoss.toLocaleString()}</p>
                            </div>
                          )}
                          {signal.targetPrice && (
                            <div>
                              <p className="text-sm text-muted-foreground">יעד מחיר</p>
                              <p className="text-lg font-semibold text-green-600">${signal.targetPrice.toLocaleString()}</p>
                            </div>
                          )}
                          {signal.riskRewardRatio && (
                            <div>
                              <p className="text-sm text-muted-foreground">יחס סיכוי/סיכון</p>
                              <p className="text-lg font-semibold">1:{signal.riskRewardRatio}</p>
                            </div>
                          )}
                        </div>
                        
                        {signal.notes && (
                          <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md text-right">
                            <p>{signal.notes}</p>
                          </div>
                        )}
                        
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">התאמה לשיטת KSEM:</p>
                          <p className="text-primary">איתות זה תואם את עקרונות השיטה וכולל הגדרת סטופ לוס וניהול פוזיציה מדויק</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center p-10">
              <AlertTriangle className="h-10 w-10 text-yellow-500 mx-auto mb-4" />
              <p>לא נמצאו איתותים עבור נכס זה</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SmartTabContent;
