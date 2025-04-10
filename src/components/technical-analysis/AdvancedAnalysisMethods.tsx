
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface AdvancedAnalysisMethodsProps {
  selectedAnalysisMethod: string;
  setSelectedAnalysisMethod: (value: string) => void;
  wyckoffPatterns: any;
  smcPatterns: any;
  formatPrice: (price: number) => string;
}

const AdvancedAnalysisMethods = ({
  selectedAnalysisMethod,
  setSelectedAnalysisMethod,
  wyckoffPatterns,
  smcPatterns,
  formatPrice
}: AdvancedAnalysisMethodsProps) => {
  return (
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
                    {wyckoffPatterns.patterns.map((pattern: any, idx: number) => (
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
                    {smcPatterns.patterns.map((pattern: any, idx: number) => (
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
                  {wyckoffPatterns.patterns.map((pattern: any, idx: number) => (
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
                            {pattern.events.map((event: string, i: number) => (
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
                  {smcPatterns.patterns.map((pattern: any, idx: number) => (
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
                            {pattern.keyLevels.map((level: any, i: number) => (
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
  );
};

export default AdvancedAnalysisMethods;
