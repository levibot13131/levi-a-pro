
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { TrendingUp, BarChart, AlertTriangle, BookMarked } from 'lucide-react';
import { StatsCard } from './StatsCard';
import { TradingPerformanceStats, TrendTradingStats, tradingApproach } from '@/services/customTradingStrategyService';

interface OverviewTabContentProps {
  performanceStats: TradingPerformanceStats | undefined;
  trendStats: TrendTradingStats | undefined;
}

const OverviewTabContent = ({ performanceStats, trendStats }: OverviewTabContentProps) => {
  return (
    <div className="mt-6">
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
    </div>
  );
};

export default OverviewTabContent;
