
import React, { useState } from 'react';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import BacktestingForm from './BacktestingForm';
import BacktestResults from './BacktestResults';
import { BacktestResults as BacktestResultsType, BacktestSettings, runBacktest } from '@/services/backtestingService';

const BacktestingSystem: React.FC = () => {
  const [backtestResults, setBacktestResults] = useState<BacktestResultsType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeView, setActiveView] = useState<'form' | 'results'>('form');
  const [lastSettings, setLastSettings] = useState<BacktestSettings | null>(null);

  const handleRunBacktest = async (settings: BacktestSettings) => {
    setIsLoading(true);
    setLastSettings(settings);
    
    try {
      // Show loading toast
      const loadingToast = toast.loading('מריץ בדיקה היסטורית...', {
        description: 'מעבד נתונים ומחשב ביצועים'
      });
      
      // Run the backtest
      const results = await runBacktest(settings);
      
      // Update toast
      toast.dismiss(loadingToast);
      toast.success('בדיקה היסטורית הושלמה', {
        description: `תשואה כוללת: ${results.performance.totalReturnPercentage.toFixed(2)}%`
      });
      
      // Update state
      setBacktestResults(results);
      setActiveView('results');
    } catch (error) {
      toast.error('שגיאה בהרצת הבדיקה', {
        description: error instanceof Error ? error.message : 'אירעה שגיאה לא ידועה'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleRerun = () => {
    if (lastSettings) {
      handleRunBacktest(lastSettings);
    }
  };
  
  const handleNewBacktest = () => {
    setActiveView('form');
  };

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6 flex flex-col">
        <h1 className="text-3xl font-bold mb-2 text-right">מערכת בדיקה היסטורית</h1>
        <p className="text-muted-foreground text-right">
          בדוק את האסטרטגיה שלך על נתונים היסטוריים וקבל תובנות מפורטות לגבי הביצועים
        </p>
      </div>
      
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <Badge variant={activeView === 'form' ? 'default' : 'outline'}>
                הגדרות
              </Badge>
              <Badge 
                variant={activeView === 'results' && backtestResults ? 'default' : 'outline'}
                className={!backtestResults ? 'opacity-50' : ''}
              >
                תוצאות
              </Badge>
            </div>
            <CardTitle className="text-right">בדיקה היסטורית</CardTitle>
          </div>
          <CardDescription className="text-right pt-1">
            בדוק את האסטרטגיה שלך על נתונים היסטוריים כדי לקבל תמונה מלאה על ביצועיה
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeView} onValueChange={(value) => setActiveView(value as 'form' | 'results')}>
            <div className="flex justify-between items-center mb-4">
              <div className="flex gap-2">
                {backtestResults && activeView === 'results' && (
                  <Badge variant="outline" className="bg-blue-50 text-blue-800">
                    {backtestResults.performance.totalTrades} עסקאות
                  </Badge>
                )}
                {backtestResults && activeView === 'results' && (
                  <Badge variant={backtestResults.performance.totalReturnPercentage >= 0 ? 'default' : 'destructive'}>
                    {backtestResults.performance.totalReturnPercentage.toFixed(2)}%
                  </Badge>
                )}
              </div>
              <TabsList>
                <TabsTrigger value="form" disabled={isLoading}>
                  הגדרות
                </TabsTrigger>
                <TabsTrigger value="results" disabled={!backtestResults || isLoading}>
                  תוצאות
                </TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="form">
              <BacktestingForm onRunBacktest={handleRunBacktest} isLoading={isLoading} />
            </TabsContent>
            
            <TabsContent value="results">
              {backtestResults ? (
                <>
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex gap-2">
                      <button
                        onClick={handleRerun}
                        className="text-sm px-3 py-1 border rounded-md hover:bg-muted transition-colors"
                        disabled={isLoading}
                      >
                        הרץ שוב
                      </button>
                      <button
                        onClick={handleNewBacktest}
                        className="text-sm px-3 py-1 border rounded-md hover:bg-muted transition-colors"
                        disabled={isLoading}
                      >
                        בדיקה חדשה
                      </button>
                    </div>
                    <div className="text-right">
                      <h2 className="text-xl font-semibold">
                        תוצאות הבדיקה ההיסטורית
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        {lastSettings?.startDate} - {lastSettings?.endDate}
                      </p>
                    </div>
                  </div>
                  <Separator className="mb-6" />
                  <BacktestResults results={backtestResults} />
                </>
              ) : (
                <div className="py-12 text-center">
                  <p className="text-xl text-muted-foreground">אין תוצאות בדיקה זמינות</p>
                  <p className="mt-2 text-sm text-muted-foreground">הגדר והרץ בדיקה היסטורית כדי לראות את התוצאות</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default BacktestingSystem;
