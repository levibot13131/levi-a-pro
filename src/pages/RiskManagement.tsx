
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  Calculator, ShieldCheck, BookOpen, TrendingUp, 
  BarChart, Info, AlertTriangle, BookMarked 
} from 'lucide-react';
import RiskCalculator from '@/components/risk-management/RiskCalculator';
import TradingRules from '@/components/risk-management/TradingRules';
import TradingJournal from '@/components/risk-management/TradingJournal';
import { useQuery } from '@tanstack/react-query';
import { getTradingPerformanceStats, getTrendTradingStats } from '@/services/customTradingStrategyService';
import { tradingApproach } from '@/services/customTradingStrategyService';
import MainNavigation from '@/components/MainNavigation';

const StatsCard = ({ title, value, icon, description }: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description?: string;
}) => (
  <Card>
    <CardContent className="p-4">
      <div className="flex justify-between items-start">
        <div className="mt-1">{icon}</div>
        <div className="text-right">
          <h3 className="font-medium text-muted-foreground">{title}</h3>
          <div className="text-2xl font-bold mt-1">{value}</div>
          {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
        </div>
      </div>
    </CardContent>
  </Card>
);

const RiskManagement = () => {
  const [activeTab, setActiveTab] = useState('overview');
  
  const { data: performanceStats } = useQuery({
    queryKey: ['tradingPerformanceStats'],
    queryFn: () => getTradingPerformanceStats(),
  });
  
  const { data: trendStats } = useQuery({
    queryKey: ['trendTradingStats'],
    queryFn: () => getTrendTradingStats(),
  });
  
  return (
    <div>
      <MainNavigation />
      
      <div className="container mx-auto py-6 px-4 md:px-6">
        <h1 className="text-3xl font-bold mb-6 text-right">ניהול סיכונים</h1>
        
        <div className="mb-6">
          <Alert className="bg-blue-50 border-blue-300 text-right">
            <AlertTitle className="flex justify-end items-center">
              <span>אסטרטגיית מסחר KSM</span>
              <BookMarked className="h-5 w-5 ml-2" />
            </AlertTitle>
            <AlertDescription className="text-right">
              <p className="mb-2">{tradingApproach.description}</p>
              <ul className="list-disc mr-5 space-y-1">
                {tradingApproach.keyPrinciples.slice(0, 3).map((principle, idx) => (
                  <li key={idx}>{principle}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full grid grid-cols-4">
            <TabsTrigger value="overview" className="flex items-center gap-1">
              <Info className="h-4 w-4 ml-1" />
              סקירה כללית
            </TabsTrigger>
            <TabsTrigger value="calculator" className="flex items-center gap-1">
              <Calculator className="h-4 w-4 ml-1" />
              מחשבון סיכונים
            </TabsTrigger>
            <TabsTrigger value="rules" className="flex items-center gap-1">
              <ShieldCheck className="h-4 w-4 ml-1" />
              כללי מסחר
            </TabsTrigger>
            <TabsTrigger value="journal" className="flex items-center gap-1">
              <BookOpen className="h-4 w-4 ml-1" />
              יומן מסחר
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {performanceStats && (
                <>
                  <StatsCard
                    title="אחוז הצלחה"
                    value={`${performanceStats.winRate}%`}
                    icon={<TrendingUp className="h-6 w-6 text-green-500" />}
                    description="אחוז העסקאות המוצלחות מתוך סך העסקאות"
                  />
                  <StatsCard
                    title="יחס רווח:הפסד"
                    value={performanceStats.profitFactor.toFixed(2)}
                    icon={<BarChart className="h-6 w-6 text-blue-500" />}
                    description="היחס בין סך הרווחים לסך ההפסדים"
                  />
                  <StatsCard
                    title="דראודאון מקסימלי"
                    value={`${performanceStats.maxDrawdown}%`}
                    icon={<AlertTriangle className="h-6 w-6 text-red-500" />}
                    description="ירידה מקסימלית בהון"
                  />
                </>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-right">עקרונות ניהול הסיכונים</CardTitle>
                </CardHeader>
                <CardContent className="text-right">
                  <ul className="list-disc space-y-2 mr-5">
                    {tradingApproach.keyPrinciples.map((principle, idx) => (
                      <li key={idx}>{principle}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
              
              {trendStats && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-right">סטטיסטיקות תבנית קסם</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4 text-right">
                      <p className="mb-4">
                        אסטרטגיית "קסם" מתמקדת בזיהוי תבניות מחיר יעילות עם יחס סיכוי:סיכון גבוה.
                        הנתונים שלהלן מייצגים את שיעורי ההצלחה של התבנית בנקודות היעד השונות:
                      </p>
                      
                      <div className="space-y-3">
                        <div className="flex items-center">
                          <div className="w-full bg-gray-200 rounded-full h-4">
                            <div 
                              className="bg-green-500 h-4 rounded-full" 
                              style={{ width: `${trendStats.firstTargetSuccessRate}%` }}
                            ></div>
                          </div>
                          <div className="min-w-[100px] pr-3 text-right">
                            יעד ראשון: {trendStats.firstTargetSuccessRate}%
                          </div>
                        </div>
                        
                        <div className="flex items-center">
                          <div className="w-full bg-gray-200 rounded-full h-4">
                            <div 
                              className="bg-blue-500 h-4 rounded-full" 
                              style={{ width: `${trendStats.secondTargetSuccessRate}%` }}
                            ></div>
                          </div>
                          <div className="min-w-[100px] pr-3 text-right">
                            יעד שני: {trendStats.secondTargetSuccessRate}%
                          </div>
                        </div>
                        
                        <div className="flex items-center">
                          <div className="w-full bg-gray-200 rounded-full h-4">
                            <div 
                              className="bg-purple-500 h-4 rounded-full" 
                              style={{ width: `${trendStats.thirdTargetSuccessRate}%` }}
                            ></div>
                          </div>
                          <div className="min-w-[100px] pr-3 text-right">
                            יעד שלישי: {trendStats.thirdTargetSuccessRate}%
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-4 text-sm">
                        <p>
                          <strong>המלצת מערכת:</strong> בהתאם לסטטיסטיקות אלו, מומלץ לממש 25% מהפוזיציה ביעד הראשון
                          ובין 25%-50% ביעד השני. מימוש מדורג יאפשר לך ליהנות מאחוזי ההצלחה הגבוהים יותר בשלבים הראשונים
                          של העסקה, תוך שמירה על פוטנציאל לרווח גדול יותר.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="calculator" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              <div className="md:col-span-7">
                <RiskCalculator accountSize={100000} />
              </div>
              <div className="md:col-span-5">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-right">הסבר מחשבון הסיכונים</CardTitle>
                  </CardHeader>
                  <CardContent className="text-right">
                    <p className="mb-4">
                      מחשבון זה מבוסס על נוסחת החישוב של אסטרטגיית המסחר שלך:
                    </p>
                    
                    <div className="space-y-3 mb-4 font-mono text-sm border-y py-3">
                      <div className="grid grid-cols-2 gap-1">
                        <div className="text-gray-500">גודל התיק =</div>
                        <div>C</div>
                      </div>
                      <div className="grid grid-cols-2 gap-1">
                        <div className="text-gray-500">אחוז סיכון מקסימלי מוגדר =</div>
                        <div>B</div>
                      </div>
                      <div className="grid grid-cols-2 gap-1">
                        <div className="text-gray-500">סכום סיכון מקסימלי =</div>
                        <div>A = B * C</div>
                      </div>
                      <div className="grid grid-cols-2 gap-1">
                        <div className="text-gray-500">אחוז סיכון בתבנית =</div>
                        <div>Z</div>
                      </div>
                      <div className="grid grid-cols-2 gap-1">
                        <div className="text-gray-500">מכפלת ההמרה =</div>
                        <div>Y = 100 / Z</div>
                      </div>
                      <div className="grid grid-cols-2 gap-1">
                        <div className="text-gray-500">גודל הפוזיציה =</div>
                        <div>X = A * Y</div>
                      </div>
                    </div>
                    
                    <div className="text-sm space-y-2">
                      <p>
                        <strong>דוגמה:</strong> עבור תיק בגודל 100,000 ש"ח עם סיכון של 1% לעסקה,
                        סכום הסיכון המקסימלי הוא 1,000 ש"ח.
                      </p>
                      <p>
                        אם ההפרש בין מחיר הכניסה לסטופ לוס הוא 5%, גודל הפוזיציה המחושב יהיה
                        1,000 ש"ח * (100/5) = 20,000 ש"ח.
                      </p>
                      <p>
                        <strong>חשוב:</strong> הקפד תמיד על סיכון מקסימלי של 1% מהתיק לעסקה בודדת,
                        בהתאם לאסטרטגיית הסיכונים שלך.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="rules" className="mt-6">
            <TradingRules showDetails={true} />
          </TabsContent>
          
          <TabsContent value="journal" className="mt-6">
            <TradingJournal />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default RiskManagement;
