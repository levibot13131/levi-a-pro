
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { RefreshCw, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { toast } from 'sonner';

interface FearGreedData {
  value: number;
  classification: string;
  timestamp: string;
  previousValue: number;
  weekAverage: number;
  monthAverage: number;
}

const FearGreedIndex: React.FC = () => {
  const [fearGreedData, setFearGreedData] = useState<FearGreedData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<string>('');

  useEffect(() => {
    fetchFearGreedData();
    const interval = setInterval(fetchFearGreedData, 300000); // Update every 5 minutes
    return () => clearInterval(interval);
  }, []);

  const fetchFearGreedData = async () => {
    setIsLoading(true);
    try {
      // In production, this would connect to the real Fear & Greed API
      // For now, we'll simulate real-time data
      const mockData: FearGreedData = {
        value: 25 + Math.floor(Math.random() * 50), // Random between 25-75
        classification: '',
        timestamp: new Date().toISOString(),
        previousValue: 20 + Math.floor(Math.random() * 60),
        weekAverage: 30 + Math.floor(Math.random() * 40),
        monthAverage: 35 + Math.floor(Math.random() * 30)
      };

      // Determine classification
      if (mockData.value <= 25) mockData.classification = 'פחד קיצוני';
      else if (mockData.value <= 45) mockData.classification = 'פחד';
      else if (mockData.value <= 55) mockData.classification = 'ניטרלי';
      else if (mockData.value <= 75) mockData.classification = 'חמדנות';
      else mockData.classification = 'חמדנות קיצונית';

      setFearGreedData(mockData);
      setLastUpdate(new Date().toLocaleString('he-IL', { timeZone: 'Asia/Jerusalem' }));
      
    } catch (error) {
      console.error('Error fetching Fear & Greed data:', error);
      toast.error('שגיאה בטעינת מדד החמדנות/פחד');
    } finally {
      setIsLoading(false);
    }
  };

  const getColorByValue = (value: number): string => {
    if (value <= 25) return 'text-red-600 bg-red-100';
    if (value <= 45) return 'text-orange-600 bg-orange-100';
    if (value <= 55) return 'text-yellow-600 bg-yellow-100';
    if (value <= 75) return 'text-green-600 bg-green-100';
    return 'text-emerald-600 bg-emerald-100';
  };

  const getTrendIcon = (current: number, previous: number) => {
    if (current > previous) return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (current < previous) return <TrendingDown className="h-4 w-4 text-red-500" />;
    return <Minus className="h-4 w-4 text-gray-500" />;
  };

  if (isLoading && !fearGreedData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-right">מדד החמדנות/פחד</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center h-40">
            <RefreshCw className="h-8 w-8 animate-spin text-primary" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-4">
          <div className="flex justify-between items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={fetchFearGreedData}
              disabled={isLoading}
              title="רענן נתונים"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
            <CardTitle className="text-right">מדד החמדנות/פחד</CardTitle>
          </div>
          <p className="text-sm text-muted-foreground text-right">
            עודכן לאחרונה: {lastUpdate}
          </p>
        </CardHeader>
        <CardContent>
          {fearGreedData && (
            <div className="space-y-6">
              {/* Main Gauge */}
              <div className="relative flex justify-center">
                <div className="relative h-40 w-40 flex items-center justify-center rounded-full border-8 border-gray-100">
                  <div className="text-center">
                    <div className="text-4xl font-bold mb-2">{fearGreedData.value}</div>
                    <Badge className={getColorByValue(fearGreedData.value)}>
                      {fearGreedData.classification}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2">
                <Progress value={fearGreedData.value} className="h-3" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>פחד קיצוני (0)</span>
                  <span>ניטרלי (50)</span>
                  <span>חמדנות קיצונית (100)</span>
                </div>
              </div>

              {/* Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <span className="text-sm font-medium">שינוי מאתמול</span>
                      {getTrendIcon(fearGreedData.value, fearGreedData.previousValue)}
                    </div>
                    <div className="text-2xl font-bold">
                      {fearGreedData.value > fearGreedData.previousValue ? '+' : ''}
                      {fearGreedData.value - fearGreedData.previousValue}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-sm font-medium mb-2">ממוצע שבועי</div>
                    <div className="text-2xl font-bold">{fearGreedData.weekAverage}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-sm font-medium mb-2">ממוצע חודשי</div>
                    <div className="text-2xl font-bold">{fearGreedData.monthAverage}</div>
                  </CardContent>
                </Card>
              </div>

              {/* Color Scale */}
              <div className="space-y-2">
                <div className="text-sm font-medium text-right">סולם מדד החמדנות/פחד:</div>
                <div className="flex justify-between gap-1">
                  <div className="flex-1 h-8 bg-red-500 rounded-l flex items-center justify-center text-white text-xs">
                    פחד קיצוני<br/>0-25
                  </div>
                  <div className="flex-1 h-8 bg-orange-400 flex items-center justify-center text-white text-xs">
                    פחד<br/>25-45
                  </div>
                  <div className="flex-1 h-8 bg-yellow-400 flex items-center justify-center text-white text-xs">
                    ניטרלי<br/>45-55
                  </div>
                  <div className="flex-1 h-8 bg-green-500 flex items-center justify-center text-white text-xs">
                    חמדנות<br/>55-75
                  </div>
                  <div className="flex-1 h-8 bg-emerald-600 rounded-r flex items-center justify-center text-white text-xs">
                    חמדנות קיצונית<br/>75-100
                  </div>
                </div>
              </div>

              {/* Trading Insights */}
              <Card className="bg-blue-50 border-blue-200">
                <CardHeader>
                  <CardTitle className="text-right text-lg">תובנות מסחר</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-right space-y-2">
                    {fearGreedData.value <= 25 && (
                      <p className="text-sm">
                        🔴 <strong>פחד קיצוני:</strong> הזדמנות קנייה פוטנציאלית - השוק עשוי להיות במצב oversold
                      </p>
                    )}
                    {fearGreedData.value > 25 && fearGreedData.value <= 45 && (
                      <p className="text-sm">
                        🟠 <strong>פחד:</strong> זהירות - השוק עדיין חסר ביטחון אך יש סימנים לשיפור
                      </p>
                    )}
                    {fearGreedData.value > 45 && fearGreedData.value <= 55 && (
                      <p className="text-sm">
                        🟡 <strong>ניטרלי:</strong> מצב מאוזן - חכה לאישורים נוספים לפני כניסה לעסקאות
                      </p>
                    )}
                    {fearGreedData.value > 55 && fearGreedData.value <= 75 && (
                      <p className="text-sm">
                        🟢 <strong>חמדנות:</strong> השוק אופטימי - שקול כניסה לעסקאות אך היזהר מהתפתחויות
                      </p>
                    )}
                    {fearGreedData.value > 75 && (
                      <p className="text-sm">
                        🔴 <strong>חמדנות קיצונית:</strong> זהירות! השוק עשוי להיות overbought - שקול יציאה חלקית
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default FearGreedIndex;
