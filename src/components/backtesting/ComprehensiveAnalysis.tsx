
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { History, TrendingUp, Timer, Lightbulb, Calendar, BarChart4 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { generateComprehensiveAnalysis } from '@/services/backtesting/realTimeAnalysis';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ComprehensiveAnalysisProps {
  assetId: string;
}

const ComprehensiveAnalysis: React.FC<ComprehensiveAnalysisProps> = ({ assetId }) => {
  const [timeframe, setTimeframe] = useState('1d');
  
  const { data: analysis, isLoading, refetch } = useQuery({
    queryKey: ['comprehensiveAnalysis', assetId, timeframe],
    queryFn: () => generateComprehensiveAnalysis(assetId, timeframe),
    refetchOnWindowFocus: false,
  });
  
  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-right">ניתוח מעמיק</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center py-10">
          <LoadingSpinner />
        </CardContent>
      </Card>
    );
  }
  
  if (!analysis) {
    return (
      <Card className="w-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-right">ניתוח מעמיק</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Button onClick={() => refetch()}>טען ניתוח</Button>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="בחר טווח זמן" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1h">שעתי</SelectItem>
              <SelectItem value="4h">4 שעות</SelectItem>
              <SelectItem value="1d">יומי</SelectItem>
              <SelectItem value="1w">שבועי</SelectItem>
              <SelectItem value="1M">חודשי</SelectItem>
            </SelectContent>
          </Select>
          <CardTitle className="text-right">ניתוח היסטורי, עכשווי ועתידי</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="current">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="historical">
              <History className="h-4 w-4 mr-2" />
              עבר
            </TabsTrigger>
            <TabsTrigger value="current">
              <TrendingUp className="h-4 w-4 mr-2" />
              הווה
            </TabsTrigger>
            <TabsTrigger value="future">
              <Timer className="h-4 w-4 mr-2" />
              עתיד
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="historical" className="text-right">
            <div className="space-y-4 mt-4">
              <div className="bg-muted p-4 rounded-lg">
                <h3 className="font-bold flex items-center justify-end mb-3">
                  <Calendar className="ml-2 h-4 w-4" />
                  אירועים מרכזיים בהיסטוריה
                </h3>
                <div className="space-y-2">
                  {analysis.historical.keyEvents.map((event, index) => (
                    <div key={index} className="flex items-center justify-between border-b pb-2">
                      <Badge variant={event.impact === 'חיובי' ? 'outline' : 'destructive'}>
                        {event.impact}
                      </Badge>
                      <div className="text-right">
                        <p>{event.event}</p>
                        <p className="text-sm text-muted-foreground">{event.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-muted p-4 rounded-lg">
                <h3 className="font-bold flex items-center justify-end mb-3">
                  <TrendingUp className="ml-2 h-4 w-4" />
                  מגמות היסטוריות
                </h3>
                <div className="space-y-2">
                  {analysis.historical.trends.map((trend, index) => (
                    <div key={index} className="flex items-center justify-between border-b pb-2">
                      <div>
                        <span className="text-sm">עוצמה: </span>
                        <span className="font-bold">{trend.strength}/10</span>
                      </div>
                      <div className="text-right">
                        <span className="font-medium">{trend.period}: </span>
                        <span>{trend.direction}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-muted p-4 rounded-lg">
                <h3 className="font-bold flex items-center justify-end mb-3">
                  <BarChart4 className="ml-2 h-4 w-4" />
                  תבניות מחזוריות
                </h3>
                <div className="space-y-2">
                  {analysis.historical.cyclicalPatterns.map((pattern, index) => (
                    <div key={index} className="border-b pb-2">
                      <p className="font-medium">{pattern.name}</p>
                      <p className="text-sm">{pattern.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="current" className="text-right">
            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted p-4 rounded-lg">
                  <h3 className="font-bold mb-3">מצב שוק נוכחי</h3>
                  <Badge
                    className={
                      analysis.current.marketCondition === 'bull'
                        ? 'bg-green-100 text-green-800'
                        : analysis.current.marketCondition === 'bear'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }
                  >
                    {analysis.current.marketCondition === 'bull'
                      ? 'שוק שורי (עולה)'
                      : analysis.current.marketCondition === 'bear'
                      ? 'שוק דובי (יורד)'
                      : 'שוק צידי (דשדוש)'}
                  </Badge>
                </div>
                
                <div className="bg-muted p-4 rounded-lg">
                  <h3 className="font-bold mb-3">ניתוח סנטימנט</h3>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="font-medium">{analysis.current.sentimentAnalysis.overall}</span>
                      <span>כללי:</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{analysis.current.sentimentAnalysis.social}</span>
                      <span>מדיה חברתית:</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{analysis.current.sentimentAnalysis.news}</span>
                      <span>חדשות:</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">{analysis.current.sentimentAnalysis.fearGreedIndex}/100</span>
                      <span>מדד פחד/חמדנות:</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-muted p-4 rounded-lg">
                <h3 className="font-bold mb-3">רמות מחיר מרכזיות</h3>
                <div className="space-y-2">
                  {analysis.current.keyLevels.map((level, index) => (
                    <div key={index} className="flex items-center justify-between border-b pb-2">
                      <Badge
                        variant={level.type === 'support' ? 'outline' : 'secondary'}
                        className={level.strength === 'strong' ? 'border-2' : ''}
                      >
                        {level.strength === 'strong' ? 'חזק' : level.strength === 'medium' ? 'בינוני' : 'חלש'}
                      </Badge>
                      <div className="text-right">
                        <span className="font-medium">{level.type === 'support' ? 'תמיכה' : 'התנגדות'}: </span>
                        <span>${level.price.toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-muted p-4 rounded-lg">
                <h3 className="font-bold mb-3">אינדיקטורים טכניים</h3>
                <div className="space-y-2">
                  {analysis.current.technicalIndicators.map((indicator, index) => (
                    <div key={index} className="flex items-center justify-between border-b pb-2">
                      <span className="text-sm">{indicator.interpretation}</span>
                      <div className="text-right">
                        <span className="font-medium">{indicator.name}: </span>
                        <span>{indicator.value}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="future" className="text-right">
            <div className="space-y-4 mt-4">
              <div className="bg-muted p-4 rounded-lg">
                <h3 className="font-bold flex items-center justify-end mb-3">
                  <Lightbulb className="ml-2 h-4 w-4" />
                  תחזית טווח קצר
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <Badge className={
                      analysis.future.shortTerm.prediction === 'עלייה'
                        ? 'bg-green-100 text-green-800'
                        : analysis.future.shortTerm.prediction === 'ירידה'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }>
                      {analysis.future.shortTerm.prediction}
                    </Badge>
                    <div>
                      <span>הערכה: </span>
                      <span className="font-bold">{analysis.future.shortTerm.confidence}% ביטחון</span>
                    </div>
                  </div>
                  
                  <div className="mt-2">
                    <h4 className="font-medium mb-1">יעדי מחיר אפשריים:</h4>
                    <div className="space-y-2">
                      {analysis.future.shortTerm.keyLevels.map((level, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span>{level.probability}%</span>
                          <span className="mx-2">סבירות:</span>
                          <span>${level.target.toLocaleString()}</span>
                          <span className="mx-2">תרחיש {level.scenario}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    <h4 className="font-medium mb-1">אירועים קרובים משמעותיים:</h4>
                    <div className="space-y-2">
                      {analysis.future.shortTerm.significantEvents.map((event, index) => (
                        <div key={index} className="flex items-center justify-between border-b pb-1">
                          <Badge variant="outline">השפעה: {event.potentialImpact}</Badge>
                          <div className="text-right">
                            <span>{event.event}</span>
                            <span className="text-sm text-muted-foreground mr-2">{event.date}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-muted p-4 rounded-lg">
                <h3 className="font-bold flex items-center justify-end mb-3">
                  <TrendingUp className="ml-2 h-4 w-4" />
                  תחזית טווח ארוך
                </h3>
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <Badge className={
                      analysis.future.longTerm.trend === 'חיובי'
                        ? 'bg-green-100 text-green-800'
                        : analysis.future.longTerm.trend === 'שלילי'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }>
                      {analysis.future.longTerm.trend}
                    </Badge>
                    <div>
                      <span>מגמה כללית: </span>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <h4 className="font-medium mb-1">גורמי מפתח:</h4>
                    <ul className="list-disc list-inside space-y-1">
                      {analysis.future.longTerm.keyFactors.map((factor, index) => (
                        <li key={index}>{factor}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">תרחישים אפשריים:</h4>
                    <div className="space-y-4">
                      {analysis.future.longTerm.scenarios.map((scenario, index) => (
                        <div key={index} className="border-r-2 pr-3 border-primary/50">
                          <p className="font-medium">{scenario.description}</p>
                          <div className="flex justify-between text-sm mt-1">
                            <span>סבירות: {scenario.probability}%</span>
                            <span>טווח זמן: {scenario.timeframe}</span>
                            <span>יעד: ${scenario.priceTarget.toLocaleString()}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ComprehensiveAnalysis;
