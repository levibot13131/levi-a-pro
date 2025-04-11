
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ActivitySquare, BarChart3, Landmark, TrendingUp, Calendar } from 'lucide-react';

interface ComprehensiveTabProps {
  technicalAnalysis: any;
  wyckoffPatterns: any;
  smcPatterns: any;
  whaleMovements: any;
  whaleBehavior: any;
  newsItems: any;
}

const ComprehensiveTab: React.FC<ComprehensiveTabProps> = ({
  technicalAnalysis,
  wyckoffPatterns,
  smcPatterns,
  whaleMovements,
  whaleBehavior,
  newsItems
}) => {
  const analysisLoading = !technicalAnalysis;
  const wyckoffLoading = !wyckoffPatterns;
  const smcLoading = !smcPatterns;
  const whaleLoading = !whaleMovements;

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Technical Analysis Summary */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-right flex items-center justify-between">
              <ActivitySquare className="h-5 w-5" />
              <div>ניתוח טכני</div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {analysisLoading ? (
              <div className="text-center py-4">טוען נתונים...</div>
            ) : technicalAnalysis ? (
              <div className="text-right">
                <div className="flex justify-between items-center mb-4">
                  <Badge 
                    variant={technicalAnalysis.overallSignal === 'buy' ? 'default' : 
                            technicalAnalysis.overallSignal === 'sell' ? 'destructive' : 'outline'}
                    className={technicalAnalysis.overallSignal === 'buy' ? 'bg-green-500' : 
                              technicalAnalysis.overallSignal === 'sell' ? 'bg-red-500' : 'bg-gray-500'}
                  >
                    {technicalAnalysis.overallSignal === 'buy' ? 'קנייה' : 
                     technicalAnalysis.overallSignal === 'sell' ? 'מכירה' : 'ניטרלי'}
                    {' '}({technicalAnalysis.signalStrength}/10)
                  </Badge>
                  <h3 className="text-lg font-semibold">סיגנל מסחר</h3>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium">אינדיקטורים עיקריים:</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {technicalAnalysis.indicators.slice(0, 4).map((indicator: any, index: number) => (
                      <div key={index} className="border rounded p-2 text-sm">
                        <div className="flex justify-between">
                          <Badge 
                            variant={indicator.signal === 'buy' ? 'default' : 
                                   indicator.signal === 'sell' ? 'destructive' : 'outline'}
                            className={indicator.signal === 'buy' ? 'bg-green-500' : 
                                     indicator.signal === 'sell' ? 'bg-red-500' : 'bg-gray-500'}
                          >
                            {indicator.signal === 'buy' ? 'קנייה' : 
                             indicator.signal === 'sell' ? 'מכירה' : 'ניטרלי'}
                          </Badge>
                          <div className="font-medium">{indicator.name}</div>
                        </div>
                        <div className="mt-1 text-xs text-gray-500">{indicator.value}</div>
                      </div>
                    ))}
                  </div>
                  
                  <p className="text-sm mt-4">{technicalAnalysis.conclusion}</p>
                </div>
              </div>
            ) : null}
          </CardContent>
        </Card>
        
        {/* Advanced Pattern Analysis */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-right flex items-center justify-between">
              <TrendingUp className="h-5 w-5" />
              <div>תבניות מתקדמות</div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-right">
              {/* Wyckoff Analysis */}
              <div className="mb-4">
                <h3 className="text-lg font-semibold mb-2">וויקוף</h3>
                {wyckoffLoading ? (
                  <div className="text-center py-2">טוען נתונים...</div>
                ) : wyckoffPatterns && wyckoffPatterns.phase ? (
                  <div>
                    <Badge 
                      variant={wyckoffPatterns.phase.includes('אקומולציה') ? 'default' : 'destructive'}
                      className={wyckoffPatterns.phase.includes('אקומולציה') ? 'bg-green-500' : 'bg-red-500'}
                    >
                      {wyckoffPatterns.phase}
                    </Badge>
                    <p className="text-sm mt-2">{wyckoffPatterns.patterns?.[0]?.description || 'אין תבניות ספציפיות'}</p>
                  </div>
                ) : (
                  <p className="text-sm">לא זוהו תבניות וויקוף משמעותיות</p>
                )}
              </div>
              
              <Separator className="my-4" />
              
              {/* SMC Analysis */}
              <div>
                <h3 className="text-lg font-semibold mb-2">SMC (Smart Money Concept)</h3>
                {smcLoading ? (
                  <div className="text-center py-2">טוען נתונים...</div>
                ) : smcPatterns && smcPatterns.patterns && smcPatterns.patterns.length > 0 ? (
                  <div>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {smcPatterns.patterns.map((pattern: any, idx: number) => (
                        <Badge 
                          key={idx} 
                          variant={pattern.bias === 'bullish' ? 'default' : 'destructive'}
                          className={pattern.bias === 'bullish' ? 'bg-green-500' : 'bg-red-500'}
                        >
                          {pattern.name}
                        </Badge>
                      ))}
                    </div>
                    <p className="text-sm mt-2">{smcPatterns.patterns[0].description}</p>
                  </div>
                ) : (
                  <p className="text-sm">לא זוהו תבניות SMC משמעותיות</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Whale Activity */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-right flex items-center justify-between">
              <BarChart3 className="h-5 w-5" />
              <div>תנועות ארנקים</div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-right">
              {whaleLoading ? (
                <div className="text-center py-4">טוען נתונים...</div>
              ) : whaleMovements && whaleMovements.length > 0 ? (
                <div>
                  <h3 className="font-semibold mb-2">תנועות אחרונות</h3>
                  <div className="space-y-2 max-h-[200px] overflow-y-auto">
                    {whaleMovements.slice(0, 3).map((movement: any) => (
                      <div key={movement.id} className="border rounded-lg p-2 text-right text-sm">
                        <div className="flex justify-between items-start">
                          <Badge 
                            variant={movement.impact?.significance === 'very-high' ? 'destructive' :
                                   movement.impact?.significance === 'high' ? 'destructive' : 'outline'}
                            className={movement.impact?.significance === 'very-high' ? 'bg-red-500' :
                                     movement.impact?.significance === 'high' ? 'bg-orange-500' : 'bg-yellow-500'}
                          >
                            {movement.impact?.significance === 'very-high' ? 'משמעותי מאוד' :
                             movement.impact?.significance === 'high' ? 'משמעותי' : 'בינוני'}
                          </Badge>
                          <div>
                            {movement.transactionType === 'buy' ? 'קנייה' : 
                             movement.transactionType === 'sell' ? 'מכירה' : 'העברה'}
                            {' '}{new Date(movement.timestamp).toLocaleDateString('he-IL')}
                          </div>
                        </div>
                        <div className="mt-1">
                          <p>סכום: {movement.amount >= 1000000 ? 
                            `$${(movement.amount / 1000000).toFixed(2)}M` : 
                            `$${(movement.amount / 1000).toFixed(0)}K`}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {whaleBehavior && whaleBehavior.length > 0 && (
                    <div className="mt-4">
                      <h3 className="font-semibold mb-2">דפוסים זוהו</h3>
                      <Badge 
                        variant={whaleBehavior[0].priceImpact?.includes('+') ? 'default' : 'destructive'}
                        className={whaleBehavior[0].priceImpact?.includes('+') ? 'bg-green-500' : 'bg-red-500'}
                      >
                        {whaleBehavior[0].pattern}
                      </Badge>
                      <p className="text-sm mt-2">{whaleBehavior[0].description}</p>
                    </div>
                  )}
                </div>
              ) : (
                <p>לא נמצאו תנועות ארנקים גדולים בטווח הזמן שנבחר</p>
              )}
            </div>
          </CardContent>
        </Card>
        
        {/* Fundamental Analysis */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-right flex items-center justify-between">
              <Landmark className="h-5 w-5" />
              <div>ניתוח פונדמנטלי</div>
            </CardTitle>
          </CardHeader>
          <CardContent className="text-right">
            {newsItems && newsItems.length > 0 ? (
              <div>
                <h3 className="font-semibold mb-2">חדשות אחרונות</h3>
                <div className="space-y-2">
                  {newsItems.slice(0, 2).map((news: any) => (
                    <div key={news.id} className="border rounded-lg p-2">
                      <div className="flex justify-between items-start">
                        <Badge 
                          variant={
                            news.sentiment === 'positive' ? 'default' : 
                            news.sentiment === 'negative' ? 'destructive' : 'outline'
                          }
                          className={
                            news.sentiment === 'positive' ? 'bg-green-500' : 
                            news.sentiment === 'negative' ? 'bg-red-500' : 'bg-gray-500'
                          }
                        >
                          {news.sentiment === 'positive' ? 'חיובי' : 
                           news.sentiment === 'negative' ? 'שלילי' : 'ניטרלי'}
                        </Badge>
                        <h4 className="font-medium">{news.title}</h4>
                      </div>
                      <p className="text-sm mt-1">{news.summary}</p>
                      <div className="text-xs text-gray-500 mt-1">
                        {news.source} | {new Date(news.publishedAt).toLocaleDateString('he-IL')}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4">
                  <h3 className="font-semibold mb-2">אירועים קרובים</h3>
                  <div className="flex items-center border rounded-lg p-2">
                    <Calendar className="h-4 w-4 ml-2" />
                    <div>
                      <div className="font-medium">הכרזת ריבית הפד הבאה</div>
                      <div className="text-sm text-gray-500">עוד 12 ימים</div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <p>אין נתונים פונדמנטליים זמינים</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ComprehensiveTab;
