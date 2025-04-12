
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Info, Calculator, ShieldCheck, BookOpen } from 'lucide-react';
import OverviewTabContent from './OverviewTabContent';
import RiskCalculator from './RiskCalculator';
import TradingRules from './TradingRules';
import TradingJournal from './TradingJournal';
import { TradingPerformanceStats, TrendTradingStats } from '@/services/customTradingStrategyService';

interface RiskManagementTabsProps {
  performanceStats: TradingPerformanceStats | undefined;
  trendStats: TrendTradingStats | undefined;
}

const RiskManagementTabs = ({ performanceStats, trendStats }: RiskManagementTabsProps) => {
  const [activeTab, setActiveTab] = React.useState('overview');
  
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="w-full grid grid-cols-4">
        <TabsTrigger value="overview" className="flex items-center gap-1">
          <Info className="h-4 w-4 ml-1" />
          סקירה כללית
        </TabsTrigger>
        <TabsTrigger value="calculator" className="flex items-center gap-1">
          <Calculator className="h-4 w-4 ml-1" />
          מחשבון סיכונים Levi
        </TabsTrigger>
        <TabsTrigger value="rules" className="flex items-center gap-1">
          <ShieldCheck className="h-4 w-4 ml-1" />
          כללי מסחר Levi
        </TabsTrigger>
        <TabsTrigger value="journal" className="flex items-center gap-1">
          <BookOpen className="h-4 w-4 ml-1" />
          יומן מסחר
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="overview">
        <OverviewTabContent 
          performanceStats={performanceStats} 
          trendStats={trendStats} 
        />
      </TabsContent>
      
      <TabsContent value="calculator" className="mt-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-7">
            <RiskCalculator accountSize={100000} />
          </div>
          <div className="md:col-span-5">
            <Card>
              <CardHeader>
                <CardTitle className="text-right">הסבר מחשבון הסיכונים של Levi Bot</CardTitle>
              </CardHeader>
              <CardContent className="text-right">
                <p className="mb-4">
                  מחשבון זה מבוסס על נוסחת החישוב של אסטרטגיית המסחר של Levi Bot:
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
                    בהתאם לאסטרטגיית הסיכונים של Levi Bot.
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
  );
};

export default RiskManagementTabs;
